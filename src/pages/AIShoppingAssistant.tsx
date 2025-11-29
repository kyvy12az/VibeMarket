import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    Camera,
    Sparkles,
    Search,
    Image as ImageIcon,
    MessageSquare,
    ArrowRight,
    Loader2,
    ShoppingBag,
    Star,
    TrendingUp,
    Package,
    DollarSign,
    TrendingDown,
    CheckCircle2,
    Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

type Mode = "image" | "text" | null;

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    matchScore?: number;
    reason?: string;
    category?: string;
    rating: number;
    shop?: string;
    sold?: number;
    discount?: number;
}

interface ProductDetection {
    detected_product: string;
    category: string;
    confidence: number;
    colors: string[];
    price_range: {
        min: number;
        max: number;
        average: number;
        currency: string;
    };
    characteristics: string[];
    similar_products: Product[];
    market_analysis: {
        total_products: number;
        average_price: number;
        min_price: number;
        max_price: number;
        price_trend: string;
        popularity: string;
        total_sold: number;
    };
}

const AIShoppingAssistant = () => {
    const { toast } = useToast();
    const [mode, setMode] = useState<Mode>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [textQuery, setTextQuery] = useState("");
    const [analyzing, setAnalyzing] = useState(false);
    const [detection, setDetection] = useState<ProductDetection | null>(null);
    const [textResults, setTextResults] = useState<any>(null);

    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost/VIBE_MARKET_BACKEND/VibeMarket-BE";

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File quá lớn",
                description: "Vui lòng chọn ảnh nhỏ hơn 5MB",
                variant: "destructive",
            });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Detect product from image
    const handleImageAnalyze = async () => {
        if (!uploadedImage) return;

        try {
            setAnalyzing(true);

            console.log("📤 Sending to:", `${API_BASE_URL}/api/ai/detect-product.php`);

            const response = await fetch(`${API_BASE_URL}/api/ai/detect-product.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image_base64: uploadedImage,
                }),
            });

            console.log("📥 Response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Error response:", errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log("📊 Data:", data);

            if (!data?.success) {
                throw new Error(data?.error || "Nhận diện thất bại");
            }

            setDetection(data.detection);

            toast({
                title: "✨ Nhận diện thành công!",
                description: `Phát hiện: ${data.detection.detected_product}`,
            });
        } catch (error: any) {
            console.error("❌ Error:", error);
            toast({
                title: "Lỗi nhận diện",
                description: error?.message || "Vui lòng thử lại",
                variant: "destructive",
            });
        } finally {
            setAnalyzing(false);
        }
    };

    // Analyze text query
    const handleTextAnalyze = async () => {
        if (!textQuery.trim()) {
            toast({
                title: "Thiếu mô tả",
                description: "Vui lòng nhập mô tả sản phẩm",
                variant: "destructive",
            });
            return;
        }

        try {
            setAnalyzing(true);

            console.log("📤 Sending to:", `${API_BASE_URL}/api/ai/search-by-description.php`);

            const response = await fetch(`${API_BASE_URL}/api/ai/search-by-description.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    description: textQuery,
                    limit: 8,
                }),
            });

            console.log("📥 Response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Error response:", errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log("📊 Data:", data);

            if (!data?.success) {
                throw new Error(data?.error || "Tìm kiếm thất bại");
            }

            setTextResults(data);

            toast({
                title: "✨ Tìm thấy sản phẩm!",
                description: `${data.products.length} sản phẩm phù hợp`,
            });
        } catch (error: any) {
            console.error("❌ Error:", error);
            toast({
                title: "Lỗi tìm kiếm",
                description: error?.message || "Vui lòng thử lại",
                variant: "destructive",
            });
        } finally {
            setAnalyzing(false);
        }
    };

    // Reset
    const handleReset = () => {
        setMode(null);
        setUploadedImage(null);
        setTextQuery("");
        setDetection(null);
    };

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-10 h-10 text-purple-600" />
                        </motion.div>
                        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            AI Shopping Assistant
                        </h1>
                    </div>
                    <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
                        🎯 Nhận diện sản phẩm thông minh · 💰 Phân tích giá thị trường · ✨ Gợi ý mua sắm cá nhân hóa
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <Badge variant="secondary" className="text-sm py-1.5 px-4">
                            <Info className="w-3 h-3 mr-2" />
                            Powered by AI
                        </Badge>
                        <Badge variant="secondary" className="text-sm py-1.5 px-4">
                            <CheckCircle2 className="w-3 h-3 mr-2" />
                            Độ chính xác cao
                        </Badge>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!mode ? (
                        // Mode Selection
                        <motion.div
                            key="mode-selection"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-6xl mx-auto"
                        >
                            <div className="grid md:grid-cols-2 gap-8 mb-16">
                                {/* Option 1: Product Detection */}
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Card
                                        className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-500 group overflow-hidden relative h-full"
                                        onClick={() => setMode("image")}
                                    >
                                        <CardContent className="p-10 text-center relative z-10">
                                            <motion.div
                                                className="mb-8 inline-block p-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl group-hover:scale-110 transition-transform shadow-lg"
                                                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                            >
                                                <Camera className="w-16 h-16 text-purple-600" />
                                            </motion.div>
                                            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                Nhận Diện Sản Phẩm
                                            </h3>
                                            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                                                Upload ảnh sản phẩm, AI sẽ nhận diện tên, loại, phân tích giá thị trường và gợi ý sản phẩm tương tự
                                            </p>
                                            <div className="space-y-3 mb-8">
                                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                    <span>Nhận diện chính xác cao</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                    <span>Phân tích màu sắc & đặc điểm</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                    <span>Ước tính giá thị trường</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center gap-2 text-purple-600 font-bold text-lg">
                                                <span>Bắt đầu ngay</span>
                                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Option 2: Text Search */}
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Card
                                        className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-pink-500 group overflow-hidden relative h-full"
                                        onClick={() => setMode("text")}
                                    >
                                        <CardContent className="p-10 text-center relative z-10">
                                            <motion.div
                                                className="mb-8 inline-block p-8 bg-gradient-to-br from-pink-100 to-pink-200 rounded-3xl group-hover:scale-110 transition-transform shadow-lg"
                                                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                            >
                                                <MessageSquare className="w-16 h-16 text-pink-600" />
                                            </motion.div>
                                            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                                Tìm Theo Mô Tả
                                            </h3>
                                            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                                                Mô tả sản phẩm mong muốn bằng lời, AI sẽ tìm kiếm sản phẩm phù hợp nhất với yêu cầu của bạn
                                            </p>
                                            <div className="space-y-3 mb-8">
                                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                    <span>Tìm kiếm thông minh</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                    <span>Gợi ý cá nhân hóa</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                    <span>Độ phù hợp cao</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center gap-2 text-pink-600 font-bold text-lg">
                                                <span>Bắt đầu ngay</span>
                                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* Features */}
                            <div className="grid md:grid-cols-4 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                                        <CardContent className="p-6 text-center">
                                            <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <Package className="w-7 h-7 text-purple-600" />
                                            </div>
                                            <h4 className="font-bold mb-2 text-lg">Nhận Diện Thông Minh</h4>
                                            <p className="text-sm text-gray-600">AI phân tích sản phẩm với độ chính xác cao</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                                        <CardContent className="p-6 text-center">
                                            <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <DollarSign className="w-7 h-7 text-pink-600" />
                                            </div>
                                            <h4 className="font-bold mb-2 text-lg">Phân Tích Giá</h4>
                                            <p className="text-sm text-gray-600">Ước tính giá thị trường chính xác</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                                        <CardContent className="p-6 text-center">
                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <TrendingUp className="w-7 h-7 text-blue-600" />
                                            </div>
                                            <h4 className="font-bold mb-2 text-lg">Xu Hướng Thị Trường</h4>
                                            <p className="text-sm text-gray-600">Phân tích xu hướng giá real-time</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                                        <CardContent className="p-6 text-center">
                                            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <ShoppingBag className="w-7 h-7 text-green-600" />
                                            </div>
                                            <h4 className="font-bold mb-2 text-lg">Gợi Ý Thông Minh</h4>
                                            <p className="text-sm text-gray-600">Sản phẩm tương tự phù hợp nhất</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : mode === "image" ? (
                        // Product Detection Mode
                        <motion.div
                            key="image-mode"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-7xl mx-auto"
                        >
                            <Button variant="ghost" onClick={handleReset} className="mb-6">
                                ← Quay lại chọn chế độ
                            </Button>

                            <div className="grid lg:grid-cols-5 gap-8">
                                {/* Upload Section */}
                                <Card className="lg:col-span-2 shadow-xl">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                                                <ImageIcon className="w-6 h-6 text-purple-600" />
                                            </div>
                                            Upload Ảnh Sản Phẩm
                                        </h3>

                                        {!uploadedImage ? (
                                            <label className="block">
                                                <motion.div
                                                    whileHover={{ scale: 1.02 }}
                                                    className="border-2 border-dashed border-purple-300 rounded-2xl p-16 text-center cursor-pointer hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all"
                                                >
                                                    <Upload className="w-20 h-20 text-purple-400 mx-auto mb-6" />
                                                    <p className="text-gray-700 mb-3 text-lg font-semibold">Click để upload ảnh</p>
                                                    <p className="text-sm text-gray-500">PNG, JPG tối đa 5MB</p>
                                                    <Badge variant="secondary" className="mt-4">
                                                        Hỗ trợ tất cả định dạng ảnh
                                                    </Badge>
                                                </motion.div>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                                                    <img
                                                        src={uploadedImage}
                                                        alt="Uploaded"
                                                        className="w-full h-96 object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                                </div>
                                                <div className="flex gap-3">
                                                    <Button
                                                        onClick={handleImageAnalyze}
                                                        disabled={analyzing}
                                                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12 text-base font-semibold"
                                                    >
                                                        {analyzing ? (
                                                            <>
                                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                                Đang nhận diện...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Sparkles className="w-5 h-5 mr-2" />
                                                                Nhận diện ngay
                                                            </>
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setUploadedImage(null)}
                                                        className="h-12"
                                                    >
                                                        Đổi ảnh
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Detection Results */}
                                <div className="lg:col-span-3 space-y-8">
                                    {!detection ? (
                                        <Card className="shadow-xl">
                                            <CardContent className="p-20 text-center text-gray-400">
                                                <motion.div
                                                    animate={{ y: [0, -10, 0] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <Package className="w-24 h-24 mx-auto mb-6 opacity-30" />
                                                </motion.div>
                                                <p className="text-lg">Upload ảnh để xem kết quả nhận diện AI</p>
                                                <p className="text-sm mt-2">Hệ thống sẽ tự động phân tích sản phẩm</p>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <>
                                            {/* Product Info */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <Card className="shadow-xl">
                                                    <CardContent className="p-8">
                                                        <div className="flex items-start justify-between mb-6">
                                                            <div className="flex-1">
                                                                <h3 className="text-3xl font-bold text-purple-600 mb-3">
                                                                    {detection.detected_product}
                                                                </h3>
                                                                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm py-1.5 px-4">
                                                                    {detection.category}
                                                                </Badge>
                                                            </div>
                                                            <div className="text-right bg-purple-50 p-4 rounded-xl">
                                                                <div className="text-sm text-gray-600 mb-2">Độ chính xác</div>
                                                                <div className="flex items-center gap-3">
                                                                    <Progress value={detection.confidence} className="w-24 h-2" />
                                                                    <span className="font-bold text-2xl text-purple-600">
                                                                        {detection.confidence.toFixed(0)}%
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Color Palette */}
                                                        <div className="mb-6 bg-gray-50 p-6 rounded-xl">
                                                            <h4 className="font-bold mb-4 flex items-center gap-2 text-lg">
                                                                <Sparkles className="w-5 h-5 text-purple-600" />
                                                                Bảng Màu Sản Phẩm
                                                            </h4>
                                                            <div className="flex gap-3">
                                                                {detection.colors.map((color, idx) => (
                                                                    <motion.div
                                                                        key={idx}
                                                                        whileHover={{ scale: 1.1 }}
                                                                        className="w-16 h-16 rounded-xl border-4 border-white shadow-lg cursor-pointer"
                                                                        style={{ backgroundColor: color }}
                                                                        title={color}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Characteristics */}
                                                        <div className="bg-gray-50 p-6 rounded-xl">
                                                            <h4 className="font-bold mb-4 flex items-center gap-2 text-lg">
                                                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                                Đặc Điểm Sản Phẩm
                                                            </h4>
                                                            <div className="grid md:grid-cols-2 gap-3">
                                                                {detection.characteristics.map((char, idx) => (
                                                                    <motion.div
                                                                        key={idx}
                                                                        initial={{ opacity: 0, x: -20 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ delay: idx * 0.1 }}
                                                                        className="flex items-center gap-3 bg-white p-3 rounded-lg"
                                                                    >
                                                                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                                        <span className="text-sm text-gray-700">{char}</span>
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>

                                            {/* Price Analysis */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <Card className="shadow-xl">
                                                    <CardContent className="p-8">
                                                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                                                                <DollarSign className="w-6 h-6 text-green-600" />
                                                            </div>
                                                            Phân Tích Giá Thị Trường
                                                        </h3>

                                                        <div className="grid grid-cols-3 gap-6 mb-8">
                                                            <motion.div
                                                                whileHover={{ scale: 1.05 }}
                                                                className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl"
                                                            >
                                                                <TrendingDown className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                                                                <div className="text-xs text-gray-600 mb-2 font-semibold">Giá Thấp Nhất</div>
                                                                <div className="text-2xl font-bold text-blue-600">
                                                                    {detection.price_range.min.toLocaleString()}đ
                                                                </div>
                                                            </motion.div>
                                                            <motion.div
                                                                whileHover={{ scale: 1.05 }}
                                                                className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-300"
                                                            >
                                                                <Star className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                                                                <div className="text-xs text-gray-600 mb-2 font-semibold">Giá Trung Bình</div>
                                                                <div className="text-2xl font-bold text-purple-600">
                                                                    {detection.price_range.average.toLocaleString()}đ
                                                                </div>
                                                            </motion.div>
                                                            <motion.div
                                                                whileHover={{ scale: 1.05 }}
                                                                className="text-center p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl"
                                                            >
                                                                <TrendingUp className="w-8 h-8 text-pink-600 mx-auto mb-3" />
                                                                <div className="text-xs text-gray-600 mb-2 font-semibold">Giá Cao Nhất</div>
                                                                <div className="text-2xl font-bold text-pink-600">
                                                                    {detection.price_range.max.toLocaleString()}đ
                                                                </div>
                                                            </motion.div>
                                                        </div>

                                                        {/* Market Analysis */}
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                                                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs text-gray-600 mb-1">Xu Hướng Giá</div>
                                                                    <div className="font-bold text-lg capitalize">
                                                                        {detection.market_analysis.price_trend === "increasing" ? "📈 Đang Tăng" : "📊 Ổn Định"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl">
                                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                                                                    <Star className="w-6 h-6 text-yellow-600" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs text-gray-600 mb-1">Độ Phổ Biến</div>
                                                                    <div className="font-bold text-lg capitalize">
                                                                        {detection.market_analysis.popularity === "high" ? "⭐ Rất Cao" : "👍 Trung Bình"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                                                                    <Package className="w-6 h-6 text-blue-600" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs text-gray-600 mb-1">Tổng Sản Phẩm</div>
                                                                    <div className="font-bold text-lg">
                                                                        {detection.market_analysis.total_products} SP
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                                                                    <ShoppingBag className="w-6 h-6 text-purple-600" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs text-gray-600 mb-1">Tổng Đã Bán</div>
                                                                    <div className="font-bold text-lg">
                                                                        {detection.market_analysis.total_sold.toLocaleString()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>

                                            {/* Similar Products */}
                                            {detection.similar_products.length > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.4 }}
                                                >
                                                    <Card className="shadow-xl">
                                                        <CardContent className="p-8">
                                                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center">
                                                                    <ShoppingBag className="w-6 h-6 text-pink-600" />
                                                                </div>
                                                                Sản Phẩm Tương Tự
                                                                <Badge className="ml-auto bg-pink-100 text-pink-700">
                                                                    {detection.similar_products.length} sản phẩm
                                                                </Badge>
                                                            </h3>
                                                            <div className="grid md:grid-cols-3 gap-6">
                                                                {detection.similar_products.map((product, idx) => (
                                                                    <motion.div
                                                                        key={product.id}
                                                                        initial={{ opacity: 0, y: 20 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: idx * 0.1 }}
                                                                        whileHover={{ y: -8 }}
                                                                    >
                                                                        <Card className="hover:shadow-2xl transition-all cursor-pointer">
                                                                            <CardContent className="p-4">
                                                                                <div className="relative mb-3">
                                                                                    <img
                                                                                        src={product.image}
                                                                                        alt={product.name}
                                                                                        className="w-full h-40 object-cover rounded-xl"
                                                                                    />
                                                                                    {product.discount && (
                                                                                        <Badge className="absolute top-2 left-2 bg-red-600">
                                                                                            -{product.discount}%
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                                <h4 className="font-semibold text-sm mb-3 line-clamp-2 h-10">
                                                                                    {product.name}
                                                                                </h4>
                                                                                <div className="flex items-center gap-2 mb-3">
                                                                                    <div className="flex">
                                                                                        {[...Array(5)].map((_, i) => (
                                                                                            <Star
                                                                                                key={i}
                                                                                                className={`w-3 h-3 ${i < Math.floor(product.rating)
                                                                                                        ? "fill-yellow-400 text-yellow-400"
                                                                                                        : "text-gray-300"
                                                                                                    }`}
                                                                                            />
                                                                                        ))}
                                                                                    </div>
                                                                                    <span className="text-xs font-semibold">{product.rating}</span>
                                                                                    <span className="text-xs text-gray-500 ml-auto">
                                                                                        Đã bán {product.sold}
                                                                                    </span>
                                                                                </div>
                                                                                <p className="text-lg font-bold text-pink-600 mb-2">
                                                                                    {product.price.toLocaleString()}đ
                                                                                </p>
                                                                                {product.shop && (
                                                                                    <p className="text-xs text-gray-500 truncate">
                                                                                        🏪 {product.shop}
                                                                                    </p>
                                                                                )}
                                                                            </CardContent>
                                                                        </Card>
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        // Text Search Mode
                        <motion.div
                            key="text-mode"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-5xl mx-auto"
                        >
                            <Button
                                variant="ghost"
                                onClick={handleReset}
                                className="mb-6"
                            >
                                ← Quay lại chọn chế độ
                            </Button>

                            <Card className="shadow-xl">
                                <CardContent className="p-10">
                                    <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center">
                                            <MessageSquare className="w-7 h-7 text-pink-600" />
                                        </div>
                                        Mô Tả Sản Phẩm Mong Muốn
                                    </h3>

                                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl mb-6">
                                        <p className="text-sm text-gray-700 mb-3 font-semibold flex items-center gap-2">
                                            <Info className="w-4 h-4" />
                                            Gợi ý mô tả hiệu quả:
                                        </p>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                                                <span>Mô tả chi tiết màu sắc, chất liệu, kiểu dáng</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                                                <span>Nêu rõ mục đích sử dụng (đi làm, dự tiệc, thể thao...)</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                                                <span>Đề cập đến size, form dáng mong muốn</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <Textarea
                                        placeholder="Ví dụ: Tôi muốn tìm áo sơ mi trắng form rộng, chất liệu cotton thoáng mát, phù hợp đi làm văn phòng, có cổ bẻ và tay dài..."
                                        value={textQuery}
                                        onChange={(e) => setTextQuery(e.target.value)}
                                        className="mb-6 min-h-40 text-base resize-none"
                                    />

                                    <Button
                                        onClick={handleTextAnalyze}
                                        disabled={analyzing || !textQuery.trim()}
                                        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 h-14 text-lg font-semibold"
                                    >
                                        {analyzing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                                AI đang phân tích và tìm kiếm...
                                            </>
                                        ) : (
                                            <>
                                                <Search className="w-5 h-5 mr-3" />
                                                Tìm kiếm sản phẩm phù hợp
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Products Grid */}
                            {textResults && textResults.products && textResults.products.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-10"
                                >
                                    <Card className="shadow-xl">
                                        <CardContent className="p-8">
                                            <div className="flex items-center justify-between mb-8">
                                                <h3 className="text-3xl font-bold flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                                                        <CheckCircle2 className="w-7 h-7 text-green-600" />
                                                    </div>
                                                    Kết Quả Tìm Kiếm
                                                </h3>
                                                <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-base py-2 px-5">
                                                    {textResults.products.length} sản phẩm phù hợp
                                                </Badge>
                                            </div>
                                            <div className="grid md:grid-cols-4 gap-6">
                                                {textResults.products.map((product, idx) => (
                                                    <motion.div
                                                        key={product.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        whileHover={{ y: -8 }}
                                                    >
                                                        <Card className="hover:shadow-2xl transition-all cursor-pointer h-full">
                                                            <CardContent className="p-4">
                                                                <div className="relative mb-3">
                                                                    <img
                                                                        src={product.image}
                                                                        alt={product.name}
                                                                        className="w-full h-56 object-cover rounded-xl"
                                                                    />
                                                                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm py-1.5 px-3">
                                                                        {product.matchScore}% phù hợp
                                                                    </Badge>
                                                                </div>
                                                                <h4 className="font-bold mb-3 line-clamp-2 h-12 text-base">
                                                                    {product.name}
                                                                </h4>
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <div className="flex">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <Star
                                                                                key={i}
                                                                                className={`w-4 h-4 ${i < Math.floor(product.rating)
                                                                                        ? "fill-yellow-400 text-yellow-400"
                                                                                        : "text-gray-300"
                                                                                    }`}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    <span className="text-sm font-semibold">{product.rating}</span>
                                                                    {product.sold && (
                                                                        <span className="text-xs text-gray-500 ml-auto">
                                                                            Đã bán {product.sold}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xl font-bold text-pink-600 mb-3">
                                                                    {product.price.toLocaleString()}đ
                                                                </p>
                                                                {product.reason && (
                                                                    <div className="bg-green-50 p-3 rounded-lg">
                                                                        <p className="text-xs text-gray-600 mb-1 font-semibold">Lý do phù hợp:</p>
                                                                        <p className="text-xs text-gray-700">{product.reason}</p>
                                                                    </div>
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AIShoppingAssistant;