import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogDescription,
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
import { Eye, Edit, Trash2, Search, Package, Star, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  rating: number;
  image: string;
  status: "active" | "inactive" | "out_of_stock";
}

const mockProducts: Product[] = [
  {
    id: "SP001",
    name: "Kem dưỡng da Olay Regenerist",
    category: "Chăm sóc da",
    price: 299000,
    stock: 45,
    sales: 189,
    rating: 4.9,
    image: "/placeholder.svg",
    status: "active"
  },
  {
    id: "SP002",
    name: "Son môi MAC Ruby Woo",
    category: "Trang điểm",
    price: 450000,
    stock: 23,
    sales: 167,
    rating: 4.8,
    image: "/placeholder.svg",
    status: "active"
  },
  {
    id: "SP003",
    name: "Nước hoa Chanel No.5",
    category: "Nước hoa",
    price: 1200000,
    stock: 12,
    sales: 134,
    rating: 4.7,
    image: "/placeholder.svg",
    status: "active"
  },
  {
    id: "SP004",
    name: "Serum Vitamin C",
    category: "Chăm sóc da",
    price: 299000,
    stock: 0,
    sales: 98,
    rating: 4.6,
    image: "/placeholder.svg",
    status: "out_of_stock"
  },
  {
    id: "SP005",
    name: "Mặt nạ SK-II",
    category: "Chăm sóc da",
    price: 850000,
    stock: 8,
    sales: 76,
    rating: 4.8,
    image: "/placeholder.svg",
    status: "active"
  }
];

const statusConfig = {
  active: { label: "Đang bán", variant: "default" as const, color: "bg-green-100 text-green-800" },
  inactive: { label: "Ngừng bán", variant: "secondary" as const, color: "bg-gray-100 text-gray-800" },
  out_of_stock: { label: "Hết hàng", variant: "destructive" as const, color: "bg-red-100 text-red-800" }
};

export function ProductsManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const filteredProducts = mockProducts.filter(product =>
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

  const handleDelete = () => {
    if (productToDelete) {
      toast({
        title: "Đã xóa sản phẩm",
        description: `Sản phẩm ${productToDelete.name} đã được xóa khỏi danh sách.`,
      });
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-6"
      >
        <div className="flex justify-between items-center flex-wrap gap-4">
          {/* Tiêu đề và mô tả */}
          <div className="flex items-center gap-3">
            {/* Icon gradient tím */}
            <div className="p-3 rounded-xl bg-gradient-to-tr from-purple-500 to-fuchsia-500 text-white shadow-md">
              <Package className="w-6 h-6" />
            </div>

            <div>
              {/* Tiêu đề gradient tím */}
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
                Quản lý sản phẩm
              </h1>

              {/* Mô tả phụ */}
              <p className="text-sm text-muted-foreground mt-1">
                Danh sách và quản lý tất cả sản phẩm của cửa hàng bạn
              </p>
            </div>
          </div>

          {/* Nút hành động với gradient tím */}
          <Button
            onClick={() => navigate("/vendor-management/add-product")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium shadow-md bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:from-fuchsia-500 hover:to-pink-500 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Thêm sản phẩm mới
          </Button>
        </div>

        {/* Divider gradient tím nhẹ */}
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
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-500" />
                        </div>
                        <span className="max-w-xs truncate">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.price.toLocaleString('vi-VN')}đ</TableCell>
                    <TableCell>
                      <span className={product.stock === 0 ? "text-red-600 font-medium" : ""}>
                        {product.stock}
                      </span>
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
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/quan-ly-shop/san-pham/${product.id}/chinh-sua`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setProductToDelete(product)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
                <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-500" />
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
                      <p className="text-sm text-muted-foreground">Tồn kho</p>
                      <p className="text-2xl font-bold">
                        {selectedProduct.stock} <span className="text-base font-normal text-muted-foreground">sản phẩm</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Đã bán</p>
                      <p className="text-xl font-bold">{selectedProduct.sales}</p>
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
                  className="bg-gradient-primary"
                  onClick={() => navigate(`/vendor-management/product-management/${selectedProduct.id}/chinh-sua`)}
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
            <AlertDialogCancel className="px-4 py-2 rounded-lg border">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa sản phẩm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
