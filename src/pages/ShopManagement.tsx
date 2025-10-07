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
    PieChart,
    ClipboardCheck,
    PackageCheck,
    Truck,
    CheckCircle,
    XCircle
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
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const ShopManagement = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();

    const [shopStats, setShopStats] = useState<any>(null);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Thêm state cho avatar preview và loading
    const [avatarModalOpen, setAvatarModalOpen] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mở modal khi click nút đổi avatar
    const openAvatarModal = () => setAvatarModalOpen(true);
    const closeAvatarModal = () => {
        setAvatarModalOpen(false);
        setAvatarFile(null);
        setAvatarPreview(null);
    };

    // State cho modal xem chi tiết đơn hàng
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const openOrderModal = (order: any) => {
        setSelectedOrder(order);
        setOrderModalOpen(true);
    };
    const closeOrderModal = () => {
        setSelectedOrder(null);
        setOrderModalOpen(false);
    };

    useEffect(() => {
        if (!user?.id) return;
        const fetchData = async () => {
            setLoading(true);
            // 1. Lấy overview (lấy seller_id từ đây)
            const overviewRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/overview.php?user_id=${user.id}`);
            const overview = await overviewRes.json();
            setShopStats(overview);

            if (overview.seller_id || overview.totalProducts !== undefined) {
                // 2. Lấy đơn hàng gần đây
                const ordersRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/recent_orders.php?seller_id=${overview.seller_id}`);
                setRecentOrders(await ordersRes.json());

                // 3. Lấy sản phẩm bán chạy
                const topRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/top_products.php?seller_id=${overview.seller_id}`);
                setTopProducts(await topRes.json());
            }
            setLoading(false);
        };
        fetchData();
    }, [user]);

    // Xử lý chọn file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    // Xử lý upload avatar
    const handleUploadAvatar = async () => {
        if (!avatarFile) return;
        setAvatarUploading(true);
        const formData = new FormData();
        formData.append("file", avatarFile);

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload.php`, {
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        if (data.url) {
            // Gọi API cập nhật avatar cho seller
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/update_avatar.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    seller_id: shopStats.seller_id,
                    avatar: data.url,
                }),
            });

            // Fetch lại overview để lấy avatar mới nhất từ backend
            const overviewRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/overview.php?user_id=${user.id}`);
            const overview = await overviewRes.json();
            setShopStats(overview);

            closeAvatarModal();
        }
        setAvatarUploading(false);
    };

    const updateOrderStatus = async (orderId: number, status: string) => {
        setUpdatingStatus(true);
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/update_status.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id: orderId, status }),
        });
        const data = await res.json();
        if (data.success) {
            toast({ title: "Cập nhật trạng thái thành công!" });
            // Cập nhật lại danh sách đơn hàng
            setRecentOrders((prev) =>
                prev.map((o) => (o.id === orderId ? { ...o, status } : o))
            );
            // Nếu trạng thái mới là "delivered", cộng doanh thu ngay
            if (status === "delivered") {
                // Tìm đơn hàng vừa giao
                const order = recentOrders.find((o) => o.id === orderId);
                if (order) {
                    setShopStats((prev: any) => ({
                        ...prev,
                        totalRevenue: (prev?.totalRevenue || 0) + (order.amount || 0)
                    }));
                }
            }
            closeOrderModal();
        } else {
            toast({ title: "Cập nhật thất bại!", variant: "destructive" });
        }
        setUpdatingStatus(false);
    };

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
            pending: { label: "Chờ xác nhận", variant: "warning" as const, color: "#F59E42" }, // cam
            processing: { label: "Đang xử lý", variant: "info" as const, color: "#3B82F6" }, // xanh dương
            shipped: { label: "Đã gửi", variant: "primary" as const, color: "#6366F1" }, // xanh tím
            delivered: { label: "Đã giao", variant: "success" as const, color: "#10B981" }, // xanh lá
            cancelled: { label: "Đã hủy", variant: "destructive" as const, color: "#EF4444" }  // đỏ
        };

        const config = statusConfig[status as keyof typeof statusConfig];
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
                {config.label}
            </Badge>
        );
    };


    const orderSteps = [
        { key: "pending", label: "Chờ xác nhận", icon: <ClipboardCheck /> },
        { key: "processing", label: "Đang xử lý", icon: <PackageCheck /> },
        { key: "shipped", label: "Đã gửi", icon: <Truck /> },
        { key: "delivered", label: "Đã giao", icon: <CheckCircle /> },
        { key: "cancelled", label: "Đã hủy", icon: <XCircle /> }
    ];

    if (loading || !shopStats) {
        return (
            <div className="flex min-h-[100vh] items-center justify-center">
                {loading && (
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="flex flex-col items-center">
                            <div className="relative w-20 h-20">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <img src="/logo.png" alt="Logo" className="w-10 h-10" />
                                </div>
                                <div className="absolute inset-0 rounded-full border-4 border-gray-300 border-t-transparent animate-spin"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
                        {/* Left */}
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                                <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                                Quản lý cửa hàng
                            </h1>

                            {/* Avatar & Tên cửa hàng */}
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src={shopStats.avatar || "/images/avatars/default-shop-avatar.png"}
                                        alt="Avatar cửa hàng"
                                        className="w-20 h-20 rounded-full border-4 border-primary object-cover"
                                    />
                                    <button
                                        className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow hover:bg-primary/90 transition"
                                        onClick={openAvatarModal}
                                        title="Đổi ảnh đại diện"
                                        type="button"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{shopStats.store_name}</h2>
                                    <p className="text-muted-foreground">ID cửa hàng: VibeMark{shopStats.seller_id}</p>
                                </div>
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

                {/* Modal đổi avatar */}
                <Dialog open={avatarModalOpen} onOpenChange={setAvatarModalOpen}>
                    <DialogContent className="max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Đổi ảnh đại diện cửa hàng</DialogTitle>
                        </DialogHeader >
                        <div className="flex flex-col items-center gap-4 py-4">
                            <img
                                src={avatarPreview || shopStats.avatar || "/images/avatars/default-shop-avatar.png"}
                                alt="Avatar preview"
                                className="w-28 h-28 rounded-full border-4 border-primary object-cover"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <Button
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={avatarUploading}
                            >
                                Chọn ảnh mới
                            </Button>
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={handleUploadAvatar}
                                disabled={!avatarFile || avatarUploading}
                                className="bg-gradient-primary w-full"
                            >
                                {avatarUploading ? "Đang lưu..." : "Lưu ảnh đại diện"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

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
                                    <p className="text-2xl font-bold">{(shopStats.totalRevenue / 1000000)}M</p>
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
                                    {recentOrders.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                            <ShoppingBag className="w-12 h-12 mb-2" />
                                            <p className="text-base font-medium">Chưa có đơn hàng nào</p>
                                        </div>
                                    ) : (
                                        recentOrders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="p-4 border border-border rounded-lg flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                                            >
                                                {/* Thông tin cơ bản */}
                                                <div className="flex flex-col md:flex-row md:items-center md:gap-4 flex-1">
                                                    <div>
                                                        <p className="font-medium">#{order.code}</p>
                                                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                                                    </div>

                                                    {/* Mobile hiển thị bên dưới, PC hiển thị ngang */}
                                                    <div className="mt-2 md:mt-0">
                                                        <p className="font-medium">{order.product}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {order.amount.toLocaleString("vi-VN")}đ
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Trạng thái + nút hành động */}
                                                <div className="flex flex-row items-center gap-3 md:self-auto self-end">
                                                    <div className="flex items-center">
                                                        {getStatusBadge(order.status)}
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openOrderModal(order)}
                                                        className="md:w-auto w-full flex items-center"
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Xem
                                                    </Button>
                                                </div>

                                            </div>
                                        ))
                                    )}
                                </div>

                            </CardContent>
                        </Card>
                    </TabsContent>

                    <Dialog open={orderModalOpen} onOpenChange={setOrderModalOpen}>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold flex items-center gap-2">
                                    <ClipboardCheck className="w-5 h-5 text-primary" />
                                    Chi tiết đơn hàng <span className="text-primary">#{selectedOrder?.code}</span>
                                </DialogTitle>
                            </DialogHeader>

                            {selectedOrder && (
                                <div className="space-y-6">
                                    {/* Thông tin khách hàng & đơn hàng */}
                                    <div className="bg-background rounded-lg p-4 space-y-2 shadow-sm">
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Khách hàng:</span>
                                            <span>{selectedOrder.customer}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Sản phẩm:</span>
                                            <span>{selectedOrder.product}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Số tiền:</span>
                                            <span className="text-red-600 font-bold">
                                                {selectedOrder.amount.toLocaleString("vi-VN")}đ
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Trạng thái:</span>
                                            {getStatusBadge(selectedOrder.status)}
                                        </div>
                                    </div>

                                    {/* Nếu có nhiều sản phẩm */}
                                    {selectedOrder.items && (
                                        <div>
                                            <h4 className="font-semibold mb-2">Danh sách sản phẩm</h4>
                                            <table className="w-full text-sm border">
                                                <thead>
                                                    <tr>
                                                        <th className="p-2 border">Tên sản phẩm</th>
                                                        <th className="p-2 border">Số lượng</th>
                                                        <th className="p-2 border">Đơn giá</th>
                                                        <th className="p-2 border">Thành tiền</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedOrder.items.map((item: any, idx: number) => (
                                                        <tr key={idx}>
                                                            <td className="p-2 border">{item.name}</td>
                                                            <td className="p-2 border">{item.quantity}</td>
                                                            <td className="p-2 border">{item.price.toLocaleString('vi-VN')}đ</td>
                                                            <td className="p-2 border">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* Stepper tiến trình trạng thái */}
                                    <div>
  <h3 className="text-sm font-semibold mb-3">Tiến trình đơn hàng</h3>
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-2">
    {orderSteps
      .slice(0, selectedOrder.status === "cancelled" ? 4 : 5)
      .map((step, idx) => {
        const active =
          orderSteps.findIndex((s) => s.key === selectedOrder.status) >= idx;
        return (
          <div
            key={step.key}
            className="flex flex-col items-center md:flex-1 relative"
          >
            {/* Icon */}
            <div
              className={`rounded-full w-10 h-10 flex items-center justify-center mb-1 shadow transition
                ${active ? "bg-green-500 text-white scale-110" : "bg-gray-200 text-gray-400"}`}
            >
              {step.icon}
            </div>

            {/* Label */}
            <span
              className={`text-xs text-center ${
                active ? "text-green-600 font-semibold" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>

            {/* Line connector */}
            {idx < orderSteps.length - 1 && (
              <>
                {/* Mobile: dọc */}
                <div
                  className={`hidden md:block h-1 w-full ${
                    active ? "bg-green-400" : "bg-gray-200"
                  }`}
                ></div>
                {/* PC: ngang */}
                <div
                  className={`block md:hidden w-1 h-full absolute top-12 ${
                    active ? "bg-green-400" : "bg-gray-200"
                  }`}
                ></div>
              </>
            )}
          </div>
        );
      })}
  </div>
