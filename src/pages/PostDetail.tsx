"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
  ChevronLeft,
  ChevronRight,
  CornerDownRight,
} from "lucide-react";
import CommentItem from "@/components/CommentItem";

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
  liked?: boolean;
  parent_id?: number | null;
  replies?: Comment[];
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
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState<string>("");

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const token = localStorage.getItem("vibeventure_token") ?? "";

  const parseComment = (c: any): Comment => ({
    id: Number(c.id),
    content: c.content,
    time: formatTimeAgo(c.created_at),
    likes: Number(c.likes_count || 0),
    liked: Number(c.is_liked) > 0,
    parent_id: c.parent_id ? Number(c.parent_id) : null,
    user: {
      name: c.user?.name,
      avatar: c.user?.avatar,
      verified: false,
    },
    replies: Array.isArray(c.replies)
      ? c.replies.map((child: any) => parseComment(child))
      : [],
  });

  const updateCommentInState = (
    commentsList: Comment[],
    targetId: number,
    updater: (c: Comment) => Comment
  ): Comment[] => {
    return commentsList.map((c) => {
      if (c.id === targetId) {
        return updater(c);
      }
      if (c.replies && c.replies.length > 0) {
        return {
          ...c,
          replies: updateCommentInState(c.replies, targetId, updater),
        };
      }
      return c;
    });
  };

  const addReplyInState = (
    commentsList: Comment[],
    parentId: number,
    newReply: Comment
  ): Comment[] => {
    return commentsList.map((c) => {
      if (c.id === parentId) {
        return {
          ...c,
          replies: [...(c.replies || []), newReply],
        };
      }
      if (c.replies && c.replies.length > 0) {
        return {
          ...c,
          replies: addReplyInState(c.replies, parentId, newReply),
        };
      }
      return c;
    });
  };

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${BACKEND_URL}/api/community/posts/post_detail.php?id=${postId}`,
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
      } catch (err) {
        console.error(err);
        setError("Lỗi tải dữ liệu bài viết");
      } finally {
        setLoading(false);
      }
    };
    const fetchComments = async () => {
      const res = await fetch(
        `${BACKEND_URL}/api/community/comments/comments.php?post_id=${postId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const json = await res.json();
      if (json.success) {
        const parsed = json.comments.map((c: any) => parseComment(c));
        setComments(parsed);
      }
    };

    if (postId) {
      fetchPostDetail();
      fetchComments();
    } else {
      setError("Thiếu ID bài viết");
      setLoading(false);
    }
  }, [postId]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} ngày`;

    return date.toLocaleDateString("vi-VN");
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!postDetail?.images) return;
      setCurrentImageIndex((prev) =>
        prev === postDetail.images.length - 1 ? 0 : prev + 1
      );
    },
    [postDetail]
  );

  const prevImage = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!postDetail?.images) return;
      setCurrentImageIndex((prev) =>
        prev === 0 ? postDetail.images.length - 1 : prev - 1
      );
    },
    [postDetail]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, nextImage, prevImage]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleLikeComment = async (commentId: number) => {
    if (!token) return alert("Bạn cần đăng nhập");
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/community/comments/comment_like.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ comment_id: commentId }),
        }
      );

      const data = await res.json();

      setComments((prev) =>
        updateCommentInState(prev, commentId, (c) => ({
          ...c,
          liked: data.liked,
          likes: data.likes_count,
        }))
      );
    } catch (err) {
      console.error("Lỗi like comment:", err);
    }
  };

  const handleSubmitReply = async (parentId: number) => {
    if (!token) {
      alert("Bạn cần đăng nhập");
      return;
    }
    if (!replyContent.trim()) return;

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/community/comments/comment_action.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            action: "reply",
            post_id: postDetail?.id,
            content: replyContent,
            parent_id: parentId,
          }),
        }
      );

      const json = await res.json();
      if (!json.success) {
        toast.error("Lỗi khi gửi trả lời");
        return;
      }

      const newReply: Comment = {
        id: json.comment.id,
        content: json.comment.content,
        time: "Vừa xong",
        likes: 0,
        liked: false,
        user: {
          name: userData.name,
          avatar: userData.avatar,
        },
        replies: [],
      };

      setComments((prev) => addReplyInState(prev, parentId, newReply));

      setReplyContent("");
      setReplyingTo(null);
      setPostDetail((prev) =>
        prev ? { ...prev, comments: prev.comments + 1 } : prev
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitComment = async () => {
    if (!token) {
      alert("Bạn cần đăng nhập");
      return;
    }

    if (!newComment.trim()) return;

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/community/comments/comment_add.php`,
        {
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
        }
      );

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
          time: formatTimeAgo(c.created_at),
          likes: 0,
          liked: false,
          user: {
            name: c.user.name,
            avatar: c.user.avatar,
          },
          replies: [],
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

  const askDelete = (id: number) => {
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
    if (!token || !editingComment) return;

    const res = await fetch(
      `${BACKEND_URL}/api/community/comments/comment_action.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          action: "edit",
          comment_id: editingComment.id,
          content: editValue,
        }),
      }
    );

    const json = await res.json();

    if (json.success) {
      setComments((prev) =>
        updateCommentInState(prev, editingComment.id, (c) => ({
          ...c,
          content: editValue,
        }))
      );
      setEditingComment(null);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!token) return alert("Bạn cần đăng nhập");

    const res = await fetch(
      `${BACKEND_URL}/api/community/comments/comment_action.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          action: "delete",
          comment_id: commentId,
        }),
      }
    );

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
    if (!token) {
      alert("Vui lòng đăng nhập để thích bài viết");
      return;
    }
    try {
      setLikeLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/community/actions/like.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ post_id: postDetail.id }),
      });
      const data = await res.json();
      if (!data.success) return;
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
    if (!token) {
      alert("Vui lòng đăng nhập để lưu bài viết");
      return;
    }
    try {
      setSaveLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/community/actions/save.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ post_id: postDetail.id }),
      });
      const data = await res.json();
      if (!data.success) return;
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
    try {
      setShareLoading(true);
      await fetch(`${BACKEND_URL}/api/community/actions/share.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ post_id: postDetail.id, platform: "internal" }),
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
          console.log(err);
        }
      } else {
        await navigator.clipboard.writeText(url);
        alert("Đã copy link bài viết vào clipboard!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setShareLoading(false);
    }
  };

  const renderImageGrid = () => {
    const images = postDetail?.images || [];
    const count = images.length;
    if (count === 0) return null;
    const imgClass =
      "w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity duration-300";
    const wrapperClass =
      "relative overflow-hidden flex items-center justify-center rounded-xl bg-neutral-100/50 dark:bg-neutral-800/30";

    if (count === 1) {
      return (
        <div className={`mt-4 w-full h-[500px] ${wrapperClass}`}>
          <img
            src={images[0]}
            alt="img-0"
            className={imgClass}
            onClick={() => openLightbox(0)}
          />
        </div>
      );
    }
    if (count === 2) {
      return (
        <div className="mt-4 grid grid-cols-2 gap-2 h-[400px]">
          {images.map((img, idx) => (
            <div key={idx} className={wrapperClass}>
              <img
                src={img}
                alt={`img-${idx}`}
                className={imgClass}
                onClick={() => openLightbox(idx)}
              />
            </div>
          ))}
        </div>
      );
    }
    if (count === 3) {
      return (
        <div className="mt-4 grid grid-cols-2 gap-2 h-[500px]">
          <div className={wrapperClass}>
            <img
              src={images[0]}
              alt="img-0"
              className={imgClass}
              onClick={() => openLightbox(0)}
            />
          </div>
          <div className="grid grid-rows-2 gap-2 h-full">
            <div className={wrapperClass}>
              <img
                src={images[1]}
                alt="img-1"
                className={imgClass}
                onClick={() => openLightbox(1)}
              />
            </div>
            <div className={wrapperClass}>
              <img
                src={images[2]}
                alt="img-2"
                className={imgClass}
                onClick={() => openLightbox(2)}
              />
            </div>
          </div>
        </div>
      );
    }
    if (count === 4) {
      return (
        <div className="mt-4 grid grid-cols-2 grid-rows-2 gap-2 h-[500px]">
          {images.map((img, idx) => (
            <div key={idx} className={wrapperClass}>
              <img
                src={img}
                alt={`img-${idx}`}
                className={imgClass}
                onClick={() => openLightbox(idx)}
              />
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="mt-4 flex flex-col gap-2 h-[700px]">
        <div className="grid grid-cols-2 gap-2 h-1/2">
          <div className={wrapperClass}>
            <img
              src={images[0]}
              alt="img-0"
              className={imgClass}
              onClick={() => openLightbox(0)}
            />
          </div>
          <div className={wrapperClass}>
            <img
              src={images[1]}
              alt="img-1"
              className={imgClass}
              onClick={() => openLightbox(1)}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 h-1/2">
          <div className={wrapperClass}>
            <img
              src={images[2]}
              alt="img-2"
              className={imgClass}
              onClick={() => openLightbox(2)}
            />
          </div>
          <div className={wrapperClass}>
            <img
              src={images[3]}
              alt="img-3"
              className={imgClass}
              onClick={() => openLightbox(3)}
            />
          </div>
          <div className={`${wrapperClass} group`}>
            <img
              src={images[4]}
              alt="img-4"
              className={imgClass}
              onClick={() => openLightbox(4)}
            />
            {count > 5 && (
              <div
                className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer hover:bg-black/70 transition-colors backdrop-blur-[2px]"
                onClick={() => openLightbox(4)}
              >
                <span className="text-white text-2xl md:text-3xl font-bold">
                  +{count - 5}
                </span>
                <span className="text-white/90 text-xs md:text-sm font-medium">
                  Xem thêm
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-background flex flex-col w-full relative">
      <main className="container mx-auto px-4 py-6 h-full flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-stretch"
        >
          <div className="hidden lg:block lg:col-span-3 h-full">
            <div className="h-full overflow-y-auto pr-2 custom-scrollbar pb-10">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="mb-4 pl-0 hover:pl-2 transition-all gap-2 text-muted-foreground w-full justify-start"
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
                    <Avatar className="w-10 h-10 ">
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

                <div className="p-6 space-y-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-card-foreground leading-tight">
                    {postDetail.title}
                  </h1>
                  <div className="text-card-foreground/90 leading-relaxed whitespace-pre-line text-base">
                    {postDetail.content}
                  </div>
                  {renderImageGrid()}
                  {postDetail.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
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

                <div className="flex gap-4 mb-7">
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

                <div className="space-y-2">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      replyingTo={replyingTo}
                      replyContent={replyContent}
                      onChangeReplyingTo={setReplyingTo}
                      onChangeReplyContent={setReplyContent}
                      onLikeComment={handleLikeComment}
                      onSubmitReply={handleSubmitReply}
                      onEditComment={handleEditComment}
                      onAskDelete={askDelete}
                      userName={userName}
                      userAvatar={userAvatar}
                    />
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

      <AnimatePresence>
        {lightboxOpen && postDetail?.images && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all z-50"
              onClick={closeLightbox}
            >
              <X className="w-8 h-8" />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-50 hidden md:block"
              onClick={prevImage}
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            <motion.img
              key={currentImageIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={postDetail.images[currentImageIndex]}
              className="max-h-[90vh] max-w-[90vw] object-contain select-none"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-50 hidden md:block"
              onClick={nextImage}
            >
              <ChevronRight className="w-10 h-10" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {postDetail.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostDetailPage;
