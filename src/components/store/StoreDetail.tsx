import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  Package,
  MessageCircle,
  Share2,
  Heart,
  Building,
  TrendingUp,
  Award,
  Users,
  ShoppingBag,
  Clock,
  Verified,
  ChevronRight,
  Sparkles,
  Grid3x3,
  Filter,
  ArrowLeft,
  ExternalLink,
  Loader2,
  Search,
  SlidersHorizontal,
  List,
  Eye,
  Shield,
  Crown,
  Zap,
  Flame,
  Gift,
  Diamond,
  MoreHorizontal,
} from "lucide-react";

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  discount_price: number | null;
  image: string | null;
  stock_quantity: number;
  category_name: string;
  rating?: number;
  sold?: number;
}

interface StoreInfo {
  seller_id: number;
  store_name: string;
  avatar: string | null;
  cover_image: string | null;
  business_type: string | null;
  phone: string | null;
  email: string | null;
  business_address: string | null;
  establish_year: number | null;
  description: string | null;
  owner_name: string | null;
  created_at: string;
  total_products: number;
  avg_rating: number;
  total_reviews: number;
}

export function StoreDetail() {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (sellerId) {
      fetchStoreDetail();
    }
  }, [sellerId]);

  const fetchStoreDetail = async () => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/vendor/get_store_detail.php?seller_id=${sellerId}`;
      const response = await fetch(url);
      const responseText = await response.text();
      const data = JSON.parse(responseText);

      if (data.success) {
        setStore(data.store);
        setProducts(data.products);
      } else {
        throw new Error(data.error || "Không thể tải thông tin cửa hàng");
      }
    } catch (error: any) {
      console.error("Error fetching store detail:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Đã xảy ra lỗi khi tải dữ liệu",
        variant: "destructive",
      });
      setStore(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowStore = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Đã bỏ theo dõi" : "Đã theo dõi",
      description: isFollowing 
        ? `Bạn đã bỏ theo dõi ${store?.store_name}`
        : `Bạn đang theo dõi ${store?.store_name}`,
    });
  };

  const handleShareStore = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Đã sao chép",
      description: "Đã sao chép link cửa hàng vào clipboard",
    });
  };

  const handleChatWithStore = () => {
    toast({
      title: "Tính năng đang phát triển",
      description: "Chức năng chat sẽ sớm được ra mắt",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getDiscountPercent = (price: number, discountPrice: number) => {
    return Math.round(((price - discountPrice) / price) * 100);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return (a.discount_price || a.price) - (b.discount_price || b.price);
      case "price_high":
        return (b.discount_price || b.price) - (a.discount_price || a.price);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "sold":
        return (b.sold || 0) - (a.sold || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 flex items-center justify-center shadow-2xl"
            >
              <Store className="w-12 h-12 text-white" />
            </motion.div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 blur-2xl opacity-50 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Đang tải thông tin cửa hàng
            </h3>
            <p className="text-muted-foreground">Vui lòng đợi trong giây lát...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="max-w-md w-full border-pink-200 shadow-2xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-950 dark:to-rose-950 flex items-center justify-center">
                  <Store className="w-12 h-12 text-pink-600" />
                </div>
                <div className="absolute inset-0 rounded-full bg-pink-500 blur-2xl opacity-20" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Cửa hàng không tồn tại
                </h3>
                <p className="text-muted-foreground">
                  Cửa hàng bạn tìm kiếm không tồn tại hoặc đã bị xóa
                </p>
              </div>
              <Button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Về trang chủ
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Cover Section with Pink Gradient */}
      <div className="relative h-[450px] overflow-hidden">
        {store.cover_image ? (
          <>
            <img
              src={store.cover_image}
              alt={store.store_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" /> 
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <motion.div
                animate={{ 
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{ 
                  duration: 20, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
                className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                style={{
                  backgroundSize: "200% 200%",
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <Store className="w-32 h-32 text-white/30" />
              </motion.div>
            </div>
          </div>
        )}

        {/* Floating glassmorphism buttons */}
        <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 text-white shadow-xl"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 text-white shadow-xl"
              onClick={handleShareStore}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Chia sẻ
            </Button>
          </motion.div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              animate={{
                y: [0, -100],
                x: [0, Math.random() * 100 - 50],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: "100%",
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Store Profile Section with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="-mt-40 relative z-10"
        >
          <Card className="border-pink-200/50 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Animated Avatar */}
                <div className="flex-shrink-0">
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Avatar className="w-40 h-40 border-4 border-white shadow-2xl ring-4 ring-pink-100 dark:ring-pink-900">
                      <AvatarImage
                        src={store.avatar || undefined}
                        alt={store.store_name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white text-5xl font-bold">
                        {getInitials(store.store_name)}
                      </AvatarFallback>
                    </Avatar>
                    <motion.div 
                      className="absolute -bottom-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-3 shadow-xl"
                      animate={{ 
                        boxShadow: [
                          "0 0 20px rgba(236, 72, 153, 0.5)",
                          "0 0 30px rgba(236, 72, 153, 0.8)",
                          "0 0 20px rgba(236, 72, 153, 0.5)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Crown className="w-6 h-6 text-white" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Store Information */}
                <div className="flex-1 space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-start gap-4">
                      <motion.h1 
                        className="text-4xl font-black bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {store.store_name}
                      </motion.h1>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring" }}
                      >
                        <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 px-4 py-2 text-sm shadow-lg">
                          <Verified className="w-4 h-4 mr-2" />
                          Cửa hàng uy tín
                        </Badge>
                      </motion.div>
                    </div>

                    {store.business_type && (
                      <motion.div 
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Building className="w-5 h-5 text-pink-500" />
                        <p className="text-muted-foreground font-medium text-lg">
                          {store.business_type}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Enhanced Stats Grid */}
                  <motion.div 
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div 
                      className="bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-950 dark:to-rose-900 rounded-2xl p-5 text-center border border-pink-200 dark:border-pink-800 shadow-lg"
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                        <span className="text-2xl font-bold text-foreground">
                          {store.avg_rating}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">
                        {store.total_reviews} đánh giá
                      </p>
                    </motion.div>

                    <motion.div 
                      className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-900 rounded-2xl p-5 text-center border border-purple-200 dark:border-purple-800 shadow-lg"
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Package className="w-5 h-5 text-purple-600" />
                        <span className="text-2xl font-bold text-foreground">
                          {store.total_products}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">Sản phẩm</p>
                    </motion.div>

                    <motion.div 
                      className="bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-950 dark:to-pink-900 rounded-2xl p-5 text-center border border-rose-200 dark:border-rose-800 shadow-lg"
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Heart className="w-5 h-5 text-rose-600" />
                        <span className="text-2xl font-bold text-foreground">
                          1.2K
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">Theo dõi</p>
                    </motion.div>

                    <motion.div 
                      className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-900 rounded-2xl p-5 text-center border border-emerald-200 dark:border-emerald-800 shadow-lg"
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        <span className="text-2xl font-bold text-foreground">
                          98%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">Phản hồi</p>
                    </motion.div>
                  </motion.div>

                  {/* Action Buttons with Pink Gradient */}
                  <motion.div 
                    className="flex flex-wrap gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleFollowStore}
                        size="lg"
                        className={
                          isFollowing
                            ? "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-xl"
                            : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-xl"
                        }
                      >
                        <Heart
                          className={`w-5 h-5 mr-2 ${
                            isFollowing ? "fill-current" : ""
                          }`}
                        />
                        {isFollowing ? "Đang theo dõi" : "Theo dõi"}
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleChatWithStore}
                        className="border-2 border-pink-300 hover:bg-pink-50 dark:hover:bg-pink-950 text-pink-600 hover:text-pink-700 shadow-lg"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Chat ngay
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleShareStore}
                        className="border-2 border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950 text-purple-600 hover:text-purple-700 shadow-lg"
                      >
                        <Share2 className="w-5 h-5 mr-2" />
                        Chia sẻ
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8 pb-12">
          {/* Sidebar - Store Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Contact Information */}
            <Card className="border-pink-200/50 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 relative overflow-hidden">
                <motion.div
                  animate={{ 
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{ 
                    duration: 15, 
                    repeat: Infinity, 
                    repeatType: "reverse" 
                  }}
                  className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  style={{ backgroundSize: "200% 200%" }}
                />
                <h3 className="font-bold text-xl text-white flex items-center gap-3 relative z-10">
                  <Building className="w-6 h-6" />
                  Thông tin liên hệ
                </h3>
              </div>
              <CardContent className="p-6 space-y-4">
                {store.phone && (
                  <motion.div 
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 border border-green-200 dark:border-green-800"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Phone className="w-5 h-5 text-green-600 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1 font-medium">
                        Điện thoại
                      </p>
                      <p className="font-bold text-foreground">
                        {store.phone}
                      </p>
                    </div>
                  </motion.div>
                )}

                {store.email && (
                  <motion.div 
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-950 dark:to-rose-900 border border-red-200 dark:border-red-800"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Mail className="w-5 h-5 text-red-600 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1 font-medium">
                        Email
                      </p>
                      <p className="font-bold text-foreground break-all text-sm">
                        {store.email}
                      </p>
                    </div>
                  </motion.div>
                )}

                {store.business_address && (
                  <motion.div 
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950 dark:to-amber-900 border border-orange-200 dark:border-orange-800"
                    whileHover={{ scale: 1.02 }}
                  >
                    <MapPin className="w-5 h-5 text-orange-600 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1 font-medium">
                        Địa chỉ
                      </p>
                      <p className="font-bold text-foreground text-sm">
                        {store.business_address}
                      </p>
                    </div>
                  </motion.div>
                )}

                {store.establish_year && (
                  <motion.div 
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-900 border border-purple-200 dark:border-purple-800"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Calendar className="w-5 h-5 text-purple-600 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1 font-medium">
                        Năm thành lập
                      </p>
                      <p className="font-bold text-foreground">
                        {store.establish_year}
                      </p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Store Description */}
            {store.description && (
              <Card className="border-purple-200/50 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                  <h3 className="font-bold text-xl text-white flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    Giới thiệu
                  </h3>
                </div>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {store.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Achievement Badges */}
            <Card className="border-yellow-200/50 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6">
                <h3 className="font-bold text-xl text-white flex items-center gap-3">
                  <Award className="w-6 h-6" />
                  Thành tích
                </h3>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-950 dark:to-orange-900 border border-yellow-200 dark:border-yellow-800"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <Shield className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                    <p className="text-sm font-bold text-foreground">Uy tín</p>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-900 border border-blue-200 dark:border-blue-800"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <Zap className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <p className="text-sm font-bold text-foreground">Giao nhanh</p>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 rounded-xl bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-950 dark:to-rose-900 border border-pink-200 dark:border-pink-800"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <Gift className="w-8 h-8 text-pink-600 mx-auto mb-3" />
                    <p className="text-sm font-bold text-foreground">Ưu đãi</p>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-900 border border-purple-200 dark:border-purple-800"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <Diamond className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <p className="text-sm font-bold text-foreground">Chất lượng</p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content - Products */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="lg:col-span-3"
          >
            <Card className="border-pink-200/50 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 overflow-hidden">
              {/* Enhanced Header with Pink Gradient */}
              <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 p-8 relative overflow-hidden">
                {/* Animated background */}
                <motion.div
                  animate={{ 
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    repeatType: "reverse" 
                  }}
                  className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  style={{ backgroundSize: "200% 200%" }}
                />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-xl"
                      animate={{ 
                        boxShadow: [
                          "0 0 20px rgba(255, 255, 255, 0.3)",
                          "0 0 30px rgba(255, 255, 255, 0.5)",
                          "0 0 20px rgba(255, 255, 255, 0.3)"
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <ShoppingBag className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        Sản phẩm của cửa hàng
                      </h2>
                      <p className="text-pink-100 text-lg">
                        {products.length} sản phẩm có sẵn
                      </p>
                    </div>
                  </div>
                  
                  {/* Enhanced View Mode Toggle */}
                  <div className="flex items-center gap-3">
                    <div className="flex bg-white/20 rounded-xl p-1 backdrop-blur-sm border border-white/30 shadow-lg">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewMode("grid")}
                          className={`h-10 px-4 rounded-lg transition-all duration-300 ${
                            viewMode === "grid" 
                              ? "bg-white text-pink-600 shadow-lg font-semibold" 
                              : "text-white hover:bg-white/20"
                          }`}
                        >
                          <Grid3x3 className="w-5 h-5" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewMode("list")}
                          className={`h-10 px-4 rounded-lg transition-all duration-300 ${
                            viewMode === "list" 
                              ? "bg-white text-pink-600 shadow-lg font-semibold" 
                              : "text-white hover:bg-white/20"
                          }`}
                        >
                          <List className="w-5 h-5" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-8 space-y-8">
                {/* Enhanced Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-pink-400" />
                    <Input
                      placeholder="Tìm kiếm sản phẩm, danh mục..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-14 border-2 border-pink-200 rounded-xl bg-pink-50/50 dark:bg-pink-950/20 focus:border-pink-400 text-lg backdrop-blur-sm transition-all duration-300"
                    />
                    <AnimatePresence>
                      {searchQuery && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-pink-100 dark:hover:bg-pink-900 rounded-full"
                          >
                            ×
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex gap-3">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-6 py-4 border-2 border-pink-200 rounded-xl bg-pink-50/50 dark:bg-pink-950/20 focus:border-pink-400 min-w-[160px] text-sm font-medium backdrop-blur-sm transition-all duration-300"
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="price_low">Giá thấp đến cao</option>
                      <option value="price_high">Giá cao đến thấp</option>
                      <option value="rating">Đánh giá cao</option>
                      <option value="sold">Bán chạy</option>
                    </select>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="border-2 border-pink-300 h-14 px-6 bg-pink-50/50 dark:bg-pink-950/20 hover:bg-pink-100 dark:hover:bg-pink-900 text-pink-600 font-semibold rounded-xl backdrop-blur-sm"
                      >
                        <SlidersHorizontal className="w-5 h-5 mr-2" />
                        Bộ lọc
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {/* Results Info */}
                <AnimatePresence>
                  {searchQuery && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="px-4 py-2 bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-950 dark:to-rose-950 border border-pink-200 dark:border-pink-800 rounded-full">
                        <span className="text-pink-700 dark:text-pink-300 font-semibold">
                          {sortedProducts.length} kết quả cho "{searchQuery}"
                        </span>
                      </div>
                      {sortedProducts.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSearchQuery("")}
                          className="h-auto p-2 text-muted-foreground hover:text-pink-600 transition-colors"
                        >
                          Xóa bộ lọc
                        </Button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Products Display */}
                <AnimatePresence mode="wait">
                  {sortedProducts.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-20"
                    >
                      <div className="relative mb-8">
                        <motion.div 
                          className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-pink-100 to-rose-200 dark:from-pink-900 dark:to-rose-900 flex items-center justify-center"
                          animate={{ 
                            scale: [1, 1.05, 1],
                            rotate: [0, 2, -2, 0] 
                          }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          {searchQuery ? (
                            <Search className="w-16 h-16 text-pink-400" />
                          ) : (
                            <Package className="w-16 h-16 text-pink-400" />
                          )}
                        </motion.div>
                        <div className="absolute inset-0 rounded-3xl bg-pink-400 blur-3xl opacity-20" />
                      </div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        {searchQuery ? "Không tìm thấy sản phẩm" : "Chưa có sản phẩm"}
                      </h3>
                      <p className="text-muted-foreground text-lg mb-6">
                        {searchQuery
                          ? "Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc"
                          : "Cửa hàng chưa có sản phẩm nào để hiển thị"}
                      </p>
                      {searchQuery && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => setSearchQuery("")}
                            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-xl"
                          >
                            Xóa bộ lọc
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Grid View */}
                      {viewMode === "grid" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                          {sortedProducts.map((product, index) => (
                            <motion.div
                              key={product.product_id}
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1, duration: 0.6 }}
                              whileHover={{ y: -8, scale: 1.02 }}
                              className="group cursor-pointer"
                              onClick={() => navigate(`/product/${product.product_id}`)}
                            >
                              <Card className="border-2 border-pink-100 hover:border-pink-300 hover:shadow-2xl transition-all duration-500 overflow-hidden h-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                                {/* Enhanced Product Image */}
                                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 dark:from-pink-950 dark:via-rose-950 dark:to-purple-950">
                                  {product.image ? (
                                    <>
                                      <img
                                        src={product.image}
                                        alt={product.product_name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </>
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package className="w-20 h-20 text-pink-300" />
                                    </div>
                                  )}

                                  {/* Enhanced Badges */}
                                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {product.discount_price && (
                                      <motion.div
                                        initial={{ scale: 0, rotate: -10 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: index * 0.1 + 0.3 }}
                                      >
                                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-xl px-3 py-1 font-bold text-sm">
                                          -{getDiscountPercent(product.price, product.discount_price)}%
                                        </Badge>
                                      </motion.div>
                                    )}
                                    {product.sold && product.sold > 100 && (
                                      <motion.div
                                        initial={{ scale: 0, rotate: 10 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: index * 0.1 + 0.4 }}
                                      >
                                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-xl px-3 py-1 font-bold text-sm">
                                          <Flame className="w-3 h-3 mr-1" />
                                          Hot
                                        </Badge>
                                      </motion.div>
                                    )}
                                  </div>

                                  {/* Quick Actions */}
                                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-10 w-10 bg-white/95 hover:bg-white backdrop-blur-sm shadow-xl rounded-full border-2 border-white"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                      >
                                        <Eye className="w-5 h-5 text-pink-600" />
                                      </Button>
                                    </motion.div>
                                  </div>

                                  {/* Out of stock overlay */}
                                  {product.stock_quantity === 0 && (
                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                                      <Badge variant="destructive" className="px-6 py-3 text-lg font-bold shadow-xl">
                                        Hết hàng
                                      </Badge>
                                    </div>
                                  )}

                                  {/* Enhanced Hover Action */}
                                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                    <motion.div
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <Button
                                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold shadow-xl backdrop-blur-sm border border-white/20"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                      >
                                        Thêm vào giỏ
                                      </Button>
                                    </motion.div>
                                  </div>
                                </div>

                                {/* Enhanced Product Info */}
                                <CardContent className="p-6 space-y-4 bg-gradient-to-b from-white to-pink-50/50 dark:from-gray-900 dark:to-pink-950/20">
                                  <div className="flex items-center justify-between">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs font-semibold bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300 px-3 py-1"
                                    >
                                      {product.category_name}
                                    </Badge>
                                    {product.rating && product.rating > 0 && (
                                      <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                        <span className="text-sm font-bold text-yellow-600">
                                          {product.rating}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  <h3 className="font-bold text-base line-clamp-2 group-hover:text-pink-600 transition-colors min-h-[48px] leading-tight">
                                    {product.product_name}
                                  </h3>

                                  <div className="flex items-baseline gap-3">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                      {formatPrice(product.discount_price || product.price)}
                                    </span>
                                    {product.discount_price && (
                                      <span className="text-sm text-muted-foreground line-through">
                                        {formatPrice(product.price)}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between pt-3 border-t border-pink-100 dark:border-pink-800">
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                      <span className="font-medium">Còn {product.stock_quantity}</span>
                                      {product.sold && product.sold > 0 && (
                                        <>
                                          <span>•</span>
                                          <span>Đã bán {product.sold}</span>
                                        </>
                                      )}
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-pink-500 group-hover:translate-x-1 transition-transform" />
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Enhanced List View */}
                      {viewMode === "list" && (
                        <div className="space-y-6">
                          {sortedProducts.map((product, index) => (
                            <motion.div
                              key={product.product_id}
                              initial={{ opacity: 0, x: -30 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05, duration: 0.6 }}
                              whileHover={{ scale: 1.01, x: 4 }}
                              className="group cursor-pointer"
                              onClick={() => navigate(`/product/${product.product_id}`)}
                            >
                              <Card className="border-2 border-pink-100 hover:border-pink-300 hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                                <CardContent className="p-6">
                                  <div className="flex gap-6">
                                    <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-950 dark:to-rose-900 border-2 border-pink-100 dark:border-pink-800">
                                      {product.image ? (
                                        <img
                                          src={product.image}
                                          alt={product.product_name}
                                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <Package className="w-10 h-10 text-pink-300" />
                                        </div>
                                      )}
                                      {product.discount_price && (
                                        <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 shadow-lg">
                                          -{getDiscountPercent(product.price, product.discount_price)}%
                                        </Badge>
                                      )}
                                    </div>

                                    <div className="flex-1 space-y-3">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-2">
                                          <Badge variant="secondary" className="text-xs mb-2 bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300">
                                            {product.category_name}
                                          </Badge>
                                          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-pink-600 transition-colors">
                                            {product.product_name}
                                          </h3>
                                        </div>
                                        {product.rating && product.rating > 0 && (
                                          <div className="flex items-center gap-2 ml-4">
                                            <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                                            <span className="text-sm font-bold text-yellow-600">
                                              {product.rating}
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      <div className="flex items-center justify-between">
                                        <div className="flex items-baseline gap-3">
                                          <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                            {formatPrice(product.discount_price || product.price)}
                                          </span>
                                          {product.discount_price && (
                                            <span className="text-lg text-muted-foreground line-through">
                                              {formatPrice(product.price)}
                                            </span>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                          <span className="font-medium">Còn {product.stock_quantity}</span>
                                          {product.sold && product.sold > 0 && (
                                            <span className="font-medium">Đã bán {product.sold}</span>
                                          )}
                                          <ChevronRight className="w-5 h-5 text-pink-500 group-hover:translate-x-2 transition-transform" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Enhanced View More Button */}
                      {products.length > 12 && (
                        <motion.div 
                          className="flex justify-center pt-12"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              size="lg"
                              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              Xem tất cả {products.length} sản phẩm
                              <ExternalLink className="w-5 h-5 ml-2" />
                            </Button>
                          </motion.div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}