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

const OrderManagement = () => {
    const navigate = useNavigate();

    const mockOrders = [
        {
            id: "DH001234",
            date: "2024-01-15",
            status: "delivered",
            total: 899000,
            items: 3,
            products: [
                { name: "Kem dưỡng da Olay", price: 299000, quantity: 1, image: "/images/olay-cream.jpg" },
                { name: "Son môi MAC Ruby Woo", price: 450000, quantity: 1, image: "/images/mac-rubywoo.jpg" },
                { name: "Nước hoa Chanel", price: 150000, quantity: 1, image: "/images/chanel-perfume.jpg" }
            ],
            tracking: "VN123456789",
            vendor: "Beauty World"
        },
        {
            id: "DH001235",
            date: "2024-01-20",
            status: "shipping",
            total: 1299000,
            items: 2,
            products: [
                { name: "Áo khoác denim", price: 799000, quantity: 1, image: "/images/denim-jacket.jpg" },
                { name: "Giày sneaker Nike", price: 500000, quantity: 1, image: "/images/nike-sneaker.jpg" }
            ],
            tracking: "VN123456790",
            vendor: "Fashion Store"
        },
        {
            id: "DH001236",
            date: "2024-01-22",
            status: "processing",
            total: 550000,
            items: 1,
            products: [
                { name: "Tai nghe Bluetooth", price: 550000, quantity: 1, image: "/images/bluetooth-headphones.jpg" }
            ],
            tracking: null,
            vendor: "Tech Hub"
        },
        {
            id: "DH001237",
            date: "2024-01-10",
            status: "cancelled",
            total: 750000,
            items: 2,
            products: [
                { name: "Váy maxi hoa", price: 450000, quantity: 1, image: "/images/maxi-dress.jpg" },
                { name: "Túi xách mini", price: 300000, quantity: 1, image: "/images/mini-bag.jpg" }
            ],
            tracking: null,
            vendor: "Fashion Boutique"
        }
    ];

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            processing: { label: "Đang xử lý", variant: "default" as const, icon: Clock },
            shipping: { label: "Đang giao", variant: "secondary" as const, icon: Truck },
            delivered: { label: "Đã giao", variant: "default" as const, icon: CheckCircle },
            cancelled: { label: "Đã hủy", variant: "destructive" as const, icon: XCircle }
        };

        const config = statusConfig[status as keyof typeof statusConfig];
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="gap-1">
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };

    const filterOrders = (status?: string) => {
        if (!status) return mockOrders;
        return mockOrders.filter(order => order.status === status);
    };

    const OrderCard = ({ order }: { order: typeof mockOrders[0] }) => {
        return (
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">Đơn hàng #{order.id}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Đặt ngày {new Date(order.date).toLocaleDateString('vi-VN')}
                            </p>
                            <p className="text-sm text-muted-foreground">Cửa hàng: {order.vendor}</p>
                        </div>
                        {getStatusBadge(order.status)}
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Products */}
                    <div className="space-y-3">
                        {order.products.map((product, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <Package className="w-6 h-6 text-gray-500" />
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
                            {order.items} sản phẩm
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
                            onClick={() => navigate(`/orders/${order.id}`)}
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            Chi tiết
                        </Button>
                        {order.status === 'shipping' && (
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
                            Tất cả ({mockOrders.length})
                        </TabsTrigger>
                        <TabsTrigger value="processing">
                            Đang xử lý ({filterOrders("processing").length})
                        </TabsTrigger>
                        <TabsTrigger value="shipping">
                            Đang giao ({filterOrders("shipping").length})
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
                        {mockOrders.map((order, index) => (
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
                    <TabsContent value="shipping" className="space-y-4">
                        {filterOrders("shipping").map((order, index) => (
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