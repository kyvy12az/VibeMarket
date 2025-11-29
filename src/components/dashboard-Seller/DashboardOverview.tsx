import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Package,
    TrendingUp,
    ShoppingBag,
    Star,
    Users,
    Activity,
    LayoutDashboard,
    PieChart,
    DollarSign,
    Target,
    BarChart3,
    Calendar,
    Eye,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Shield,
    Award,
    Zap,
    Filter,
    Download,
    Sparkles,
    RefreshCw
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

// Default data để hiển thị khi chưa có API data
const defaultShopStats = {
    totalProducts: 0,
    totalOrders: 0,
    totalDeliveredOrders: 0,
    totalRevenue: 0,
    revenueGrowth: 0,
    avgRating: 0,
    totalReviews: 0,
    totalCustomers: 0,
    conversionRate: '0%',
    conversionGrowth: 0
};

const defaultRevenueData = [
    { month: "T1", revenue: 0 },
    { month: "T2", revenue: 0 },
    { month: "T3", revenue: 0 },
    { month: "T4", revenue: 0 },
    { month: "T5", revenue: 0 },
    { month: "T6", revenue: 0 },
];

const defaultCategoryData = [
    { name: "Chưa có dữ liệu", value: 100, color: "#94a3b8" }
];

export function DashboardOverview() {
    const { user } = useAuth();
    const [shopStats, setShopStats] = useState<any>(defaultShopStats);
    const [revenueData, setRevenueData] = useState<any[]>(defaultRevenueData);
    const [categoryData, setCategoryData] = useState<any[]>(defaultCategoryData);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;

            setIsLoading(true);
            try {
                // 1. Lấy stats tổng quan
                const statsRes = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/vendor/dashboard_stats.php?user_id=${user.id}`
                );
                const stats = await statsRes.json();
                if (stats.success !== false) {
                    setShopStats(stats);
                }

                // 2. Lấy dữ liệu biểu đồ doanh thu
                const revenueRes = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/vendor/revenue_chart.php?user_id=${user.id}`
                );
                const revenue = await revenueRes.json();
                if (Array.isArray(revenue) && revenue.length > 0) {
                    setRevenueData(revenue);
                }

                // 3. Lấy dữ liệu danh mục
                const categoryRes = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/vendor/category_sales.php?user_id=${user.id}`
                );
                const categories = await categoryRes.json();
                if (Array.isArray(categories) && categories.length > 0) {
                    setCategoryData(categories);
                }

                setLastUpdated(new Date().toLocaleString('vi-VN'));
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                // Giữ nguyên default data nếu có lỗi
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const refreshData = () => {
        if (user?.id) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const statsRes = await fetch(
                        `${import.meta.env.VITE_BACKEND_URL}/api/vendor/dashboard_stats.php?user_id=${user.id}`
                    );
                    const stats = await statsRes.json();
                    if (stats.success !== false) {
                        setShopStats(stats);
                    }
                    setLastUpdated(new Date().toLocaleString('vi-VN'));
                } catch (error) {
                    console.error("Error refreshing data:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    };

    const primaryStats = [
        {
            label: "Doanh thu tháng này",
            value: `${((shopStats.totalRevenue || 0) / 1_000_000).toFixed(1)}M`,
            change: shopStats.revenueGrowth || 0,
            desc: "so với tháng trước",
            color: "from-emerald-500 to-teal-500",
            textColor: "text-white",
            icon: DollarSign,
        },
        {
            label: "Đơn hàng mới",
            value: shopStats.totalOrders || 0,
            change: 15.3,
            desc: "so với tháng trước",
            color: "from-blue-500 to-cyan-500",
            textColor: "text-white",
            icon: ShoppingBag,
        },
        {
            label: "Khách hàng",
            value: shopStats.totalCustomers || 0,
            change: shopStats.conversionGrowth || 0,
            desc: "khách hàng mới",
            color: "from-purple-500 to-pink-500",
            textColor: "text-white",
            icon: Users,
        },
        {
            label: "Tỷ lệ chuyển đổi",
            value: shopStats.conversionRate || '0%',
            change: 2.1,
            desc: "cải thiện",
            color: "from-orange-500 to-red-500",
            textColor: "text-white",
            icon: Target,
        }
    ];

    const secondaryStats = [
        {
            label: "Sản phẩm",
            value: shopStats.totalProducts || 0,
            icon: Package,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Đánh giá TB",
            value: shopStats.avgRating || 0,
            icon: Star,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
        },
        {
            label: "Đã giao",
            value: shopStats.totalDeliveredOrders || 0,
            icon: Shield,
            color: "text-green-600",
            bg: "bg-green-50",
        },
        {
            label: "Tỷ lệ hoàn thành",
            value: shopStats.totalOrders > 0 ? `${Math.round((shopStats.totalDeliveredOrders / shopStats.totalOrders) * 100)}%` : '0%',
            icon: Activity,
            color: "text-purple-600",
            bg: "bg-purple-50",
        }
    ];

    return (
        <div className="min-h-screen bg-background space-y-8">
            {/* Enhanced Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative"
            >
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 rounded-3xl -z-10" />

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-8">
                    <div className="flex items-start gap-6">
                        <motion.div
                            className="p-4 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 shadow-xl"
                            animate={{
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <LayoutDashboard className="w-8 h-8 text-white" />
                        </motion.div>

                        <div className="space-y-2">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Dashboard Overview
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <p className="text-muted-foreground">Cập nhật real-time</p>
                                    {lastUpdated && (
                                        <span className="text-xs text-muted-foreground ml-2">
                                            • Lần cuối: {lastUpdated}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-lg text-muted-foreground max-w-2xl">
                                🚀 Theo dõi hiệu suất kinh doanh toàn diện với analytics chi tiết và insights thông minh
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={refreshData}
                            disabled={isLoading}
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Làm mới
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            Xuất báo cáo
                        </Button>
                        <Badge variant="secondary" className="px-3 py-1.5 gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            6 tháng
                        </Badge>
                    </div>
                </div>
            </motion.div>

            {/* Primary Stats - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {primaryStats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                    >
                        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-90`} />
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />

                            <CardContent className="relative p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm ${stat.textColor}`}>
                                        {stat.change >= 0 ? (
                                            <ArrowUpRight className="w-3 h-3" />
                                        ) : (
                                            <ArrowDownRight className="w-3 h-3" />
                                        )}
                                        <span className="text-xs font-bold">
                                            {Math.abs(stat.change)}%
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                                    <p className="text-white text-3xl font-black">{stat.value}</p>
                                    <p className="text-white/70 text-xs">{stat.desc}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {secondaryStats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <Card className="border shadow-sm hover:shadow-md transition-all duration-300">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section - Enhanced */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <Card className="border shadow-sm">
                        <CardHeader className="border-b bg-muted/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 shadow-md">
                                        <BarChart3 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                                            Doanh thu 6 tháng gần nhất
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">Xu hướng tăng trưởng</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="gap-1">
                                        <TrendingUp className="w-3 h-3" />
                                        {shopStats.revenueGrowth >= 0 ? '+' : ''}{shopStats.revenueGrowth || 0}%
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="hsl(var(--border))"
                                            opacity={0.3}
                                        />
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
                                            cursor={{ strokeDasharray: "3 3", stroke: "hsl(var(--primary))", opacity: 0.4 }}
                                            contentStyle={{
                                                background: "hsl(var(--card))",
                                                border: "1px solid hsl(var(--border))",
                                                borderRadius: "12px",
                                                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                            }}
                                            labelStyle={{
                                                fontWeight: 600,
                                                color: "hsl(var(--foreground))",
                                                fontSize: 13,
                                            }}
                                            formatter={(value) => [`${value}M đ`, "Doanh thu"]}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={3}
                                            fill="url(#revenueGradient)"
                                            animationDuration={800}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Category Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <Card className="border shadow-sm">
                        <CardHeader className="border-b bg-muted/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 via-sky-500 to-green-500 shadow-md">
                                    <PieChart className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg bg-gradient-to-r from-cyan-500 via-sky-500 to-green-500 bg-clip-text text-transparent">
                                        Doanh số theo danh mục
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">Phân bổ doanh thu</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <ResponsiveContainer width="100%" height={320}>
                                <RechartsPieChart>
                                    <Tooltip
                                        cursor={{ fill: "hsl(var(--muted))", opacity: 0.05 }}
                                        contentStyle={{
                                            background: "#ffffff", // nền trắng
                                            border: "1px solid #e5e7eb", // viền xám nhạt
                                            borderRadius: "8px",
                                            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                                            color: "#000000", // text mặc định màu đen
                                        }}
                                        labelStyle={{
                                            fontWeight: 600,
                                            fontSize: 13,
                                            color: "#000000", // text label màu đen
                                            marginBottom: 4,
                                        }}
                                        formatter={(value, name, entry) => {
                                            return [
                                                <span style={{ color: entry.payload.color, fontWeight: 600 }}>
                                                    {value}%
                                                </span>,
                                                name,
                                            ];
                                        }}
                                    />


                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={110}
                                        innerRadius={55}
                                        paddingAngle={4}
                                        dataKey="value"
                                        labelLine={false}
                                        isAnimationActive
                                        label={({ value }) => `${value}%`}
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                                stroke="#fff"
                                                strokeWidth={2}
                                                style={{
                                                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                                                    cursor: "pointer",
                                                    transition: "transform 0.3s ease",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.transform = "scale(1.05)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.transform = "scale(1)";
                                                }}
                                            />
                                        ))}
                                    </Pie>

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
                </motion.div>
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <Card className="border shadow-sm">
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 rounded-full bg-green-100">
                                    <Shield className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <h3 className="font-bold text-xl text-green-600">
                                {shopStats.avgRating ? `${shopStats.avgRating}/5` : '0/5'}
                            </h3>
                            <p className="text-sm text-muted-foreground">Đánh giá trung bình</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Từ {shopStats.totalReviews || 0} đánh giá
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3 }}
                >
                    <Card className="border shadow-sm">
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 rounded-full bg-blue-100">
                                    <Zap className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <h3 className="font-bold text-xl text-blue-600">
                                {shopStats.totalOrders > 0 ?
                                    `${Math.round((shopStats.totalDeliveredOrders / shopStats.totalOrders) * 100)}%` :
                                    '0%'
                                }
                            </h3>
                            <p className="text-sm text-muted-foreground">Tỷ lệ thành công</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                {shopStats.totalDeliveredOrders || 0}/{shopStats.totalOrders || 0} đơn hàng
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4 }}
                >
                    <Card className="border shadow-sm">
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 rounded-full bg-purple-100">
                                    <Sparkles className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                            <h3 className="font-bold text-xl text-purple-600">
                                {shopStats.totalProducts || 0}
                            </h3>
                            <p className="text-sm text-muted-foreground">Tổng sản phẩm</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Đang kinh doanh
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}