import { useState } from "react";
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
import { Eye, Search, Package, MapPin, Clock, ShoppingCart } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  product: string;
  quantity: number;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  address: string;
  paymentMethod: string;
}

const mockOrders: Order[] = [
  {
    id: "DH001234",
    customer: "Nguyễn Thị Lan",
    email: "lan.nguyen@email.com",
    phone: "0912345678",
    product: "Kem dưỡng da Olay Regenerist",
    quantity: 2,
    amount: 598000,
    status: "processing",
    date: "2024-01-25 14:30",
    address: "123 Nguyễn Huệ, Q.1, TP.HCM",
    paymentMethod: "COD"
  },
  {
    id: "DH001235",
    customer: "Trần Văn Nam",
    email: "nam.tran@email.com",
    phone: "0987654321",
    product: "Son môi MAC Ruby Woo",
    quantity: 1,
    amount: 450000,
    status: "shipped",
    date: "2024-01-24 10:15",
    address: "456 Lê Lợi, Q.3, TP.HCM",
    paymentMethod: "Chuyển khoản"
  },
  {
    id: "DH001236",
    customer: "Lê Thị Mai",
    email: "mai.le@email.com",
    phone: "0901234567",
    product: "Nước hoa Chanel No.5",
    quantity: 1,
    amount: 1200000,
    status: "delivered",
    date: "2024-01-23 16:45",
    address: "789 Trần Hưng Đạo, Q.5, TP.HCM",
    paymentMethod: "Thẻ tín dụng"
  },
  {
    id: "DH001237",
    customer: "Phạm Văn Hùng",
    email: "hung.pham@email.com",
    phone: "0923456789",
    product: "Serum Vitamin C",
    quantity: 3,
    amount: 897000,
    status: "pending",
    date: "2024-01-25 09:20",
    address: "321 Hai Bà Trưng, Q.1, TP.HCM",
    paymentMethod: "COD"
  },
  {
    id: "DH001238",
    customer: "Võ Thị Hoa",
    email: "hoa.vo@email.com",
    phone: "0934567890",
    product: "Mặt nạ SK-II",
    quantity: 1,
    amount: 850000,
    status: "cancelled",
    date: "2024-01-22 11:30",
    address: "654 Nguyễn Trãi, Q.5, TP.HCM",
    paymentMethod: "COD"
  }
];

const statusConfig = {
  pending: { label: "Chờ xử lý", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
  processing: { label: "Đang xử lý", variant: "default" as const, color: "bg-blue-100 text-blue-800" },
  shipped: { label: "Đã gửi", variant: "default" as const, color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Đã giao", variant: "default" as const, color: "bg-green-100 text-green-800" },
  cancelled: { label: "Đã hủy", variant: "destructive" as const, color: "bg-red-100 text-red-800" }
};

export function OrdersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const filterOrders = (status?: string) => {
    let filtered = mockOrders;

    if (status && status !== "all") {
      filtered = filtered.filter(order => order.status === status);
    }

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-6"
      >
        <div className="flex items-center gap-3">
          {/* Icon gradient nổi bật */}
          <div className="p-3 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-400 text-white shadow-md">
            <ShoppingCart className="w-6 h-6" />
          </div>

          <div>
            {/* Tiêu đề gradient */}
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-400 bg-clip-text text-transparent tracking-tight">
              Quản lý đơn hàng
            </h1>

            {/* Mô tả tinh tế */}
            <p className="text-sm text-muted-foreground mt-1">
              Theo dõi và xử lý các đơn hàng nhanh chóng, hiệu quả
            </p>
          </div>
        </div>

        {/* Divider gradient nhẹ */}
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
              <TabsTrigger value="all">Tất cả ({mockOrders.length})</TabsTrigger>
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
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>Số lượng</TableHead>
                      <TableHead>Tổng tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày đặt</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterOrders(activeTab).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="max-w-xs truncate">{order.product}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{order.amount.toLocaleString('vi-VN')}đ</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                {getStatusBadge(selectedOrder.status)}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {selectedOrder.date}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Thông tin khách hàng</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Tên:</span> {selectedOrder.customer}</p>
                      <p><span className="text-muted-foreground">Email:</span> {selectedOrder.email}</p>
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
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Thông tin sản phẩm
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">{selectedOrder.product}</p>
                      <p><span className="text-muted-foreground">Số lượng:</span> {selectedOrder.quantity}</p>
                      <p><span className="text-muted-foreground">Đơn giá:</span> {(selectedOrder.amount / selectedOrder.quantity).toLocaleString('vi-VN')}đ</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Thanh toán</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Phương thức:</span> {selectedOrder.paymentMethod}</p>
                      <p className="text-lg font-bold text-primary">
                        Tổng: {selectedOrder.amount.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                  Đóng
                </Button>
                {selectedOrder.status === "pending" && (
                  <Button className="bg-gradient-primary">
                    Xác nhận đơn hàng
                  </Button>
                )}
                {selectedOrder.status === "processing" && (
                  <Button className="bg-gradient-primary">
                    Đánh dấu đã gửi
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
