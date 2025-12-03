import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    Fragment,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";
import {
    User,
    UploadedFile,
    Message,
    Conversation,
    ConversationsResponse,
    MessagesResponse,
    UploadResponse,
} from "@/types/chat";

const Chat: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
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
    const [searchUser, setSearchUser] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [chatType, setChatType] = useState<"private" | "group">("private");
    const [groupName, setGroupName] = useState("");
    const [userList, setUserList] = useState<User[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [groupAvatar, setGroupAvatar] = useState<string>("");
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
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

    // **FIX: Add ref to track current conversation ID being fetched**
    const currentConversationIdRef = useRef<number | null>(null);

    const incomingCallAudioRef = useRef<HTMLAudioElement | null>(null);

    // helper lấy token (hỗ trợ key cũ 'vibeventure_token' để tương thích)
    // helper lấy token (hỗ trợ key cũ 'vibeventure_token' để tương thích)
    const getToken = () => {
        const candidates = [
            localStorage.getItem("vibeventure_token"),
            localStorage.getItem("token"),
            sessionStorage.getItem("vibeventure_token"),
            sessionStorage.getItem("token"),
        ];
        for (const c of candidates) {
            if (c) {
                // **FIX: Remove "Bearer " prefix if exists**
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

    // Fetch conversations
    const fetchConversations = async () => {
        try {
            const token = getToken();
            if (!token) {
                console.error("No token found");
                return;
            }

            // Fetch all conversations (both user and shop conversations)
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/chat/conversations.php`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Fetch conversations error:", errorData);
                throw new Error(errorData.message || 'Failed to fetch conversations');
            }

            const data: ConversationsResponse = await response.json();
            if (data.success) setConversations(data.data);
        } catch (error) {
            console.error("Error fetching conversations:", error);
            toast.error(error.message || "Không thể tải cuộc trò chuyện");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch user list for modal
    useEffect(() => {
        if (!showNewChatModal) return;
        const ac = new AbortController();
        const fetchUsers = async () => {
            try {
                const token = getToken();
                if (!token) {
                    setUserList([]);
                    return;
                }
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/user/list.php`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        signal: ac.signal,
                    }
                );
                console.log("[Debug] GET /api/user/list.php", res.status, res.statusText);
                if (res.status === 429) {
                    const ra = res.headers.get("Retry-After") || "5";
                    toast.error(`Quá nhiều yêu cầu, thử lại sau ${ra}s`);
                    setUserList([]);
                    return;
                }
                if (res.status === 401) {
                    toast.error("Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
                    setUserList([]);
                    return;
                }
                const data = await res.json();
                console.log("[Debug] /api/user/list.php body", data);
                if (data && data.success && Array.isArray(data.data)) {
                    setUserList(data.data.filter((u: User) => u.id !== user?.id));
                } else {
                    setUserList([]);
                }
            } catch (err: any) {
                if (err.name === "AbortError") return;
                console.error("Fetch users error:", err);
                toast.error("Không thể tải danh sách người dùng");
                setUserList([]);
            }
        };
        fetchUsers();
        return () => ac.abort();
    }, [showNewChatModal, user]);

    // Thêm vào đầu component
    useEffect(() => {
        console.log("Messages updated:", messages);
        console.log("Selected conversation:", selectedConversation?.id);
        console.log("Current conversation ref:", currentConversationIdRef.current);
    }, [messages, selectedConversation]);

    // Socket
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

        socket.on('incoming_call', (data) => {
            const { callId, conversationId, initiator, callType, timestamp, conversation } = data;
            let callerAvatar = initiator.avatar || '/images/avatars/Avt-Default.png';
            let callerName = initiator.name || 'Không xác định';

            if (conversation?.type === 'group') {
                callerAvatar = conversation.avatar || "images/avatars/Avt-Group-Default.png";
                callerName = conversation.name || callerName;
            }

            setCurrentCallData({
                callId,
                conversationId,
                callerName,
                callerAvatar,
                callType,
                timestamp
            });
            setCallModalType('incoming');
            setShowCallModal(true);

            if (incomingCallAudioRef.current) {
                incomingCallAudioRef.current.play().catch((error) => {
                    console.error("Lỗi phát âm thanh gọi đến:", error);
                });
            }
        });

        socket.on('call_initiated', (data) => {
            const { callId, conversationId, callType, participants, conversation } = data;
            let callerName = participants?.find((p: Participant) => p.id !== user?.id)?.name || 'Không xác định';
            let callerAvatar = participants?.find((p: Participant) => p.id !== user?.id)?.avatar || '/images/avatars/Avt-Default.png';
            if (conversation?.type === 'group') {
                callerAvatar = conversation.avatar || callerAvatar;
                callerName = conversation.name || callerName;
            }

            setCurrentCallData({
                callId,
                conversationId,
                callType,
                participants,
                callerName,
                callerAvatar,
            });
            setCallModalType('outgoing');
            setShowCallModal(true);
        });

        socket.on('call_error', (error) => {
            console.error('Call error:', error);
            toast.error(error.message || 'Có lỗi xảy ra khi thực hiện cuộc gọi');
        });

        socket.on("new_message", (message: Message) => {
            try {
                // normalize fields
                const processed: any = {
                    ...message,
                    fileUrl: (message as any).file_url || (message as any).fileUrl || null,
                    id: message.id || null,
                    tempId: (message as any).tempId || (message as any).temp_id || null,
                };

                // **FIX: Check conversation ID properly**
                const messageConvId = (message as any).conversationId || (message as any).conversation_id;

                // **FIX: Only filter if we have both IDs to compare**
                if (messageConvId && selectedConversation?.id) {
                    if (messageConvId !== selectedConversation.id && messageConvId !== currentConversationIdRef.current) {
                        console.log(`Ignoring message from conversation ${messageConvId} - currently viewing ${selectedConversation.id}`);
                        fetchConversations();
                        return;
                    }
                }

                // if this is the confirmation for a pending temp message -> replace it
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

                // **FIX: Don't skip messages from self if not already in messages array**
                const existsById = (msgs: Message[]) =>
                    msgs.some(m => (m.id && processed.id && m.id === processed.id));
                const existsByTempId = (msgs: Message[]) =>
                    msgs.some(m => (m.tempId && processed.tempId && m.tempId === processed.tempId));

                setMessages((prev) => {
                    // Only skip if message already exists
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

        socket.on('user_accepted_call', (data) => {
            navigate(`/call/${data.conversationId}/${data.callType}/${data.callId}`);
        });

        socket.on('user_rejected_call', (data) => {
            if (data.allRejected) {
                setShowCallModal(false);
                setCurrentCallData(null);
            }
            toast.error(`${data.user.name} đã từ chối cuộc gọi`);
        });

        socket.on('call_cancelled', (data) => {
            setShowCallModal(false);
            setCurrentCallData(null);
            if (incomingCallAudioRef.current) {
                incomingCallAudioRef.current.pause();
                incomingCallAudioRef.current.currentTime = 0;
            }
            const callerName = data.user?.name || "bạn";
            toast.error(`Cuộc gọi đã bị huỷ bởi ${callerName}`);
        });

        socket.on("message_saved", (savedMessage: Message) => {
            if (
                savedMessage.tempId &&
                pendingMessages.current.has(savedMessage.tempId)
            ) {
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
        socket.on("message_read", (data: { messageId: number; userId: number }) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === data.messageId ? { ...msg, isRead: true } : msg
                )
            );
        });
        socket.on("connect_error", (error) => {
            toast.error("Lỗi kết nối máy chủ. Đang kết nối lại...");
            console.error("Socket connection error:", error);
        });

        return socket;
    }, [user]);

    // Call handlers
    const startVideoCall = useCallback(async () => {
        if (!selectedConversation || !user || !socketRef.current) return;
        socketRef.current.emit('initiate_call_from_chat', {
            conversationId: selectedConversation.id,
            callType: 'video'
        });
    }, [selectedConversation, user]);

    const startAudioCall = useCallback(async () => {
        if (!selectedConversation || !user || !socketRef.current) return;
        socketRef.current.emit('initiate_call_from_chat', {
            conversationId: selectedConversation.id,
            callType: 'voice'
        });
    }, [selectedConversation, user]);

    const handleAcceptCall = useCallback(() => {
        if (!currentCallData || !socketRef.current) return;

        if (incomingCallAudioRef.current) {
            incomingCallAudioRef.current.pause();
            incomingCallAudioRef.current.currentTime = 0;
        }

        socketRef.current.emit('accept_call', {
            callId: currentCallData.callId,
            conversationId: currentCallData.conversationId,
            callType: currentCallData.callType
        });

        setShowCallModal(false);

        setTimeout(() => {
            navigate(`/call/${currentCallData.conversationId}/${currentCallData.callType}/${currentCallData.callId}`);
        }, 100);

        setCurrentCallData(null);
    }, [currentCallData, navigate, callModalType]);

    const handleRejectCall = useCallback(() => {
        if (!currentCallData || !socketRef.current) return;

        if (incomingCallAudioRef.current) {
            incomingCallAudioRef.current.pause();
            incomingCallAudioRef.current.currentTime = 0;
        }

        socketRef.current.emit('reject_call', {
            callId: currentCallData.callId,
            reason: 'user_rejected',
            callType: currentCallData.callType
        });

        setShowCallModal(false);
        setCurrentCallData(null);
    }, [currentCallData]);

    const handleCancelCall = useCallback(() => {
        if (!currentCallData || !socketRef.current) return;

        socketRef.current.emit('cancel_call', {
            callId: currentCallData.callId,
            reason: 'user_cancelled',
            callType: currentCallData.callType
        });

        setShowCallModal(false);
        setCurrentCallData(null);
    }, [currentCallData]);

    const handleCloseCallModal = useCallback(() => {
        if (incomingCallAudioRef.current) {
            incomingCallAudioRef.current.pause();
            incomingCallAudioRef.current.currentTime = 0;
        }

        setShowCallModal(false);
        setCurrentCallData(null);
    }, []);

    // **FIX: Add ref to track ongoing fetch**
    const isFetchingMessagesRef = useRef<boolean>(false);
    const fetchMessagesAbortControllerRef = useRef<AbortController | null>(null);

    // **FIX: Update fetchMessages with abort and debounce**
    const fetchMessages = async (conversationId: number, page = 1) => {
        // Cancel previous fetch if still running
        if (fetchMessagesAbortControllerRef.current) {
            fetchMessagesAbortControllerRef.current.abort();
        }

        // Prevent duplicate calls
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

            // Create new abort controller
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

                // Handle rate limiting with retry
                if (response.status === 429) {
                    const retryAfter = parseInt(response.headers.get('Retry-After') || errorData.retry_after || '5');
                    throw new Error(`Quá nhiều yêu cầu, thử lại sau: ${retryAfter} giây`);
                }

                throw new Error(errorData.message || 'Failed to fetch messages');
            }

            const data: MessagesResponse = await response.json();

            if (currentConversationIdRef.current === conversationId) {
                if (data.success) {
                    setMessages(data.data || []);

                    const messageIds = data.data
                        .map((msg) => msg.id)
                        .filter((id): id is number => id !== null && id !== undefined);

                    if (messageIds.length > 0) {
                        await markMessagesAsRead(messageIds);
                    }

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

        const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

        const MIN_INTERVAL_MS = 700;
        const now = Date.now();
        const last = lastSendAtRef.current.get(convId) || 0;
        if (now - last < MIN_INTERVAL_MS) {
            const wait = MIN_INTERVAL_MS - (now - last) + Math.floor(Math.random() * 150);
            await sleep(wait);
        }

        const maxRetries = 3;
        let attempt = 0;

        while (attempt < maxRetries) {
            attempt++;
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

                const ct = response.headers.get("content-type") || "";
                const bodyText = await response.text();

                let data: any = null;
                if (ct.includes("application/json") && bodyText) {
                    try {
                        data = JSON.parse(bodyText);
                    } catch (parseErr) {
                        console.error("[Debug] Failed to parse JSON response:", parseErr);
                        throw new Error("Invalid JSON response from server");
                    }
                }

                if (!response.ok) {
                    let retryAfter = Number(data?.retry_after || data?.retry_after_seconds || 0);
                    if (!retryAfter) {
                        const hdr = response.headers.get("Retry-After");
                        retryAfter = hdr ? Number(hdr) || 0 : 0;
                    }
                    if (retryAfter <= 0) {
                        retryAfter = Math.min(1 + attempt * 0.8, 4) + Math.random() * 0.6;
                    }
                    if (attempt < maxRetries) {
                        toast(`Quá nhiều yêu cầu, thử lại sau ${Math.ceil(retryAfter)}s...`, { icon: '⏳', duration: 1500 });
                        await sleep(Math.ceil(retryAfter) * 1000);
                        continue;
                    }
                    throw new Error(data?.message || bodyText || `HTTP ${response.status}`);
                }

                if (data && data.success === false) {
                    let retryAfter = Number(data.retry_after || data.retry_after_seconds || 0);
                    if (retryAfter <= 0) retryAfter = Math.min(1 + attempt * 0.8, 4) + Math.random() * 0.6;
                    if (attempt < maxRetries) {
                        toast(`Quá nhiều yêu cầu, thử lại sau ${Math.ceil(retryAfter)}s...`, { icon: '⏳', duration: 1500 });
                        await sleep(Math.ceil(retryAfter) * 1000);
                        continue;
                    }
                    throw new Error(data.message || "Gửi tin nhắn thất bại");
                }

                lastSendAtRef.current.set(convId, Date.now());

                if (currentConversationIdRef.current === convId) {
                    if (data && data.data) {
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.tempId === tempId
                                    ? {
                                        ...data.data,
                                        isPending: false,
                                        tempId: undefined,
                                        fileUrl: data.data.file_url || data.data.fileUrl,
                                    } as Message
                                    : msg
                            )
                        );
                    } else {
                        setMessages((prev) =>
                            prev.map((msg) => (msg.tempId === tempId ? { ...msg, isPending: false } : msg))
                        );
                    }
                }
                pendingMessages.current.delete(tempId);
                return;
            } catch (err: any) {
                const isLast = attempt >= maxRetries;
                console.error("Send message attempt", attempt, "error:", err);
                if (isLast) {
                    if (currentConversationIdRef.current === convId) {
                        setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
                    }
                    pendingMessages.current.delete(tempId);
                    toast.error("Không thể gửi tin nhắn: " + (err?.message || err));
                    return;
                }
                const backoffMs = Math.min(800 * attempt, 3000) + Math.floor(Math.random() * 200);
                await sleep(backoffMs);
            }
        }
    };

    // Mark read
    const markMessagesAsRead = async (messageIds: number[]) => {
        try {
            const token = getToken();
            if (!token || messageIds.length === 0) return;

            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/read.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ message_ids: messageIds }),
            });

            if (socketRef.current && selectedConversation) {
                messageIds.forEach((messageId) => {
                    socketRef.current?.emit("mark_read", {
                        conversationId: selectedConversation.id,
                        messageId,
                    });
                });
            }
        } catch (error) {
            console.error("Error marking messages as read:", error);
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
                if (data.errors && data.errors.length > 0) {
                    toast.error(
                        `${data.uploaded_count}/${data.total_count} files gửi thành công. Một số file thất bại.`
                    );
                } else {
                    toast.success(`Gửi thành công ${data.uploaded_count} files!`);
                }
                return data.data;
            } else {
                throw new Error(data.message || "Gửi thất bại");
            }
        } catch (error) {
            toast.error("Error uploading files: " + error);
            throw error;
        }
    };

    // Online status
    const updateOnlineStatus = async (status: "online" | "offline") => {
        try {
            const token = getToken();
            if (!token) return;

            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/status.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });
        } catch (error) {
            console.error("Error updating online status:", error);
        }
    };

    // Conversation join/leave
    const joinConversation = useCallback((conversationId: number) => {
        if (socketRef.current)
            socketRef.current.emit("join_conversation", conversationId);
    }, []);
    const leaveConversation = useCallback((conversationId: number) => {
        if (socketRef.current)
            socketRef.current.emit("leave_conversation", conversationId);
    }, []);

    // Scroll
    const scrollToBottom = useCallback((force = false) => {
        if (messagesEndRef.current && (shouldAutoScroll.current || force)) {
            messagesEndRef.current.scrollIntoView({
                behavior: force ? "auto" : "smooth",
                block: "end",
            });
        }
    }, []);

    const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

    const resolveUrl = (p?: string | null) => {
        if (!p) return "";
        if (/^https?:\/\//i.test(p)) return p;
        return `${import.meta.env.VITE_BACKEND_URL}/${p.replace(/^\/+/, "")}`;
    };

    const handleGroupAvatarChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploadingAvatar(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = (reader.result as string).split(",")[1];
            try {
                const formData = new FormData();
                formData.append("key", IMGBB_API_KEY);
                formData.append("image", base64String);
                const res = await fetch("https://api.imgbb.com/1/upload", {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();
                if (data.success) {
                    setGroupAvatar(data.data.url);
                    toast.success("Tải ảnh thành công!");
                } else {
                    toast.error("Tải ảnh thất bại!");
                }
            } catch (err) {
                toast.error("Lỗi khi tải ảnh lên!" + err);
            } finally {
                setIsUploadingAvatar(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleLeaveConversation = async (conversationId: number) => {
        if (!conversationId) return;
        const ok = window.confirm("Bạn có chắc muốn rời khỏi nhóm này?");
        if (!ok) return;

        const loading = toast.loading("Đang rời khỏi nhóm...");
        try {
            const token = getToken();
            if (!token) {
                toast.dismiss(loading);
                toast.error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                return;
            }

            // Try DELETE on conversations endpoint (common pattern). Fallback to leave.php if fails.
            const urlPrimary = `${import.meta.env.VITE_BACKEND_URL}/api/chat/conversations.php`;
            const doRequest = async (url: string) => {
                return await fetch(url, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ conversation_id: conversationId }),
                });
            };

            let res = await doRequest(urlPrimary);
            if (res.status === 405 || res.status === 404) {
                // try legacy leave endpoint
                res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/leave.php?conversation_id=${conversationId}`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            if (res.status === 401) {
                toast.dismiss(loading);
                toast.error("Token không hợp lệ hoặc hết hạn. Vui lòng đăng nhập lại.");
                return;
            }

            let data: any = null;
            try {
                data = await res.json();
            } catch {
                // non-json response
                const txt = await res.text();
                throw new Error(txt || `HTTP ${res.status}`);
            }

            if (!res.ok || (data && data.success === false)) {
                throw new Error(data?.message || `Không thể rời nhóm (HTTP ${res.status})`);
            }

            // success
            toast.dismiss(loading);
            toast.success("Bạn đã rời nhóm");

            // tell socket to leave room and update UI
            if (socketRef.current) {
                socketRef.current.emit("leave_conversation", conversationId);
            }
            // if currently viewing that conversation, close it
            if (selectedConversation?.id === conversationId) {
                setSelectedConversation(null);
            }
            setShowChatInfo(false);
            // refresh list
            fetchConversations();
        } catch (err: any) {
            toast.dismiss();
            console.error("Leave conversation error:", err);
            toast.error(err?.message || "Không thể rời nhóm");
        }
    };

    const handleScroll = useCallback(() => {
        if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } =
                messagesContainerRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            shouldAutoScroll.current = isNearBottom;
        }
    }, []);

    const handleCreateConversation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (chatType === "private" && selectedUserIds.length !== 1) {
            toast.error("Vui lòng chọn 1 người để trò chuyện riêng tư");
            return;
        }
        if (
            chatType === "group" &&
            (selectedUserIds.length < 1 || !groupName.trim())
        ) {
            toast.error("Vui lòng chọn ít nhất 1 người và nhập tên nhóm");
            return;
        }
        setIsCreating(true);
        try {
            const token = getToken();
            const body: any = {
                type: chatType,
                participants: [
                    user!.id,
                    ...selectedUserIds.filter((id) => id !== user!.id),
                ],
            };
            if (chatType === "group") {
                body.name = groupName;
                if (groupAvatar) body.avatar = groupAvatar;
            }
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/chat/conversations.php`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                }
            );
            const data = await res.json();
            if (data.success) {
                toast.success("Tạo cuộc trò chuyện thành công!");
                setShowNewChatModal(false);
                setGroupName("");
                setSelectedUserIds([]);
                fetchConversations();
            } else {
                toast.error(data.message || "Không thể tạo cuộc trò chuyện");
            }
        } catch (err) {
            toast.error("Lỗi khi tạo cuộc trò chuyện" + err);
        } finally {
            setIsCreating(false);
        }
    };

    const handleShowAddConversation = () => {
        setShowNewChatModal(true);
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

    // Add helper function to get message colors
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
        Fancybox.bind("[data-fancybox]", {
            animated: true,
            showClass: "fancybox-fadeIn",
            hideClass: "fancybox-fadeOut",
            Images: {
                zoom: true,
                protect: true,
            },
            Html: {
                video: {
                    tpl: `<video class="fancybox__html" playsinline controls controlsList="nodownload" poster="{{poster}}">
                  <source src="{{src}}" type="{{format}}" />
                  Sorry, your browser doesn't support embedded videos.
                </video>`,
                    format: "video/mp4",
                    autoSize: true,
                },
            },
            Toolbar: {
                display: {
                    left: ["infobar"],
                    middle: [
                        "zoomIn",
                        "zoomOut",
                        "toggle1to1",
                        "rotateCCW",
                        "rotateCW",
                        "flipX",
                        "flipY",
                    ],
                    right: ["slideshow", "fullscreen", "download", "thumbs", "close"],
                },
            },
        });

        document.title = "VibeMarket - Trò chuyện";
        const token = getToken();
        console.log("Current token:", token ? `${token.substring(0, 20)}...` : "NO TOKEN");
        console.log("User:", user);

        if (user && token) {
            fetchConversations().then(() => {
                // Auto-select conversation from navigation state if exists
                if (navigationState?.selectedConversationId) {
                    const conversation = conversations.find(
                        (c) => c.id === navigationState.selectedConversationId
                    );
                    if (conversation) {
                        handleConversationSelect(conversation);
                    }
                    // Clear navigation state to prevent re-selection on refresh
                    navigate(location.pathname, { replace: true, state: null });
                }
            });
            initializeSocket();
            updateOnlineStatus("online");
        } else {
            console.error("Missing user or token - cannot initialize chat");
        }

        return () => {
            // **FIX: Cleanup on unmount**
            if (conversationSelectTimeoutRef.current) {
                clearTimeout(conversationSelectTimeoutRef.current);
            }
            if (fetchMessagesAbortControllerRef.current) {
                fetchMessagesAbortControllerRef.current.abort();
            }
            if (socketRef.current) socketRef.current.disconnect();
            updateOnlineStatus("offline");
            Fancybox.unbind("[data-fancybox]");
            Fancybox.close();
        };
    }, [user, initializeSocket]);

    useEffect(() => {
        const timer = setTimeout(() => scrollToBottom(), 100);
        const refreshFancybox = () => {
            Fancybox.unbind("[data-fancybox]");
            Fancybox.bind("[data-fancybox]", {
                animated: true,
                showClass: "fancybox-fadeIn",
                hideClass: "fancybox-fadeOut",
                Images: {
                    zoom: true,
                    protect: true,
                },
                Html: {
                    video: {
                        tpl: `<video class="fancybox__html" playsinline controls controlsList="nodownload" poster="{{poster}}">
                    <source src="{{src}}" type="{{format}}" />
                    Sorry, your browser doesn't support embedded videos.
                  </video>`,
                        format: "video/mp4",
                        autoSize: true,
                    },
                },
                Toolbar: {
                    display: {
                        left: ["infobar"],
                        middle: [
                            "zoomIn",
                            "zoomOut",
                            "toggle1to1",
                            "rotateCCW",
                            "rotateCW",
                            "flipX",
                            "flipY",
                        ],
                        right: ["slideshow", "fullscreen", "download", "thumbs", "close"],
                    },
                },
            });
        };
        const fancyboxTimer = setTimeout(refreshFancybox, 200);

        return () => {
            clearTimeout(timer);
            clearTimeout(fancyboxTimer);
        };
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (isMobile && selectedConversation) setShowSidebar(false);
        if (isMobile && !selectedConversation) setShowSidebar(true);
    }, [selectedConversation, isMobile]);

    const conversationSelectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // **FIX: Update conversation selection handler**
    const handleConversationSelect = async (conversation: Conversation) => {
        // Clear any pending conversation switch
        if (conversationSelectTimeoutRef.current) {
            clearTimeout(conversationSelectTimeoutRef.current);
        }

        // Immediate UI update
        setMessages([]);
        setIsLoadingMessages(true);

        // Leave previous conversation room
        if (selectedConversation && socketRef.current) {
            leaveConversation(selectedConversation.id);
        }

        // Update selected conversation
        setSelectedConversation(conversation);
        currentConversationIdRef.current = conversation.id;

        if (isMobile) {
            setShowSidebar(false);
        }

        // Debounce the actual fetch
        conversationSelectTimeoutRef.current = setTimeout(async () => {
            try {
                // Fetch messages for new conversation
                await fetchMessages(conversation.id);

                // Join new conversation room
                if (socketRef.current) {
                    joinConversation(conversation.id);
                }
            } catch (error) {
                console.error("Error selecting conversation:", error);
                toast.error("Không thể chuyển cuộc trò chuyện");
            }
        }, 300); // 300ms debounce
    };

    useEffect(() => {
        if (selectedConversation) {
            // Don't fetch here if already fetched in handleConversationSelect
            // Only join conversation room
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

        const loadingToast = toast.loading(
            `Đang tải ${files.length} file(s) lên...`
        );

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

    // const handleConversationSelect = (conversation: Conversation) => {
    //     if (selectedConversation) {
    //         leaveConversation(selectedConversation.id);
    //     }
    //     setSelectedConversation(conversation);
    //     if (isMobile) {
    //         setShowSidebar(false);
    //     }
    // };

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
                    <a
                        href={imageUrl}
                        data-fancybox="gallery"
                        data-caption={message.original_name || "Hình ảnh được chia sẻ"}
                        className="inline-block rounded-xl overflow-hidden"
                    >
                        <img
                            src={imageUrl}
                            alt="Hình ảnh được chia sẻ"
                            className="max-w-full h-auto max-h-80 object-cover rounded-xl hover:opacity-90 transition-opacity"
                            loading="lazy"
                        />
                    </a>
                    {message.original_name && (
                        <p className="text-xs text-muted-foreground mt-2">
                            {message.original_name}
                        </p>
                    )}
                </div>
            );
        } else if (message.type === "file") {
            const fileUrl = resolveUrl((message as any).fileUrl || (message as any).file_url);
            return (
                <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-xl max-w-sm">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        {getFileIcon(message.file_type || "file")}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                            {message.original_name ||
                                message.content.split("/").pop() ||
                                "File"}
                        </p>
                        {message.file_size && (
                            <p className="text-xs text-muted-foreground">
                                {formatFileSize(message.file_size)}
                            </p>
                        )}
                    </div>
                    <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Tải xuống"
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
                    <div className="relative max-w-full h-auto rounded-xl overflow-hidden">
                        <video
                            src={videoUrl}
                            controls
                            className="w-full h-auto max-h-60 rounded-xl"
                            poster={thumbnailUrl}
                            preload="metadata"
                        >
                            Trình duyệt của bạn không hỗ trợ phát video.
                        </video>
                    </div>
                    {message.original_name && (
                        <p className="text-xs text-muted-foreground mt-2">
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

    const currentUser = selectedConversation?.participants.find(
        (p) => p.id !== user?.id
    );

    const getConversationPreview = (conv: any) => {
        // nhiều backend có thể trả last_message là string hoặc object
        const raw = conv.last_message || conv.last_message_text || conv.last_message_data || conv.last_message_object || conv.lastMessage || null;
        if (!raw) return "Bắt đầu cuộc trò chuyện";

        // nếu backend trả object { content, type, original_name, file_type }
        if (typeof raw === "object") {
            const type = raw.type || raw.file_type || raw.message_type || "";
            const content = raw.content || raw.text || raw.message || "";
            if (type) {
                if (type === "image") return "Hình ảnh";
                if (type === "video") return "Video";
                if (type === "audio") return "Audio";
                // file: show original name hoặc filename
                if (type === "file" || type === "document" || type === "archive") {
                    return raw.original_name || content || "Tệp đính kèm";
                }
            }
            // fallback: dùng content/text nếu có
            if (content) return content;
            // hoặc trường tên file
            return raw.original_name || raw.filename || "Tệp đính kèm";
        }

        // nếu là string -> hiển thị trực tiếp
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
                    <motion.aside
                        initial={isMobile ? { x: -300, opacity: 0 } : false}
                        animate={{ x: 0, opacity: 1 }}
                        exit={isMobile ? { x: -300, opacity: 0 } : {}}
                        className="w-full md:w-80 lg:w-96 bg-card border-r border-border flex flex-col"
                    >
                        {/* Header */}
                        <div
                            className="p-4 border-b border-white/10 
                                       bg-gradient-to-r from-violet-500/15 via-fuchsia-500/15 to-sky-500/15 
                                       backdrop-blur-lg rounded-t-xl shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-400 bg-clip-text text-transparent drop-shadow-sm">
                                    Tin nhắn
                                </h1>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => navigate("/")}
                                        className="p-2 rounded-xl hover:bg-white/20 transition-colors shadow-inner backdrop-blur-sm"
                                        title="Về trang chủ"
                                    >
                                        <Home size={20} />
                                    </button>

                                    <button
                                        onClick={handleShowAddConversation}
                                        className="p-2 rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all"
                                        title="Tạo cuộc trò chuyện mới"
                                    >
                                        <UserPlus size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 "
                                    size={18}
                                />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm cuộc trò chuyện..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/10 rounded-xl 
                                               focus:ring-2 focus:ring-violet-400/40 focus:border-transparent 
                                               backdrop-blur-sm transition-all outline-none"
                                />
                            </div>
                        </div>


                        {/* Conversations List */}
                        <div className="flex-1 overflow-y-auto chat-scroll">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                                </div>
                            ) : filteredConversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                    <MessageCircle size={48} className="text-muted-foreground mb-3 opacity-50" />
                                    <p className="text-muted-foreground">Chưa có cuộc trò chuyện nào</p>
                                </div>
                            ) : (
                                filteredConversations.map((conv) => {
                                    const otherUser = conv.participants.find((p) => p.id !== user?.id);
                                    const isOnline = onlineUsers.includes(otherUser?.id || 0);
                                    const isSelected = selectedConversation?.id === conv.id;
                                    const { messageColor } = getMessageColors(conv);

                                    return (
                                        <motion.div
                                            key={conv.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex items-center gap-3 p-4 border-b border-border/50 cursor-pointer transition-colors ${isSelected
                                                ? "bg-primary/10 border-l-4 border-l-primary"
                                                : "hover:bg-[hsl(var(--chat-hover))]"
                                                }`}
                                            onClick={() => handleConversationSelect(conv)}
                                            style={{
                                                borderLeftColor: isSelected ? messageColor : undefined
                                            }}
                                        >
                                            {/* Avatar with color indicator */}
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={conv.type === 'group'
                                                        ? conv.avatar || "/images/avatars/Avt-Group-Default.png"
                                                        : otherUser?.avatar || "/images/avatars/Avt-Default.png"
                                                    }
                                                    alt={conv.type === 'group' ? conv.name : otherUser?.name}
                                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
                                                />
                                                {/* Color theme indicator */}
                                                {conv.background_color && (
                                                    <div 
                                                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                                                        style={{ backgroundColor: messageColor }}
                                                    />
                                                )}
                                                {conv.type === 'private' && isOnline && (
                                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-card"></span>
                                                )}
                                            </div>

                                            {/* Rest of conversation item */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-semibold text-foreground truncate">
                                                        {conv.type === 'group' ? conv.name : otherUser?.name}
                                                    </h3>
                                                    <span className="text-xs text-muted-foreground flex-shrink-0">
                                                        {formatTime(conv.last_message_at || new Date().toISOString())}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {getConversationPreview(conv)}
                                                </p>
                                            </div>

                                            {conv.unread_count > 0 && (
                                                <div 
                                                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-glow"
                                                    style={{ backgroundColor: messageColor }}
                                                >
                                                    {conv.unread_count}
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {isMobile && (
                                    <button
                                        onClick={handleBackToSidebar}
                                        className="p-2 hover:bg-secondary rounded-xl transition-colors"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                )}
                                <div className="relative">
                                    <img
                                        src={selectedConversation.type === 'group'
                                            ? selectedConversation.avatar || "/images/avatars/Avt-Group-Default.png"
                                            : currentUser?.avatar || "/images/avatars/Avt-Default.png"
                                        }
                                        alt={selectedConversation.type === 'group' ? selectedConversation.name : currentUser?.name}
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-border"
                                    />
                                    {selectedConversation.type === 'private' && onlineUsers.includes(currentUser?.id || 0) && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-card"></span>
                                    )}
                                </div>
                                <div>
                                    <h2 className="font-semibold text-foreground">
                                        {selectedConversation.type === 'group'
                                            ? selectedConversation.name
                                            : currentUser?.name}
                                    </h2>
                                    {selectedConversation.type === 'private' && (
                                        <p className="text-xs text-muted-foreground">
                                            {onlineUsers.includes(currentUser?.id || 0) ? "Đang hoạt động" : "Không hoạt động"}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={startAudioCall}
                                    className="p-2.5 hover:bg-secondary rounded-xl transition-colors"
                                    title="Gọi thoại"
                                >
                                    <Phone size={20} className="text-primary" />
                                </button>
                                <button
                                    onClick={startVideoCall}
                                    className="p-2.5 hover:bg-secondary rounded-xl transition-colors"
                                    title="Gọi video"
                                >
                                    <Video size={20} className="text-primary" />
                                </button>
                                <button
                                    onClick={() => setShowChatInfo(!showChatInfo)}
                                    className="p-2.5 hover:bg-secondary rounded-xl transition-colors"
                                    title="Thông tin"
                                >
                                    <MoreVertical size={20} className="text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            ref={messagesContainerRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll"
                            style={{
                                background: getMessageColors(selectedConversation).backgroundStyle
                            }}
                        >
                            {isLoadingMessages ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <MessageCircle size={64} className="text-muted-foreground mb-4 opacity-30" />
                                    <p className="text-muted-foreground">Chưa có tin nhắn nào</p>
                                    <p className="text-sm text-muted-foreground">Gửi tin nhắn đầu tiên!</p>
                                </div>
                            ) : (
                                messages.map((message, index) => {
                                    const messageKey = `${selectedConversation.id}_${message.id || message.tempId || index}`;
                                    const isOwnMessage = message.senderId === Number(user?.id);
                                    const showAvatar =
                                        !isOwnMessage &&
                                        (index === 0 || messages[index - 1]?.senderId !== message.senderId);

                                    const isFileType =
                                        message.type === "image" ||
                                        message.type === "video" ||
                                        message.type === "file";

                                    const { messageColor, messageTextColor, secondaryMessageColor } = getMessageColors(selectedConversation);

                                    return (
                                        <motion.div
                                            key={messageKey}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex gap-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}
                                        >
                                            {!isOwnMessage && showAvatar && (
                                                <img
                                                    src={message.sender?.avatar || "/images/avatars/Avt-Default.png"}
                                                    alt={message.sender?.name}
                                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                                />
                                            )}
                                            {!isOwnMessage && !showAvatar && <div className="w-8" />}

                                            <div className={`max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"} flex flex-col`}>
                                                {!isOwnMessage && showAvatar && (
                                                    <span className="text-xs font-semibold mb-1 px-1">
                                                        {message.sender?.name}
                                                    </span>
                                                )}

                                                {/* File types render without bubble */}
                                                {isFileType ? (
                                                    <div className={`${message.isPending ? "opacity-60" : ""}`}>
                                                        {renderMessage(message)}
                                                    </div>
                                                ) : (
                                                    /* Text message with dynamic colored bubble */
                                                    <div
                                                        className={`px-4 py-2 rounded-2xl min-w-0 max-w-full ${isOwnMessage
                                                            ? "rounded-br-sm"
                                                            : "rounded-bl-sm"
                                                        } ${message.isPending ? "opacity-60" : ""}`}
                                                        style={{
                                                            backgroundColor: isOwnMessage ? messageColor : secondaryMessageColor,
                                                            color: isOwnMessage ? messageTextColor : '#374151',
                                                            wordBreak: 'break-word',
                                                            overflowWrap: 'break-word',
                                                            hyphens: 'auto'
                                                        }}
                                                    >
                                                        {renderMessage(message)}
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-1 text-xs mt-1 px-1">
                                                    <span>{formatMessageTime(message.timestamp)}</span>
                                                    {isOwnMessage && (
                                                        <>
                                                            {message.isPending ? (
                                                                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                            ) : message.isRead ? (
                                                                <CheckCheck size={14} style={{ color: messageColor }} />
                                                            ) : (
                                                                <Check size={14} />
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-card/80 backdrop-blur-sm">
                            <div className="flex items-end gap-2">
                                <label className="flex-shrink-0 p-4 hover:bg-secondary rounded-xl cursor-pointer transition-colors">
                                    <Paperclip size={20} className="text-muted-foreground" />
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                </label>

                                <div className="flex-1 relative">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => {
                                            setNewMessage(e.target.value);
                                            // Auto resize textarea
                                            e.target.style.height = 'auto';
                                            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        }}
                                        placeholder="Nhập tin nhắn... (Shift+Enter để xuống dòng)"
                                        className="w-full px-4 py-2.5 pr-12 bg-secondary/50 border border-input rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none resize-none min-h-[44px] max-h-[120px] overflow-y-auto"
                                        rows={1}
                                        style={{ height: '44px' }}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 bottom-2.5 p-1.5 hover:bg-secondary/80 rounded-lg transition-colors"
                                    >
                                        <Smile size={20} className="text-muted-foreground" />
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="p-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-glow self-end"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <MessageCircle size={80} className="mx-auto text-muted-foreground mb-6 opacity-20" />
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                Chào mừng đến với VibeMarket Chat
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                Chọn một cuộc trò chuyện để bắt đầu nhắn tin
                            </p>
                            <button
                                onClick={handleShowAddConversation}
                                className="
                                    px-6 py-3 rounded-xl font-medium text-white
                                    bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-400
                                    shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                                    transition-all duration-300
                                    focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2
                                "
                            >
                                Tạo cuộc trò chuyện mới
                            </button>

                        </div>
                    </div>
                )}
            </div>

            {/* Chat Info Sidebar */}
            {selectedConversation && showChatInfo && (
                <ChatInfoSidebar
                    conversation={selectedConversation}
                    onClose={() => setShowChatInfo(false)}
                    onLeave={handleLeaveConversation}
                    onConversationUpdate={handleConversationUpdate}
                />
            )}

            {/* Call Modal */}
            {showCallModal && currentCallData && (
                <CallModal
                    isOpen={showCallModal}
                    onClose={handleCloseCallModal}
                    type={callModalType}
                    callData={currentCallData}
                    onAccept={handleAcceptCall}
                    onReject={handleRejectCall}
                    onCancel={handleCancelCall}
                />
            )}

            {/* New Chat Modal */}
            <Transition.Root show={showNewChatModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={setShowNewChatModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-card border border-border p-6 shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-bold mb-4 text-foreground">
                                        Tạo cuộc trò chuyện mới
                                    </Dialog.Title>

                                    <form onSubmit={handleCreateConversation} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-foreground">
                                                Loại chat
                                            </label>
                                            <select
                                                value={chatType}
                                                onChange={(e) => {
                                                    setChatType(e.target.value as "private" | "group");
                                                    setSelectedUserIds([]);
                                                    setGroupName("");
                                                }}
                                                className="w-full px-4 py-2.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none"
                                            >
                                                <option value="private">Riêng tư</option>
                                                <option value="group">Nhóm</option>
                                            </select>
                                        </div>

                                        {chatType === "group" && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium mb-2 text-foreground">
                                                        Tên nhóm
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={groupName}
                                                        onChange={(e) => setGroupName(e.target.value)}
                                                        className="w-full px-4 py-2.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none"
                                                        placeholder="Nhập tên nhóm..."
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium mb-2 text-foreground">
                                                        Avatar nhóm
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            value={groupAvatar}
                                                            onChange={(e) => setGroupAvatar(e.target.value)}
                                                            className="flex-1 px-4 py-2.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none"
                                                            placeholder="Dán link ảnh (tùy chọn)"
                                                        />
                                                        <label className="p-2.5 bg-secondary hover:bg-secondary/80 rounded-xl cursor-pointer transition-colors">
                                                            <Image size={20} className="text-muted-foreground" />
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={handleGroupAvatarChange}
                                                                disabled={isUploadingAvatar}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-foreground">
                                                Tìm kiếm người dùng
                                            </label>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="Nhập tên người dùng..."
                                                    value={searchUser}
                                                    onChange={(e) => setSearchUser(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-foreground">
                                                {chatType === "private" ? "Chọn 1 người" : "Chọn thành viên"}
                                            </label>
                                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto chat-scroll p-1">
                                                {userList
                                                    .filter((u) =>
                                                        u.name.toLowerCase().includes(searchUser.toLowerCase())
                                                    )
                                                    .map((u) => (
                                                        <button
                                                            type="button"
                                                            key={u.id}
                                                            onClick={() => {
                                                                if (chatType === "private") {
                                                                    setSelectedUserIds([u.id]);
                                                                } else {
                                                                    setSelectedUserIds((prev) =>
                                                                        prev.includes(u.id)
                                                                            ? prev.filter((id) => id !== u.id)
                                                                            : [...prev, u.id]
                                                                    );
                                                                }
                                                            }}
                                                            className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${selectedUserIds.includes(u.id)
                                                                ? "bg-primary/10 border-primary"
                                                                : "bg-background border-border hover:bg-secondary"
                                                                }`}
                                                        >
                                                            <img
                                                                src={u.avatar || "/images/avatars/Avt-Default.png"}
                                                                alt={u.name}
                                                                className="w-8 h-8 rounded-full object-cover"
                                                            />
                                                            <span className="text-sm truncate">{u.name}</span>
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowNewChatModal(false)}
                                                className="flex-1 px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl transition-colors"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isCreating}
                                                className={`
                                                    flex-1 px-5 py-2.5 rounded-xl font-medium text-white transition-all
                                                    bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500
                                                    shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                                                    disabled:opacity-50 disabled:cursor-not-allowed
                                                    focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2
                                                `}
                                            >
                                                {isCreating ? "Đang tạo..." : "Tạo"}
                                            </button>

                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
};

export default Chat;
