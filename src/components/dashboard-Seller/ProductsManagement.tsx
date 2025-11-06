import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  XCircle
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
  active: { label: "Đang bán", variant: "default" as const, color: "bg-green-100 text-green-800" },
  inactive: { label: "Ngừng bán", variant: "secondary" as const, color: "bg-gray-100 text-gray-800" },
  out_of_stock: { label: "Hết hàng", variant: "destructive" as const, color: "bg-red-100 text-red-800" }
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

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.color}>
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải danh sách sản phẩm...</p>
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
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-tr from-purple-500 to-fuchsia-500 text-white shadow-md">
              <Package className="w-6 h-6" />
            </div>

            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
                Quản lý sản phẩm
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Danh sách và quản lý tất cả sản phẩm của cửa hàng bạn
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchProducts}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
            <Button
              onClick={() => navigate("/vendor-management/add-product")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium shadow-md bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:from-fuchsia-500 hover:to-pink-500 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Thêm sản phẩm mới
            </Button>
          </div>
        </div>

        <div className="mt-4 h-[2px] w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 rounded-full opacity-60"></div>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <CardTitle className="text-xl font-semibold">
              Danh sách sản phẩm ({filteredProducts.length})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên hoặc mã SP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-primary"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã SP</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Tồn kho</TableHead>
                  <TableHead>Đã bán</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'Không tìm thấy sản phẩm nào' : 'Chưa có sản phẩm nào'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                            {product.image ? (
                              <img 
                                src={getImageUrl(product.image) || ''} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.parentElement!.innerHTML = '<svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>';
                                }}
                              />
                            ) : (
                              <Package className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          <span className="max-w-xs truncate">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.price.toLocaleString('vi-VN')}đ</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className={product.stock === 0 ? "text-red-600 font-medium" : "font-medium"}>
                            {product.stock}
                          </span>
                          {product.initial_stock && (
                            <span className="text-xs text-muted-foreground">
                              Ban đầu: {product.initial_stock}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{product.sales}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{product.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={updatingStatus === product.id}>
                              {updatingStatus === product.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết sản phẩm</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              <div className="flex gap-6">
                <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {selectedProduct.image ? (
                    <img 
                      src={getImageUrl(selectedProduct.image) || ''} 
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<svg class="w-16 h-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>';
                      }}
                    />
                  ) : (
                    <Package className="w-16 h-16 text-gray-500" />
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{selectedProduct.name}</h3>
                    <p className="text-muted-foreground">{selectedProduct.category}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedProduct.status)}
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-medium">{selectedProduct.rating}</span>
                      <span className="text-muted-foreground text-sm">({selectedProduct.sales} đánh giá)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Giá bán</p>
                      <p className="text-2xl font-bold text-primary">
                        {selectedProduct.price.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tồn kho hiện tại</p>
                      <p className="text-2xl font-bold">
                        {selectedProduct.stock} <span className="text-base font-normal text-muted-foreground">/ {selectedProduct.initial_stock}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ({selectedProduct.sales} đã bán)
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Đã bán</p>
                      <p className="text-xl font-bold text-green-600">{selectedProduct.sales}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mã sản phẩm</p>
                      <p className="text-xl font-bold">{selectedProduct.id}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                  Đóng
                </Button>
                <Button
                  className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500"
                  onClick={() => {
                    setSelectedProduct(null);
                    navigate(`/vendor-management/edit-product/${selectedProduct.id.replace('SP', '')}`);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent className="max-w-md rounded-xl border-2 border-red-200 shadow-lg animate-shake">
          <AlertDialogHeader className="flex flex-col items-center gap-2">
            <div className="bg-gradient-to-tr from-red-400 to-red-600 rounded-full p-3 mb-2 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-red-700">
              Cảnh báo quan trọng!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base text-muted-foreground mt-2">
              Bạn sắp xóa sản phẩm <strong className="text-red-700">{productToDelete?.name}</strong>.<br />
              <span className="text-sm text-red-500 font-semibold">Hành động này <u>không thể hoàn tác</u>.<br />Hãy chắc chắn trước khi tiếp tục!</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-3 pt-4">
            <AlertDialogCancel className="px-4 py-2 rounded-lg border" disabled={isDeleting}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
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
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
