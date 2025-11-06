import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Loader2, ArrowLeft, Upload, X, ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Product {
    product_id: number;
    seller_id: number;
    product_name: string;
    image_url: string;
    price: number;
    has_reviewed: boolean;
}

interface ReviewData {
    rating: number;
    comment: string;
    images: File[];
}

const ReviewOrder = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [reviews, setReviews] = useState<{
        [productId: number]: ReviewData
    }>({});
    const [previewImages, setPreviewImages] = useState<{
        [productId: number]: string[]
    }>({});

    useEffect(() => {
        if (user?.id && orderId) {
            fetchProducts();
        }
    }, [user?.id, orderId]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/review/check_review_eligibility.php?user_id=${user?.id}&order_id=${orderId}`
            );
            const data = await response.json();

            if (data.success) {
                setProducts(data.products);
                const initialReviews: any = {};
                const initialPreviews: any = {};
                
                data.products.forEach((product: Product) => {
                    if (!product.has_reviewed) {
                        initialReviews[product.product_id] = { 
                            rating: 0, 
                            comment: "",
                            images: []
                        };
                        initialPreviews[product.product_id] = [];
                    }
                });
                
                setReviews(initialReviews);
                setPreviewImages(initialPreviews);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast({
                title: "Lỗi",
                description: "Không thể tải danh sách sản phẩm",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRatingChange = (productId: number, rating: number) => {
        setReviews((prev) => ({
            ...prev,
            [productId]: { ...prev[productId], rating },
        }));
    };

    const handleCommentChange = (productId: number, comment: string) => {
        setReviews((prev) => ({
            ...prev,
            [productId]: { ...prev[productId], comment },
        }));
    };

    const handleImageUpload = (productId: number, files: FileList | null) => {
        if (!files) return;
        
        const newImages = Array.from(files).slice(0, 5 - (reviews[productId]?.images.length || 0));
        
        // Validate file types and sizes
        const validImages = newImages.filter(file => {
            const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
            
            if (!isValidType) {
                toast({
                    title: "Lỗi",
                    description: "Chỉ chấp nhận file JPG, PNG, WEBP",
                    variant: "destructive"
                });
                return false;
            }
            
            if (!isValidSize) {
                toast({
                    title: "Lỗi", 
                    description: "Kích thước ảnh không được vượt quá 5MB",
                    variant: "destructive"
                });
                return false;
            }
            
            return true;
        });
        
        // Update reviews state
        setReviews(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                images: [...(prev[productId]?.images || []), ...validImages]
            }
        }));
        
        // Create preview URLs
        const newPreviews = validImages.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => ({
            ...prev,
            [productId]: [...(prev[productId] || []), ...newPreviews]
        }));
    };

    const handleRemoveImage = (productId: number, index: number) => {
        setReviews(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                images: prev[productId].images.filter((_, i) => i !== index)
            }
        }));
        
        // Revoke preview URL
        URL.revokeObjectURL(previewImages[productId][index]);
        
        setPreviewImages(prev => ({
            ...prev,
            [productId]: prev[productId].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        
        try {
            const reviewPromises = Object.entries(reviews)
                .filter(([_, review]) => review.rating > 0)
                .map(async ([productId, review]) => {
                    const formData = new FormData();
                    formData.append('user_id', user?.id?.toString() || '');
                    formData.append('product_id', productId);
                    formData.append('order_id', orderId || '');
                    formData.append('rating', review.rating.toString());
                    formData.append('comment', review.comment);
                    
                    // Append images
                    review.images.forEach((image, index) => {
                        formData.append(`images[]`, image);
                    });
                    
                    return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/review/submit_review.php`, {
                        method: "POST",
                        body: formData
                    });
                });

            const results = await Promise.all(reviewPromises);
            const allSuccess = await Promise.all(
                results.map(async res => {
                    const data = await res.json();
                    return data.success;
                })
            );

            if (allSuccess.every(s => s)) {
                toast({
                    title: "Thành công",
                    description: "Cảm ơn bạn đã đánh giá sản phẩm!",
                });
                navigate("/orders");
            }
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Không thể gửi đánh giá",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const canSubmit = Object.values(reviews).some((review) => review.rating > 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="mt-4 text-muted-foreground">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/orders")}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại
                    </Button>
                    
                    <h1 className="text-3xl font-bold mb-2">Đánh giá sản phẩm</h1>
                    <p className="text-muted-foreground">
                        Chia sẻ trải nghiệm của bạn về các sản phẩm đã mua
                    </p>
                </motion.div>

                {/* Products */}
                <div className="space-y-6">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.product_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card>
                                <CardContent className="p-6 space-y-6">
                                    {/* Product Info */}
                                    <div className="flex gap-4">
                                        <img
                                            src={product.image_url}
                                            alt={product.product_name}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">
                                                {product.product_name}
                                            </h3>
                                            <p className="text-muted-foreground">
                                                {product.price.toLocaleString("vi-VN")}đ
                                            </p>
                                        </div>
                                    </div>

                                    {product.has_reviewed ? (
                                        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm font-medium">
                                            ✓ Bạn đã đánh giá sản phẩm này
                                        </div>
                                    ) : (
                                        <>
                                            {/* Rating */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">
                                                    Đánh giá của bạn <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() =>
                                                                handleRatingChange(product.product_id, star)
                                                            }
                                                            className="transition-all hover:scale-110"
                                                        >
                                                            <Star
                                                                className={`w-10 h-10 ${
                                                                    star <=
                                                                    (reviews[product.product_id]?.rating || 0)
                                                                        ? "fill-yellow-400 text-yellow-400"
                                                                        : "text-gray-300 hover:text-yellow-200"
                                                                }`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                                {reviews[product.product_id]?.rating > 0 && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {reviews[product.product_id].rating === 5 && "Tuyệt vời! ⭐⭐⭐⭐⭐"}
                                                        {reviews[product.product_id].rating === 4 && "Rất tốt! ⭐⭐⭐⭐"}
                                                        {reviews[product.product_id].rating === 3 && "Tốt ⭐⭐⭐"}
                                                        {reviews[product.product_id].rating === 2 && "Tạm được ⭐⭐"}
                                                        {reviews[product.product_id].rating === 1 && "Không hài lòng ⭐"}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Comment */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">
                                                    Nhận xét (không bắt buộc)
                                                </label>
                                                <Textarea
                                                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                                    value={reviews[product.product_id]?.comment || ""}
                                                    onChange={(e) =>
                                                        handleCommentChange(
                                                            product.product_id,
                                                            e.target.value
                                                        )
                                                    }
                                                    rows={4}
                                                    className="resize-none"
                                                />
                                            </div>

                                            {/* Image Upload */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">
                                                    Thêm hình ảnh (Tối đa 5 ảnh)
                                                </label>
                                                
                                                <div className="flex flex-wrap gap-3">
                                                    {/* Preview Images */}
                                                    {previewImages[product.product_id]?.map((preview, idx) => (
                                                        <div key={idx} className="relative group">
                                                            <img
                                                                src={preview}
                                                                alt={`Preview ${idx + 1}`}
                                                                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                                                            />
                                                            <button
                                                                onClick={() => handleRemoveImage(product.product_id, idx)}
                                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    
                                                    {/* Upload Button */}
                                                    {(previewImages[product.product_id]?.length || 0) < 5 && (
                                                        <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                                                            <ImagePlus className="w-8 h-8 text-gray-400" />
                                                            <span className="text-xs text-gray-500 mt-1">Thêm ảnh</span>
                                                            <input
                                                                type="file"
                                                                multiple
                                                                accept="image/jpeg,image/png,image/webp"
                                                                className="hidden"
                                                                onChange={(e) => handleImageUpload(product.product_id, e.target.files)}
                                                            />
                                                        </label>
                                                    )}
                                                </div>
                                                
                                                <p className="text-xs text-muted-foreground">
                                                    Chấp nhận JPG, PNG, WEBP. Tối đa 5MB/ảnh
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Submit Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-3 justify-end mt-8 sticky bottom-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg border"
                >
                    <Button
                        variant="outline"
                        onClick={() => navigate("/orders")}
                        disabled={submitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!canSubmit || submitting}
                        className="min-w-[120px]"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang gửi...
                            </>
                        ) : (
                            "Gửi đánh giá"
                        )}
                    </Button>
                </motion.div>
            </div>
        </div>
    );
};

export default ReviewOrder;