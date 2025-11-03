import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    Globe
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
    // const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [tags, setTags] = useState<string[]>(['new', 'popular']);

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

    const brands = [
        "Apple",
        "Samsung",
        "Nike",
        "Adidas",
        "Chanel",
        "Dior",
        "Uniqlo",
        "Zara"
    ];

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    // Thêm state cho form
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

    // Hàm xử lý submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ngăn double submit
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
            // Upload ảnh lên BE
            let uploadedImageUrls: string[] = [];
            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append("file", file);
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload.php`, {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();
                if (data.url) {
                    uploadedImageUrls.push(data.url);
                } else {
                    // nếu upload 1 file fail vẫn tiếp tục hoặc có thể throw tuỳ logic
                    console.warn("Upload image failed for one file", data);
                }
            }

            // Tính discount %
            const price = Number(form.price);
            const originalPrice = Number(form.originalPrice);
            let discount = 0;
            if (originalPrice > 0 && price < originalPrice) {
                discount = Math.round(((originalPrice - price) / originalPrice) * 100);
            }

            // Gửi API tạo sản phẩm
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
                toast({ title: "Thêm sản phẩm thành công!", description: "Sản phẩm mới đã được thêm vào cửa hàng.", variant: "success" });
                navigate("/vendor-management/product-management");
            } else {
                toast({ title: "Thêm sản phẩm thất bại", description: data.message, variant: "destructive" });
            }
        } catch (err) {
            console.error(err);
            toast({ title: "Có lỗi xảy ra", description: "Không thể kết nối tới máy chủ.", variant: "destructive" });
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

    return (
        <>
            <AddProductLoadingOverlay isVisible={isProcessing} />
            <form onSubmit={handleSubmit}>
                <div className="min-h-screen bg-background">
                    <div>
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="mb-8"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                {/* Left side: Icon + Title */}
                                <div className="flex items-center gap-3">
                                    {/* Icon gradient tròn */}
                                    <div className="p-3 rounded-xl bg-gradient-to-tr from-orange-500 via-rose-500 to-red-500 text-white shadow-md">
                                        <Package className="w-6 h-6 sm:w-7 sm:h-7" />
                                    </div>

                                    <div>
                                        {/* Tiêu đề gradient */}
                                        <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-orange-500 via-rose-500 to-red-500 bg-clip-text text-transparent tracking-tight flex items-center gap-2">
                                            Thêm sản phẩm mới
                                        </h1>

                                        {/* Mô tả phụ */}
                                        <p className="text-sm sm:text-base text-muted-foreground">
                                            Tạo sản phẩm mới cho cửa hàng của bạn
                                        </p>
                                    </div>
                                </div>

                                {/* Right side: Action buttons */}
                                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto border border-orange-300 text-orange-500 hover:bg-orange-500 transition-all duration-300"
                                        type="button"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Xem trước
                                    </Button>

                                    <Button
                                        type="submit"
                                        className="w-full sm:w-auto flex items-center gap-2 text-white font-medium shadow-md bg-gradient-to-r from-orange-500 via-rose-500 to-red-500 hover:from-orange-500 hover:to-red-500 transition-all duration-300 rounded-xl"
                                        disabled={isProcessing}
                                        aria-busy={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="60" strokeLinecap="round" />
                                                </svg>
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

                            {/* Divider gradient */}
                            <div className="mt-4 h-[2px] w-full bg-gradient-to-r from-orange-500 via-rose-500 to-red-500 rounded-full opacity-60"></div>
                        </motion.div>


                        {/* Main Form */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Main Form */}
                            <div className="lg:col-span-2 space-y-6">
                                <Tabs defaultValue="basic" className="space-y-6">
                                    <TabsList className="grid w-full grid-cols-4">
                                        <TabsTrigger value="basic">Cơ bản</TabsTrigger>
                                        <TabsTrigger value="pricing">Giá cả</TabsTrigger>
                                        <TabsTrigger value="images">Hình ảnh</TabsTrigger>
                                        <TabsTrigger value="seo">SEO</TabsTrigger>
                                    </TabsList>

                                    {/* Basic Information */}
                                    <TabsContent value="basic" className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Package className="w-5 h-5 text-primary" />
                                                    Thông tin cơ bản
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name">Tên sản phẩm *</Label>
                                                        <Input
                                                            id="name"
                                                            value={form.name}
                                                            onChange={handleChange}
                                                            placeholder="Ví dụ: iPhone 15 Pro Max"
                                                            className="transition-smooth focus:glow-primary"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="sku">Mã SKU</Label>
                                                        <Input
                                                            id="sku"
                                                            value={form.sku}
                                                            onChange={handleChange}
                                                            placeholder="SP001234"
                                                            className="transition-smooth"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="description">Mô tả sản phẩm *</Label>
                                                    <Textarea
                                                        id="description"
                                                        value={form.description}
                                                        onChange={handleChange}
                                                        rows={5}
                                                        placeholder="Mô tả chi tiết về sản phẩm, tính năng, lợi ích..."
                                                        className="transition-smooth"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="category">Danh mục *</Label>
                                                        <Select
                                                            value={form.category}
                                                            onValueChange={value => setForm(f => ({ ...f, category: value }))}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Chọn danh mục" />
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
                                                        <Label htmlFor="brand">Thương hiệu</Label>
                                                        <Input
                                                            id="brand"
                                                            value={form.brand}
                                                            onChange={handleChange}
                                                            placeholder="Nhập thương hiệu (VD: Apple, Samsung, ...)"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Tags</Label>
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {tags.map(tag => (
                                                            <Badge key={tag} variant="secondary" className="cursor-pointer">
                                                                {tag}
                                                                <X
                                                                    className="w-3 h-3 ml-1"
                                                                    onClick={() => removeTag(tag)}
                                                                />
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            placeholder="Thêm tag mới..."
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault(); // Ngăn submit form khi nhấn Enter
                                                                    addTag((e.target as HTMLInputElement).value);
                                                                    (e.target as HTMLInputElement).value = '';
                                                                }
                                                            }}
                                                            type="text"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => {
                                                                const input = document.querySelector('input[placeholder="Thêm tag mới..."]') as HTMLInputElement;
                                                                if (input?.value) {
                                                                    addTag(input.value);
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
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Ruler className="w-5 h-5 text-accent" />
                                                    Thông số kỹ thuật
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="weight">Trọng lượng (gram)</Label>
                                                        <Input
                                                            id="weight"
                                                            value={form.weight}
                                                            onChange={handleChange}
                                                            type="number"
                                                            placeholder="200"
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
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="material">Chất liệu</Label>
                                                        <Input
                                                            id="material"
                                                            value={form.material}
                                                            onChange={handleChange}
                                                            type="text"
                                                            placeholder="Nhôm, Kính"
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Palette className="w-5 h-5 text-accent" />
                                                    Biến thể sản phẩm
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="colors">Màu sắc (phân cách bằng dấu phẩy)</Label>
                                                        <Input
                                                            id="colors"
                                                            value={form.colors || ""}
                                                            onChange={handleChange}
                                                            placeholder="Đen, Trắng, Xanh"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="sizes">Kích thước (phân cách bằng dấu phẩy)</Label>
                                                        <Input
                                                            id="sizes"
                                                            value={form.sizes || ""}
                                                            onChange={handleChange}
                                                            placeholder="S, M, L, XL"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="origin">Xuất xứ</Label>
                                                        <Input
                                                            id="origin"
                                                            value={form.origin || ""}
                                                            onChange={handleChange}
                                                            placeholder="Việt Nam, Trung Quốc..."
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Pricing */}
                                    <TabsContent value="pricing" className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <DollarSign className="w-5 h-5 text-success" />
                                                    Định giá sản phẩm
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="price">Giá bán *</Label>
                                                        <Input
                                                            id="price"
                                                            value={form.price}
                                                            onChange={handleChange}
                                                            type="number"
                                                            placeholder="299000"
                                                            className="text-lg font-semibold"
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
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="cost">Giá vốn</Label>
                                                        <Input
                                                            id="cost"
                                                            value={form.cost}
                                                            onChange={handleChange}
                                                            type="number"
                                                            placeholder="150000" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Lợi nhuận ước tính</Label>
                                                        <div className="p-3 bg-success/10 border border-success/20 rounded-md">
                                                            <p className="text-success font-semibold">149,000đ (99.3%)</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium">Áp dụng thuế VAT</p>
                                                            <p className="text-sm text-muted-foreground">Tính 10% VAT vào giá sản phẩm</p>
                                                        </div>
                                                        <Switch />
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium">Cho phép khuyến mãi</p>
                                                            <p className="text-sm text-muted-foreground">Sản phẩm có thể áp dụng mã giảm giá</p>
                                                        </div>
                                                        <Switch defaultChecked />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Promotion Settings */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Tag className="w-5 h-5 text-warning" />
                                                    Khuyến mãi & Flash Sale
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium">Sản phẩm nổi bật</p>
                                                        <p className="text-sm text-muted-foreground">Hiển thị ở trang chủ</p>
                                                    </div>
                                                    <Switch />
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium">Flash Sale</p>
                                                        <p className="text-sm text-muted-foreground">Giảm giá trong thời gian giới hạn</p>
                                                    </div>
                                                    <Switch
                                                        checked={form.flash_sale}
                                                        onCheckedChange={checked => setForm(f => ({ ...f, flash_sale: checked }))}
                                                        id="flash_sale"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="sale_price">Giá Flash Sale</Label>
                                                        <Input
                                                            id="sale_price"
                                                            value={form.sale_price}
                                                            onChange={handleChange}
                                                            type="number"
                                                            placeholder="199000" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="sale_quantity">Số lượng sale</Label>
                                                        <Input
                                                            id="sale_quantity"
                                                            value={form.sale_quantity}
                                                            onChange={handleChange}
                                                            type="number"
                                                            placeholder="50" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Images */}
                                    <TabsContent value="images" className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <ImageIcon className="w-5 h-5 text-primary" />
                                                    Hình ảnh sản phẩm
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                {/* Image Upload Area */}
                                                <div
                                                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-smooth"
                                                    onClick={() => document.getElementById("product-image-upload")?.click()}
                                                >
                                                    <input
                                                        id="product-image-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        style={{ display: "none" }}
                                                        onChange={handleImagePick}
                                                    />
                                                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                                    <p className="text-lg font-medium mb-2">Tải lên hình ảnh sản phẩm</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Kéo thả hoặc click để chọn file. Hỗ trợ JPG, PNG, GIF (tối đa 5MB)
                                                    </p>
                                                </div>

                                                {/* Hiển thị preview ảnh đã chọn */}
                                                {previewImages.length > 0 && (
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                                        {previewImages.map((img, index) => (
                                                            <div key={index} className="relative group">
                                                                <img
                                                                    src={img}
                                                                    alt={`Ảnh sản phẩm ${index + 1}`}
                                                                    className="aspect-square object-cover rounded-lg w-full h-full"
                                                                />
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={e => {
                                                                        e.stopPropagation();
                                                                        setPreviewImages(previewImages.filter((_, i) => i !== index));
                                                                        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
                                                                    }}
                                                                    type="button"
                                                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </Button>
                                                                {index === 0 && (
                                                                    <Badge className="absolute top-2 left-2 bg-primary">
                                                                        Ảnh chính
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* SEO */}
                                    <TabsContent value="seo" className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Globe className="w-5 h-5 text-success" />
                                                    Tối ưu hóa SEO
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="meta_title">Tiêu đề SEO</Label>
                                                    <Input
                                                        id="meta_title"
                                                        value={form.meta_title}
                                                        onChange={handleChange}
                                                        placeholder="iPhone 15 Pro Max - Điện thoại cao cấp"
                                                        maxLength={60}
                                                    />
                                                    <p className="text-xs text-muted-foreground mt-1">0/60 ký tự</p>
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
                                                    />
                                                    <p className="text-xs text-muted-foreground mt-1">0/160 ký tự</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="slug">URL sản phẩm</Label>
                                                    <div className="flex">
                                                        <span className="bg-muted px-3 py-2 border border-r-0 rounded-l-md text-sm text-muted-foreground">
                                                            beautify.com/san-pham/
                                                        </span>
                                                        <Input
                                                            id="slug"
                                                            value={form.slug}
                                                            onChange={handleChange}
                                                            placeholder="iphone-15-pro-max"
                                                            className="rounded-l-none"
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
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </div>

                            {/* Right Column - Summary & Actions */}
                            <div className="space-y-6">
                                {/* Inventory Management */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5 text-warning" />
                                            Quản lý tồn kho
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="quantity">Số lượng tồn kho *</Label>
                                            <Input
                                                id="quantity"
                                                value={form.quantity}
                                                onChange={handleChange}
                                                type="number"
                                                placeholder="100"
                                                className="text-lg font-semibold"
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
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Theo dõi số lượng</p>
                                                <p className="text-sm text-muted-foreground">Tự động cập nhật khi bán</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Bán khi hết hàng</p>
                                                <p className="text-sm text-muted-foreground">Cho phép đặt trước</p>
                                            </div>
                                            <Switch />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Shipping Settings */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Truck className="w-5 h-5 text-accent" />
                                            Vận chuyển
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Phương thức vận chuyển</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn phương thức" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="standard">Giao hàng tiêu chuẩn</SelectItem>
                                                    <SelectItem value="express">Giao hàng nhanh</SelectItem>
                                                    <SelectItem value="cod">Thu hộ COD</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="shipping_fee">Phí vận chuyển</Label>
                                            <Input
                                                id="shipping_fee"
                                                value={form.shipping_fee}
                                                onChange={handleChange}
                                                type="number"
                                                placeholder="30000"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Miễn phí vận chuyển</p>
                                                <p className="text-sm text-muted-foreground">Áp dụng với đơn hàng này</p>
                                            </div>
                                            <Switch />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Product Status */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Settings className="w-5 h-5 text-muted-foreground" />
                                            Trạng thái sản phẩm
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
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
                </div>
            </form>
        </>
    );
};

export default AddProduct;