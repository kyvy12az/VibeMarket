import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  MapPin, 
  Users, 
  Award, 
  Star, 
  ExternalLink,
  TrendingUp,
  ShoppingBag,
  Search,
  Filter,
  Package,
  Clock,
  CheckCircle,
  Sparkles,
  Globe,
  Phone,
  Mail,
  Store,
  ArrowRight,
  Eye,
  Share2,
  Verified
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const LocalBrand = () => {
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState("all");

  const featuredBrands = [
    {
      id: 1,
      name: "Canifa",
      category: "Thời trang",
      description: "Thương hiệu thời trang Việt Nam với 20 năm kinh nghiệm, mang đến những sản phẩm chất lượng cao với giá cả phải chăng.",
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=400&fit=crop",
      logo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
      location: "Hà Nội",
      followers: 125000,
      products: 1500,
      rating: 4.8,
      established: "2001",
      verified: true,
      gradient: "from-blue-500 to-cyan-500",
      phone: "1900 1234",
      email: "contact@canifa.vn",
      website: "canifa.vn"
    },
    {
      id: 2,
      name: "Biti's",
      category: "Giày dép",
      description: "Thương hiệu giày Việt Nam hàng đầu, tiên phong trong việc ứng dụng công nghệ vào sản xuất giày thể thao.",
      image: "https://laforce.vn/wp-content/uploads/2024/03/local-brand-giay-viet-nam.jpg",
      logo: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=100&h=100&fit=crop",
      location: "TP.HCM",
      followers: 98000,
      products: 850,
      rating: 4.7,
      established: "1982",
      verified: true,
      gradient: "from-orange-500 to-red-500",
      phone: "1900 5678",
      email: "info@bitis.vn",
      website: "bitis.vn"
    },
    {
      id: 3,
      name: "Saigon Skirt",
      category: "Thời trang nữ",
      description: "Thương hiệu váy áo nữ hiện đại, kết hợp giữa phong cách truyền thống và xu hướng thế giới.",
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=400&fit=crop",
      logo: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop",
      location: "TP.HCM",
      followers: 45000,
      products: 320,
      rating: 4.9,
      established: "2015",
      verified: true,
      gradient: "from-pink-500 to-rose-500",
      phone: "0909 123 456",
      email: "hello@saigonskit.vn",
      website: "saigonskit.vn"
    },
    {
      id: 4,
      name: "Cầu Tre Việt",
      category: "Thủ công mỹ nghệ",
      description: "Chuyên sản xuất các sản phẩm thủ công từ tre nứa, thân thiện với môi trường và mang đậm bản sắc Việt.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop",
      logo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop",
      location: "Hưng Yên",
      followers: 23000,
      products: 180,
      rating: 4.6,
      established: "2018",
      verified: false,
      gradient: "from-green-500 to-emerald-500",
      phone: "0912 345 678",
      email: "contact@cautreviet.vn",
      website: "cautreviet.vn"
    },
  ];

  const categories = [
    { name: "Tất cả", count: 714, color: "from-slate-500 to-slate-600", icon: Store, value: "all" },
    { name: "Thời trang", count: 156, color: "from-blue-500 to-cyan-500", icon: ShoppingBag, value: "fashion" },
    { name: "Mỹ phẩm", count: 89, color: "from-pink-500 to-rose-500", icon: Sparkles, value: "beauty" },
    { name: "Ẩm thực", count: 234, color: "from-orange-500 to-red-500", icon: Package, value: "food" },
    { name: "Thủ công", count: 67, color: "from-purple-500 to-indigo-500", icon: Award, value: "craft" },
    { name: "Công nghệ", count: 45, color: "from-green-500 to-emerald-500", icon: TrendingUp, value: "tech" },
    { name: "Nông sản", count: 123, color: "from-yellow-500 to-orange-500", icon: Globe, value: "agriculture" },
  ];

  const topProducts = [
    {
      id: 1,
      name: "Áo sơ mi Canifa Premium",
      brand: "Canifa",
      price: 299000,
      originalPrice: 450000,
      image: "https://2885371169.e.cdneverest.net/pub/media/Simiconnector/Somi_desk2x.webp",
      rating: 4.8,
      sold: 1250,
      discount: 34,
      reviews: 856
    },
    {
      id: 2,
      name: "Giày thể thao Biti's Hunter",
      brand: "Biti's",
      price: 850000,
      originalPrice: 1200000,
      image: "https://file.hstatic.net/1000230642/collection/1920x750_bannerweb_hunter_effortless_ee530ac3a6c8448ba199233f03068946_master.png",
      rating: 4.9,
      sold: 890,
      discount: 29,
      reviews: 1234
    },
    {
      id: 3,
      name: "Váy midi Saigon Skirt",
      brand: "Saigon Skirt",
      price: 450000,
      originalPrice: 650000,
      image: "https://dallavn.com/cdn/shop/files/SHIRTS_4.png?v=1747989902&width=713",
      rating: 4.7,
      sold: 567,
      discount: 31,
      reviews: 432
    },
  ];

  const toggleWishlist = (id: number) => {
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const stats = [
    { label: "Thương hiệu", value: "500+", icon: Store, gradient: "from-blue-500 to-cyan-500" },
    { label: "Sản phẩm", value: "10K+", icon: Package, gradient: "from-purple-500 to-pink-500" },
    { label: "Khách hàng", value: "1M+", icon: Users, gradient: "from-green-500 to-emerald-500" },
    { label: "Đánh giá 5 sao", value: "98%", icon: Star, gradient: "from-yellow-500 to-orange-500" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Enhanced Header */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <div className="flex items-center justify-center gap-4">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center shadow-lg border border-border"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Award className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Local Brand Việt Nam
                </h1>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-primary" />
                </motion.div>
              </div>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                🇻🇳 Tự hào với những thương hiệu Việt chất lượng cao, mang đậm bản sắc dân tộc
              </p>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl mx-auto"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm thương hiệu, sản phẩm..."
                    className="pl-12 pr-12 h-14 rounded-2xl border-2 border-border focus:border-primary shadow-sm bg-card"
                  />
                  <Button 
                    size="icon" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                  >
                    <Filter className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
            >
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="border border-border shadow-sm hover:shadow-md transition-all duration-300 bg-card">
                    <CardContent className="p-6 text-center space-y-2">
                      <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-sm`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Enhanced Categories */}
          <section>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-foreground">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                Danh mục thương hiệu
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.value}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedCategory(category.value)}
                >
                  <Card className={`cursor-pointer border-2 transition-all duration-300 ${
                    selectedCategory === category.value 
                      ? 'border-primary shadow-lg bg-primary/5' 
                      : 'border-border hover:border-primary/50 hover:shadow-md'
                  } bg-card`}>
                    <CardContent className="p-6 text-center space-y-3">
                      <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center shadow-sm`}>
                        <category.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-bold text-base text-foreground">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.count} thương hiệu
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Enhanced Featured Brands */}
          <section>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between mb-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-foreground">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                Thương hiệu nổi bật
              </h2>
              <Button variant="outline" className="hidden md:flex items-center gap-2 border-border">
                Xem tất cả
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {featuredBrands.map((brand, index) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Card className="overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 bg-card">
                    {/* Brand Cover */}
                    <div className="relative h-56 overflow-hidden bg-muted">
                      <motion.img
                        src={brand.image}
                        alt={brand.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${brand.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                      
                      {/* Logo */}
                      <motion.div
                        className="absolute bottom-4 left-4"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="w-20 h-20 rounded-2xl bg-background border-4 border-background shadow-lg overflow-hidden">
                          <img src={brand.logo} alt={`${brand.name} logo`} className="w-full h-full object-cover" />
                        </div>
                      </motion.div>

                      {/* Verified Badge */}
                      {brand.verified && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4"
                        >
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white gap-1.5 px-3 py-1.5 shadow-sm">
                            <CheckCircle className="w-4 h-4" />
                            Xác thực
                          </Badge>
                        </motion.div>
                      )}

                      {/* Quick Actions */}
                      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm shadow-sm border border-border flex items-center justify-center"
                          onClick={() => toggleWishlist(brand.id)}
                        >
                          <Heart className={`w-5 h-5 ${wishlist.has(brand.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm shadow-sm border border-border flex items-center justify-center"
                        >
                          <Share2 className="w-5 h-5 text-muted-foreground" />
                        </motion.button>
                      </div>
                    </div>
                    
                    <CardContent className="p-6 space-y-4">
                      {/* Brand Info */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-2xl font-bold mb-1 text-foreground">{brand.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {brand.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/20 px-3 py-1.5 rounded-full border border-border">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-sm text-foreground">{brand.rating}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {brand.description}
                      </p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { icon: MapPin, label: brand.location },
                          { icon: Users, label: `${(brand.followers / 1000).toFixed(0)}K followers` },
                          { icon: Package, label: `${brand.products} sản phẩm` },
                          { icon: Clock, label: `Từ ${brand.established}` }
                        ].map((stat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted border border-border">
                            <stat.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate text-foreground">{stat.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2 pt-2 border-t border-border">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Globe className="w-3.5 h-3.5" />
                          <span>{brand.website}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{brand.phone}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            variant="outline" 
                            className="w-full border-border"
                            asChild
                          >
                            <Link to={`/brand/${brand.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Xem shop
                            </Link>
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                          >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Mua ngay
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Enhanced Top Products */}
          <section>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between mb-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-foreground">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                Sản phẩm nổi bật từ Local Brand
              </h2>
              <Button variant="outline" className="hidden md:flex items-center gap-2 border-border">
                Xem tất cả
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {topProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Card className="overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 bg-card relative">
                    {/* Discount Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-base px-3 py-1.5 shadow-sm">
                        -{product.discount}%
                      </Badge>
                    </div>

                    {/* Wishlist */}
                    <motion.button
                      className="absolute top-3 left-3 z-10 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm shadow-sm border border-border flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleWishlist(product.id)}
                    >
                      <Heart className={`w-5 h-5 ${wishlist.has(product.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                    </motion.button>

                    {/* Product Image */}
                    <div className="relative h-64 bg-muted overflow-hidden">
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <CardContent className="p-5 space-y-3">
                      {/* Brand Badge */}
                      <Badge variant="secondary" className="text-xs">
                        {product.brand}
                      </Badge>

                      {/* Product Name */}
                      <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors text-foreground">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-foreground">{product.rating}</span>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviews})
                        </span>
                      </div>

                      {/* Prices */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            {product.price.toLocaleString()}₫
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {product.originalPrice.toLocaleString()}₫
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-muted-foreground">Đã bán {product.sold}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            variant="outline" 
                            className="w-full border-border"
                            asChild
                          >
                            <Link to={`/product/${product.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Xem
                            </Link>
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90">
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Mua
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Benefits Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border border-border shadow-sm bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground">Tại sao chọn Local Brand Việt Nam?</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      {[
                        "✓ Sản phẩm chất lượng cao, giá cả hợp lý",
                        "✓ Hỗ trợ phát triển kinh tế trong nước",
                        "✓ Mang đậm bản sắc văn hóa Việt Nam",
                        "✓ Cam kết chất lượng và bảo hành tốt",
                        "✓ Đa dạng mẫu mã, liên tục cập nhật",
                        "✓ Dịch vụ chăm sóc khách hàng tận tâm"
                      ].map((benefit, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + idx * 0.1 }}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
};

export default LocalBrand;