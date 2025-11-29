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
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost/VIBE_MARKET_BACKEND/VibeMarket-BE";

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Chọn sản phẩm để gắn thẻ</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-lg"
              />
            </div>

            <div className="flex items-center gap-2">
              <div>
                <label className="text-xs text-muted-foreground">Giá từ</label>
                <Input
                  type="number"
                  min={0}
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-28"
                />
              </div>

              <span className="text-muted-foreground pt-6">-</span>

              <div>
                <label className="text-xs text-muted-foreground">Đến</label>
                <Input
                  type="number"
                  min={0}
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-28"
                />
              </div>
            </div>
          </div>

          {localSelectedProducts.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Đã chọn {localSelectedProducts.length} sản phẩm
            </div>
          )}

          {loading ? (
            <div className="text-center py-10 text-muted-foreground">
              Đang tải sản phẩm...
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[50vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                  const isSelected = localSelectedProducts.some(
                    (p) => p.id === product.id
                  );

                  return (
                    <Card
                      key={product.id}
                      className={`p-4 cursor-pointer ${
                        isSelected
                          ? "ring-2 ring-primary bg-primary/5"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => toggleProductSelection(product)}
                    >
                      <div className="relative">
                        <img
                          src={product.image || "/placeholder.png"}
                          className="w-full h-32 object-cover rounded-md"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>

                      <div className="mt-3 space-y-2">
                        <h3 className="font-medium text-sm line-clamp-2">
                          {product.name}
                        </h3>

                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-primary">
                            {formatPrice(product.price)}
                          </span>

                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{product.rating}</span>
                          </div>
                        </div>

                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <SearchX className="h-12 w-12 mb-3 opacity-50" />
                  <p>Không tìm thấy sản phẩm nào</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={localSelectedProducts.length === 0}
            className="flex-1"
          >
            Xác nhận ({localSelectedProducts.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductSelectionModal;
