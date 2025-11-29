import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
    Settings,
    Upload,
    Camera,
    Store,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit3,
    Image as ImageIcon,
    Loader2,
    Star,
    Building,
    Shield,
    CheckCircle,
    AlertCircle,
    Sparkles,
    Eye,
    Palette,
    RefreshCw
} from "lucide-react";

interface StoreInfo {
    seller_id: number;
    store_name: string;
    avatar: string | null;
    cover_image: string | null;
    business_type: string | null;
    phone: string | null;
    email: string | null;
    business_address: string | null;
    establish_year: number | null;
}

export function ShopSettings() {
    const { user } = useAuth();
    const { toast } = useToast();
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(true);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [avatarKey, setAvatarKey] = useState(0);
    const [coverKey, setCoverKey] = useState(0);

    useEffect(() => {
        fetchStoreInfo();
    }, [user]);

    const fetchStoreInfo = async () => {
        if (!user?.id) return;
        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/vendor/get_store_info.php?user_id=${user.id}&t=${Date.now()}`
            );
            const data = await response.json();

            if (data.success) {
                setStoreInfo({
                    seller_id: data.seller_id,
                    store_name: data.store_name,
                    avatar: data.avatar,
                    cover_image: data.cover_image,
                    business_type: data.business_type,
                    phone: data.phone,
                    email: data.email,
                    business_address: data.business_address,
                    establish_year: data.establish_year,
                });

                const avatarWithTimestamp = data.avatar ? `${data.avatar}?t=${Date.now()}` : null;
                const coverWithTimestamp = data.cover_image ? `${data.cover_image}?t=${Date.now()}` : null;

                setAvatarPreview(avatarWithTimestamp);
                setCoverPreview(coverWithTimestamp);
                setAvatarKey(prev => prev + 1);
                setCoverKey(prev => prev + 1);
            }
        } catch (error) {
            console.error("Error fetching store info:", error);
            toast({
                title: "Lỗi",
                description: "Không thể tải thông tin cửa hàng",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!validateImageFile(file)) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result as string);
            setAvatarKey(prev => prev + 1);
        };
        reader.readAsDataURL(file);

        handleUploadAvatar(file);
    };

    const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!validateImageFile(file)) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setCoverPreview(reader.result as string);
            setCoverKey(prev => prev + 1);
        };
        reader.readAsDataURL(file);

        handleUploadCover(file);
    };

    const validateImageFile = (file: File): boolean => {
        if (!file.type.startsWith("image/")) {
            toast({
                title: "Lỗi",
                description: "Vui lòng chọn file ảnh",
                variant: "destructive",
            });
            return false;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "Lỗi",
                description: "Kích thước file không được vượt quá 5MB",
                variant: "destructive",
            });
            return false;
        }

        return true;
    };

    const handleUploadAvatar = async (file: File) => {
        if (!user?.id) return;

        setUploadingAvatar(true);
        try {
            const formData = new FormData();
            formData.append("avatar", file);
            formData.append("user_id", user.id.toString());

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/vendor/update_avatar.php`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Thành công",
                    description: "Đã cập nhật avatar cửa hàng",
                });

                setAvatarPreview(data.avatar_url);
                setAvatarKey(prev => prev + 1);

                setTimeout(() => {
                    fetchStoreInfo();
                }, 500);
            } else {
                throw new Error(data.error || "Không thể cập nhật avatar");
            }
        } catch (error: any) {
            console.error("Error uploading avatar:", error);
            toast({
                title: "Lỗi",
                description: error.message || "Đã xảy ra lỗi khi upload avatar",
                variant: "destructive",
            });
            setAvatarPreview(storeInfo?.avatar || null);
        } finally {
            setUploadingAvatar(false);
            if (avatarInputRef.current) {
                avatarInputRef.current.value = '';
            }
        }
    };

    const handleUploadCover = async (file: File) => {
        if (!user?.id) return;

        setUploadingCover(true);
        try {
            const formData = new FormData();
            formData.append("cover_image", file);
            formData.append("user_id", user.id.toString());

            // Debug: Log what we're sending
            console.log("Uploading cover image:", {
                userId: user.id,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                backendUrl: import.meta.env.VITE_BACKEND_URL
            });

            // Debug FormData contents
            for (let [key, value] of formData.entries()) {
                console.log(`FormData ${key}:`, value);
            }

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/vendor/update_cover_image.php`,
                {
                    method: "POST",
                    body: formData,
                    // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
                }
            );

            // Debug: Log response details
            console.log("Response status:", response.status);
            console.log("Response ok:", response.ok);

            // Get response text first to see what we actually received
            const responseText = await response.text();
            console.log("Raw response:", responseText);

            // Try to parse as JSON
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error("JSON parse error:", parseError);
                throw new Error(`Server returned invalid JSON. Status: ${response.status}. Response: ${responseText.substring(0, 300)}...`);
            }

            if (data.success) {
                toast({
                    title: "Thành công",
                    description: "Đã cập nhật ảnh bìa cửa hàng",
                });

                // Use the full URL from response
                setCoverPreview(data.cover_url);
                setCoverKey(prev => prev + 1);

                setTimeout(() => {
                    fetchStoreInfo();
                }, 500);
            } else {
                console.error("API Error:", data);
                throw new Error(data.error || "Không thể cập nhật ảnh bìa");
            }
        } catch (error: any) {
            console.error("Error uploading cover:", error);
            toast({
                title: "Lỗi",
                description: error.message || "Đã xảy ra lỗi khi upload ảnh bìa",
                variant: "destructive",
            });
            setCoverPreview(storeInfo?.cover_image || null);
        } finally {
            setUploadingCover(false);
            if (coverInputRef.current) {
                coverInputRef.current.value = '';
            }
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const refreshData = async () => {
        await fetchStoreInfo();
        // toast({
        //   title: "Đã làm mới",
        //   description: "Thông tin cửa hàng đã được cập nhật",
        // });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4"
                >
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 mx-auto w-20 h-20 flex items-center justify-center shadow-xl">
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Đang tải thông tin cửa hàng</h3>
                        <p className="text-muted-foreground">Vui lòng đợi trong giây lát...</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6 space-y-8">
            {/* Enhanced Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl -z-10" />

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-8">
                    <div className="flex items-start gap-6">
                        <motion.div
                            className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 shadow-xl"
                            animate={{
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Settings className="w-8 h-8 text-white" />
                        </motion.div>

                        <div className="space-y-2">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                                    Cài đặt cửa hàng
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                                    <p className="text-muted-foreground">
                                        Quản lý thông tin: <span className="font-medium text-foreground">{storeInfo?.store_name}</span>
                                    </p>
                                </div>
                            </div>
                            <p className="text-lg text-muted-foreground max-w-2xl">
                                🎨 Tùy chỉnh và cập nhật thông tin cửa hàng một cách chuyên nghiệp
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={refreshData}
                        >
                            <RefreshCw className="w-4 h-4" />
                            Làm mới
                        </Button>
                        <Badge variant="secondary" className="px-3 py-1.5 gap-1.5">
                            <Shield className="w-3.5 h-3.5" />
                            Đã xác minh
                        </Badge>
                    </div>
                </div>
            </motion.div>

            {/* Cover Image Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="border shadow-sm overflow-hidden">
                    <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                                    <ImageIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                                        Ảnh bìa cửa hàng
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">Tạo ấn tượng đầu tiên với khách hàng</p>
                                </div>
                            </div>

                            <input
                                ref={coverInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCoverSelect}
                                disabled={uploadingCover}
                            />

                            <Button
                                onClick={() => coverInputRef.current?.click()}
                                disabled={uploadingCover}
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                {uploadingCover ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Camera className="w-4 h-4" />
                                )}
                                {uploadingCover ? "Đang tải..." : "Thay đổi"}
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="relative h-64 bg-gradient-to-r from-gray-100 to-gray-200">
                            {coverPreview ? (
                                <img
                                    key={coverKey}
                                    src={coverPreview}
                                    alt="Store Cover"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center space-y-3">
                                        <div className="w-16 h-16 mx-auto rounded-full bg-background flex items-center justify-center">
                                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-black">Chưa có ảnh bìa</p>
                                            <p className="text-sm text-black">Nhấn nút "Thay đổi" để tải lên ảnh bìa</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {uploadingCover && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                        <p className="text-sm font-medium">Đang tải ảnh bìa...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Avatar Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-1"
                >
                    <Card className="border shadow-sm">
                        <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-pink-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500">
                                    <Camera className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                                        Avatar cửa hàng
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">Logo đại diện thương hiệu</p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="flex flex-col items-center space-y-6 p-6">
                            <div className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Avatar key={avatarKey} className="w-32 h-32 border-4 border-muted shadow-lg">
                                        <AvatarImage
                                            src={avatarPreview || undefined}
                                            alt={storeInfo?.store_name}
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-pink-500 text-white text-3xl">
                                            {storeInfo?.store_name ? getInitials(storeInfo.store_name) : "ST"}
                                        </AvatarFallback>
                                    </Avatar>
                                </motion.div>

                                {uploadingAvatar && (
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                                    </div>
                                )}
                            </div>

                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarSelect}
                                disabled={uploadingAvatar}
                            />

                            <Button
                                onClick={() => avatarInputRef.current?.click()}
                                disabled={uploadingAvatar}
                                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 gap-2"
                            >
                                {uploadingAvatar ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Upload className="w-4 h-4" />
                                )}
                                {uploadingAvatar ? "Đang tải lên..." : "Thay đổi avatar"}
                            </Button>

                            <div className="text-center space-y-2">
                                <p className="text-xs text-muted-foreground">
                                    Chấp nhận JPG, PNG, GIF, WEBP
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Kích thước tối đa: 5MB
                                </p>
                                <div className="flex items-center justify-center gap-1">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span className="text-xs text-green-600">Tự động resize</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Store Info Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2"
                >
                    <Card className="border shadow-sm">
                        <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-teal-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                                    <Store className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                                        Thông tin cửa hàng
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">Chi tiết về cửa hàng và liên hệ</p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-medium">
                                        <Store className="w-4 h-4 text-emerald-600" />
                                        Tên cửa hàng
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            value={storeInfo?.store_name || ""}
                                            disabled
                                            className="bg-muted border-border pr-10"
                                        />
                                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-medium">
                                        <Building className="w-4 h-4 text-blue-600" />
                                        Loại hình kinh doanh
                                    </Label>
                                    <Input
                                        value={storeInfo?.business_type || "Chưa cập nhật"}
                                        disabled
                                        className="bg-muted border-border"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-medium">
                                        <Phone className="w-4 h-4 text-green-600" />
                                        Số điện thoại
                                    </Label>
                                    <Input
                                        value={storeInfo?.phone || "Chưa cập nhật"}
                                        disabled
                                        className="bg-muted border-border"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-medium">
                                        <Mail className="w-4 h-4 text-red-600" />
                                        Email liên hệ
                                    </Label>
                                    <Input
                                        value={storeInfo?.email || "Chưa cập nhật"}
                                        disabled
                                        className="bg-muted border-border"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-medium">
                                        <Calendar className="w-4 h-4 text-purple-600" />
                                        Năm thành lập
                                    </Label>
                                    <Input
                                        value={storeInfo?.establish_year || "Chưa cập nhật"}
                                        disabled
                                        className="bg-muted border-border"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-1">
                                    <Label className="flex items-center gap-2 font-medium">
                                        <MapPin className="w-4 h-4 text-orange-600" />
                                        Địa chỉ kinh doanh
                                    </Label>
                                    <Input
                                        value={storeInfo?.business_address || "Chưa cập nhật"}
                                        disabled
                                        className="bg-muted border-border"
                                    />
                                </div>
                            </div>

                            {/* Store Status */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-green-100">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-green-800">Cửa hàng đã được xác minh</p>
                                        <p className="text-sm text-green-700">Tất cả thông tin đã được kiểm tra và phê duyệt</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Admin Notice */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-blue-800 mb-1">Cần thay đổi thông tin?</p>
                                        <p className="text-sm text-blue-700 mb-3">
                                            Để cập nhật thông tin cửa hàng, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi.
                                        </p>
                                        <div className="flex gap-2">
                                            <Badge variant="outline" className="text-blue-700 border-blue-300">
                                                <Mail className="w-3 h-3 mr-1" />
                                                support@vibemarket.com
                                            </Badge>
                                            <Badge variant="outline" className="text-blue-700 border-blue-300">
                                                <Phone className="w-3 h-3 mr-1" />
                                                1900-xxx-xxx
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}