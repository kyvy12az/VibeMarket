import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { Eye, Search, Package, MapPin, Clock, ShoppingCart, Loader2 } from "lucide-react";
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
  pending: { label: "Chờ xử lý", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
  processing: { label: "Đang xử lý", variant: "default" as const, color: "bg-blue-100 text-blue-800" },
  shipped: { label: "Đã gửi", variant: "default" as const, color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Đã giao", variant: "default" as const, color: "bg-green-100 text-green-800" },
  cancelled: { label: "Đã hủy", variant: "destructive" as const, color: "bg-red-100 text-red-800" }
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

  const filterOrders = () => {
    if (!searchTerm) return orders;

    return orders.filter(order =>
      order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.color}>
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Đang tải dữ liệu...</p>
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
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-400 text-white shadow-md">
            <ShoppingCart className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-400 bg-clip-text text-transparent tracking-tight">
              Quản lý đơn hàng
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Theo dõi và xử lý các đơn hàng nhanh chóng, hiệu quả
            </p>
          </div>
        </div>

        <div className="mt-4 h-[2px] w-full bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-400 rounded-full opacity-60"></div>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <CardTitle className="text-xl font-semibold">Danh sách đơn hàng</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã ĐH hoặc tên KH..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-primary"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">Tất cả ({orders.length})</TabsTrigger>
              <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
              <TabsTrigger value="processing">Đang xử lý</TabsTrigger>
              <TabsTrigger value="shipped">Đã gửi</TabsTrigger>
              <TabsTrigger value="delivered">Đã giao</TabsTrigger>
              <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn hàng</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Số lượng SP</TableHead>
                      <TableHead>Tổng tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày đặt</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterOrders().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Không có đơn hàng nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      filterOrders().map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.code}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customer_name}</div>
                              <div className="text-sm text-muted-foreground">{order.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>{order.total_quantity} sản phẩm</TableCell>
                          <TableCell className="font-semibold text-primary">
                            {order.seller_total.toLocaleString('vi-VN')}đ
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(order.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng #{selectedOrder?.code}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                {getStatusBadge(selectedOrder.status)}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {formatDate(selectedOrder.created_at)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Thông tin khách hàng</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Tên:</span> {selectedOrder.customer_name}</p>
                      {selectedOrder.email && (
                        <p><span className="text-muted-foreground">Email:</span> {selectedOrder.email}</p>
                      )}
                      <p><span className="text-muted-foreground">SĐT:</span> {selectedOrder.phone}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Địa chỉ giao hàng
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedOrder.address}</p>
                  </div>

                  {selectedOrder.note && (
                    <div>
                      <h3 className="font-semibold mb-2">Ghi chú</h3>
                      <p className="text-sm text-muted-foreground">{selectedOrder.note}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Thanh toán</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-muted-foreground">Phương thức:</span>{" "}
                        {selectedOrder.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : selectedOrder.payment_method}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Trạng thái:</span>{" "}
                        <Badge variant={selectedOrder.payment_status === 'paid' ? 'default' : 'secondary'}>
                          {selectedOrder.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </Badge>
                      </p>
                    </div>
                  </div>

                  {selectedOrder.shipping_tracking_code && (
                    <div>
                      <h3 className="font-semibold mb-2">Mã vận đơn</h3>
                      <p className="text-sm font-mono bg-muted p-2 rounded">
                        {selectedOrder.shipping_tracking_code}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Sản phẩm đã đặt
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                      {item.product_image && (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.product_name}</p>
                        <div className="text-sm text-muted-foreground mt-1">
                          {item.color && <span className="mr-3">Màu: {item.color}</span>}
                          {item.size && <span>Size: {item.size}</span>}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm">
                            {item.price.toLocaleString('vi-VN')}đ x {item.quantity}
                          </span>
                          <span className="font-semibold text-primary">
                            {item.subtotal.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tổng tiền hàng:</span>
                    <span>{selectedOrder.seller_total.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phí vận chuyển:</span>
                    <span>{selectedOrder.shipping_fee.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-primary pt-2 border-t">
                    <span>Tổng cộng:</span>
                    <span>{(selectedOrder.seller_total + selectedOrder.shipping_fee).toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                  Đóng
                </Button>
                {selectedOrder.status === "pending" && (
                  <Button
                    className="bg-gradient-primary"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                    disabled={updating}
                  >
                    {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Xác nhận đơn hàng
                  </Button>
                )}
                {selectedOrder.status === "processing" && (
                  <Button
                    className="bg-gradient-primary"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                    disabled={updating}
                  >
                    {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Đánh dấu đã gửi
                  </Button>
                )}
                {selectedOrder.status === "shipped" && (
                  <Button
                    className="bg-gradient-primary"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                    disabled={updating}
                  >
                    {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Đã giao hàng
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
