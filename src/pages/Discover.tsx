import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Flame, 
  Star, 
  Clock, 
  TrendingUp, 
  Zap, 
  Gift, 
  Compass, 
  Search, 
  BookOpen, 
  SearchCheck,
  Eye,
  Heart,
  Share2,
  Bookmark,
  Users,
  Calendar,
  MapPin,
  ArrowRight,
  Play,
  Sparkles,
  Trophy,
  Target,
  TrendingDown,
  Filter,
  ChevronRight,
  MessageCircle,
  ThumbsUp,
  ExternalLink,
  ShoppingBag
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Discover = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [savedItems, setSavedItems] = useState<Set<number>>(new Set());

  const featuredContent = [
    {
      id: 1,
      title: "Xu hướng thời trang Thu/Đông 2024",
      description: "Khám phá những xu hướng hot nhất cho mùa lạnh sắp tới",
      image: "https://i.ibb.co/NnHFp7Vr/download.jpg",
      category: "Thời trang",
      trending: true,
      views: 12500,
      likes: 890,
      comments: 234,
      author: {
        name: "Fashion Insider",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop",
        verified: true
      },
      readTime: "5 phút đọc"
    },
    {
      id: 2,
      title: "Top 10 gadget công nghệ không thể bỏ qua",
      description: "Những sản phẩm công nghệ đột phá đang làm mưa làm gió",
      image: "https://i.ibb.co/ycwsRm3K/qua-tang-cong-nghe-695c822c80.webp",
      category: "Công nghệ",
      trending: true,
      views: 8900,
      likes: 654,
      comments: 189,
      author: {
        name: "Tech Review VN",
        avatar: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=60&h=60&fit=crop",
        verified: true
      },
      readTime: "8 phút đọc"
    },
    {
      id: 3,
      title: "Local brand Việt đang hot nhất hiện tại",
      description: "Tự hào với những thương hiệu made in Vietnam chất lượng cao",
      image: "/placeholder.svg",
      category: "Local Brand",
      trending: false,
      views: 6700,
      likes: 423,
      comments: 156,
      author: {
        name: "VibeMarket Team",
        avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=60&h=60&fit=crop",
        verified: true
      },
      readTime: "6 phút đọc"
    },
  ];

  const events = [
    {
      id: 1,
      title: "Lễ hội mua sắm 12.12",
      description: "Siêu sale cuối năm với hàng triệu deal hấp dẫn",
      date: "12/12/2024",
      discount: "Giảm đến 70%",
      participants: 25000,
      color: "from-orange-500 to-red-500",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop",
      location: "Toàn quốc",
      status: "Sắp diễn ra"
    },
    {
      id: 2,
      title: "Festival Local Brand 2024",
      description: "Tôn vinh và quảng bá các thương hiệu Việt Nam",
      date: "20/12/2024",
      discount: "Ưu đãi độc quyền",
      participants: 15000,
      color: "from-green-500 to-emerald-500",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
      location: "Hà Nội & TP.HCM",
      status: "Đang mở đăng ký"
    },
  ];

  const hotDeals = [
    {
      id: 1,
      title: "iPhone 17 Pro Max",
      originalPrice: "65.490.000đ",
      salePrice: "63.490.000đ",
      discount: 17,
      timeLeft: "2h 30m",
      image: "https://i.ibb.co/4ZK1RRgY/shopping.webp",
      seller: {
        name: "AppleStoreVN",
        avatar: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=60&h=60&fit=crop",
        verified: true,
        rating: 4.9
      },
      sold: 234,
      stock: 50
    },
    {
      id: 2,
      title: "MacBook Air M2",
      originalPrice: "32.990.000đ",
      salePrice: "27.990.000đ",
      discount: 15,
      timeLeft: "4h 15m",
      image: "https://i.ibb.co/xqLp6YHx/download.jpg",
      seller: {
        name: "MacShop",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop",
        verified: true,
        rating: 4.8
      },
      sold: 156,
      stock: 30
    },
    {
      id: 3,
      title: "Samsung Galaxy S24",
      originalPrice: "22.990.000đ",
      salePrice: "18.990.000đ",
      discount: 17,
      timeLeft: "1h 45m",
      image: "https://i.ibb.co/svyfTbr9/shopping.webp",
      seller: {
        name: "SamsungStore",
        avatar: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=60&h=60&fit=crop",
        verified: true,
        rating: 4.7
      },
      sold: 189,
      stock: 20
    },
  ];

  const trendingTopics = [
    { id: 1, name: "Flash Sale", count: 1250, icon: Zap, gradient: "from-yellow-500 to-orange-500" },
    { id: 2, name: "Thời trang", count: 890, icon: Sparkles, gradient: "from-pink-500 to-rose-500" },
    { id: 3, name: "Công nghệ", count: 756, icon: Trophy, gradient: "from-blue-500 to-cyan-500" },
    { id: 4, name: "Local Brand", count: 634, icon: Target, gradient: "from-green-500 to-emerald-500" },
  ];

  const toggleSave = (id: number) => {
    setSavedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
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
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center shadow-2xl"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Compass className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Khám phá điều mới
                </h1>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-pink-500" />
                </motion.div>
              </div>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                🔥 Cập nhật xu hướng, sự kiện hot và những deal không thể bỏ lỡ
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
                    placeholder="Tìm kiếm nội dung, sự kiện, deal hot..."
                    className="pl-12 pr-12 h-14 rounded-2xl border-2 shadow-lg"
                  />
                  <Button 
                    size="icon" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    <Filter className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>

              {/* Trending Topics */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-3 flex-wrap"
              >
                <span className="text-sm text-muted-foreground font-medium">Xu hướng:</span>
                {trendingTopics.map((topic, idx) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge 
                      className={`bg-gradient-to-r ${topic.gradient} text-white cursor-pointer px-4 py-2 text-sm gap-2 shadow-lg hover:opacity-90`}
                    >
                      <topic.icon className="w-4 h-4" />
                      {topic.name}
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                        {topic.count}
                      </span>
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Tabs Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full grid grid-cols-4 h-auto p-2 bg-gradient-to-r from-muted/50 to-muted/30 rounded-2xl">
                {[
                  { value: "all", label: "Tất cả", icon: Compass },
                  { value: "content", label: "Nội dung", icon: BookOpen },
                  { value: "events", label: "Sự kiện", icon: Calendar },
                  { value: "deals", label: "Deal hot", icon: Zap }
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl px-4 py-3"
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* All Tab */}
              <TabsContent value="all" className="space-y-8 mt-8">
                {/* Featured Content Section */}
                <section>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between mb-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                        <Flame className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold">Nội dung nổi bật</h2>
                    </div>
                    <Button variant="outline" className="hidden md:flex items-center gap-2 border-2">
                      Xem tất cả
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredContent.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -8 }}
                        className="group"
                      >
                        <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-background to-background/80 backdrop-blur-sm cursor-pointer">
                          {/* Image Section */}
                          <div className="relative h-48 overflow-hidden">
                            <motion.img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            
                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex gap-2">
                              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                {item.category}
                              </Badge>
                              {item.trending && (
                                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white gap-1 animate-pulse">
                                  <TrendingUp className="w-3 h-3" />
                                  Hot
                                </Badge>
                              )}
                            </div>

                            {/* Save Button */}
                            <motion.button
                              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleSave(item.id)}
                            >
                              <Bookmark className={`w-5 h-5 ${savedItems.has(item.id) ? 'fill-primary text-primary' : ''}`} />
                            </motion.button>

                            {/* Author Info */}
                            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                              <img 
                                src={item.author.avatar} 
                                alt={item.author.name} 
                                className="w-8 h-8 rounded-full border-2 border-white shadow-lg" 
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                  <span className="text-sm font-semibold text-white truncate">
                                    {item.author.name}
                                  </span>
                                  {item.author.verified && (
                                    <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
                                  )}
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {item.readTime}
                              </Badge>
                            </div>
                          </div>

                          <CardContent className="p-5 space-y-3">
                            <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center justify-between pt-3 border-t">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  <span>{item.views.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="w-4 h-4" />
                                  <span>{item.likes}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="w-4 h-4" />
                                  <span>{item.comments}</span>
                                </div>
                              </div>
                              <Button size="sm" variant="ghost" className="group-hover:text-primary">
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Events Section */}
                <section>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between mb-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                        <Gift className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold">Sự kiện đặc biệt</h2>
                    </div>
                    <Button variant="outline" className="hidden md:flex items-center gap-2 border-2">
                      Xem tất cả
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {events.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        whileHover={{ y: -8 }}
                        className="group"
                      >
                        <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-background to-background/80 backdrop-blur-sm cursor-pointer">
                          {/* Event Image */}
                          <div className="relative h-56 overflow-hidden">
                            <motion.img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t ${event.color} opacity-40`} />
                            
                            {/* Status Badge */}
                            <Badge className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-foreground gap-1.5 shadow-lg">
                              <Play className="w-3.5 h-3.5 fill-green-500 text-green-500" />
                              {event.status}
                            </Badge>
                          </div>

                          <CardContent className="p-6 space-y-4">
                            {/* Event Info */}
                            <div className="flex items-start gap-4">
                              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${event.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                <Gift className="w-7 h-7 text-white" />
                              </div>
                              <div className="flex-1 space-y-2">
                                <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                                  {event.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {event.description}
                                </p>
                              </div>
                            </div>

                            {/* Event Details */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex items-center gap-2 text-sm p-3 rounded-xl bg-muted/50">
                                <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                                <span className="font-medium">{event.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm p-3 rounded-xl bg-muted/50">
                                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                                <span className="font-medium truncate">{event.location}</span>
                              </div>
                            </div>

                            {/* Discount Badge */}
                            <Badge className={`bg-gradient-to-r ${event.color} text-white text-base px-4 py-2 w-full justify-center shadow-lg`}>
                              <Zap className="w-4 h-4 mr-2" />
                              {event.discount}
                            </Badge>

                            {/* Participants */}
                            <div className="flex items-center justify-between pt-3 border-t">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="w-4 h-4" />
                                <span>{event.participants.toLocaleString()} người tham gia</span>
                              </div>
                            </div>

                            {/* Action Button */}
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button 
                                className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 shadow-lg`}
                                onClick={() => navigate(`/events/${event.id}`)}
                              >
                                <SearchCheck className="w-4 h-4 mr-2" />
                                Xem chi tiết
                              </Button>
                            </motion.div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Hot Deals Section */}
                <section>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between mb-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold">Deal hot trong ngày</h2>
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse">
                        <Flame className="w-3.5 h-3.5 mr-1" />
                        HOT
                      </Badge>
                    </div>
                    <Button variant="outline" className="hidden md:flex items-center gap-2 border-2">
                      Xem tất cả
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {hotDeals.map((deal, index) => (
                      <motion.div
                        key={deal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -8 }}
                        className="group"
                      >
                        <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-background to-background/80 backdrop-blur-sm relative">
                          {/* Discount Badge */}
                          <motion.div
                            className="absolute top-3 right-3 z-10"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-lg px-4 py-2 shadow-lg border-2 border-white">
                              <Zap className="w-4 h-4 mr-1" />
                              -{deal.discount}%
                            </Badge>
                          </motion.div>

                          {/* Save Button */}
                          <motion.button
                            className="absolute top-3 left-3 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleSave(deal.id)}
                          >
                            <Heart className={`w-5 h-5 ${savedItems.has(deal.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          </motion.button>

                          {/* Product Image */}
                          <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
                            <motion.img
                              src={deal.image}
                              alt={deal.title}
                              className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                            />
                            
                            {/* Low Stock Warning */}
                            {deal.stock <= 20 && (
                              <motion.div
                                className="absolute bottom-3 left-3 right-3"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                              >
                                <Badge className="bg-red-500/90 backdrop-blur-sm text-white w-full justify-center py-1.5 shadow-lg">
                                  <Flame className="w-3.5 h-3.5 mr-1 animate-pulse" />
                                  Chỉ còn {deal.stock} sản phẩm!
                                </Badge>
                              </motion.div>
                            )}
                          </div>

                          <CardContent className="p-5 space-y-3">
                            {/* Seller Info */}
                            <div className="flex items-center gap-2">
                              <img 
                                src={deal.seller.avatar} 
                                alt={deal.seller.name} 
                                className="w-8 h-8 rounded-full border-2 border-primary shadow-md" 
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                  <span className="text-sm font-semibold truncate">
                                    {deal.seller.name}
                                  </span>
                                  {deal.seller.verified && (
                                    <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500 flex-shrink-0" />
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span>{deal.seller.rating}</span>
                                </div>
                              </div>
                            </div>

                            {/* Product Name */}
                            <h3 className="font-bold text-base line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
                              {deal.title}
                            </h3>

                            {/* Prices */}
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                  {deal.salePrice}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                  {deal.originalPrice}
                                </span>
                              </div>
                            </div>

                            {/* Time & Sold */}
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-semibold">
                                <Clock className="w-4 h-4" />
                                <span>Còn {deal.timeLeft}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span>Đã bán {deal.sold}</span>
                              </div>
                            </div>

                            {/* Action Button */}
                            <motion.div 
                              whileHover={{ scale: 1.02 }} 
                              whileTap={{ scale: 0.98 }}
                              className="pt-2"
                            >
                              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 shadow-lg">
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Mua ngay
                              </Button>
                            </motion.div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </section>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="mt-8">
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Đang phát triển</h3>
                  <p className="text-muted-foreground">Nội dung chi tiết sẽ sớm được cập nhật</p>
                </div>
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events" className="mt-8">
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Đang phát triển</h3>
                  <p className="text-muted-foreground">Danh sách sự kiện sẽ sớm được cập nhật</p>
                </div>
              </TabsContent>

              {/* Deals Tab */}
              <TabsContent value="deals" className="mt-8">
                <div className="text-center py-12">
                  <Zap className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Đang phát triển</h3>
                  <p className="text-muted-foreground">Danh sách deal hot sẽ sớm được cập nhật</p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Discover;