</div>

                                </div>
                            )}

                            {/* Footer nút thao tác */}
                            <DialogFooter className="flex flex-col gap-2 mt-4">
                                {selectedOrder?.status === "pending" && (
                                    <>
                                        <Button
                                            onClick={() => updateOrderStatus(selectedOrder.id, "processing")}
                                            disabled={updatingStatus}
                                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                                        >
                                            Xác nhận đơn hàng
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => updateOrderStatus(selectedOrder.id, "cancelled")}
                                            disabled={updatingStatus}
                                            className="w-full"
                                        >
                                            Hủy đơn hàng
                                        </Button>
                                    </>
                                )}
                                {selectedOrder?.status === "processing" && (
                                    <Button
                                        onClick={() => updateOrderStatus(selectedOrder.id, "shipped")}
                                        disabled={updatingStatus}
                                        className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                                    >
                                        Đánh dấu đã gửi hàng
                                    </Button>
                                )}
                                {selectedOrder?.status === "shipped" && (
                                    <Button
                                        onClick={() => updateOrderStatus(selectedOrder.id, "delivered")}
                                        disabled={updatingStatus}
                                        className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white"
                                    >
                                        Đánh dấu đã giao hàng
                                    </Button>
                                )}
                                <Button variant="outline" onClick={closeOrderModal} className="w-full">
                                    Đóng
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

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
                                    {topProducts.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                            <Package className="w-12 h-12 mb-2" />
                                            <p className="text-base font-medium">Chưa có sản phẩm bán chạy</p>
                                        </div>
                                    ) : (
                                        topProducts.map((product, index) => (
                                            <div
                                                key={product.name}
                                                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-border rounded-lg"
                                            >
                                                {/* STT */}
                                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                                                    {index + 1}
                                                </div>
                                                {/* Hình ảnh */}
                                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-6 h-6 text-gray-500" />
                                                    )}
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
                                        ))
                                    )}
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