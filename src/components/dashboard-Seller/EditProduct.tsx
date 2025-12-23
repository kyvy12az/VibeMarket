import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  Loader2,
  Package,
  Image as ImageIcon,
  Plus,
  Edit3,
  DollarSign,
  Settings,
  Palette,
  Sparkles,
  Info,
  Check,
  TrendingUp,
  Zap
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

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative border-b border-border/40 bg-background/50 backdrop-blur-xl"
        >
          {/* Hiệu ứng ánh sáng nền mờ (Ambient Glow) */}
          <div className="absolute top-0 right-1/4 w-64 h-32 bg-orange-500/10 blur-[100px] -z-10" />
          <div className="absolute top-0 left-1/4 w-64 h-32 bg-pink-500/10 blur-[100px] -z-10" />

          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 p-8 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Nút Back - Thiết kế tối giản */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/vendor-management/product-management")}
                className="h-12 w-12 rounded-2xl bg-background shadow-sm border border-border/50 hover:bg-muted transition-all active:scale-90"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </Button>

              <div className="flex gap-5">
                {/* Icon chính với hiệu ứng Layered Gradient */}
                <div className="relative shrink-0">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-500 blur-md opacity-40 rounded-2xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <div className="relative p-4 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 shadow-xl shadow-orange-500/20 ring-1 ring-white/20">
                    <Edit3 className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Tiêu đề & Breadcrumb nội bộ */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md">
                      Editor Mode
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      ID: {product.id}
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground italic italic-no">
                    Chỉnh sửa <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">Sản phẩm</span>
                  </h1>

                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-muted-foreground">
                      Đang chỉnh sửa: <span className="text-foreground font-bold">{product.name}</span>
                    </p>
                    <div className="h-1 w-1 rounded-full bg-border" />
                    <p className="text-xs text-muted-foreground italic">Cập nhật lần cuối: 2 giờ trước</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Stats - Thiết kế Bento Box mini */}
            <div className="flex flex-wrap items-center gap-4">
              {[
                { label: "Tồn kho", value: product.current_stock, icon: Package, color: "text-blue-500" },
                { label: "Đã bán", value: product.sold, icon: TrendingUp, color: "text-emerald-500" },
                { label: "Giá hiện tại", value: `${product.price.toLocaleString()}₫`, icon: DollarSign, color: "text-orange-500", highlight: true }
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`min-w-[140px] p-4 rounded-2xl border border-border/50 bg-background/50 shadow-sm transition-all hover:border-primary/20 group`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <div className={`text-lg font-black tracking-tight ${stat.highlight ? 'text-primary' : 'text-foreground'}`}>
                    {stat.value}
                  </div>
                  {/* Một thanh progress nhỏ tinh tế phía dưới mỗi card */}
                  <div className="mt-2 h-0.5 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "60%" }}
                      className={`h-full ${stat.color.replace('text', 'bg')}`}
                    />
                  </div>
                </div>
              ))}

              {/* Nút Action nhanh ngay tại Header */}
              <div className="ml-2 pl-4 border-l border-border h-12 flex items-center">
                <Button className="rounded-xl bg-foreground text-background font-bold px-6 shadow-lg shadow-foreground/10 hover:opacity-90 active:scale-95 transition-all">
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto pb-20 space-y-12">
        {/* 1. Thanh Tiến trình (Progress Steps) - Thiết kế kiểu Floating Dock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-6 z-50 flex justify-center"
        >
          <div className="flex items-center gap-1 p-1.5 bg-background/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] ring-1 ring-black/5">
            {steps.map((step) => {
              const isActive = currentStep === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-500 group`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-foreground rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <step.icon className={`relative z-10 w-4 h-4 transition-colors duration-300 ${isActive ? 'text-background' : 'text-muted-foreground group-hover:text-foreground'}`} />
                  <span className={`relative z-10 text-sm font-bold tracking-tight transition-colors duration-300 hidden sm:block ${isActive ? 'text-background' : 'text-muted-foreground group-hover:text-foreground'}`}>
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* 2. Nội dung chính - Sử dụng Bento Grid nhẹ nhàng */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >

            {/* CỘT TRÁI: FORM CHÍNH (8 COLUMNS) */}
            <div className="lg:col-span-8 space-y-8">
              {currentStep === "basic" && (
                <Card className="bg-background shadow-none space-y-8 p-6">
                  <section className="space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="h-8 w-1 bg-primary rounded-full" />
                      <h2 className="text-2xl font-black tracking-tight">Thông tin định danh</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[11px] uppercase tracking-[0.2em] font-black text-muted-foreground ml-1">Tên sản phẩm</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="h-14 px-6 rounded-2xl border-border/50 bg-background shadow-sm focus:ring-4 focus:ring-primary/5 transition-all text-lg font-medium"
                          placeholder="Ví dụ: Áo Hoodie Oversize Premium"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] uppercase tracking-[0.2em] font-black text-muted-foreground ml-1">Thương hiệu</Label>
                        <Input
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          className="h-14 px-6 rounded-2xl border-border/50 bg-background shadow-sm focus:ring-4 focus:ring-primary/5 transition-all text-lg font-medium"
                          placeholder="Nhãn hiệu của bạn"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[11px] uppercase tracking-[0.2em] font-black text-muted-foreground ml-1">Mô tả chi tiết</Label>
                      <div className="relative group">
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="min-h-[250px] p-6 rounded-3xl border-border/50 bg-background shadow-sm focus:ring-4 focus:ring-primary/5 transition-all resize-none text-base leading-relaxed"
                          placeholder="Kể câu chuyện về sản phẩm của bạn..."
                        />
                        <div className="absolute bottom-4 right-4 text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                          {formData.description.length} ký tự
                        </div>
                      </div>
                    </div>
                  </section>
                </Card>
              )}

              {currentStep === "pricing" && (
                <div className="space-y-8">
                  {/* Pricing Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { id: 'price', label: 'Giá bán niêm yết', icon: DollarSign, color: 'text-primary' },
                      { id: 'original_price', label: 'Giá vốn nhập kho', icon: Info, color: 'text-muted-foreground' },
                      { id: 'discount', label: 'Chiết khấu (%)', icon: Sparkles, color: 'text-orange-500' }
                    ].map((item) => (
                      <div key={item.id} className="p-6 rounded-3xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-all">
                        <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground flex items-center gap-2 mb-4">
                          <item.icon className={`w-3 h-3 ${item.color}`} /> {item.label}
                        </Label>
                        <div className="relative">
                          <Input
                            type="number"
                            value={formData[item.id]}
                            onChange={(e) => setFormData({ ...formData, [item.id]: parseInt(e.target.value) })}
                            className="border-none p-0 h-auto text-3xl font-black focus-visible:ring-0 bg-transparent"
                          />
                          <span className="absolute right-0 bottom-1 text-xs font-bold text-muted-foreground">
                            {item.id === 'discount' ? '%' : 'VNĐ'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Flash Sale Banner - Premium Red Design */}
                  <div className={`overflow-hidden rounded-3xl border transition-all duration-500 ${formData.flash_sale ? 'border-red-500/50 bg-red-50/50' : 'border-border bg-muted/20 opacity-60'}`}>
                    <div className="p-8 flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-2xl transition-colors ${formData.flash_sale ? 'bg-red-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                          <Zap className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                          <h3 className="font-black text-xl tracking-tight">Chiến dịch Flash Sale</h3>
                          <p className="text-sm text-muted-foreground">Đẩy mạnh doanh số bằng cách giảm giá trong thời gian ngắn</p>
                        </div>
                      </div>
                      <Switch
                        checked={formData.flash_sale}
                        onCheckedChange={(v) => setFormData({ ...formData, flash_sale: v })}
                        className="data-[state=checked]:bg-red-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "variants" && (
                <div className="space-y-8">
                  <Card className="p-8 rounded-[2rem] border-border/50 bg-background shadow-sm">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                      <Palette className="w-5 h-5 text-primary" /> Phân loại màu sắc
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => toggleColor(color)}
                          className={`group relative flex items-center gap-3 pl-2 pr-5 py-2 rounded-full border-2 transition-all ${selectedColors.includes(color)
                              ? 'border-foreground bg-foreground text-background scale-105 shadow-lg shadow-black/10'
                              : 'border-border hover:border-muted-foreground'
                            }`}
                        >
                          <div
                            className="w-6 h-6 rounded-full border border-white/20"
                            style={{ backgroundColor: colorMap[color] }}
                          />
                          <span className="text-sm font-bold">{color}</span>
                          {selectedColors.includes(color) && <Check className="w-3 h-3" />}
                        </button>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </div>

            {/* CỘT PHẢI: WIDGETS & PREVIEW (4 COLUMNS) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Hình ảnh sản phẩm - Thiết kế lưới Masonry mini */}
              <div className="p-6 rounded-[2rem] bg-background border border-border/50 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black tracking-tight">Thư viện ảnh</h3>
                  <Button variant="ghost" size="sm" className="text-primary font-bold text-xs uppercase tracking-tighter">
                    Quản lý
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {product.images.map((img, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-2 ${i === 0 ? 'border-primary ring-4 ring-primary/10' : 'border-transparent'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="preview" />
                      {i === 0 && <span className="absolute top-2 left-2 bg-primary text-[10px] font-black text-white px-2 py-1 rounded-lg uppercase">Cover</span>}
                    </motion.div>
                  ))}
                  <button type="button" className="aspect-[3/4] rounded-2xl border-2 border-dashed border-muted hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2">
                    <Plus className="w-6 h-6 text-muted-foreground" />
                    <span className="text-[10px] font-black uppercase text-muted-foreground">Thêm ảnh</span>
                  </button>
                </div>
              </div>

              {/* Trạng thái & Danh mục */}
              <div className="p-8 rounded-[2rem] bg-muted/30 border border-border/50 space-y-6">
                <div className="space-y-3">
                  <Label className="text-[11px] uppercase tracking-widest font-black text-muted-foreground">Danh mục sản phẩm</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger className="h-12 rounded-xl bg-background border-none shadow-sm font-bold">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                      {categories.map(cat => <SelectItem key={cat} value={cat} className="font-medium">{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-6 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-black text-sm">Hiển thị sản phẩm</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Active on storefront</p>
                    </div>
                    <Switch checked={formData.status === 'active'} onCheckedChange={(v) => setFormData({ ...formData, status: v ? 'active' : 'inactive' })} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </form>
    </div>
  );
}