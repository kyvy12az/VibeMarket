import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Heart,
    Share2,
    Star,
    ShoppingCart,
    Truck,
    Shield,
    RotateCcw,
    MessageCircle,
    User,
    ThumbsUp,
    ChevronLeft,
    ChevronRight,
    Plus,
    Minus,
    AlertTriangle, 
    X,
    Loader2
} from "lucide-react";
import hotToast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ReviewImage {
    url: string;
}

interface Review {
    id: number;
    user_name: string;
    avatar_url: string;
    rating: number;
    time_ago: string;
    comment: string;
    likes: number;
    images: string[];
}

interface RatingDistribution {
    stars: number;
    count: number;
    percentage: number;
}

interface ReviewStats {
    total_reviews: number;
    avg_rating: number;
    rating_distribution: RatingDistribution[];
}

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { addToCart } = useCart();
    const [cartModalOpen, setCartModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [selectedReviewImage, setSelectedReviewImage] = useState<string | null>(null);
    const { toast } = useToast();

    // Mock product data - In real app, fetch by ID
    // const product = {
    //     id: 1,
    //     name: "Áo thun local brand premium",
    //     price: "299.000",
    //     originalPrice: "399.000",
    //     discount: 25,
    //     rating: 4.8,
    //     totalReviews: 124,
    //     sold: 1250,
    //     inStock: 45,
    //     brand: "VietStyle Co.",
    //     description: "Áo thun local brand cao cấp với chất liệu cotton 100% tự nhiên, thiết kế tối giản nhưng tinh tế. Phù hợp cho mọi hoạt động hàng ngày.",
    //     features: [
    //         "Chất liệu cotton 100% tự nhiên",
    //         "Form áo vừa vặn, thoải mái",
    //         "Màu sắc bền đẹp sau nhiều lần giặt",
    //         "Thiết kế unisex phù hợp mọi giới tính"
    //     ],
    //     images: [
    //         "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
    //         "https://images.unsplash.com/photo-1503341338145-b5c2b2e19337?w=600&h=600&fit=crop",
    //         "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop",
    //         "https://images.unsplash.com/photo-1583743814966-8936f37f2e14?w=600&h=600&fit=crop"
    //     ],
    //     sizes: ["S", "M", "L", "XL", "XXL"],
    //     colors: ["Đen", "Trắng", "Xám", "Navy"],
    //     specifications: {
    //         "Chất liệu": "Cotton 100%",
    //         "Xuất xứ": "Việt Nam",
    //         "Kích thước": "S-XXL",
    //         "Trọng lượng": "180g",
    //         "Kiểu dáng": "Regular fit"
    //     }
    // };

    const recommendedProducts = [
        {
            id: 2,
            name: "Áo polo classic",
            price: "399.000",
            image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=300&h=300&fit=crop",
            rating: 4.7
        },
        {
            id: 3,
            name: "Quần jean slim fit",
            price: "599.000",
            image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop",
            rating: 4.9
        },
        {
            id: 4,
            name: "Áo hoodie unisex",
            price: "499.000",
            image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop",
            rating: 4.6
        }
    ];

    const ratingDistribution = [
        { stars: 5, count: 78, percentage: 63 },
        { stars: 4, count: 31, percentage: 25 },
        { stars: 3, count: 10, percentage: 8 },
        { stars: 2, count: 3, percentage: 2 },
        { stars: 1, count: 2, percentage: 2 }
    ];

    // Fetch product details
    useEffect(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/detail.php?id=${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProduct(data.product);
                    // Fetch reviews after product is loaded
                    fetchReviews();
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching product:", error);
                setLoading(false);
            });
    }, [id]);

    // Fetch reviews
    const fetchReviews = async () => {
        if (!id) return;
        
        setLoadingReviews(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/review/get_product_reviews.php?product_id=${id}`
            );
            const data = await response.json();
            
            if (data.success) {
                setReviews(data.reviews);
                setReviewStats(data.stats);
            } else {
                console.error("Error:", data.error);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoadingReviews(false);
        }
    };

    useEffect(() => {
        if (product) {
            setSelectedSize(product.sizes?.[0] || "");
            setSelectedColor(product.colors?.[0] || "");
        }
    }, [product]);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    // Helper function to render stars
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`w-4 h-4 ${
                    index < rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                }`}
            />
        ));
    };

    const handleAddToCart = () => {
        if (quantity < 1 || quantity > product.inStock) {
            toast({
                title: "Số lượng không hợp lệ!",
                description: `Vui lòng chọn số lượng từ 1 đến ${product.inStock}`,
                variant: "destructive",
            });
            return;
        }
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images?.[0] || "",
            quantity,
            seller_id: product.seller_id,
            size: selectedSize,
            color: selectedColor,
        });
        setCartModalOpen(true);
        toast({
            title: "Đã thêm vào giỏ hàng!",
            description: `${product.name} x${quantity}`,
            duration: 2000,
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (loading) return (
        <div className="flex min-h-[100vh] items-center justify-center">
            {loading && (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center">
                        <div className="relative w-20 h-20">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <img src="/logo.png" alt="Logo" className="w-10 h-10" />
                            </div>
                            <div className="absolute inset-0 rounded-full border-4 border-gray-300 border-t-transparent animate-spin"></div>
                        </div>
                        <span className="mt-4 text-sm text-gray-500 animate-pulse">
                            Đang tải dữ liệu....
                        </span>
                    </div>
                </div>
            )}
            {!loading && (
                <div className='flex flex-col items-center'>
                    {/* <div className="mb-4 p-4 bg-error-50 text-error-700 rounded-lg text-sm">
                        {error}
                    </div> */}
                    <button onClick={() => (navigate('/login', { replace: true }))} className='mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg'>
                        Thử lại
                    </button>
                </div>
            )}
        </div>
    )
    if (!product) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
            <AlertTriangle className="w-16 h-16 mb-4 text-destructive" />
            <h2 className="text-2xl font-bold mb-2">Không tìm thấy sản phẩm</h2>
            <p className="mb-6">Sản phẩm này không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
            <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Quay về trang trước
            </Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="z-50 bg-background/95">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(-1)}
                            className="hover:bg-accent"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsLiked(!isLiked)}
                                className={`hover:bg-accent ${isLiked ? "text-red-500" : ""}`}
                            >
                                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-accent">
                                <Share2 className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative bg-muted rounded-lg overflow-hidden aspect-square">
                            <img
                                src={product.images[currentImageIndex]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />

                            {product.discount > 0 && (
                                <Badge className="absolute top-4 left-4 bg-destructive text-white">
                                    -{product.discount}%
                                </Badge>
                            )}

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="flex gap-2 overflow-x-auto">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${currentImageIndex === index ? "border-primary" : "border-transparent"
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    {renderStars(Math.floor(product.rating))}
                                    <span className="font-medium ml-1">{product.rating}</span>
                                </div>
                                <span className="text-muted-foreground">({reviewStats && reviewStats.total_reviews} đánh giá)</span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">Đã bán {product.sold}</span>
                            </div>

                            <div className="flex items-baseline gap-3 mb-6">
                                <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
                                {product.originalPrice && (
                                    <span className="text-lg text-muted-foreground line-through">
                                        {formatPrice(product.originalPrice)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Size Selection */}
                        {product.sizes && product.sizes.filter(s => s.trim() !== "").length > 0 && (
                            <div>
                                <h3 className="font-semibold mb-3">Kích thước</h3>
                                <div className="flex gap-2 flex-wrap">
                                    {product.sizes.filter(s => s.trim() !== "").map((size) => (
                                        <Button
                                            key={size}
                                            variant={selectedSize === size ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedSize(size)}
                                            className="min-w-[48px]"
                                        >
                                            {size}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Color Selection */}
                        {product.colors && product.colors.filter(c => c.trim() !== "").length > 0 && (
                            <div>
                                <h3 className="font-semibold mb-3">Màu sắc</h3>
                                <div className="flex gap-2 flex-wrap">
                                    {product.colors.filter(c => c.trim() !== "").map((color) => (
                                        <Button
                                            key={color}
                                            variant={selectedColor === color ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedColor(color)}
                                        >
                                            {color}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                            <h3 className="font-semibold mb-3">Số lượng</h3>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border rounded-lg">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="h-10 w-10"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="h-10 w-10"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <span className="text-muted-foreground">
                                    Còn lại {product.inStock} sản phẩm
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Button
                                size="lg"
                                className="w-full bg-gradient-primary hover:opacity-90"
                                onClick={() => handleAddToCart()}
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Thêm vào giỏ hàng
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full"
                                onClick={() => {
                                    hotToast.loading("Đang chuyển đến trang thanh toán...", {
                                        duration: 1500,
                                        position: "top-center",
                                    });

                                    setTimeout(() => {
                                        navigate("/checkout", {
                                            state: {
                                                products: [{
                                                    ...product,
                                                    seller_id: product.seller_id,
                                                    image: product.images?.[0] || product.image || "",
                                                    selectedSize,
                                                    selectedColor,
                                                    quantity,
                                                    shipping_fee: product.shipping_fee
                                                }]
                                            }
                                        })
                                    }, 1000);

                                }}
                            >
                                Mua ngay
                            </Button>
                        </div>

                        {/* Shipping Info */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Truck className="w-5 h-5 text-green-500" />
                                        <div>
                                            <p className="font-medium">Miễn phí vận chuyển</p>
                                            <p className="text-sm text-muted-foreground">Đơn hàng từ 200.000đ</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <RotateCcw className="w-5 h-5 text-blue-500" />
                                        <div>
                                            <p className="font-medium">Đổi trả trong 7 ngày</p>
                                            <p className="text-sm text-muted-foreground">Miễn phí đổi trả</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-purple-500" />
                                        <div>
                                            <p className="font-medium">Bảo hành chất lượng</p>
                                            <p className="text-sm text-muted-foreground">Cam kết chính hãng</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mt-12">
                    <Tabs defaultValue="description" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="description">Mô tả</TabsTrigger>
                            <TabsTrigger value="specifications">Thông số</TabsTrigger>
                            <TabsTrigger value="reviews">
                                Đánh giá {reviewStats && reviewStats.total_reviews > 0 && `(${reviewStats.total_reviews})`}
                            </TabsTrigger>
                            <TabsTrigger value="shipping">Vận chuyển</TabsTrigger>
                        </TabsList>

                        {/* Description Tab */}
                        <TabsContent value="description" className="mt-6">
                            <Card>
                                <CardContent className="p-6">
                                    <p className="text-muted-foreground mb-4">{product.description}</p>
                                    {product.features && product.features.length > 0 && (
                                        <>
                                            <h4 className="font-semibold mb-3">Đặc điểm nổi bật:</h4>
                                            <ul className="space-y-2">
                                                {product.features.map((feature, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                                        <span className="text-muted-foreground">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Specifications Tab */}
                        <TabsContent value="specifications" className="mt-6">
                            <Card>
                                <CardContent className="p-6">
                                    {product.specifications && Object.keys(product.specifications).length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Cột 1: Thông tin cơ bản */}
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-lg mb-4 text-primary border-b pb-2">
                                                    Thông tin cơ bản
                                                </h4>
                                                
                                                {product.sku && (
                                                    <div className="flex justify-between py-3 border-b border-border">
                                                        <span className="text-muted-foreground">Mã SKU</span>
                                                        <span className="font-medium text-right">{product.sku}</span>
                                                    </div>
                                                )}
                                                
                                                {product.brand && (
                                                    <div className="flex justify-between py-3 border-b border-border">
                                                        <span className="text-muted-foreground">Thương hiệu</span>
                                                        <span className="font-medium text-right">{product.brand}</span>
                                                    </div>
                                                )}
                                                
                                                {product.category && (
                                                    <div className="flex justify-between py-3 border-b border-border">
                                                        <span className="text-muted-foreground">Danh mục</span>
                                                        <span className="font-medium text-right">{product.category}</span>
                                                    </div>
                                                )}
                                                
                                                {product.material && (
                                                    <div className="flex justify-between py-3 border-b border-border">
                                                        <span className="text-muted-foreground">Chất liệu</span>
                                                        <span className="font-medium text-right">{product.material}</span>
                                                    </div>
                                                )}
                                                
                                                {product.origin && (
                                                    <div className="flex justify-between py-3 border-b border-border">
                                                        <span className="text-muted-foreground">Xuất xứ</span>
                                                        <span className="font-medium text-right">{product.origin}</span>
                                                    </div>
                                                )}

                                                {product.colors && product.colors.length > 0 && (
                                                    <div className="flex justify-between py-3 border-b border-border">
                                                        <span className="text-muted-foreground">Màu sắc</span>
                                                        <span className="font-medium text-right">
                                                            {Array.isArray(product.colors) 
                                                                ? product.colors.join(", ")
                                                                : product.colors}
                                                        </span>
                                                    </div>
                                                )}

                                                {product.sizes && product.sizes.length > 0 && (
                                                    <div className="flex justify-between py-3 border-b border-border">
                                                        <span className="text-muted-foreground">Kích cỡ</span>
                                                        <span className="font-medium text-right">
                                                            {Array.isArray(product.sizes) 
                                                                ? product.sizes.join(", ")
                                                                : product.sizes}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Cột 2: Kích thước & Vận chuyển */}
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-lg mb-4 text-primary border-b pb-2">
                                                    Kích thước & Vận chuyển
                                                </h4>
                                                
                                                {product.weight && (
                                                    <div className="flex justify-between py-3 border-b border-border">
                                                        <span className="text-muted-foreground">Trọng lượng</span>
                                                        <span className="font-medium text-right">{product.weight}g</span>
                                                    </div>
                                                )}
                                                
                                                {(product.length || product.width || product.height) && (
                                                    <div className="flex justify-between py-3 border-b border-border">
                                                        <span className="text-muted-foreground">Kích thước (D×R×C)</span>
                                                        <span className="font-medium text-right">
                                                            {product.length || '-'} × {product.width || '-'} × {product.height || '-'} cm
                                                        </span>
                                                    </div>
                                                )}
                                                
                                                {product.shipping_fee !== null && product.shipping_fee !== undefined && (
                                                    <div className="flex justify-between py-3 border-b border-border">
                                                        <span className="text-muted-foreground">Phí vận chuyển</span>
                                                        <span className="font-medium text-right">
                                                            {product.shipping_fee === 0 
                                                                ? <Badge variant="secondary">Miễn phí</Badge>
                                                                : formatPrice(product.shipping_fee)}
                                                        </span>
                                                    </div>
                                                )}

                                                {product.inStock !== null && product.inStock !== undefined && (
                                                    <div className="flex justify-between py-3 border-b border-border">
                                                        <span className="text-muted-foreground">Tồn kho</span>
                                                        <span className="font-medium text-right">
                                                            {product.inStock} sản phẩm
                                                        </span>
                                                    </div>
                                                )}

                                                {product.status && (
                                                    <div className="flex justify-between py-3 border-b border-border">
                                                        <span className="text-muted-foreground">Trạng thái</span>
                                                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                                                            {product.status === 'active' ? '✓ Đang bán' : 
                                                             product.status === 'inactive' ? 'Tạm ngưng' : 'Đã xóa'}
                                                        </Badge>
                                                    </div>
                                                )}

                                                {product.flash_sale === 1 && (
                                                    <div className="flex justify-between py-3 border-b border-border">
                                                        <span className="text-muted-foreground">Ưu đãi</span>
                                                        <Badge variant="destructive" className="animate-pulse">
                                                            🔥 Flash Sale
                                                        </Badge>
                                                    </div>
                                                )}

                                                {product.tags && (
                                                    <div className="py-3 border-b border-border">
                                                        <span className="text-muted-foreground block mb-2">Tags</span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {(() => {
                                                                // Xử lý tags - có thể là array hoặc string
                                                                let tagArray: string[] = [];
                                                                
                                                                if (Array.isArray(product.tags)) {
                                                                    tagArray = product.tags;
                                                                } else if (typeof product.tags === 'string' && product.tags.trim()) {
                                                                    tagArray = product.tags.split(',');
                                                                }
                                                                
                                                                return tagArray.map((tag: string, index: number) => (
                                                                    <Badge key={index} variant="outline" className="text-xs">
                                                                        {tag.trim()}
                                                                    </Badge>
                                                                ));
                                                            })()}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            Không có thông số kỹ thuật
                                        </div>
                                    )}

                                    {/* Thông tin người bán */}
                                    {(product.seller_name || product.seller_id) && (
                                        <div className="mt-8 pt-6 border-t border-border">
                                            <h4 className="font-semibold text-lg mb-4 text-primary">
                                                Thông tin người bán
                                            </h4>
                                            <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg">
                                                {product.seller_avatar && (
                                                    <Avatar className="w-16 h-16 border-2 border-primary">
                                                        <AvatarImage src={product.seller_avatar} />
                                                        <AvatarFallback className="bg-primary/10">
                                                            <User className="w-8 h-8 text-primary" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div className="flex-1">
                                                    {product.seller_name && (
                                                        <p className="font-semibold text-lg">{product.seller_name}</p>
                                                    )}
                                                    {product.seller_id && (
                                                        <p className="text-sm text-muted-foreground">ID: {product.seller_id}</p>
                                                    )}
                                                </div>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => navigate(`/seller/${product.seller_id}`)}
                                                >
                                                    Xem shop
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="reviews" className="mt-6">
                            <div className="space-y-6">
                                {loadingReviews ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    </div>
                                ) : reviewStats && reviewStats.total_reviews > 0 ? (
                                    <>
                                        {/* Rating Summary */}
                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    {/* Average Rating */}
                                                    <div className="flex flex-col items-center justify-center text-center border-r">
                                                        <div className="text-5xl font-bold text-primary mb-2">
                                                            {reviewStats.avg_rating.toFixed(1)}
                                                        </div>
                                                        <div className="flex items-center justify-center gap-1 mb-2">
                                                            {renderStars(Math.round(reviewStats.avg_rating))}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {reviewStats.total_reviews} đánh giá
                                                        </p>
                                                    </div>

                                                    {/* Rating Distribution */}
                                                    <div className="space-y-3">
                                                        {reviewStats.rating_distribution.map((item) => (
                                                            <div key={item.stars} className="flex items-center gap-3">
                                                                <div className="flex items-center gap-1 w-16">
                                                                    <span className="text-sm font-medium">{item.stars}</span>
                                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                                </div>
                                                                <Progress 
                                                                    value={item.percentage} 
                                                                    className="flex-1 h-2" 
                                                                />
                                                                <span className="text-sm text-muted-foreground w-16 text-right">
                                                                    {item.count}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Reviews List */}
                                        <div className="space-y-4">
                                            {reviews.map((review) => (
                                                <Card key={review.id}>
                                                    <CardContent className="p-6">
                                                        <div className="flex items-start gap-4">
                                                            {/* Avatar */}
                                                            <Avatar className="w-12 h-12">
                                                                <AvatarImage src={review.avatar_url} alt={review.user_name} />
                                                                <AvatarFallback className="bg-primary/10">
                                                                    <User className="w-6 h-6 text-primary" />
                                                                </AvatarFallback>
                                                            </Avatar>

                                                            <div className="flex-1 space-y-3">
                                                                {/* User Info */}
                                                                <div className="flex items-center gap-3 flex-wrap">
                                                                    <span className="font-semibold text-foreground">
                                                                        {review.user_name}
                                                                    </span>
                                                                    <div className="flex items-center gap-1">
                                                                        {renderStars(Math.round(review.rating))}
                                                                    </div>
                                                                    <span className="text-sm text-muted-foreground">
                                                                        • {review.time_ago}
                                                                    </span>
                                                                </div>

                                                                {/* Comment */}
                                                                {review.comment && (
                                                                    <p className="text-sm text-foreground leading-relaxed">
                                                                        {review.comment}
                                                                    </p>
                                                                )}

                                                                {/* Review Images */}
                                                                {review.images && review.images.length > 0 && (
                                                                    <div className="flex gap-2 flex-wrap">
                                                                        {review.images.map((image, index) => (
                                                                            <div
                                                                                key={index}
                                                                                className="relative group cursor-pointer overflow-hidden rounded-lg border-2 border-gray-200 hover:border-primary transition-colors"
                                                                                onClick={() => setSelectedReviewImage(image)}
                                                                            >
                                                                                <img
                                                                                    src={image}
                                                                                    alt={`Review ${index + 1}`}
                                                                                    className="w-24 h-24 object-cover transition-transform group-hover:scale-110"
                                                                                    onError={(e) => {
                                                                                        const target = e.target as HTMLImageElement;
                                                                                        target.src = '/placeholder-image.jpg';
                                                                                        console.error('Image load error:', image);
                                                                                    }}
                                                                                />
                                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                                                                                            <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                                                            </svg>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                {/* Actions */}
                                                                <div className="flex items-center gap-4 pt-2">
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="sm" 
                                                                        className="text-muted-foreground hover:text-primary h-8 px-3"
                                                                    >
                                                                        <ThumbsUp className="w-4 h-4 mr-1.5" />
                                                                        Hữu ích ({review.likes})
                                                                    </Button>
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="sm" 
                                                                        className="text-muted-foreground hover:text-primary h-8 px-3"
                                                                    >
                                                                        <MessageCircle className="w-4 h-4 mr-1.5" />
                                                                        Trả lời
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <Card>
                                        <CardContent className="p-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <MessageCircle className="w-16 h-16 mb-4 text-muted-foreground opacity-50" />
                                                <h3 className="text-lg font-semibold mb-2">
                                                    Chưa có đánh giá nào
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    Hãy là người đầu tiên đánh giá sản phẩm này
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="shipping" className="mt-6">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-semibold mb-3">Chính sách vận chuyển</h4>
                                            <ul className="space-y-2 text-muted-foreground">
                                                <li>• Miễn phí vận chuyển cho đơn hàng từ 200.000đ</li>
                                                <li>• Giao hàng trong 2-3 ngày làm việc</li>
                                                <li>• Hỗ trợ giao hàng toàn quốc</li>
                                                <li>• Đóng gói cẩn thận, đảm bảo sản phẩm nguyên vẹn</li>
                                            </ul>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h4 className="font-semibold mb-3">Chính sách đổi trả</h4>
                                            <ul className="space-y-2 text-muted-foreground">
                                                <li>• Đổi trả miễn phí trong 7 ngày</li>
                                                <li>• Sản phẩm chưa qua sử dụng, còn nguyên tem mác</li>
                                                <li>• Hoàn tiền 100% nếu sản phẩm lỗi từ nhà sản xuất</li>
                                                <li>• Hỗ trợ đổi size miễn phí</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Image Preview Modal */}
                {selectedReviewImage && (
                    <div 
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
                        onClick={() => setSelectedReviewImage(null)}
                    >
                        <div className="relative max-w-5xl w-full">
                            <img
                                src={selectedReviewImage}
                                alt="Review"
                                className="max-w-full max-h-[90vh] object-contain rounded-lg mx-auto shadow-2xl"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 rounded-full w-12 h-12"
                                onClick={() => setSelectedReviewImage(null)}
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Recommended Products */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Sản phẩm tương tự</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendedProducts.map((item) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ y: -5 }}
                                className="group cursor-pointer"
                                onClick={() => navigate(`/product/${item.id}`)}
                            >
                                <Card className="bg-gradient-card border-border hover-glow overflow-hidden">
                                    <div className="relative">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-primary">{item.price}đ</span>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-warning text-warning" />
                                                <span className="text-sm">{item.rating}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;