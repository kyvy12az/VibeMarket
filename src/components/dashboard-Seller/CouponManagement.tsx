import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Ticket,
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  Percent,
  DollarSign,
  Calendar,
  Package,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Coupon {
  id: number;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_purchase: number | null;
  max_discount: number | null;
  start_date: string;
  end_date: string;
  usage_limit: number | null;
  used_count: number;
  product_id: number | null;
  product_name?: string;
  status: "active" | "inactive" | "expired";
  description: string | null;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
}

export function CouponManagement() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: "",
    min_purchase: "",
    max_discount: "",
    start_date: "",
    end_date: "",
    usage_limit: "",
    product_id: "",
    description: "",
  });

  useEffect(() => {
    fetchCoupons();
    fetchProducts();
  }, [user]);

  const fetchCoupons = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/vendor/coupons/get_coupons.php?vendor_id=${user.id}`
      );
      const data = await response.json();

      if (data.success) {
        setCoupons(data.coupons || []);
      } else {
        toast.error(data.message || "Không thể tải danh sách mã giảm giá");
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Lỗi khi tải danh sách mã giảm giá");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/vendor/get_products.php?vendor_id=${user.id}`
      );
      const data = await response.json();

      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddCoupon = async () => {
    if (!user?.id) return;

    if (!formData.code || !formData.discount_value) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/vendor/coupons/create_coupon.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vendor_id: user.id,
            ...formData,
            discount_value: parseFloat(formData.discount_value),
            min_purchase: formData.min_purchase ? parseFloat(formData.min_purchase) : null,
            max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
            usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
            product_id: formData.product_id ? parseInt(formData.product_id) : null,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Tạo mã giảm giá thành công!");
        setIsAddDialogOpen(false);
        resetForm();
        fetchCoupons();
      } else {
        toast.error(data.message || "Không thể tạo mã giảm giá");
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      toast.error("Lỗi khi tạo mã giảm giá");
    }
  };

  const handleUpdateCoupon = async () => {
    if (!selectedCoupon) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/vendor/coupons/update_coupon.php`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coupon_id: selectedCoupon.id,
            ...formData,
            discount_value: parseFloat(formData.discount_value),
            min_purchase: formData.min_purchase ? parseFloat(formData.min_purchase) : null,
            max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
            usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
            product_id: formData.product_id ? parseInt(formData.product_id) : null,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Cập nhật mã giảm giá thành công!");
        setIsEditDialogOpen(false);
        setSelectedCoupon(null);
        resetForm();
        fetchCoupons();
      } else {
        toast.error(data.message || "Không thể cập nhật mã giảm giá");
      }
    } catch (error) {
      console.error("Error updating coupon:", error);
      toast.error("Lỗi khi cập nhật mã giảm giá");
    }
  };

  const handleDeleteCoupon = async () => {
    if (!selectedCoupon) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/vendor/coupons/delete_coupon.php`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coupon_id: selectedCoupon.id,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Xóa mã giảm giá thành công!");
        setIsDeleteDialogOpen(false);
        setSelectedCoupon(null);
        fetchCoupons();
      } else {
        toast.error(data.message || "Không thể xóa mã giảm giá");
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Lỗi khi xóa mã giảm giá");
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discount_type: "percentage",
      discount_value: "",
      min_purchase: "",
      max_discount: "",
      start_date: "",
      end_date: "",
      usage_limit: "",
      product_id: "",
      description: "",
    });
  };

  const openEditDialog = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      min_purchase: coupon.min_purchase?.toString() || "",
      max_discount: coupon.max_discount?.toString() || "",
      start_date: coupon.start_date,
      end_date: coupon.end_date,
      usage_limit: coupon.usage_limit?.toString() || "",
      product_id: coupon.product_id?.toString() || "",
      description: coupon.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsDeleteDialogOpen(true);
  };

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Đang hoạt động", variant: "default" as const },
      inactive: { label: "Không hoạt động", variant: "secondary" as const },
      expired: { label: "Đã hết hạn", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discount_type === "percentage") {
      return `${coupon.discount_value}%`;
    }
    return `${coupon.discount_value.toLocaleString("vi-VN")}₫`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý mã giảm giá</h1>
          <p className="text-muted-foreground mt-1">
            Tạo và quản lý mã giảm giá cho sản phẩm của bạn
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Tạo mã giảm giá
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng mã giảm giá</CardTitle>
            <Ticket className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coupons.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
            <Ticket className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coupons.filter((c) => c.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã hết hạn</CardTitle>
            <Ticket className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coupons.filter((c) => c.status === "expired").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lượt sử dụng</CardTitle>
            <Ticket className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coupons.reduce((sum, c) => sum + c.used_count, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách mã giảm giá</CardTitle>
            <Button variant="outline" size="sm" onClick={fetchCoupons} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Làm mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm mã giảm giá..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-2">Đang tải...</p>
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Chưa có mã giảm giá nào</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã giảm giá</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Giá trị</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Lượt dùng</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {filteredCoupons.map((coupon) => (
                      <motion.tr
                        key={coupon.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="group"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-primary" />
                            <span className="font-mono font-semibold">{coupon.code}</span>
                          </div>
                          {coupon.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {coupon.description}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          {coupon.discount_type === "percentage" ? (
                            <Badge variant="outline" className="gap-1">
                              <Percent className="w-3 h-3" />
                              Phần trăm
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1">
                              <DollarSign className="w-3 h-3" />
                              Cố định
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatDiscount(coupon)}
                          {coupon.max_discount && coupon.discount_type === "percentage" && (
                            <p className="text-xs text-muted-foreground">
                              Tối đa: {coupon.max_discount.toLocaleString("vi-VN")}₫
                            </p>
                          )}
                          {coupon.min_purchase && (
                            <p className="text-xs text-muted-foreground">
                              Đơn tối thiểu: {coupon.min_purchase.toLocaleString("vi-VN")}₫
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          {coupon.product_name ? (
                            <Badge variant="secondary" className="gap-1">
                              <Package className="w-3 h-3" />
                              {coupon.product_name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">Tất cả</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span>{new Date(coupon.start_date).toLocaleDateString("vi-VN")}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(coupon.end_date).toLocaleDateString("vi-VN")}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {coupon.used_count} / {coupon.usage_limit || "∞"}
                        </TableCell>
                        <TableCell>{getStatusBadge(coupon.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(coupon)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteDialog(coupon)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Coupon Dialog */}
      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            setSelectedCoupon(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditDialogOpen ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá mới"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="code">
                Mã giảm giá <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                placeholder="VD: SUMMER2024"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="discount_type">Loại giảm giá</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value: "percentage" | "fixed") =>
                    setFormData({ ...formData, discount_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                    <SelectItem value="fixed">Cố định (₫)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="discount_value">
                  Giá trị giảm <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="discount_value"
                  type="number"
                  placeholder={formData.discount_type === "percentage" ? "VD: 20" : "VD: 50000"}
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="min_purchase">Giá trị đơn hàng tối thiểu (₫)</Label>
                <Input
                  id="min_purchase"
                  type="number"
                  placeholder="VD: 100000"
                  value={formData.min_purchase}
                  onChange={(e) => setFormData({ ...formData, min_purchase: e.target.value })}
                />
              </div>

              {formData.discount_type === "percentage" && (
                <div className="grid gap-2">
                  <Label htmlFor="max_discount">Giảm tối đa (₫)</Label>
                  <Input
                    id="max_discount"
                    type="number"
                    placeholder="VD: 100000"
                    value={formData.max_discount}
                    onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date">Ngày bắt đầu</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="end_date">Ngày kết thúc</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="usage_limit">Giới hạn số lần sử dụng</Label>
              <Input
                id="usage_limit"
                type="number"
                placeholder="Để trống = không giới hạn"
                value={formData.usage_limit}
                onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="product_id">Áp dụng cho sản phẩm (tùy chọn)</Label>
              <Select
                value={formData.product_id || "all"}
                onValueChange={(value) => setFormData({ ...formData, product_id: value === "all" ? "" : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả sản phẩm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả sản phẩm</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Mô tả về mã giảm giá..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
                setSelectedCoupon(null);
                resetForm();
              }}
            >
              Hủy
            </Button>
            <Button onClick={isEditDialogOpen ? handleUpdateCoupon : handleAddCoupon}>
              {isEditDialogOpen ? "Cập nhật" : "Tạo mã"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa mã giảm giá "{selectedCoupon?.code}"? Hành động này không
              thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedCoupon(null)}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCoupon} className="bg-destructive">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
