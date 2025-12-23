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
  Download,
  ChevronRight,
  ArrowUpRight,
  BarChart3,
  Clock,
  Activity,
  MoreHorizontal,
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
      <div className="relative mb-10">
        {/* Phần trang trí nền mờ (Optional - tạo chiều sâu) */}
        <div className="absolute -left-4 -top-4 w-24 h-24 bg-indigo-500/5 blur-3xl rounded-full" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div className="space-y-3">
            {/* Breadcrumb nhỏ tinh tế */}
            <nav className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              <span>Marketing</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-indigo-600">Mã giảm giá</span>
            </nav>

            <div className="flex items-center gap-4">
              {/* Icon đại diện với Glassmorphism */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                <Ticket className="h-6 w-6 text-indigo-600" />
              </div>

              <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 italic">
                  <span className="text-blue-300">Quản lý </span>
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent italic font-black">Ưu đãi</span>
                </h1>
                <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                  Thiết lập và tối ưu hóa các chương trình khuyến mãi của bạn
                </p>
              </div>
            </div>
          </div>

          {/* Khu vực nút bấm Action */}
          <div className="flex items-center gap-3">
            {/* Nút phụ - Xuất file */}
            <Button
              variant="outline"
              className="hidden sm:flex border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-2xl px-5 h-12 transition-all active:scale-95"
            >
              <Download className="w-4 h-4 mr-2" />
              Xuất báo cáo
            </Button>

            {/* Nút chính - Tạo mã mới */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)] rounded-2xl px-7 h-12 gap-2 transition-all duration-300 group"
              >
                <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform duration-300">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="font-bold tracking-wide text-sm uppercase">Tạo mã giảm giá</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Tổng mã giảm giá",
            value: coupons.length,
            icon: Ticket,
            // Light: indigo-600, Dark: indigo-400
            color: "text-indigo-600 dark:text-indigo-400",
            // Light: indigo-50, Dark: indigo-500/10 (trong suốt hơn)
            bg: "bg-indigo-50 dark:bg-indigo-500/10",
            trend: "+12% tháng này",
            borderColor: "group-hover:border-indigo-500/50 dark:group-hover:border-indigo-400/50"
          },
          {
            label: "Đang hoạt động",
            value: coupons.filter((c) => c.status === "active").length,
            icon: Activity,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
            trend: "Đang chạy",
            borderColor: "group-hover:border-emerald-500/50 dark:group-hover:border-emerald-400/50"
          },
          {
            label: "Đã hết hạn",
            value: coupons.filter((c) => c.status === "expired").length,
            icon: Clock,
            color: "text-rose-600 dark:text-rose-400",
            bg: "bg-rose-50 dark:bg-rose-500/10",
            trend: "-2 mã hôm nay",
            borderColor: "group-hover:border-rose-500/50 dark:group-hover:border-rose-400/50"
          },
          {
            label: "Lượt sử dụng",
            value: coupons.reduce((sum, c) => sum + c.used_count, 0),
            icon: BarChart3,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-500/10",
            trend: "Tổng tích lũy",
            borderColor: "group-hover:border-amber-500/50 dark:group-hover:border-amber-400/50"
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`relative overflow-hidden bg-background border-slate-200/60 shadow-sm transition-all duration-300 ${stat.borderColor} group`}>
              {/* Trang trí nhẹ ở góc card */}
              <div className={`absolute -right-2 -top-2 w-16 h-16 rounded-full ${stat.bg} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />

              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {stat.label}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-3xl font-black tracking-tight text-foreground">
                        {stat.value.toLocaleString()}
                      </h2>
                    </div>
                  </div>

                  {/* Icon Container */}
                  <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} shadow-inner transition-transform group-hover:scale-110 duration-300`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Dòng trạng thái nhỏ phía dưới (tăng vẻ chuyên nghiệp) */}
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${stat.bg} ${stat.color}`}>
                    {stat.trend}
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-slate-300" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filter */}
      <Card className="bg-background border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-none rounded-[2rem] overflow-hidden">
        <CardHeader className="border-b border-slate-100/50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/20 p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                Danh sách mã giảm giá
                <Badge variant="secondary" className="rounded-lg font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-none">
                  {filteredCoupons.length} Mã
                </Badge>
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-1 font-medium">
                Quản lý và theo dõi hiệu suất các chương trình ưu đãi
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <Input
                  placeholder="Tìm kiếm mã hoặc mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 w-full md:w-[300px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 h-11 transition-all"
                />
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={fetchCoupons}
                className="rounded-xl h-11 w-11 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 transition-all active:scale-90"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-500' : 'text-slate-500'}`} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0"> {/* P-0 để bảng tràn viền đẹp hơn */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <Ticket className="w-5 h-5 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Đang đồng bộ dữ liệu...</p>
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-slate-50/30 dark:bg-transparent">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-6 ring-8 ring-slate-50 dark:ring-slate-900/50">
                <Ticket className="w-10 h-10 text-slate-300 dark:text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Không tìm thấy mã nào</h3>
              <p className="text-slate-500 mt-2 max-w-[250px] text-center text-sm font-medium">
                Thử thay đổi từ khóa tìm kiếm hoặc tạo mã giảm giá mới.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                  <TableRow className="border-b border-slate-100 dark:border-slate-800 hover:bg-transparent">
                    <TableHead className="py-5 pl-8 font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-[0.1em]">Mã ưu đãi</TableHead>
                    <TableHead className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-[0.1em]">Loại & Giá trị</TableHead>
                    <TableHead className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-[0.1em]">Sản phẩm áp dụng</TableHead>
                    <TableHead className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-[0.1em]">Hiệu lực</TableHead>
                    <TableHead className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-[0.1em]">Sử dụng</TableHead>
                    <TableHead className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-[0.1em]">Trạng thái</TableHead>
                    <TableHead className="text-right pr-8 font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-[0.1em]">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {filteredCoupons.map((coupon, idx) => (
                      <motion.tr
                        key={coupon.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/80 dark:hover:bg-indigo-500/5 transition-colors"
                      >
                        <TableCell className="py-5 pl-8">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 font-mono font-black text-sm shadow-sm">
                              %
                            </div>
                            <div>
                              <span className="font-mono font-black text-slate-900 dark:text-slate-100 text-base tracking-wider uppercase group-hover:text-indigo-600 transition-colors">
                                {coupon.code}
                              </span>
                              <p className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
                                {coupon.description || "Không có mô tả"}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 font-black text-slate-900 dark:text-slate-100">
                              {coupon.discount_type === "percentage" ? (
                                <Percent className="w-3.5 h-3.5 text-indigo-500" />
                              ) : (
                                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                              )}
                              {formatDiscount(coupon)}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              {coupon.min_purchase > 0 ? `Đơn từ ${coupon.min_purchase.toLocaleString()}₫` : "Mọi đơn hàng"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          {coupon.product_name ? (
                            <div className="flex items-center gap-2 max-w-[180px]">
                              <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                                <Package className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                              </div>
                              <span className="text-sm font-bold text-slate-600 dark:text-slate-300 truncate">
                                {coupon.product_name}
                              </span>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-[10px] font-black uppercase border-slate-200 dark:border-slate-800 text-slate-400">
                              Tất cả SP
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                              <Calendar className="w-3 h-3 text-indigo-500" />
                              {new Date(coupon.start_date).toLocaleDateString("vi-VN")}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                              <div className="w-3 h-[1px] bg-slate-300 dark:bg-slate-700" />
                              {new Date(coupon.end_date).toLocaleDateString("vi-VN")}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col gap-1.5 w-24">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                              <span className="text-indigo-600 dark:text-indigo-400">{coupon.used_count} dùng</span>
                              <span className="text-slate-400">{coupon.usage_limit || "∞"}</span>
                            </div>
                            {/* Thanh progress nhỏ xịn xò */}
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${coupon.usage_limit ? (coupon.used_count / coupon.usage_limit) * 100 : 100}%` }}
                                className={`h-full rounded-full ${coupon.status === 'expired' ? 'bg-slate-300' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`}
                              />
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          {/* Render Status Badge tinh tế hơn */}
                          <div className="flex items-center">
                            {getStatusBadge(coupon.status)}
                          </div>
                        </TableCell>

                        <TableCell className="text-right pr-8">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(coupon)}
                              className="h-9 w-9 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 transition-all shadow-none hover:shadow-md border-none"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(coupon)}
                              className="h-9 w-9 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 transition-all shadow-none border-none"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border-none">
                              <MoreHorizontal className="w-4 h-4 text-slate-400" />
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
