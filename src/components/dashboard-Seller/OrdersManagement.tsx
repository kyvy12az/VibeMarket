import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Eye,
  Search,
  Package,
  MapPin,
  Clock,
  ShoppingCart,
  Loader2,
  Filter,
  Download,
  ArrowUpRight,
  TrendingUp,
  Users,
  CheckCircle,
  Truck,
  AlertCircle,
  XCircle,
  Phone,
  Mail,
  CreditCard,
  FileText,
  Calendar,
  RefreshCw,
  Star,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
  size: string | null;
  color: string | null;
  subtotal: number;
}

interface Order {
  id: number;
  code: string;
  customer_name: string;
  email: string | null;
  phone: string;
  address: string;
  note: string | null;
  total: number;
  shipping_fee: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_method: string;
  payment_status: string;
  created_at: string;
  shipping_tracking_code: string | null;
  total_quantity: number;
  seller_total: number;
  items: OrderItem[];
}

const statusConfig = {
  pending: {
    label: "Chờ xử lý",
    variant: "secondary" as const,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
    gradient: "from-yellow-400 to-orange-500"
  },
  processing: {
    label: "Đang xử lý",
    variant: "default" as const,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Package,
    gradient: "from-blue-400 to-indigo-500"
  },
  shipped: {
    label: "Đã gửi",
    variant: "default" as const,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Truck,
    gradient: "from-purple-400 to-pink-500"
  },
  delivered: {
    label: "Đã giao",
    variant: "default" as const,
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    gradient: "from-green-400 to-emerald-500"
  },
  cancelled: {
    label: "Đã hủy",
    variant: "destructive" as const,
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    gradient: "from-red-400 to-rose-500"
  }
};

