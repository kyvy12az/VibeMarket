import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
    Search,
    Send,
    Paperclip,
    Image as ImageIcon,
    File,
    Video,
    ArrowLeft,
    MoreVertical,
    Phone,
    VideoIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Participant {
    id: number;
    name: string;
    avatar?: string;
}

interface Message {
    id?: number;
    tempId?: string;
    senderId: number;
    conversationId: number;
    content: string;
    type: 'text' | 'image' | 'file' | 'video';
    file_url?: string;
    fileUrl?: string;
    thumbnail_url?: string;
    file_type?: string;
    file_size?: number;
    original_name?: string;
    timestamp: string;
    isPending?: boolean;
    isRead?: boolean;
    sender?: {
        id: number;
        name: string;
        avatar?: string;
    };
}

interface Conversation {
    id: number;
    type: 'private' | 'group';
    conversation_category?: string;
    seller_id?: number;
    name?: string;
    avatar?: string;
    participants: Participant[];
    last_message?: any;
    last_message_text?: string;
    last_message_time?: string;
    unread_count?: number;
    message_color?: string;
    message_text_color?: string;
    background_color?: string;
}

interface UploadedFile {
    file_url: string;
    thumbnail_url?: string;
    file_type: string;
    file_size: number;
    original_name: string;
}

