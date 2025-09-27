import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { X, ImageIcon, Hash, Smile } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: any) => void;
}

const CreatePostModal = ({ isOpen, onClose, onPostCreated }: CreatePostModalProps) => {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const { toast } = useToast();

  const availableTags = [
    "#ReviewSảnPhẩm", "#TipsMuaSắm", "#LocalBrand", "#FlashSale", 
    "#ThoiTrang", "#CongNghe", "#LamDep", "#AnUong", "#DuLich"
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập nội dung bài viết",
        variant: "destructive"
      });
      return;
    }

    const newPost = {
      id: Date.now(),
      user: {
        name: "Bạn",
        avatar: "/placeholder.svg",
        verified: false,
      },
      content: content.trim(),
      image: selectedImage,
      likes: 0,
      comments: 0,
      shares: 0,
      time: "Vừa xong",
      tags: selectedTags
    };

    onPostCreated(newPost);
    
    // Reset form
    setContent("");
    setSelectedImage(null);
    setSelectedTags([]);
    setIsPreview(false);
    
    toast({
      title: "Thành công!",
      description: "Bài viết đã được đăng thành công",
    });
    
    onClose();
  };

  const PreviewPost = () => (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center gap-3 mb-4">
        <Avatar>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="font-semibold text-card-foreground">Bạn</h4>
          <p className="text-sm text-muted-foreground">Vừa xong</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-card-foreground leading-relaxed">{content}</p>
        
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg"
          />
        )}

        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground flex items-center justify-between">
            {isPreview ? "Xem trước bài viết" : "Tạo bài viết mới"}
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {isPreview ? (
            <>
              <PreviewPost />
              <div className="flex gap-3">
                <Button 
                  onClick={() => setIsPreview(false)} 
                  variant="outline" 
                  className="flex-1"
                >
                  Chỉnh sửa
                </Button>
                <Button onClick={handleSubmit} className="flex-1 bg-gradient-primary">
                  Đăng bài
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Content Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Nội dung bài viết
                </label>
                <Textarea
                  placeholder="Chia sẻ suy nghĩ của bạn..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[120px] resize-none bg-background/50 border-border text-card-foreground"
                  maxLength={1000}
                />
                <div className="text-right text-xs text-muted-foreground">
                  {content.length}/1000
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Hình ảnh (tùy chọn)
                </label>
                <div className="flex gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex-1 cursor-pointer"
                  >
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-smooth">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Nhấn để tải ảnh lên
                      </p>
                    </div>
                  </label>
                </div>
                
                {selectedImage && (
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      onClick={() => setSelectedImage(null)}
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Tags Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Thẻ (chọn tối đa 3)
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer transition-smooth ${
                        selectedTags.includes(tag) 
                          ? "bg-gradient-primary" 
                          : "hover:bg-accent/20"
                      }`}
                      onClick={() => selectedTags.length < 3 || selectedTags.includes(tag) ? toggleTag(tag) : null}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Đã chọn: {selectedTags.length}/3
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={onClose} 
                  variant="outline" 
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button 
                  onClick={() => setIsPreview(true)} 
                  variant="outline" 
                  className="flex-1"
                  disabled={!content.trim()}
                >
                  Xem trước
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  className="flex-1 bg-gradient-primary"
                  disabled={!content.trim()}
                >
                  Đăng ngay
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;