import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    Search,
    Eye,
    RefreshCw,
    MessageSquare
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const OrderManagement = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return; // Chưa đăng nhập thì không gọi API
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/user_orders.php?user_id=${user.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setOrders(data.orders);
                setLoading(false);
            });
    }, [user?.id]);

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: "Chờ xác nhận", variant: "warning" as const, color: "#F59E42", icon: Clock },
            processing: { label: "Đang xử lý", variant: "info" as const, color: "#3B82F6", icon: Clock },
            shipped: { label: "Đang giao", variant: "primary" as const, color: "#6366F1", icon: Truck },
            delivered: { label: "Đã giao", variant: "success" as const, color: "#10B981", icon: CheckCircle },
            cancelled: { label: "Đã hủy", variant: "destructive" as const, color: "#EF4444", icon: XCircle }
        };

        const config = statusConfig[status as keyof typeof statusConfig];
        const Icon = config.icon;
        if (!config) {
            return <Badge variant="outline">{status}</Badge>;
        }
        return (
            <Badge
                variant={config.variant}
                style={{
                    backgroundColor: config.color,
                    color: "#fff",
                    border: "none",
                }}
                className="whitespace-nowrap flex items-center justify-center px-3 py-1 text-sm"
            >   
                <Icon className="w-4 h-4 mr-1" />
                {config.label}
            </Badge>
        );
    };

    const filterOrders = (status?: string) => {
        if (!status) return orders;
        return orders.filter(order => order.status === status);
    };

    const OrderCard = ({ order }: { order: typeof orders[0] }) => {
        return (
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">Đơn hàng #{order.code}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Đặt ngày {new Date(order.date).toLocaleDateString('vi-VN')}
                            </p>
                            {/* Nếu có vendor */}
                            {order.vendor && (
                                <p className="text-sm text-muted-foreground">Cửa hàng: {order.vendor}</p>
                            )}
                        </div>
                        {getStatusBadge(order.status)}
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Products */}
                    <div className="space-y-3">
                        {(order.items || []).map((product, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Package className="w-6 h-6 text-gray-500" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Số lượng: {product.quantity} | {product.price.toLocaleString('vi-VN')}đ
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="flex justify-between items-center pt-3 border-t">
                        <span className="text-sm text-muted-foreground">
                            {order.items?.length || 0} sản phẩm
                        </span>
                        <span className="font-bold text-lg">
                            {order.total.toLocaleString('vi-VN')}đ
                        </span>
                    </div>

                    {/* Tracking */}
                    {order.tracking && (
                        <div className="bg-primary/10 p-3 rounded-lg">
                            <p className="text-sm font-medium text-primary">Mã vận đơn: {order.tracking}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => navigate(`/orders/${order.code}`)}
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            Chi tiết
                        </Button>
                        {order.status === 'shipped' && (
                            <Button variant="outline" size="sm" className="flex-1">
                                <Truck className="w-4 h-4 mr-2" />
                                Theo dõi
                            </Button>
                        )}
                        {order.status === 'delivered' && (
                            <Button variant="outline" size="sm" className="flex-1">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Đánh giá
                            </Button>
                        )}
                        {order.status === 'processing' && (
                            <Button variant="destructive" size="sm">
                                <XCircle className="w-4 h-4 mr-2" />
                                Hủy
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        <Package className="w-8 h-8 text-primary" />
                        Quản lý đơn hàng
                    </h1>
                    <p className="text-muted-foreground">Theo dõi và quản lý tất cả đơn hàng của bạn</p>
                </motion.div>

                {/* Search */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Tìm kiếm theo mã đơn hàng, tên sản phẩm..."
                                    className="pl-10"
                                />
                            </div>
                            <Button variant="outline">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Làm mới
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Tabs */}
                <Tabs defaultValue="all" className="space-y-6">
                    <TabsList className="grid grid-cols-3 sm:grid-cols-5 w-full gap-2 bg-muted rounded-lg p-1">
                        <TabsTrigger value="all">
                            Tất cả ({orders.length})
                        </TabsTrigger>
                        <TabsTrigger value="processing">
                            Đang xử lý ({filterOrders("processing").length})
                        </TabsTrigger>
                        <TabsTrigger value="shipped">
                            Đang giao ({filterOrders("shipped").length})
                        </TabsTrigger>
                        <TabsTrigger value="delivered">
                            Đã giao ({filterOrders("delivered").length})
                        </TabsTrigger>
                        <TabsTrigger value="cancelled">
                            Đã hủy ({filterOrders("cancelled").length})
                        </TabsTrigger>
                    </TabsList>

                    {/* All Orders */}
                    <TabsContent value="all" className="space-y-4">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <OrderCard order={order} />
                            </motion.div>
                        ))}
                    </TabsContent>

                    {/* Processing */}
                    <TabsContent value="processing" className="space-y-4">
                        {filterOrders("processing").map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <OrderCard order={order} />
                            </motion.div>
                        ))}
                    </TabsContent>

                    {/* Shipping */}
                    <TabsContent value="shipped" className="space-y-4">
                        {filterOrders("shipped").map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <OrderCard order={order} />
                            </motion.div>
                        ))}
                    </TabsContent>

                    {/* Delivered */}
                    <TabsContent value="delivered" className="space-y-4">
                        {filterOrders("delivered").map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <OrderCard order={order} />
                            </motion.div>
                        ))}
                    </TabsContent>

                    {/* Cancelled */}
                    <TabsContent value="cancelled" className="space-y-4">
                        {filterOrders("cancelled").map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <OrderCard order={order} />
                            </motion.div>
                        ))}
                    </TabsContent>
                </Tabs>

            </div>
        </div>
    );
};

export default OrderManagement;