"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, CheckCircle2, Heart, ThumbsUp } from "lucide-react";

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
      transition={{ duration: 0.3 }}
      className="relative w-full"
    >
      <div className={`flex gap-3 relative ${isReply ? "pt-3" : "pt-4"}`}>
        {isReply && (
          <>
            {!isLast && (
              <div
                className={`absolute ${LEFT_OFFSET} -top-12 bottom-0 w-[2px] 
                bg-gradient-to-b from-primary/30 to-primary/10 pointer-events-none`}
              />
            )}
            <div
              className={`absolute ${LEFT_OFFSET} -top-[20px] w-[20px] h-[42px]
              border-b-[2px] border-l-[2px] border-primary/30 rounded-bl-2xl
              pointer-events-none`}
            />
          </>
        )}

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative z-10 flex-shrink-0"
        >
          <div className="relative">
            <Avatar
              className={`${
                isReply ? "w-7 h-7" : "w-9 h-9"
              } border-2 border-primary/20 bg-background ring-2 ring-primary/10 hover:ring-primary/30 transition-all`}
            >
              <AvatarImage src={comment.user.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-foreground font-semibold">
                {comment.user.name[0]}
              </AvatarFallback>
            </Avatar>
            {comment.user.verified && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-background shadow-lg"
              >
                <CheckCircle2 className="w-2 h-2 text-white" />
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="flex-1 min-w-0">
          <motion.div
            className="group"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gradient-to-br from-secondary/95 to-secondary/80 backdrop-blur-sm hover:from-secondary hover:to-secondary/90 rounded-2xl px-4 py-2.5 inline-block shadow-sm hover:shadow-md transition-all duration-300 border border-border/50">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  {comment.user.name}
                </span>
                {comment.user.verified && (
                  <Badge variant="secondary" className="px-1.5 py-0 h-4 text-[10px] bg-blue-500/10 text-blue-500 border-blue-500/20">
                    <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                    Đã xác minh
                  </Badge>
                )}
              </div>
              <p className="text-[14px] leading-relaxed whitespace-pre-line break-words text-foreground/95">
                {comment.content}
              </p>
            </div>

            <div className="flex items-center gap-3 text-[12px] text-muted-foreground font-medium mt-2 ml-2 select-none">
              <span className="text-xs">{comment.time}</span>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1 hover:underline transition-colors ${
                  comment.liked
                    ? "text-red-500 font-semibold"
                    : "hover:text-red-500"
                }`}
                onClick={() => onLikeComment(comment.id)}
              >
                <Heart
                  className={`w-3 h-3 ${comment.liked ? "fill-red-500" : ""}`}
                />
                <span>{comment.liked ? "Đã thích" : "Thích"}</span>
                {comment.likes > 0 && (
                  <span className="ml-0.5">({comment.likes})</span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hover:underline hover:text-primary transition-colors"
                onClick={() => {
                  onChangeReplyingTo(
                    replyingTo === comment.id ? null : comment.id
                  );
                  onChangeReplyContent("");
                }}
              >
                Phản hồi
              </motion.button>

              {comment.user.name === userName && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hover:underline text-blue-500 hover:text-blue-600 transition-colors"
                    onClick={() => onEditComment(comment)}
                  >
                    Sửa
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hover:underline text-red-500 hover:text-red-600 transition-colors"
                    onClick={() => onAskDelete(comment.id)}
                  >
                    Xóa
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>

          {replyingTo === comment.id && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex gap-2 mt-3 relative z-20"
            >
              <Avatar className="w-7 h-7 mt-1 border-2 border-primary/20 ring-2 ring-primary/10">
                <AvatarImage src={userAvatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
                  {userName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                <textarea
                  ref={replyInputRef}
                  value={replyContent}
                  placeholder={`Phản hồi ${comment.user.name}...`}
                  onChange={(e) => onChangeReplyContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (replyContent.trim().length > 0) {
                        onSubmitReply(comment.id);
                      }
                    }
                  }}
                  className="w-full bg-gradient-to-br from-secondary/40 to-secondary/30 backdrop-blur-sm border-2 no-scrollbar border-border/50 hover:border-primary/30 focus:border-primary/50 rounded-2xl py-2.5 px-4 pr-11 text-sm min-h-[40px] h-[40px] focus:h-[80px] transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none shadow-sm placeholder:text-muted-foreground/60"
                />

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="icon"
                    className="absolute right-1.5 bottom-2 h-8 w-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    disabled={!replyContent.trim()}
                    onClick={() => onSubmitReply(comment.id)}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className={`flex flex-col w-full ${PADDING_LEFT}`}>
          <div className="relative">
            {!isLast && isReply && (
              <div
                className={`absolute ${LEFT_OFFSET} -top-6 bottom-0 w-[2px] bg-gradient-to-b from-primary/30 to-primary/10`}
              />
            )}

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
        </div>
      )}
    </motion.div>
  );
};

export default CommentItem;
