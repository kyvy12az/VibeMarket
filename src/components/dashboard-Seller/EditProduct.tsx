import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Edit3,
  DollarSign,
  Clock,
  Star,
  Settings,
  Palette,
  Tag,
  Sparkles,
  Truck,
  Calendar,
  Info,
  Check,
  AlertCircle,
  Eye,
  TrendingUp
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

const colorMap: Record<string, string> = {
  "Đen": "#000000",
  "Trắng": "#ffffff",
  "Xám": "#6b7280",
  "Đỏ": "#ef4444",
  "Xanh dương": "#3b82f6",
  "Xanh lá": "#10b981",
  "Vàng": "#f59e0b",
  "Hồng": "#ec4899",
  "Nâu": "#a3a3a3",
  "Cam": "#f97316",
};

export function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [currentStep, setCurrentStep] = useState("basic");

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

  const steps = [
    { id: "basic", label: "Thông tin cơ bản", icon: Package, color: "from-blue-500 to-cyan-500" },
    { id: "pricing", label: "Giá & Tồn kho", icon: DollarSign, color: "from-green-500 to-emerald-500" },
    { id: "variants", label: "Biến thể", icon: Palette, color: "from-purple-500 to-pink-500" },
    { id: "settings", label: "Cài đặt", icon: Settings, color: "from-orange-500 to-red-500" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 mx-auto w-20 h-20 flex items-center justify-center shadow-xl">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Đang tải thông tin sản phẩm</h3>
            <p className="text-muted-foreground">Vui lòng đợi trong giây lát...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="p-4 rounded-2xl bg-muted mx-auto w-20 h-20 flex items-center justify-center">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Không tìm thấy sản phẩm</h3>
            <p className="text-muted-foreground">Sản phẩm này có thể đã bị xóa hoặc bạn không có quyền truy cập</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-pink-500/5 rounded-3xl -z-10" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-8">
          <div className="flex items-start gap-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/vendor-management/product-management")}
              className="rounded-xl hover:bg-muted border-border"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <motion.div
              className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 shadow-xl"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Edit3 className="w-8 h-8 text-white" />
            </motion.div>

            <div className="space-y-2">
              <div>
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  Chỉnh sửa sản phẩm
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <p className="text-muted-foreground">
                    Cập nhật thông tin: <span className="font-medium text-foreground">{product.name}</span>
                  </p>
                </div>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl">
                🎨 Chỉnh sửa và cập nhật thông tin sản phẩm một cách dễ dàng và chuyên nghiệp
              </p>
            </div>
          </div>

          {/* Product Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-muted/50 border border-border">
              <div className="text-xl font-bold text-foreground">{product.current_stock}</div>
              <div className="text-xs text-muted-foreground">Tồn kho</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-muted/50 border border-border">
              <div className="text-xl font-bold text-foreground">{product.sold}</div>
              <div className="text-xs text-muted-foreground">Đã bán</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-muted/50 border border-border">
              <div className="text-xl font-bold text-primary">{product.price.toLocaleString()}₫</div>
              <div className="text-xs text-muted-foreground">Giá hiện tại</div>
            </div>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="flex items-center gap-4 p-2 bg-muted/50 rounded-2xl border border-border">
            {steps.map((step, index) => (
              <motion.button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  currentStep === step.id
                    ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-md'
                    : 'hover:bg-muted'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <step.icon className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:block">{step.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Basic Info */}
          {currentStep === "basic" && (
            <motion.div
              key="basic"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border shadow-sm">
                <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-cyan-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                        Thông tin cơ bản
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">Tên, mô tả và phân loại sản phẩm</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        Tên sản phẩm <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nhập tên sản phẩm..."
                        className="border-border focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brand" className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Thương hiệu
                      </Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        placeholder="Nhập thương hiệu..."
                        className="border-border focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Danh mục <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="border-border focus:border-primary">
                        <SelectValue placeholder="Chọn danh mục..." />
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

                  <div className="space-y-2">
                    <Label htmlFor="description" className="flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Mô tả sản phẩm
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Nhập mô tả chi tiết về sản phẩm..."
                      rows={6}
                      className="border-border focus:border-primary resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Pricing & Stock */}
          {currentStep === "pricing" && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                {/* Pricing Card */}
                <Card className="border shadow-sm">
                  <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                          Giá bán và chiết khấu
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">Thiết lập giá và chính sách giảm giá</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          Giá bán <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="price"
                            type="number"
                            min="0"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                            className="border-border focus:border-primary pl-8"
                            required
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₫</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="original_price" className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-600" />
                          Giá gốc
                        </Label>
                        <div className="relative">
                          <Input
                            id="original_price"
                            type="number"
                            min="0"
                            value={formData.original_price}
                            onChange={(e) => setFormData({ ...formData, original_price: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                            className="border-border focus:border-primary pl-8"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₫</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="discount" className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-orange-600" />
                          Giảm giá (%)
                        </Label>
                        <div className="relative">
                          <Input
                            id="discount"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.discount}
                            onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                            className="border-border focus:border-primary pr-8"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                        </div>
                      </div>
                    </div>

                    {/* Flash Sale */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-red-600" />
                          <Label htmlFor="flash_sale" className="font-medium text-red-800">
                            Kích hoạt Flash Sale
                          </Label>
                        </div>
                        <Switch
                          id="flash_sale"
                          checked={formData.flash_sale}
                          onCheckedChange={(checked) => setFormData({ ...formData, flash_sale: checked })}
                        />
                      </div>

                      {formData.flash_sale && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="sale_price">Giá Flash Sale</Label>
                            <div className="relative">
                              <Input
                                id="sale_price"
                                type="number"
                                min="0"
                                value={formData.sale_price}
                                onChange={(e) => setFormData({ ...formData, sale_price: parseInt(e.target.value) || 0 })}
                                placeholder="0"
                                className="border-border focus:border-primary pl-8"
                              />
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₫</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="sale_quantity">Số lượng Flash Sale</Label>
                            <Input
                              id="sale_quantity"
                              type="number"
                              min="0"
                              value={formData.sale_quantity}
                              onChange={(e) => setFormData({ ...formData, sale_quantity: parseInt(e.target.value) || 0 })}
                              placeholder="0"
                              className="border-border focus:border-primary"
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Stock & Shipping */}
                <Card className="border shadow-sm">
                  <CardHeader className="border-b bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Tồn kho và vận chuyển</CardTitle>
                        <p className="text-sm text-muted-foreground">Quản lý số lượng và phí ship</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="quantity" className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Tồn kho ban đầu <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="0"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                          className="border-border focus:border-primary"
                          required
                        />
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span>Tồn kho hiện tại: <strong>{product.current_stock}</strong></span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span>Đã bán: <strong>{product.sold}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="shipping_fee" className="flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          Phí vận chuyển
                        </Label>
                        <div className="relative">
                          <Input
                            id="shipping_fee"
                            type="number"
                            min="0"
                            value={formData.shipping_fee}
                            onChange={(e) => setFormData({ ...formData, shipping_fee: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                            className="border-border focus:border-primary pl-8"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₫</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status" className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Trạng thái sản phẩm
                      </Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger className="border-border focus:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              Đang bán
                            </div>
                          </SelectItem>
                          <SelectItem value="inactive">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full" />
                              Ngừng bán
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Variants */}
          {currentStep === "variants" && (
            <motion.div
              key="variants"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                {/* Sizes */}
                <Card className="border shadow-sm">
                  <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                          Kích thước sản phẩm
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">Chọn các size có sẵn</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-3">
                      {sizes.map((size) => (
                        <motion.div
                          key={size}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Badge
                            variant={selectedSizes.includes(size) ? "default" : "outline"}
                            className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                              selectedSizes.includes(size)
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-transparent text-white shadow-md'
                                : 'hover:border-purple-500'
                            }`}
                            onClick={() => toggleSize(size)}
                          >
                            {selectedSizes.includes(size) && <Check className="w-3 h-3 mr-1" />}
                            {size}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                    {selectedSizes.length > 0 && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Đã chọn {selectedSizes.length} size: {selectedSizes.join(", ")}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Colors */}
                <Card className="border shadow-sm">
                  <CardHeader className="border-b bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                        <Palette className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Màu sắc sản phẩm</CardTitle>
                        <p className="text-sm text-muted-foreground">Chọn các màu có sẵn</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {colors.map((color) => (
                        <motion.div
                          key={color}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedColors.includes(color)
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => toggleColor(color)}
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: colorMap[color] }}
                            />
                            <span className="text-sm font-medium">{color}</span>
                          </div>
                          {selectedColors.includes(color) && (
                            <Check className="w-4 h-4 text-primary mt-1" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                    {selectedColors.length > 0 && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Đã chọn {selectedColors.length} màu: {selectedColors.join(", ")}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card className="border shadow-sm">
                  <CardHeader className="border-b bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                        <Tag className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Tags sản phẩm</CardTitle>
                        <p className="text-sm text-muted-foreground">Thêm từ khóa để dễ tìm kiếm</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        placeholder="Nhập tag và nhấn Enter..."
                        className="border-border"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addTag}
                        className="px-4"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {productTags.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {productTags.map((tag, index) => (
                            <motion.div
                              key={tag}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Badge 
                                variant="secondary" 
                                className="gap-1 px-3 py-1.5 bg-muted hover:bg-muted/80 transition-colors"
                              >
                                {tag}
                                <X
                                  className="w-3 h-3 cursor-pointer hover:text-red-500"
                                  onClick={() => removeTag(tag)}
                                />
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {productTags.length} tag(s) đã thêm
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Settings */}
          {currentStep === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                {/* Release Settings */}
                <Card className="border shadow-sm">
                  <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-red-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                          Cài đặt phát hành
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">Thiết lập thời gian xuất bản sản phẩm</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <Label htmlFor="is_live" className="font-medium">Phát hành ngay lập tức</Label>
                          <p className="text-sm text-muted-foreground">Sản phẩm sẽ hiển thị ngay sau khi lưu</p>
                        </div>
                      </div>
                      <Switch
                        id="is_live"
                        checked={formData.is_live}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_live: checked })}
                      />
                    </div>

                    {!formData.is_live && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="release_date" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Ngày phát hành
                        </Label>
                        <Input
                          id="release_date"
                          type="datetime-local"
                          value={formData.release_date}
                          onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                          className="border-border focus:border-primary"
                        />
                        <p className="text-xs text-muted-foreground">
                          Sản phẩm sẽ được phát hành tự động vào thời gian đã chọn
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                {/* Product Images */}
                <Card className="border shadow-sm">
                  <CardHeader className="border-b bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                        <ImageIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Hình ảnh sản phẩm</CardTitle>
                        <p className="text-sm text-muted-foreground">Xem và quản lý hình ảnh hiện tại</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {product.images.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {product.images.map((img, index) => (
                          <motion.div 
                            key={index} 
                            className="relative aspect-square group"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <img
                              src={img}
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover rounded-xl border-2 border-border group-hover:border-primary transition-colors shadow-sm"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl" />
                            {index === 0 && (
                              <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                                Chính
                              </Badge>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Chưa có hình ảnh nào</p>
                      </div>
                    )}
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Lưu ý về hình ảnh</p>
                          <p className="text-sm text-yellow-700 mt-1">
                            Để thay đổi hình ảnh sản phẩm, bạn cần tạo sản phẩm mới hoặc liên hệ bộ phận hỗ trợ.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation & Save */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-between items-center pt-6 border-t"
        >
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/vendor-management/product-management")}
              disabled={saving}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Hủy bỏ
            </Button>
          </div>

          <div className="flex gap-3">
            {/* Step navigation */}
            <div className="hidden sm:flex gap-2">
              {steps.map((step, index) => {
                const currentIndex = steps.findIndex(s => s.id === currentStep);
                const stepIndex = index;
                
                return (
                  <Button
                    key={step.id}
                    type="button"
                    variant={stepIndex < currentIndex ? "default" : stepIndex === currentIndex ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentStep(step.id)}
                    disabled={saving}
                    className={stepIndex <= currentIndex ? "bg-primary" : ""}
                  >
                    {stepIndex < currentIndex ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                  </Button>
                );
              })}
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:opacity-90 gap-2 min-w-[140px]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </form>
    </div>
  );
}