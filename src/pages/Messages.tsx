import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Search,
    Send,
    Smile,
    Paperclip,
    Phone,
    Video,
    MoreVertical,
    Users,
    User,
    Circle,
    Image as ImageIcon,
    ArrowLeft,
    MessageCircle,
    Home,
    Save,
    Trash,
    X,
    Info,
    BellOff,
    Archive,
    Trash2,
    UserX,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: Date;
    read: boolean;
    type: "text" | "image";
}

interface Conversation {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: Date;
    unreadCount: number;
    isOnline: boolean;
    isGroup: boolean;
    members?: number;
}

const Messages = () => {
    const [selectedConversation, setSelectedConversation] = useState<string | null>("1");
    const [messageInput, setMessageInput] = useState("");
    const [chatFilter, setChatFilter] = useState<"all" | "personal" | "group">("all");
    const [isMobileView, setIsMobileView] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Mock conversations data
    const conversations: Conversation[] = [
        {
            id: "1",
            name: "Nguyễn Văn An",
            avatar: "/placeholder.svg",
            lastMessage: "Sản phẩm của bạn còn hàng không?",
            timestamp: new Date(Date.now() - 5 * 60000),
            unreadCount: 2,
            isOnline: true,
            isGroup: false,
        },
        {
            id: "2",
            name: "Nhóm Thời Trang Việt",
            avatar: "/placeholder.svg",
            lastMessage: "Trần Minh: Flash sale đêm nay nhé mọi người!",
            timestamp: new Date(Date.now() - 30 * 60000),
            unreadCount: 5,
            isOnline: false,
            isGroup: true,
            members: 128,
        },
        {
            id: "3",
            name: "Lê Thị Hoa",
            avatar: "/placeholder.svg",
            lastMessage: "Cảm ơn bạn nhiều nhé!",
            timestamp: new Date(Date.now() - 2 * 3600000),
            unreadCount: 0,
            isOnline: true,
            isGroup: false,
        },
        {
            id: "4",
            name: "Local Brand Community",
            avatar: "/placeholder.svg",
            lastMessage: "Vũ Anh: Có ai mua được không?",
            timestamp: new Date(Date.now() - 5 * 3600000),
            unreadCount: 12,
            isOnline: false,
            isGroup: true,
            members: 456,
        },
        {
            id: "5",
            name: "Phạm Minh Tuấn",
            avatar: "/placeholder.svg",
            lastMessage: "Ok bạn, tối mình gọi video nhé",
            timestamp: new Date(Date.now() - 24 * 3600000),
            unreadCount: 0,
            isOnline: false,
            isGroup: false,
        },
    ];

    // Mock messages data for selected conversation
    const messages: Message[] = [
        {
            id: "1",
            senderId: "1",
            content: "Chào bạn, mình muốn hỏi về sản phẩm này",
            timestamp: new Date(Date.now() - 30 * 60000),
            read: true,
            type: "text",
        },
        {
            id: "2",
            senderId: "me",
            content: "Chào bạn! Bạn muốn hỏi gì về sản phẩm ạ?",
            timestamp: new Date(Date.now() - 28 * 60000),
            read: true,
            type: "text",
        },
        {
            id: "3",
            senderId: "1",
            content: "Sản phẩm này còn size M không bạn?",
            timestamp: new Date(Date.now() - 25 * 60000),
            read: true,
            type: "text",
        },
        {
            id: "4",
            senderId: "me",
            content: "Size M vẫn còn hàng bạn nhé! Bạn muốn đặt ngay không?",
            timestamp: new Date(Date.now() - 20 * 60000),
            read: true,
            type: "text",
        },
        {
            id: "5",
            senderId: "1",
            content: "Sản phẩm của bạn còn hàng không?",
            timestamp: new Date(Date.now() - 5 * 60000),
            read: false,
            type: "text",
        },
    ];

    const filteredConversations = conversations.filter((conv) => {
        if (chatFilter === "personal") return !conv.isGroup;
        if (chatFilter === "group") return conv.isGroup;
        return true;
    });

    const selectedConv = conversations.find((c) => c.id === selectedConversation);

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Vừa xong";
        if (minutes < 60) return `${minutes} phút`;
        if (hours < 24) return `${hours} giờ`;
        return `${days} ngày`;
    };

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            // Handle send message logic
            setMessageInput("");
        }
    };

    return (
        <div className="fixed inset-0 min-h-screen min-w-full bg-background">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-none shadow-none border-none overflow-hidden w-full h-full"
                style={{ height: "100vh" }}
            >
                <div className="grid grid-cols-12 h-full">
                    {/* Sidebar - Conversation List */}
                    <div className={`col-span-12 md:col-span-4 lg:col-span-3 border-r border-border flex flex-col ${isMobileView && selectedConversation ? 'hidden md:flex' : ''}`}>
                        {/* Header */}
                        <div className="p-4 border-b border-border">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <MessageCircle className="w-7 h-7" />
                                    Tin nhắn
                                </h2>
                                {/* Icon Home */}
                                <Link
                                    to="/"
                                    className="p-2 rounded-full border border-border hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
                                    title="Trang chủ"
                                >
                                    <Home className="w-5 h-5" />
                                </Link>

                            </div>

                            {/* Search */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input placeholder="Tìm kiếm cuộc trò chuyện..." className="pl-10" />
                            </div>
                            {/* Filter Tabs */}
                            <Tabs value={chatFilter} onValueChange={(v) => setChatFilter(v as any)}>
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="all" className="text-xs">
                                        Tất cả
                                    </TabsTrigger>
                                    <TabsTrigger value="personal" className="text-xs">
                                        <User className="w-3 h-3 mr-1" />
                                        Cá nhân
                                    </TabsTrigger>
                                    <TabsTrigger value="group" className="text-xs">
                                        <Users className="w-3 h-3 mr-1" />
                                        Nhóm
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                        {/* Conversations List */}
                        <ScrollArea className="flex-1">
                            <div className="p-2">
                                {filteredConversations.map((conv) => (
                                    <motion.div
                                        key={conv.id}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => {
                                            setSelectedConversation(conv.id);
                                            setIsMobileView(true);
                                        }}
                                        className={`p-3 rounded-lg cursor-pointer transition-smooth mb-2 ${selectedConversation === conv.id
                                            ? "bg-primary/10 border border-primary/20"
                                            : "hover:bg-accent"
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="relative">
                                                <Avatar className="w-12 h-12">
                                                    <AvatarImage src={conv.avatar} />
                                                    <AvatarFallback>
                                                        {conv.isGroup ? <Users className="w-6 h-6" /> : conv.name[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {!conv.isGroup && conv.isOnline && (
                                                    <Circle className="absolute bottom-0 right-0 w-3 h-3 fill-green-500 text-green-500" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-semibold text-sm truncate">
                                                        {conv.name}
                                                        {conv.isGroup && (
                                                            <Badge variant="secondary" className="ml-2 text-xs">
                                                                {conv.members}
                                                            </Badge>
                                                        )}
                                                    </h3>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatTime(conv.timestamp)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {conv.lastMessage}
                                                    </p>
                                                    {conv.unreadCount > 0 && (
                                                        <Badge className="bg-primary text-xs ml-2">
                                                            {conv.unreadCount}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                    {/* Main Chat Area */}
                    <div className={`col-span-12 md:col-span-8 lg:col-span-9 flex flex-col ${!isMobileView && selectedConversation ? 'hidden md:flex' : ''}`}>
                        {selectedConv ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-border flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="md:hidden"
                                            onClick={() => setIsMobileView(false)}
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                        </Button>
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={selectedConv.avatar} />
                                            <AvatarFallback>
                                                {selectedConv.isGroup ? (
                                                    <Users className="w-5 h-5" />
                                                ) : (
                                                    selectedConv.name[0]
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold">{selectedConv.name}</h3>
                                            <p className="text-xs text-muted-foreground">
                                                {selectedConv.isGroup
                                                    ? `${selectedConv.members} thành viên`
                                                    : selectedConv.isOnline
                                                        ? "Đang hoạt động"
                                                        : "Không hoạt động"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="text-primary">
                                            <Phone className="w-5 h-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-primary">
                                            <Video className="w-5 h-5" />
                                        </Button>

                                        {/* Dropdown Menu cho MoreVertical */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="w-5 h-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56">
                                                <DropdownMenuItem>
                                                    <Info className="w-4 h-4 mr-2" />
                                                    Thông tin cuộc trò chuyện
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Search className="w-4 h-4 mr-2" />
                                                    Tìm kiếm trong đoạn chat
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <BellOff className="w-4 h-4 mr-2" />
                                                    Tắt thông báo
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Archive className="w-4 h-4 mr-2" />
                                                    Lưu trữ cuộc trò chuyện
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Xóa cuộc trò chuyện
                                                </DropdownMenuItem>
                                                {!selectedConv.isGroup && (
                                                    <DropdownMenuItem className="text-destructive">
                                                        <UserX className="w-4 h-4 mr-2" />
                                                        Chặn người dùng
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                {/* Messages Area */}
                                <ScrollArea className="flex-1 p-4">
                                    <div className="space-y-4">
                                        {messages.map((message) => (
                                            <motion.div
                                                key={message.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"
                                                    }`}
                                            >
                                                <div
                                                    className={`max-w-[70%] ${message.senderId === "me"
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted"
                                                        } rounded-2xl px-4 py-2`}
                                                >
                                                    <p className="text-sm">{message.content}</p>
                                                    <p
                                                        className={`text-xs mt-1 ${message.senderId === "me"
                                                            ? "text-primary-foreground/70"
                                                            : "text-muted-foreground"
                                                            }`}
                                                    >
                                                        {formatTime(message.timestamp)}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </ScrollArea>
                                {/* Message Input */}
                                <div className="p-4 border-t border-border">
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon">
                                            <Paperclip className="w-5 h-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <ImageIcon className="w-5 h-5" />
                                        </Button>
                                        <Input
                                            placeholder="Nhập tin nhắn..."
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                            className="flex-1"
                                        />
                                        <Button variant="ghost" size="icon">
                                            <Smile className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            onClick={handleSendMessage}
                                            disabled={!messageInput.trim()}
                                        >
                                            <Send className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <Users className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-xl font-semibold mb-2">
                                        Chọn một cuộc trò chuyện
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Chọn từ danh sách bên trái để bắt đầu nhắn tin
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Messages;