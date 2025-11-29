"use client";

import { useEffect, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2 } from "lucide-react";

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
    <div className="relative w-full">
      <div className={`flex gap-3 relative ${isReply ? "pt-3" : "pt-4"}`}>
        {isReply && (
          <>
            {!isLast && (
              <div
                className={`absolute ${LEFT_OFFSET} -top-12 bottom-0 w-[2px] 
                bg-gray-200 dark:bg-gray-700 pointer-events-none`}
              />
            )}
            <div
              className={`absolute ${LEFT_OFFSET} -top-[20px] w-[20px] h-[42px]
              border-b-[2px] border-l-[2px] border-gray-200 rounded-bl-2xl
              dark:border-gray-700 pointer-events-none`}
            />
          </>
        )}

        <div className="relative z-10 flex-shrink-0">
          <Avatar
            className={`${
              isReply ? "w-7 h-7" : "w-9 h-9"
            } border border-border bg-background`}
          >
            <AvatarImage src={comment.user.avatar} />
            <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 min-w-0">
          <div className="group">
            <div className="bg-secondary/90 dark:bg-secondary/90 rounded-2xl px-3 py-2 inline-block">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-bold text-sm">{comment.user.name}</span>
                {comment.user.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
                )}
              </div>
              <p className="text-[14px] leading-snug whitespace-pre-line break-words text-foreground/90">
                {comment.content}
              </p>
            </div>

            <div className="flex items-center gap-3 text-[12px] text-muted-foreground font-medium mt-1 ml-1 select-none">
              <span>{comment.time}</span>
              <button
                className={`hover:underline ${
                  comment.liked ? "text-blue-600 font-bold" : ""
                }`}
                onClick={() => onLikeComment(comment.id)}
              >
                {comment.liked ? "Đã thích" : "Thích"}
                {comment.likes > 0 && (
                  <span className="ml-1">({comment.likes})</span>
                )}
              </button>
              <button
                className="hover:underline"
                onClick={() => {
                  onChangeReplyingTo(
                    replyingTo === comment.id ? null : comment.id
                  );
                  onChangeReplyContent("");
                }}
              >
                Phản hồi
              </button>
              {comment.user.name === userName && (
                <>
                  <button
                    className="hover:underline text-blue-500"
                    onClick={() => onEditComment(comment)}
                  >
                    Sửa
                  </button>
                  <button
                    className="hover:underline text-red-500"
                    onClick={() => onAskDelete(comment.id)}
                  >
                    Xóa
                  </button>
                </>
              )}
            </div>
          </div>

          {replyingTo === comment.id && (
            <div className="flex gap-2 mt-2 animate-in fade-in slide-in-from-top-1 duration-200 relative z-20">
              <Avatar className="w-6 h-6 mt-1">
                <AvatarImage src={userAvatar} />
                <AvatarFallback>{userName?.[0]}</AvatarFallback>
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
                  className="w-full bg-secondary/30 border no-scrollbar border-border rounded-2xl py-2 px-3 pr-10 text-sm min-h-[36px] h-[36px] focus:h-[70px] transition-all focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />

                <Button
                  size="icon"
                  className="absolute right-1 bottom-1.5 h-7 w-7 bg-transparent hover:bg-transparent text-blue-500 hover:text-blue-600"
                  disabled={!replyContent.trim()}
                  onClick={() => onSubmitReply(comment.id)}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className={`flex flex-col w-full ${PADDING_LEFT}`}>
          <div className="relative">
            {!isLast && isReply && (
              <div
                className={`absolute ${LEFT_OFFSET} -top-6 bottom-0 w-[2px] bg-gray-200 dark:bg-gray-700`}
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
    </div>
  );
};

export default CommentItem;
