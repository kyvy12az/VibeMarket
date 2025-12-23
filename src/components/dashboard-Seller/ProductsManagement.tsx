import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Eye,
  Edit,
  Trash2,
  Search,
  Package,
  Star,
  Plus,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Loader2,
  Filter,
  Download,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Calendar,
  Archive,
  AlertTriangle,
  Image as ImageIcon,
  Tag,
  Activity,
  ChevronRight,
  X,
  Share2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  initial_stock?: number; // Tồn kho ban đầu
  stock: number; // Tồn kho hiện tại
  sales: number; // Đã bán
  rating: number;
  image: string | null;
  status: "active" | "inactive" | "out_of_stock";
  created_at?: string;
}

const statusConfig = {
  active: {
    label: "Đang bán",
    variant: "default" as const,
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle2,
    gradient: "from-green-400 to-emerald-500"
  },
  inactive: {
    label: "Ngừng bán",
    variant: "secondary" as const,
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: Archive,
    gradient: "from-gray-400 to-slate-500"
  },
  out_of_stock: {
    label: "Hết hàng",
    variant: "destructive" as const,
    color: "bg-red-100 text-red-800 border-red-200",
    icon: AlertTriangle,
    gradient: "from-red-400 to-rose-500"
  }
};

export function ProductsManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/vendor/products_list.php?user_id=${user.id}`
      );
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      } else {
        toast({
          title: "Lỗi",
          description: data.error || "Không thể tải danh sách sản phẩm",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Lỗi",
        description: "Không thể kết nối đến server",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const refreshData = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className={`${config.color} border font-medium gap-1.5 px-3 py-1.5`}>
        <IconComponent className="w-3.5 h-3.5" />
        {config.label}
      </Badge>
    );
  };

  const getImageUrl = (image: string | null) => {
    if (!image) return null;

    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }

    const backend_url = import.meta.env.VITE_BACKEND_URL;
    if (image.startsWith('uploads/')) {
      return `${backend_url}/${image}`;
    }

    return `${backend_url}/uploads/products/${image}`;
  };

  const handleUpdateStatus = async (product: Product, newStatus: 'active' | 'inactive') => {
    if (!user?.id || product.stock === 0) return;

    setUpdatingStatus(product.id);
    try {
      const numericId = parseInt(product.id.replace('SP', ''));

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/vendor/update_product_status.php`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: numericId,
            user_id: user.id,
            status: newStatus
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Thành công",
          description: data.message,
        });

        // Cập nhật local state
        setProducts(prev => prev.map(p =>
          p.id === product.id ? { ...p, status: newStatus } : p
        ));
      } else {
        toast({
          title: "Lỗi",
          description: data.error || "Không thể cập nhật trạng thái",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Lỗi",
        description: "Không thể kết nối đến server",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete || !user?.id) return;

    setIsDeleting(true);
    try {
      const numericId = parseInt(productToDelete.id.replace('SP', ''));

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/vendor/delete_product.php`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: numericId,
            user_id: user.id
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Thành công",
          description: `Đã xóa sản phẩm ${productToDelete.name}`,
        });

        await fetchProducts();
        setProductToDelete(null);
      } else {
        toast({
          title: "Lỗi",
          description: data.message || "Không thể xóa sản phẩm",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Lỗi",
        description: "Không thể kết nối đến server",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate stats
  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    outOfStock: products.filter(p => p.stock === 0 || p.status === 'out_of_stock').length,
    totalSales: products.reduce((sum, p) => sum + p.sales, 0),
    totalRevenue: products.reduce((sum, p) => sum + (p.price * p.sales), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 mx-auto w-20 h-20 flex items-center justify-center shadow-xl">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Đang tải sản phẩm</h3>
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
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-rose-500/5 rounded-3xl -z-10" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-background/50 backdrop-blur-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          {/* Background Decor (Glow Effects) */}
          <div className="absolute top-0 left-0 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* Left Side: Brand & Title */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

              {/* Animated Icon Container */}
              <motion.div
                className="relative"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 blur-xl opacity-40" />
                <div className="relative p-5 rounded-[2rem] bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 shadow-2xl border border-white/20">
                  <Package className="w-9 h-9 text-white" />
                </div>
              </motion.div>

              <div className="space-y-3 text-center md:text-left">
                {/* Meta Tags / Breadcrumbs */}
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold uppercase tracking-widest border border-purple-500/20">
                    Catalog
                  </span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Inventory
                  </span>
                </div>

                <div className="space-y-1">
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                    Quản lý <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent">Sản phẩm</span>
                  </h1>
                  <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground italic">
                      Hệ thống kho đang đồng bộ trực tuyến
                    </p>
                  </div>
                </div>

                <p className="hidden md:block text-muted-foreground max-w-xl text-base leading-relaxed">
                  Tối ưu hóa doanh thu bằng cách quản lý danh mục sản phẩm, theo dõi tồn kho và phân tích xu hướng thị trường.
                </p>
              </div>
            </div>

            {/* Right Side: Action Group */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3">

              {/* Refresh Button */}
              <Button
                variant="ghost"
                className="h-12 px-5 rounded-2xl bg-muted/50 hover:bg-muted border border-border/50 transition-all active:scale-95 group"
                onClick={refreshData}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 transition-transform duration-500 group-hover:rotate-180 ${refreshing ? 'animate-spin text-purple-500' : ''}`} />
                <span className="font-bold">Làm mới</span>
              </Button>

              {/* Export Button */}
              <Button
                variant="ghost"
                className="h-12 px-5 rounded-2xl bg-muted/50 hover:bg-muted border border-border/50 transition-all active:scale-95"
              >
                <Download className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="font-bold">Xuất báo cáo</span>
              </Button>

              {/* Main Add Product Button (Premium Style) */}
              <Button
                onClick={() => navigate("/vendor-management/add-product")}
                className="h-12 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-white hover:opacity-90 shadow-[0_10px_20px_rgba(236,72,153,0.3)] transition-all active:scale-95 group"
              >
                <div className="mr-2 p-1 rounded-lg bg-white/20 group-hover:rotate-90 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="font-bold tracking-tight">Thêm sản phẩm</span>
              </Button>
            </div>

          </div>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          {
            label: "Tổng sản phẩm",
            value: stats.total,
            icon: Package,
            color: "from-blue-600 to-cyan-500",
            glow: "bg-blue-500/10",
            change: "+12",
            isPositive: true
          },
          {
            label: "Đang bán",
            value: stats.active,
            icon: CheckCircle2,
            color: "from-emerald-600 to-teal-500",
            glow: "bg-emerald-500/10",
            change: `${Math.round((stats.active / stats.total) * 100)}%`,
            isPositive: true
          },
          {
            label: "Hết hàng",
            value: stats.outOfStock,
            icon: AlertTriangle,
            color: "from-rose-600 to-red-500",
            glow: "bg-rose-500/10",
            change: stats.outOfStock > 0 ? "Cần nhập" : "An toàn",
            isPositive: stats.outOfStock === 0
          },
          {
            label: "Đã bán",
            value: stats.totalSales,
            icon: TrendingUp,
            color: "from-violet-600 to-purple-500",
            glow: "bg-violet-500/10",
            change: "+25.8%",
            isPositive: true
          },
          {
            label: "Doanh thu",
            value: `${(stats.totalRevenue / 1_000_000).toFixed(1)}M`,
            icon: DollarSign,
            color: "from-amber-600 to-orange-500",
            glow: "bg-amber-500/10",
            change: "+18.2%",
            isPositive: true
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            whileHover={{ y: -5 }}
          >
            <Card className="relative overflow-hidden border-border/50 bg-background/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] group hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500">

              {/* Glow Effect Background */}
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${stat.glow}`} />

              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  {/* Icon Container với hiệu ứng đổ bóng màu */}
                  <div className={`relative p-3 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg shadow-inherit/20 group-hover:scale-110 transition-transform duration-500`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Change Badge kiểu Capsule */}
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${stat.isPositive
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                    }`}>
                    {stat.isPositive ? <TrendingUp className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {stat.change}
                  </div>
                </div>

                <div className="mt-6 space-y-1.5">
                  <h3 className="text-3xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">
                    {stat.value}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                    {stat.label}
                  </p>
                </div>

                {/* Thanh trang trí nhỏ phía dưới */}
                <div className="mt-4 w-full h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className={`h-full bg-gradient-to-r opacity-30 ${stat.color}`}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="overflow-hidden border-border/50 bg-background/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] ring-1 ring-border/50">
          {/* Header Bảng - Thiết kế tinh giản & Cao cấp */}
          <CardHeader className="p-8 border-b border-border/50">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary blur-lg opacity-20" />
                  <div className="relative p-3 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-lg shadow-indigo-500/20">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-xl font-black tracking-tight text-foreground">
                    Danh mục Kho hàng
                  </CardTitle>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                    {filteredProducts.length} Sản phẩm đang hiển thị
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-3">
                {/* Search Bar - Đồng bộ thiết kế với Order Center */}
                <div className="relative w-full sm:w-80 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Tìm tên hoặc mã sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-11 pl-11 pr-4 bg-muted/50 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium text-sm"
                  />
                </div>

                <Button variant="outline" className="h-11 px-5 rounded-xl border-border bg-background/50 hover:bg-muted gap-2 font-bold transition-all active:scale-95">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  Lọc nâng cao
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-none bg-muted/30 hover:bg-muted/30">
                    <TableHead className="py-5 pl-8 font-bold text-muted-foreground uppercase text-[11px] tracking-widest">Sản phẩm</TableHead>
                    <TableHead className="font-bold text-muted-foreground uppercase text-[11px] tracking-widest">Mã định danh</TableHead>
                    <TableHead className="font-bold text-muted-foreground uppercase text-[11px] tracking-widest text-center">Tồn kho</TableHead>
                    <TableHead className="font-bold text-muted-foreground uppercase text-[11px] tracking-widest">Giá niêm yết</TableHead>
                    <TableHead className="font-bold text-muted-foreground uppercase text-[11px] tracking-widest text-center">Đã bán</TableHead>
                    <TableHead className="font-bold text-muted-foreground uppercase text-[11px] tracking-widest">Đánh giá</TableHead>
                    <TableHead className="font-bold text-muted-foreground uppercase text-[11px] tracking-widest text-center">Trạng thái</TableHead>
                    <TableHead className="pr-8 text-right"></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-80 text-center">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center space-y-4"
                          >
                            <div className="p-6 rounded-full bg-muted">
                              <Package className="w-12 h-12 text-muted-foreground/40" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-lg font-black text-foreground">Không có dữ liệu</p>
                              <p className="text-sm text-muted-foreground">Thử thay đổi bộ lọc hoặc thêm sản phẩm mới</p>
                            </div>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product, index) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.03 }}
                          className="group hover:bg-primary/5 transition-all border-b border-border/40"
                        >
                          {/* Thông tin sản phẩm & Hình ảnh */}
                          <TableCell className="py-5 pl-8">
                            <div className="flex items-center gap-4">
                              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border shadow-sm group-hover:scale-105 transition-transform duration-300">
                                {product.image ? (
                                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-muted">
                                    <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                  {product.name}
                                </span>
                                <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <Tag className="w-3 h-3" />
                                  {product.category}
                                </span>
                              </div>
                            </div>
                          </TableCell>

                          {/* Mã SP - Kiểu Mono Pro */}
                          <TableCell>
                            <span className="font-mono text-[10px] font-black px-2 py-1 rounded-md bg-muted text-muted-foreground border border-border/50">
                              {product.id}
                            </span>
                          </TableCell>

                          {/* Tồn kho - Có thanh progress nhỏ */}
                          <TableCell className="text-center">
                            <div className="inline-flex flex-col items-center gap-1">
                              <span className={`text-sm font-black ${product.stock <= 5 ? "text-rose-500" : "text-foreground"}`}>
                                {product.stock}
                              </span>
                              <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${product.stock <= 5 ? "bg-rose-500" : "bg-primary"}`}
                                  style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>

                          {/* Giá bán */}
                          <TableCell>
                            <div className="text-sm font-black text-foreground">
                              {product.price.toLocaleString('vi-VN')}
                              <span className="ml-0.5 text-[10px] font-bold text-primary">₫</span>
                            </div>
                          </TableCell>

                          {/* Đã bán */}
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1.5 font-bold text-sm">
                              <div className="p-1 rounded-md bg-emerald-500/10">
                                <TrendingUp className="w-3 h-3 text-emerald-600" />
                              </div>
                              {product.sales}
                            </div>
                          </TableCell>

                          {/* Đánh giá */}
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                              <span className="text-sm font-black">{product.rating}</span>
                              <span className="text-[10px] text-muted-foreground font-medium">(24)</span>
                            </div>
                          </TableCell>

                          {/* Trạng thái */}
                          <TableCell className="text-center">
                            <div className="flex justify-center uppercase tracking-tighter">
                              {getStatusBadge(product.status)}
                            </div>
                          </TableCell>

                          {/* Hành động */}
                          <TableCell className="pr-8 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-9 w-9 p-0 rounded-lg hover:bg-primary hover:text-white transition-all">
                                  {updatingStatus === product.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <MoreVertical className="h-4 w-4" />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl shadow-xl border-border/50">
                                <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground px-2 py-1.5">Quản lý</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setSelectedProduct(product)} className="rounded-lg gap-2 cursor-pointer">
                                  <Eye className="w-4 h-4 text-blue-500" /> Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate(`/vendor-management/edit-product/${product.id.replace('SP', '')}`)} className="rounded-lg gap-2 cursor-pointer">
                                  <Edit className="w-4 h-4 text-amber-500" /> Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1" />
                                <DropdownMenuItem onClick={() => setProductToDelete(product)} className="rounded-lg gap-2 cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-50">
                                  <Trash2 className="w-4 h-4" /> Xóa sản phẩm
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            {/* Footer Bảng - Phân trang kiểu Pro */}
            <div className="p-6 border-t border-border/50 bg-muted/20">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                  Trang 1 trên 12 • Hiển thị 10 sản phẩm mỗi trang
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 rounded-lg font-bold text-xs border-border bg-background">Trước</Button>
                  <Button variant="outline" size="sm" className="h-8 rounded-lg font-bold text-xs border-border bg-background shadow-sm text-primary">Tiếp theo</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Product Detail Dialog */}
      <AnimatePresence>
        {selectedProduct && (
          <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden border-border/50 bg-background/80 backdrop-blur-2xl shadow-2xl rounded-[2rem]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative"
              >
                {/* Header với dải màu Gradient mờ phía sau */}
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/5 to-transparent -z-10" />

                <div className="p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6 pb-8 border-b border-border/50">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] font-black px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 tracking-tighter">
                          {selectedProduct.id}
                        </span>
                        <div className="scale-90 origin-left">
                          {getStatusBadge(selectedProduct.status)}
                        </div>
                      </div>
                      <DialogTitle className="text-3xl font-black tracking-tighter text-foreground">
                        {selectedProduct.name}
                      </DialogTitle>
                      <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          Khởi tạo: {selectedProduct.created_at ? new Date(selectedProduct.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="rounded-xl border-border/50 bg-background/50 font-bold active:scale-95 transition-all">
                        <Share2 className="w-4 h-4 mr-2" /> Chia sẻ
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
                    {/* Bên trái: Showcase Hình ảnh */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="group relative aspect-square rounded-[2.5rem] overflow-hidden border border-border/50 bg-muted/30 shadow-inner">
                        {selectedProduct.image ? (
                          <img
                            src={selectedProduct.image}
                            alt={selectedProduct.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/40 space-y-4">
                            <ImageIcon className="w-16 h-16" strokeWidth={1} />
                            <p className="text-xs font-bold uppercase tracking-widest">No Image Available</p>
                          </div>
                        )}
                        {/* Overlay badge cho Rating */}
                        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-background/90 backdrop-blur-md border border-border/50 shadow-lg">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                          <span className="text-sm font-black">{selectedProduct.rating}</span>
                          <span className="text-[10px] text-muted-foreground font-bold border-l pl-1.5 ml-1 border-border">24 Đánh giá</span>
                        </div>
                      </div>

                      <div className="p-5 rounded-3xl border border-border/50 bg-muted/20">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Phân loại hàng</p>
                        <Badge variant="secondary" className="px-4 py-1.5 rounded-xl text-sm font-bold bg-background shadow-sm border-none">
                          <Tag className="w-3.5 h-3.5 mr-2 text-primary" />
                          {selectedProduct.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Bên phải: Bento Stats Grid */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: "Giá bán hiện tại", value: `${selectedProduct.price.toLocaleString('vi-VN')}₫`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                          { label: "Số lượng tồn kho", value: selectedProduct.stock, icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", sub: `/ ${selectedProduct.initial_stock || 0}` },
                          { label: "Tổng đã bán", value: selectedProduct.sales, icon: TrendingUp, color: "text-violet-500", bg: "bg-violet-500/10" },
                          { label: "Doanh thu ước tính", value: `${((selectedProduct.price * selectedProduct.sales) / 1000000).toFixed(2)}M`, icon: Activity, color: "text-amber-500", bg: "bg-amber-500/10" }
                        ].map((stat, i) => (
                          <div key={i} className="p-5 rounded-[2rem] border border-border/50 bg-background/40 hover:bg-background/60 transition-colors group">
                            <div className={`w-10 h-10 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                              <stat.icon className="w-5 h-5" />
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black tracking-tighter text-foreground">{stat.value}</span>
                              {stat.sub && <span className="text-xs font-bold text-muted-foreground/60">{stat.sub}</span>}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Phân tích trạng thái sức khỏe sản phẩm */}
                      <div className="p-6 rounded-[2rem] border border-border/50 bg-muted/20 space-y-4">
                        <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Hiệu suất lưu kho</p>
                            <p className="text-sm font-black">
                              {selectedProduct.stock === 0 ? 'Cần nhập hàng ngay' : 'Mức độ tồn kho ổn định'}
                            </p>
                          </div>
                          <span className="text-2xl font-black text-primary">
                            {selectedProduct.initial_stock ? Math.round((selectedProduct.sales / selectedProduct.initial_stock) * 100) : 0}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-background rounded-full overflow-hidden p-0.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.round((selectedProduct.sales / (selectedProduct.initial_stock || 1)) * 100)}%` }}
                            className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full"
                          />
                        </div>
                      </div>

                      {/* Nút thao tác dưới cùng */}
                      <div className="flex items-center gap-3 pt-4">
                        <Button
                          className="flex-1 h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest transition-all active:scale-95"
                          onClick={() => {
                            setSelectedProduct(null);
                            navigate(`/vendor-management/edit-product/${selectedProduct.id.replace('SP', '')}`);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa thông tin
                        </Button>

                        {selectedProduct.status === 'active' ? (
                          <Button
                            variant="outline"
                            className="h-14 px-6 rounded-2xl border-rose-500/20 text-rose-500 hover:bg-rose-500/10 font-bold"
                            onClick={() => handleUpdateStatus(selectedProduct, 'inactive')}
                          >
                            <XCircle className="w-5 h-5" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="h-14 px-6 rounded-2xl border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 font-bold"
                            onClick={() => handleUpdateStatus(selectedProduct, 'active')}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Enhanced Delete Confirmation Dialog */}
      <AnimatePresence>
        {productToDelete && (
          <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
            <AlertDialogContent className="max-w-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <AlertDialogHeader className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <AlertDialogTitle className="text-xl font-bold text-red-700">
                      Xác nhận xóa sản phẩm
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-muted-foreground mt-2">
                      Bạn có chắc chắn muốn xóa sản phẩm
                      <span className="font-semibold text-foreground"> "{productToDelete.name}"</span>?
                      <br />
                      <span className="text-red-600 text-sm font-medium">
                        Hành động này không thể hoàn tác!
                      </span>
                    </AlertDialogDescription>
                  </div>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex gap-2 pt-4">
                  <AlertDialogCancel disabled={isDeleting} className="flex-1">
                    Hủy bỏ
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:opacity-90"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang xóa...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa sản phẩm
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </motion.div>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </AnimatePresence>
    </div>
  );
}