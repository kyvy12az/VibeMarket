import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    Fragment,
} from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import ChatInfoSidebar from "@/components/chat/ChatInfoSidebar";
import CallModal from "@/components/chat/CallModal";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

interface Participant {
    id: number;
    name: string;
    avatar?: string;
}

import {
    Search,
    Send,
    Video,
    MoreVertical,
    Paperclip,
    Smile,
    Check,
    CheckCheck,
    ArrowLeft,
    Image,
    Mic,
    X,
    FileText,
    Download,
    Play,
    Headphones,
    Archive,
    Users,
    UserPlus,
    Home,
    MessageCircle,
    Phone,
    Store,
    ShoppingBag,
    Package,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";
import {
    Conversation,
    Message,
    User,
    ConversationsResponse,
    MessagesResponse,
    UploadedFile,
    UploadResponse,
} from "../types/chat";

const ShopChat: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { shopId } = useParams<{ shopId?: string }>();
    const location = useLocation();
    const navigationState = location.state as { selectedConversationId?: number; sellerId?: number } | null;

    // State
    const [isMobile, setIsMobile] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] =
        useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
    const [showChatInfo, setShowChatInfo] = useState(false);

    // Call modal states
    const [showCallModal, setShowCallModal] = useState(false);
    const [callModalType, setCallModalType] = useState<'incoming' | 'outgoing'>('incoming');
    const [currentCallData, setCurrentCallData] = useState<{
        callId: string;
        conversationId?: number;
        callerName?: string;
        callerAvatar?: string;
        callType: 'voice' | 'video';
        participants?: Participant[];
        timestamp?: string;
    } | null>(null);

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);
    const pendingMessages = useRef<Map<string, Message>>(new Map());
    const shouldAutoScroll = useRef(true);
    const lastSendAtRef = useRef<Map<number, number>>(new Map());
    const currentConversationIdRef = useRef<number | null>(null);
    const incomingCallAudioRef = useRef<HTMLAudioElement | null>(null);

    // helper lấy token
    const getToken = () => {
        const candidates = [
            localStorage.getItem("vibeventure_token"),
            localStorage.getItem("token"),
            sessionStorage.getItem("vibeventure_token"),
            sessionStorage.getItem("token"),
        ];
        for (const c of candidates) {
            if (c) {
                return c.startsWith("Bearer ") ? c.slice(7) : c;
            }
        }
        const m = document.cookie.match(/(?:^|; )(?:vibeventure_token|token)=([^;]+)/);
        if (m) {
            const token = decodeURIComponent(m[1]);
            return token.startsWith("Bearer ") ? token.slice(7) : token;
        }
        return null;
    };

    const handleConversationUpdate = (updatedConversation: Conversation) => {
        setSelectedConversation(updatedConversation);
        setConversations(prev =>
            prev.map(conv =>
                conv.id === updatedConversation.id
                    ? { ...conv, ...updatedConversation }
                    : conv
            )
        );
    };

    // Fetch shop conversations only
    const fetchConversations = async () => {
        try {
            const token = getToken();
            if (!token) {
                console.error("No token found");
                return;
            }

            // Fetch only shop conversations
            const url = shopId 
                ? `${import.meta.env.VITE_BACKEND_URL}/api/chat/conversations.php?category=shop&seller_id=${shopId}`
                : `${import.meta.env.VITE_BACKEND_URL}/api/chat/conversations.php?category=shop`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Fetch conversations error:", errorData);
                throw new Error(errorData.message || 'Failed to fetch conversations');
            }

            const data: ConversationsResponse = await response.json();
            if (data.success) {
                setConversations(data.data);
                
                // Priority 1: Auto-select from navigation state (from OrderDetail)
                if (navigationState?.selectedConversationId && data.data.length > 0) {
                    const conv = data.data.find((c: any) => c.id === navigationState.selectedConversationId);
                    if (conv) {
                        handleConversationSelect(conv);
                        // Clear state after using
                        navigate(location.pathname, { replace: true, state: null });
                        return;
                    }
                }
                
                // Priority 2: Auto-select conversation if shopId is provided in URL
                if (shopId && data.data.length > 0) {
                    const shopConv = data.data.find((conv: any) => 
                        conv.seller_id === parseInt(shopId) || 
                        conv.seller_user_id === parseInt(shopId) ||
                        conv.participants.some((p: any) => p.id === parseInt(shopId))
                    );
                    if (shopConv) {
                        handleConversationSelect(shopConv);
                    }
                }
            }
        } catch (error: any) {
            console.error("Error fetching conversations:", error);
            toast.error(error.message || "Không thể tải cuộc trò chuyện");
        } finally {
            setIsLoading(false);
        }
    };

    // Socket initialization (same as Messages.tsx but filtered for shop)
    const initializeSocket = useCallback(() => {
        const token = getToken();
        if (!token || !user) return;
        if (socketRef.current) socketRef.current.disconnect();

        socketRef.current = io(`${import.meta.env.VITE_BACKEND_WS_URL}`, {
            auth: { token },
            transports: ["websocket"],
        });

        const socket = socketRef.current;

        socket.on("connect", () => {
            socket.emit("get_online_users");
        });

        socket.on("disconnect", () => {
            setTimeout(() => {
                if (!socketRef.current?.connected) {
                    initializeSocket();
                }
            }, 3000);
        });

        socket.on("new_message", (message: Message) => {
            try {
                const processed: any = {
                    ...message,
                    fileUrl: (message as any).file_url || (message as any).fileUrl || null,
                    id: message.id || null,
                    tempId: (message as any).tempId || (message as any).temp_id || null,
                };

                const messageConvId = (message as any).conversationId || (message as any).conversation_id;

                if (messageConvId && selectedConversation?.id) {
                    if (messageConvId !== selectedConversation.id && messageConvId !== currentConversationIdRef.current) {
                        return;
                    }
                }

                if (processed.tempId && pendingMessages.current.has(processed.tempId)) {
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.tempId === processed.tempId
                                ? { ...processed, isPending: false }
                                : m
                        )
                    );
                    pendingMessages.current.delete(processed.tempId);
                    fetchConversations();
                    return;
                }

                const existsById = (msgs: Message[]) =>
                    msgs.some(m => (m.id && processed.id && m.id === processed.id));
                const existsByTempId = (msgs: Message[]) =>
                    msgs.some(m => (m.tempId && processed.tempId && m.tempId === processed.tempId));

                setMessages((prev) => {
                    if (existsById(prev) || existsByTempId(prev)) {
                        return prev;
                    }
                    return [...prev, { ...processed, id: processed.id || Date.now() }];
                });

                fetchConversations();
            } catch (err) {
                console.error("new_message handler error:", err);
            }
        });

        socket.on("message_saved", (savedMessage: Message) => {
            if (savedMessage.tempId && pendingMessages.current.has(savedMessage.tempId)) {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.tempId === savedMessage.tempId
                            ? {
                                ...savedMessage,
                                isPending: false,
                                id: savedMessage.id || msg.id,
                                fileUrl: savedMessage.file_url || savedMessage.fileUrl,
                            }
                            : msg
                    )
                );
                pendingMessages.current.delete(savedMessage.tempId);
            } else {
                setMessages((prev) => {
                    const exists = prev.some(
                        (msg) =>
                            msg.id === savedMessage.id || msg.tempId === savedMessage.tempId
                    );
                    return !exists
                        ? [
                            ...prev,
                            {
                                ...savedMessage,
                                isPending: false,
                                fileUrl: savedMessage.file_url || savedMessage.fileUrl,
                            },
                        ]
                        : prev;
                });
            }
            fetchConversations();
        });

        socket.on("users_online", (userIds: number[]) => setOnlineUsers(userIds));
        socket.on("connect_error", (error) => {
            toast.error("Lỗi kết nối máy chủ. Đang kết nối lại...");
            console.error("Socket connection error:", error);
        });

        return socket;
    }, [user]);

    // Fetch messages (same logic)
    const isFetchingMessagesRef = useRef<boolean>(false);
    const fetchMessagesAbortControllerRef = useRef<AbortController | null>(null);

    const fetchMessages = async (conversationId: number, page = 1) => {
        if (fetchMessagesAbortControllerRef.current) {
            fetchMessagesAbortControllerRef.current.abort();
        }

        if (isFetchingMessagesRef.current) {
            console.log("Already fetching messages, skipping...");
            return;
        }

        try {
            isFetchingMessagesRef.current = true;
            setMessages([]);
            setIsLoadingMessages(true);
            currentConversationIdRef.current = conversationId;

            const token = getToken();
            if (!token) {
                console.error("No token found");
                setIsLoadingMessages(false);
                isFetchingMessagesRef.current = false;
                return;
            }

            fetchMessagesAbortControllerRef.current = new AbortController();

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/chat/messages.php?conversation_id=${conversationId}&page=${page}&limit=50`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    signal: fetchMessagesAbortControllerRef.current.signal
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Fetch messages error:", errorData);
                throw new Error(errorData.message || 'Failed to fetch messages');
            }

            const data: MessagesResponse = await response.json();

            if (currentConversationIdRef.current === conversationId) {
                if (data.success) {
                    setMessages(data.data || []);
                    setTimeout(() => scrollToBottom(true), 100);
                }
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted');
                return;
            }
            console.error("Fetch messages error:", error);
            toast.error("Không thể tải tin nhắn: " + (error.message || error));
        } finally {
            if (currentConversationIdRef.current === conversationId) {
                setIsLoadingMessages(false);
            }
            isFetchingMessagesRef.current = false;
            fetchMessagesAbortControllerRef.current = null;
        }
    };

    // Send message
    const sendMessage = async (
        content: string,
        type: "video" | "text" | "image" | "file" = "text",
        fileData?: UploadedFile
    ) => {
        if (!selectedConversation || !user || !socketRef.current) return;

        const convId = selectedConversation.id;
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const tempMessage: Message = {
            tempId,
            senderId: Number(user.id),
            conversationId: convId,
            content,
            type,
            file_url: fileData?.file_url,
            fileUrl: fileData?.file_url,
            thumbnail_url: fileData?.thumbnail_url,
            file_type: fileData?.file_type,
            file_size: fileData?.file_size,
            original_name: fileData?.original_name,
            timestamp: new Date().toISOString(),
            isPending: true,
            isRead: false,
            sender: {
                id: Number(user.id),
                name: user.name,
                avatar: user.avatar || "/images/avatars/Avt-Default.png",
            },
        };

        if (currentConversationIdRef.current === convId) {
            setMessages((prev) => [...prev, tempMessage]);
            pendingMessages.current.set(tempId, tempMessage);
        }

        socketRef.current.emit("send_message", {
            conversationId: convId,
            content,
            type,
            fileData,
            tempId,
        });

        try {
            const token = getToken();
            if (!token) throw new Error("Missing auth token");

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/chat/messages.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        conversation_id: convId,
                        content,
                        type,
                        file_url: fileData?.file_url,
                        temp_id: tempId,
                    }),
                }
            );

            const data = await response.json();

            if (data.success && currentConversationIdRef.current === convId) {
                if (data.data) {
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.tempId === tempId
                                ? {
                                    ...data.data,
                                    isPending: false,
                                    fileUrl: data.data.file_url || data.data.fileUrl,
                                }
                                : msg
                        )
                    );
                }
                pendingMessages.current.delete(tempId);
            }
        } catch (err: any) {
            console.error("Send message error:", err);
            toast.error("Không thể gửi tin nhắn: " + (err?.message || err));
        }
    };

    // Upload files
    const uploadFiles = async (files: FileList): Promise<UploadedFile[]> => {
        try {
            const token = getToken();
            if (!token) throw new Error("No auth token");

            const formData = new FormData();
            Array.from(files).forEach((file) => formData.append(`files[]`, file));

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/chat/upload.php`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                }
            );

            const data: UploadResponse = await response.json();
            if (data.success && data.data) {
                toast.success("Tải file thành công");
                return data.data;
            } else {
                throw new Error(data.message || "Gửi thất bại");
            }
        } catch (error) {
            toast.error("Error uploading files: " + error);
            throw error;
        }
    };

    const joinConversation = useCallback((conversationId: number) => {
        if (socketRef.current)
            socketRef.current.emit("join_conversation", conversationId);
    }, []);

    const leaveConversation = useCallback((conversationId: number) => {
        if (socketRef.current)
            socketRef.current.emit("leave_conversation", conversationId);
    }, []);

    const scrollToBottom = useCallback((force = false) => {
        if (messagesEndRef.current && (shouldAutoScroll.current || force)) {
            messagesEndRef.current.scrollIntoView({
                behavior: force ? "auto" : "smooth",
                block: "end",
            });
        }
    }, []);

    const resolveUrl = (p?: string | null) => {
        if (!p) return "";
        if (/^https?:\/\//i.test(p)) return p;
        return `${import.meta.env.VITE_BACKEND_URL}/${p.replace(/^\/+/, "")}`;
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getFileIcon = (fileType: string) => {
        switch (fileType) {
            case "image":
                return <Image size={16} className="text-primary" />;
            case "video":
                return <Play size={16} className="text-primary" />;
            case "audio":
                return <Headphones size={16} className="text-primary" />;
            case "document":
                return <FileText size={16} className="text-primary" />;
            case "archive":
                return <Archive size={16} className="text-primary" />;
            default:
                return <Paperclip size={16} className="text-muted-foreground" />;
        }
    };

    const getMessageColors = (conversation?: Conversation) => {
        if (!conversation) {
            return {
                messageColor: '#667eea',
                messageTextColor: '#ffffff',
                secondaryMessageColor: '#f1f5f9',
                backgroundStyle: undefined
            };
        }

        const messageColor = conversation.message_color || '#667eea';
        const messageTextColor = conversation.message_text_color || '#ffffff';
        const backgroundColor = conversation.background_color;

        return {
            messageColor,
            messageTextColor,
            secondaryMessageColor: '#f1f5f9',
            backgroundStyle: backgroundColor 
                ? `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}80 100%)`
                : undefined
        };
    };

    // Effects
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            setShowSidebar(window.innerWidth >= 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        document.title = "VibeMarket - Chat với Shop";
        const token = getToken();

        if (user && token) {
            fetchConversations();
            initializeSocket();
        } else {
            console.error("Missing user or token - cannot initialize chat");
        }

        return () => {
            if (fetchMessagesAbortControllerRef.current) {
                fetchMessagesAbortControllerRef.current.abort();
            }
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [user, initializeSocket, shopId, navigationState?.selectedConversationId]);

    useEffect(() => {
        const timer = setTimeout(() => scrollToBottom(), 100);
        return () => clearTimeout(timer);
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (isMobile && selectedConversation) setShowSidebar(false);
        if (isMobile && !selectedConversation) setShowSidebar(true);
    }, [selectedConversation, isMobile]);

    const conversationSelectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleConversationSelect = async (conversation: Conversation) => {
        if (conversationSelectTimeoutRef.current) {
            clearTimeout(conversationSelectTimeoutRef.current);
        }

        setMessages([]);
        setIsLoadingMessages(true);

        if (selectedConversation && socketRef.current) {
            leaveConversation(selectedConversation.id);
        }

        setSelectedConversation(conversation);
        currentConversationIdRef.current = conversation.id;

        if (isMobile) {
            setShowSidebar(false);
        }

        conversationSelectTimeoutRef.current = setTimeout(async () => {
            try {
                await fetchMessages(conversation.id);
                if (socketRef.current) {
                    joinConversation(conversation.id);
                }
            } catch (error) {
                console.error("Error selecting conversation:", error);
                toast.error("Không thể chuyển cuộc trò chuyện");
            }
        }, 300);
    };

    useEffect(() => {
        if (selectedConversation) {
            if (socketRef.current) {
                joinConversation(selectedConversation.id);
            }
            shouldAutoScroll.current = true;
        }

        return () => {
            if (selectedConversation && socketRef.current) {
                leaveConversation(selectedConversation.id);
            }
        };
    }, [selectedConversation?.id, joinConversation, leaveConversation]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation || !user) return;

        await sendMessage(newMessage.trim());
        setNewMessage("");
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0 || !selectedConversation) return;

        const loadingToast = toast.loading(`Đang tải ${files.length} file(s) lên...`);

        try {
            const uploadedFiles = await uploadFiles(files);

            for (const fileData of uploadedFiles) {
                let fileType: "text" | "image" | "video" | "file";
                if (fileData.file_type === "image") {
                    fileType = "image";
                } else if (fileData.file_type === "video") {
                    fileType = "video";
                } else {
                    fileType = "file";
                }
                const content =
                    fileData.file_type === "image"
                        ? "Hình ảnh"
                        : fileData.file_type === "video"
                            ? "Video"
                            : fileData.original_name;

                await sendMessage(content, fileType, fileData);
            }

            toast.dismiss(loadingToast);
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("Không thể gửi file(s): " + error);
        }
        e.target.value = "";
    };

    const handleBackToSidebar = () => {
        if (isMobile) {
            setSelectedConversation(null);
            setShowSidebar(true);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Vừa xong";
        if (minutes < 60) return `${minutes}p`;
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}d`;
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
        });
    };

    const formatMessageTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const renderMessage = (message: Message) => {
        if (message.type === "image") {
            const imageUrl = resolveUrl((message as any).fileUrl || (message as any).file_url);
            return (
                <div className="mb-2">
                    <a href={imageUrl} data-fancybox="gallery">
                        <img
                            src={imageUrl}
                            alt="Hình ảnh"
                            className="max-w-xs rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                        />
                    </a>
                    {message.original_name && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {message.original_name}
                        </p>
                    )}
                </div>
            );
        } else if (message.type === "file") {
            const fileUrl = resolveUrl((message as any).fileUrl || (message as any).file_url);
            return (
                <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-xl max-w-sm">
                    <div className="flex-shrink-0">
                        {getFileIcon(message.file_type || "file")}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                            {message.original_name || "File"}
                        </p>
                        {message.file_size && (
                            <p className="text-xs text-muted-foreground">
                                {formatFileSize(message.file_size)}
                            </p>
                        )}
                    </div>
                    <a
                        href={fileUrl}
                        download
                        className="flex-shrink-0 p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                        <Download size={16} />
                    </a>
                </div>
            );
        } else if (message.type === "video") {
            const videoUrl = resolveUrl((message as any).fileUrl || (message as any).file_url);
            const thumbnailUrl = (message as any).thumbnail_url
                ? resolveUrl((message as any).thumbnail_url)
                : undefined;

            return (
                <div className="mb-2">
                    <a href={videoUrl} data-fancybox="gallery" data-type="video">
                        <video
                            src={videoUrl}
                            poster={thumbnailUrl}
                            className="max-w-xs rounded-xl cursor-pointer"
                            controls
                        />
                    </a>
                    {message.original_name && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {message.original_name}
                        </p>
                    )}
                </div>
            );
        }
        return (
            <p className="text-sm lg:text-base leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
        );
    };

    const filteredConversations = conversations.filter((conv) =>
        conv.participants.some((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const currentShop = selectedConversation?.participants.find(
        (p) => p.id !== user?.id
    );

    const getConversationPreview = (conv: any) => {
        const raw = conv.last_message || conv.last_message_text || null;
        if (!raw) return "Bắt đầu cuộc trò chuyện";

        if (typeof raw === "object") {
            const type = raw.type || "";
            const content = raw.content || "";
            if (type) {
                if (type === "image") return "📷 Hình ảnh";
                if (type === "video") return "🎥 Video";
                if (type === "file") return `📎 ${raw.original_name || "File"}`;
            }
            if (content) return content;
            return raw.original_name || "Tệp đính kèm";
        }

        if (typeof raw === "string") {
            return raw;
        }

        return "Bắt đầu cuộc trò chuyện";
    };

    return (
        <div className="h-screen flex overflow-hidden gradient-subtle">
            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {showSidebar && (
                    <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        className={`${
                            isMobile ? "absolute inset-0 z-20" : "relative"
                        } w-full md:w-96 bg-background border-r border-border flex flex-col`}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-border">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Store className="w-6 h-6 text-primary" />
                                    <h1 className="text-xl font-bold">Chat với Shop</h1>
                                </div>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm shop..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* Conversations List */}
                        <div className="flex-1 overflow-y-auto">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : filteredConversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                    <Store className="w-16 h-16 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">
                                        Chưa có cuộc trò chuyện với shop nào
                                    </p>
                                </div>
                            ) : (
                                filteredConversations.map((conv) => {
                                    const otherParticipant = conv.participants.find(
                                        (p) => p.id !== user?.id
                                    );
                                    const isOnline = onlineUsers.includes(otherParticipant?.id || 0);
                                    const isSelected = selectedConversation?.id === conv.id;

                                    return (
                                        <div
                                            key={conv.id}
                                            onClick={() => handleConversationSelect(conv)}
                                            className={`p-4 border-b border-border cursor-pointer transition-all ${
                                                isSelected
                                                    ? "bg-primary/10 border-l-4 border-l-primary"
                                                    : "hover:bg-secondary/50"
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="relative flex-shrink-0">
                                                    <img
                                                        src={otherParticipant?.avatar || "/images/avatars/Avt-Default.png"}
                                                        alt={otherParticipant?.name}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                    {isOnline && (
                                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                                                    )}
                                                    <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-1">
                                                        <Store size={10} className="text-white" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="font-semibold truncate flex items-center gap-1">
                                                            {otherParticipant?.name || "Shop"}
                                                            <ShoppingBag size={14} className="text-orange-500" />
                                                        </h3>
                                                        {conv.last_message_time && (
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatTime(conv.last_message_time)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {getConversationPreview(conv)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    {isMobile && (
                                        <button
                                            onClick={handleBackToSidebar}
                                            className="p-2 hover:bg-secondary rounded-lg mr-2"
                                        >
                                            <ArrowLeft size={20} />
                                        </button>
                                    )}
                                    <div className="relative">
                                        <img
                                            src={currentShop?.avatar || "/images/avatars/Avt-Default.png"}
                                            alt={currentShop?.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-1">
                                            <Store size={10} className="text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="font-semibold flex items-center gap-2">
                                            {currentShop?.name || "Shop"}
                                            <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                                                Shop
                                            </span>
                                        </h2>
                                        <p className="text-xs text-muted-foreground">
                                            {onlineUsers.includes(currentShop?.id || 0)
                                                ? "Đang hoạt động"
                                                : "Không hoạt động"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => navigate(`/store/${currentShop?.id}`)}
                                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                        title="Xem cửa hàng"
                                    >
                                        <ShoppingBag size={20} />
                                    </button>
                                    <button
                                        onClick={() => setShowChatInfo(true)}
                                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                    >
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            ref={messagesContainerRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4"
                            style={{
                                background: getMessageColors(selectedConversation).backgroundStyle || undefined
                            }}
                        >
                            {isLoadingMessages ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <MessageCircle className="w-16 h-16 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">
                                        Chưa có tin nhắn. Hãy bắt đầu trò chuyện!
                                    </p>
                                </div>
                            ) : (
                                messages.map((message, index) => {
                                    const isOwnMessage = message.senderId === user?.id;
                                    const showAvatar =
                                        index === messages.length - 1 ||
                                        messages[index + 1]?.senderId !== message.senderId;

                                    return (
                                        <div
                                            key={message.id || message.tempId || index}
                                            className={`flex ${
                                                isOwnMessage ? "justify-end" : "justify-start"
                                            } items-end space-x-2`}
                                        >
                                            {!isOwnMessage && showAvatar && (
                                                <img
                                                    src={message.sender?.avatar || "/images/avatars/Avt-Default.png"}
                                                    alt={message.sender?.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            )}
                                            {!isOwnMessage && !showAvatar && (
                                                <div className="w-8 h-8" />
                                            )}

                                            <div
                                                className={`max-w-[70%] ${
                                                    isOwnMessage ? "items-end" : "items-start"
                                                }`}
                                            >
                                                <div
                                                    className={`rounded-2xl px-4 py-2 ${
                                                        isOwnMessage
                                                            ? `text-white`
                                                            : "bg-secondary"
                                                    } ${message.isPending ? "opacity-50" : ""}`}
                                                    style={
                                                        isOwnMessage
                                                            ? {
                                                                backgroundColor: getMessageColors(selectedConversation).messageColor,
                                                                color: getMessageColors(selectedConversation).messageTextColor,
                                                            }
                                                            : {}
                                                    }
                                                >
                                                    {renderMessage(message)}
                                                </div>
                                                <div
                                                    className={`flex items-center space-x-1 mt-1 ${
                                                        isOwnMessage ? "justify-end" : "justify-start"
                                                    }`}
                                                >
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatMessageTime(message.timestamp)}
                                                    </span>
                                                    {isOwnMessage && (
                                                        <span className="text-primary">
                                                            {message.isRead ? (
                                                                <CheckCheck size={14} />
                                                            ) : (
                                                                <Check size={14} />
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <form
                            onSubmit={handleSendMessage}
                            className="p-4 border-t border-border bg-background"
                        >
                            <div className="flex items-center space-x-2">
                                <input
                                    type="file"
                                    id="file-upload-shop"
                                    multiple
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="file-upload-shop"
                                    className="p-2 hover:bg-secondary rounded-lg cursor-pointer transition-colors"
                                >
                                    <Paperclip size={20} />
                                </label>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Nhập tin nhắn..."
                                    className="flex-1 px-4 py-2 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <Store className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
                            <h2 className="text-xl font-semibold mb-2">Chat với Shop</h2>
                            <p className="text-muted-foreground">
                                Chọn một shop để bắt đầu trò chuyện
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Info Sidebar */}
            {selectedConversation && showChatInfo && (
                <ChatInfoSidebar
                    conversation={selectedConversation}
                    onClose={() => setShowChatInfo(false)}
                    onLeave={() => {}}
                    onConversationUpdate={handleConversationUpdate}
                />
            )}
        </div>
    );
};

export default ShopChat;
