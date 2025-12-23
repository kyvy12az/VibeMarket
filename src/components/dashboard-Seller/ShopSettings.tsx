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
    RefreshCw,
    ChevronRight,
    Plus,
    Info,
    HelpCircle,
    ArrowRight,
    ShieldCheck
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
        <div className="min-h-screen bg-background space-y-8">
            {/* Enhanced Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl -z-10" />

                <div className="relative overflow-hidden bg-background border-b border-slate-200/60 dark:border-slate-800/60 transition-all duration-300">
                    {/* Hiệu ứng tia sáng mờ trang trí phía sau (Glow Effect) */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 blur-[100px] pointer-events-none" />

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 p-8 relative z-10">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/* Icon Box Premium */}
                            <motion.div
                                className="relative group"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-[2rem] blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                                <div className="relative p-5 rounded-[1.5rem] bg-white dark:bg-slate-900 border border-white/20 shadow-2xl">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Settings className="w-8 h-8" />
                                    </motion.div>
                                    {/* Inner Icon để fix lỗi bg-clip-text trên một số trình duyệt */}
                                    <Settings className="w-8 h-8 text-blue-500 absolute top-5 left-5 opacity-0 group-hover:opacity-10 dark:text-cyan-400" />
                                </div>
                            </motion.div>

                            <div className="space-y-3">
                                {/* Breadcrumb Tinh Tế */}
                                <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                    <span className="hover:text-cyan-500 cursor-pointer transition-colors">Hệ thống</span>
                                    <ChevronRight className="w-3 h-3" />
                                    <span className="text-slate-900 dark:text-slate-100">Cấu hình cửa hàng</span>
                                </nav>

                                <div>
                                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white flex flex-wrap items-center gap-x-4">
                                        Cài đặt
                                        <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent italic font-black">
                                            Cửa hàng
                                        </span>
                                    </h1>

                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200/50 dark:border-slate-700/50 transition-all hover:bg-white dark:hover:bg-slate-900 shadow-sm">
                                            <Store className="w-3.5 h-3.5 text-cyan-500" />
                                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                                {storeInfo?.store_name || "Tên cửa hàng"}
                                            </p>
                                        </div>
                                        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
                                        <p className="text-sm text-muted-foreground font-medium italic">
                                            ID: #STORE_{storeInfo?.id || "001"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions Group */}
                        <div className="flex items-center gap-4">
                            {/* Badge Trạng Thái Premium */}
                            <div className="hidden sm:flex items-center px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl gap-2">
                                <div className="relative">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping absolute" />
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full relative" />
                                </div>
                                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                    Đã xác minh
                                </span>
                                <Shield className="w-4 h-4 text-emerald-500 ml-1" />
                            </div>

                            <div className="h-10 w-[1px] bg-slate-100 dark:bg-slate-800 mx-2 hidden lg:block" />

                            {/* Nút Refresh với Style Modern */}
                            <Button
                                variant="outline"
                                onClick={refreshData}
                                className="h-12 px-5 rounded-2xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold gap-3 transition-all active:scale-95 group shadow-sm"
                            >
                                <RefreshCw className={`w-4 h-4 text-slate-500 transition-transform duration-500 group-hover:rotate-180 ${loading ? 'animate-spin text-cyan-500' : ''}`} />
                                <span className="text-slate-600 dark:text-slate-300">Làm mới</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Cover Image Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative group"
            >
                <Card className="bg-background border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-none rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-indigo-500/30">

                    {/* Card Header tinh chỉnh */}
                    <CardHeader className="border-b border-slate-100/50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/20 p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                {/* Icon Box Premium */}
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                                    <div className="relative p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <ImageIcon className="w-6 h-6 text-indigo-500" />
                                    </div>
                                </div>

                                <div>
                                    <CardTitle className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                        Ảnh bìa <span className="italic bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent font-black">Cửa hàng</span>
                                    </CardTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Tạo ấn tượng đầu tiên đẳng cấp</p>
                                    </div>
                                </div>
                            </div>

                            {/* Input ẩn */}
                            <input
                                ref={coverInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCoverSelect}
                                disabled={uploadingCover}
                            />

                            {/* Button Action Premium */}
                            <Button
                                onClick={() => coverInputRef.current?.click()}
                                disabled={uploadingCover}
                                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-2xl px-6 h-12 gap-2 shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)] transition-all active:scale-95 group/btn"
                            >
                                {uploadingCover ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Camera className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                                )}
                                <span className="font-bold uppercase tracking-wider text-xs">
                                    {uploadingCover ? "Đang xử lý..." : "Thay đổi ảnh"}
                                </span>
                            </Button>
                        </div>
                    </CardHeader>

                    {/* Card Content: Preview Area */}
                    <CardContent className="p-4 md:p-6">
                        <div className="relative h-72 md:h-80 w-full rounded-[1.5rem] overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 transition-all duration-300 group-hover:border-indigo-500/20">

                            {coverPreview ? (
                                <div className="relative w-full h-full group/image">
                                    <img
                                        key={coverKey}
                                        src={coverPreview}
                                        alt="Store Cover"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105"
                                    />
                                    {/* Lớp phủ Gradient nhẹ để Text (nếu có) dễ đọc */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                                    {/* Tooltip gợi ý */}
                                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 opacity-0 group-hover/image:opacity-100 transition-opacity">
                                        <Info className="w-3.5 h-3.5 text-white" />
                                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Kích thước khuyên dùng: 1920x1080px</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full space-y-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-slate-400 blur-2xl opacity-10" />
                                        <div className="relative w-20 h-20 rounded-[2rem] bg-white dark:bg-slate-800 flex items-center justify-center shadow-inner">
                                            <ImageIcon className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest text-xs">Chưa có ảnh bìa</p>
                                        <p className="text-[11px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">Định dạng JPG, PNG hoặc WebP tối đa 5MB</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => coverInputRef.current?.click()}
                                        className="text-indigo-500 hover:text-indigo-600 font-bold gap-2 text-xs"
                                    >
                                        <Plus className="w-4 h-4" /> Tải ảnh đầu tiên của bạn
                                    </Button>
                                </div>
                            )}

                            {/* Loading Overlay Glassmorphism */}
                            <AnimatePresence>
                                {uploadingCover && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-background/60 dark:bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50"
                                    >
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="relative flex items-center justify-center">
                                                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                                                <ImageIcon className="w-6 h-6 text-indigo-500 absolute" />
                                            </div>
                                            <div className="space-y-1 text-center">
                                                <p className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Đang tối ưu hóa</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase italic">Vui lòng chờ trong giây lát...</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-1">
  {/* --- SECTION: AVATAR (Logo) --- */}
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 }}
    className="lg:col-span-1"
  >
    <Card className="bg-background border-slate-200/60 dark:border-slate-800/60 shadow-2xl shadow-slate-200/20 dark:shadow-none rounded-[2.5rem] overflow-hidden h-full">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20 p-8">
        <div className="flex items-center gap-4">
          <div className="relative p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 shadow-lg shadow-orange-500/20">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Logo <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Cửa hàng</span>
            </CardTitle>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Brand Identity</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center space-y-8 p-8">
        {/* Avatar Display with Glow Effect */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-pink-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            className="relative p-1.5 bg-white dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700 shadow-2xl"
          >
            <Avatar key={avatarKey} className="w-40 h-40 border-4 border-white dark:border-slate-900 shadow-inner">
              <AvatarImage
                src={avatarPreview || "/images/avatars/Store-Avatar.png"}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-600 text-white text-4xl font-black">
                {storeInfo?.store_name ? getInitials(storeInfo.store_name) : "ST"}
              </AvatarFallback>
            </Avatar>
            
            {/* Overlay Loading */}
            <AnimatePresence>
              {uploadingAvatar && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-full flex flex-col items-center justify-center z-10"
                >
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Upload Button */}
        <div className="w-full space-y-4">
          <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarSelect} disabled={uploadingAvatar} />
          <Button
            onClick={() => avatarInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="w-full h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02] transition-all font-bold gap-2 shadow-xl dark:shadow-white/5"
          >
            {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploadingAvatar ? "Đang xử lý..." : "Cập nhật Logo"}
          </Button>

          {/* Guidelines Table-like style */}
          <div className="p-4 rounded-[1.5rem] bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-bold uppercase tracking-tighter">Định dạng</span>
              <span className="text-slate-900 dark:text-slate-200 font-bold">JPG, PNG, WEBP</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-bold uppercase tracking-tighter">Dung lượng</span>
              <span className="text-slate-900 dark:text-slate-200 font-bold">Tối đa 5MB</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Tự động tối ưu hóa</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>

  {/* --- SECTION: STORE INFO (Form) --- */}
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4 }}
    className="lg:col-span-2"
  >
    <Card className="bg-background border-slate-200/60 dark:border-slate-800/60 shadow-2xl shadow-slate-200/20 dark:shadow-none rounded-[2.5rem] overflow-hidden h-full">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Hồ sơ <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent italic">Chi tiết</span>
              </CardTitle>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Store Information</p>
            </div>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.1em] flex gap-2 items-center">
            <ShieldCheck className="w-3 h-3" /> Official Store
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Reusable Input Component Style */}
          {[
            { label: "Tên cửa hàng", icon: Store, value: storeInfo?.store_name, color: "emerald", verified: true },
            { label: "Loại hình kinh doanh", icon: Building, value: storeInfo?.business_type, color: "blue" },
            { label: "Số điện thoại", icon: Phone, value: storeInfo?.phone, color: "green" },
            { label: "Email liên hệ", icon: Mail, value: storeInfo?.email, color: "red" },
            { label: "Năm thành lập", icon: Calendar, value: storeInfo?.establish_year, color: "purple" },
            { label: "Địa chỉ kinh doanh", icon: MapPin, value: storeInfo?.business_address, color: "orange" },
          ].map((field, index) => (
            <div key={index} className="space-y-2.5">
              <Label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <field.icon className={`w-3.5 h-3.5 text-${field.color}-500`} />
                {field.label}
              </Label>
              <div className="relative group/input">
                <Input
                  value={field.value || "Chưa cập nhật"}
                  disabled
                  className="h-12 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-200 rounded-2xl px-5"
                />
                {field.verified && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 shadow-sm" />}
              </div>
            </div>
          ))}
        </div>

        {/* Premium Notice Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="p-5 rounded-[2rem] bg-emerald-50/40 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
              <Sparkles className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="font-black text-emerald-900 dark:text-emerald-400 text-sm uppercase tracking-tight">Trạng thái xác thực</p>
              <p className="text-xs text-emerald-700/80 dark:text-emerald-500/60 font-medium mt-1">Cửa hàng của bạn đã đạt chuẩn VibeMarket Premium.</p>
            </div>
          </div>

          <div className="p-5 rounded-[2rem] bg-blue-50/40 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 group cursor-help transition-all hover:bg-blue-50 dark:hover:bg-blue-500/10">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm group-hover:rotate-12 transition-transform">
                <HelpCircle className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="font-black text-blue-900 dark:text-blue-400 text-sm uppercase tracking-tight italic">Hỗ trợ thay đổi?</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] font-bold text-blue-600/70 uppercase">Liên hệ Admin</span>
                  <ArrowRight className="w-3 h-3 text-blue-500 group-hover:translate-x-1 transition-transform" />
                </div>
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