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
    RefreshCw,
    CalendarDays,
    MoreHorizontal
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

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background/95 backdrop-blur-md border border-border p-4 shadow-xl rounded-xl">
                    <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">{label}</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <p className="text-sm font-bold">
                            Doanh thu: <span className="text-primary">{payload[0].value.toLocaleString()}M đ</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Logic tính toán
    const ratingValue = shopStats.avgRating || 0;
    const ratingPercentage = (ratingValue / 5) * 100;

    const successRate = shopStats.totalOrders > 0
        ? Math.round((shopStats.totalDeliveredOrders / shopStats.totalOrders) * 100)
        : 0;

    const cardData = [
        {
            title: "Đánh giá trung bình",
            value: `${ratingValue}/5`,
            subValue: `Từ ${shopStats.totalReviews || 0} đánh giá`,
            icon: Star,
            color: "emerald",
            percentage: ratingPercentage,
            footer: "Mức độ hài lòng cao",
        },
        {
            title: "Tỷ lệ thành công",
            value: `${successRate}%`,
            subValue: `${shopStats.totalDeliveredOrders || 0}/${shopStats.totalOrders || 0} đơn hàng`,
            icon: Zap,
            color: "indigo",
            percentage: successRate,
            footer: "Hiệu suất vận hành",
        },
        {
            title: "Tổng sản phẩm",
            value: shopStats.totalProducts || 0,
            subValue: "Sản phẩm hiện có",
            icon: Sparkles,
            color: "violet",
            percentage: 100, // Thẻ này dùng để trang trí hoặc để 100
            footer: "Đang kinh doanh",
        },
    ];

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
            label: "Tổng sản phẩm",
            value: shopStats.totalProducts || 0,
            icon: Package,
            color: "text-blue-500",
            bg: "bg-blue-500",
            chartColor: "#3b82f6", // Blue 500
            trend: "+2.4%",
            // Dữ liệu biểu đồ giả lập đi lên
            chartData: [
                { v: 40 }, { v: 45 }, { v: 42 }, { v: 48 }, { v: 52 }, { v: 58 }, { v: 60 }
            ],
        },
        {
            label: "Đánh giá TB",
            value: shopStats.avgRating || 0,
            icon: Star,
            color: "text-amber-500",
            bg: "bg-amber-500",
            chartColor: "#f59e0b", // Amber 500
            trend: "+0.1",
            // Dữ liệu đánh giá thường ổn định hoặc biến động nhẹ
            chartData: [
                { v: 4.2 }, { v: 4.5 }, { v: 4.4 }, { v: 4.7 }, { v: 4.6 }, { v: 4.8 }, { v: 4.8 }
            ],
        },
        {
            label: "Đơn đã giao",
            value: shopStats.totalDeliveredOrders || 0,
            icon: Shield,
            color: "text-emerald-500",
            bg: "bg-emerald-500",
            chartColor: "#10b981", // Emerald 500
            trend: "+12.5%",
            // Dữ liệu đơn hàng biến động theo chu kỳ
            chartData: [
                { v: 20 }, { v: 35 }, { v: 25 }, { v: 45 }, { v: 30 }, { v: 55 }, { v: 65 }
            ],
        },
        {
            label: "Tỉ lệ hoàn thành",
            value: shopStats.totalOrders > 0
                ? `${Math.round((shopStats.totalDeliveredOrders / shopStats.totalOrders) * 100)}%`
                : '0%',
            icon: Activity,
            color: "text-purple-500",
            bg: "bg-purple-500",
            chartColor: "#a855f7", // Purple 500
            trend: "+5.2%",
            // Dữ liệu tỉ lệ thường biến động mạnh hơn
            chartData: [
                { v: 75 }, { v: 82 }, { v: 78 }, { v: 85 }, { v: 80 }, { v: 88 }, { v: 92 }
            ],
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

                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-background p-8 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] mb-8">

                    {/* Trang trí nền (Subtle Background Decor) */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                        {/* Phần bên trái: Thông tin chính */}
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            {/* Icon Dashboard với Hiệu ứng Glow */}
                            <motion.div
                                className="relative flex-shrink-0 group"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
                                <div className="relative p-5 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl border border-white/20">
                                    <LayoutDashboard className="w-9 h-9 text-white" />
                                </div>
                            </motion.div>

                            {/* Nội dung Text */}
                            <div className="flex-1 space-y-2 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                                    <Sparkles className="w-3 h-3" />
                                    Tổng quan hệ thống
                                </div>

                                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                                    Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Overview</span>
                                </h1>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-gray-700/50 shadow-sm">
                                        <div className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </div>
                                        Cập nhật Real-time
                                    </div>

                                    {lastUpdated && (
                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-gray-700/50 shadow-sm">
                                            <Clock className="w-4 h-4 text-indigo-500" />
                                            <span>{lastUpdated}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Phần bên phải: Actions */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-4">

                            {/* Nút Làm mới - Premium Style */}
                            <Button
                                variant="ghost"
                                className="group relative px-6 h-12 rounded-xl bg-white dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 shadow-sm border border-slate-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md active:scale-95 overflow-hidden"
                                onClick={refreshData}
                                disabled={isLoading}
                            >
                                <div className="flex items-center gap-3 relative z-10 font-semibold">
                                    <RefreshCw
                                        className={`w-4 h-4 transition-all duration-500 group-hover:rotate-180 ${isLoading ? 'animate-spin text-indigo-500' : 'text-slate-500'}`}
                                    />
                                    <span className="bg-gradient-to-r from-slate-600 to-slate-900 dark:from-slate-200 dark:to-white bg-clip-text">Làm mới</span>
                                </div>
                            </Button>

                            {/* Nút Xuất báo cáo - Primary Gradient */}
                            <Button
                                className="relative px-6 h-12 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:opacity-90 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 active:scale-95 group overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="flex items-center gap-3 relative z-10 font-semibold">
                                    <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                                    <span>Xuất báo cáo</span>
                                </div>
                            </Button>

                            {/* Badge chọn khoảng thời gian - Sophisticated style */}
                            <div className="flex items-center gap-2 p-1.5 pl-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                                <span className="text-xs font-bold text-indigo-600/70 dark:text-indigo-400 uppercase tracking-tighter">Kỳ báo cáo:</span>
                                <Badge
                                    variant="secondary"
                                    className="flex items-center gap-2 px-4 py-1.5 text-sm bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-100 dark:border-indigo-900 shadow-sm transition-all hover:bg-indigo-50"
                                >
                                    <Calendar className="w-3.5 h-3.5" />
                                    6 tháng
                                </Badge>
                            </div>
                        </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {secondaryStats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="group"
                    >
                        <Card className="relative overflow-hidden border-none bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] ring-1 ring-slate-200/50 dark:ring-white/10 transition-all duration-300 group-hover:ring-indigo-500/30">

                            <CardContent className="p-0"> {/* P-0 để biểu đồ sát viền nếu muốn hoặc tùy chỉnh */}
                                <div className="p-6 pb-2">
                                    <div className="flex justify-between items-start mb-4">
                                        {/* Icon với hiệu ứng kính mờ */}
                                        <div className={`p-2.5 rounded-xl ${stat.bg} bg-opacity-10 dark:bg-opacity-20 backdrop-blur-sm border border-${stat.color.split('-')[1]}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                        </div>

                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs bg-emerald-500/10 px-2 py-1 rounded-full">
                                                <TrendingUp className="w-3 h-3" />
                                                {stat.trend || "+12%"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                            {stat.label}
                                        </p>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                            {stat.value}
                                        </h3>
                                    </div>
                                </div>

                                {/* --- MINI SPARKLINE CHART --- */}
                                <div className="h-16 w-full mt-2 px-1">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={stat.chartData || [
                                            { v: 30 }, { v: 45 }, { v: 35 }, { v: 50 }, { v: 40 }, { v: 60 }, { v: 55 } // Data giả lập nếu thiếu
                                        ]}>
                                            <defs>
                                                <linearGradient id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor={stat.chartColor || "#6366f1"} stopOpacity={0.3} />
                                                    <stop offset="100%" stopColor={stat.chartColor || "#6366f1"} stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            {/* YAxis ẩn nhưng giữ domain để biểu đồ không bị "chạm trần" */}
                                            <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                                            <Area
                                                type="monotone"
                                                dataKey="v"
                                                stroke={stat.chartColor || "#6366f1"}
                                                strokeWidth={2}
                                                fill={`url(#grad-${index})`}
                                                isAnimationActive={true}
                                                animationDuration={2000}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Decor line mờ dưới đáy Card */}
                                <div className={`h-1 w-full opacity-20 ${stat.bg}`} />
                            </CardContent>

                            {/* Nút bấm ẩn hiện khi hover */}
                            <button className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-indigo-500">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </Card>
                    </motion.div>
                ))}
            </div>


            {/* Charts Section - Enhanced */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-1">
                {/* --- Revenue Chart Card --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    whileHover={{ y: -4 }}
                >
                    <Card className="overflow-hidden border-none bg-gradient-to-b from-card to-card/50 shadow-2xl shadow-primary/5 ring-1 ring-white/10">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                                        <BarChart3 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold tracking-tight">Doanh thu hệ thống</CardTitle>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                            <CalendarDays className="w-3 h-3" /> 6 tháng gần nhất
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <Badge className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/20 border-none px-3 py-1">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        {shopStats.revenueGrowth || 0}%
                                    </Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-4">
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.1} />
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                            animationDuration={1500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* --- Category Distribution Card --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    whileHover={{ y: -4 }}
                >
                    <Card className="overflow-hidden border-none bg-gradient-to-b from-card to-card/50 shadow-2xl shadow-primary/5 ring-1 ring-white/10">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-500 ring-1 ring-sky-500/20">
                                        <PieChart className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold tracking-tight">Cơ cấu danh mục</CardTitle>
                                        <p className="text-xs text-muted-foreground mt-1">Phân bổ theo doanh số bán hàng</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-full gap-2 text-xs">
                                    Chi tiết <ArrowUpRight className="w-3 h-3" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="flex flex-col items-center justify-center pt-6">
                            <div className="h-[300px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPieChart>
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={75}
                                            outerRadius={105}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                    className="hover:opacity-80 transition-opacity cursor-pointer"
                                                />
                                            ))}
                                        </Pie>
                                        <Legend
                                            verticalAlign="bottom"
                                            height={36}
                                            iconType="circle"
                                            formatter={(value) => <span className="text-xs font-medium text-muted-foreground">{value}</span>}
                                        />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                                {/* Center Label cho Donut Chart */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-10 text-center pointer-events-none">
                                    <p className="text-2xl font-bold italic">100%</p>
                                    <p className="text-[10px] uppercase text-muted-foreground tracking-widest">Tổng cộng</p>
                                </div>
                            </div>

                            {/* Thêm phần tóm tắt nhanh bên dưới */}
                            <div className="grid grid-cols-2 gap-4 w-full mt-6">
                                <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                                    <p className="text-[10px] uppercase text-muted-foreground">Best Seller</p>
                                    <p className="text-sm font-semibold">{categoryData[0]?.name || "N/A"}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                                    <p className="text-[10px] uppercase text-muted-foreground">Tỉ trọng cao nhất</p>
                                    <p className="text-sm font-semibold text-emerald-500">{categoryData[0]?.value || 0}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {cardData.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                        whileHover={{ y: -8 }}
                    >
                        <Card className="relative overflow-hidden border-none bg-background backdrop-blur-xl shadow-2xl ring-1 ring-slate-200 dark:ring-white/10 group">

                            {/* Background Glow trang trí */}
                            <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-10 bg-${item.color}-500 transition-opacity group-hover:opacity-20`} />

                            <CardContent className="p-8">
                                <div className="flex flex-col items-center text-center">

                                    {/* Visual Progress Circle cho Rating và Success Rate */}
                                    <div className="relative mb-6 flex items-center justify-center">
                                        <svg className="w-24 h-24 transform -rotate-90">
                                            <circle
                                                cx="48" cy="48" r="40"
                                                stroke="currentColor"
                                                strokeWidth="6"
                                                fill="transparent"
                                                className="text-slate-100 dark:text-slate-800"
                                            />
                                            <motion.circle
                                                cx="48" cy="48" r="40"
                                                stroke="currentColor"
                                                strokeWidth="6"
                                                fill="transparent"
                                                strokeDasharray="251.2"
                                                initial={{ strokeDashoffset: 251.2 }}
                                                animate={{ strokeDashoffset: 251.2 - (251.2 * item.percentage) / 100 }}
                                                transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                                                className={`text-${item.color}-500`}
                                                strokeLinecap="round"
                                            />
                                        </svg>

                                        {/* Icon chính giữa vòng tròn */}
                                        <div className={`absolute p-3 rounded-full bg-${item.color}-50 dark:bg-${item.color}-500/10`}>
                                            <item.icon className={`w-6 h-6 text-${item.color}-500`} />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className={`text-3xl font-black tracking-tight text-slate-900 dark:text-white`}>
                                            {item.value}
                                        </h3>
                                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                            {item.subValue}
                                        </p>
                                    </div>

                                    {/* Badge Footer nhỏ phía dưới */}
                                    <div className={`mt-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border border-${item.color}-500/20 bg-${item.color}-500/5 text-${item.color}-600 dark:text-${item.color}-400`}>
                                        <span className={`w-1.5 h-1.5 rounded-full bg-${item.color}-500 animate-pulse`} />
                                        {item.footer}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}