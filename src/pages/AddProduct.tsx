import { useState } from "react";
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

interface ProductVariant {
    id: string;
    name: string;
    value: string;
    price?: number;
    stock?: number;
}

const AddProduct = () => {
    const navigate = useNavigate();
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [variants, setVariants] = useState<ProductVariant[]>([]);
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

    const handleImageUpload = () => {
        // Mock image upload
        const newImages = [
            "/placeholder.svg",
            "/placeholder.svg",
            "/placeholder.svg"
        ];
        setSelectedImages([...selectedImages, ...newImages]);
    };

    const addVariant = (type: string) => {
        const newVariant: ProductVariant = {
            id: Date.now().toString(),
            name: type,
            value: '',
            price: 0,
            stock: 0
        };
        setVariants([...variants, newVariant]);
    };

    const removeVariant = (id: string) => {
        setVariants(variants.filter(v => v.id !== id));
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
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Left side: Back + Title */}
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => navigate(-1)}
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                                    <Package className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                                    Thêm sản phẩm mới
                                </h1>
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    Tạo sản phẩm mới cho cửa hàng của bạn
                                </p>
                            </div>
                        </div>

                        {/* Right side: Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Button variant="outline" className="w-full sm:w-auto">
                                <Eye className="w-4 h-4 mr-2" />
                                Xem trước
                            </Button>
                            <Button className="bg-gradient-primary w-full sm:w-auto">
                                <Save className="w-4 h-4 mr-2" />
                                Lưu sản phẩm
                            </Button>
                        </div>
                    </div>
                </motion.div>


                {/* Main Form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Tabs defaultValue="basic" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="basic">Cơ bản</TabsTrigger>
                                <TabsTrigger value="pricing">Giá cả</TabsTrigger>
                                <TabsTrigger value="variants">Biến thể</TabsTrigger>
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
                                            <div>
                                                <Label htmlFor="name">Tên sản phẩm *</Label>
                                                <Input
                                                    id="name"
                                                    placeholder="Ví dụ: iPhone 15 Pro Max"
                                                    className="transition-smooth focus:glow-primary"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="sku">Mã SKU</Label>
                                                <Input
                                                    id="sku"
                                                    placeholder="SP001234"
                                                    className="transition-smooth"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="description">Mô tả sản phẩm *</Label>
                                            <Textarea
                                                id="description"
                                                rows={5}
                                                placeholder="Mô tả chi tiết về sản phẩm, tính năng, lợi ích..."
                                                className="transition-smooth"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="category">Danh mục *</Label>
                                                <Select>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn danh mục" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map(category => (
                                                            <SelectItem key={category} value={category.toLowerCase()}>
                                                                {category}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="brand">Thương hiệu</Label>
                                                <Select>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn thương hiệu" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {brands.map(brand => (
                                                            <SelectItem key={brand} value={brand.toLowerCase()}>
                                                                {brand}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div>
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
                                                            addTag((e.target as HTMLInputElement).value);
                                                            (e.target as HTMLInputElement).value = '';
                                                        }
                                                    }}
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
                                            <div>
                                                <Label htmlFor="weight">Trọng lượng (gram)</Label>
                                                <Input id="weight" type="number" placeholder="200" />
                                            </div>
                                            <div>
                                                <Label htmlFor="length">Dài (cm)</Label>
                                                <Input id="length" type="number" placeholder="15.5" />
                                            </div>
                                            <div>
                                                <Label htmlFor="width">Rộng (cm)</Label>
                                                <Input id="width" type="number" placeholder="7.5" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="height">Cao (cm)</Label>
                                                <Input id="height" type="number" placeholder="0.8" />
                                            </div>
                                            <div>
                                                <Label htmlFor="material">Chất liệu</Label>
                                                <Input id="material" placeholder="Nhôm, Kính" />
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
                                            <div>
                                                <Label htmlFor="price">Giá bán *</Label>
                                                <Input
                                                    id="price"
                                                    type="number"
                                                    placeholder="299000"
                                                    className="text-lg font-semibold"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="compare_price">Giá gốc (để so sánh)</Label>
                                                <Input id="compare_price" type="number" placeholder="399000" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="cost">Giá vốn</Label>
                                                <Input id="cost" type="number" placeholder="150000" />
                                            </div>
                                            <div>
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
                                            <Switch />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="sale_price">Giá Flash Sale</Label>
                                                <Input id="sale_price" type="number" placeholder="199000" />
                                            </div>
                                            <div>
                                                <Label htmlFor="sale_quantity">Số lượng sale</Label>
                                                <Input id="sale_quantity" type="number" placeholder="50" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Product Variants */}
                            <TabsContent value="variants" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Palette className="w-5 h-5 text-accent" />
                                            Biến thể sản phẩm
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => addVariant('Màu sắc')}
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Thêm màu sắc
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => addVariant('Kích thước')}
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Thêm kích thước
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => addVariant('Chất liệu')}
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Thêm chất liệu
                                            </Button>
                                        </div>

                                        {variants.map((variant) => (
                                            <div key={variant.id} className="border border-border rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium">{variant.name}</h4>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeVariant(variant.id)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                    <div>
                                                        <Label>Giá trị</Label>
                                                        <Input placeholder="Đỏ, XL, Cotton..." />
                                                    </div>
                                                    <div>
                                                        <Label>Giá thêm</Label>
                                                        <Input type="number" placeholder="0" />
                                                    </div>
                                                    <div>
                                                        <Label>Tồn kho</Label>
                                                        <Input type="number" placeholder="100" />
                                                    </div>
                                                    <div>
                                                        <Label>SKU</Label>
                                                        <Input placeholder="SP001-RED-XL" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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
                                            onClick={handleImageUpload}
                                        >
                                            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                            <p className="text-lg font-medium mb-2">Tải lên hình ảnh sản phẩm</p>
                                            <p className="text-sm text-muted-foreground">
                                                Kéo thả hoặc click để chọn file. Hỗ trợ JPG, PNG, GIF (tối đa 5MB)
                                            </p>
                                        </div>

                                        {/* Selected Images */}
                                        {selectedImages.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {selectedImages.map((image, index) => (
                                                    <div key={index} className="relative group">
                                                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                                        </div>
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth rounded-lg flex items-center justify-center">
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </div>
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
                                        <div>
                                            <Label htmlFor="meta_title">Tiêu đề SEO</Label>
                                            <Input
                                                id="meta_title"
                                                placeholder="iPhone 15 Pro Max - Điện thoại cao cấp"
                                                maxLength={60}
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">0/60 ký tự</p>
                                        </div>

                                        <div>
                                            <Label htmlFor="meta_description">Mô tả SEO</Label>
                                            <Textarea
                                                id="meta_description"
                                                rows={3}
                                                placeholder="Mô tả ngắn gọn về sản phẩm cho search engine..."
                                                maxLength={160}
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">0/160 ký tự</p>
                                        </div>

                                        <div>
                                            <Label htmlFor="slug">URL sản phẩm</Label>
                                            <div className="flex">
                                                <span className="bg-muted px-3 py-2 border border-r-0 rounded-l-md text-sm text-muted-foreground">
                                                    beautify.com/san-pham/
                                                </span>
                                                <Input
                                                    id="slug"
                                                    placeholder="iphone-15-pro-max"
                                                    className="rounded-l-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="keywords">Từ khóa SEO</Label>
                                            <Input
                                                id="keywords"
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
                                <div>
                                    <Label htmlFor="quantity">Số lượng tồn kho *</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        placeholder="100"
                                        className="text-lg font-semibold"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="low_stock">Cảnh báo tồn kho thấp</Label>
                                    <Input id="low_stock" type="number" placeholder="10" />
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
                                <div>
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

                                <div>
                                    <Label htmlFor="shipping_fee">Phí vận chuyển</Label>
                                    <Input id="shipping_fee" type="number" placeholder="30000" />
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
                                <div>
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

                                <div>
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
                                    <Input type="datetime-local"/>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;