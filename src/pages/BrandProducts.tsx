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
  Eye,
  ShoppingBag,
  ChevronRight
} from "lucide-react";
import { useState, useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";

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
    <div className="min-h-screen bg-[#050505] text-foreground selection:bg-primary/30">
      {/* 1. Phông nền hiệu ứng Deep Blur */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Navigation & Breadcrumb */}
        <nav className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/local-brand")}
            className="group rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Trang chủ
          </Button>
          <div className="flex items-center text-sm text-muted-foreground">
            <ChevronRight className="w-4 h-4 mx-1" />
            <span>Thương hiệu</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-foreground font-medium">{brand.name}</span>
          </div>
        </nav>

        {/* 2. Hero Header Section - Thiết kế tạp chí */}
        <section ref={headerRef} className="relative mb-12">
          <motion.div style={{ y: headerY }}>
            <Card className="border-none bg-transparent overflow-visible shadow-none">
            {/* Cover Image Wrapper */}
            <div className="relative h-[350px] md:h-[450px] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/50">
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5 }}
                src={brand.coverImage}
                className="w-full h-full object-cover"
                alt="cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
              
              {/* Overlay Badge */}
              <div className="absolute top-8 right-8 flex gap-3">
                {brand.verified && (
                  <Badge className="bg-white/10 backdrop-blur-xl border-white/20 text-white px-4 py-2 rounded-full shadow-xl">
                    <Award className="w-4 h-4 mr-2 text-yellow-400" /> Premium Brand
                  </Badge>
                )}
              </div>
            </div>

            {/* Brand Identity Card - Floating */}
            <div className="relative px-6 md:px-12 -mt-32">
              <div className="flex flex-col md:flex-row items-end gap-8">
                {/* Logo with Glow */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="relative shrink-0"
                >
                  <div className={`absolute -inset-4 bg-gradient-to-tr ${brandGradient} opacity-40 blur-2xl rounded-full`} />
                  <Avatar className="w-40 h-40 md:w-52 md:h-52 border-[10px] border-[#050505] shadow-2xl rounded-[3rem]">
                    <AvatarImage src={brand.logo} className="object-cover" />
                    <AvatarFallback className="text-5xl bg-zinc-900">{brand.name[0]}</AvatarFallback>
                  </Avatar>
                </motion.div>

                {/* Info Text */}
                <div className="flex-1 pb-4">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
                        {brand.name.toUpperCase()}
                      </h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-zinc-400 font-medium uppercase tracking-widest text-xs">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" /> {brand.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" /> Est. {brand.established}
                      </span>
                      <Badge variant="outline" className="border-primary/50 text-primary rounded-full">
                        {brand.category}
                      </Badge>
                    </div>
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pb-4">
                  <Button 
                      size="lg"
                      onClick={handleFollow}
                    className={`rounded-full px-8 h-14 font-bold transition-all duration-500 ${
                      isFollowing 
                      ? 'bg-zinc-800 text-white hover:bg-zinc-700' 
                      : `bg-gradient-to-r ${brandGradient} text-white shadow-lg shadow-primary/25 hover:scale-105`
                    }`}
                  >
                    {isFollowing ? <CheckCircle2 className="mr-2" /> : <Heart className="mr-2" />}
                    {isFollowing ? 'Đã theo dõi' : 'Theo dõi'}
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full h-14 w-14 border-white/10 bg-white/5 backdrop-blur-md">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 py-8 border-y border-white/5">
                {[
                  { label: "Followers", value: brand.followers, icon: Users },
                  { label: "Products", value: brand.products, icon: Package },
                  { label: "Avg. Rating", value: `${brand.rating}/5`, icon: Star },
                  { label: "Total Sold", value: "12.4K+", icon: TrendingUp },
                ].map((stat, i) => (
                  <div key={i} className="text-center md:text-left group cursor-default">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1 group-hover:text-primary transition-colors">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
            </Card>
          </motion.div>
        </section>

        {/* 3. Filter Section - Sticky Glassmorphism */}
        <section className="sticky top-6 z-40 mb-12">
          <div className="p-4 rounded-3xl bg-zinc-900/50 backdrop-blur-2xl border border-white/5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
              <div className="flex items-center gap-2 pr-4 mr-4 border-r border-white/10">
                <Filter className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold uppercase tracking-tighter">Bộ lọc</span>
              </div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                    selectedCategory === cat 
                    ? `bg-gradient-to-r ${brandGradient} text-white` 
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                  }`}
                >
                  {cat === "all" ? "Tất cả" : cat}
                </button>
              ))}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between">
              <select 
                className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer text-zinc-400 hover:text-white transition-colors"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">PHỔ BIẾN NHẤT</option>
                <option value="newest">MỚI RA MẮT</option>
                <option value="price-asc">GIÁ: THẤP - CAO</option>
                <option value="price-desc">GIÁ: CAO - THẤP</option>
              </select>

              <div className="h-8 w-[1px] bg-white/10 mx-2 hidden md:block" />

              <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
                <Button 
                  variant={viewMode === "grid" ? "secondary" : "ghost"} 
                  size="icon" 
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 rounded-lg"
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "secondary" : "ghost"} 
                  size="icon" 
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 rounded-lg"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Products Grid - Premium Cards */}
        <div className={`grid gap-8 ${
          viewMode === "grid" 
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "grid-cols-1"
        }`}>
          <AnimatePresence mode='popLayout'>
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Card className="group relative bg-zinc-900/40 border-white/5 overflow-hidden rounded-[2rem] hover:bg-zinc-800/50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-white/10">
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Hover Actions Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] flex items-center justify-center gap-3">
                      <Button size="icon" variant="white" className="rounded-full hover:scale-110 transition-transform">
                        <Heart className="w-5 h-5 text-black" />
                      </Button>
                      <Button 
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="rounded-full bg-white text-black hover:bg-white/90 px-6 font-bold"
                      >
                        CHI TIẾT
                      </Button>
                    </div>

                    {/* Product Tags */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.discount > 0 && (
                        <div className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                          -{product.discount}%
                        </div>
                      )}
                      {product.isNew && (
                        <div className="bg-white text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                          NEW DROP
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <p className="text-[10px] text-primary font-bold tracking-[0.2em] uppercase mb-1">{product.category}</p>
                      <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-primary transition-colors italic">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        {product.discount > 0 && (
                          <span className="text-xs text-zinc-500 line-through">
                            {product.price.toLocaleString()}đ
                          </span>
                        )}
                        <span className="text-xl font-black text-white tracking-tighter">
                          {(product.price * (1 - product.discount/100)).toLocaleString()}đ
                        </span>
                      </div>
                      
                      <Button 
                        size="icon" 
                        className={`rounded-2xl w-12 h-12 bg-zinc-800 border border-white/10 hover:bg-primary group/btn`}
                      >
                        <ShoppingBag className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                      </Button>
                    </div>

                    {/* Stats mini */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5 text-[10px] font-bold text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {product.rating}
                      </span>
                      <span>ĐÃ BÁN {product.sold}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="py-40 text-center">
            <div className="inline-flex p-10 rounded-[3rem] bg-zinc-900/50 border border-white/5 mb-6">
              <ShoppingBag className="w-20 h-20 text-zinc-700" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Chưa có sản phẩm nào</h3>
            <p className="text-zinc-500 max-w-xs mx-auto">Thương hiệu hiện chưa đăng tải sản phẩm trong danh mục này.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BrandProducts;