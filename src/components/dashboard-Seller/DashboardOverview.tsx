import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, ShoppingBag, Star, Users, Activity, LayoutDashboard, PieChart } from "lucide-react";
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

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;

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
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                // Giữ nguyên default data nếu có lỗi
            }
        };

        fetchData();
    }, [user]);

    const stats = [
        {
            label: "Tổng sản phẩm",
            value: shopStats.totalProducts || 0,
            desc: "có trong cửa hàng",
            color: "from-green-50 to-green-100 text-green-700",
            iconBg: "bg-green-500",
            icon: Package,
        },
        {
            label: "Đơn hàng",
            value: shopStats.totalOrders || 0,
            desc: `đã đặt thành công (${shopStats.totalDeliveredOrders || 0} đã giao)`,
            color: "from-blue-50 to-blue-100 text-blue-700",
            iconBg: "bg-blue-500",
            icon: ShoppingBag,
        },
        {
            label: "Doanh thu",
            value: `${((shopStats.totalRevenue || 0) / 1_000_000).toFixed(1)}M đ`,
            desc: `${shopStats.revenueGrowth >= 0 ? '+' : ''}${shopStats.revenueGrowth || 0}% so với tháng trước`,
            color: "from-purple-50 to-purple-100 text-purple-700",
            iconBg: "bg-purple-500",
            icon: TrendingUp,
        },
        {
            label: "Đánh giá TB",
            value: shopStats.avgRating || 0,
            desc: `từ ${shopStats.totalReviews || 0} đánh giá`,
            color: "from-yellow-50 to-yellow-100 text-yellow-700",
            iconBg: "bg-yellow-500",
            icon: Star,
        },
        {
            label: "Khách hàng",
            value: shopStats.totalCustomers || 0,
            desc: "đã đặt hàng",
            color: "from-pink-50 to-pink-100 text-pink-700",
            iconBg: "bg-pink-500",
            icon: Users,
        },
        {
            label: "Tỷ lệ hoàn thành",
            value: shopStats.conversionRate || '0%',
            desc: `${shopStats.conversionGrowth || 0}% so với tháng trước`,
            color: "from-orange-50 to-orange-100 text-orange-700",
            iconBg: "bg-orange-500",
            icon: Activity,
        },
    ];

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-6"
            >
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-md">
                        <LayoutDashboard className="w-6 h-6" />
                    </div>

                    <div>
                        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                            Tổng quan cửa hàng
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Theo dõi hiệu suất kinh doanh của bạn theo thời gian thực
                        </p>
                    </div>
                </div>

                <div className="mt-4 h-[2px] w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full opacity-60"></div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {stats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                        <Card
                            className={`bg-gradient-to-br ${s.color} border-none rounded-2xl shadow-md hover:shadow-xl transition-all duration-300`}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium opacity-70 mb-1">{s.label}</p>
                                        <p className="text-3xl font-bold">{s.value}</p>
                                        <p className="text-xs opacity-70 mt-1">{s.desc}</p>
                                    </div>
                                    <div
                                        className={`w-12 h-12 ${s.iconBg} rounded-full flex items-center justify-center shadow-md`}
                                    >
                                        <s.icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 shadow-md">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <CardTitle className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent text-lg font-semibold">
                                    Doanh thu 6 tháng gần nhất
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full h-[320px]">
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
                                                background: "hsl(var(--popover))",
                                                border: "1px solid rgba(0,0,0,0.1)",
                                                borderRadius: "12px",
                                                padding: "10px 14px",
                                                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
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

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 via-sky-500 to-green-500 shadow-md">
                                    <PieChart className="w-5 h-5 text-white" />
                                </div>
                                <CardTitle className="bg-gradient-to-r from-cyan-500 via-sky-500 to-green-500 bg-clip-text text-transparent text-lg font-semibold">
                                    Doanh số theo danh mục
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={320}>
                                <RechartsPieChart>
                                    <Tooltip
                                        cursor={{ fill: "hsl(var(--muted))", opacity: 0.05 }}
                                        contentStyle={{
                                            background: "linear-gradient(145deg, #fff, #f9fafb)",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "10px",
                                            padding: "10px 14px",
                                            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                                        }}
                                        labelStyle={{
                                            fontWeight: 600,
                                            fontSize: 13,
                                            color: "#4b5563",
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
        </div>
    );
}
