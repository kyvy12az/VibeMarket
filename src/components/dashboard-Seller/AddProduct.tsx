import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
    ArrowLeft,
    Upload,
    Package,
    DollarSign,
    BarChart3,
    Image as ImageIcon,
    Settings,
    Plus,
    X,
    Eye,
    Save,
    Tag,
    Palette,
    Ruler,
    Truck,
    Search,
    Globe,
    Sparkles,
    CheckCircle,
    AlertCircle,
    Info,
    Zap,
    Star,
    TrendingUp,
    Shield,
    Clock,
    Camera,
    FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AddProductLoadingOverlay } from "../AddProductLoadingOverlay";

interface ProductVariant {
    id: string;
    name: string;
    value: string;
    price?: number;
    stock?: number;
}

const AddProduct = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>(['new', 'popular']);
    const [currentStep, setCurrentStep] = useState("basic");

    const categories = [
        "Làm đẹp",
        "Thời trang",
        "Điện tử",
        "Gia dụng",
        "Thể thao",
        "Sách",
        "Mẹ & Bé",
        "Du lịch"
    ];

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    // Form state
    const [form, setForm] = useState({
        name: "",
        price: "",
        originalPrice: "",
        image: "",
        rating: 0,
        sold: 0,
        discount: 0,
        isLive: false,
        seller: {
            name: "",
            avatar: ""
        },
        sku: "",
        description: "",
        category: "",
        brand: "",
        weight: "",
        length: "",
        width: "",
        height: "",
        material: "",
        cost: "",
        sale_price: "",
        sale_quantity: "",
        meta_title: "",
        meta_description: "",
        slug: "",
        keywords: "",
        quantity: "",
        low_stock: "",
        shipping_fee: "",
        status: "",
        visibility: "",
        release_date: "",
        colors: "",
        sizes: "",
        origin: "",
        flash_sale: false
    });

    const [sellerId, setSellerId] = useState<number | null>(null);

    useEffect(() => {
        const fetchSellerId = async () => {
            if (user?.id) {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/overview.php?user_id=${user.id}`);
                const data = await res.json();
                console.log("overview data", data);
                if (data.seller_id) setSellerId(data.seller_id);
            }
        };
        fetchSellerId();
    }, [user]);

    const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...files]);
            setPreviewImages(prev => [
                ...prev,
                ...files.map(file => URL.createObjectURL(file))
            ]);
        }
    };

    // Submit logic giữ nguyên
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isProcessing) return;

        if (!form.name || !form.price || selectedFiles.length === 0) {
            toast({ title: "Vui lòng nhập đủ thông tin sản phẩm", variant: "destructive" });
            return;
        }
        if (!sellerId) {
            toast({ title: "Không tìm thấy seller_id", variant: "destructive" });
            return;
        }

        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 3500));

        try {
            let uploadedImageUrls: string[] = [];

            if (selectedFiles.length > 0) {
                const formData = new FormData();
                selectedFiles.forEach((f) => formData.append("files[]", f));
                formData.append("type", "products");

                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload.php`, {
                    method: "POST",
                    body: formData,
                });

                const text = await res.text();
                let uploadResp: any = null;
                try {
                    uploadResp = text ? JSON.parse(text) : null;
                } catch (err) {
                    console.error("Upload response is not valid JSON:", text, err);
                    toast({ 
                        title: "Upload ảnh thất bại", 
                        description: "Server trả về response không hợp lệ", 
                        variant: "destructive" 
                    });
                    setIsProcessing(false);
                    return;
                }

                if (uploadResp && Array.isArray(uploadResp.urls) && uploadResp.urls.length > 0) {
                    uploadedImageUrls = uploadResp.urls;
                } else if (uploadResp && Array.isArray(uploadResp.data) && uploadResp.data.length > 0) {
                    uploadedImageUrls = uploadResp.data.map((d: any) => d.url ?? d.file_url ?? d.fileUrl).filter(Boolean);
                } else if (uploadResp && uploadResp.url) {
                    uploadedImageUrls = [uploadResp.url];
                } else {
                    console.warn("Upload image failed", uploadResp);
                    toast({ 
                        title: "Upload ảnh thất bại", 
                        description: uploadResp?.message || "Không có đường dẫn trả về", 
                        variant: "destructive" 
                    });
                    setIsProcessing(false);
                    return;
                }
            }

            console.log("Uploaded image URLs:", uploadedImageUrls);

            if (uploadedImageUrls.length > 0) {
                setForm(f => ({ ...f, image: uploadedImageUrls[0] }));
            }

            const price = Number(form.price);
            const originalPrice = Number(form.originalPrice);
            let discount = 0;
            if (originalPrice > 0 && price < originalPrice) {
                discount = Math.round(((originalPrice - price) / originalPrice) * 100);
            }

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/add.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    price: Number(form.price),
                    originalPrice: Number(form.originalPrice),
                    image: uploadedImageUrls,
                    rating: Number(form.rating),
                    sold: Number(form.sold),
                    discount,
                    isLive: form.isLive ? 1 : 0,
                    seller_id: sellerId,
                    seller_name: form.seller.name,
                    seller_avatar: form.seller.avatar,
                    tags: tags.join(","),
                    weight: Number(form.weight),
                    length: Number(form.length),
                    width: Number(form.width),
                    height: Number(form.height),
                    cost: Number(form.cost),
                    sale_price: Number(form.sale_price),
                    sale_quantity: Number(form.sale_quantity),
                    quantity: Number(form.quantity),
                    low_stock: Number(form.low_stock),
                    shipping_fee: Number(form.shipping_fee),
                    release_date: form.release_date,
                    colors: form.colors,
                    sizes: form.sizes,
                    origin: form.origin,
                    flash_sale: form.flash_sale ? 1 : 0
                })
            });

            const data = await res.json();
            if (data.success) {
                toast({ 
                    title: "Thêm sản phẩm thành công!", 
                    description: "Sản phẩm mới đã được thêm vào cửa hàng.", 
                    variant: "success" 
                });
                navigate("/vendor-management/product-management");
            } else {
                toast({ 
                    title: "Thêm sản phẩm thất bại", 
                    description: data.message, 
                    variant: "destructive" 
                });
            }
        } catch (err) {
            console.error(err);
            toast({ 
                title: "Có lỗi xảy ra", 
                description: "Không thể kết nối tới máy chủ.", 
                variant: "destructive" 
            });
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        if (selectedImages.length > 0) {
            setForm(f => ({ ...f, image: selectedImages[0] }));
        }
    }, [selectedImages]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value, type } = e.target;
        setForm(f => ({
            ...f,
            [id]: value
        }));
    };

    const addTag = (tag: string) => {
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    // Calculate form completion
    const getFormCompletion = () => {
        const requiredFields = ['name', 'price', 'description', 'category', 'quantity'];
        const completedFields = requiredFields.filter(field => form[field as keyof typeof form]).length;
        const imageComplete = previewImages.length > 0 ? 1 : 0;
        return Math.round(((completedFields + imageComplete) / (requiredFields.length + 1)) * 100);
    };

    const steps = [
        { id: 'basic', label: 'Thông tin cơ bản', icon: Package, color: 'from-blue-500 to-indigo-500' },
        { id: 'pricing', label: 'Giá cả & Khuyến mãi', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
        { id: 'images', label: 'Hình ảnh', icon: Camera, color: 'from-purple-500 to-pink-500' },
        { id: 'seo', label: 'SEO & Cài đặt', icon: Globe, color: 'from-orange-500 to-red-500' }
    ];

    return (
        <>
            <AddProductLoadingOverlay isVisible={isProcessing} />
            <form onSubmit={handleSubmit}>
                <div className="min-h-screen bg-background">
                    {/* Enhanced Header with Progress */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="mb-8"
                    >
                        {/* Main Header */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 rounded-3xl -z-10" />
                            
                            <div className="p-8">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                    <div className="flex items-start gap-6">
                                        <motion.div
                                            className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 via-rose-500 to-red-500 shadow-xl"
                                            animate={{ 
                                                rotate: [0, 5, -5, 0],
                                                scale: [1, 1.05, 1]
                                            }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <Package className="w-8 h-8 text-white" />
                                        </motion.div>

                                        <div className="space-y-2">
                                            <div>
                                                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-500 via-rose-500 to-red-500 bg-clip-text text-transparent">
                                                    Thêm sản phẩm mới
                                                </h1>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                    <p className="text-muted-foreground">Tạo sản phẩm chất lượng cao</p>
                                                </div>
                                            </div>
                                            <p className="text-lg text-muted-foreground max-w-2xl">
                                                🚀 Tạo sản phẩm mới với công cụ quản lý thông minh và trực quan
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="outline"
                                            className="gap-2"
                                            type="button"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Xem trước
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="gap-2 bg-gradient-to-r from-orange-500 via-rose-500 to-red-500 hover:opacity-90 transition-all duration-300"
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    Đang lưu...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    Lưu sản phẩm
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {/* Progress Section */}
                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-medium text-foreground">
                                                Tiến độ hoàn thành
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-primary">
                                                {getFormCompletion()}%
                                            </span>
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        </div>
                                    </div>
                                    <Progress 
                                        value={getFormCompletion()} 
                                        className="h-2 bg-muted"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step Navigation */}
                        <div className="mt-6">
                            <div className="grid grid-cols-4 gap-4">
                                {steps.map((step, index) => (
                                    <motion.div
                                        key={step.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`relative cursor-pointer group ${
                                            currentStep === step.id ? 'scale-105' : 'hover:scale-102'
                                        } transition-all duration-300`}
                                        onClick={() => setCurrentStep(step.id)}
                                    >
                                        <Card className={`border-2 ${
                                            currentStep === step.id 
                                                ? 'border-primary shadow-lg bg-primary/5' 
                                                : 'border-border hover:border-primary/50'
                                        } transition-all duration-300`}>
                                            <CardContent className="p-4 text-center">
                                                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-3 shadow-sm`}>
                                                    <step.icon className="w-6 h-6 text-white" />
                                                </div>
                                                <h3 className="font-semibold text-sm text-foreground">{step.label}</h3>
                                                {currentStep === step.id && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                                                    >
                                                        <CheckCircle className="w-4 h-4 text-primary-foreground" />
                                                    </motion.div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Left Column - Main Form */}
                        <div className="lg:col-span-3 space-y-6">
                            <Tabs value={currentStep} onValueChange={setCurrentStep} className="space-y-6">
                                <TabsList className="hidden">
                                    <TabsTrigger value="basic">Basic</TabsTrigger>
                                    <TabsTrigger value="pricing">Pricing</TabsTrigger>
                                    <TabsTrigger value="images">Images</TabsTrigger>
                                    <TabsTrigger value="seo">SEO</TabsTrigger>
                                </TabsList>

                                {/* Basic Information */}
                                <TabsContent value="basic" className="space-y-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Card className="border shadow-sm">
                                            <CardHeader className="border-b bg-muted/20">
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500">
                                                        <Package className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <span className="text-lg bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                                                            Thông tin cơ bản
                                                        </span>
                                                        <p className="text-sm text-muted-foreground font-normal mt-1">
                                                            Nhập thông tin chính của sản phẩm
                                                        </p>
                                                    </div>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6 space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name" className="flex items-center gap-2">
                                                            <FileText className="w-4 h-4" />
                                                            Tên sản phẩm *
                                                        </Label>
                                                        <Input
                                                            id="name"
                                                            value={form.name}
                                                            onChange={handleChange}
                                                            placeholder="Ví dụ: iPhone 15 Pro Max 256GB"
                                                            className="h-12 text-base"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="sku" className="flex items-center gap-2">
                                                            <Tag className="w-4 h-4" />
                                                            Mã SKU
                                                        </Label>
                                                        <Input
                                                            id="sku"
                                                            value={form.sku}
                                                            onChange={handleChange}
                                                            placeholder="SP001234"
                                                            className="h-12"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="description" className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4" />
                                                        Mô tả sản phẩm *
                                                    </Label>
                                                    <Textarea
                                                        id="description"
                                                        value={form.description}
                                                        onChange={handleChange}
                                                        rows={5}
                                                        placeholder="Mô tả chi tiết về sản phẩm, tính năng, lợi ích và thông số kỹ thuật..."
                                                        className="resize-none"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="category" className="flex items-center gap-2">
                                                            <Package className="w-4 h-4" />
                                                            Danh mục *
                                                        </Label>
                                                        <Select
                                                            value={form.category}
                                                            onValueChange={value => setForm(f => ({ ...f, category: value }))}
                                                        >
                                                            <SelectTrigger className="h-12">
                                                                <SelectValue placeholder="Chọn danh mục sản phẩm" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {categories.map(category => (
                                                                    <SelectItem key={category} value={category}>
                                                                        {category}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="brand" className="flex items-center gap-2">
                                                            <Star className="w-4 h-4" />
                                                            Thương hiệu
                                                        </Label>
                                                        <Input
                                                            id="brand"
                                                            value={form.brand}
                                                            onChange={handleChange}
                                                            placeholder="Apple, Samsung, Nike..."
                                                            className="h-12"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Tags Section */}
                                                <div className="space-y-4">
                                                    <Label className="flex items-center gap-2">
                                                        <Tag className="w-4 h-4" />
                                                        Tags sản phẩm
                                                    </Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {tags.map(tag => (
                                                            <Badge 
                                                                key={tag} 
                                                                variant="secondary" 
                                                                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors px-3 py-1"
                                                            >
                                                                {tag}
                                                                <X
                                                                    className="w-3 h-3 ml-2 hover:bg-destructive/20 rounded-full p-0.5"
                                                                    onClick={() => removeTag(tag)}
                                                                />
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            placeholder="Thêm tag mới (ví dụ: hot, sale, new...)"
                                                            className="h-10"
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    const value = (e.target as HTMLInputElement).value;
                                                                    if (value.trim()) {
                                                                        addTag(value.trim());
                                                                        (e.target as HTMLInputElement).value = '';
                                                                    }
                                                                }
                                                            }}
                                                            type="text"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-10 w-10 shrink-0"
                                                            onClick={() => {
                                                                const input = document.querySelector('input[placeholder*="Thêm tag"]') as HTMLInputElement;
                                                                if (input?.value.trim()) {
                                                                    addTag(input.value.trim());
                                                                    input.value = '';
                                                                }
                                                            }}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Product Specifications */}
                                        <Card className="border shadow-sm">
                                            <CardHeader className="border-b bg-muted/20">
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                                                        <Ruler className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <span className="text-lg">Thông số kỹ thuật</span>
                                                        <p className="text-sm text-muted-foreground font-normal mt-1">
                                                            Kích thước và thông tin vật lý
                                                        </p>
                                                    </div>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6 space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="weight">Trọng lượng (gram)</Label>
                                                        <Input
                                                            id="weight"
                                                            value={form.weight}
                                                            onChange={handleChange}
                                                            type="number"
                                                            placeholder="200"
                                                            className="h-11"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="length">Dài (cm)</Label>
                                                        <Input
                                                            id="length"
                                                            value={form.length}
                                                            onChange={handleChange}
                                                            type="number"
                                                            step="any"
                                                            placeholder="15.5"
                                                            className="h-11"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="width">Rộng (cm)</Label>
                                                        <Input
                                                            id="width"
                                                            value={form.width}
                                                            onChange={handleChange}
                                                            type="number"
                                                            step="any"
                                                            placeholder="7.5"
                                                            className="h-11"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="height">Cao (cm)</Label>
                                                        <Input
                                                            id="height"
                                                            value={form.height}
                                                            onChange={handleChange}
                                                            type="number"
                                                            step="any"
                                                            placeholder="0.8"
                                                            className="h-11"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="material">Chất liệu</Label>
                                                        <Input
                                                            id="material"
                                                            value={form.material}
                                                            onChange={handleChange}
                                                            placeholder="Nhôm, Kính, Plastic..."
                                                            className="h-11"
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Product Variants */}
                                        <Card className="border shadow-sm">
                                            <CardHeader className="border-b bg-muted/20">
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                                                        <Palette className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <span className="text-lg">Biến thể sản phẩm</span>
                                                        <p className="text-sm text-muted-foreground font-normal mt-1">
                                                            Màu sắc, kích thước và các tùy chọn khác
                                                        </p>
                                                    </div>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="colors">Màu sắc</Label>
                                                        <Input
                                                            id="colors"
                                                            value={form.colors || ""}
                                                            onChange={handleChange}
                                                            placeholder="Đen, Trắng, Xanh"
                                                            className="h-11"
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            Phân cách bằng dấu phẩy
                                                        </p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="sizes">Kích thước</Label>
                                                        <Input
                                                            id="sizes"
                                                            value={form.sizes || ""}
                                                            onChange={handleChange}
                                                            placeholder="S, M, L, XL"
                                                            className="h-11"
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            Phân cách bằng dấu phẩy
                                                        </p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="origin">Xuất xứ</Label>
                                                        <Input
                                                            id="origin"
                                                            value={form.origin || ""}
                                                            onChange={handleChange}
                                                            placeholder="Việt Nam, Trung Quốc..."
                                                            className="h-11"
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </TabsContent>

                                {/* Pricing */}
                                <TabsContent value="pricing" className="space-y-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="space-y-6"
                                    >
                                        <Card className="border shadow-sm">
                                            <CardHeader className="border-b bg-muted/20">
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                                                        <DollarSign className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <span className="text-lg bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                                                            Định giá sản phẩm
                                                        </span>
                                                        <p className="text-sm text-muted-foreground font-normal mt-1">
                                                            Thiết lập giá bán và chi phí
                                                        </p>
                                                    </div>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6 space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="price" className="flex items-center gap-2">
                                                            <DollarSign className="w-4 h-4" />
                                                            Giá bán *
                                                        </Label>
                                                        <Input
                                                            id="price"
                                                            value={form.price}
                                                            onChange={handleChange}
                                                            type="number"
                                                            placeholder="299000"
                                                            className="h-12 text-lg font-semibold"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="originalPrice">Giá gốc (để so sánh)</Label>
                                                        <Input
                                                            id="originalPrice"
                                                            value={form.originalPrice}
                                                            onChange={handleChange}
                                                            type="number"
                                                            placeholder="399000"
                                                            className="h-12"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="cost">Giá vốn</Label>
                                                        <Input
                                                            id="cost"
                                                            value={form.cost}
                                                            onChange={handleChange}
                                                            type="number"
                                                            placeholder="150000"
                                                            className="h-12"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Lợi nhuận ước tính</Label>
                                                        <div className="h-12 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                                                            <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                                                            <span className="text-green-700 font-semibold">
                                                                {form.price && form.cost ? 
                                                                    `${(Number(form.price) - Number(form.cost)).toLocaleString()}đ` : 
                                                                    '0đ'
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <Shield className="w-5 h-5 text-blue-600" />
                                                            <div>
                                                                <p className="font-medium">Áp dụng thuế VAT</p>
                                                                <p className="text-sm text-muted-foreground">Tính 10% VAT vào giá sản phẩm</p>
                                                            </div>
                                                        </div>
                                                        <Switch />
                                                    </div>

                                                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <Tag className="w-5 h-5 text-purple-600" />
                                                            <div>
                                                                <p className="font-medium">Cho phép khuyến mãi</p>
                                                                <p className="text-sm text-muted-foreground">Sản phẩm có thể áp dụng mã giảm giá</p>
                                                            </div>
                                                        </div>
                                                        <Switch defaultChecked />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Flash Sale Settings */}
                                        <Card className="border shadow-sm">
                                            <CardHeader className="border-b bg-muted/20">
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500">
                                                        <Zap className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <span className="text-lg">Flash Sale & Khuyến mãi</span>
                                                        <p className="text-sm text-muted-foreground font-normal mt-1">
                                                            Thiết lập chương trình giảm giá đặc biệt
                                                        </p>
                                                    </div>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6 space-y-6">
                                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                                                    <div className="flex items-center gap-3">
                                                        <Zap className="w-5 h-5 text-orange-600" />
                                                        <div>
                                                            <p className="font-medium text-black">Flash Sale</p>
                                                            <p className="text-sm text-muted-foreground">Giảm giá trong thời gian giới hạn</p>
                                                        </div>
                                                    </div>
                                                    <Switch
                                                        checked={form.flash_sale}
                                                        onCheckedChange={checked => setForm(f => ({ ...f, flash_sale: checked }))}
                                                    />
                                                </div>

                                                <AnimatePresence>
                                                    {form.flash_sale && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                                        >
                                                            <div className="space-y-2">
                                                                <Label htmlFor="sale_price">Giá Flash Sale *</Label>
                                                                <Input
                                                                    id="sale_price"
                                                                    value={form.sale_price}
                                                                    onChange={handleChange}
                                                                    type="number"
                                                                    placeholder="199000"
                                                                    className="h-11"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="sale_quantity">Số lượng sale</Label>
                                                                <Input
                                                                    id="sale_quantity"
                                                                    value={form.sale_quantity}
                                                                    onChange={handleChange}
                                                                    type="number"
                                                                    placeholder="50"
                                                                    className="h-11"
                                                                />
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </TabsContent>

                                {/* Images */}
                                <TabsContent value="images" className="space-y-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Card className="border shadow-sm">
                                            <CardHeader className="border-b bg-muted/20">
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                                                        <Camera className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <span className="text-lg bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                                                            Hình ảnh sản phẩm
                                                        </span>
                                                        <p className="text-sm text-muted-foreground font-normal mt-1">
                                                            Tải lên ảnh chất lượng cao để thu hút khách hàng
                                                        </p>
                                                    </div>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6 space-y-6">
                                                {/* Enhanced Upload Area */}
                                                <motion.div
                                                    className="relative border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary transition-all duration-300 bg-gradient-to-br from-muted/20 to-muted/40"
                                                    onClick={() => document.getElementById("product-image-upload")?.click()}
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                >
                                                    <input
                                                        id="product-image-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        style={{ display: "none" }}
                                                        onChange={handleImagePick}
                                                    />
                                                    <div className="space-y-4">
                                                        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                                            <Upload className="w-10 h-10 text-white" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-bold text-foreground mb-2">
                                                                Tải lên hình ảnh sản phẩm
                                                            </h3>
                                                            <p className="text-muted-foreground">
                                                                Kéo thả hoặc click để chọn file
                                                            </p>
                                                            <p className="text-sm text-muted-foreground mt-2">
                                                                Hỗ trợ JPG, PNG, GIF • Tối đa 5MB • Khuyến nghị 1:1
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                {/* Image Preview Grid */}
                                                <AnimatePresence>
                                                    {previewImages.length > 0 && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20 }}
                                                            className="space-y-4"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="text-lg font-semibold flex items-center gap-2">
                                                                    <Camera className="w-5 h-5" />
                                                                    Hình ảnh đã chọn ({previewImages.length})
                                                                </h4>
                                                                <Badge variant="outline" className="gap-1">
                                                                    <CheckCircle className="w-3 h-3" />
                                                                    Sẵn sàng
                                                                </Badge>
                                                            </div>
                                                            
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                {previewImages.map((img, index) => (
                                                                    <motion.div
                                                                        key={index}
                                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        transition={{ delay: index * 0.1 }}
                                                                        className="relative group aspect-square rounded-xl overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 shadow-sm"
                                                                    >
                                                                        <img
                                                                            src={img}
                                                                            alt={`Ảnh sản phẩm ${index + 1}`}
                                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                                        />
                                                                        
                                                                        {/* Overlay */}
                                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                                            <Button
                                                                                size="sm"
                                                                                variant="destructive"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setPreviewImages(previewImages.filter((_, i) => i !== index));
                                                                                    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
                                                                                }}
                                                                                className="opacity-90 hover:opacity-100 absolute top-1 right-1"
                                                                                type="button"
                                                                            >
                                                                                <X className="w-4 h-4" />
                                                                            </Button>
                                                                        </div>
                                                                        
                                                                        {/* Main Image Badge */}
                                                                        {index === 0 && (
                                                                            <Badge className="absolute top-2 left-2 bg-primary shadow-md">
                                                                                <Star className="w-3 h-3 mr-1" />
                                                                                Ảnh chính
                                                                            </Badge>
                                                                        )}
                                                                    </motion.div>
                                                                ))}
                                                            </div>

                                                            {/* Tips */}
                                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                                <div className="flex gap-3">
                                                                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                                                                    <div>
                                                                        <h4 className="font-medium text-blue-900 mb-1">Mẹo chụp ảnh tốt</h4>
                                                                        <ul className="text-sm text-blue-700 space-y-1">
                                                                            <li>• Sử dụng ánh sáng tự nhiên, tránh flash trực tiếp</li>
                                                                            <li>• Chụp nhiều góc độ khác nhau của sản phẩm</li>
                                                                            <li>• Làm sạch sản phẩm trước khi chụp</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </TabsContent>

                                {/* SEO */}
                                <TabsContent value="seo" className="space-y-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Card className="border shadow-sm">
                                            <CardHeader className="border-b bg-muted/20">
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                                                        <Globe className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <span className="text-lg bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                                                            Tối ưu hóa SEO
                                                        </span>
                                                        <p className="text-sm text-muted-foreground font-normal mt-1">
                                                            Cải thiện khả năng tìm kiếm trên Google
                                                        </p>
                                                    </div>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6 space-y-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="meta_title">Tiêu đề SEO</Label>
                                                    <Input
                                                        id="meta_title"
                                                        value={form.meta_title}
                                                        onChange={handleChange}
                                                        placeholder="iPhone 15 Pro Max - Điện thoại cao cấp"
                                                        maxLength={60}
                                                        className="h-11"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        {form.meta_title.length}/60 ký tự
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="meta_description">Mô tả SEO</Label>
                                                    <Textarea
                                                        id="meta_description"
                                                        value={form.meta_description}
                                                        onChange={handleChange}
                                                        rows={3}
                                                        placeholder="Mô tả ngắn gọn về sản phẩm cho search engine..."
                                                        maxLength={160}
                                                        className="resize-none"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        {form.meta_description.length}/160 ký tự
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="slug">URL sản phẩm</Label>
                                                    <div className="flex">
                                                        <span className="bg-muted px-4 py-3 border border-r-0 rounded-l-lg text-sm text-muted-foreground">
                                                            vibemarket.com/product/
                                                        </span>
                                                        <Input
                                                            id="slug"
                                                            value={form.slug}
                                                            onChange={handleChange}
                                                            placeholder="iphone-15-pro-max"
                                                            className="rounded-l-none h-11"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="keywords">Từ khóa SEO</Label>
                                                    <Input
                                                        id="keywords"
                                                        value={form.keywords}
                                                        onChange={handleChange}
                                                        placeholder="iphone, apple, điện thoại, smartphone"
                                                        className="h-11"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Phân cách bằng dấu phẩy
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Right Sidebar - Summary & Settings */}
                        <div className="space-y-6">
                            {/* Inventory Management */}
                            <Card className="border shadow-sm">
                                <CardHeader className="border-b bg-muted/20">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <BarChart3 className="w-5 h-5 text-orange-600" />
                                        Quản lý kho hàng
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity">Số lượng tồn kho *</Label>
                                        <Input
                                            id="quantity"
                                            value={form.quantity}
                                            onChange={handleChange}
                                            type="number"
                                            placeholder="100"
                                            className="h-11 text-base font-semibold"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="low_stock">Cảnh báo tồn kho thấp</Label>
                                        <Input
                                            id="low_stock"
                                            value={form.low_stock}
                                            onChange={handleChange}
                                            type="number"
                                            placeholder="10"
                                            className="h-11"
                                        />
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-sm">Theo dõi tồn kho</p>
                                                <p className="text-xs text-muted-foreground">Tự động cập nhật</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-sm">Bán khi hết hàng</p>
                                                <p className="text-xs text-muted-foreground">Cho phép đặt trước</p>
                                            </div>
                                            <Switch />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Shipping Settings */}
                            <Card className="border shadow-sm">
                                <CardHeader className="border-b bg-muted/20">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Truck className="w-5 h-5 text-blue-600" />
                                        Vận chuyển
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="shipping_fee">Phí vận chuyển (VND)</Label>
                                        <Input
                                            id="shipping_fee"
                                            value={form.shipping_fee}
                                            onChange={handleChange}
                                            type="number"
                                            placeholder="30000"
                                            className="h-11"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div>
                                            <p className="font-medium text-sm">Miễn phí vận chuyển</p>
                                            <p className="text-xs text-muted-foreground">Áp dụng cho đơn hàng này</p>
                                        </div>
                                        <Switch />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Product Status */}
                            <Card className="border shadow-sm">
                                <CardHeader className="border-b bg-muted/20">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Settings className="w-5 h-5 text-muted-foreground" />
                                        Trạng thái sản phẩm
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    <div className="space-y-2">
                                        <Label>Trạng thái</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn trạng thái" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Đang bán</SelectItem>
                                                <SelectItem value="draft">Nháp</SelectItem>
                                                <SelectItem value="archived">Lưu trữ</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Hiển thị</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn hiển thị" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="public">Công khai</SelectItem>
                                                <SelectItem value="private">Riêng tư</SelectItem>
                                                <SelectItem value="password">Yêu cầu mật khẩu</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Ngày phát hành</p>
                                        <Input
                                            type="datetime-local"
                                            id="release_date"
                                            value={form.release_date}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AddProduct;