export function OrdersManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders(activeTab);
  }, [user, activeTab]);

  const fetchOrders = async (status: string = 'all') => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/vendor/get_orders.php?user_id=${user.id}&status=${status}`
      );
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        toast({
          title: "Lỗi",
          description: data.error || "Không thể tải danh sách đơn hàng",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Lỗi",
        description: "Không thể kết nối tới máy chủ",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    if (!user?.id) return;

    setUpdating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/vendor/update_order_status.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            order_id: orderId,
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật trạng thái đơn hàng",
        });
        fetchOrders(activeTab);
        setSelectedOrder(null);
      } else {
        toast({
          title: "Lỗi",
          description: data.error || "Không thể cập nhật trạng thái",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Lỗi",
        description: "Không thể kết nối tới máy chủ",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchOrders(activeTab);
    setRefreshing(false);
  };

  const filterOrders = () => {
    if (!searchTerm) return orders;

    return orders.filter(order =>
      order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;

    return (
      <Badge
        variant={config.variant}
        className={`${config.color} border font-medium gap-1.5 px-3 py-1.5`}
      >
        <IconComponent className="w-3.5 h-3.5" />
        {config.label}
      </Badge>
    );
  };

  const getStatusCount = (status: string) => {
    if (status === 'all') return orders.length;
    return orders.filter(o => o.status === status).length;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate stats for dashboard cards
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.reduce((sum, order) => sum + order.seller_total, 0)
  };

  const statItems = [
    {
      label: "Tổng đơn hàng",
      value: stats.total,
      icon: ShoppingCart,
      color: "blue",
      gradient: "from-blue-500 to-cyan-400",
      change: "+12.5%",
      desc: "So với tháng trước"
    },
    {
      label: "Chờ xử lý",
      value: stats.pending,
      icon: Clock,
      color: "orange",
      gradient: "from-orange-500 to-amber-400",
      change: "+5",
      desc: "Cần ưu tiên"
    },
    {
      label: "Đang xử lý",
      value: stats.processing,
      icon: Package,
      color: "purple",
      gradient: "from-purple-500 to-pink-400",
      change: "+8",
      desc: "Trong kho/Vận chuyển"
    },
    {
      label: "Đã giao",
      value: stats.delivered,
      icon: CheckCircle,
      color: "emerald",
      gradient: "from-emerald-500 to-teal-400",
      change: "+15%",
      desc: "Hoàn tất thành công"
    },
    {
      label: "Doanh thu",
      value: `${(stats.revenue / 1_000_000).toFixed(1)}M`,
      icon: TrendingUp,
      color: "rose",
      gradient: "from-rose-500 to-orange-400",
      change: "+20.8%",
      desc: "Tăng trưởng ròng"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 mx-auto w-20 h-20 flex items-center justify-center shadow-xl">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Đang tải dữ liệu</h3>
            <p className="text-muted-foreground">Vui lòng đợi trong giây lát...</p>
          </div>
        </motion.div>
      </div>
    );
  }

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

        <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">

          {/* Background Decor (Tạo chiều sâu) */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* Bên trái: Brand & Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">

              {/* Icon Box với hiệu ứng Floating */}
              <motion.div
                className="relative flex-shrink-0"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 blur-xl opacity-40 animate-pulse" />
                <div className="relative p-5 rounded-[2rem] bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-2xl border border-white/20">
                  <ShoppingCart className="w-9 h-9 text-white" />
                </div>
              </motion.div>

              <div className="space-y-3">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-[0.15em] border border-blue-500/20">
                    E-Commerce
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    Operations
                  </span>
                </div>

                <div className="space-y-1">
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                    Quản lý <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Đơn hàng</span>
                  </h1>
                  <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Hệ thống đang đồng bộ real-time
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bên phải: Actions Center */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3">

              {/* Nút Làm mới (Ghost style) */}
              <Button
                variant="ghost"
                className="h-12 px-5 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/50 dark:border-white/5 transition-all active:scale-95 group"
                onClick={refreshData}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 transition-transform duration-500 group-hover:rotate-180 ${refreshing ? 'animate-spin text-blue-500' : 'text-slate-500'}`} />
                <span className="font-bold text-slate-600 dark:text-slate-300">Làm mới</span>
              </Button>

              {/* Nút Xuất báo cáo (Glass style) */}
              <Button
                variant="outline"
                className="h-12 px-5 rounded-2xl border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
              >
                <Download className="w-4 h-4 mr-2 text-slate-500" />
                <span className="font-bold text-slate-600 dark:text-slate-300">Xuất báo cáo</span>
              </Button>

              {/* Nút Lọc nâng cao (Primary style) */}
              <Button
                className="h-12 px-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 shadow-xl shadow-slate-200 dark:shadow-none transition-all active:scale-95 group"
              >
                <Filter className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                <span className="font-bold">Lọc nâng cao</span>
                <div className="ml-2 px-1.5 py-0.5 rounded-md bg-white/20 dark:bg-slate-900/10 text-[10px]">
                  F
                </div>
              </Button>
            </div>

          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {statItems.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="group"
          >
            <Card className="relative overflow-hidden border-none bg-background backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none ring-1 ring-slate-200/50 dark:ring-white/10 transition-all duration-300 group-hover:ring-${stat.color}-500/50">

              {/* Hiệu ứng Glow nền */}
              <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-500/10 blur-3xl rounded-full group-hover:bg-${stat.color}-500/20 transition-colors`} />

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  {/* Icon Container với Gradient & Shadow */}
                  <div className={`relative p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg shadow-${stat.color}-500/30 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Badge tăng trưởng */}
                  <div className="flex flex-col items-end">
                    <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400`}>
                      <ArrowUpRight className="w-3 h-3" />
                      {stat.change}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 relative z-10">
                  <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    {stat.value}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>

                {/* Sub-description mờ ẩn hiện khi hover */}
                <p className="mt-4 text-[10px] text-slate-400 dark:text-slate-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {stat.desc}
                </p>

                {/* Thanh tiến trình trang trí ở đáy */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${stat.gradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Card chính sử dụng bg-background/70 cho hiệu ứng Glassmorphism */}
        <Card className="overflow-hidden border-border bg-background/70 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] ring-1 ring-border/50">

          {/* Header với border-border */}
          <CardHeader className="p-8 border-b border-border">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary blur-lg opacity-20 animate-pulse" />
                  <div className="relative p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
                    <FileText className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-black tracking-tight text-foreground">Trung tâm Đơn hàng</CardTitle>
                  <p className="text-sm font-medium text-muted-foreground">Quản lý và vận hành luồng giao dịch của cửa hàng</p>
                </div>
              </div>

              {/* Ô tìm kiếm sử dụng bg-muted/50 */}
              <div className="relative w-full xl:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Tìm mã đơn, tên hoặc số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 pl-12 pr-4 bg-muted/50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* TabsList sử dụng bg-muted/80 */}
              <div className="px-8 pt-6">
                <TabsList className="flex w-fit h-auto p-1.5 bg-muted/80 rounded-2xl border border-border">
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'pending', label: 'Chờ xử lý' },
                    { id: 'processing', label: 'Đang xử lý' },
                    { id: 'shipped', label: 'Đã gửi' },
                    { id: 'delivered', label: 'Đã giao' },
                    { id: 'cancelled', label: 'Đã hủy' }
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all gap-2"
                    >
                      {tab.label}
                      <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                        {getStatusCount(tab.id)}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="mt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-none bg-muted/30">
                        <TableHead className="py-5 pl-8 font-bold text-muted-foreground uppercase text-[11px] tracking-widest">Mã đơn hàng</TableHead>
                        <TableHead className="font-bold text-muted-foreground uppercase text-[11px] tracking-widest">Thông tin khách hàng</TableHead>
                        <TableHead className="font-bold text-muted-foreground uppercase text-[11px] tracking-widest text-center">Số lượng</TableHead>
                        <TableHead className="font-bold text-muted-foreground uppercase text-[11px] tracking-widest">Giá trị đơn</TableHead>
                        <TableHead className="font-bold text-muted-foreground uppercase text-[11px] tracking-widest text-center">Trạng thái</TableHead>
                        <TableHead className="font-bold text-muted-foreground uppercase text-[11px] tracking-widest">Thời gian</TableHead>
                        <TableHead className="pr-8 text-right"></TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      <AnimatePresence mode="popLayout">
                        {filterOrders().length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="h-96 text-center">
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center space-y-4"
                              >
                                <div className="p-6 rounded-full bg-muted">
                                  <ShoppingCart className="w-12 h-12 text-muted-foreground/50" />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-lg font-bold text-foreground">Trống trải quá...</p>
                                  <p className="text-sm text-muted-foreground">Không tìm thấy đơn hàng nào trong mục này.</p>
                                </div>
                              </motion.div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filterOrders().map((order, index) => (
                            <motion.tr
                              key={order.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.3, delay: index * 0.03 }}
                              className="group hover:bg-primary/5 transition-all border-b border-border/50"
                            >
                              <TableCell className="py-6 pl-8">
                                <span className="font-mono text-xs font-bold px-3 py-1.5 rounded-lg bg-muted text-foreground border border-border">
                                  #{order.code}
                                </span>
                              </TableCell>

                              <TableCell>
                                <div className="flex items-center gap-4">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-muted to-background flex items-center justify-center font-bold text-muted-foreground border border-border shadow-sm">
                                    {order.customer_name.charAt(0)}
                                  </div>
                                  <div className="space-y-0.5">
                                    <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                                      {order.customer_name}
                                    </div>
                                    <div className="flex items-center text-[11px] text-muted-foreground font-medium">
                                      <Phone className="w-3 h-3 mr-1" />
                                      {order.phone}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell className="text-center">
                                <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-muted text-[12px] font-bold text-foreground">
                                  {order.total_quantity} <span className="ml-1 font-medium text-muted-foreground italic text-[10px]">món</span>
                                </div>
                              </TableCell>

                              <TableCell>
                                <div className="text-[15px] font-black text-foreground">
                                  {order.seller_total.toLocaleString('vi-VN')}
                                  <span className="ml-0.5 text-[10px] font-bold text-primary uppercase">đ</span>
                                </div>
                              </TableCell>

                              <TableCell className="text-center">
                                <div className="flex justify-center">
                                  {getStatusBadge(order.status)}
                                </div>
                              </TableCell>

                              <TableCell>
                                <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
                                  <Calendar className="w-3.5 h-3.5 opacity-40" />
                                  {formatDate(order.created_at)}
                                </div>
                              </TableCell>

                              <TableCell className="pr-8 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedOrder(order)}
                                  className="h-10 w-10 p-0 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all shadow-none"
                                >
                                  <Eye className="w-5 h-5" />
                                </Button>
                              </TableCell>
                            </motion.tr>
                          ))
                        )}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>

                {/* Footer của bảng sử dụng bg-muted/20 và border-border */}
                <div className="p-6 border-t border-border bg-muted/20">
                  <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span>Hiển thị {filterOrders().length} đơn hàng gần nhất</span>
                    <div className="flex items-center gap-4">
                      <button className="hover:text-primary transition-colors cursor-not-allowed opacity-30">Trước</button>
                      <button className="hover:text-primary transition-colors">Tiếp theo</button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Order Detail Dialog */}
      <AnimatePresence>
        {selectedOrder && (
          <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader className="border-b pb-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <DialogTitle className="text-2xl font-bold">
                        Chi tiết đơn hàng
                      </DialogTitle>
                      <div className="flex items-center gap-3">
                        <div className="font-mono text-sm bg-muted px-3 py-1 rounded">
                          #{selectedOrder.code}
                        </div>
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {formatDate(selectedOrder.created_at)}
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6 pt-6">
                  {/* Customer & Shipping Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Thông tin khách hàng
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {selectedOrder.customer_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{selectedOrder.customer_name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {selectedOrder.phone}
                            </div>
                          </div>
                        </div>
                        {selectedOrder.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            <span>{selectedOrder.email}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Địa chỉ giao hàng
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">{selectedOrder.address}</p>
                        {selectedOrder.note && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Ghi chú:</p>
                            <p className="text-sm">{selectedOrder.note}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Payment & Shipping Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Thông tin thanh toán
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phương thức:</span>
                          <span className="font-medium">
                            {selectedOrder.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : selectedOrder.payment_method}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Trạng thái:</span>
                          <Badge variant={selectedOrder.payment_status === 'paid' ? 'default' : 'secondary'}>
                            {selectedOrder.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {selectedOrder.shipping_tracking_code && (
                      <Card className="border">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Truck className="w-4 h-4" />
                            Thông tin vận chuyển
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div>
                            <p className="text-muted-foreground text-sm mb-2">Mã vận đơn:</p>
                            <div className="font-mono text-sm bg-muted p-3 rounded-lg border">
                              {selectedOrder.shipping_tracking_code}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Order Items */}
                  <Card className="border">
                    <CardHeader className="border-b">
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Sản phẩm đã đặt ({selectedOrder.items.length} sản phẩm)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-0">
                        {selectedOrder.items.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex gap-4 p-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                          >
                            {item.product_image ? (
                              <div className="w-16 h-16 rounded-lg overflow-hidden border bg-muted">
                                <img
                                  src={item.product_image}
                                  alt={item.product_name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 rounded-lg border bg-muted flex items-center justify-center">
                                <Package className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground line-clamp-2 mb-2">
                                {item.product_name}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                {item.color && (
                                  <span className="flex items-center gap-1">
                                    <div
                                      className="w-3 h-3 rounded-full border border-border"
                                      style={{ backgroundColor: item.color }}
                                    />
                                    {item.color}
                                  </span>
                                )}
                                {item.size && (
                                  <span>Size: {item.size}</span>
                                )}
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="text-sm">
                                  <span className="text-muted-foreground">
                                    {item.price.toLocaleString('vi-VN')}đ × {item.quantity}
                                  </span>
                                </div>
                                <div className="font-semibold text-primary">
                                  {item.subtotal.toLocaleString('vi-VN')}đ
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Summary */}
                  <Card className="border">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tổng tiền hàng:</span>
                          <span className="font-medium">{selectedOrder.seller_total.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Phí vận chuyển:</span>
                          <span className="font-medium">{selectedOrder.shipping_fee.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="h-px bg-border" />
                        <div className="flex justify-between text-lg font-bold text-primary">
                          <span>Tổng cộng:</span>
                          <span>{(selectedOrder.seller_total + selectedOrder.shipping_fee).toLocaleString('vi-VN')}đ</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedOrder(null)}
                      className="gap-2"
                    >
                      Đóng
                    </Button>

                    {selectedOrder.status === "pending" && (
                      <Button
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 gap-2"
                        onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                        disabled={updating}
                      >
                        {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Xác nhận đơn hàng
                      </Button>
                    )}

                    {selectedOrder.status === "processing" && (
                      <Button
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 gap-2"
                        onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                        disabled={updating}
                      >
                        {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                        Đánh dấu đã gửi
                      </Button>
                    )}

                    {selectedOrder.status === "shipped" && (
                      <Button
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 gap-2"
                        onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                        disabled={updating}
                      >
                        {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                        Đã giao hàng
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}