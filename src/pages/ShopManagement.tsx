import { motion } from "framer-motion";
import { Bar, Line } from '@ant-design/charts';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Package,
    TrendingUp,
    Users,
    Star,
    Plus,
    BarChart3,
    ShoppingBag,
    MessageSquare,
    Settings,
    Eye,
    Edit
} from "lucide-react";

const ShopManagement = () => {
    const navigate = useNavigate();
    const shopStats = {
        totalProducts: 156,
        totalOrders: 342,
        totalRevenue: 45600000,
        avgRating: 4.8,
        totalCustomers: 1249,
        monthlyGrowth: 12.5
    };

    const recentOrders = [
        {
            id: "DH001234",
            customer: "Nguyễn Thị Lan",
            product: "Kem dưỡng da Olay",
            amount: 299000,
            status: "processing",
            date: "2024-01-25"
        },
        {
            id: "DH001235",
            customer: "Trần Văn Nam",
            product: "Son môi MAC Ruby",
            amount: 450000,
            status: "shipped",
            date: "2024-01-24"
        },
        {
            id: "DH001236",
            customer: "Lê Thị Mai",
            product: "Nước hoa Chanel",
            amount: 1200000,
            status: "delivered",
            date: "2024-01-23"
        }
    ];

    const topProducts = [
        {
            name: "Kem dưỡng da Olay Regenerist",
            sales: 89,
            revenue: 25850000,
            image: "/placeholder.svg",
            rating: 4.9
        },
        {
            name: "Son môi MAC Ruby Woo",
            sales: 67,
            revenue: 30150000,
            image: "/placeholder.svg",
            rating: 4.8
        },
        {
            name: "Nước hoa Chanel No.5",
            sales: 34,
            revenue: 40800000,
            image: "/placeholder.svg",
            rating: 4.7
        }
    ];

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            processing: { label: "Đang xử lý", variant: "default" as const },
            shipped: { label: "Đã gửi", variant: "secondary" as const },
            delivered: { label: "Đã giao", variant: "default" as const }
        };

        const config = statusConfig[status as keyof typeof statusConfig];
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        {/* Left */}
                        <div>
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                                    <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                                    Quản lý cửa hàng
                                </h1>
                                <span className="text-xl sm:text-2xl font-bold text-primary md:ml-4">
                                    Beauty World Store
                                </span>
                            </div>
                        </div>

                        {/* Right */}
                        <Button
                            className="bg-gradient-primary w-full sm:w-auto"
                            onClick={() => navigate("/add-product")}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm sản phẩm
                        </Button>
                    </div>
                </motion.div>


                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Tổng sản phẩm</p>
                                    <p className="text-2xl font-bold">{shopStats.totalProducts}</p>
                                </div>
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Package className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Đơn hàng tháng này</p>
                                    <p className="text-2xl font-bold">{shopStats.totalOrders}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <ShoppingBag className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Doanh thu</p>
                                    <p className="text-2xl font-bold">{(shopStats.totalRevenue / 1000000).toFixed(1)}M</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Đánh giá</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-2xl font-bold">{shopStats.avgRating}</p>
                                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <Star className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Tabs defaultValue="orders" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-0">
                        <TabsTrigger value="orders">Đơn hàng mới</TabsTrigger>
                        <TabsTrigger value="products">Sản phẩm bán chạy</TabsTrigger>
                        <TabsTrigger value="analytics">Thống kê</TabsTrigger>
                        <TabsTrigger value="settings">Cài đặt</TabsTrigger>
                    </TabsList>

                    <TabsContent value="orders" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5" />
                                    Đơn hàng gần đây
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentOrders.map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <p className="font-medium">#{order.id}</p>
                                                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                                                    </div>
                                                    <div className="hidden md:block">
                                                        <p className="font-medium">{order.product}</p>
                                                        <p className="text-sm text-muted-foreground">{order.amount.toLocaleString('vi-VN')}đ</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {getStatusBadge(order.status)}
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Xem
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="products" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Sản phẩm bán chạy nhất
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topProducts.map((product, index) => (
                                        <div
                                            key={product.name}
                                            className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-border rounded-lg"
                                        >
                                            {/* STT */}
                                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                                                {index + 1}
                                            </div>

                                            {/* Hình ảnh */}
                                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <Package className="w-6 h-6 text-gray-500" />
                                            </div>

                                            {/* Thông tin sản phẩm */}
                                            <div className="flex-1 text-left">
                                                <p className="font-medium">{product.name}</p>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                                    <span>Đã bán: {product.sales}</span>
                                                    <span>Doanh thu: {(product.revenue / 1000000).toFixed(1)}M</span>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                        <span>{product.rating}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Nút sửa */}
                                            <div className="sm:ml-auto">
                                                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Sửa
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>

                        </Card>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5" />
                                        Doanh thu theo tháng
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                                        <Bar
                                            data={[{month: 'Tháng 1', value: 12},{month: 'Tháng 2', value: 19},{month: 'Tháng 3', value: 15},{month: 'Tháng 4', value: 22},{month: 'Tháng 5', value: 18},{month: 'Tháng 6', value: 25}]}
                                            xField="month"
                                            yField="value"
                                            color="#3b82f6"
                                            height={220}
                                            autoFit
                                            barWidthRatio={0.6}
                                            style={{ borderRadius: 8 }}
                                            axis={{ x: { label: { style: { fontSize: 12 } } }, y: { label: { style: { fontSize: 12 } } } }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        Khách hàng mới
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                                        <Line
                                            data={[{month: 'Tháng 1', value: 30},{month: 'Tháng 2', value: 45},{month: 'Tháng 3', value: 38},{month: 'Tháng 4', value: 50},{month: 'Tháng 5', value: 42},{month: 'Tháng 6', value: 60}]}
                                            xField="month"
                                            yField="value"
                                            color="#10b981"
                                            height={220}
                                            autoFit
                                            point={{ size: 4, shape: 'circle', style: { fill: '#10b981' } }}
                                            axis={{ x: { label: { style: { fontSize: 12 } } }, y: { label: { style: { fontSize: 12 } } } }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="w-5 h-5" />
                                    Cài đặt cửa hàng
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button variant="outline" className="h-20 flex-col gap-2">
                                        <Package className="w-6 h-6" />
                                        Quản lý sản phẩm
                                    </Button>
                                    <Button variant="outline" className="h-20 flex-col gap-2">
                                        <TrendingUp className="w-6 h-6" />
                                        Khuyến mãi
                                    </Button>
                                    <Button variant="outline" className="h-20 flex-col gap-2">
                                        <MessageSquare className="w-6 h-6" />
                                        Tin nhắn
                                    </Button>
                                    <Button variant="outline" className="h-20 flex-col gap-2">
                                        <Settings className="w-6 h-6" />
                                        Cài đặt chung
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default ShopManagement;