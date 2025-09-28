import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Plus, TrendingUp, Users, HelpCircle, BookOpen, Sparkles, Eye, Bookmark, ShoppingCart, Tag } from "lucide-react";
import { useState } from "react";
import CreatePostModal from "@/components/CreatePostModal";
import CreateQuestionModal from "@/components/CreateQuestionModal";

const Community = () => {
  const trendingTopics = [
    { name: "#ReviewSảnPhẩm", posts: 1250 },
    { name: "#TipsMuaSắm", posts: 890 },
    { name: "#LocalBrand", posts: 650 },
    { name: "#FlashSale", posts: 450 },
  ];

  const [posts, setPosts] = useState([
    {
      id: 1,
      type: "review",
      user: {
        name: "Minh Anh",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        verified: true,
        followers: 2400
      },
      content: "Vừa mua được chiếc áo sơ mi từ local brand ABC, chất lượng quá tuyệt vời! Vải cotton mềm mại, form dáng chuẩn đẹp. Recommend cho mọi người nhé! 💯",
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80",
      likes: 124,
      comments: 23,
      shares: 12,
      views: 1203,
      time: "2 giờ trước",
      tags: ["#ReviewSảnPhẩm", "#LocalBrand"],
      featuredProduct: {
        name: "Áo sơ mi Local Brand ABC",
        price: "349000",
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=80&h=80&fit=crop",
      }
    },
    {
      id: 2,
      type: "question",
      user: {
        name: "Thuỳ Linh",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
        verified: false,
        followers: 156
      },
      title: "Tìm son lâu trôi giá học sinh",
      content: "Ai biết shop nào bán son lâu trôi mà giá học sinh không? Em đang tìm màu nude nhẹ nhàng phù hợp đi học 🥺",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      likes: 89,
      comments: 45,
      shares: 8,
      views: 892,
      time: "4 giờ trước",
      tags: ["#TipsMuaSắm", "#CầnTuVấn"],
      answers: 12
    },
    {
      id: 3,
      type: "sharing",
      user: {
        name: "Đức Anh",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        verified: true,
        followers: 5200
      },
      content: "Flash sale hôm nay có quá nhiều deal hot! Vừa săn được điện thoại giảm 30%, máy tính bảng giảm 25%. Ae nhanh tay lên! ⚡",
      image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
      likes: 267,
      comments: 56,
      shares: 34,
      views: 3421,
      time: "6 giờ trước",
      tags: ["#FlashSale", "#TipsMuaSắm"],
      featuredProduct: {
        name: "Điện thoại Flash Sale",
        price: "5990000",
        image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=80&h=80&fit=crop",
      }
    },
    {
      id: 4,
      type: "livestream",
      user: {
        name: "Shop Thời Trang Kim",
        avatar: "https://randomuser.me/api/portraits/women/12.jpg",
        verified: true,
        followers: 8900
      },
      content: "🔴 LIVE: Đang livestream review bộ sưu tập mùa đông mới! Có voucher giảm 50% cho 50 khách hàng đầu tiên! 🎁",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
      likes: 445,
      comments: 128,
      shares: 67,
      views: 2156,
      time: "đang live",
      tags: ["#Livestream", "#ThoiTrang", "#GiamGia"],
      isLive: true
    },
    {
      id: 5,
      type: "tutorial",
      user: {
        name: "Beauty Guru Linh",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        verified: true,
        followers: 15600
      },
      title: "Cách chọn kem chống nắng phù hợp với từng loại da",
      content: "Hôm nay mình sẽ chia sẻ tips chọn kem chống nắng dựa trên loại da và budget của mọi người. Từ da khô, da dầu đến da hỗn hợp đều có cách chọn riêng nhé! ☀️",
      image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
      likes: 678,
      comments: 234,
      shares: 156,
      views: 4567,
      time: "1 ngày trước",
      tags: ["#LamDep", "#Tutorial", "#KemChongNang"]
    }
  ]);

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateQuestionOpen, setIsCreateQuestionOpen] = useState(false);

  const communityStats = [
    { label: "Thành viên", value: "2.4M+", icon: Users },
    { label: "Bài viết", value: "156K+", icon: BookOpen },
    { label: "Câu hỏi", value: "45K+", icon: HelpCircle },
  ];

  const handlePostCreated = (newPost: any) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleQuestionCreated = (newQuestion: any) => {
    setPosts(prev => [newQuestion, ...prev]);
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "question": return <HelpCircle className="w-4 h-4 text-accent" />;
      case "livestream": return <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />;
      case "tutorial": return <BookOpen className="w-4 h-4 text-success" />;
      default: return null;
    }
  };

  const getPostTypeBadge = (post: any) => {
    if (post.type === "question") {
      return <Badge variant="outline" className="text-xs border-accent text-accent">Câu hỏi</Badge>;
    }
    if (post.type === "livestream" && post.isLive) {
      return <Badge className="text-xs bg-red-500 animate-pulse">🔴 LIVE</Badge>;
    }
    if (post.type === "tutorial") {
      return <Badge variant="outline" className="text-xs border-success text-success">Hướng dẫn</Badge>;
    }
    return null;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-left space-y-3 max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Cộng đồng VibeMarket
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Chia sẻ, thảo luận và kết nối với hàng triệu người dùng
            </p>
            {/* Community Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-8"
            >
              {communityStats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <stat.icon className="w-5 h-5 text-accent" />
                    <span className="text-2xl font-bold text-accent">{stat.value}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Trending Topics */}
              <Card className="p-6 bg-gradient-card border-border">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-card-foreground">Xu hướng</h3>
                </div>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <motion.div
                      key={topic.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between cursor-pointer hover:bg-accent/10 p-2 rounded-lg transition-smooth"
                    >
                      <span className="text-sm font-medium text-card-foreground">{topic.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {topic.posts}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6 bg-gradient-card border-border">
                <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  Hành động nhanh
                </h3>
                <div className="space-y-2">
                  <Button
                    className="w-full gap-3"
                    variant="outline"
                    onClick={() => setIsCreatePostOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Tạo bài viết
                  </Button>
                  <Button
                    className="w-full gap-2"
                    variant="outline"
                    onClick={() => setIsCreateQuestionOpen(true)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Đặt câu hỏi
                  </Button>
                </div>
              </Card>
            </div>

            {/* Enhanced Main Feed */}
            <div className="lg:col-span-3 space-y-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-gradient-card border-border hover-lift group">
                    {/* Enhanced User Info */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={post.user.avatar} />
                          <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                        </Avatar>
                        {post.type === "livestream" && post.isLive && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-card" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-card-foreground">{post.user.name}</h4>
                          {post.user.verified && (
                            <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                              <span className="text-xs text-accent-foreground">✓</span>
                            </div>
                          )}
                          {getPostTypeIcon(post.type)}
                          {getPostTypeBadge(post)}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{post.time}</span>
                          <span>•</span>
                          <span>{post.user.followers} người theo dõi</span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Content */}
                    <div className="space-y-4">
                      {post.title && (
                        <h3 className="text-lg font-semibold text-card-foreground">
                          {post.title}
                        </h3>
                      )}

                      <p className="text-card-foreground leading-relaxed">{post.content}</p>

                      {post.image && (
                        <div className="relative overflow-hidden rounded-lg">
                          <img
                            src={post.image}
                            alt="Post content"
                            className="w-full object-contain bg-white group-hover:scale-105 transition-smooth"
                          />
                          {post.type === "livestream" && post.isLive && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium animate-pulse">
                              🔴 LIVE
                            </div>
                          )}
                        </div>
                      )}

                      {/* Enhanced Tags */}
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs hover:bg-accent/20 cursor-pointer transition-smooth">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Sản phẩm nổi bật */}
                      {post.featuredProduct && (
                        <div className="bg-neutral-900 rounded-lg p-4 mb-4">
                          <div className="flex items-center mb-3">
                            <Tag className="h-4 w-4 text-primary mr-2" />
                            <span className="text-sm font-medium text-white">Sản phẩm nổi bật</span>
                          </div>
                          <div className="flex flex-col sm:flex-row items-center sm:items-stretch sm:justify-between bg-neutral-900 rounded-lg p-4 gap-4">
                            {/* Sản phẩm */}
                            <div className="flex items-center w-full sm:w-auto justify-center sm:justify-start">
                              <img
                                src={post.featuredProduct.image}
                                alt={post.featuredProduct.name}
                                className="w-16 h-16 sm:w-14 sm:h-14 rounded-lg object-cover border border-white/10"
                              />
                              <div className="ml-3 text-center sm:text-left flex-1 sm:flex-initial">
                                <p className="text-sm font-medium text-white line-clamp-1">
                                  {post.featuredProduct.name}
                                </p>
                                <p className="text-lg font-bold text-primary">
                                  {/* {post.featuredProduct.price} */}
                                  {formatPrice(post.featuredProduct.price)}
                                </p>
                              </div>
                            </div>

                            {/* Nút thêm giỏ */}
                            <Button
                              size="sm"
                              className="bg-primary text-white hover:bg-primary/80 w-full sm:w-auto flex items-center justify-center"
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Thêm vào giỏ
                            </Button>
                          </div>

                        </div>
                      )}

                      {/* Enhanced Actions with Views and Answers */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-6">
                          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-smooth">
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-accent hover:bg-accent/10 transition-smooth">
                            <MessageCircle className="w-4 h-4" />
                            {post.type === "question" ? `${post.answers} trả lời` : `${post.comments} bình luận`}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth">
                            <Share2 className="w-4 h-4" />
                            {post.shares}
                          </Button>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views}
                          </div>
                          <Button variant="ghost" size="sm" className="p-1 hover:text-accent">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
      {/* Modals */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostCreated={handlePostCreated}
      />

      <CreateQuestionModal
        isOpen={isCreateQuestionOpen}
        onClose={() => setIsCreateQuestionOpen(false)}
        onQuestionCreated={handleQuestionCreated}
      />
    </div>
  );
};

export default Community;