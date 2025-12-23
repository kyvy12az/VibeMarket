"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

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
  ChevronLeft,
  ChevronRight,
  X,
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
  id: number;
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
  images?: string[];
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  views: number;
  time: string;
  tags: string[];
  featuredProducts?: FeaturedProduct[];
  isLive?: boolean;
  answers?: number;
  liked?: boolean;
  isSaved?: boolean;
}

interface OnlineUser {
  id: number;
  name: string;
  avatar: string | null;
  status: 'online' | 'away' | 'offline';
  activity: string;
  last_seen: string;
}

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL;

const randomType = (): PostType => {
  const arr: PostType[] = ["review", "question", "sharing"];
  return arr[Math.floor(Math.random() * arr.length)];
};

const Community = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [token, setToken] = useState<string | null>(null);

  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [myPendingPosts, setMyPendingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateQuestionOpen, setIsCreateQuestionOpen] = useState(false);
  const [isPendingPostsModalOpen, setIsPendingPostsModalOpen] = useState(false);

  const [likeLoadingId, setLikeLoadingId] = useState<number | null>(null);
  const [saveLoadingId, setSaveLoadingId] = useState<number | null>(null);
  const [shareLoadingId, setShareLoadingId] = useState<number | null>(null);
  const [expandedProductsPostId, setExpandedProductsPostId] = useState<number | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
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
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${BACKEND_URL}/api/community/posts/list.php?page=1&limit=20`,
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
              name: p.author?.name || "Người dùng ẩn danh",
              avatar: p.author?.avatar || null,
              verified: false,
              followers: 0,
            },
            title: p.title || "",
            content: p.content || "",

            // ✔ LẤY MẢNG ẢNH ĐÚNG
            images: Array.isArray(p.images) ? p.images : [],

            likes: Number(p.likes || 0),
            comments: Number(p.comments || 0),
            shares: Number(p.shares || 0),
            saves: Number(p.saves || 0),
            views: Number(p.views || 0),
            time: formatTime(p.created_at),
            tags: p.tags || [],
            featuredProducts: Array.isArray(p.featured_products) ? p.featured_products : [],
            isLive: type === "livestream",
            answers:
              type === "question"
                ? Number(p.answers || p.comments || 0)
                : undefined,
            liked: Boolean(p.is_liked),
            isSaved: Boolean(p.is_saved),
          };
        });

        setPosts(formatted);

        // Fetch user's pending posts
        try {
          const pendingRes = await fetch(
            `${BACKEND_URL}/api/community/posts/my_posts.php?status=pending`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );

          if (pendingRes.ok) {
            let pendingJson;
            try {
              pendingJson = await pendingRes.json();
            } catch (parseError) {
              console.error("Failed to parse pending posts JSON:", parseError);
              setMyPendingPosts([]);
            }

            if (pendingJson && pendingJson.success && Array.isArray(pendingJson.posts)) {
              const pendingFormatted: Post[] = pendingJson.posts.map((p: any) => ({
                id: Number(p.id),
                type: "sharing" as PostType,
                user: {
                  name: p.author?.name || "Bạn",
                  avatar: p.author?.avatar || null,
                  verified: false,
                  followers: 0,
                },
                title: p.title || "",
                content: p.content || "",
                images: Array.isArray(p.images) ? p.images : [],
                likes: Number(p.likes || 0),
                comments: Number(p.comments || 0),
                shares: Number(p.shares || 0),
                saves: Number(p.saves || 0),
                views: Number(p.views || 0),
                time: formatTime(p.created_at),
                tags: p.tags || [],
                featuredProducts: [],
                isLive: false,
                liked: Boolean(p.is_liked),
                isSaved: Boolean(p.is_saved),
              }));

              setMyPendingPosts(pendingFormatted);
            } else {
              setMyPendingPosts([]);
            }
          } else {
            setMyPendingPosts([]);
          }
        } catch (err) {
          console.error("Failed to fetch pending posts:", err);
          setMyPendingPosts([]);
        }
      } catch (err) {
        console.error(err);
        setError("Không tải được bài viết cộng đồng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const fetchOnlineUsers = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/community/users/online.php?limit=20`
        );
        const data = await res.json();

        if (data.success && Array.isArray(data.users)) {
          setOnlineUsers(data.users);
        }
      } catch (err) {
        console.error('Failed to fetch online users:', err);
      }
    };

    fetchOnlineUsers();

    // Refresh every 30 seconds
    const interval = setInterval(fetchOnlineUsers, 30000);

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const t = localStorage.getItem("vibeventure_token");
    setToken(t);
  }, [user]);

  if (!token) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <main className="mx-auto max-w-[1600px] px-4 py-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                    Cộng đồng VibeMarket
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Chia sẻ, thảo luận và kết nối với hàng triệu người dùng
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {communityStats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 + 0.2, duration: 0.4 }}
                >
                  <Card className="p-4 bg-gradient-card border-border text-center hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <stat.icon className="w-5 h-5 text-accent mx-auto mb-2" />
                    <div className="text-xl font-bold text-accent">{stat.value}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-accent/5 border-border">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-[0.03]">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
              </div>

              <div className="relative p-12 md:p-16 text-center">
                <div className="max-w-2xl mx-auto space-y-8">
                  {/* Icon with gradient ring */}
                  <div className="relative inline-flex">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-accent rounded-full blur-xl opacity-30 animate-pulse"></div>
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 via-purple-500/10 to-accent/10 backdrop-blur-sm flex items-center justify-center border-2 border-accent/20">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                        <Users className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="space-y-4">
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-accent bg-clip-text text-transparent"
                    >
                      Chào mừng đến với Cộng đồng
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed"
                    >
                      Tham gia ngay để khám phá hàng nghìn bài viết hấp dẫn, kết nối với cộng đồng người dùng nhiệt huyết và chia sẻ trải nghiệm mua sắm của bạn
                    </motion.p>
                  </div>

                  {/* Feature highlights */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="grid grid-cols-3 gap-4 max-w-xl mx-auto"
                  >
                    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-accent/5 border border-accent/10">
                      <MessageCircle className="w-6 h-6 text-accent" />
                      <span className="text-xs text-muted-foreground font-medium">Thảo luận</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-accent/5 border border-accent/10">
                      <Share2 className="w-6 h-6 text-accent" />
                      <span className="text-xs text-muted-foreground font-medium">Chia sẻ</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-accent/5 border border-accent/10">
                      <Heart className="w-6 h-6 text-accent" />
                      <span className="text-xs text-muted-foreground font-medium">Kết nối</span>
                    </div>
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="flex gap-4 justify-center pt-4"
                  >
                    <Button
                      onClick={() => navigate('/login')}
                      size="lg"
                      className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <Users className="w-4 h-4" />
                      Đăng nhập
                    </Button>
                    <Button
                      onClick={() => navigate('/register')}
                      size="lg"
                      variant="outline"
                      className="gap-2 border-2 hover:bg-accent/5 hover:border-accent transition-all duration-300 hover:scale-105"
                    >
                      <Sparkles className="w-4 h-4" />
                      Đăng ký ngay
                    </Button>
                  </motion.div>

                  {/* Additional info */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="text-sm text-muted-foreground/60"
                  >
                    Hoàn toàn miễn phí • Không yêu cầu thẻ tín dụng
                  </motion.p>
                </div>
              </div>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }
  const handleToggleLike = async (postId: number) => {
    try {
      setLikeLoadingId(postId);

      const res = await fetch(`${BACKEND_URL}/api/community/actions/like.php`, {
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

      const res = await fetch(`${BACKEND_URL}/api/community/actions/save.php`, {
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
      await fetch(`${BACKEND_URL}/api/community/actions/share.php`, {
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
    // Ensure the avatar URL is correctly set for the new post
    const avatarUrl = user?.avatar ? user.avatar : "/images/default-avatar.png";

    setMyPendingPosts((prev) => [
      {
        ...newPost,
        type: "sharing",
        user: {
          name: user?.name || "Bạn",
          avatar: avatarUrl,
          verified: false,
          followers: 0,
        },
        time: formatTime(new Date().toISOString()),
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        views: 0,
        liked: false,
        isSaved: false,
      },
      ...prev,
    ]);
  };

  const handleQuestionCreated = (newQuestion: Post) => {
    setPosts((prev) => [newQuestion, ...prev]);
  };


  const getPostTypeIcon = (type: PostType) => {
    switch (type) {
      case "question":
        return <HelpCircle className="w-4 h-4 text-accent" />;
      case "livestream":
        return <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />;
      case "tutorial":
        return <BookOpen className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1600px] px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  Cộng đồng VibeMarket
                </h1>
                <p className="text-sm text-muted-foreground">
                  Chia sẻ, thảo luận và kết nối với hàng triệu người dùng
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {communityStats.map((stat) => (
              <Card key={stat.label} className="p-4 bg-gradient-card border-border text-center">
                <stat.icon className="w-5 h-5 text-accent mx-auto mb-2" />
                <div className="text-xl font-bold text-accent">{stat.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Left Sidebar - Xu hướng & Hành động nhanh */}
          <div className="lg:col-span-3 space-y-4">
            <div className="space-y-4 sticky top-6">
              {/* Xu hướng */}
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
                      <span className="text-sm font-medium text-card-foreground">
                        {topic.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {topic.posts}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Hành động nhanh */}
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

          {/* Center Content - Bài viết */}
          <div className="lg:col-span-6">
            <div className="space-y-4">
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

              {myPendingPosts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-900/50">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                          <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-orange-900 dark:text-orange-100">Bài viết chờ duyệt</h3>
                          <p className="text-sm text-orange-700 dark:text-orange-300">Bạn có {myPendingPosts.length} bài viết đang chờ duyệt</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPendingPostsModalOpen(true)}
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </Card>
                </motion.div>
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
                            <AvatarImage
                              src={
                                post.user.avatar || "/images/avatars/Avt-Default.png"
                              }
                            />

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
                            {/* {getPostTypeBadge(post)} */}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            {post.time && <span>{post.time}</span>}

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

                        {post.images && post.images.length > 0 && (
                          <div className="mt-3 select-none">
                            {/* 1 ảnh: Hiển thị full width */}
                            {post.images.length === 1 && (
                              <div className="rounded-xl overflow-hidden bg-muted/30">
                                <img
                                  src={post.images[0]}
                                  alt="post-img"
                                  className="w-full h-auto max-h-[500px] object-cover cursor-pointer hover:opacity-95 transition-all"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxImages(post.images || []);
                                    setLightboxIndex(0);
                                    setLightboxOpen(true);
                                  }}
                                />
                              </div>
                            )}

                            {/* 2 ảnh: Grid 2 cột bằng nhau */}
                            {post.images.length === 2 && (
                              <div className="grid grid-cols-2 gap-2">
                                {post.images.map((img, i) => (
                                  <div
                                    key={i}
                                    className="rounded-xl overflow-hidden bg-muted/30 aspect-[4/3]"
                                  >
                                    <img
                                      src={img}
                                      alt={`post-img-${i}`}
                                      className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-all hover:scale-105"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxImages(post.images || []);
                                        setLightboxIndex(i);
                                        setLightboxOpen(true);
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* 3 ảnh: 1 ảnh to bên trái, 2 ảnh nhỏ bên phải */}
                            {post.images.length === 3 && (
                              <div className="grid grid-cols-2 gap-2 h-[400px]">
                                <div
                                  className="rounded-xl overflow-hidden bg-muted/30 row-span-2 cursor-pointer group"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxImages(post.images || []);
                                    setLightboxIndex(0);
                                    setLightboxOpen(true);
                                  }}
                                >
                                  <img
                                    src={post.images[0]}
                                    alt="post-img-0"
                                    className="w-full h-full object-cover group-hover:opacity-95 transition-all group-hover:scale-105"
                                  />
                                </div>
                                {post.images.slice(1, 3).map((img, i) => (
                                  <div
                                    key={i + 1}
                                    className="rounded-xl overflow-hidden bg-muted/30 cursor-pointer group"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setLightboxImages(post.images || []);
                                      setLightboxIndex(i + 1);
                                      setLightboxOpen(true);
                                    }}
                                  >
                                    <img
                                      src={img}
                                      alt={`post-img-${i + 1}`}
                                      className="w-full h-full object-cover group-hover:opacity-95 transition-all group-hover:scale-105"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* 4+ ảnh: Grid 2x2 với overlay "Xem thêm" trên ảnh thứ 4 */}
                            {post.images.length >= 4 && (
                              <div className="grid grid-cols-2 gap-2">
                                {post.images.slice(0, 4).map((img, i) => (
                                  <div
                                    key={i}
                                    className="relative rounded-xl overflow-hidden bg-muted/30 aspect-square cursor-pointer group"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setLightboxImages(post.images || []);
                                      setLightboxIndex(i);
                                      setLightboxOpen(true);
                                    }}
                                  >
                                    <img
                                      src={img}
                                      alt={`post-img-${i}`}
                                      className="w-full h-full object-cover group-hover:opacity-95 transition-all group-hover:scale-105"
                                    />
                                    {/* Overlay +N cho ảnh thứ 4 */}
                                    {i === 3 && post.images.length > 4 && (
                                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center group-hover:bg-black/80 transition-colors backdrop-blur-sm">
                                        <span className="text-white text-3xl font-bold">
                                          +{post.images.length - 4}
                                        </span>
                                        <span className="text-white/90 text-sm font-medium mt-1">
                                          Xem thêm
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))}
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

                        {post.featuredProducts && post.featuredProducts.length > 0 && (
                          <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl border border-accent/20 overflow-hidden">
                            <div
                              className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/5 transition-all"
                              onClick={() => setExpandedProductsPostId(
                                expandedProductsPostId === post.id ? null : post.id
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                                  <Tag className="h-4 w-4 text-accent" />
                                </div>
                                <span className="text-sm font-semibold text-card-foreground">
                                  Sản phẩm nổi bật ({post.featuredProducts.length})
                                </span>
                              </div>
                              <motion.div
                                animate={{ rotate: expandedProductsPostId === post.id ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                              </motion.div>
                            </div>

                            <motion.div
                              initial={false}
                              animate={{
                                height: expandedProductsPostId === post.id ? "auto" : 0,
                                opacity: expandedProductsPostId === post.id ? 1 : 0
                              }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 space-y-2">
                                {post.featuredProducts.map((product, idx) => (
                                  <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border hover:border-accent/50 hover:bg-accent/5 transition-all group cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/product/${product.id}`);
                                    }}
                                  >
                                    <img
                                      src={product.image || "/placeholder.png"}
                                      alt={product.name}
                                      className="w-14 h-14 rounded-lg object-cover border border-border group-hover:scale-105 transition-transform"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-card-foreground line-clamp-1 mb-1">
                                        {product.name}
                                      </p>
                                      <p className="text-base font-bold text-accent">
                                        {formatPrice(product.price)}
                                      </p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="shrink-0 h-9 w-9 p-0 hover:bg-accent hover:text-white transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // TODO: Add to cart logic
                                      }}
                                    >
                                      <ShoppingCart className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-border gap-3 sm:gap-0">
                          <div className="flex justify-between sm:justify-start sm:gap-6 w-full sm:w-auto">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={likeLoadingId === post.id}
                              onClick={() => handleToggleLike(post.id)}
                              className={`gap-2 text-muted-foreground flex-1 sm:flex-none justify-center hover:bg-red-500/10 transition-smooth ${post.liked
                                  ? "text-red-500"
                                  : "hover:text-red-500"
                                }`}
                            >
                              <Heart
                                className={`w-4 h-4 ${post.liked ? "fill-red-500" : ""
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
                                className={`w-4 h-4 ${post.isSaved ? "fill-current" : ""
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

          {/* Right Sidebar - Thành viên đang hoạt động */}
          <div className="hidden lg:block lg:col-span-3">
            <Card className="p-4 bg-gradient-card border-border sticky top-6 max-h-[calc(100vh-120px)] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-accent" />
                  </div>
                  <h3 className="font-semibold text-card-foreground">
                    Đang hoạt động
                  </h3>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {onlineUsers.length}
                </Badge>
              </div>

              <div className="space-y-2 overflow-y-auto custom-scrollbar pr-1">
                {onlineUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Chưa có thành viên nào hoạt động
                  </div>
                ) : (
                  onlineUsers.map((member, i) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/5 cursor-pointer transition-all group"
                      onClick={() => navigate(`/profile/${member.id}`)}
                    >
                      <div className="relative">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover shadow-md"
                          />
                        ) : (
                          <img src="/images/avatars/Avt-Default.png" className="w-10 h-10 rounded-full" />
                        )}
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background shadow-sm ${member.status === 'online'
                              ? 'bg-green-500'
                              : member.status === 'away'
                                ? 'bg-gray-400'
                                : 'bg-gray-400'
                            }`}
                        ></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-card-foreground truncate group-hover:text-accent transition-colors">
                          {member.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.activity}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
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

      <Dialog open={isPendingPostsModalOpen} onOpenChange={setIsPendingPostsModalOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          {/* HEADER */}
          <DialogHeader className="px-6 py-4 border-b bg-muted/40">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              ⏳ Bài viết chờ duyệt
            </DialogTitle>
            <DialogDescription>
              Các bài viết đang chờ quản trị viên phê duyệt
            </DialogDescription>
          </DialogHeader>

          {/* BODY */}
          <div className="max-h-[65vh] overflow-y-auto px-6 py-4 space-y-4">
            {myPendingPosts.length === 0 && (
              <div className="text-center text-muted-foreground py-10">
                Không có bài viết nào đang chờ duyệt
              </div>
            )}

            {myPendingPosts.map((post) => (
              <Card
                key={post.id}
                className="rounded-xl border hover:shadow-sm transition"
              >
                {/* USER INFO */}
                <div className="flex items-center gap-3 px-4 pt-4">
                  <img
                    src={post.user.avatar || "/images/avatars/Avt-Default.png"}
                    alt={post.user.name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />

                  <div className="flex-1">
                    <div className="font-medium leading-none">
                      {post.user.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {post.time}
                    </div>
                  </div>

                  <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-600">
                    Chờ duyệt
                  </span>
                </div>

                {/* CONTENT */}
                <div className="px-4 py-3 text-sm leading-relaxed">
                  {post.content}
                </div>

                {/* IMAGES */}
                {post.images?.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 px-4 pb-4">
                    {post.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Ảnh ${idx + 1}`}
                        className="h-36 w-full rounded-lg object-cover hover:opacity-90 transition"
                      />
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* FOOTER */}
          <DialogFooter className="px-6 py-4 border-t bg-muted/40">
            <Button variant="secondary" onClick={() => setIsPendingPostsModalOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all z-50"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-50 hidden md:block"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) =>
                prev === 0 ? lightboxImages.length - 1 : prev - 1
              );
            }}
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <img
            src={lightboxImages[lightboxIndex]}
            alt="Fullscreen"
            className="max-w-[95vw] max-h-[90vh] object-contain select-none"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-50 hidden md:block"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) =>
                prev === lightboxImages.length - 1 ? 0 : prev + 1
              );
            }}
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm font-medium backdrop-blur-sm">
            {lightboxIndex + 1} / {lightboxImages.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
