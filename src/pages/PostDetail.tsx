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
  Plus,
  MessageSquare,
  Trash2,
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
  import.meta.env.VITE_BACKEND_URL;

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

  const normalizeAvatar = (av?: string | null) => {
    const def = "/images/avatars/Avt-Default.png";
    if (!av) return def;
    // already absolute or root-relative
    if (av.startsWith("http") || av.startsWith("/")) return av;
    // otherwise prefix BACKEND_URL
    return `${BACKEND_URL.replace(/\/$/, "")}/${av.replace(/^\//, "")}`;
  };

  const parseComment = (c: any): Comment => ({
    id: Number(c.id),
    content: c.content,
    time: formatTimeAgo(c.created_at),
    likes: Number(c.likes_count || 0),
    liked: Number(c.is_liked) > 0,
    parent_id: c.parent_id ? Number(c.parent_id) : null,
    user: {
      name: c.user?.name || "Người dùng ẩn danh",
      avatar: normalizeAvatar(c.user?.avatar),
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

  // Remove a comment (top-level or nested reply) by id from the comments tree
  const removeCommentById = (commentsList: Comment[], targetId: number): Comment[] => {
    return commentsList
      .map((c) => {
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: removeCommentById(c.replies, targetId) };
        }
        return c;
      })
      .filter((c) => c.id !== targetId);
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
            avatar: normalizeAvatar(p.author?.avatar),
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
            avatar: normalizeAvatar(userData.avatar),
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
            avatar: normalizeAvatar(c.user.avatar),
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
    toast.custom((t) => (
      <div className="bg-white dark:bg-zinc-900 border border-red-100 dark:border-red-900/30 shadow-2xl rounded-2xl p-4 flex items-start gap-4 w-[350px]">
        {/* Icon Cảnh báo với hiệu ứng Pulse */}
        <div className="flex-shrink-0 w-10 h-10 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20" />
          <Trash2 className="w-5 h-5 text-red-500 relative z-10" />
        </div>

        {/* Nội dung text */}
        <div className="flex-1">
          <h4 className="text-sm font-black text-slate-900 dark:text-zinc-100 leading-none mb-1">
            Xác nhận gỡ bỏ?
          </h4>
          <p className="text-[12px] text-slate-500 dark:text-zinc-400 leading-relaxed">
            Bình luận này sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </p>

          {/* Nút bấm hành động */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => toast.dismiss(t)}
              className="px-3 py-1.5 text-[11px] font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={() => {
                handleDeleteComment(id);
                toast.dismiss(t);
              }}
              className="px-4 py-1.5 text-[11px] font-bold bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg shadow-red-500/20 transition-all active:scale-95"
            >
              Xóa ngay
            </button>
          </div>
        </div>
      </div>
    ), {
      position: "top-center",
      duration: 5000,
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
    if (!token) {
      alert("Bạn cần đăng nhập");
      return;
    }

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
            action: "delete",
            comment_id: commentId,
          }),
        }
      );

      const json = await res.json();

      if (json.success) {
        setComments((prevComments) => removeCommentById(prevComments, commentId));
        setPostDetail((prev) =>
          prev ? { ...prev, comments: Math.max(0, prev.comments - 1) } : prev
        );
        toast.success("Bình luận đã được xóa thành công");
      } else {
        toast.error("Không thể xóa bình luận. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi khi xóa bình luận:", err);
      toast.error("Đã xảy ra lỗi khi xóa bình luận.");
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

    // Lớp chung cho ảnh để tạo cảm giác sang trọng
    const imgClass =
      "w-full h-full object-cover cursor-pointer transition-all duration-500 group-hover:scale-105";

    // Wrapper với bo góc lớn và hiệu ứng shadow nhẹ
    const wrapperClass =
      "relative overflow-hidden rounded-[1.5rem] bg-slate-100 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 group";

    // Thành phần ảnh đơn lẻ để tái sử dụng
    const ImageItem = ({ src, index, className = "" }) => (
      <div className={`${wrapperClass} ${className}`}>
        <img
          src={src}
          alt={`post-img-${index}`}
          className={imgClass}
          onClick={() => openLightbox(index)}
        />
        {/* Lớp phủ gradient nhẹ khi hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    );

    // Layout dựa trên số lượng ảnh
    if (count === 1) {
      return (
        <div className="mt-6 w-full max-h-[600px] aspect-[16/10]">
          <ImageItem src={images[0]} index={0} />
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className="mt-6 grid grid-cols-2 gap-3 aspect-[16/9]">
          <ImageItem src={images[0]} index={0} />
          <ImageItem src={images[1]} index={1} />
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="mt-6 grid grid-cols-3 gap-3 aspect-[16/9]">
          <ImageItem src={images[0]} index={0} className="col-span-2" />
          <div className="grid grid-rows-2 gap-3">
            <ImageItem src={images[1]} index={1} />
            <ImageItem src={images[2]} index={2} />
          </div>
        </div>
      );
    }

    if (count === 4) {
      return (
        <div className="mt-6 grid grid-cols-2 grid-rows-2 gap-3 aspect-square max-h-[600px]">
          {images.slice(0, 4).map((img, idx) => (
            <ImageItem key={idx} src={img} index={idx} />
          ))}
        </div>
      );
    }

    // Trường hợp 5 ảnh trở lên
    return (
      <div className="mt-6 grid grid-cols-6 grid-rows-2 gap-3 aspect-[16/10]">
        {/* 2 ảnh lớn bên trên */}
        <ImageItem src={images[0]} index={0} className="col-span-3" />
        <ImageItem src={images[1]} index={1} className="col-span-3" />

        {/* 3 ảnh nhỏ bên dưới */}
        <ImageItem src={images[2]} index={2} className="col-span-2" />
        <ImageItem src={images[3]} index={3} className="col-span-2" />

        {/* Ảnh cuối kèm lớp phủ Glassmorphism */}
        <div className={`${wrapperClass} col-span-2`}>
          <img src={images[4]} alt="img-4" className={imgClass} />
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[4px] flex flex-col items-center justify-center cursor-pointer hover:bg-black/50 transition-all group-hover:scale-105"
            onClick={() => openLightbox(4)}
          >
            <div className="bg-white/20 p-3 rounded-full mb-2 border border-white/30 shadow-xl">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xl font-black tracking-tighter">
              +{count - 4} ẢNH
            </span>
            <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
              Xem tất cả
            </span>
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
                <Button className="w-full bg-gradient-to-r from-primary to-purple-600 text-white hover:from-primary/90 hover:to-purple-600/90">
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
                      className={`flex-1 gap-2 h-10 hover:text-red-500 hover:bg-red-500/10 ${postDetail.liked ? "text-red-500" : ""
                        }`}
                      disabled={likeLoading}
                      onClick={handleToggleLike}
                    >
                      <Heart
                        className={`w-5 h-5 ${postDetail.liked ? "fill-red-500" : ""
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
                      className={`flex-1 gap-2 hover:text-yellow-500 hover:bg-yellow-500/10 h-10 ${postDetail.isSaved ? "text-yellow-500" : ""
                        }`}
                      disabled={saveLoading}
                      onClick={handleToggleSave}
                    >
                      <Bookmark
                        className={`w-5 h-5 ${postDetail.isSaved ? "fill-current" : ""
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

              <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200/60 dark:border-zinc-800/60 shadow-sm overflow-hidden">
                {/* --- HEADER --- */}
                <div className="px-8 py-6 border-b border-slate-100 dark:border-zinc-900 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/30">
                  <h3 className="font-black text-lg tracking-tight flex items-center gap-3 text-slate-900 dark:text-zinc-100">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Cộng đồng thảo luận
                  </h3>
                  <Badge
                    variant="secondary"
                    className="rounded-full px-3 py-1 bg-background shadow-sm border-slate-200/50 text-primary font-bold"
                  >
                    {comments.length} bình luận
                  </Badge>
                </div>

                <div className="p-8">
                  {/* --- INPUT AREA (THE COMPOSER) --- */}
                  <div className="group relative flex gap-4 mb-10">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="w-12 h-12 border-2 border-white dark:border-zinc-900 shadow-md">
                        <AvatarImage src={normalizeAvatar(userAvatar)} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold">
                          {userName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="w-0.5 h-full bg-slate-100 dark:bg-zinc-900 rounded-full" />
                    </div>

                    <div className="flex-1">
                      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300 bg-slate-50/30 dark:bg-zinc-900/20">
                        <textarea
                          className="w-full bg-transparent p-4 min-h-[110px] focus:outline-none resize-none text-sm text-slate-700 dark:text-zinc-300 placeholder:text-slate-400 dark:placeholder:text-zinc-500 leading-relaxed"
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

                        <div className="px-4 py-3 border-t border-slate-100 dark:border-zinc-900 flex justify-between items-center bg-white/50 dark:bg-zinc-900/40">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Nhấn Enter để gửi
                          </span>
                          <Button
                            className="rounded-xl px-5 h-9 bg-slate-900 dark:bg-white text-white dark:text-black hover:scale-105 transition-all duration-300 shadow-lg shadow-slate-200 dark:shadow-none font-bold text-xs gap-2"
                            onClick={handleSubmitComment}
                            disabled={!newComment.trim()}
                          >
                            <Send className="w-3.5 h-3.5" /> Gửi bình luận
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* --- LIST AREA --- */}
                  <div className="space-y-6">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
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
                            userAvatar={normalizeAvatar(userAvatar)}
                        />
                      ))
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-slate-400 dark:text-zinc-600 border-2 border-dashed border-slate-100 dark:border-zinc-900 rounded-3xl">
                        <MessageSquare className="w-10 h-10 mb-3 opacity-20" />
                        <p className="text-sm font-medium">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* --- MODAL EDIT (PREMIUM STYLE) --- */}
                {editingComment && (
                  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-slate-200/50 dark:border-zinc-800 shadow-2xl w-full max-w-lg"
                    >
                      <h3 className="font-black text-xl mb-2 tracking-tight">Chỉnh sửa phản hồi</h3>
                      <p className="text-sm text-slate-500 mb-6">Bạn có thể thay đổi nội dung bình luận của mình tại đây.</p>

                      <textarea
                        className="w-full p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl min-h-[150px] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none text-sm"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />

                      <div className="flex justify-end gap-3 mt-8">
                        <Button
                          variant="ghost"
                          className="rounded-xl font-bold text-slate-500"
                          onClick={() => setEditingComment(null)}
                        >
                          Hủy bỏ
                        </Button>
                        <Button
                          className="rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white px-8 font-bold shadow-lg shadow-indigo-500/20"
                          onClick={submitEditComment}
                        >
                          Cập nhật ngay
                        </Button>
                      </div>
                    </motion.div>
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

