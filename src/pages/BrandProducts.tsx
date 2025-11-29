import { motion, useScroll, useTransform } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MapPin, 
  Users, 
  Award, 
  Star, 
  ArrowLeft, 
  Filter, 
  ShoppingCart, 
  Share2, 
  Sparkles, 
  TrendingUp,
  Package,
  Calendar,
  CheckCircle2,
  Grid3x3,
  List,
  Eye
} from "lucide-react";
import { useState, useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const BrandProducts = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFollowing, setIsFollowing] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Unified gradient - Primary purple theme
  const brandGradient = "from-primary via-purple-600 to-primary";

  // Mock brand data - All using primary gradient
  const brands = {
    "1": {
      id: 1,
      name: "Canifa",
      category: "Thời trang",
      description: "Thương hiệu thời trang Việt Nam với 20 năm kinh nghiệm, mang đến những sản phẩm chất lượng cao với giá cả phải chăng.",
      coverImage: "/placeholder.svg",
      logo: "/placeholder.svg",
      location: "Hà Nội",
      followers: 125000,
      products: 1500,
      rating: 4.8,
      established: "2001",
      verified: true,
    },
    "2": {
      id: 2,
      name: "Biti's",
      category: "Giày dép",
      description: "Thương hiệu giày Việt Nam hàng đầu, tiên phong trong việc ứng dụng công nghệ vào sản xuất giày thể thao.",
      coverImage: "/placeholder.svg",
      logo: "/placeholder.svg",
      location: "TP.HCM",
      followers: 98000,
      products: 850,
      rating: 4.7,
      established: "1982",
      verified: true,
    },
    "3": {
      id: 3,
      name: "Saigon Skirt",
      category: "Thời trang nữ",
      description: "Thương hiệu váy áo nữ hiện đại, kết hợp giữa phong cách truyền thống và xu hướng thế giới.",
      coverImage: "/placeholder.svg",
      logo: "/placeholder.svg",
      location: "TP.HCM",
      followers: 45000,
      products: 320,
      rating: 4.9,
      established: "2015",
      verified: false,
    },
    "4": {
      id: 4,
      name: "Cầu Tre Việt",
      category: "Thủ công mỹ nghệ",
      description: "Chuyên sản xuất các sản phẩm thủ công từ tre nứa, thân thiện với môi trường và mang đậm bản sắc Việt.",
      coverImage: "/placeholder.svg",
      logo: "/placeholder.svg",
      location: "Hưng Yên",
      followers: 23000,
      products: 180,
      rating: 4.6,
      established: "2018",
      verified: false,
    },
  };

  const brand = brands[brandId as keyof typeof brands];

  // ...existing products data...
  const allProducts = {
    "1": [
      { id: 101, name: "Áo sơ mi Premium", category: "Áo", price: 299000, image: "/placeholder.svg", rating: 4.8, sold: 1250, discount: 20, inStock: true },
      { id: 102, name: "Quần jean slim fit", category: "Quần", price: 450000, image: "/placeholder.svg", rating: 4.7, sold: 890, discount: 0, inStock: true },
      { id: 103, name: "Áo thun cotton basic", category: "Áo", price: 199000, image: "/placeholder.svg", rating: 4.9, sold: 2100, discount: 15, inStock: true },
      { id: 104, name: "Áo khoác hoodie", category: "Áo khoác", price: 550000, image: "/placeholder.svg", rating: 4.6, sold: 560, discount: 0, inStock: true },
      { id: 105, name: "Quần jogger", category: "Quần", price: 399000, image: "/placeholder.svg", rating: 4.8, sold: 780, discount: 10, inStock: false },
      { id: 106, name: "Áo polo nam", category: "Áo", price: 349000, image: "/placeholder.svg", rating: 4.7, sold: 920, discount: 0, inStock: true },
      { id: 107, name: "Quần short kaki", category: "Quần", price: 279000, image: "/placeholder.svg", rating: 4.5, sold: 670, discount: 25, inStock: true },
      { id: 108, name: "Áo cardigan", category: "Áo khoác", price: 489000, image: "/placeholder.svg", rating: 4.9, sold: 430, discount: 0, inStock: true },
    ],
    "2": [
      { id: 201, name: "Giày thể thao Hunter", category: "Giày thể thao", price: 850000, image: "/placeholder.svg", rating: 4.9, sold: 890, discount: 0, inStock: true },
      { id: 202, name: "Dép sandal quai ngang", category: "Dép", price: 320000, image: "/placeholder.svg", rating: 4.6, sold: 1200, discount: 15, inStock: true },
      { id: 203, name: "Giày cao gót nữ", category: "Giày cao gót", price: 650000, image: "/placeholder.svg", rating: 4.8, sold: 540, discount: 0, inStock: true },
      { id: 204, name: "Giày lười nam", category: "Giày lười", price: 590000, image: "/placeholder.svg", rating: 4.7, sold: 720, discount: 20, inStock: true },
      { id: 205, name: "Giày chạy bộ", category: "Giày thể thao", price: 920000, image: "/placeholder.svg", rating: 4.9, sold: 680, discount: 0, inStock: true },
      { id: 206, name: "Dép xỏ ngón", category: "Dép", price: 280000, image: "/placeholder.svg", rating: 4.5, sold: 950, discount: 10, inStock: true },
    ],
    "3": [
      { id: 301, name: "Váy midi hoa nhí", category: "Váy", price: 450000, image: "/placeholder.svg", rating: 4.9, sold: 567, discount: 0, inStock: true },
      { id: 302, name: "Áo croptop trắng", category: "Áo", price: 250000, image: "/placeholder.svg", rating: 4.7, sold: 830, discount: 15, inStock: true },
      { id: 303, name: "Váy maxi dự tiệc", category: "Váy", price: 680000, image: "/placeholder.svg", rating: 4.8, sold: 340, discount: 0, inStock: true },
      { id: 304, name: "Set áo váy công sở", category: "Set đồ", price: 790000, image: "/placeholder.svg", rating: 4.9, sold: 420, discount: 20, inStock: true },
      { id: 305, name: "Chân váy xếp ly", category: "Váy", price: 380000, image: "/placeholder.svg", rating: 4.6, sold: 610, discount: 0, inStock: true },
    ],
    "4": [
      { id: 401, name: "Giỏ tre đan tay", category: "Giỏ", price: 180000, image: "/placeholder.svg", rating: 4.8, sold: 320, discount: 0, inStock: true },
      { id: 402, name: "Khay tre decor", category: "Khay", price: 120000, image: "/placeholder.svg", rating: 4.7, sold: 450, discount: 10, inStock: true },
      { id: 403, name: "Lồng đèn tre", category: "Đèn", price: 350000, image: "/placeholder.svg", rating: 4.9, sold: 280, discount: 0, inStock: true },
      { id: 404, name: "Rổ tre mini", category: "Giỏ", price: 95000, image: "/placeholder.svg", rating: 4.6, sold: 670, discount: 15, inStock: true },
      { id: 405, name: "Bộ đũa tre cao cấp", category: "Đồ dùng", price: 150000, image: "/placeholder.svg", rating: 4.8, sold: 540, discount: 0, inStock: true },
    ],
  };

  const products = allProducts[brandId as keyof typeof allProducts] || [];
  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products
    .filter(p => selectedCategory === "all" || p.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === "popular") return b.sold - a.sold;
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const handleAddToCart = (product: any) => {
    const finalPrice = product.discount > 0 
      ? product.price * (1 - product.discount / 100) 
      : product.price;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: finalPrice.toLocaleString(),
      image: product.image,
      quantity: 1,
    });
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? "Đã bỏ theo dõi" : "Đã theo dõi thương hiệu");
  };

  if (!brand) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Không tìm thấy thương hiệu</h1>
          <Button onClick={() => navigate("/local-brand")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background - Unified Primary Gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${brandGradient} opacity-10 blur-3xl`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/local-brand")}
              className="gap-2 hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
          </motion.div>

          {/* Enhanced Brand Header */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl shadow-2xl">
              {/* Cover Image with Parallax */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <motion.img
                  src={brand.coverImage}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                  style={{ y: headerY }}
                />
                {/* Gradient Overlays - Primary Theme */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className={`absolute inset-0 bg-gradient-to-br ${brandGradient} opacity-30 mix-blend-overlay`} />
                
                {/* Verified Badge - Top Right */}
                {brand.verified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute top-6 right-6"
                  >
                    <Badge className={`bg-gradient-to-r ${brandGradient} text-white border-0 shadow-lg gap-2 px-4 py-2`}>
                      <Award className="w-4 h-4" />
                      Xác thực
                    </Badge>
                  </motion.div>
                )}
              </div>

              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Logo */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="relative -mt-20 md:-mt-24"
                  >
                    <div className={`absolute -inset-2 bg-gradient-to-r ${brandGradient} opacity-30 blur-xl rounded-full`} />
                    <Avatar className="relative w-32 h-32 md:w-40 md:h-40 border-8 border-card shadow-2xl">
                      <AvatarImage src={brand.logo} alt={brand.name} />
                      <AvatarFallback className={`text-4xl font-bold text-white bg-gradient-to-br ${brandGradient}`}>
                        {brand.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>

                  {/* Brand Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          {brand.name}
                        </h1>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {brand.category}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground leading-relaxed max-w-3xl">
                      {brand.description}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { icon: Users, label: "Người theo dõi", value: brand.followers.toLocaleString(), color: "text-primary" },
                        { icon: Package, label: "Sản phẩm", value: brand.products.toLocaleString(), color: "text-primary" },
                        { icon: Star, label: "Đánh giá", value: brand.rating + "/5", color: "text-primary" },
                        { icon: Calendar, label: "Thành lập", value: brand.established, color: "text-primary" },
                      ].map((stat, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                          className="p-4 rounded-xl bg-gradient-to-br from-background/50 to-card/30 border border-border/50 backdrop-blur-sm"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            <span className="text-xs text-muted-foreground">{stat.label}</span>
                          </div>
                          <div className="text-xl font-bold">{stat.value}</div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button
                        size="lg"
                        className={`gap-2 ${isFollowing ? 'bg-muted hover:bg-muted/80' : `bg-gradient-to-r ${brandGradient} hover:opacity-90`}`}
                        onClick={handleFollow}
                      >
                        {isFollowing ? (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            Đang theo dõi
                          </>
                        ) : (
                          <>
                            <Heart className="w-5 h-5" />
                            Theo dõi
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="lg" className="gap-2">
                        <Share2 className="w-5 h-5" />
                        Chia sẻ
                      </Button>
                      <Button variant="outline" size="lg" className="gap-2">
                        <MapPin className="w-5 h-5" />
                        {brand.location}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                  {/* Category Pills */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Danh mục</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <motion.div
                          key={cat}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant={selectedCategory === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(cat)}
                            className={selectedCategory === cat ? `bg-gradient-to-r ${brandGradient}` : ''}
                          >
                            {cat === "all" ? "Tất cả" : cat}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Sort & View Controls */}
                  <div className="flex items-center gap-3">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 rounded-lg border border-input bg-background/50 backdrop-blur-sm text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="popular">🔥 Phổ biến nhất</option>
                      <option value="price-asc">💰 Giá thấp → cao</option>
                      <option value="price-desc">💎 Giá cao → thấp</option>
                      <option value="rating">⭐ Đánh giá cao</option>
                    </select>

                    <div className="flex gap-1 p-1 rounded-lg bg-muted">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setViewMode("grid")}
                        className="h-8 w-8"
                      >
                        <Grid3x3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setViewMode("list")}
                        className="h-8 w-8"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Hiển thị {filteredProducts.length} sản phẩm</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>{products.reduce((sum, p) => sum + p.sold, 0).toLocaleString()} sản phẩm đã bán</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Products Grid */}
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
              >
                <Card className="group relative overflow-hidden border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full flex flex-col">
                  <div className="relative overflow-hidden">
                    <div className="aspect-square relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      <div className={`absolute inset-0 bg-gradient-to-t ${brandGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <Button
                          size="sm"
                          variant="secondary"
                          className="gap-2 backdrop-blur-md bg-background/80"
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                          Xem nhanh
                        </Button>
                      </motion.div>
                    </div>

                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.discount > 0 && (
                        <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg">
                          -{product.discount}%
                        </Badge>
                      )}
                      {!product.inStock && (
                        <Badge variant="secondary" className="backdrop-blur-md bg-background/80">
                          Hết hàng
                        </Badge>
                      )}
                      {product.sold > 1000 && (
                        <Badge className={`bg-gradient-to-r ${brandGradient} text-white border-0`}>
                          <Sparkles className="w-3 h-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-3 right-3"
                    >
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full backdrop-blur-md bg-background/80 hover:bg-primary hover:text-primary-foreground"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>

                  <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                    <div className="flex-1 space-y-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                      <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{product.rating}</span>
                      </div>
                      <div className="text-muted-foreground">
                        Đã bán {product.sold}
                      </div>
                    </div>

                    <div className="space-y-1">
                      {product.discount > 0 ? (
                        <div className="flex items-baseline gap-2">
                          <span className={`text-2xl font-bold bg-gradient-to-r ${brandGradient} bg-clip-text text-transparent`}>
                            {(product.price * (1 - product.discount / 100)).toLocaleString()}đ
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {product.price.toLocaleString()}đ
                          </span>
                        </div>
                      ) : (
                        <span className={`text-2xl font-bold bg-gradient-to-r ${brandGradient} bg-clip-text text-transparent`}>
                          {product.price.toLocaleString()}đ
                        </span>
                      )}
                    </div>

                    <Button
                      className={`w-full gap-2 ${product.inStock ? `bg-gradient-to-r ${brandGradient} hover:opacity-90` : ''}`}
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {product.inStock ? "Thêm vào giỏ" : "Hết hàng"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <Card className="max-w-md mx-auto border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm">
                <CardContent className="p-12">
                  <Package className="w-20 h-20 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h3>
                  <p className="text-muted-foreground mb-6">Thử chọn danh mục khác hoặc điều chỉnh bộ lọc</p>
                  <Button onClick={() => setSelectedCategory("all")}>
                    Xem tất cả sản phẩm
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default BrandProducts;