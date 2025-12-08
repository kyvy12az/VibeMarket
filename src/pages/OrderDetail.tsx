import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Phone,
    Mail,
    MapPin,
    Calendar,
    CreditCard,
    Store,
    Star,
    MessageCircle,
    ShoppingCart,
    RefreshCw,
    Printer,
    Share2,
    ChevronRight,
    Clock,
    Sparkles,
    Download,
    AlertCircle
} from 'lucide-react';

const OrderDetail = () => {
    const { code } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!code) return;
        setLoading(true);
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/order_detail.php?code=${code}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setOrder(data.order);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [code]);

    const handleChatWithShop = async (sellerId: number, sellerUserId: number) => {
        console.log('handleChatWithShop called with:', { sellerId, sellerUserId, user });
        
        if (!user) {
            toast.error('Vui lòng đăng nhập để chat với shop');
            return;
        }

        if (!sellerId || !sellerUserId) {
            toast.error('Thông tin shop không hợp lệ');
            console.error('Missing seller data:', { sellerId, sellerUserId });
            return;
        }

        try {
            const token = localStorage.getItem('vibeventure_token') || localStorage.getItem('token');
            if (!token) {
                toast.error('Vui lòng đăng nhập để chat');
                return;
            }

            // Check if conversation already exists
            const checkResponse = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/chat/conversations.php?category=shop&seller_id=${sellerId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token.replace('Bearer ', '')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const checkData = await checkResponse.json();

            if (checkData.success && checkData.data.length > 0) {
                // Conversation exists, navigate to messages page
                navigate('/messages', { 
                    state: { 
                        selectedConversationId: checkData.data[0].id,
                        sellerId: sellerId 
                    } 
                });
                return;
            }

            // Create new conversation with participants array
            const createResponse = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/chat/conversations.php`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token.replace('Bearer ', '')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        type: 'private',
                        conversation_category: 'shop',
                        seller_id: sellerId,
                        participants: [Number(user.id), sellerUserId] // Add participants array
                    })
                }
            );

            const createData = await createResponse.json();

            if (createData.success) {
                toast.success('Đã tạo cuộc trò chuyện với shop');
                // Navigate with conversation ID from response
                navigate('/messages', { 
                    state: { 
                        selectedConversationId: createData.data.id,
                        sellerId: sellerId 
                    } 
                });
            } else {
                throw new Error(createData.message || 'Không thể tạo cuộc trò chuyện');
            }
        } catch (error: any) {
            console.error('Error creating shop conversation:', error);
            toast.error(error.message || 'Không thể tạo cuộc trò chuyện với shop');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-muted-foreground">Đang tải chi tiết đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4"
                >
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold">Không tìm thấy đơn hàng</h2>
                    <Button onClick={() => navigate('/orders')} className="bg-gradient-to-r from-primary to-purple-600">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại danh sách
                    </Button>
                </motion.div>
            </div>
        );
    }

    const getStatusIcon = (status: string, completed: boolean) => {
        if (!completed) return <div className="w-3 h-3 rounded-full border-2 border-muted-foreground bg-background" />;
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'processing': return <Package className="w-4 h-4 text-primary" />;
            case 'shipped': return <Truck className="w-4 h-4 text-orange-500" />;
            case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return <div className="w-3 h-3 rounded-full bg-muted" />;
        }
    };

    const getStatusConfig = (status: string) => {
        const configs = {
            pending: {
                label: "Chờ xác nhận",
                gradient: "from-yellow-500 to-orange-500",
                bg: "bg-yellow-50 dark:bg-yellow-950/20",
                text: "text-yellow-700 dark:text-yellow-300",
                icon: Clock
            },
            processing: {
                label: "Đang chuẩn bị",
                gradient: "from-blue-500 to-cyan-500",
                bg: "bg-blue-50 dark:bg-blue-950/20",
                text: "text-blue-700 dark:text-blue-300",
                icon: Package
            },
            shipped: {
                label: "Đang giao hàng",
                gradient: "from-purple-500 to-pink-500",
                bg: "bg-purple-50 dark:bg-purple-950/20",
                text: "text-purple-700 dark:text-purple-300",
                icon: Truck
            },
            delivered: {
                label: "Đã giao hàng",
                gradient: "from-green-500 to-emerald-500",
                bg: "bg-green-50 dark:bg-green-950/20",
                text: "text-green-700 dark:text-green-300",
                icon: CheckCircle
            },
            cancelled: {
                label: "Đã hủy",
                gradient: "from-red-500 to-pink-500",
                bg: "bg-red-50 dark:bg-red-950/20",
                text: "text-red-700 dark:text-red-300",
                icon: XCircle
            }
        };
        return configs[status as keyof typeof configs] || configs.pending;
    };

    const getStatusBadge = (status: string) => {
        const config = getStatusConfig(status);
        const Icon = config.icon;
        return (
            <Badge className={`bg-gradient-to-r ${config.gradient} text-white border-none px-3 py-1.5 flex items-center gap-1.5 shadow-lg`}>
                <Icon className="w-3.5 h-3.5" />
                {config.label}
            </Badge>
        );
    };

    const getStatusDescription = (status: string) => {
        switch (status) {
            case "pending": return "Đơn hàng đã được đặt thành công";
            case "processing": return "Đơn hàng đang được chuẩn bị";
            case "shipped": return "Đơn hàng đang được giao đến bạn";
            case "delivered": return "Đơn hàng đã giao thành công";
            case "cancelled": return "Đơn hàng đã bị hủy";
            default: return "";
        }
    };

    const defaultTimeline = [
        { status: 'pending', label: 'Chờ xác nhận' },
        { status: 'processing', label: 'Đang chuẩn bị' },
        { status: 'shipped', label: 'Đang giao hàng' },
        { status: 'delivered', label: 'Đã giao hàng' }
    ];

    const timelineBase = order.timeline && Array.isArray(order.timeline) ? order.timeline : defaultTimeline;
    const currentIndex = timelineBase.findIndex(t => t.status === order.status);
    const timelineArr = timelineBase.map((step, idx) => ({
        ...step,
        completed: order.status === 'cancelled' ? false : idx <= currentIndex
    }));

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Chờ cập nhật';
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    };

    const getActionButtons = () => {
        const buttonVariants = {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 }
        };

        switch (order.status) {
            case 'processing':
                return (
                    <div className="flex gap-2 flex-wrap">
                        <motion.div {...buttonVariants}>
                            <Button variant="destructive" size="sm">
                                <XCircle className="mr-2 h-4 w-4" />
                                Hủy đơn hàng
                            </Button>
                        </motion.div>
                        <motion.div {...buttonVariants} transition={{ delay: 0.1 }}>
                            <Button variant="outline" size="sm" className="border-2">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Liên hệ shop
                            </Button>
                        </motion.div>
                    </div>
                );
            case 'shipped':
                return (
                    <div className="flex gap-2 flex-wrap">
                        <motion.div {...buttonVariants}>
                            <Button variant="outline" size="sm" className="border-2 border-purple-300 hover:border-purple-500">
                                <Truck className="mr-2 h-4 w-4" />
                                Theo dõi vận đơn
                            </Button>
                        </motion.div>
                        <motion.div {...buttonVariants} transition={{ delay: 0.1 }}>
                            <Button variant="outline" size="sm" className="border-2">
                                <Phone className="mr-2 h-4 w-4" />
                                Liên hệ shipper
                            </Button>
                        </motion.div>
                    </div>
                );
            case 'delivered':
                return (
                    <div className="flex gap-2 flex-wrap">
                        <motion.div {...buttonVariants}>
                            <Button className="bg-gradient-to-r from-primary to-purple-600" size="sm">
                                <Star className="mr-2 h-4 w-4" />
                                Đánh giá sản phẩm
                            </Button>
                        </motion.div>
                        <motion.div {...buttonVariants} transition={{ delay: 0.1 }}>
                            <Button variant="outline" size="sm" className="border-2">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Mua lại
                            </Button>
                        </motion.div>
                        <motion.div {...buttonVariants} transition={{ delay: 0.2 }}>
                            <Button variant="outline" size="sm" className="border-2">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Yêu cầu trả hàng
                            </Button>
                        </motion.div>
                    </div>
                );
            case 'cancelled':
                return (
                    <motion.div {...buttonVariants}>
                        <Button variant="outline" size="sm" className="border-2">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Mua lại
                        </Button>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Breadcrumb */}
                <motion.nav
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-1 text-sm text-muted-foreground"
                >
                    <Link to="/orders" className="hover:text-primary transition-colors">
                        Quản lý đơn hàng
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-foreground font-medium">Chi tiết đơn hàng #{order.code}</span>
                </motion.nav>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(-1)}
                            className="shrink-0 hover:bg-primary/10"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                    Đơn hàng #{order.code}
                                </h1>
                                {getStatusBadge(order.status)}
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Đặt hàng lúc {formatDate(order.created_at)}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" size="sm" className="border-2">
                                <Printer className="mr-2 h-4 w-4" />
                                In hóa đơn
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" size="sm" className="border-2">
                                <Share2 className="mr-2 h-4 w-4" />
                                Chia sẻ
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Timeline - Enhanced */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="overflow-hidden border-none shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-b">
                            <CardTitle className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-lg">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <span>Trạng thái đơn hàng</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-1">
                                {timelineArr.map((step, idx) => {
                                    const isCurrent = order.status === step.status;
                                    const isCompleted = step.completed;
                                    const config = getStatusConfig(step.status);
                                    const Icon = config.icon;

                                    return (
                                        <motion.div
                                            key={step.status || idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex items-start gap-4 relative group"
                                        >
                                            {/* Timeline Line */}
                                            <div className="flex flex-col items-center">
                                                <motion.div
                                                    className={`
                                                        flex items-center justify-center rounded-full border-2
                                                        ${isCurrent
                                                            ? `border-transparent bg-gradient-to-r ${config.gradient} shadow-lg`
                                                            : isCompleted
                                                                ? 'border-green-400 bg-green-50 dark:bg-green-900/30'
                                                                : 'border-muted bg-muted'}
                                                        w-10 h-10 relative
                                                    `}
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    <Icon className={`w-5 h-5 ${isCurrent ? 'text-white' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`} />
                                                    {isCurrent && (
                                                        <motion.div
                                                            className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.gradient}`}
                                                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                                            transition={{ duration: 1.5, repeat: Infinity }}
                                                        />
                                                    )}
                                                </motion.div>
                                                {/* Vertical Line */}
                                                {idx < timelineArr.length - 1 && (
                                                    <div
                                                        className={`
                                                            w-0.5 flex-1 mx-auto transition-colors duration-500
                                                            ${isCompleted ? 'bg-green-400' : 'bg-muted'}
                                                        `}
                                                        style={{ minHeight: 40 }}
                                                    />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 pb-8">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`
                                                        text-base font-semibold
                                                        ${isCurrent ? config.text : isCompleted ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'}
                                                    `}>
                                                        {step.label}
                                                    </span>
                                                    {isCurrent && (
                                                        <motion.span
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg"
                                                        >
                                                            Đang thực hiện
                                                        </motion.span>
                                                    )}
                                                    {isCompleted && !isCurrent && (
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                    )}
                                                </div>
                                                {step.timestamp && (
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {formatDate(step.timestamp)}
                                                    </p>
                                                )}
                                                {isCurrent && (
                                                    <motion.p
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="text-sm text-muted-foreground mt-1"
                                                    >
                                                        {getStatusDescription(step.status)}
                                                    </motion.p>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="overflow-hidden border-none shadow-xl">
                                <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-b">
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="w-5 h-5 text-primary" />
                                        Sản phẩm đã đặt
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        {(order.items || []).map((item, idx) => (
                                            <motion.div
                                                key={item.id || idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                whileHover={{ x: 4 }}
                                                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 transition-all group border border-transparent hover:border-primary/20"
                                            >
                                                <div className="relative">
                                                    <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-border group-hover:border-primary transition-all shadow-md">
                                                        {item.image ? (
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                                                                <Package className="w-10 h-10 text-primary" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Badge className="absolute -top-2 -right-2 w-6 h-6 p-0 flex items-center justify-center bg-gradient-to-r from-primary to-purple-600">
                                                        {item.quantity}
                                                    </Badge>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground mt-1">{item.variant}</p>
                                                    <Badge variant="outline" className="mt-2 text-xs">
                                                        SKU: {item.sku}
                                                    </Badge>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                                                    <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                                                    <p className="font-bold text-lg mt-1 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                                        {formatCurrency(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <Separator className="my-6" />

                                    {/* Price Summary */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="space-y-3"
                                    >
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Tạm tính:</span>
                                            <span className="font-medium">
                                                {formatCurrency(
                                                    (order.items || []).reduce(
                                                        (sum, item) => sum + (item.price * item.quantity), 0
                                                    )
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground flex items-center gap-1">
                                                <Truck className="w-4 h-4" />
                                                Phí vận chuyển:
                                            </span>
                                            <span className="font-medium">{formatCurrency(order.shipping_fee)}</span>
                                        </div>
                                        {order.coupon_code && order.discount_amount > 0 && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex justify-between text-sm items-center p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-green-700 dark:text-green-300 font-medium flex items-center gap-1">
                                                        🎫 Mã giảm giá:
                                                    </span>
                                                    <Badge className="bg-green-600 text-white font-mono text-xs">
                                                        {order.coupon_code}
                                                    </Badge>
                                                </div>
                                                <span className="font-semibold text-green-700 dark:text-green-300">
                                                    -{formatCurrency(order.discount_amount)}
                                                </span>
                                            </motion.div>
                                        )}
                                        {order.discount > 0 && (
                                            <div className="flex justify-between text-sm text-green-600">
                                                <span>Giảm giá:</span>
                                                <span className="font-medium">-{formatCurrency(order.discount ?? 0)}</span>
                                            </div>
                                        )}
                                        <Separator />
                                        <motion.div
                                            className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10"
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <span className="font-bold text-lg">Tổng cộng:</span>
                                            <span className="font-bold text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                                {formatCurrency(order.total)}
                                            </span>
                                        </motion.div>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="overflow-hidden border-none shadow-xl">
                                <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-b">
                                    <CardTitle>Thao tác</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {getActionButtons()}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="overflow-hidden border-none shadow-xl">
                                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b">
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        Thông tin giao hàng
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30">
                                        <p className="font-semibold text-lg mb-2">{order.customer?.name || "Chưa có tên"}</p>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                {order.customer.phone || "Chưa có số điện thoại"}
                                            </div>
                                            {order.customer.email && (
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    {order.customer.email}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            Địa chỉ giao hàng:
                                        </p>
                                        <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                                            {order.customer.address || "Chưa có địa chỉ"}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Shipping Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="overflow-hidden border-none shadow-xl">
                                <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b">
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        Thông tin vận chuyển
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-3">
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                                        <span className="text-sm text-muted-foreground">Phương thức:</span>
                                        <span className="text-sm font-semibold">{order.shipping?.method || "Chưa có"}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                                        <span className="text-sm text-muted-foreground">Đơn vị:</span>
                                        <span className="text-sm font-semibold">{order.shipping?.carrier || "Chưa có"}</span>
                                    </div>
                                    {order.shipping?.trackingCode && (
                                        <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800">
                                            <p className="text-xs text-muted-foreground mb-1">Mã vận đơn:</p>
                                            <code className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">
                                                {order.shipping.trackingCode}
                                            </code>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                                        <span className="text-sm text-muted-foreground">Dự kiến:</span>
                                        <span className="text-sm font-semibold">{order.shipping?.estimatedDays || "Chưa có"}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Payment Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="overflow-hidden border-none shadow-xl">
                                <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b">
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        Thông tin thanh toán
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-3">
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                                        <span className="text-sm text-muted-foreground">Phương thức:</span>
                                        <div className="flex items-center gap-2">
                                            {order.payment_method === "cod" && (
                                                <>
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                                                        <span className="text-white text-lg">💵</span>
                                                    </div>
                                                    <span className="text-sm font-semibold">Tiền mặt</span>
                                                </>
                                            )}
                                            {order.payment_method === "momo" && (
                                                <>
                                                    <img src="/images/icons/momo.png" alt="Logo MoMo" className='w-8 h-8 rounded-lg' />
                                                    <span className="text-sm font-semibold">MoMo</span>
                                                </>
                                            )}
                                            {order.payment_method === "zalopay" && (
                                                <>
                                                    <img src="/images/icons/zalopay.webp" alt="Logo ZaloPay" className='w-8 h-8 rounded-lg'/>
                                                    <span className="text-sm font-semibold">ZaloPay</span>
                                                </>
                                            )}
                                            {order.payment_method === "vnpay" && (
                                                <>
                                                    <img src="/images/icons/vnpay.png" alt="Logo VNPay" className='w-8 h-8 rounded-lg' />
                                                    <span className="text-sm font-semibold">VNPay</span>
                                                </>
                                            )}
                                            {!order.payment_method && (
                                                <span className="text-sm font-semibold text-muted-foreground">Chưa có</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                                        <span className="text-sm text-muted-foreground">Trạng thái:</span>
                                        <Badge className={order.payment?.status === "paid" 
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"}>
                                            {order.payment?.status === "paid" ? "✓ Đã thanh toán" : "⏳ Chưa thanh toán"}
                                        </Badge>
                                    </div>
                                    {order.payment?.transaction_id && (
                                        <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
                                            <p className="text-xs text-muted-foreground mb-1">Mã giao dịch:</p>
                                            <code className="text-sm font-mono font-bold text-green-600 dark:text-green-400">
                                                {order.payment.transaction_id}
                                            </code>
                                        </div>
                                    )}
                                    {order.payment?.paid_at && (
                                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                                            <span className="text-sm text-muted-foreground">Thời gian:</span>
                                            <span className="text-xs font-medium">{formatDate(order.payment.paid_at)}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Vendor Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Card className="overflow-hidden border-none shadow-xl">
                                <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b">
                                    <CardTitle className="flex items-center gap-2">
                                        <Store className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                        Thông tin cửa hàng
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {(order.items || []).map((item, idx) => {
                                        console.log('Order item data:', item); // Debug log
                                        return (
                                        <div key={item.id || idx} className="space-y-4">
                                            <div className="p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30">
                                                <div className="flex items-center justify-between mb-3">
                                                    <p className="font-semibold text-lg">{item.store_name || "Chưa có tên shop"}</p>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-sm font-semibold">4.8</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4" />
                                                        {item.store_phone || "Chưa có SĐT"}
                                                    </div>
                                                    {item.store_email && (
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="w-4 h-4" />
                                                            {item.store_email}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <Separator />
                                            <div>
                                                <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                    Địa chỉ:
                                                </p>
                                                <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                                                    {item.business_address || "Chưa có địa chỉ"}
                                                </p>
                                            </div>
                                            <Separator />
                                            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                                    📋 Đổi trả trong 7 ngày • Bảo hành 12 tháng
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="w-full border-2"
                                                        onClick={() => {
                                                            if (!item.seller_id || !item.seller_user_id) {
                                                                toast.error('Thông tin shop chưa đầy đủ');
                                                                console.error('Missing seller data in item:', item);
                                                                return;
                                                            }
                                                            handleChatWithShop(item.seller_id, item.seller_user_id);
                                                        }}
                                                        disabled={!item.seller_id || !item.seller_user_id}
                                                    >
                                                        <MessageCircle className="mr-2 h-4 w-4" />
                                                        Chat
                                                    </Button>
                                                </motion.div>
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button variant="outline" size="sm" className="w-full border-2">
                                                        <Store className="mr-2 h-4 w-4" />
                                                        Xem shop
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        </div>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;