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
  Star
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
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-8">
          <div className="flex items-start gap-6">
            <motion.div
              className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-xl"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ShoppingCart className="w-8 h-8 text-white" />
            </motion.div>

            <div className="space-y-2">
              <div>
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  Quản lý đơn hàng
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-muted-foreground">Cập nhật real-time</p>
                </div>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl">
                🚀 Theo dõi và xử lý các đơn hàng nhanh chóng, hiệu quả với hệ thống quản lý thông minh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={refreshData}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Lọc nâng cao
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          {
            label: "Tổng đơn hàng",
            value: stats.total,
            icon: ShoppingCart,
            color: "from-blue-500 to-cyan-500",
            change: "+12.5%"
          },
          {
            label: "Chờ xử lý",
            value: stats.pending,
            icon: Clock,
            color: "from-yellow-500 to-orange-500",
            change: "+5"
          },
          {
            label: "Đang xử lý",
            value: stats.processing,
            icon: Package,
            color: "from-purple-500 to-pink-500",
            change: "+8"
          },
          {
            label: "Đã giao",
            value: stats.delivered,
            icon: CheckCircle,
            color: "from-green-500 to-emerald-500",
            change: "+15%"
          },
          {
            label: "Doanh thu",
            value: `${(stats.revenue / 1_000_000).toFixed(1)}M`,
            icon: TrendingUp,
            color: "from-emerald-500 to-teal-500",
            change: "+20.8%"
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <Card className="border shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-sm`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.change}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border shadow-sm">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Danh sách đơn hàng</CardTitle>
                  <p className="text-sm text-muted-foreground">Quản lý tất cả đơn hàng của cửa hàng</p>
                </div>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-border focus:border-primary"
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="px-6 pt-4">
                <TabsList className="grid w-full grid-cols-6 bg-muted/50">
                  <TabsTrigger value="all" className="gap-2">
                    Tất cả 
                    <Badge variant="secondary" className="text-xs">
                      {getStatusCount('all')}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="gap-2">
                    Chờ xử lý
                    <Badge variant="secondary" className="text-xs">
                      {getStatusCount('pending')}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="processing" className="gap-2">
                    Đang xử lý
                    <Badge variant="secondary" className="text-xs">
                      {getStatusCount('processing')}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="shipped" className="gap-2">
                    Đã gửi
                    <Badge variant="secondary" className="text-xs">
                      {getStatusCount('shipped')}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="delivered" className="gap-2">
                    Đã giao
                    <Badge variant="secondary" className="text-xs">
                      {getStatusCount('delivered')}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="cancelled" className="gap-2">
                    Đã hủy
                    <Badge variant="secondary" className="text-xs">
                      {getStatusCount('cancelled')}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="mt-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/20">
                        <TableHead className="font-semibold">Mã đơn hàng</TableHead>
                        <TableHead className="font-semibold">Khách hàng</TableHead>
                        <TableHead className="font-semibold">Sản phẩm</TableHead>
                        <TableHead className="font-semibold">Tổng tiền</TableHead>
                        <TableHead className="font-semibold">Trạng thái</TableHead>
                        <TableHead className="font-semibold">Ngày đặt</TableHead>
                        <TableHead className="font-semibold text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {filterOrders().length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-12">
                              <div className="space-y-3">
                                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                                  <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">Chưa có đơn hàng nào</p>
                                  <p className="text-sm text-muted-foreground">
                                    Các đơn hàng sẽ hiển thị ở đây khi khách hàng đặt mua
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filterOrders().map((order, index) => (
                            <motion.tr
                              key={order.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ delay: index * 0.05 }}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              <TableCell className="font-medium">
                                <div className="font-mono text-sm bg-muted px-2 py-1 rounded inline-block">
                                  {order.code}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-medium text-foreground">{order.customer_name}</div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="w-3 h-3" />
                                    {order.phone}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Package className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">{order.total_quantity}</span>
                                  <span className="text-muted-foreground text-sm">sản phẩm</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-bold text-primary">
                                  {order.seller_total.toLocaleString('vi-VN')}đ
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(order.status)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(order.created_at)}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedOrder(order)}
                                  className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                  Chi tiết
                                </Button>
                              </TableCell>
                            </motion.tr>
                          ))
                        )}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
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