import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3, PieChart, Activity, Package } from "lucide-react";
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
    { status: "Chờ xử lý", count: 42, color: "#f59e0b" },
    { status: "Đang giao", count: 28, color: "#3b82f6" },
    { status: "Đã giao", count: 64, color: "#10b981" },
    { status: "Đã hủy", count: 10, color: "#ef4444" },
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

export function ShopAnalytics() {
    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-6"
            >
                <div className="flex items-center gap-3">
                    {/* Icon nền gradient */}
                    <div className="p-3 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-md">
                        <BarChart3 className="w-6 h-6" />
                    </div>

                    <div>
                        {/* Tiêu đề gradient bắt mắt */}
                        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
                            Báo cáo & Thống kê
                        </h1>

                        {/* Mô tả tinh tế */}
                        <p className="text-sm text-muted-foreground mt-1">
                            Phân tích chi tiết hiệu suất kinh doanh và xu hướng doanh thu
                        </p>
                    </div>
                </div>

                {/* Đường viền gradient nhẹ bên dưới */}
                <div className="mt-4 h-[2px] w-full bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-400 rounded-full opacity-60"></div>
            </motion.div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                            {/* Icon gradient */}
                            <div className="p-2 rounded-xl bg-gradient-to-tr from-green-500 to-emerald-400 text-white shadow-md">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-foreground">
                                    Doanh thu theo tháng (2024)
                                </CardTitle>
                                <CardDescription className="text-sm text-muted-foreground">
                                    Biểu đồ thể hiện xu hướng doanh thu tăng trưởng qua từng tháng
                                </CardDescription>
                            </div>
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
                                            background:
                                                "black",
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

                {/* Orders & Customers Chart */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                            {/* Icon gradient */}
                            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-400 text-white shadow-md">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-foreground">
                                    Đơn hàng & Khách hàng mới
                                </CardTitle>
                                <CardDescription className="text-sm text-muted-foreground">
                                    So sánh lượng đơn hàng và khách hàng mới theo từng tháng
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="w-full h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                                        </linearGradient>
                                        <linearGradient id="customersGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.9} />
                                            <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
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
                                        cursor={{ fill: "hsl(var(--muted))", opacity: 0.05 }}
                                        contentStyle={{
                                            background:
                                                "black",
                                            border: "1px solid rgba(0,0,0,0.1)",
                                            borderRadius: "12px",
                                            padding: "10px 14px",
                                            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                                            backdropFilter: "blur(10px)",
                                        }}
                                        labelStyle={{
                                            fontWeight: 600,
                                            color: "hsl(var(--primary))",
                                            fontSize: 13,
                                        }}
                                        formatter={(value, name) => [
                                            `${value} ${name === "Đơn hàng" ? "đơn" : "khách"}`,
                                            name,
                                        ]}
                                    />
                                    <Bar
                                        dataKey="orders"
                                        name="Đơn hàng"
                                        fill="url(#ordersGradient)"
                                        radius={[8, 8, 0, 0]}
                                        barSize={20}
                                        animationDuration={800}
                                    />
                                    <Bar
                                        dataKey="customers"
                                        name="Khách hàng"
                                        fill="url(#customersGradient)"
                                        radius={[8, 8, 0, 0]}
                                        barSize={20}
                                        animationDuration={800}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Category Sales Pie Chart */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            {/* Icon gradient */}
                            <div className="p-2 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-400 text-white shadow-md">
                                <PieChart className="w-5 h-5" />
                            </div>

                            <div>
                                <CardTitle className="text-lg font-bold text-foreground">
                                    Doanh số theo danh mục
                                </CardTitle>
                                <CardDescription className="text-sm text-muted-foreground">
                                    Phân bổ tỷ lệ doanh số giữa các danh mục sản phẩm trong năm 2024.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <ResponsiveContainer width="100%" height={320}>
                            <RechartsPieChart>
                                {/* Tooltip có màu chữ động và giao diện đẹp */}
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


                {/* Weekly Trends */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            {/* Icon gradient tròn bo góc, nổi bật */}
                            <div className="p-2 rounded-xl bg-gradient-to-tr from-orange-400 to-amber-500 text-white shadow-md">
                                <Activity className="w-5 h-5" />
                            </div>

                            <div>
                                <CardTitle className="text-lg font-bold text-foreground">
                                    Xu hướng tuần này
                                </CardTitle>
                                <CardDescription className="text-sm text-muted-foreground">
                                    Biểu đồ so sánh doanh thu và số đơn hàng trong 7 ngày gần nhất
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={weeklyTrends}>
                                {/* Lưới nền */}
                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    stroke="#E5E7EB"
                                    opacity={0.6}
                                />

                                {/* Trục X */}
                                <XAxis
                                    dataKey="day"
                                    stroke="#6B7280"
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
                                        backgroundColor: "black",
                                        border: "0px solid #E5E7EB",
                                        borderRadius: "12px",
                                        color: "#fff",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                    }}
                                    formatter={(value, name) => [
                                        name === "orders"
                                            ? `${value} đơn`
                                            : `${value.toLocaleString()}₫`,
                                        name === "orders" ? "Đơn hàng" : "Doanh thu",
                                    ]}
                                />

                                {/* Line: Orders */}
                                <Line
                                    type="monotone"
                                    dataKey="orders"
                                    name="Đơn hàng"
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                    dot={{ fill: "#3B82F6", r: 4 }}
                                    activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                                />

                                {/* Line: Revenue */}
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    name="Doanh thu"
                                    stroke="#F97316"
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


                {/* Order Status Distribution */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl text-white">
                                <Package size={18} />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-foreground">
                                    Phân bổ trạng thái đơn hàng
                                </CardTitle>
                                <CardDescription className="text-sm text-muted-foreground">
                                    Tình hình xử lý và hoàn thành đơn hàng gần đây
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="relative w-full h-[340px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={orderStatusData}
                                    layout="vertical"
                                    margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                                >
                                    <defs>
                                        {orderStatusData.map((entry, i) => (
                                            <linearGradient
                                                key={`grad-${i}`}
                                                id={`grad-${i}`}
                                                x1="0"
                                                y1="0"
                                                x2="100%"
                                                y2="0"
                                            >
                                                <stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
                                                <stop offset="100%" stopColor={entry.color} stopOpacity={0.4} />
                                            </linearGradient>
                                        ))}
                                    </defs>

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="hsl(var(--border))"
                                        opacity={0.3}
                                    />
                                    <XAxis
                                        type="number"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                    />
                                    <YAxis
                                        dataKey="status"
                                        type="category"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={13}
                                        width={120}
                                    />
                                    <Tooltip
                                        cursor={{ fill: "hsl(var(--muted))", opacity: 0.05 }}
                                        contentStyle={{
                                            background:
                                                "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(245,245,245,0.9))",
                                            border: "1px solid rgba(0,0,0,0.1)",
                                            borderRadius: "12px",
                                            backdropFilter: "blur(10px)",
                                            padding: "10px 14px",
                                            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                                        }}
                                        labelStyle={{
                                            fontWeight: 600,
                                            color: "hsl(var(--primary))",
                                            fontSize: 13,
                                        }}
                                        formatter={(value) => [`${value} đơn`, "Số lượng"]}
                                    />
                                    <Bar
                                        dataKey="count"
                                        radius={[12, 12, 12, 12]}
                                        barSize={22}
                                        animationDuration={800}
                                    >
                                        {orderStatusData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={`url(#grad-${index})`}
                                                style={{
                                                    filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.15))",
                                                    transition: "all 0.3s ease",
                                                }}
                                                className="hover:scale-[1.03] hover:opacity-90"
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
