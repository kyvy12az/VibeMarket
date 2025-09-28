import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { X, ImageIcon, Hash, Smile, Tag } from "lucide-react";
import ProductSelectionModal from "@/components/modals/ProductSelectionModal";
import { useToast } from "@/hooks/use-toast";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: any) => void;
}

const CreatePostModal = ({ isOpen, onClose, onPostCreated }: CreatePostModalProps) => {
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { toast } = useToast();
  // Sản phẩm nổi bật sẽ lấy từ ProductSelectionModal

  const availableTags = [
    "#ReviewSảnPhẩm", "#TipsMuaSắm", "#LocalBrand", "#FlashSale",
    "#ThoiTrang", "#CongNghe", "#LamDep", "#AnUong", "#DuLich"
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = files.slice(0, 3 - selectedImages.length).map(file => URL.createObjectURL(file));
      setSelectedImages(prev => [...prev, ...newImages].slice(0, 3));
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
        name: "Kỳ Vỹ",
        avatar: "/images/avatars/Avt-Vy.jpg",
        verified: false,
      },
      content: content.trim(),
      images: selectedImages,
      likes: 0,
      comments: 0,
      shares: 0,
      time: "Vừa xong",
      tags: selectedTags,
      featuredProduct: selectedProduct || undefined
    };

    onPostCreated(newPost);
    // Reset form
    resetForm();
    toast({
      title: "Thành công!",
      description: "Bài viết đã được đăng thành công",
    });
    onClose();
  };

  const resetForm = () => {
    setContent("");
    setSelectedImages([]);
    setSelectedTags([]);
    setSelectedProduct(null);
    setIsPreview(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
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
        {selectedImages.length > 0 && (
          <div className={`grid gap-2 ${selectedImages.length === 1 ? '' : 'grid-cols-2'} ${selectedImages.length === 3 ? 'md:grid-cols-3' : ''}`}>
            {selectedImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Preview ${idx + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
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
        {/* Sản phẩm nổi bật preview */}
        {selectedProduct && (
          <div className="bg-neutral-900 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-3">
              <Tag className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-medium text-white">Sản phẩm nổi bật</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:justify-between bg-neutral-900 rounded-lg p-3 gap-3">
              <div className="flex items-center w-full sm:w-auto justify-center sm:justify-start">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-16 h-16 sm:w-12 sm:h-12 rounded-lg object-cover mr-0 sm:mr-3 border border-white/10"
                />
                <div className="text-center sm:text-left">
                  <p className="text-sm font-medium text-white line-clamp-1">
                    {selectedProduct.name}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {formatPrice(selectedProduct.price)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={() => {onClose() ; resetForm()}}>
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
                  Hình ảnh (tối đa 3)
                </label>
                <div className="flex gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={selectedImages.length >= 3}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex-1 cursor-pointer ${selectedImages.length >= 3 ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-smooth">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {selectedImages.length < 3 ? 'Nhấn để tải ảnh lên' : 'Đã đủ 3 ảnh'}
                      </p>
                    </div>
                  </label>
                </div>

                {selectedImages.length > 0 && (
                  <div className={`grid gap-2 ${selectedImages.length === 1 ? '' : 'grid-cols-2'} ${selectedImages.length === 3 ? 'md:grid-cols-3' : ''}`}>
                    {selectedImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={img}
                          alt={`Selected ${idx + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 border-2 border-white/70 shadow-lg transition-all hover:bg-red-600 hover:border-red-400 hover:scale-110"
                          aria-label="Xoá ảnh"
                        >
                          <X className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    ))}
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
                      className={`cursor-pointer transition-smooth ${selectedTags.includes(tag)
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

              {/* Action Buttons & Chọn sản phẩm nổi bật */}
              <div className="flex gap-3 flex-wrap">
                <Button
                  onClick={() => {
                    onClose;
                    resetForm();
                  }}
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
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsProductModalOpen(true)}
                >
                  <Tag className="w-4 h-4 mr-1" />
                  Chọn sản phẩm nổi bật
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-primary"
                  disabled={!content.trim()}
                >
                  Đăng ngay
                </Button>
                {selectedProduct && (
                  <div className="flex items-center gap-2 mt-2 w-full">
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-xs text-primary font-semibold">{selectedProduct.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(null)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-black/60 border-2 border-white/70 shadow-lg transition-all hover:bg-red-600 hover:border-red-400 hover:scale-110"
                      aria-label="Xoá sản phẩm nổi bật"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
              </div>
              {/* Modal chọn sản phẩm nổi bật */}
              <ProductSelectionModal
                open={isProductModalOpen}
                onOpenChange={setIsProductModalOpen}
                onProductSelect={(products) => {
                  if (products.length > 0) setSelectedProduct(products[0]);
                  else setSelectedProduct(null);
                }}
                selectedProducts={selectedProduct ? [selectedProduct] : []}
              />

            </>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;