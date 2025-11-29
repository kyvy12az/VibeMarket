import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, Star, Check, SearchX } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
  rating: number;
  category: string;
  description?: string;
}

interface ProductSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductSelect: (products: Product[]) => void;
  selectedProducts?: Product[];
}

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL;

const ProductSelectionModal = ({
  open,
  onOpenChange,
  onProductSelect,
  selectedProducts = [],
}: ProductSelectionModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [products, setProducts] = useState<Product[]>([]);
  const [localSelectedProducts, setLocalSelectedProducts] =
    useState<Product[]>(selectedProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/product/list.php`);
        const data = await res.json();

        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Fetch product failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [open]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesMin = minPrice === "" || product.price >= Number(minPrice);
    const matchesMax = maxPrice === "" || product.price <= Number(maxPrice);

    return matchesSearch && matchesMin && matchesMax;
  });

  const toggleProductSelection = (product: Product) => {
    const isSelected = localSelectedProducts.some((p) => p.id === product.id);

    if (isSelected) {
      setLocalSelectedProducts((prev) =>
        prev.filter((p) => p.id !== product.id)
      );
    } else {
      setLocalSelectedProducts((prev) => [...prev, product]);
    }
  };

  const handleConfirm = () => {
    onProductSelect(localSelectedProducts);
    onOpenChange(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col bg-gradient-card border-border">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Chọn sản phẩm để gắn thẻ
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Chọn sản phẩm bạn muốn gắn vào bài viết của mình
          </p>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc mô tả sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-background/50 border-border focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="flex items-center gap-2 bg-background/30 px-4 py-2 rounded-xl border border-border">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">Giá từ</label>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-24 h-9 bg-background/50"
                />
              </div>

              <span className="text-muted-foreground font-bold">→</span>

              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">Đến</label>
                <Input
                  type="number"
                  min={0}
                  placeholder="∞"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-24 h-9 bg-background/50"
                />
              </div>
            </div>
          </div>

          {localSelectedProducts.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 bg-accent/10 rounded-xl border border-accent/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-accent">
                  Đã chọn {localSelectedProducts.length} sản phẩm
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocalSelectedProducts([])}
                className="text-xs hover:text-red-500"
              >
                Xóa tất cả
              </Button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm">Đang tải sản phẩm...</p>
            </div>
          ) : (
            <div className="overflow-y-auto flex-1 px-1 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredProducts.map((product) => {
                  const isSelected = localSelectedProducts.some(
                    (p) => p.id === product.id
                  );

                  return (
                    <Card
                      key={product.id}
                      className={`group cursor-pointer transition-all duration-300 overflow-hidden ${
                        isSelected
                          ? "ring-2 ring-accent bg-accent/5 shadow-lg"
                          : "hover:shadow-xl hover:scale-[1.02] bg-gradient-card"
                      }`}
                      onClick={() => toggleProductSelection(product)}
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image || "/placeholder.png"}
                          className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                          alt={product.name}
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-accent/20 backdrop-blur-[1px] flex items-center justify-center">
                            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                              <Check className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-black/60 text-white border-0 backdrop-blur-sm">
                            {product.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-3 space-y-2">
                        <h3 className="font-semibold text-sm line-clamp-2 text-card-foreground min-h-[40px]">
                          {product.name}
                        </h3>

                        <div className="flex items-center justify-between">
                          <span className="font-bold text-base text-accent">
                            {formatPrice(product.price)}
                          </span>

                          <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">
                            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                            <span className="text-xs font-semibold text-yellow-600">{product.rating}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                    <SearchX className="h-10 w-10 opacity-50" />
                  </div>
                  <p className="text-lg font-medium">Không tìm thấy sản phẩm nào</p>
                  <p className="text-sm mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-border mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11"
          >
            Hủy
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={localSelectedProducts.length === 0}
            className="flex-1 h-11 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity"
          >
            <Check className="w-4 h-4 mr-2" />
            Xác nhận ({localSelectedProducts.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductSelectionModal;
