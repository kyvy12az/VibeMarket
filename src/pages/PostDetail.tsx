"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Bookmark,
  Clock,
  Loader2,
  ArrowLeft,
  Send,
  ThumbsUp,
  MoreHorizontal,
  CheckCircle2,
} from "lucide-react";

type PostType = "review" | "question" | "sharing" | "livestream" | "tutorial";

interface PostUser {
  name: string;
  avatar?: string;
  verified?: boolean;
  followers: number;
  bio?: string;
}

interface PostDetail {
  id: number;
  type: PostType;
  user: PostUser;
  title: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  views: number;
  time: string;
  tags: string[];
  liked: boolean;
  isSaved: boolean;
}

interface Comment {
  id: number;
  user: { name: string; avatar?: string; verified?: boolean };
  content: string;
  time: string;
  likes: number;
}

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost/VIBE_MARKET_BACKEND/VibeMarket-BE";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = Number(id);

  const [postDetail, setPostDetail] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const userData = JSON.parse(
    localStorage.getItem("vibeventure_user") || "null"
  );
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editValue, setEditValue] = useState("");

  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const userAvatar = userData?.avatar;
  const userName = userData?.name;

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("vibeventure_token") ?? "";

        const res = await fetch(
          `${BACKEND_URL}/api/community/post_detail.php?id=${postId}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch post detail");
        }

        const json = await res.json();

        if (!json.success || !json.post) {
          setError("Không tìm thấy bài viết");
        }

        const p = json.post;

        setPostDetail({
          id: Number(p.id),
          type: "review",
          user: {
            name: p.author?.name || "Người dùng ẩn danh",
            avatar: p.author?.avatar,
            verified: false,
            followers: 0,
          },
          title: p.title || "",
          content: p.content || "",
          images: Array.isArray(p.images) ? p.images : [],
          likes: Number(p.likes_count),
          comments: Number(p.comments_count),
          shares: 0,
          saves: Number(p.saves_count),
          views: 0,
          time: p.created_at,
          tags: p.tags || [],
          liked: !!p.is_liked,
          isSaved: !!p.is_saved,
        });

        setComments(
          p.comments.map((c: any) => ({
            id: Number(c.id),
            content: c.content,
            time: c.created_at,
            likes: 0,
            user: {
              name: c.user?.name,
              avatar: c.user?.avatar,
              verified: false,
            },
          }))
        );
      } catch (err) {
        console.error(err);
        setError("Lỗi tải dữ liệu bài viết");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPostDetail();
    } else {
      setError("Thiếu ID bài viết");
      setLoading(false);
    }
  }, [postId]);

  const handleBack = () => {
    navigate(-1);
  };
  const handleSubmitComment = async () => {
    const token = localStorage.getItem("vibeventure_token");
    if (!token) {
      alert("Bạn cần đăng nhập");
      return;
    }

    if (!newComment.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/community/comment_add.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          post_id: postDetail?.id,
          content: newComment,
          parent_id: null,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        console.error(json);
        return;
      }

      const c = json.comment;

      setComments((prev) => [
        {
          id: c.id,
          content: c.content,
          time: c.created_at,
          likes: 0,
          user: {
            name: c.user.name,
            avatar: c.user.avatar,
          },
        },
        ...prev,
      ]);

      setPostDetail((prev) =>
        prev ? { ...prev, comments: prev.comments + 1 } : prev
      );

      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
    setEditValue(comment.content);
  };
  const askDelete = (id) => {
    toast.warning("Xóa bình luận?", {
      description: "Hành động này không thể hoàn tác.",

      action: {
        label: "Xóa",
        onClick: () => handleDeleteComment(id),
      },

      cancel: {
        label: "Hủy",
        onClick: () => console.log("Đã hủy xóa"),
      },
        position: "top-center",
    });
  };

  const submitEditComment = async () => {
    const token = localStorage.getItem("vibeventure_token");
    if (!token || !editingComment) return;

    const res = await fetch(`${BACKEND_URL}/api/community/comment_edit.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        comment_id: editingComment.id,
        content: editValue,
      }),
    });

    const json = await res.json();

    if (json.success) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === editingComment.id ? { ...c, content: editValue } : c
        )
      );
      setEditingComment(null);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const token = localStorage.getItem("vibeventure_token");
    if (!token) return alert("Bạn cần đăng nhập");

    const res = await fetch(`${BACKEND_URL}/api/community/comment_delete.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ comment_id: commentId }),
    });

    const json = await res.json();

    if (json.success) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setPostDetail((prev) =>
        prev ? { ...prev, comments: prev.comments - 1 } : prev
      );
    }
  };

  const getPostTypeBadge = (type: PostType) => {
    switch (type) {
      case "question":
        return (
          <Badge variant="outline" className="border-accent text-accent">
            Câu hỏi
          </Badge>
        );
      case "review":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Review
          </Badge>
        );
      case "sharing":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Chia sẻ
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleToggleLike = async () => {
    if (!postDetail) return;

    const token = localStorage.getItem("vibeventure_token");
    if (!token) {
      alert("Vui lòng đăng nhập để thích bài viết");
      return;
    }

    try {
      setLikeLoading(true);

      const res = await fetch(`${BACKEND_URL}/api/community/like.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ post_id: postDetail.id }),
      });

      const data = await res.json();
      if (!data.success) {
        console.error("Like error:", data);
        return;
      }

      const liked: boolean = !!data.liked;

      setPostDetail((prev) =>
        prev
          ? {
              ...prev,
              liked,
              likes: liked ? prev.likes + 1 : Math.max(0, prev.likes - 1),
            }
          : prev
      );
    } catch (err) {
      console.error("Like API error:", err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleToggleSave = async () => {
    if (!postDetail) return;

    const token = localStorage.getItem("vibeventure_token");
    if (!token) {
      alert("Vui lòng đăng nhập để lưu bài viết");
      return;
    }

    try {
      setSaveLoading(true);

      const res = await fetch(`${BACKEND_URL}/api/community/save.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ post_id: postDetail.id }),
      });

      const data = await res.json();
      if (!data.success) {
        console.error("Save error:", data);
        return;
      }

      const saved: boolean = !!data.saved;

      setPostDetail((prev) =>
        prev
          ? {
              ...prev,
              isSaved: saved,
              saves: saved ? prev.saves + 1 : Math.max(0, prev.saves - 1),
            }
          : prev
      );
    } catch (err) {
      console.error("Save API error:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleShare = async () => {
    if (!postDetail) return;
    const token = localStorage.getItem("vibeventure_token") ?? "";

    try {
      setShareLoading(true);

      await fetch(`${BACKEND_URL}/api/community/share.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          post_id: postDetail.id,
          platform: "internal",
        }),
      }).catch((err) => console.error("Share API error:", err));

      setPostDetail((prev) =>
        prev ? { ...prev, shares: prev.shares + 1 } : prev
      );

      const url = window.location.href;
      if (navigator.share) {
        try {
          await navigator.share({
            title: postDetail.title,
            text: postDetail.content,
            url,
          });
        } catch (err) {
          console.log("User cancelled native share:", err);
        }
      } else {
        await navigator.clipboard.writeText(url);
        alert("Đã copy link bài viết vào clipboard!");
      }
    } catch (err) {
      console.error("Share error:", err);
    } finally {
      setShareLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !postDetail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-muted-foreground bg-background">
        <p className="mb-4">{error || "Không tìm thấy bài viết."}</p>
        <Button onClick={() => navigate("/community")}>
          Về trang Cộng đồng
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      <main className="container mx-auto px-4 py-6 h-full flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-stretch"
        >
          {/* LEFT: AUTHOR INFO */}
          <div className="hidden lg:block lg:col-span-3 h-full">
            <div className="h-full overflow-y-auto pr-2 custom-scrollbar pb-10">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="mb-4 pl-0 hover:pl-2 transition-all gap-2 text-muted-foreground  w-full justify-start"
              >
                <ArrowLeft className="w-5 h-5" />
                Quay lại
              </Button>

              <Card className="p-6 bg-gradient-card border-border sticky top-0 space-y-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                      <AvatarImage src={postDetail.user.avatar} />
                      <AvatarFallback>{postDetail.user.name[0]}</AvatarFallback>
                    </Avatar>
                    {postDetail.user.verified && (
                      <div className="absolute bottom-0 right-1 bg-accent text-white rounded-full p-1 border-2 border-background">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-3 font-bold text-lg text-card-foreground">
                    {postDetail.user.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    @{postDetail.user.name.replace(/\s+/g, "").toLowerCase()}
                  </p>
                </div>

                <div className="flex justify-center gap-4 text-sm border-y border-border py-4">
                  <div className="text-center">
                    <span className="block font-bold text-lg">
                      {(postDetail.user.followers / 1000).toFixed(1)}K
                    </span>
                    <span className="text-muted-foreground text-xs">
                      Followers
                    </span>
                  </div>
                  <div className="w-[1px] bg-border"></div>
                  <div className="text-center">
                    <span className="block font-bold text-lg">156</span>
                    <span className="text-muted-foreground text-xs">Posts</span>
                  </div>
                </div>

                <Button className="w-full bg-accent text-white hover:bg-accent/80">
                  Theo dõi
                </Button>
              </Card>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-9 h-full">
            <div className="h-full overflow-y-auto px-1 no-scrollbar pb-32">
              <Card className="bg-gradient-card border-border overflow-hidden mb-8">
                <div className="p-6 pb-0 flex items-start justify-between">
                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10 lg:hidden">
                      <AvatarImage src={postDetail.user.avatar} />
                      <AvatarFallback>{postDetail.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-card-foreground text-base flex items-center gap-1">
                        {postDetail.user.name}
                        {postDetail.user.verified && (
                          <CheckCircle2 className="w-3 h-3 text-accent" />
                        )}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {postDetail.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPostTypeBadge(postDetail.type)}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-card-foreground leading-tight">
                    {postDetail.title}
                  </h1>

                  <div className="text-card-foreground/90 leading-relaxed whitespace-pre-line text-base">
                    {postDetail.content}
                  </div>

                  {postDetail.images?.length > 0 && (
                    <div className="grid grid-cols-1 gap-3">
                      {postDetail.images.map((img) => (
                        <img
                          key={img}
                          src={img}
                          className="rounded-xl object-contain max-h-[600px] w-full"
                        />
                      ))}
                    </div>
                  )}

                  {postDetail.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {postDetail.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-accent text-sm font-medium hover:underline cursor-pointer bg-accent/10 px-2 py-1 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 border-t border-border bg-secondary/10">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" /> {postDetail.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" /> {postDetail.likes}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>{postDetail.comments} Bình luận</span>
                      <span>{postDetail.shares} Chia sẻ</span>
                    </div>
                  </div>

                  <div className="flex justify-between gap-2">
                    <Button
                      variant="ghost"
                      className={`flex-1 gap-2 h-10 hover:text-red-500 hover:bg-red-500/10 ${
                        postDetail.liked ? "text-red-500" : ""
                      }`}
                      disabled={likeLoading}
                      onClick={handleToggleLike}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          postDetail.liked ? "fill-red-500" : ""
                        }`}
                      />
                      <span className="hidden sm:inline">Thích</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1 gap-2 hover:text-blue-500 hover:bg-blue-500/10 h-10 bg-secondary/30"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="hidden sm:inline">Bình luận</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className={`flex-1 gap-2 hover:text-yellow-500 hover:bg-yellow-500/10 h-10 ${
                        postDetail.isSaved ? "text-yellow-500" : ""
                      }`}
                      disabled={saveLoading}
                      onClick={handleToggleSave}
                    >
                      <Bookmark
                        className={`w-5 h-5 ${
                          postDetail.isSaved ? "fill-current" : ""
                        }`}
                      />
                      <span className="hidden sm:inline">Lưu</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1 gap-2 hover:text-green-500 hover:bg-green-500/10 h-10"
                      disabled={shareLoading}
                      onClick={handleShare}
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="hidden sm:inline">Chia sẻ</span>
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="bg-background rounded-xl border border-border p-6">
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                  Bình luận <Badge variant="secondary">{comments.length}</Badge>
                </h3>

                <div className="flex gap-4 mb-10">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={userAvatar} />
                    <AvatarFallback>{userName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <textarea
                      className="w-full bg-secondary/30 border border-border rounded-xl p-4 min-h-[10px] focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none text-sm transition-all"
                      placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmitComment();
                        }
                      }}
                    />

                    <div className="flex justify-end">
                      <Button
                        className="gap-2 bg-accent hover:bg-accent/90 text-white"
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim()}
                      >
                        <Send className="w-4 h-4" /> Gửi bình luận
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 group">
                      <Avatar className="w-10 h-10 border border-border">
                        <AvatarImage src={comment.user.avatar} />
                        <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">
                              {comment.user.name}
                            </span>
                            {comment.user.verified && (
                              <CheckCircle2 className="w-3 h-3 text-blue-500" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              • {comment.time}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-card-foreground/90 leading-relaxed mb-2">
                          {comment.content}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                          <button className="hover:text-accent flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />{" "}
                            {comment.likes > 0 ? comment.likes : "Thích"}
                          </button>

                          <button className="hover:text-accent">Trả lời</button>

                          {comment.user.name === userName && (
                            <>
                              <button
                                className="hover:text-blue-500"
                                onClick={() => handleEditComment(comment)}
                              >
                                Sửa
                              </button>

                              <button
                                className="hover:text-red-500"
                                onClick={() => askDelete(comment.id)}
                              >
                                Xóa
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {editingComment && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl w-[400px] space-y-4">
                      <h3 className="font-bold">Sửa bình luận</h3>

                      <textarea
                        className="w-full p-3 border rounded-lg"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />

                      <div className="flex justify-end gap-3">
                        <Button
                          variant="ghost"
                          onClick={() => setEditingComment(null)}
                        >
                          Hủy
                        </Button>
                        <Button onClick={submitEditComment}>Lưu</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PostDetailPage;
