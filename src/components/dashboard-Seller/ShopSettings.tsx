import { motion } from "framer-motion";
import { Settings, Upload, Camera, Store, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";

export function ShopSettings() {
    const { user } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [storeInfo, setStoreInfo] = useState<{
        seller_id: number;
        store_name: string;
        avatar: string | null;
        business_type: string | null;
        phone: string | null;
        email: string | null;
        business_address: string | null;
        establish_year: number | null;
    } | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [avatarKey, setAvatarKey] = useState(0); // Force re-render avatar

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

            // Debug: In ra console để kiểm tra
            console.log('Store Info Response:', data);
            console.log('Avatar URL:', data.avatar);

            if (data.success) {
                setStoreInfo({
                    seller_id: data.seller_id,
                    store_name: data.store_name,
                    avatar: data.avatar,
                    business_type: data.business_type,
                    phone: data.phone,
                    email: data.email,
                    business_address: data.business_address,
                    establish_year: data.establish_year,
                });
                // Thêm timestamp để tránh cache
                const avatarWithTimestamp = data.avatar ? `${data.avatar}?t=${Date.now()}` : null;
                console.log('Avatar with timestamp:', avatarWithTimestamp);
                setPreviewUrl(avatarWithTimestamp);
                setAvatarKey(prev => prev + 1);
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

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast({
                title: "Lỗi",
                description: "Vui lòng chọn file ảnh",
                variant: "destructive",
            });
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "Lỗi",
                description: "Kích thước file không được vượt quá 5MB",
                variant: "destructive",
            });
            return;
        }

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
            setAvatarKey(prev => prev + 1);
        };
        reader.readAsDataURL(file);

        // Upload immediately
        handleUploadAvatar(file);
    };

    const handleUploadAvatar = async (file: File) => {
        if (!user?.id) return;

        setUploading(true);

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

                // Set new avatar URL with timestamp
                setPreviewUrl(data.avatar_url);
                setAvatarKey(prev => prev + 1);

                // Refresh store info sau 500ms để đảm bảo file đã được lưu
                setTimeout(() => {
                    fetchStoreInfo();
                }, 500);
            } else {
                toast({
                    title: "Lỗi",
                    description: data.error || "Không thể cập nhật avatar",
                    variant: "destructive",
                });
                // Revert preview
                setPreviewUrl(storeInfo?.avatar || null);
            }
        } catch (error) {
            console.error("Error uploading avatar:", error);
            toast({
                title: "Lỗi",
                description: "Đã xảy ra lỗi khi upload avatar",
                variant: "destructive",
            });
            setPreviewUrl(storeInfo?.avatar || null);
        } finally {
            setUploading(false);
            // Reset input để có thể upload lại cùng file
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-6"
            >
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-tr from-sky-500 via-cyan-500 to-teal-400 text-white shadow-md">
                        <Settings className="w-6 h-6" />
                    </div>

                    <div>
                        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 bg-clip-text text-transparent tracking-tight">
                            Cài đặt cửa hàng
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Quản lý thông tin và hình ảnh cửa hàng của bạn
                        </p>
                    </div>
                </div>

                <div className="mt-4 h-[2px] w-full bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 rounded-full opacity-60"></div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Avatar Section */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Camera className="w-5 h-5" />
                            Avatar cửa hàng
                        </CardTitle>
                        <CardDescription>
                            Cập nhật hình ảnh đại diện cho cửa hàng
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <Avatar key={avatarKey} className="w-32 h-32 border-4 border-muted">
                                <AvatarImage 
                                    src={previewUrl || undefined} 
                                    alt={storeInfo?.store_name}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-400 text-white text-3xl">
                                    {storeInfo?.store_name ? getInitials(storeInfo.store_name) : "ST"}
                                </AvatarFallback>
                            </Avatar>

                            {uploading && (
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                </div>
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelect}
                            disabled={uploading}
                        />

                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="w-full"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? "Đang tải lên..." : "Thay đổi avatar"}
                        </Button>

                        <p className="text-xs text-muted-foreground text-center">
                            Chấp nhận JPG, PNG, GIF, WEBP. Tối đa 5MB
                        </p>
                    </CardContent>
                </Card>

                {/* Store Info Section */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Store className="w-5 h-5" />
                            Thông tin cửa hàng
                        </CardTitle>
                        <CardDescription>
                            Thông tin chi tiết về cửa hàng của bạn
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="store_name">Tên cửa hàng</Label>
                                <Input
                                    id="store_name"
                                    value={storeInfo?.store_name || ""}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="business_type">Loại hình kinh doanh</Label>
                                <Input
                                    id="business_type"
                                    value={storeInfo?.business_type || "Chưa cập nhật"}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center gap-1">
                                    <Phone className="w-4 h-4" />
                                    Số điện thoại
                                </Label>
                                <Input
                                    id="phone"
                                    value={storeInfo?.phone || "Chưa cập nhật"}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-1">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    value={storeInfo?.email || "Chưa cập nhật"}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="establish_year" className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Năm thành lập
                                </Label>
                                <Input
                                    id="establish_year"
                                    value={storeInfo?.establish_year || "Chưa cập nhật"}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address" className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    Địa chỉ
                                </Label>
                                <Input
                                    id="address"
                                    value={storeInfo?.business_address || "Chưa cập nhật"}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                <strong>Lưu ý:</strong> Để thay đổi thông tin cửa hàng, vui lòng liên hệ với quản trị viên.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}