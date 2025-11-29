import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Gift, 
  Star, 
  ShoppingBag, 
  Coffee, 
  Smartphone,
  Ticket,
  TrendingUp,
  Clock,
  CheckCircle2,
  Sparkles,
  Zap,
  Package,
  Crown,
  Flame,
  Award,
  Filter,
  Grid3x3,
  List,
  Search,
  SlidersHorizontal,
  X
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const RewardsRedemption = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userPoints] = useState(2580);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("trending");
  const headerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const categories = [
    { id: "all", name: "Tất cả", icon: Gift, color: "from-purple-500 to-pink-500" },
    { id: "voucher", name: "Voucher", icon: Ticket, color: "from-purple-500 to-pink-500" },
    { id: "product", name: "Sản phẩm", icon: ShoppingBag, color: "from-purple-500 to-pink-500" },
    { id: "service", name: "Dịch vụ", icon: Coffee, color: "from-purple-500 to-pink-500" },
    { id: "tech", name: "Công nghệ", icon: Smartphone, color: "from-purple-500 to-pink-500" },
  ];

  const rewards = [
    {
      id: 1,
      name: "Voucher Giảm 100K",
      description: "Áp dụng cho đơn hàng từ 500K",
      points: 500,
      image: "/placeholder.svg",
      category: "voucher",
      stock: 50,
      trending: true,
      discount: "100.000đ",
      expiry: "30 ngày",
      type: "Mã giảm giá",
      popularity: 98
    },
    {
      id: 2,
      name: "Voucher Giảm 50K",
      description: "Áp dụng cho đơn hàng từ 200K",
      points: 250,
      image: "/placeholder.svg",
      category: "voucher",
      stock: 100,
      trending: true,
      discount: "50.000đ",
      expiry: "30 ngày",
      type: "Mã giảm giá",
      popularity: 95
    },
    {
      id: 3,
      name: "Tai nghe Bluetooth",
      description: "Tai nghe không dây chất lượng cao",
      points: 1200,
      image: "/placeholder.svg",
      category: "tech",
      stock: 20,
      trending: true,
      originalPrice: "899.000đ",
      type: "Điện tử",
      popularity: 92
    },
    {
      id: 4,
      name: "Balo thời trang",
      description: "Balo canvas phong cách Hàn Quốc",
      points: 800,
      image: "/placeholder.svg",
      category: "product",
      stock: 35,
      trending: false,
      originalPrice: "599.000đ",
      type: "Thời trang",
      popularity: 78
    },
    {
      id: 5,
      name: "Free Ship 30K",
      description: "Miễn phí vận chuyển cho mọi đơn hàng",
      points: 150,
      image: "/placeholder.svg",
      category: "service",
      stock: 200,
      trending: true,
      discount: "30.000đ",
      expiry: "15 ngày",
      type: "Dịch vụ",
      popularity: 88
    },
    {
      id: 6,
      name: "Cà phê miễn phí",
      description: "1 ly cà phê bất kỳ tại Highland Coffee",
      points: 300,
      image: "/placeholder.svg",
      category: "service",
      stock: 80,
      trending: false,
      discount: "Miễn phí",
      expiry: "30 ngày",
      type: "F&B",
      popularity: 75
    },
    {
      id: 7,
      name: "Chuột không dây",
      description: "Chuột wireless cao cấp, pin 12 tháng",
      points: 600,
      image: "/placeholder.svg",
      category: "tech",
      stock: 25,
      trending: false,
      originalPrice: "449.000đ",
      type: "Điện tử",
      popularity: 70
    },
    {
      id: 8,
      name: "Áo thun Premium",
      description: "Áo thun cotton 100% cao cấp",
      points: 450,
      image: "/placeholder.svg",
      category: "product",
      stock: 60,
      trending: false,
      originalPrice: "299.000đ",
      type: "Thời trang",
      popularity: 68
    },
    {
      id: 9,
      name: "Voucher Giảm 200K",
      description: "Áp dụng cho đơn hàng từ 1.000K",
      points: 900,
      image: "/placeholder.svg",
      category: "voucher",
      stock: 30,
      trending: true,
      discount: "200.000đ",
      expiry: "30 ngày",
      type: "Mã giảm giá",
      popularity: 90
    },
    {
      id: 10,
      name: "Sạc dự phòng 10000mAh",
      description: "Pin dự phòng sạc nhanh 2 cổng",
      points: 1000,
      image: "/placeholder.svg",
      category: "tech",
      stock: 15,
      trending: true,
      originalPrice: "699.000đ",
      type: "Điện tử",
      popularity: 85
    },
    {
      id: 11,
      name: "Mũ lưỡi trai",
      description: "Mũ cap thêu logo thời trang",
      points: 350,
      image: "/placeholder.svg",
      category: "product",
      stock: 45,
      trending: false,
      originalPrice: "249.000đ",
      type: "Phụ kiện",
      popularity: 65
    },
    {
      id: 12,
      name: "Massage 60 phút",
      description: "Voucher massage body toàn thân",
      points: 1500,
      image: "/placeholder.svg",
      category: "service",
      stock: 10,
      trending: false,
      discount: "Miễn phí",
      expiry: "60 ngày",
      type: "Spa & Wellness",
      popularity: 80
    },
  ];

  const filteredRewards = rewards
    .filter(r => selectedCategory === "all" || r.category === selectedCategory)
    .filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  r.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "trending") return b.popularity - a.popularity;
      if (sortBy === "points-asc") return a.points - b.points;
      if (sortBy === "points-desc") return b.points - a.points;
      if (sortBy === "stock") return b.stock - a.stock;
      return 0;
    });

  const handleRedeem = (reward: any) => {
    if (userPoints >= reward.points) {
      toast.success("Đổi thưởng thành công!", {
        description: `${reward.name} đã được thêm vào ví của bạn`
      });
    } else {
      toast.error(`Bạn cần thêm ${reward.points - userPoints} điểm để đổi phần quà này`);
    }
  };

  const nextTierPoints = 3000;
  const progressToNextTier = (userPoints / nextTierPoints) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-primary opacity-10 blur-3xl"
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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary),0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Enhanced Header */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ y: headerY, opacity: headerOpacity }}
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="hover:bg-primary/10"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-xl shadow-primary/30"
                  >
                    <Gift className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                      Đổi thưởng
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      Sử dụng điểm tích lũy để đổi quà tặng hấp dẫn
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Premium Points Balance Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/10" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />
              
              {/* Floating orbs */}
              <motion.div
                className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <CardContent className="p-8 relative">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                  {/* Points Display */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
                        <Crown className="w-3 h-3 mr-1" />
                        VIP Member
                      </Badge>
                      <Badge variant="outline" className="backdrop-blur-sm">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {userPoints.toLocaleString()} điểm
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Điểm thưởng hiện có</p>
                      <div className="flex items-baseline gap-3">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="inline-block"
                        >
                          <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                        </motion.div>
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                          {userPoints.toLocaleString()}
                        </h2>
                        <span className="text-2xl text-muted-foreground">điểm</span>
                      </div>
                    </div>

                    {/* Progress to next tier */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Đến hạng tiếp theo</span>
                        <span className="font-semibold">{userPoints}/{nextTierPoints} điểm</span>
                      </div>
                      <Progress value={progressToNextTier} className="h-3" />
                      <p className="text-xs text-muted-foreground">
                        Còn {nextTierPoints - userPoints} điểm nữa để lên hạng Diamond
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-col gap-3 min-w-[200px]">
                    <Button
                      size="lg"
                      onClick={() => navigate("/vi-dien-tu")}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 shadow-xl"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Nạp điểm
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate("/vi-dien-tu")}
                      className="border-2 hover:border-primary hover:bg-primary/5"
                    >
                      <Package className="w-5 h-5 mr-2" />
                      Lịch sử đổi quà
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { 
                label: "Phần quà", 
                value: filteredRewards.length, 
                icon: Gift, 
                color: "from-blue-500 to-cyan-500",
                bgColor: "from-blue-500/10 to-cyan-500/10"
              },
              { 
                label: "Đang hot", 
                value: filteredRewards.filter(r => r.trending).length, 
                icon: Flame, 
                color: "from-orange-500 to-red-500",
                bgColor: "from-orange-500/10 to-red-500/10"
              },
              { 
                label: "Có thể đổi", 
                value: filteredRewards.filter(r => r.points <= userPoints).length, 
                icon: CheckCircle2, 
                color: "from-green-500 to-emerald-500",
                bgColor: "from-green-500/10 to-emerald-500/10"
              },
              { 
                label: "Sắp hết", 
                value: filteredRewards.filter(r => r.stock < 20).length, 
                icon: Clock, 
                color: "from-purple-500 to-pink-500",
                bgColor: "from-purple-500/10 to-pink-500/10"
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor}`} />
                  <CardContent className="p-6 relative">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Filters & Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm">
              <CardContent className="p-6 space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                  <Input
                    placeholder="Tìm kiếm phần quà..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-12 h-12 border-border/50 focus:border-primary"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-primary/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  {/* Category Pills */}
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-3">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Danh mục</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <motion.div
                            key={cat.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant={selectedCategory === cat.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedCategory(cat.id)}
                              className={selectedCategory === cat.id ? `bg-gradient-to-r ${cat.color}` : ''}
                            >
                              <Icon className="w-4 h-4 mr-2" />
                              {cat.name}
                            </Button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sort & View Controls */}
                  <div className="flex items-center gap-3">
                    {/* Sort Dropdown */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 rounded-lg border border-input bg-background/50 backdrop-blur-sm text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="trending">🔥 Phổ biến nhất</option>
                      <option value="points-asc">💰 Điểm thấp → cao</option>
                      <option value="points-desc">💎 Điểm cao → thấp</option>
                      <option value="stock">📦 Còn nhiều nhất</option>
                    </select>

                    {/* View Mode Toggle */}
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

                {/* Results Count */}
                <div className="pt-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Hiển thị {filteredRewards.length} phần quà</span>
                  <span>{filteredRewards.filter(r => r.points <= userPoints).length} có thể đổi ngay</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Rewards Grid */}
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {filteredRewards.map((reward, index) => {
              const canRedeem = userPoints >= reward.points;
              const isLowStock = reward.stock < 20;
              const category = categories.find(c => c.id === reward.category);

              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                >
                  <Card className="group relative overflow-hidden border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full flex flex-col">
                    {/* Product Image */}
                    <div className="relative overflow-hidden">
                      <div className="aspect-square relative">
                        <img
                          src={reward.image}
                          alt={reward.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${category?.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {reward.trending && (
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg gap-1">
                            <Flame className="w-3 h-3" />
                            Hot
                          </Badge>
                        )}
                        {isLowStock && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg gap-1">
                            <Clock className="w-3 h-3" />
                            Sắp hết
                          </Badge>
                        )}
                        {canRedeem && (
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Đủ điểm
                          </Badge>
                        )}
                      </div>

                      {/* Points Badge */}
                      <div className="absolute bottom-3 right-3">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className={`px-4 py-2 rounded-full backdrop-blur-md shadow-xl font-bold text-sm flex items-center gap-2 ${
                            canRedeem 
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                              : 'bg-background/90 text-muted-foreground'
                          }`}
                        >
                          <Star className="w-4 h-4" />
                          {reward.points.toLocaleString()}
                        </motion.div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <CardContent className="p-5 space-y-4 flex-1 flex flex-col">
                      <div className="flex-1 space-y-2">
                        <Badge variant="secondary" className="text-xs">
                          {reward.type}
                        </Badge>
                        <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                          {reward.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {reward.description}
                        </p>
                      </div>

                      {/* Value Info */}
                      <div className="space-y-2 pt-4 border-t border-border/50">
                        {reward.discount && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Giá trị:</span>
                            <span className="font-bold text-green-600">{reward.discount}</span>
                          </div>
                        )}
                        {reward.originalPrice && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Giá gốc:</span>
                            <span className="font-bold">{reward.originalPrice}</span>
                          </div>
                        )}
                        {reward.expiry && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Hạn dùng:
                            </span>
                            <span className="font-medium">{reward.expiry}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            Còn lại:
                          </span>
                          <span className={`font-bold ${isLowStock ? 'text-orange-600' : ''}`}>
                            {reward.stock} phần
                          </span>
                        </div>

                        {/* Popularity */}
                        <div className="pt-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Độ phổ biến</span>
                            <span className="font-semibold">{reward.popularity}%</span>
                          </div>
                          <Progress value={reward.popularity} className="h-1.5" />
                        </div>
                      </div>

                      {/* Redeem Button */}
                      <Button
                        className={`w-full gap-2 ${canRedeem ? `bg-gradient-to-r ${category?.color} hover:opacity-90 shadow-lg` : ''}`}
                        onClick={() => handleRedeem(reward)}
                        disabled={!canRedeem}
                        size="lg"
                      >
                        <Gift className="w-5 h-5" />
                        {canRedeem ? 'Đổi ngay' : `Cần ${(reward.points - userPoints).toLocaleString()} điểm nữa`}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Enhanced Empty State */}
          {filteredRewards.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <Card className="max-w-md mx-auto border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm">
                <CardContent className="p-12">
                  <Gift className="w-20 h-20 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Không tìm thấy phần quà</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery 
                      ? `Không có kết quả cho "${searchQuery}"`
                      : "Không tìm thấy phần quà trong danh mục này"}
                  </p>
                  <div className="flex gap-3 justify-center">
                    {searchQuery && (
                      <Button onClick={() => setSearchQuery("")} variant="outline">
                        Xóa tìm kiếm
                      </Button>
                    )}
                    <Button onClick={() => setSelectedCategory("all")}>
                      Xem tất cả
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default RewardsRedemption;