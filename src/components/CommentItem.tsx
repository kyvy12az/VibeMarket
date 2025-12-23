"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, CheckCircle2, Heart, ThumbsUp, MessageSquare, SendHorizonal } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const PADDING_LEFT = "pl-9";
const LEFT_OFFSET = "-left-[19px]";

type Comment = {
  id: number;
  user: { name: string; avatar?: string; verified?: boolean };
  content: string;
  time: string;
  likes: number;
  liked?: boolean;
  parent_id?: number | null;
  replies?: Comment[];
};

interface CommentItemProps {
  comment: Comment;
  replyingTo: number | null;
  replyContent: string;
  onChangeReplyingTo: (id: number | null) => void;
  onChangeReplyContent: (value: string) => void;
  onLikeComment: (id: number) => void;
  onSubmitReply: (parentId: number) => void;
  onEditComment: (comment: Comment) => void;
  onAskDelete: (id: number) => void;
  userName?: string;
  userAvatar?: string;
  isReply?: boolean;
  isLast?: boolean;
}

const CommentItem = ({
  comment,
  replyingTo,
  replyContent,
  onChangeReplyingTo,
  onChangeReplyContent,
  onLikeComment,
  onSubmitReply,
  onEditComment,
  onAskDelete,
  userName,
  userAvatar,
  isReply = false,
  isLast = false,
}: CommentItemProps) => {
  const replyInputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (replyingTo === comment.id && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [replyingTo, comment.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="relative w-full group/main"
    >
      <div className={`flex gap-4 relative ${isReply ? "pt-2" : "pt-6"}`}>
        {/* --- HỆ THỐNG ĐƯỜNG DẪN (THREAD LINES) --- */}
        {isReply && (
          <>
            {/* Đường kẻ dọc nối từ cmt cha */}
            {!isLast && (
              <div
                className={`absolute ${LEFT_OFFSET} -top-8 bottom-0 w-[1.5px] 
            bg-slate-200 dark:bg-zinc-800 pointer-events-none transition-colors group-hover/main:bg-indigo-300/50`}
              />
            )}
            {/* Đường kẻ "khuỷu tay" nối vào avatar cmt con */}
            <div
              className={`absolute ${LEFT_OFFSET} -top-[24px] w-[24px] h-[40px]
          border-b-[1.5px] border-l-[1.5px] border-slate-200 dark:border-zinc-800 rounded-bl-2xl
          pointer-events-none transition-colors group-hover/main:border-indigo-300/50`}
            />
          </>
        )}

        {/* --- AVATAR --- */}
        <div className="relative z-10 flex-shrink-0">
          <motion.div whileHover={{ y: -2 }} className="relative">
            <Avatar
              className={`${isReply ? "w-8 h-8" : "w-10 h-10"
                } border-2 border-background shadow-sm ring-1 ring-slate-200 dark:ring-zinc-800 hover:ring-indigo-500/50 transition-all duration-300`}
            >
              <AvatarImage
                src={comment.user.avatar || "/images/avatars/Avt-Default.png"}
                className="object-cover"
                onError={(e: any) => (e.currentTarget.src = "/images/avatars/Avt-Default.png")}
              />
              <AvatarFallback className="bg-slate-100 dark:bg-zinc-800 text-xs font-bold uppercase">
                {comment.user.name[0]}
              </AvatarFallback>
            </Avatar>

            {comment.user.verified && (
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-950 rounded-full p-0.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 fill-indigo-50 dark:fill-indigo-500/10" />
              </div>
            )}
          </motion.div>
        </div>

        {/* --- NỘI DUNG BÌNH LUẬN --- */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col items-start">
            <div className="max-w-full">
              {/* Box nội dung */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 rounded-2xl px-4 py-3 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-sm text-slate-900 dark:text-zinc-100 tracking-tight">
                    {comment.user.name}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    • {comment.time}
                  </span>
                </div>

                <p className="text-[14px] leading-relaxed text-slate-700 dark:text-zinc-300 whitespace-pre-line break-words">
                  {comment.content}
                </p>
              </div>

              {/* THANH HÀNH ĐỘNG (ACTIONS) */}
              <div className="flex items-center gap-5 mt-2 ml-1">
                {/* Nút Like */}
                <button
                  onClick={() => onLikeComment(comment.id)}
                  className={`flex items-center gap-1.5 group/btn transition-all ${comment.liked ? "text-rose-500 font-bold" : "text-slate-500 hover:text-rose-500"
                    }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 transition-transform group-active/btn:scale-125 ${comment.liked ? "fill-rose-500" : "group-hover/btn:fill-rose-100"
                      }`}
                  />
                  <span className="text-[11px] uppercase tracking-wider">
                    {comment.likes > 0 ? comment.likes : "Thích"}
                  </span>
                </button>

                {/* Nút Phản hồi */}
                <button
                  onClick={() => {
                    onChangeReplyingTo(replyingTo === comment.id ? null : comment.id);
                    onChangeReplyContent("");
                  }}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-500 transition-all group/btn"
                >
                  <MessageSquare className="w-3.5 h-3.5 group-hover/btn:fill-indigo-50" />
                  <span className="text-[11px] uppercase tracking-wider">Phản hồi</span>
                </button>

                {/* Menu Sửa/Xóa của chính mình */}
                {comment.user.name === userName && (
                  <div className="flex items-center gap-4 border-l border-slate-200 dark:border-zinc-800 ml-2 pl-4">
                    <button
                      onClick={() => onEditComment(comment)}
                      className="text-[11px] uppercase tracking-wider text-slate-400 hover:text-blue-500 transition-colors"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onAskDelete(comment.id)}
                      className="text-[11px] uppercase tracking-wider text-slate-400 hover:text-red-500 transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* --- INPUT PHẢN HỒI (FLOATING STYLE) --- */}
            <AnimatePresence>
              {replyingTo === comment.id && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="w-full max-w-2xl overflow-hidden mt-4 mb-2"
                >
                  <div className="relative group">
                    {/* Lớp nền hiệu ứng Gradient mờ chạy quanh viền khi focus */}
                    <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-focus-within:opacity-100 blur-[2px] transition-opacity duration-500" />

                    <div className="relative bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[1.2rem] p-2 shadow-xl shadow-slate-200/50 dark:shadow-none">
                      <div className="flex items-start gap-3">
                        {/* Avatar nhỏ với Ring tinh tế */}
                        <div className="hidden sm:block mt-1 ml-1">
                          <Avatar className="w-8 h-8 ring-2 ring-slate-100 dark:ring-zinc-800 shadow-sm">
                            <AvatarImage
                              src={userAvatar || "/images/avatars/Avt-Default.png"}
                              onError={(e: any) => (e.currentTarget.src = "/images/avatars/Avt-Default.png")}
                            />
                            <AvatarFallback className="text-[10px] font-bold">{userName?.[0]}</AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="flex-1 flex flex-col gap-2">
                          {/* Vùng nhập liệu */}
                          <textarea
                            rows={1}
                            value={replyContent}
                            onChange={(e) => onChangeReplyContent(e.target.value)}
                            placeholder={`Phản hồi thảo luận của ${comment.user.name}...`}
                            className="w-full bg-transparent text-sm py-3 px-4 
                                        rounded-2xl border border-slate-200 dark:border-zinc-800 
                                        focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 
                                        text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 
                                        dark:placeholder:text-zinc-500 outline-none resize-none 
                                        min-h-[44px] leading-relaxed transition-all duration-300"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                if (replyContent.trim()) onSubmitReply(comment.id);
                              }
                              if (e.key === "Escape") onChangeReplyingTo(null);
                            }}
                          />

                          {/* Thanh công cụ phía dưới */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-zinc-800/50">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-tight ml-1">
                                Nhấn ESC để hủy
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onChangeReplyingTo(null)}
                                className="h-8 px-3 text-[11px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300 rounded-lg uppercase tracking-wider"
                              >
                                Hủy
                              </Button>

                              <Button
                                size="sm"
                                onClick={() => onSubmitReply(comment.id)}
                                disabled={!replyContent.trim()}
                                className="h-8 px-4 bg-slate-900 dark:bg-white text-white dark:text-black hover:scale-105 active:scale-95 transition-all duration-200 rounded-lg shadow-lg shadow-slate-200 dark:shadow-none"
                              >
                                <span className="text-[11px] uppercase tracking-wider flex items-center gap-2">
                                  Gửi phản hồi <SendHorizonal className="w-3.5 h-3.5" />
                                </span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* --- REPLIES RECURSION --- */}
      {comment.replies && comment.replies.length > 0 && (
        <div className={`mt-2 ${PADDING_LEFT}`}>
          {comment.replies.map((child, index) => (
            <CommentItem
              key={child.id}
              comment={child}
              replyingTo={replyingTo}
              replyContent={replyContent}
              onChangeReplyingTo={onChangeReplyingTo}
              onChangeReplyContent={onChangeReplyContent}
              onLikeComment={onLikeComment}
              onSubmitReply={onSubmitReply}
              onEditComment={onEditComment}
              onAskDelete={onAskDelete}
              userName={userName}
              userAvatar={userAvatar}
              isReply={true}
              isLast={index === (comment.replies?.length || 0) - 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default CommentItem;
