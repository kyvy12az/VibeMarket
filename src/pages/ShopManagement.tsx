import { motion } from "framer-motion";
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
    Edit,
    Activity,
    PieChart
} from "lucide-react";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

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

    // Chart data
    const revenueData = [
        { month: "T1", revenue: 32, orders: 234, customers: 89 },
        { month: "T2", revenue: 28, orders: 198, customers: 76 },
        { month: "T3", revenue: 45, orders: 312, customers: 125 },
        { month: "T4", revenue: 38, orders: 267, customers: 98 },
        { month: "T5", revenue: 52, orders: 378, customers: 142 },
        { month: "T6", revenue: 48, orders: 356, customers: 138 },
        { month: "T7", revenue: 61, orders: 423, customers: 167 },
        { month: "T8", revenue: 55, orders: 389, customers: 154 },
        { month: "T9", revenue: 67, orders: 467, customers: 189 },
        { month: "T10", revenue: 58, orders: 412, customers: 176 },
        { month: "T11", revenue: 72, orders: 498, customers: 203 },
        { month: "T12", revenue: 78, orders: 534, customers: 221 }
    ];

    const categoryData = [
        { name: "Chăm sóc da", value: 35, color: "#FF6384" },
        { name: "Trang điểm", value: 28, color: "#36A2EB" },
        { name: "Nước hoa", value: 18, color: "#FFCE56" },
        { name: "Chăm sóc tóc", value: 12, color: "#4BC0C0" },
        { name: "Khác", value: 7, color: "#9966FF" }
    ];


    const orderStatusData = [
        { status: "Đã giao", count: 234, color: "#10B981" },
        { status: "Đang giao", count: 45, color: "#3B82F6" },
        { status: "Đang xử lý", count: 32, color: "#F59E0B" },
        { status: "Đã hủy", count: 12, color: "#EF4444" }
    ];

    const weeklyTrends = [
        { day: "T2", orders: 23, revenue: 5.2 },
        { day: "T3", orders: 31, revenue: 7.1 },
        { day: "T4", orders: 28, revenue: 6.3 },
        { day: "T5", orders: 35, revenue: 8.4 },
        { day: "T6", orders: 42, revenue: 9.8 },
        { day: "T7", orders: 38, revenue: 8.9 },
        { day: "CN", orders: 25, revenue: 5.7 }
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

                    <TabsContent value="analytics" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Revenue Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5" />
                                        Doanh thu theo tháng
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={revenueData}>
                                            <defs>
                                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                            <XAxis
                                                dataKey="month"
                                                stroke="hsl(var(--muted-foreground))"
                                                fontSize={12}
                                            />
                                            <YAxis
                                                stroke="hsl(var(--muted-foreground))"
                                                fontSize={12}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "hsl(var(--popover))",
                                                    border: "1px solid hsl(var(--border))",
                                                    borderRadius: "8px",
                                                    color: "hsl(var(--popover-foreground))"
                                                }}
                                                formatter={(value) => [`${value}M đ`, "Doanh thu"]}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="hsl(var(--primary))"
                                                strokeWidth={2}
                                                fill="url(#revenueGradient)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Orders & Customers Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5" />
                                        Đơn hàng & Khách hàng mới
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={revenueData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                            <XAxis
                                                dataKey="month"
                                                stroke="hsl(var(--muted-foreground))"
                                                fontSize={12}
                                            />
                                            <YAxis
                                                stroke="hsl(var(--muted-foreground))"
                                                fontSize={12}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "hsl(var(--popover))",
                                                    border: "1px solid hsl(var(--border))",
                                                    borderRadius: "8px",
                                                    color: "hsl(var(--popover-foreground))"
                                                }}
                                            />
                                            <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="customers" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Category Sales Pie Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <PieChart className="w-5 h-5" />
                                        Doanh số theo danh mục
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={320}>
                                        <RechartsPieChart>
                                            {/* Tooltip đẹp hơn */}
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#FFFFFF",          // nền trắng
                                                    border: "1px solid #E5E7EB",         // viền xám nhạt
                                                    borderRadius: "8px",
                                                    color: "#111827",                    // chữ đen xám đậm
                                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                                                }}
                                                formatter={(value, name) => [`${value}%`, name]}
                                            />


                                            {/* Pie Chart */}
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={110}
                                                innerRadius={50} // để tạo "donut chart"
                                                paddingAngle={4}
                                                dataKey="value"
                                                label={({ value }) => `${value}%`}
                                                labelLine={false}
                                                isAnimationActive
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                        stroke="#fff"
                                                        strokeWidth={2}
                                                    />
                                                ))}
                                            </Pie>

                                            {/* Legend */}
                                            <Legend
                                                layout="horizontal"
                                                verticalAlign="bottom"
                                                align="center"
                                                iconType="circle"
                                            />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>


                            {/* Weekly Trends */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="w-5 h-5" />
                                        Xu hướng tuần này
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={320}>
                                        <LineChart data={weeklyTrends}>
                                            {/* Lưới nền */}
                                            <CartesianGrid
                                                strokeDasharray="4 4"
                                                stroke="#E5E7EB" // màu xám nhạt
                                                opacity={0.6}
                                            />

                                            {/* Trục X */}
                                            <XAxis
                                                dataKey="day"
                                                stroke="#6B7280" // xám trung tính
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={{ stroke: "#D1D5DB" }}
                                            />

                                            {/* Trục Y */}
                                            <YAxis
                                                stroke="#6B7280"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={{ stroke: "#D1D5DB" }}
                                            />

                                            {/* Tooltip */}
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#fff",
                                                    border: "1px solid #E5E7EB",
                                                    borderRadius: "8px",
                                                    color: "#111827",
                                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                                                }}
                                                formatter={(value, name) => [
                                                    name === "orders"
                                                        ? `${value} đơn`
                                                        : `${value.toLocaleString()}₫`,
                                                    name === "orders" ? "Đơn hàng" : "Doanh thu"
                                                ]}
                                            />

                                            {/* Line: Orders */}
                                            <Line
                                                type="monotone"
                                                dataKey="orders"
                                                name="Đơn hàng"
                                                stroke="#3B82F6" // xanh dương
                                                strokeWidth={3}
                                                dot={{ fill: "#3B82F6", r: 4 }}
                                                activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                                            />

                                            {/* Line: Revenue */}
                                            <Line
                                                type="monotone"
                                                dataKey="revenue"
                                                name="Doanh thu"
                                                stroke="#F97316" // cam
                                                strokeWidth={3}
                                                dot={{ fill: "#F97316", r: 4 }}
                                                activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                                            />

                                            {/* Legend */}
                                            <Legend
                                                verticalAlign="top"
                                                align="right"
                                                iconType="circle"
                                                wrapperStyle={{ fontSize: "13px", paddingBottom: "8px" }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                        </div>

                        {/* Order Status Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5" />
                                    Phân bố trạng thái đơn hàng
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={orderStatusData} layout="horizontal">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                        <XAxis
                                            type="number"
                                            stroke="#6B7280"
                                            fontSize={12}
                                        />
                                        <YAxis
                                            type="category"
                                            dataKey="status"
                                            stroke="#6B7280"
                                            fontSize={12}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#fff",
                                                border: "1px solid #E5E7EB",
                                                borderRadius: "8px",
                                                color: "#111827",
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                            }}
                                            formatter={(value) => [`${value} đơn`, "Số lượng"]}
                                        />
                                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                            {orderStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color || '#3B82F6'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
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