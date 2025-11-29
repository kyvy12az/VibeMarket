import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { X, ImageIcon, Hash, Tag } from "lucide-react";
import ProductSelectionModal from "@/components/modals/ProductSelectionModal";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
  rating: number;
  category: string;
  description?: string;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: any) => void;
}

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ;

const CreatePostModal = ({
  isOpen,
  onClose,
  onPostCreated,
}: CreatePostModalProps) => {
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const vibUser = JSON.parse(localStorage.getItem("vibeventure_user") || "{}");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const { toast } = useToast();

  const availableTags = [
    "#ReviewSảnPhẩm",
    "#TipsMuaSắm",
    "#LocalBrand",
    "#FlashSale",
    "#ThoiTrang",
    "#CongNghe",
    "#LamDep",
    "#AnUong",
    "#DuLich",
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 0) {
      const availableSlots = 20 - selectedImages.length;
      const filesToAdd = files.slice(0, availableSlots);
      
      const newImageUrls = filesToAdd.map((file) => URL.createObjectURL(file));

      setSelectedImages((prev) => [...prev, ...newImageUrls]);
      setSelectedImageFiles((prev) => [...prev, ...filesToAdd]);
    }
    
    // Reset input để có thể chọn lại cùng file
    e.target.value = '';
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập nội dung bài viết",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem("vibeventure_token");
    if (!token) {
      toast({ title: "Lỗi", description: "Bạn chưa đăng nhập!" });
      return;
    }

    const form = new FormData();
    form.append("content", content.trim());
    form.append("tags", JSON.stringify(selectedTags));

    if (selectedProducts.length > 0) {
      form.append("featured_products", JSON.stringify(selectedProducts));
    }

    // Upload các file ảnh đã chọn
    if (selectedImageFiles.length > 0) {
      selectedImageFiles.forEach((file) => {
        form.append("images[]", file);
      });
    }

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/community/posts/post_add.php`,
        {
          method: "POST",
          headers: { Authorization: "Bearer " + token },
          body: form,
        }
      );

      const data = await res.json();

      if (!data.success) {
        toast({
          title: "Lỗi",
          description: data.message || "Không thể đăng bài",
        });
        return;
      }

      const detailRes = await fetch(
        `${BACKEND_URL}/api/community/posts/post_detail.php?id=${data.post_id}`,
        { headers: { Authorization: "Bearer " + token } }
      );

      const detailData = await detailRes.json();
      console.log(detailData);

      if (detailData.success) {
        const p = detailData.post;

        const newPost = {
          id: p.id,
          type: "sharing",
          user: {
            name: p.author?.name || "Người dùng",
            avatar: p.author?.avatar || "/images/default-avatar.png",
            verified: false,
            followers: 0,
          },
          title: "",
          content: p.content,
          images: p.images || [],
          likes: p.likes_count || 0,
          comments: p.comments_count || 0,
          shares: 0,
          saves: p.saves_count || 0,
          views: 0,
          tags: p.tags || [],
          featuredProducts: p.featured_products || [],
          isLive: false,
          liked: p.is_liked || false,
          isSaved: p.is_saved || false,
          time: new Date(p.created_at).toLocaleString("vi-VN"),
        };

        onPostCreated(newPost);
      }

      toast({ title: "Thành công!", description: "Bài viết đã được đăng" });

      resetForm();
      onClose();
    } catch (err) {
      console.error(err);
      toast({ title: "Lỗi mạng", description: "Hãy thử lại sau!" });
    }
  };

  const resetForm = () => {
    setContent("");
    
    // Revoke object URLs để tránh memory leak
    selectedImages.forEach(url => URL.revokeObjectURL(url));
    
    setSelectedImages([]);
    setSelectedImageFiles([]);
    setSelectedTags([]);
    setSelectedProducts([]);
    setIsPreview(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const PreviewPost = () => (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center gap-3 mb-4">
        <Avatar>
          <AvatarImage src={vibUser?.avatar || "/placeholder.svg"} />
          <AvatarFallback>{vibUser?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="font-semibold text-card-foreground">
            {vibUser?.name || "Bạn"}
          </h4>
          <p className="text-sm text-muted-foreground">Vừa xong</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-card-foreground leading-relaxed">{content}</p>

        {selectedImages.length > 0 && (
          <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {selectedImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
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

        {selectedProducts.length > 0 && (
          <div className="w-full mt-3">
            <label className="text-sm font-medium text-card-foreground mb-2 block">
              Sản phẩm đã chọn
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/10 hover:bg-black/40 transition-all group"
                >
                  <img
                    src={p.image || "/placeholder.png"}
                    className="w-10 h-10 rounded-lg object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {formatPrice(p.price)}
                    </p>
                  </div>

                  <button
                    className="opacity-70 group-hover:opacity-100 transition-all"
                    onClick={() =>
                      setSelectedProducts((prev) =>
                        prev.filter((sp) => sp.id !== p.id)
                      )
                    }
                  >
                    <X className="w-5 h-5 text-white hover:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-card border-border">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            {isPreview ? "Xem trước bài viết" : "Tạo bài viết mới"}
          </DialogTitle>
          {!isPreview && (
            <p className="text-sm text-muted-foreground mt-1">
              Chia sẻ khoảnh khắc, suy nghĩ của bạn với cộng đồng
            </p>
          )}
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
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-primary to-purple-600"
                >
                  Đăng bài
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                  <div className="w-1 h-5 bg-gradient-primary rounded-full"></div>
                  Nội dung bài viết
                </label>
                <Textarea
                  placeholder="Bạn đang nghĩ gì? Chia sẻ với mọi người nhé..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[140px] resize-none bg-background/50 border-border text-card-foreground focus:ring-2 focus:ring-accent rounded-xl"
                  maxLength={1000}
                />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Tối đa 1000 ký tự</span>
                  <span className={`font-medium ${
                    content.length > 900 ? 'text-red-500' : 'text-muted-foreground'
                  }`}>
                    {content.length}/1000
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                  <div className="w-1 h-5 bg-gradient-primary rounded-full"></div>
                  Hình ảnh
                  <Badge variant="secondary" className="text-xs">
                    {selectedImages.length}/20
                  </Badge>
                </label>

                <div className="flex gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={selectedImages.length >= 20}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex-1 cursor-pointer ${
                      selectedImages.length >= 20
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                  >
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent hover:bg-accent/5 transition-all group">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-6 h-6 text-accent" />
                      </div>
                      <p className="text-sm font-medium text-card-foreground mb-1">
                        {selectedImages.length < 20
                          ? "Nhấn để tải ảnh lên"
                          : "Đã đủ 20 ảnh"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Hỗ trợ JPG, PNG, GIF
                      </p>
                    </div>
                  </label>
                </div>

                {selectedImages.length > 0 && (
                  <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {selectedImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          className="w-full h-40 object-cover rounded-xl border border-border"
                          alt={`Preview ${idx + 1}`}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-xl" />
                        <button
                          onClick={() => {
                            setSelectedImages((prev) =>
                              prev.filter((_, i) => i !== idx)
                            );
                            setSelectedImageFiles((prev) =>
                              prev.filter((_, i) => i !== idx)
                            );
                          }}
                          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:scale-110 transition-all"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          #{idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                  <div className="w-1 h-5 bg-gradient-primary rounded-full"></div>
                  <Hash className="w-4 h-4 text-accent" />
                  Thẻ hashtag
                  <Badge variant="secondary" className="text-xs">
                    {selectedTags.length}/3
                  </Badge>
                </label>

                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    const isDisabled = !isSelected && selectedTags.length >= 3;
                    
                    return (
                      <Badge
                        key={tag}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer transition-all px-3 py-1.5 ${
                          isSelected
                            ? "bg-gradient-primary text-white shadow-md scale-105"
                            : isDisabled
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:bg-accent/20 hover:scale-105 hover:shadow-sm"
                        }`}
                        onClick={() =>
                          !isDisabled ? toggleTag(tag) : null
                        }
                      >
                        {tag}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 border-dashed"
                  onClick={() => setIsProductModalOpen(true)}
                >
                  <Tag className="w-4 h-4 mr-2" />
                  Gắn thẻ sản phẩm nổi bật
                  {selectedProducts.length > 0 && (
                    <Badge className="ml-2 bg-accent">
                      {selectedProducts.length}
                    </Badge>
                  )}
                </Button>

                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="h-11"
                    onClick={() => {
                      resetForm();
                      onClose();
                    }}
                  >
                    Hủy
                  </Button>

                  <Button
                    variant="outline"
                    className="h-11"
                    disabled={!content.trim()}
                    onClick={() => setIsPreview(true)}
                  >
                    Xem trước
                  </Button>

                  <Button
                    onClick={handleSubmit}
                    className="h-11 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                    disabled={!content.trim()}
                  >
                    Đăng bài
                  </Button>
                </div>
              </div>

                {selectedProducts.length > 0 && (
                  <div className="mt-2 w-full flex flex-wrap gap-2">
                    {selectedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-2 px-2 py-1 rounded-full bg-black/40 border border-white/10"
                      >
                        <img
                          src={p.image || "/placeholder.png"}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs text-primary font-semibold line-clamp-1 max-w-[120px]">
                          {p.name}
                        </span>
                        <button
                          onClick={() =>
                            setSelectedProducts((prev) =>
                              prev.filter((sp) => sp.id !== p.id)
                            )
                          }
                          className="w-5 h-5 flex items-center justify-center rounded-full bg-black/60 hover:bg-red-600 transition-all"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              <ProductSelectionModal
                open={isProductModalOpen}
                onOpenChange={setIsProductModalOpen}
                onProductSelect={(products) => {
                  setSelectedProducts(products);
                }}
                selectedProducts={selectedProducts}
              />
            </>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
