import { motion } from "framer-motion";
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
  TrendingUp
} from "lucide-react";

const CommunityFeed = () => {
  const posts = [
    {
      id: 1,
      author: {
        name: "Minh Anh",
        username: "@minhanh_review",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop",
        verified: true,
      },
      content: "Review chi tiết về chiếc áo hoodie local brand này! Chất liệu cotton 100%, form dáng oversized rất đẹp. Đáng đồng tiền bát gạo 🔥",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=400&fit=crop",
      type: "review",
      likes: 234,
      comments: 45,
      shares: 12,
      timeAgo: "2 giờ trước",
      tags: ["#localbrend", "#hoodie", "#review"],
    },
    {
      id: 2,
      author: {
        name: "Tech Guru",
        username: "@techguru_vn",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        verified: true,
      },
      content: "Livestream unboxing iPhone 15 Pro Max lúc 20h tối nay! Ai cần tư vấn thì vào xem nhé 📱✨",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=400&fit=crop",
      type: "livestream",
      likes: 567,
      comments: 89,
      shares: 34,
      timeAgo: "4 giờ trước",
      tags: ["#iPhone15", "#unboxing", "#livestream"],
      isLive: true,
      viewers: 1234,
    },
    {
      id: 3,
      author: {
        name: "Fashion Lover",
        username: "@fashion_style",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        verified: false,
      },
      content: "Outfit of the day 💫 Mix & match với những món đồ vintage tìm được ở chợ đêm. Style retro đang comeback mạnh!",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=400&fit=crop",
      type: "photo",
      likes: 432,
      comments: 67,
      shares: 23,
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
      },
      content: "Setup gaming mới hoàn thiện! RTX 4080 + i7 13700K. Ai muốn build PC tương tự thì inbox tư vấn nhé 🎮",
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=400&fit=crop",
      type: "photo",
      likes: 789,
      comments: 156,
      shares: 45,
      timeAgo: "8 giờ trước",
      tags: ["#gaming", "#PC", "#setup"],
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Cộng đồng <span className="bg-gradient-hero bg-clip-text text-transparent">Sôi động</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Kết nối, chia sẻ và khám phá từ cộng đồng người dùng đam mê mua sắm
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {posts.map((post) => (
              <motion.div key={post.id} variants={itemVariants}>
                <Card className="bg-gradient-card border-border hover-glow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="ring-2 ring-primary/20">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">
                              {post.author.name}
                            </h4>
                            {post.author.verified && (
                              <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {post.author.username} • {post.timeAgo}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-foreground leading-relaxed">
                      {post.content}
                    </p>

                    {post.image && (
                      <div className="relative rounded-lg overflow-hidden">
                        <img
                          src={post.image}
                          alt="Post content"
                          className="w-full h-64 object-cover"
                        />
                        {post.isLive && (
                          <div className="absolute top-4 left-4 flex items-center gap-2">
                            <Badge className="bg-destructive text-white animate-pulse">
                              🔴 LIVE
                            </Badge>
                            <Badge className="bg-black/50 text-white">
                              <Users className="w-3 h-3 mr-1" />
                              {post.viewers}
                            </Badge>
                          </div>
                        )}
                        {post.type === "livestream" && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Button 
                              size="lg" 
                              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20"
                            >
                              <Play className="w-5 h-5 mr-2" />
                              Xem ngay
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge 
                          key={tag}
                          variant="outline" 
                          className="border-accent text-accent hover:bg-accent/10 cursor-pointer transition-smooth"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-6">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive transition-colors">
                          <Heart className="w-4 h-4 mr-2" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent transition-colors">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary transition-colors">
                          <Share2 className="w-4 h-4 mr-2" />
                          {post.shares}
                        </Button>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-warning transition-colors">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Trending Topics */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <h3 className="font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Trending hôm nay
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {["#iPhone15ProMax", "#LocalBrand", "#VintageStyle", "#GamingSetup", "#FlashSale"].map((trend, index) => (
                  <div key={trend} className="flex items-center justify-between">
                    <span className="text-accent font-medium cursor-pointer hover:underline">
                      {trend}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {(5 - index) * 100}K
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Suggested Users */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <h3 className="font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Gợi ý kết bạn
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Reviewer Pro", username: "@reviewer_pro", followers: "15K" },
                  { name: "Style Icon", username: "@style_icon", followers: "8.2K" },
                  { name: "Tech News", username: "@tech_news", followers: "25K" },
                ].map((user) => (
                  <div key={user.username} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.followers} followers</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-gradient-primary">
                      Follow
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommunityFeed;