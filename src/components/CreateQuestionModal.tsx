import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, HelpCircle, Tag, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionCreated: (question: any) => void;
}

const CreateQuestionModal = ({ isOpen, onClose, onQuestionCreated }: CreateQuestionModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const { toast } = useToast();

  const categories = [
    { value: "shopping", label: "Mua sắm" },
    { value: "tech", label: "Công nghệ" },
    { value: "beauty", label: "Làm đẹp" },
    { value: "fashion", label: "Thời trang" },
    { value: "food", label: "Ăn uống" },
    { value: "travel", label: "Du lịch" },
    { value: "other", label: "Khác" }
  ];

  const availableTags = [
    "#CầnTuVấn", "#KinhNghiệm", "#Review", "#SoSánh", 
    "#GiáCả", "#ChấtLượng", "#ThuongHieu", "#TipHay"
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
    if (!title.trim() || !description.trim() || !category) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin câu hỏi",
        variant: "destructive"
      });
      return;
    }

    const newQuestion = {
      id: Date.now(),
      type: "question",
      user: {
        name: "Bạn",
        avatar: "/placeholder.svg",
        verified: false,
      },
      title: title.trim(),
      content: description.trim(),
      image: selectedImage,
      category: categories.find(c => c.value === category)?.label || "Khác",
      likes: 0,
      comments: 0,
      shares: 0,
      time: "Vừa xong",
      tags: selectedTags,
      answers: 0
    };

    onQuestionCreated(newQuestion);
    
    // Reset form
    setTitle("");
    setDescription("");
    setCategory("");
    setSelectedTags([]);
    setSelectedImage(null);
    setIsPreview(false);
    
    toast({
      title: "Thành công!",
      description: "Câu hỏi đã được đăng thành công",
    });
    
    onClose();
  };

  const PreviewQuestion = () => (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center gap-3 mb-4">
        <Avatar>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-card-foreground">Bạn</h4>
            <Badge variant="outline" className="text-xs">
              {categories.find(c => c.value === category)?.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Vừa xong</p>
        </div>
        <HelpCircle className="w-5 h-5 text-accent" />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        <p className="text-card-foreground leading-relaxed">{description}</p>
        
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

        <div className="text-sm text-muted-foreground">
          0 câu trả lời • 0 lượt thích
        </div>
      </div>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-accent" />
              {isPreview ? "Xem trước câu hỏi" : "Đặt câu hỏi mới"}
            </div>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {isPreview ? (
            <>
              <PreviewQuestion />
              <div className="flex gap-3">
                <Button 
                  onClick={() => setIsPreview(false)} 
                  variant="outline" 
                  className="flex-1"
                >
                  Chỉnh sửa
                </Button>
                <Button onClick={handleSubmit} className="flex-1 bg-gradient-accent">
                  Đăng câu hỏi
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Tiêu đề câu hỏi *
                </label>
                <Input
                  placeholder="Ví dụ: Nên mua iPhone hay Samsung trong tầm giá 20 triệu?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-background/50 border-border text-card-foreground"
                  maxLength={200}
                />
                <div className="text-right text-xs text-muted-foreground">
                  {title.length}/200
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Danh mục *
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-background/50 border-border text-card-foreground">
                    <SelectValue placeholder="Chọn danh mục phù hợp" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value} className="text-popover-foreground">
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Mô tả chi tiết *
                </label>
                <Textarea
                  placeholder="Mô tả chi tiết câu hỏi của bạn, bao gồm ngữ cảnh và những gì bạn đã thử..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] resize-none bg-background/50 border-border text-card-foreground"
                  maxLength={1500}
                />
                <div className="text-right text-xs text-muted-foreground">
                  {description.length}/1500
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Hình ảnh minh họa (tùy chọn)
                </label>
                <div className="flex gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="question-image-upload"
                  />
                  <label
                    htmlFor="question-image-upload"
                    className="flex-1 cursor-pointer"
                  >
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-smooth">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Nhấn để tải ảnh minh họa
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
                  <Tag className="w-4 h-4" />
                  Thẻ (chọn tối đa 4)
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer transition-smooth ${
                        selectedTags.includes(tag) 
                          ? "bg-gradient-accent" 
                          : "hover:bg-accent/20"
                      }`}
                      onClick={() => selectedTags.length < 4 || selectedTags.includes(tag) ? toggleTag(tag) : null}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Đã chọn: {selectedTags.length}/4
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
                  disabled={!title.trim() || !description.trim() || !category}
                >
                  Xem trước
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  className="flex-1 bg-gradient-accent"
                  disabled={!title.trim() || !description.trim() || !category}
                >
                  Đăng câu hỏi
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuestionModal;