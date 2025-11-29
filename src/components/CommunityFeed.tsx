import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Play,
  Users,
  TrendingUp,
  Tag,
  ShoppingCart,
  Sparkles,
  CheckCircle2,
  Eye,
  Send,
  StarIcon,
  TrendingDown,
  Activity,
  Hash
} from "lucide-react";
import { useState } from "react";

const CommunityFeed = () => {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [savedPosts, setSavedPosts] = useState<number[]>([]);

  const posts = [
    {
      id: 1,
      author: {
        name: "Minh Anh",
        username: "@minhanh_review",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop",
        verified: true,
        badge: "Top Reviewer",
        badgeColor: "from-amber-500 to-orange-500",
      },
      content: "Review chi tiết về chiếc áo hoodie local brand này! Chất liệu cotton 100%, form dáng oversized rất đẹp. Đáng đồng tiền bát gạo 🔥",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=500&fit=crop",
      type: "review",
      likes: 234,
      comments: 45,
      shares: 12,
      views: 1200,
      timeAgo: "2 giờ trước",
      tags: ["#localbrand", "#hoodie", "#review"],
      featuredProduct: {
        name: "Áo Hoodie Local Brand",
        price: "299.000",
        originalPrice: "399.000",
        discount: 25,
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=80&h=80&fit=crop",
      }
    },
    {
      id: 2,
      author: {
        name: "Tech Guru",
        username: "@techguru_vn",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        verified: true,
        badge: "Tech Expert",
        badgeColor: "from-blue-500 to-cyan-500",
      },
      content: "Livestream unboxing iPhone 15 Pro Max lúc 20h tối nay! Ai cần tư vấn thì vào xem nhé 📱✨",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=500&fit=crop",
      type: "livestream",
      likes: 567,
      comments: 89,
      shares: 34,
      views: 5600,
      timeAgo: "4 giờ trước",
      tags: ["#iPhone15", "#unboxing", "#livestream"],
      isLive: true,
      viewers: 1234,
      featuredProduct: {
        name: "iPhone 15 Pro Max",
        price: "29.990.000",
        originalPrice: null,
        discount: 0,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=80&fit=crop",
      }
    },
    {
      id: 3,
      author: {
        name: "Fashion Lover",
        username: "@fashion_style",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        verified: false,
        badge: null,
        badgeColor: null,
      },
      content: "Outfit of the day 💫 Mix & match với những món đồ vintage tìm được ở chợ đêm. Style retro đang comeback mạnh!",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=500&fit=crop",
      type: "photo",
      likes: 432,
      comments: 67,
      shares: 23,
      views: 2100,
      timeAgo: "6 giờ trước",
      tags: ["#OOTD", "#vintage", "#fashion"],
    },
    {
      id: 4,
      author: {
        name: "Gamer Zone",
        username: "@gamer_zone",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        verified: true,
        badge: "Gaming Pro",
        badgeColor: "from-green-500 to-emerald-500",
      },
      content: "Setup gaming mới hoàn thiện! RTX 4080 + i7 13700K. Ai muốn build PC tương tự thì inbox tư vấn nhé 🎮",
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=500&fit=crop",
      type: "photo",
      likes: 789,
      comments: 156,
      shares: 45,
      views: 3400,
      timeAgo: "8 giờ trước",
      tags: ["#gaming", "#PC", "#setup"],
    },
  ];

  const toggleLike = (postId: number) => {
    setLikedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleSave = (postId: number) => {
    setSavedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex flex-col items-center justify-center mb-6">
            {/* Animated Icon Container */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.8 }}
              className="relative mb-4"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-50"
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
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-2xl">
                <Users className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
              Cộng đồng{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Sôi động
              </span>
            </h2>

            <motion.div
              className="flex items-center justify-center gap-2 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.div
                className="h-1 w-16 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "4rem" }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              ></motion.div>
              <motion.div
                className="h-1.5 w-8 bg-gradient-to-r from-primary to-purple-600 rounded-full"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4, type: "spring" }}
              ></motion.div>
              <motion.div
                className="h-1 w-16 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "4rem" }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              ></motion.div>
            </motion.div>

            {/* Subtitle */}
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
              Kết nối, chia sẻ và khám phá từ cộng đồng người dùng đam mê mua sắm
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">{posts.length}</div>
                  <div className="text-xs text-muted-foreground">Bài viết</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">2.1K</div>
                  <div className="text-xs text-muted-foreground">Tương tác</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Feed */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <Card className="relative overflow-hidden border-2 border-border/50 hover:border-primary/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300">
                    {/* Top Border Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-600" />

                    {/* Glow Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    <CardHeader className="pb-4 relative">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {/* Avatar with Ring */}
                          <div className="relative">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="relative"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm opacity-50" />
                              <Avatar className="relative ring-2 ring-primary/30 w-12 h-12">
                                <AvatarImage src={post.author.avatar} />
                                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                              </Avatar>
                            </motion.div>
                            {post.author.verified && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-card shadow-lg"
                              >
                                <CheckCircle2 className="w-3 h-3 text-white" />
                              </motion.div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-foreground">
                                {post.author.name}
                              </h4>
                              {post.author.badge && (
                                <Badge className={`bg-gradient-to-r ${post.author.badgeColor} text-white text-xs px-2 py-0.5 border-0 shadow-md`}>
                                  {post.author.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              {post.author.username}
                              <span>•</span>
                              {post.timeAgo}
                            </p>
                          </div>
                        </div>

                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </motion.div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 relative">
                      {/* Content */}
                      <p className="text-foreground leading-relaxed text-base">
                        {post.content}
                      </p>

                      {/* Image */}
                      {post.image && (
                        <div className="relative rounded-xl overflow-hidden group/image">
                          <motion.img
                            src={post.image}
                            alt="Post content"
                            className="w-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                          />

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />

                          {/* Live Badge */}
                          {post.isLive && (
                            <div className="absolute top-4 left-4 flex items-center gap-2">
                              <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white border-0 shadow-lg">
                                <motion.span
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                  className="w-2 h-2 bg-white rounded-full mr-2 inline-block"
                                />
                                LIVE
                              </Badge>
                              <Badge className="bg-black/70 backdrop-blur-md text-white border-0 shadow-lg">
                                <Eye className="w-3 h-3 mr-1" />
                                {post.viewers?.toLocaleString()}
                              </Badge>
                            </div>
                          )}

                          {/* Play Button Overlay */}
                          {post.type === "livestream" && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  size="lg"
                                  className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-2 border-white/30 shadow-2xl rounded-full px-8 py-6"
                                >
                                  <Play className="w-6 h-6 mr-2 fill-white" />
                                  Xem ngay
                                </Button>
                              </motion.div>
                            </motion.div>
                          )}

                          {/* Shine Effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/image:opacity-100"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '200%' }}
                            transition={{ duration: 0.6 }}
                          />
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <motion.div
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Badge
                              variant="outline"
                              className="border-primary/50 text-primary hover:bg-primary/10 cursor-pointer transition-all duration-300 px-3 py-1"
                            >
                              {tag}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>

                      {/* Featured Product */}
                      {post.featuredProduct && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="relative"
                        >
                          <Card className="border-border/50 bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />

                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Tag className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-semibold text-foreground">
                                  Sản phẩm nổi bật
                                </span>
                              </div>

                              <div className="flex items-center justify-between gap-4">
                                {/* Product Info */}
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="relative">
                                    <motion.div
                                      whileHover={{ scale: 1.05 }}
                                      className="relative"
                                    >
                                      <img
                                        src={post.featuredProduct.image}
                                        alt={post.featuredProduct.name}
                                        className="w-16 h-16 rounded-lg object-cover border-2 border-border/50 shadow-md"
                                      />
                                      {post.featuredProduct.discount > 0 && (
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                          <span className="text-white text-xs font-bold">
                                            -{post.featuredProduct.discount}%
                                          </span>
                                        </div>
                                      )}
                                    </motion.div>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-foreground line-clamp-1 mb-1">
                                      {post.featuredProduct.name}
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                        {post.featuredProduct.price}đ
                                      </span>
                                      {post.featuredProduct.originalPrice && (
                                        <span className="text-xs text-muted-foreground line-through">
                                          {post.featuredProduct.originalPrice}đ
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Add to Cart Button */}
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white shadow-lg whitespace-nowrap"
                                  >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Thêm
                                  </Button>
                                </motion.div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}

                      {/* Engagement Stats */}
                      <div className="flex items-center gap-4 py-3 border-t border-border/50">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="w-4 h-4" />
                          <span className="text-xs">{post.views}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                          <MessageCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-xs text-muted-foreground">
                            {post.likes + post.comments} lượt tương tác
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          {/* Like Button */}
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`transition-all duration-300 ${likedPosts.includes(post.id)
                                  ? "text-red-500 hover:text-red-600"
                                  : "text-muted-foreground hover:text-red-500"
                                }`}
                              onClick={() => toggleLike(post.id)}
                            >
                              <Heart
                                className={`w-5 h-5 mr-2 transition-all ${likedPosts.includes(post.id) ? "fill-red-500" : ""
                                  }`}
                              />
                              {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                            </Button>
                          </motion.div>

                          {/* Comment Button */}
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-blue-500 transition-colors"
                            >
                              <MessageCircle className="w-5 h-5 mr-2" />
                              {post.comments}
                            </Button>
                          </motion.div>

                          {/* Share Button */}
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-green-500 transition-colors"
                            >
                              <Send className="w-5 h-5 mr-2" />
                              {post.shares}
                            </Button>
                          </motion.div>
                        </div>

                        {/* Save Button */}
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`transition-all duration-300 ${savedPosts.includes(post.id)
                                ? "text-amber-500 hover:text-amber-600"
                                : "text-muted-foreground hover:text-amber-500"
                              }`}
                            onClick={() => toggleSave(post.id)}
                          >
                            <Bookmark
                              className={`w-5 h-5 transition-all ${savedPosts.includes(post.id) ? "fill-amber-500" : ""
                                }`}
                            />
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Trending Topics */}
            <Card className="border-2 border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />

              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="font-bold text-lg">Trending hôm nay</h3>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {[
                  { tag: "#iPhone15ProMax", count: "500K", trend: "up" },
                  { tag: "#LocalBrand", count: "400K", trend: "up" },
                  { tag: "#VintageStyle", count: "300K", trend: "down" },
                  { tag: "#GamingSetup", count: "200K", trend: "up" },
                  { tag: "#FlashSale", count: "100K", trend: "up" },
                ].map((trend, index) => (
                  <motion.div
                    key={trend.tag}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 5 }}
                    className="group cursor-pointer"
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                          <Hash className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-primary group-hover:underline">
                            {trend.tag}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {trend.count} bài viết
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {trend.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Suggested Users */}
            <Card className="border-2 border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="font-bold text-lg">Gợi ý kết bạn</h3>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {[
                  {
                    name: "Reviewer Pro",
                    username: "@reviewer_pro",
                    followers: "15K",
                    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
                    verified: true,
                  },
                  {
                    name: "Style Icon",
                    username: "@style_icon",
                    followers: "8.2K",
                    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
                    verified: false,
                  },
                  {
                    name: "Tech News",
                    username: "@tech_news",
                    followers: "25K",
                    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
                    verified: true,
                  },
                ].map((user, index) => (
                  <motion.div
                    key={user.username}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          {user.verified && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-card">
                              <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.followers} followers
                          </p>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white shadow-md"
                        >
                          Follow
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card className="border-2 border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />

              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-green-500" />
                  </div>
                  <h3 className="font-bold text-lg">Thành tích</h3>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-medium">Điểm tích lũy</span>
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    2,847
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">Xếp hạng</span>
                  </div>
                  <span className="text-lg font-bold text-green-500">
                    #156
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    <span className="text-sm font-medium">Bài viết yêu thích</span>
                  </div>
                  <span className="text-lg font-bold text-red-500">
                    {savedPosts.length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommunityFeed;