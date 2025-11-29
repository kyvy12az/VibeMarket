import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    Search,
    Eye,
    RefreshCw,
    MessageSquare,
    Filter,
    Download,
    ChevronRight,
    MapPin,
    Phone,
    Mail,
    ShoppingBag,
    TrendingUp,
    Calendar,
    DollarSign
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const OrderManagement = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    useEffect(() => {
        if (!user?.id) return;
        fetchOrders();
    }, [user?.id]);

    const fetchOrders = () => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/user_orders.php?user_id=${user.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setOrders(data.orders);
                setLoading(false);
            })
            .catch(() => {
                toast.error("Không thể tải danh sách đơn hàng");
                setLoading(false);
            });
    };

    const getStatusConfig = (status: string) => {
        const configs = {
            pending: {
                label: "Chờ xác nhận",
                variant: "warning" as const,
                gradient: "from-yellow-500 to-orange-500",
                bg: "bg-yellow-50 dark:bg-yellow-950/20",
                border: "border-yellow-200 dark:border-yellow-800",
                text: "text-yellow-700 dark:text-yellow-300",
                icon: Clock
            },
            processing: {
                label: "Đang xử lý",
                variant: "info" as const,
                gradient: "from-blue-500 to-cyan-500",
                bg: "bg-blue-50 dark:bg-blue-950/20",
                border: "border-blue-200 dark:border-blue-800",
                text: "text-blue-700 dark:text-blue-300",
                icon: Package
            },
            shipped: {
                label: "Đang giao",
                variant: "primary" as const,
                gradient: "from-purple-500 to-pink-500",
                bg: "bg-purple-50 dark:bg-purple-950/20",
                border: "border-purple-200 dark:border-purple-800",
                text: "text-purple-700 dark:text-purple-300",
                icon: Truck
            },
            delivered: {
                label: "Đã giao",
                variant: "success" as const,
                gradient: "from-green-500 to-emerald-500",
                bg: "bg-green-50 dark:bg-green-950/20",
                border: "border-green-200 dark:border-green-800",
                text: "text-green-700 dark:text-green-300",
                icon: CheckCircle
            },
            cancelled: {
                label: "Đã hủy",
                variant: "destructive" as const,
                gradient: "from-red-500 to-pink-500",
                bg: "bg-red-50 dark:bg-red-950/20",
                border: "border-red-200 dark:border-red-800",
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
            <Badge
                className={`bg-gradient-to-r ${config.gradient} text-white border-none px-3 py-1.5 flex items-center gap-1.5 shadow-sm`}
            >
                <Icon className="w-3.5 h-3.5" />
                {config.label}
            </Badge>
        );
    };

    const filterOrders = (status?: string) => {
        let filtered = orders;
        if (status) {
            filtered = filtered.filter(order => order.status === status);
        }
        if (searchQuery) {
            filtered = filtered.filter(order => 
                order.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.items?.some((item: any) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }
        return filtered;
    };

    const handleReviewClick = (orderId: number) => {
        navigate(`/orders/${orderId}/review`);
    };

    const OrderCard = ({ order }: { order: typeof orders[0] }) => {
        const config = getStatusConfig(order.status);
        const Icon = config.icon;

        return (
            <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
            >
                <Card className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300">
                    {/* Header với Gradient */}
                    <div className={`p-4 bg-gradient-to-r ${config.gradient}`}>
                        <div className="flex justify-between items-start text-white">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5" />
                                    <h3 className="font-bold text-lg">Đơn hàng #{order.code}</h3>
                                </div>
                                <div className="flex items-center gap-4 text-xs opacity-90">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(order.date).toLocaleDateString('vi-VN')}
                                    </div>
                                    {order.vendor && (
                                        <div className="flex items-center gap-1">
                                            <Package className="w-3.5 h-3.5" />
                                            {order.vendor}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-semibold">{config.label}</span>
                            </div>
                        </div>
                    </div>

                    <CardContent className="p-5 space-y-4">
                        {/* Products */}
                        <div className="space-y-3">
                            {(order.items || []).map((product: any, index: number) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 transition-all group"
                                >
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-border group-hover:border-primary transition-all shadow-sm">
                                            {product.image ? (
                                                <img 
                                                    src={product.image} 
                                                    alt={product.name} 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                                                    <Package className="w-8 h-8 text-primary" />
                                                </div>
                                            )}
                                        </div>
                                        <Badge className="absolute -top-2 -right-2 w-6 h-6 p-0 flex items-center justify-center bg-primary text-xs">
                                            {product.quantity}
                                        </Badge>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                            {product.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <Badge variant="outline" className="text-xs px-2 py-0.5">
                                                SL: {product.quantity}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">•</span>
                                            <span className="text-xs font-semibold text-primary">
                                                {product.price.toLocaleString('vi-VN')}₫
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <Separator />

                        {/* Order Info */}
                        <div className="space-y-2">
                            {order.address && (
                                <div className="flex items-start gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground flex-1">{order.address}</span>
                                </div>
                            )}
                            {order.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">{order.phone}</span>
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Order Summary */}
                        <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-primary" />
                                <span className="text-sm font-medium">Tổng thanh toán</span>
                            </div>
                            <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                {order.total.toLocaleString('vi-VN')}₫
                            </span>
                        </div>

                        {/* Tracking */}
                        {order.tracking && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                            Mã vận đơn
                                        </span>
                                    </div>
                                    <code className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">
                                        {order.tracking}
                                    </code>
                                </div>
                            </motion.div>
                        )}

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-2 hover:border-primary hover:bg-primary/5"
                                onClick={() => navigate(`/orders/${order.code}`)}
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Chi tiết
                            </Button>
                            {order.status === 'shipped' && (
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                                >
                                    <Truck className="w-4 h-4 mr-2" />
                                    Theo dõi
                                </Button>
                            )}
                            {order.status === 'delivered' && (
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="border-2 border-green-300 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20"
                                    onClick={() => handleReviewClick(order.id)}
                                >
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Đánh giá
                                </Button>
                            )}
                            {order.status === 'processing' && (
                                <Button 
                                    variant="destructive" 
                                    size="sm"
                                    className="border-2"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Hủy đơn
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    };

    const OrderStats = () => {
        const stats = [
            { 
                label: "Tổng đơn hàng", 
                value: orders.length, 
                icon: ShoppingBag, 
                color: "text-blue-600",
                bg: "bg-blue-50 dark:bg-blue-950/20",
                gradient: "from-blue-500 to-cyan-500"
            },
            { 
                label: "Đang xử lý", 
                value: filterOrders("processing").length, 
                icon: Package, 
                color: "text-purple-600",
                bg: "bg-purple-50 dark:bg-purple-950/20",
                gradient: "from-purple-500 to-pink-500"
            },
            { 
                label: "Đã giao", 
                value: filterOrders("delivered").length, 
                icon: CheckCircle, 
                color: "text-green-600",
                bg: "bg-green-50 dark:bg-green-950/20",
                gradient: "from-green-500 to-emerald-500"
            },
            { 
                label: "Đã hủy", 
                value: filterOrders("cancelled").length, 
                icon: XCircle, 
                color: "text-red-600",
                bg: "bg-red-50 dark:bg-red-950/20",
                gradient: "from-red-500 to-pink-500"
            }
        ];

        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                    >
                        <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                        <p className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-muted-foreground">Đang tải đơn hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background/10">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-primary to-purple-600 rounded-2xl shadow-lg">
                                    <Package className="w-8 h-8 text-white" />
                                </div>
                                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                    Quản lý đơn hàng
                                </span>
                            </h1>
                            <p className="text-muted-foreground ml-14">
                                Theo dõi và quản lý tất cả đơn hàng của bạn
                            </p>
                        </div>
                        <Button 
                            size="lg"
                            className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-lg"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Xuất Excel
                        </Button>
                    </div>
                </motion.div>

                {/* Stats */}
                <OrderStats />

                {/* Search & Filter */}
                <Card className="mb-6 border-none shadow-lg">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                <Input
                                    placeholder="Tìm kiếm theo mã đơn hàng, tên sản phẩm..."
                                    className="pl-11 h-12 border-2"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button 
                                variant="outline" 
                                size="lg"
                                className="border-2"
                                onClick={fetchOrders}
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Làm mới
                            </Button>
                            <Button 
                                variant="outline" 
                                size="lg"
                                className="border-2"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Lọc
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Tabs */}
                <Tabs defaultValue="all" className="space-y-6">
                    <Card className="border-none shadow-lg overflow-hidden">
                        <TabsList className="w-full justify-start bg-gradient-to-r from-muted/50 to-muted/30 p-2 rounded-none flex-wrap h-auto gap-2">
                            <TabsTrigger 
                                value="all" 
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg px-4 py-2.5"
                            >
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Tất cả ({orders.length})
                            </TabsTrigger>
                            <TabsTrigger 
                                value="processing"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg px-4 py-2.5"
                            >
                                <Package className="w-4 h-4 mr-2" />
                                Đang xử lý ({filterOrders("processing").length})
                            </TabsTrigger>
                            <TabsTrigger 
                                value="shipped"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg px-4 py-2.5"
                            >
                                <Truck className="w-4 h-4 mr-2" />
                                Đang giao ({filterOrders("shipped").length})
                            </TabsTrigger>
                            <TabsTrigger 
                                value="delivered"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-lg px-4 py-2.5"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Đã giao ({filterOrders("delivered").length})
                            </TabsTrigger>
                            <TabsTrigger 
                                value="cancelled"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg px-4 py-2.5"
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Đã hủy ({filterOrders("cancelled").length})
                            </TabsTrigger>
                        </TabsList>
                    </Card>

                    {/* Tab Contents */}
                    {["all", "processing", "shipped", "delivered", "cancelled"].map((tab) => (
                        <TabsContent key={tab} value={tab} className="space-y-4">
                            <AnimatePresence mode="wait">
                                {filterOrders(tab === "all" ? undefined : tab).length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                    >
                                        <Card className="p-12 text-center border-none shadow-lg">
                                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center">
                                                <Package className="w-12 h-12 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">Chưa có đơn hàng</h3>
                                            <p className="text-muted-foreground mb-6">
                                                Bạn chưa có đơn hàng nào trong mục này
                                            </p>
                                            <Button 
                                                onClick={() => navigate("/shop")}
                                                className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                                            >
                                                Mua sắm ngay
                                                <ChevronRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Card>
                                    </motion.div>
                                ) : (
                                    <div className="grid gap-4">
                                        {filterOrders(tab === "all" ? undefined : tab).map((order, index) => (
                                            <motion.div
                                                key={order.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <OrderCard order={order} />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </AnimatePresence>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    );
};

export default OrderManagement;