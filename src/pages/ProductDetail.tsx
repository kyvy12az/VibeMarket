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
    AlertTriangle
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

    const reviews = [
        {
            id: 1,
            user: "Minh Anh",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c38b?w=40&h=40&fit=crop",
            rating: 5,
            date: "2 ngày trước",
            comment: "Chất liệu rất tốt, mặc rất thoải mái. Sẽ mua thêm màu khác!",
            likes: 12,
            images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop"]
        },
        {
            id: 2,
            user: "Đức Hoàng",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop",
            rating: 4,
            date: "1 tuần trước",
            comment: "Áo đẹp, form chuẩn. Giao hàng nhanh. Recommended!",
            likes: 8,
            images: []
        },
        {
            id: 3,
            user: "Thu Hương",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop",
            rating: 5,
            date: "2 tuần trước",
            comment: "Mình đã mua 3 áo rồi, chất lượng ổn định, giá cả hợp lý.",
            likes: 15,
            images: []
        }
    ];

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

    useEffect(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/detail.php?id=${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setProduct(data.product);
                setLoading(false);
            });
    }, [id]);

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

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? "fill-warning text-warning" : "text-muted-foreground"}`}
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
                                <span className="text-muted-foreground">({product.totalReviews} đánh giá)</span>
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
                            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
                            <TabsTrigger value="shipping">Vận chuyển</TabsTrigger>
                        </TabsList>

                        <TabsContent value="description" className="mt-6">
                            <Card>
                                <CardContent className="p-6">
                                    <p className="text-muted-foreground mb-4">{product.description}</p>
                                    <h4 className="font-semibold mb-3">Đặc điểm nổi bật:</h4>
                                    <ul className="space-y-2">
                                        {product.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                                <span className="text-muted-foreground">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="specifications" className="mt-6">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {Object.entries(product.specifications).map(([key, value]) => (
                                            <div key={key} className="flex justify-between py-2 border-b border-border last:border-0">
                                                <span className="font-medium">{key}</span>
                                                <span className="text-muted-foreground">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="reviews" className="mt-6">
                            <div className="space-y-6">
                                {/* Rating Summary */}
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="text-center">
                                                <div className="text-4xl font-bold text-primary mb-2">{product.rating}</div>
                                                <div className="flex items-center justify-center gap-1 mb-2">
                                                    {renderStars(Math.floor(product.rating))}
                                                </div>
                                                <p className="text-muted-foreground">{product.totalReviews} đánh giá</p>
                                            </div>

                                            <div className="space-y-2">
                                                {ratingDistribution.map((item) => (
                                                    <div key={item.stars} className="flex items-center gap-3">
                                                        <span className="text-sm w-8">{item.stars}★</span>
                                                        <Progress value={item.percentage} className="flex-1" />
                                                        <span className="text-sm text-muted-foreground w-12">{item.count}</span>
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
                                                    <Avatar>
                                                        <AvatarImage src={review.avatar} />
                                                        <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                                                    </Avatar>

                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="font-medium">{review.user}</span>
                                                            <div className="flex items-center gap-1">
                                                                {renderStars(review.rating)}
                                                            </div>
                                                            <span className="text-sm text-muted-foreground">{review.date}</span>
                                                        </div>

                                                        <p className="text-muted-foreground mb-3">{review.comment}</p>

                                                        {review.images.length > 0 && (
                                                            <div className="flex gap-2 mb-3">
                                                                {review.images.map((image, index) => (
                                                                    <img
                                                                        key={index}
                                                                        src={image}
                                                                        alt="Review"
                                                                        className="w-16 h-16 rounded-lg object-cover"
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="flex items-center gap-4">
                                                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                                                                <ThumbsUp className="w-4 h-4 mr-1" />
                                                                Hữu ích ({review.likes})
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                                                                <MessageCircle className="w-4 h-4 mr-1" />
                                                                Trả lời
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
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