const ShopChatManagement: React.FC = () => {
    const { user } = useAuth();
    const [isMobile, setIsMobile] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<number[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);
    const pendingMessages = useRef<Map<string, Message>>(new Map());
    const shouldAutoScroll = useRef(true);
    const currentConversationIdRef = useRef<number | null>(null);

    const getToken = () => {
        const candidates = [
            localStorage.getItem('vibeventure_token'),
            localStorage.getItem('token'),
            sessionStorage.getItem('vibeventure_token'),
            sessionStorage.getItem('token'),
        ];
        for (const c of candidates) {
            if (c) return c.replace(/^Bearer\s+/i, '');
        }
        return null;
    };

    // Fetch shop conversations
    const fetchConversations = async () => {
        try {
            const token = getToken();
            if (!token || !user) return;

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/chat/conversations.php?category=shop&as_seller=true`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = await response.json();

            if (data.success) {
                setConversations(data.data || []);
            }
        } catch (error: any) {
            console.error('Error fetching shop conversations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initialize socket
    const initializeSocket = useCallback(() => {
        const token = getToken();
        if (!token || !user) return;
        if (socketRef.current) socketRef.current.disconnect();

        socketRef.current = io(`${import.meta.env.VITE_BACKEND_WS_URL}`, {
            auth: { token },
            transports: ['websocket'],
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('✅ Shop socket connected');
        });

        socket.on('new_message', (message: Message) => {
            if (currentConversationIdRef.current === message.conversationId) {
                setMessages((prev) => {
                    const exists = prev.some(
                        (m) => m.id === message.id || m.tempId === message.tempId
                    );
                    if (exists) return prev;
                    return [...prev, message];
                });
            }

            setConversations((prev) =>
                prev.map((conv) =>
                    conv.id === message.conversationId
                        ? {
                              ...conv,
                              last_message: message.content,
                              last_message_time: message.timestamp,
                              unread_count:
                                  currentConversationIdRef.current === message.conversationId
                                      ? 0
                                      : (conv.unread_count || 0) + 1,
                          }
                        : conv
                )
            );
        });

        socket.on('message_saved', (savedMessage: Message) => {
            if (savedMessage.tempId && pendingMessages.current.has(savedMessage.tempId)) {
                pendingMessages.current.delete(savedMessage.tempId);
            }

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.tempId === savedMessage.tempId
                        ? { ...savedMessage, isPending: false }
                        : msg
                )
            );
        });

        socket.on('users_online', (userIds: number[]) => setOnlineUsers(userIds));

        return socket;
    }, [user]);

    // Fetch messages
    const fetchMessages = async (conversationId: number) => {
        try {
            setIsLoadingMessages(true);
            const token = getToken();
            if (!token) return;

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/chat/messages.php?conversation_id=${conversationId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = await response.json();

            if (data.success) {
                setMessages(data.data || []);
                setTimeout(() => scrollToBottom(true), 100);
            }
        } catch (error: any) {
            console.error('Error fetching messages:', error);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    // Send message
    const sendMessage = async (
        content: string,
        type: 'text' | 'image' | 'file' | 'video' = 'text',
        fileData?: UploadedFile
    ) => {
        if (!selectedConversation || !user || !socketRef.current) return;

        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const tempMessage: Message = {
            tempId,
            senderId: Number(user.id),
            conversationId: selectedConversation.id,
            content,
            type,
            file_url: fileData?.file_url,
            timestamp: new Date().toISOString(),
            isPending: true,
            isRead: false,
            sender: {
                id: Number(user.id),
                name: user.name,
                avatar: user.avatar || '/images/avatars/Avt-Default.png',
            },
        };

        setMessages((prev) => [...prev, tempMessage]);

        socketRef.current.emit('send_message', {
            conversationId: selectedConversation.id,
            content,
            type,
            fileData,
            tempId,
        });
    };

    const joinConversation = useCallback((conversationId: number) => {
        if (socketRef.current) socketRef.current.emit('join_conversation', conversationId);
    }, []);

    const leaveConversation = useCallback((conversationId: number) => {
        if (socketRef.current) socketRef.current.emit('leave_conversation', conversationId);
    }, []);

    const scrollToBottom = useCallback((force = false) => {
        if (messagesEndRef.current && (shouldAutoScroll.current || force)) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    const handleConversationSelect = async (conversation: Conversation) => {
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

        await fetchMessages(conversation.id);
        joinConversation(conversation.id);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation || !user) return;

        await sendMessage(newMessage.trim());
        setNewMessage('');
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'Vừa xong';
        if (minutes < 60) return `${minutes} phút`;
        if (minutes < 1440) return `${Math.floor(minutes / 60)} giờ`;
        return date.toLocaleDateString('vi-VN');
    };

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (user) {
            fetchConversations();
            initializeSocket();
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [user, initializeSocket]);

    useEffect(() => {
        if (selectedConversation) {
            joinConversation(selectedConversation.id);
        }

        return () => {
            if (selectedConversation) {
                leaveConversation(selectedConversation.id);
            }
        };
    }, [selectedConversation?.id, joinConversation, leaveConversation]);

    const filteredConversations = conversations.filter((conv) =>
        conv.participants.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const currentCustomer = selectedConversation?.participants.find((p) => p.id !== user?.id);

    return (
        <div className="h-screen flex flex-col bg-background">
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Conversations List */}
                {(!isMobile || showSidebar) && (
                    <div className="w-full md:w-80 border-r border-border flex flex-col bg-card">
                        <div className="p-4 border-b border-border">
                            <h2 className="text-xl font-bold mb-3">Tin nhắn khách hàng</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm khách hàng..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {isLoading ? (
                                <div className="p-8 text-center">
                                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                                </div>
                            ) : filteredConversations.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    Chưa có tin nhắn nào
                                </div>
                            ) : (
                                filteredConversations.map((conv) => {
                                    const customer = conv.participants.find((p) => p.id !== user?.id);
                                    const isOnline = customer && onlineUsers.includes(customer.id);

                                    return (
                                        <motion.div
                                            key={conv.id}
                                            whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                                            onClick={() => handleConversationSelect(conv)}
                                            className={`p-4 cursor-pointer border-b border-border transition-colors ${
                                                selectedConversation?.id === conv.id
                                                    ? 'bg-accent'
                                                    : ''
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={customer?.avatar || '/images/avatars/Avt-Default.png'}
                                                        />
                                                        <AvatarFallback>
                                                            {customer?.name?.[0]?.toUpperCase() || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {isOnline && (
                                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="font-semibold truncate">
                                                            {customer?.name || 'Khách hàng'}
                                                        </h3>
                                                        {conv.last_message_time && (
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatTime(conv.last_message_time)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {typeof conv.last_message === 'string'
                                                                ? conv.last_message
                                                                : conv.last_message_text || 'Chưa có tin nhắn'}
                                                        </p>
                                                        {conv.unread_count && conv.unread_count > 0 && (
                                                            <Badge className="ml-2 bg-primary text-primary-foreground">
                                                                {conv.unread_count}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

                {/* Chat Area */}
                {(!isMobile || !showSidebar) && (
                    <div className="flex-1 flex flex-col bg-background">
                        {selectedConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-border bg-card flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {isMobile && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setShowSidebar(true)}
                                            >
                                                <ArrowLeft className="h-5 w-5" />
                                            </Button>
                                        )}
                                        <Avatar>
                                            <AvatarImage
                                                src={currentCustomer?.avatar || '/images/avatars/Avt-Default.png'}
                                            />
                                            <AvatarFallback>
                                                {currentCustomer?.name?.[0]?.toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold">
                                                {currentCustomer?.name || 'Khách hàng'}
                                            </h3>
                                            {currentCustomer && onlineUsers.includes(currentCustomer.id) ? (
                                                <p className="text-xs text-green-500">Đang hoạt động</p>
                                            ) : (
                                                <p className="text-xs text-muted-foreground">Không hoạt động</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div
                                    ref={messagesContainerRef}
                                    className="flex-1 overflow-y-auto p-4 space-y-4"
                                >
                                    {isLoadingMessages ? (
                                        <div className="flex justify-center items-center h-full">
                                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                            <p>Chưa có tin nhắn</p>
                                            <p className="text-sm">Gửi tin nhắn đầu tiên cho khách hàng</p>
                                        </div>
                                    ) : (
                                        messages.map((message) => {
                                            const isOwn = message.senderId === Number(user?.id);
                                            return (
                                                <motion.div
                                                    key={message.id || message.tempId}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                                            isOwn
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'bg-muted'
                                                        }`}
                                                    >
                                                        {message.type === 'text' && (
                                                            <p className="break-words">{message.content}</p>
                                                        )}
                                                        {message.type === 'image' && (
                                                            <img
                                                                src={message.file_url || message.fileUrl}
                                                                alt="Hình ảnh"
                                                                className="rounded-lg max-w-xs"
                                                            />
                                                        )}
                                                        <span className="text-xs opacity-70 mt-1 block">
                                                            {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-card">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            placeholder="Nhập tin nhắn..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            className="flex-1"
                                        />
                                        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold mb-2">Chọn một cuộc trò chuyện</h3>
                                    <p className="text-sm">Chọn khách hàng để bắt đầu trò chuyện</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopChatManagement;
