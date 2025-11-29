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
  Activity
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
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-8">
          <div className="flex items-start gap-6">
            <motion.div
              className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 shadow-xl"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Package className="w-8 h-8 text-white" />
            </motion.div>

            <div className="space-y-2">
              <div>
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                  Quản lý sản phẩm
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-muted-foreground">Cập nhật real-time</p>
                </div>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl">
                🚀 Quản lý toàn bộ kho sản phẩm với dashboard thông minh và analytics chi tiết
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
            <Button
              onClick={() => navigate("/vendor-management/add-product")}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:opacity-90 gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Thêm sản phẩm
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          {
            label: "Tổng sản phẩm",
            value: stats.total,
            icon: Package,
            color: "from-blue-500 to-cyan-500",
            change: "+12"
          },
          {
            label: "Đang bán",
            value: stats.active,
            icon: CheckCircle2,
            color: "from-green-500 to-emerald-500",
            change: `${Math.round((stats.active/stats.total)*100)}%`
          },
          {
            label: "Hết hàng",
            value: stats.outOfStock,
            icon: AlertTriangle,
            color: "from-red-500 to-rose-500",
            change: stats.outOfStock > 0 ? "Cần nhập" : "Ổn định"
          },
          {
            label: "Đã bán",
            value: stats.totalSales,
            icon: TrendingUp,
            color: "from-purple-500 to-pink-500",
            change: "+25.8%"
          },
          {
            label: "Doanh thu",
            value: `${(stats.totalRevenue / 1_000_000).toFixed(1)}M`,
            icon: DollarSign,
            color: "from-amber-500 to-orange-500",
            change: "+18.2%"
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

      {/* Products Table */}
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
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Danh sách sản phẩm</CardTitle>
                  <p className="text-sm text-muted-foreground">Quản lý toàn bộ kho hàng của cửa hàng</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Lọc
                </Button>
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-border"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="font-semibold">Sản phẩm</TableHead>
                    <TableHead className="font-semibold">Mã SP</TableHead>
                    <TableHead className="font-semibold">Danh mục</TableHead>
                    <TableHead className="font-semibold">Giá bán</TableHead>
                    <TableHead className="font-semibold">Tồn kho</TableHead>
                    <TableHead className="font-semibold">Đã bán</TableHead>
                    <TableHead className="font-semibold">Đánh giá</TableHead>
                    <TableHead className="font-semibold">Trạng thái</TableHead>
                    <TableHead className="font-semibold text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12">
                          <div className="space-y-3">
                            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                              <Package className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {searchTerm ? 'Không tìm thấy sản phẩm nào' : 'Chưa có sản phẩm nào'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {!searchTerm && 'Thêm sản phẩm đầu tiên để bắt đầu bán hàng'}
                              </p>
                            </div>
                            {!searchTerm && (
                              <Button
                                onClick={() => navigate("/vendor-management/add-product")}
                                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm sản phẩm đầu tiên
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product, index) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-lg border bg-muted overflow-hidden shadow-sm">
                                {product.image ? (
                                  <img 
                                    src={getImageUrl(product.image) || ''} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.parentElement!.innerHTML = `
                                        <div class="w-full h-full flex items-center justify-center bg-muted">
                                          <svg class="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                          </svg>
                                        </div>
                                      `;
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-medium text-foreground line-clamp-2 text-sm">
                                  {product.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {product.category}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-mono text-sm bg-muted px-2 py-1 rounded inline-block">
                              {product.id}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{product.category}</span>
                          </TableCell>
                          <TableCell>
                            <div className="font-bold text-primary">
                              {product.price.toLocaleString('vi-VN')}₫
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className={`font-medium ${product.stock === 0 ? "text-red-600" : "text-foreground"}`}>
                                {product.stock}
                              </div>
                              {product.initial_stock && (
                                <div className="text-xs text-muted-foreground">
                                  / {product.initial_stock}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{product.sales}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="font-medium text-sm">{product.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(product.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  disabled={updatingStatus === product.id}
                                  className="h-8 w-8 p-0"
                                >
                                  {updatingStatus === product.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <MoreVertical className="w-4 h-4" />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setSelectedProduct(product)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate(`/vendor-management/edit-product/${product.id.replace('SP', '')}`)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {product.stock > 0 && (
                                  <>
                                    {product.status === 'active' ? (
                                      <DropdownMenuItem 
                                        onClick={() => handleUpdateStatus(product, 'inactive')}
                                        className="text-orange-600"
                                      >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Ngừng bán
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem 
                                        onClick={() => handleUpdateStatus(product, 'active')}
                                        className="text-green-600"
                                      >
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Kích hoạt
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                  </>
                                )}
                                <DropdownMenuItem 
                                  onClick={() => setProductToDelete(product)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Xóa sản phẩm
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
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Product Detail Dialog */}
      <AnimatePresence>
        {selectedProduct && (
          <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
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
                      <DialogTitle className="text-2xl font-bold">Chi tiết sản phẩm</DialogTitle>
                      <div className="flex items-center gap-3">
                        <div className="font-mono text-sm bg-muted px-3 py-1 rounded">
                          {selectedProduct.id}
                        </div>
                        {getStatusBadge(selectedProduct.status)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {selectedProduct.created_at ? new Date(selectedProduct.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                    </div>
                  </div>
                </DialogHeader>

                <div className="pt-6 space-y-6">
                  {/* Product Overview */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Product Image & Basic Info */}
                    <Card className="border">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="w-full h-64 rounded-lg border bg-muted overflow-hidden">
                            {selectedProduct.image ? (
                              <img 
                                src={getImageUrl(selectedProduct.image) || ''} 
                                alt={selectedProduct.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.parentElement!.innerHTML = `
                                    <div class="w-full h-full flex flex-col items-center justify-center text-muted-foreground space-y-2">
                                      <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      <p class="text-sm">Không có ảnh</p>
                                    </div>
                                  `;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground space-y-2">
                                <ImageIcon className="w-16 h-16" />
                                <p className="text-sm">Không có ảnh</p>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xl font-bold text-foreground">{selectedProduct.name}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="gap-1">
                                <Tag className="w-3 h-3" />
                                {selectedProduct.category}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="font-medium text-sm">{selectedProduct.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Stats & Performance */}
                    <Card className="border">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Activity className="w-5 h-5" />
                          Thống kê hiệu suất
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-600 font-medium">Giá bán</span>
                            </div>
                            <p className="text-2xl font-bold text-green-700">
                              {selectedProduct.price.toLocaleString('vi-VN')}₫
                            </p>
                          </div>

                          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Package className="w-4 h-4 text-blue-600" />
                              <span className="text-sm text-blue-600 font-medium">Tồn kho</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-700">
                              {selectedProduct.stock}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              / {selectedProduct.initial_stock || 'N/A'}
                            </p>
                          </div>

                          <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="w-4 h-4 text-purple-600" />
                              <span className="text-sm text-purple-600 font-medium">Đã bán</span>
                            </div>
                            <p className="text-2xl font-bold text-purple-700">
                              {selectedProduct.sales}
                            </p>
                          </div>

                          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign className="w-4 h-4 text-amber-600" />
                              <span className="text-sm text-amber-600 font-medium">Doanh thu</span>
                            </div>
                            <p className="text-xl font-bold text-amber-700">
                              {(selectedProduct.price * selectedProduct.sales).toLocaleString('vi-VN')}₫
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Tỷ lệ bán hàng:</span>
                            <span className="font-medium">
                              {selectedProduct.initial_stock ? 
                                `${Math.round((selectedProduct.sales / selectedProduct.initial_stock) * 100)}%` : 
                                'N/A'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Trạng thái kho:</span>
                            <span className={`font-medium ${
                              selectedProduct.stock === 0 ? 'text-red-600' : 
                              selectedProduct.stock < 10 ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {selectedProduct.stock === 0 ? 'Hết hàng' : 
                               selectedProduct.stock < 10 ? 'Sắp hết' : 'Còn đủ'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedProduct(null)}
                      className="gap-2"
                    >
                      Đóng
                    </Button>
                    
                    {selectedProduct.stock > 0 && selectedProduct.status === 'active' && (
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateStatus(selectedProduct, 'inactive')}
                        className="gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Ngừng bán
                      </Button>
                    )}
                    
                    {selectedProduct.stock > 0 && selectedProduct.status !== 'active' && (
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateStatus(selectedProduct, 'active')}
                        className="gap-2 text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Kích hoạt
                      </Button>
                    )}
                    
                    <Button
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:opacity-90 gap-2"
                      onClick={() => {
                        setSelectedProduct(null);
                        navigate(`/vendor-management/edit-product/${selectedProduct.id.replace('SP', '')}`);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                      Chỉnh sửa
                    </Button>
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