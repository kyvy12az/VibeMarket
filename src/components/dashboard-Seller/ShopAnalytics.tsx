import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    TrendingUp,
    BarChart3,
    PieChart,
    Activity,
    Package,
    DollarSign,
    ShoppingBag,
    Users,
    Loader2,
    RefreshCw,
    AlertCircle
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
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
    success: boolean;
    year: number;
    seller_id?: number;
    overview: {
        total_orders: number;
        total_customers: number;
        total_revenue: number;
        avg_order_value: number;
    };
    revenue_data: Array<{
        month: string;
        revenue: number;
        orders: number;
        customers: number;
    }>;
    category_data: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    order_status_data: Array<{
        status: string;
        count: number;
        color: string;
    }>;
    weekly_trends: Array<{
        day: string;
        orders: number;
        revenue: number;
    }>;
}

export function ShopAnalytics() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [year] = useState(new Date().getFullYear());
    const [data, setData] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        if (user?.id) {
            fetchAnalyticsData();
        }
    }, [user, year]);

    const fetchAnalyticsData = async () => {
        if (!user?.id) return;

        setLoading(true);
        setError(null);

        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/api/vendor/analytics_dashboard.php?user_id=${user.id}&year=${year}`;
            console.log('Fetching analytics from:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            // Kiểm tra content-type
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error('Non-JSON response:', text.substring(0, 500));
                throw new Error('Server không trả về JSON. Vui lòng kiểm tra lại cấu hình.');
            }

            const result = await response.json();
            console.log('Analytics data:', result);

            if (result.success) {
                setData(result);
                setError(null);
            } else {
                const errorMsg = result.error || "Không thể tải dữ liệu thống kê";
                setError(errorMsg);
                toast({
                    title: "Lỗi",
                    description: errorMsg,
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
            const errorMessage = error instanceof Error ? error.message : "Không thể kết nối đến server";
            setError(errorMessage);
            toast({
                title: "Lỗi kết nối",
                description: errorMessage,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="mt-4 text-muted-foreground">Đang tải dữ liệu thống kê...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Không thể tải dữ liệu</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={fetchAnalyticsData} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Thử lại
                    </Button>
                </div>
            </div>
        );
    }

    if (!data || !data.overview) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Chưa có dữ liệu thống kê năm {year}</p>
                    <Button onClick={fetchAnalyticsData} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Tải lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-6"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-md">
                            <BarChart3 className="w-6 h-6" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
                                Báo cáo & Thống kê {year}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Phân tích chi tiết hiệu suất kinh doanh và xu hướng doanh thu
                            </p>
                        </div>
                    </div>

                    <Button onClick={fetchAnalyticsData} variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Làm mới
                    </Button>
                </div>

                <div className="mt-4 h-[2px] w-full bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-400 rounded-full opacity-60"></div>
            </motion.div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
                                <p className="text-2xl font-bold">
                                    {(data.overview.total_revenue / 1000000).toFixed(1)}M đ
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-green-100 text-green-600">
                                <DollarSign className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
                                <p className="text-2xl font-bold">{data.overview.total_orders}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Khách hàng</p>
                                <p className="text-2xl font-bold">{data.overview.total_customers}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Giá trị TB/Đơn</p>
                                <p className="text-2xl font-bold">
                                    {(data.overview.avg_order_value / 1000).toFixed(0)}K đ
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-gradient-to-tr from-green-500 to-emerald-400 text-white shadow-md">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-foreground">
                                    Doanh thu theo tháng ({year})
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
                                <AreaChart data={data.revenue_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            background:
                                                "black",
                                            border: "1px solid rgba(0,0,0,0.1)",
                                            borderRadius: "12px",
                                            padding: "10px 14px",
                                            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                                        }}
                                        formatter={(value) => [`${value}M đ`, "Doanh thu"]}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={3}
                                        fill="url(#revenueGradient)"
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
                                <BarChart data={data.revenue_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            background: "black",
                                            border: "1px solid rgba(0,0,0,0.1)",
                                            borderRadius: "12px",
                                            padding: "10px 14px",
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
                                    />
                                    <Bar
                                        dataKey="customers"
                                        name="Khách hàng"
                                        fill="url(#customersGradient)"
                                        radius={[8, 8, 0, 0]}
                                        barSize={20}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Category Sales Pie Chart */}
                {data.category_data && data.category_data.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-400 text-white shadow-md">
                                    <PieChart className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold text-foreground">
                                        Doanh số theo danh mục
                                    </CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground">
                                        Phân bổ tỷ lệ doanh số giữa các danh mục sản phẩm
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <ResponsiveContainer width="100%" height={320}>
                                <RechartsPieChart>
                                    <Tooltip
                                        contentStyle={{
                                            background: "linear-gradient(145deg, #fff, #f9fafb)",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "10px",
                                            padding: "10px 14px",
                                        }}
                                        formatter={(value, name, entry) => [
                                            <span style={{ color: entry.payload.color, fontWeight: 600 }}>
                                                {value}%
                                            </span>,
                                            name,
                                        ]}
                                    />
                                    <Pie
                                        data={data.category_data}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={110}
                                        innerRadius={55}
                                        paddingAngle={4}
                                        dataKey="value"
                                        label={({ value }) => `${value}%`}
                                    >
                                        {data.category_data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                                        ))}
                                    </Pie>
                                    <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Weekly Trends */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
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
                            <LineChart data={data.weekly_trends}>
                                <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" opacity={0.6} />
                                <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                                <YAxis stroke="#6B7280" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "black",
                                        borderRadius: "12px",
                                        color: "#fff",
                                    }}
                                    formatter={(value, name) => [
                                        name === "orders" ? `${value} đơn` : `${value}M đ`,
                                        name === "orders" ? "Đơn hàng" : "Doanh thu",
                                    ]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="orders"
                                    name="Đơn hàng"
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                    dot={{ fill: "#3B82F6", r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    name="Doanh thu"
                                    stroke="#F97316"
                                    strokeWidth={3}
                                    dot={{ fill: "#F97316", r: 4 }}
                                />
                                <Legend verticalAlign="top" align="right" iconType="circle" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Order Status Distribution */}
                {data.order_status_data && data.order_status_data.length > 0 && (
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
                                        Tình hình xử lý và hoàn thành đơn hàng năm {year}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="relative w-full h-[340px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.order_status_data} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                                        <defs>
                                            {data.order_status_data.map((entry, i) => (
                                                <linearGradient key={`grad-${i}`} id={`grad-${i}`} x1="0" y1="0" x2="100%" y2="0">
                                                    <stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
                                                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.4} />
                                                </linearGradient>
                                            ))}
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                        <YAxis dataKey="status" type="category" stroke="hsl(var(--muted-foreground))" fontSize={13} width={120} />
                                        <Tooltip
                                            contentStyle={{
                                                background: "rgba(0, 0, 0, 0.9)",
                                                backdropFilter: "blur(10px)",
                                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                                borderRadius: "12px",
                                                padding: "12px 16px",
                                                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                                            }}
                                            labelStyle={{
                                                color: "#fff",
                                                fontWeight: "600",
                                                fontSize: "14px",
                                                marginBottom: "4px",
                                            }}
                                            itemStyle={{
                                                color: "#fff",
                                                fontSize: "13px",
                                            }}
                                            formatter={(value, name, props) => {
                                                const entry = props.payload;
                                                return [
                                                    <span style={{
                                                        color: entry.color,
                                                        fontWeight: "700",
                                                        fontSize: "15px"
                                                    }}>
                                                        {value} đơn
                                                    </span>,
                                                    <span style={{ color: "#e5e7eb" }}>Số lượng</span>
                                                ];
                                            }}
                                            cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                                        />
                                        <Bar dataKey="count" radius={[12, 12, 12, 12]} barSize={22}>
                                            {data.order_status_data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={`url(#grad-${index})`} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
