"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  Heart,
  MessageCircle,
  Share2,
  Plus,
  TrendingUp,
  Users,
  HelpCircle,
  BookOpen,
  Sparkles,
  Eye,
  Bookmark,
  ShoppingCart,
  Tag,
} from "lucide-react";

import CreatePostModal from "@/components/CreatePostModal";
import CreateQuestionModal from "@/components/CreateQuestionModal";

type PostType = "review" | "question" | "sharing" | "livestream" | "tutorial";

interface PostUser {
  name: string;
  avatar?: string;
  verified?: boolean;
  followers: number;
}

interface FeaturedProduct {
  name: string;
  price: number;
  image: string;
}

interface Post {
  id: number;
  type: PostType;
  user: PostUser;
  title?: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  views: number;
  time: string;
  tags: string[];
  featuredProduct?: FeaturedProduct | null;
  isLive?: boolean;
  answers?: number;
  liked?: boolean;
  isSaved?: boolean;
}

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost/VIBE_MARKET_BACKEND/VibeMarket-BE";

const randomType = (): PostType => {
  const arr: PostType[] = ["review", "question", "sharing"];
  return arr[Math.floor(Math.random() * arr.length)];
};

const Community = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const [token, setToken] = useState<string | null>(null);

  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateQuestionOpen, setIsCreateQuestionOpen] = useState(false);

  const [likeLoadingId, setLikeLoadingId] = useState<number | null>(null);
  const [saveLoadingId, setSaveLoadingId] = useState<number | null>(null);
  const [shareLoadingId, setShareLoadingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const openDetail = (id: number) => {
    navigate(`/community/${id}`);
  };

  const trendingTopics = [
    { name: "#ReviewSảnPhẩm", posts: 1250 },
    { name: "#TipsMuaSắm", posts: 890 },
    { name: "#LocalBrand", posts: 650 },
    { name: "#FlashSale", posts: 450 },
  ];

  const communityStats = [
    { label: "Thành viên", value: "2.4M+", icon: Users },
    { label: "Bài viết", value: "156K+", icon: BookOpen },
    { label: "Câu hỏi", value: "45K+", icon: HelpCircle },
  ];

  const mapTypeFromCategoryId = (category_id: number | null): PostType => {
    switch (category_id) {
      case 1:
        return "review";
      case 2:
        return "question";
      case 3:
        return "sharing";
      case 4:
        return "livestream";
      default:
        return randomType();
    }
  };

  const formatTime = (created_at?: string) => {
    if (!created_at) return "";
    try {
      const d = new Date(created_at);
      if (isNaN(d.getTime())) return created_at;
      return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return created_at;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("vibeventure_token");

        const res = await fetch(
          `${BACKEND_URL}/api/community/list.php?page=1&limit=20`,
          {
            cache: "no-store",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch community posts");
        }

        const json = await res.json();

        if (!json.success || !Array.isArray(json.posts)) {
          setPosts([]);
          return;
        }

        const formatted: Post[] = json.posts.map((p: any) => {
          const type = mapTypeFromCategoryId(
            p.category_id ? Number(p.category_id) : null
          );

          return {
            id: Number(p.id),
            type,
            user: {
              name: p.author_name || "Người dùng ẩn danh",
              avatar: p.author_avatar || undefined,
              verified: false,
              followers: 0,
            },
            title: p.title || "",
            content: p.content || "",
            image: p.thumbnail || undefined,
            likes: Number(p.likes || 0),
            comments: Number(p.comments || 0),
            shares: Number(p.shares || 0),
            saves: Number(p.saves || 0),
            views: Number(p.views || 0),
            time: formatTime(p.created_at),
            tags: [],
            featuredProduct: null,
            isLive: type === "livestream",
            answers:
              type === "question"
                ? Number(p.answers || p.comments || 0)
                : undefined,
            liked: Number(p.is_liked) === 1,
            isSaved: Number(p.is_saved) === 1,
          };
        });

        setPosts(formatted);
      } catch (err) {
        console.error(err);
        setError("Không tải được bài viết cộng đồng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);
  useEffect(() => {
    const t = localStorage.getItem("vibeventure_token");
    setToken(t);
  }, []);
  if (!token) {
    return <div className="text-center py-10">Đang tải...</div>;
  }
  const handleToggleLike = async (postId: number) => {
    try {
      setLikeLoadingId(postId);

      const res = await fetch(`${BACKEND_URL}/api/community/like.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ post_id: postId }),
      });

      const data = await res.json();

      if (!data.success) {
        console.error("Like error:", data);
        return;
      }

      const liked: boolean = !!data.liked;

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                liked,
                likes: liked ? p.likes + 1 : Math.max(0, p.likes - 1),
              }
            : p
        )
      );
    } catch (err) {
      console.error("Like API error:", err);
    } finally {
      setLikeLoadingId(null);
    }
  };
  const handleToggleSave = async (postId: number) => {
    const token = localStorage.getItem("vibeventure_token");
    if (!token) return;

    try {
      setSaveLoadingId(postId);

      const res = await fetch(`${BACKEND_URL}/api/community/save.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ post_id: postId }),
      });

      const data = await res.json();

      if (!data.success) {
        console.error("Save error:", data);
        return;
      }

      const saved: boolean = !!data.saved;

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                isSaved: saved,
                saves: saved ? p.saves + 1 : Math.max(0, p.saves - 1),
              }
            : p
        )
      );
    } catch (err) {
      console.error("Save API error:", err);
    } finally {
      setSaveLoadingId(null);
    }
  };
  const handleShare = async (post: Post) => {
    try {
      setShareLoadingId(post.id);
      await fetch(`${BACKEND_URL}/api/community/share.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },

        body: JSON.stringify({
          post_id: post.id,
          platform: "internal",
        }),
      }).catch((err) => {
        console.error("Share API error:", err);
      });
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, shares: p.shares + 1 } : p))
      );
      if (navigator.share) {
        try {
          await navigator.share({
            title: post.title || "Bài viết cộng đồng",
            text: post.content,
            url: window.location.href,
          });
        } catch (err) {
          console.log("User cancelled native share:", err);
        }
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Đã copy link bài viết vào clipboard!");
      }
    } catch (err) {
      console.error("Share error:", err);
    } finally {
      setShareLoadingId(null);
    }
  };
  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleQuestionCreated = (newQuestion: Post) => {
    setPosts((prev) => [newQuestion, ...prev]);
  };

  const getPostTypeIcon = (type: PostType) => {
    switch (type) {
      case "question":
        return <HelpCircle className="w-4 h-4 text-accent" />;
      case "livestream":
        return (
          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        );
      case "tutorial":
        return <BookOpen className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getPostTypeBadge = (post: Post) => {
    if (post.type === "question") {
      return (
        <Badge variant="outline" className="text-xs border-accent text-accent">
          Câu hỏi
        </Badge>
      );
    }
    if (post.type === "livestream" && post.isLive) {
      return (
        <Badge className="text-xs bg-red-500 animate-pulse">🔴 LIVE</Badge>
      );
    }
    if (post.type === "tutorial") {
      return (
        <Badge
          variant="outline"
          className="text-xs border-green-500 text-green-500"
        >
          Hướng dẫn
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="h-screen bg-background overflow-hidden">
      <main className="container mx-auto px-4 py-6 h-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-6 h-full"
        >
          <div className="hidden lg:block w-[260px] h-full overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 min-w-[40px] rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent leading-tight">
                    Cộng đồng VibeMarket
                  </h1>
                </div>

                <p className="text-sm text-muted-foreground">
                  Chia sẻ, thảo luận và kết nối với hàng triệu người dùng.
                </p>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                  {communityStats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <span className="block text-lg font-bold text-accent">
                        {stat.value}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <Card className="p-4 bg-gradient-card border-border">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-card-foreground">
                    Xu hướng
                  </h3>
                </div>
                <div className="space-y-3">
                  {trendingTopics.map((topic) => (
                    <div
                      key={topic.name}
                      className="flex items-center justify-between cursor-pointer hover:bg-accent/10 p-2 rounded-lg transition-smooth"
                    >
                      <span className="text-sm font-medium text-card-foreground truncate max-w-[120px]">
                        {topic.name}
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        {topic.posts}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-4 bg-gradient-card border-border">
                <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  Hành động nhanh
                </h3>
                <div className="space-y-2">
                  <Button
                    className="w-full gap-2 text-sm"
                    variant="outline"
                    onClick={() => setIsCreatePostOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Tạo bài viết
                  </Button>
                  <Button
                    className="w-full gap-2 text-sm"
                    variant="outline"
                    onClick={() => setIsCreateQuestionOpen(true)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Đặt câu hỏi
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          <div className="flex-1 h-full overflow-y-auto px-1 custom-scrollbar no-scrollbar">
            <div className="space-y-6">
              {loading && (
                <div className="text-center text-muted-foreground py-10">
                  Đang tải bài viết cộng đồng...
                </div>
              )}

              {error && !loading && (
                <div className="text-center text-red-500 py-6 text-sm">
                  {error}
                </div>
              )}

              {!loading && !error && posts.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                  Chưa có bài viết nào.
                </div>
              )}

              {!loading &&
                !error &&
                posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-6 bg-gradient-card border-border  group">
                     
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={post.user.avatar} />
                            <AvatarFallback>
                              {post.user.name?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          {post.type === "livestream" && post.isLive && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-card" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-card-foreground">
                              {post.user.name}
                            </h4>
                            {post.user.verified && (
                              <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                                <span className="text-xs text-accent-foreground">
                                  ✓
                                </span>
                              </div>
                            )}
                            {getPostTypeIcon(post.type)}
                            {getPostTypeBadge(post)}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            {post.time && <span>{post.time}</span>}
                            <span>•</span>
                            <span>
                              {post.user.followers.toLocaleString("vi-VN")}{" "}
                              người theo dõi
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {post.title && post.title.trim() !== "" && (
                          <h3 className="text-lg font-semibold text-card-foreground">
                            {post.title}
                          </h3>
                        )}

                        <p className="text-card-foreground leading-relaxed">
                          {post.content}
                        </p>

                        {post.image && (
                          <div
                            className="relative rounded-lg bg-white flex items-center justify-center cursor-pointer group max-h-[260px] sm:max-h-[420px] overflow-hidden"
                            onClick={() => {
                              setLightboxImage(post.image);
                              setLightboxOpen(true);
                            }}
                          >
                            <img
                              src={post.image}
                              alt="Post content"
                              className="max-h-[260px] sm:max-h-[420px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                            {post.type === "livestream" && post.isLive && (
                              <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium animate-pulse">
                                🔴 LIVE
                              </div>
                            )}
                          </div>
                        )}

                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs hover:bg-accent/20 cursor-pointer transition-smooth"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {post.featuredProduct && (
                          <div className="bg-neutral-900 rounded-lg p-4 mb-4">
                            <div className="flex items-center mb-3">
                              <Tag className="h-4 w-4 text-primary mr-2" />
                              <span className="text-sm font-medium text-white">
                                Sản phẩm nổi bật
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center sm:items-stretch sm:justify-between bg-neutral-900 rounded-lg p-4 gap-4">
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
                                    {formatPrice(post.featuredProduct.price)}
                                  </p>
                                </div>
                              </div>

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

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-border gap-3 sm:gap-0">
                          <div className="flex justify-between sm:justify-start sm:gap-6 w-full sm:w-auto">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={likeLoadingId === post.id}
                              onClick={() => handleToggleLike(post.id)}
                              className={`gap-2 text-muted-foreground flex-1 sm:flex-none justify-center hover:bg-red-500/10 transition-smooth ${
                                post.liked
                                  ? "text-red-500"
                                  : "hover:text-red-500"
                              }`}
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  post.liked ? "fill-red-500" : ""
                                }`}
                              />
                              {post.likes}
                            </Button>

                            <Button
                             onClick={() => openDetail(post.id)}
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-muted-foreground hover:text-accent hover:bg-accent/10 transition-smooth flex-1 sm:flex-none justify-center"
                            >
                     
                              <MessageCircle className="w-4 h-4" />
                              {post.type === "question"
                                ? `${post.answers ?? post.comments} trả lời`
                                : `${post.comments} bình luận`}
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={shareLoadingId === post.id}
                              onClick={() => handleShare(post)}
                              className="gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth flex-1 sm:flex-none justify-center"
                            >
                              <Share2 className="w-4 h-4" />
                              {post.shares}
                            </Button>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4 text-xs text-muted-foreground w-full sm:w-auto">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={saveLoadingId === post.id}
                              onClick={() => handleToggleSave(post.id)}
                              className={`p-1 hover:text-yellow-500 hover:bg-[#fcf0c3]
                              ${post.isSaved ? "text-yellow-500" : ""}`}
                            >
                              <Bookmark
                                className={`w-4 h-4 ${
                                  post.isSaved ? "fill-current" : ""
                                }`}
                              />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </div>
          <div className="hidden lg:block w-[260px] h-full overflow-y-auto pl-2 custom-scrollbar">
            <Card className="p-4 bg-gradient-card border-border">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                Thành viên đang hoạt động
              </h3>

              <div className="space-y-3">
                {[
                  "Nguyễn Kỳ Vy",
                  "Thiên Bảo",
                  "Khánh Ly",
                  "Hoàng Thư",
                  "Gia Hưng",
                  "Minh Tâm",
                  "Tuấn Anh",
                  "Nguyễn Kỳ Vy",
                  "Thiên Bảo",
                  "Khánh Ly",
                  "Hoàng Thư",
                  "Gia Hưng",
                  "Minh Tâm",
                  "Tuấn Anh",
                  "Nguyễn Kỳ Vy",
                  "Thiên Bảo",
                  "Khánh Ly",
                  "Hoàng Thư",
                  "Gia Hưng",
                  "Minh Tâm",
                  "Tuấn Anh",
                ].map((name, i) => (
                  <div className="flex items-center gap-3" key={`${name}-${i}`}>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                    </div>
                    <span className="text-sm">{name}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
        
      </main>
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
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <img
            src={lightboxImage!}
            alt="Fullscreen"
            className="max-w-[95%] max-h-[95%] object-contain rounded-lg"
          />

          <button
            className="absolute top-6 right-6 text-white text-3xl"
            onClick={() => setLightboxOpen(false)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default Community;
