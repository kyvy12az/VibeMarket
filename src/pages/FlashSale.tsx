import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Zap,
  Flame,
  Star,
  Timer,
  Bell,
  TrendingUp,
  ShoppingCart,
  Heart,
  Eye,
  Sparkles,
  Gift,
  Tag,
  ArrowRight,
  AlertCircle,
  Share2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const FlashSale = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 30,
    seconds: 45,
  });

  const [flashSaleItems, setFlashSaleItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());

  const upcomingSales = [
    {
      time: "14:00",
      title: "Thời trang nam",
      discount: "Giảm 50%",
      icon: Tag,
      color: "from-blue-500 to-cyan-500",
      items: 150
    },
    {
      time: "16:00",
      title: "Mỹ phẩm cao cấp",
      discount: "Giảm 40%",
      icon: Sparkles,
      color: "from-pink-500 to-rose-500",
      items: 200
    },
    {
      time: "18:00",
      title: "Đồ gia dụng",
      discount: "Giảm 60%",
      icon: Gift,
      color: "from-purple-500 to-indigo-500",
      items: 180
    },
    {
      time: "20:00",
      title: "Phụ kiện điện tử",
      discount: "Giảm 35%",
      icon: Zap,
      color: "from-orange-500 to-red-500",
      items: 120
    },
  ];

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/flash_sale.php`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setFlashSaleItems(data.products);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error("Không thể tải sản phẩm Flash Sale");
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleWishlist = (id: number) => {
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        toast.success("Đã xóa khỏi yêu thích");
      } else {
        newSet.add(id);
        toast.success("Đã thêm vào yêu thích");
      }
      return newSet;
    });
  };

  const handleBuyNow = (product: any) => {
    toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Enhanced Header */}
          {/* Enhanced Header - Simple Version */}
          <div className="relative">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="relative flex-shrink-0"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl blur-xl opacity-50"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-2xl">
                  <Zap className="w-7 h-7 lg:w-10 lg:h-10 text-white" />
                </div>
              </motion.div>

              {/* Title & Subtitle */}
              <div className="text-left flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl lg:text-5xl font-black"
                  >
                    <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      FLASH SALE
                    </span>
                  </motion.h1>
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity
                    }}
                  >
                    <Flame className="w-8 h-8 lg:w-10 lg:h-10 text-red-500" />
                  </motion.div>
                </div>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-base lg:text-lg text-muted-foreground"
                >
                  🔥 Săn deal siêu hot - Giá sốc chỉ trong thời gian có hạn! ⚡
                </motion.p>
              </div>
            </div>
          </div>

          {/* Enhanced Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-r from-primary via-purple-600 to-primary relative">
              {/* Animated Background Pattern */}
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                style={{
                  backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "30px 30px"
                }}
              />

              {/* Additional Gradient Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Animated Glow Effect */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                    "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <CardContent className="py-8 relative z-10">
                <div className="flex flex-col items-center gap-6">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Timer className="w-8 h-8 text-white drop-shadow-lg" />
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                      Kết thúc trong:
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 md:gap-6">
                    {[
                      { value: timeLeft.hours, label: "Giờ" },
                      { value: timeLeft.minutes, label: "Phút" },
                      { value: timeLeft.seconds, label: "Giây" }
                    ].map((time, idx) => (
                      <>
                        <motion.div
                          key={time.label}
                          className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 md:p-6 min-w-[80px] md:min-w-[100px] shadow-2xl border-2 border-white/30 relative overflow-hidden"
                          whileHover={{ scale: 1.05 }}
                          animate={time.label === "Giây" ? {
                            scale: [1, 1.05, 1]
                          } : {}}
                          transition={{ duration: 1, repeat: time.label === "Giây" ? Infinity : 0 }}
                        >
                          {/* Inner Glow */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                            animate={{
                              opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />

                          <div className="relative z-10">
                            <div className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">
                              {time.value.toString().padStart(2, '0')}
                            </div>
                            <div className="text-xs md:text-sm text-white/90 font-semibold mt-2">
                              {time.label}
                            </div>
                          </div>
                        </motion.div>
                        {idx < 2 && (
                          <motion.div
                            className="text-3xl md:text-4xl text-white font-bold drop-shadow-lg"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            :
                          </motion.div>
                        )}
                      </>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-3"
                  >
                    <Button
                      className="bg-white text-primary hover:bg-white/90 font-bold shadow-lg hover:shadow-xl transition-all"
                      size="lg"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Đặt nhắc nhở
                    </Button>
                    <Button
                      variant="outline"
                      className="border-2 border-white bg-background hover:bg-white/20 font-bold backdrop-blur-sm"
                      size="lg"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Chia sẻ
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Flash Sale Products */}
          <section>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between mb-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-lg">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                Sản phẩm Flash Sale
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Badge className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white text-lg px-3 py-1 shadow-lg border-2 border-white/30">
                    <Flame className="w-4 h-4 mr-1 inline-block" />
                    HOT
                  </Badge>
                </motion.div>
              </h2>

              <Button variant="outline" className="hidden md:flex items-center gap-2 border-2 border-primary/50 hover:border-primary hover:bg-primary/5">
                Xem tất cả
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="h-64 bg-muted" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                      <div className="h-8 bg-muted rounded" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : flashSaleItems.length === 0 ? (
              <Card className="p-12 text-center border-none shadow-xl bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Chưa có sản phẩm Flash Sale</h3>
                  <p className="text-muted-foreground">Hãy quay lại sau để không bỏ lỡ các deal hot!</p>
                  <Button className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-lg">
                    <Bell className="w-4 h-4 mr-2" />
                    Nhận thông báo
                  </Button>
                </motion.div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {flashSaleItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -8 }}
                      className="group"
                    >
                      <Card className="overflow-hidden border-2 border-border/50 hover:border-primary/50 shadow-xl hover:shadow-2xl transition-all duration-300 relative bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm">
                        {/* Top Border Accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-600" />

                        {/* Discount Badge with Glow */}
                        <motion.div
                          className="absolute top-3 right-3 z-20"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {/* Glow effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full blur-md opacity-50"
                            animate={{
                              opacity: [0.3, 0.6, 0.3],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                          />

                          <Badge className="relative bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white text-base px-4 py-2 shadow-xl border-2 border-white/40">
                            <motion.span
                              animate={{ rotate: [0, -15, 15, 0] }}
                              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                              className="inline-block"
                            >
                              <Zap className="w-4 h-4 mr-1" />
                            </motion.span>
                            -{item.discount}%
                          </Badge>
                        </motion.div>

                        {/* Wishlist Button */}
                        <motion.button
                          className="absolute top-3 left-3 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-primary/10"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleWishlist(item.id)}
                        >
                          <Heart
                            className={`w-5 h-5 ${wishlist.has(item.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                          />
                        </motion.button>

                        {/* Product Image */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted/30">
                          <motion.img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-64 object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                            whileHover={{ scale: 1.05 }}
                          />

                          {/* Sold Progress */}
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <motion.div
                              className="bg-card/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-border/50"
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                            >
                              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                                  Đã bán: {item.sold}/{item.quantity}
                                </span>
                                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-bold">
                                  {item.quantity > 0 ? Math.round((item.sold / item.quantity) * 100) : 0}%
                                </span>
                              </div>
                              <Progress
                                value={item.quantity > 0 ? (item.sold / item.quantity) * 100 : 0}
                                className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-purple-600"
                              />
                              {item.quantity - item.sold <= 10 && (
                                <motion.p
                                  className="text-xs text-primary font-bold mt-2 flex items-center gap-1"
                                  animate={{ opacity: [1, 0.5, 1] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                >
                                  <Flame className="w-3 h-3" />
                                  Chỉ còn {item.quantity - item.sold} sản phẩm!
                                </motion.p>
                              )}
                            </motion.div>
                          </div>
                        </div>

                        <CardContent className="p-5 space-y-3">
                          {/* Product Name */}
                          <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem] group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                            {item.name}
                          </h3>

                          {/* Rating */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-semibold">{item.rating}</span>
                            <span className="text-xs text-muted-foreground">
                              ({item.reviews} đánh giá)
                            </span>
                          </div>

                          {/* Prices */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-2xl font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                {item.price.toLocaleString()}₫
                              </span>
                              <span className="text-sm text-muted-foreground line-through">
                                {item.originalPrice.toLocaleString()}₫
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-medium">
                              <Sparkles className="w-3.5 h-3.5" />
                              Tiết kiệm {(item.originalPrice - item.price).toLocaleString()}₫
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-2">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="outline"
                                className="w-full border-2 border-primary/50 hover:border-primary hover:bg-primary/5"
                                onClick={() => navigate(`/product/${item.id}`)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Xem
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-lg hover:shadow-xl transition-all"
                                onClick={() => handleBuyNow(item)}
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Mua ngay
                              </Button>
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>

          {/* Upcoming Sales */}
          <section>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                Flash Sale sắp tới
              </h2>
              <p className="text-muted-foreground mt-2">Đặt nhắc nhở để không bỏ lỡ!</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingSales.map((sale, index) => (
                <motion.div
                  key={sale.time}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all cursor-pointer group">
                    <div className={`h-2 bg-gradient-to-r ${sale.color}`} />
                    <CardContent className="p-6 text-center space-y-4">
                      <motion.div
                        className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${sale.color} flex items-center justify-center shadow-lg`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <sale.icon className="w-8 h-8 text-white" />
                      </motion.div>

                      <div className="space-y-2">
                        <div className={`text-3xl font-black bg-gradient-to-r ${sale.color} bg-clip-text text-transparent`}>
                          {sale.time}
                        </div>
                        <h3 className="font-bold text-lg">{sale.title}</h3>
                        <Badge className={`bg-gradient-to-r ${sale.color} text-white text-sm px-3 py-1`}>
                          {sale.discount}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {sale.items}+ sản phẩm
                        </p>
                      </div>

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          className="w-full border-2 group-hover:border-primary"
                        >
                          <Bell className="w-4 h-4 mr-2" />
                          Đặt nhắc nhở
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-none shadow-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">💡 Mẹo săn Flash Sale thành công</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Đăng nhập trước giờ Flash Sale để thanh toán nhanh chóng</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Thêm sản phẩm yêu thích vào giỏ hàng trước để không bỏ lỡ</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Bật thông báo để nhận tin về Flash Sale mới nhất</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Hãy nhanh tay vì số lượng có hạn!</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default FlashSale;