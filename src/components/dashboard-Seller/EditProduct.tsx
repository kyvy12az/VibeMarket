import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  Save,
  Loader2,
  Package,
  X,
  Image as ImageIcon,
  Plus,
} from "lucide-react";

interface ProductData {
  id: number;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  original_price: number;
  discount: number;
  quantity: number;
  current_stock: number;
  sold: number;
  status: string;
  flash_sale: boolean;
  sale_price: number | null;
  sale_quantity: number;
  is_live: boolean;
  release_date: string | null;
  shipping_fee: number;
  images: string[];
  sizes: string[];
  colors: string[];
  tags: string[];
}

const categories = [
  "Điện thoại & Phụ kiện",
  "Laptop & Máy tính",
  "Thời trang nam",
  "Thời trang nữ",
  "Đồng hồ",
  "Giày dép",
  "Túi xách",
  "Phụ kiện thời trang",
  "Mỹ phẩm",
  "Sức khỏe",
  "Đồ gia dụng",
  "Điện tử",
  "Thể thao",
  "Sách",
  "Khác",
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const colors = ["Đen", "Trắng", "Xám", "Đỏ", "Xanh dương", "Xanh lá", "Vàng", "Hồng", "Nâu", "Cam"];

export function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<ProductData | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: 0,
    original_price: 0,
    discount: 0,
    quantity: 0,
    status: "active",
    flash_sale: false,
    sale_price: 0,
    sale_quantity: 0,
    is_live: false,
    release_date: "",
    shipping_fee: 0,
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [productTags, setProductTags] = useState<string[]>([]);

  useEffect(() => {
    if (id && user?.id) {
      fetchProductData();
    }
  }, [id, user]);

  const fetchProductData = async () => {
    if (!id || !user?.id) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/vendor/get_product_edit.php?product_id=${id}&user_id=${user.id}`
      );
      const data = await response.json();

      if (data.success) {
        const prod = data.product;
        setProduct(prod);
        setFormData({
          name: prod.name || "",
          description: prod.description || "",
          category: prod.category || "",
          brand: prod.brand || "",
          price: prod.price || 0,
          original_price: prod.original_price || 0,
          discount: prod.discount || 0,
          quantity: prod.quantity || 0,
          status: prod.status || "active",
          flash_sale: prod.flash_sale || false,
          sale_price: prod.sale_price || 0,
          sale_quantity: prod.sale_quantity || 0,
          is_live: prod.is_live || false,
          release_date: prod.release_date || "",
          shipping_fee: prod.shipping_fee || 0,
        });
        setSelectedSizes(prod.sizes || []);
        setSelectedColors(prod.colors || []);
        setProductTags(prod.tags || []);
      } else {
        toast({
          title: "Lỗi",
          description: data.error || "Không thể tải thông tin sản phẩm",
          variant: "destructive",
        });
        navigate("/vendor-management/product-management");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Lỗi",
        description: "Không thể kết nối đến server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id || !id) return;

    // Validate
    if (!formData.name || formData.price <= 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/vendor/update_product.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: parseInt(id),
            user_id: user.id,
            ...formData,
            sizes: selectedSizes,
            colors: selectedColors,
            tags: productTags,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Thành công",
          description: "Cập nhật sản phẩm thành công",
        });
        navigate("/vendor-management/products");
      } else {
        toast({
          title: "Lỗi",
          description: data.error || "Không thể cập nhật sản phẩm",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Lỗi",
        description: "Không thể kết nối đến server",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const addTag = () => {
    if (tagInput.trim() && !productTags.includes(tagInput.trim())) {
      setProductTags([...productTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setProductTags(productTags.filter((t) => t !== tag));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Không tìm thấy sản phẩm</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/vendor-management/product-management")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-tr from-orange-500 to-red-500 text-white shadow-md">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
                Chỉnh sửa sản phẩm
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Cập nhật thông tin sản phẩm: {product.name}
              </p>
            </div>
          </div>
        </div>

        <div className="h-[2px] w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full opacity-60"></div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Thương hiệu</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Nhập thương hiệu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả sản phẩm</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả chi tiết về sản phẩm"
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Danh mục <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Giá và tồn kho */}
        <Card>
          <CardHeader>
            <CardTitle>Giá bán và tồn kho</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Giá bán <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="original_price">Giá gốc</Label>
                <Input
                  id="original_price"
                  type="number"
                  min="0"
                  value={formData.original_price}
                  onChange={(e) =>
                    setFormData({ ...formData, original_price: parseInt(e.target.value) || 0 })
                  }
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Giảm giá (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Tồn kho ban đầu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Tồn kho hiện tại: {product.current_stock} | Đã bán: {product.sold}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipping_fee">Phí vận chuyển</Label>
                <Input
                  id="shipping_fee"
                  type="number"
                  min="0"
                  value={formData.shipping_fee}
                  onChange={(e) =>
                    setFormData({ ...formData, shipping_fee: parseInt(e.target.value) || 0 })
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang bán</SelectItem>
                  <SelectItem value="inactive">Ngừng bán</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Flash Sale */}
        <Card>
          <CardHeader>
            <CardTitle>Flash Sale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="flash_sale">Kích hoạt Flash Sale</Label>
              <Switch
                id="flash_sale"
                checked={formData.flash_sale}
                onCheckedChange={(checked) => setFormData({ ...formData, flash_sale: checked })}
              />
            </div>

            {formData.flash_sale && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="sale_price">Giá Flash Sale</Label>
                  <Input
                    id="sale_price"
                    type="number"
                    min="0"
                    value={formData.sale_price}
                    onChange={(e) =>
                      setFormData({ ...formData, sale_price: parseInt(e.target.value) || 0 })
                    }
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sale_quantity">Số lượng Flash Sale</Label>
                  <Input
                    id="sale_quantity"
                    type="number"
                    min="0"
                    value={formData.sale_quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, sale_quantity: parseInt(e.target.value) || 0 })
                    }
                    placeholder="0"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Phát hành sản phẩm */}
        <Card>
          <CardHeader>
            <CardTitle>Phát hành sản phẩm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="is_live">Phát hành ngay lập tức</Label>
              <Switch
                id="is_live"
                checked={formData.is_live}
                onCheckedChange={(checked) => setFormData({ ...formData, is_live: checked })}
              />
            </div>

            {!formData.is_live && (
              <div className="space-y-2 pt-4">
                <Label htmlFor="release_date">Ngày phát hành</Label>
                <Input
                  id="release_date"
                  type="datetime-local"
                  value={formData.release_date}
                  onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Biến thể sản phẩm */}
        <Card>
          <CardHeader>
            <CardTitle>Biến thể sản phẩm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Kích thước</Label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <Badge
                    key={size}
                    variant={selectedSizes.includes(size) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleSize(size)}
                  >
                    {size}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Màu sắc</Label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <Badge
                    key={color}
                    variant={selectedColors.includes(color) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleColor(color)}
                  >
                    {color}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Nhập tag và nhấn Enter"
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {productTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hình ảnh sản phẩm */}
        <Card>
          <CardHeader>
            <CardTitle>Hình ảnh sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.images.map((img, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={img}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Để thay đổi hình ảnh, vui lòng xóa và thêm sản phẩm mới
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/vendor-management/product-management")}
            disabled={saving}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}