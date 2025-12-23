import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Phone,
  MapPin,
  Mail,
  Building,
  X,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Calendar,
  Sparkles,
  CheckCircle2,
  Package,
  Zap,
  BarChart3,
  Users,
  ChevronRight,
  Briefcase,
  Info,
  Building2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@radix-ui/react-separator";

const VendorRegistration = () => {
  const [registrationStatus, setRegistrationStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [form, setForm] = useState({
    store_name: "",
    avatar: "",
    business_type: "",
    tax_id: "",
    establish_year: "",
    description: "",
    phone: "",
    email: "",
    business_address: "",
    license_image: "",
    idcard_image: ""
  });
  const [loading, setLoading] = useState(false);
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const [pendingFiles, setPendingFiles] = useState<{ [key: string]: File | null }>({
    license_image: null,
    idcard_image: null,
  });
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string | null }>({
    license_image: null,
    idcard_image: null,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user?.id) return;
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/status.php?user_id=${user.id}`);
      const data = await res.json();
      if (data.status === "pending") {
        setRegistrationStatus("pending");
        // Lấy thông tin seller
        const infoRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/info.php?user_id=${user.id}`);
        const infoData = await infoRes.json();
        setSellerInfo(infoData);
      }
      else if (data.status === "approved") setRegistrationStatus("approved");
      else if (data.status === "rejected") setRegistrationStatus("rejected");
      else setRegistrationStatus("none");
    };
    fetchStatus();
  }, [user]);

  // Hàm upload ảnh (giống như AddProduct)
  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>, field: "license_image" | "idcard_image") => {
    const file = e.target.files?.[0] || null;
    setPendingFiles(f => ({ ...f, [field]: file }));
    setPreviewUrls(u => ({ ...u, [field]: file ? URL.createObjectURL(file) : null }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm(f => ({ ...f, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !form.store_name.trim() ||
      !form.business_type.trim() ||
      !form.description.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.business_address.trim() ||
      (!form.license_image && !pendingFiles.license_image) ||
      (!form.idcard_image && !pendingFiles.idcard_image)
    ) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ các trường bắt buộc và tải lên hình ảnh cần thiết.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Upload images if not already uploaded
    let licenseImageUrl = form.license_image;
    let idcardImageUrl = form.idcard_image;

    const uploadFile = async (file: File, type: string) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        const token = localStorage.getItem('vibeventure_token') || localStorage.getItem('token');
        const headers: Record<string,string> = {};
        if (token) headers['Authorization'] = `Bearer ${token.replace('Bearer ', '')}`;

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload.php`, {
          method: "POST",
          headers,
          body: formData,
        });

        let data: any = null;
        try {
          data = await res.json();
        } catch (err) {
          const text = await res.text();
          throw new Error(`Upload failed: ${res.status} ${text}`);
        }

        if (data && data.success && data.paths && data.paths.length > 0) {
          return data.paths[0];
        } else {
          throw new Error(data?.message || "Tải lên thất bại");
        }
    };

    try {
      if (pendingFiles.license_image) {
        licenseImageUrl = await uploadFile(pendingFiles.license_image, "license_image");
      }

      if (pendingFiles.idcard_image) {
        idcardImageUrl = await uploadFile(pendingFiles.idcard_image, "idcard_image");
      }

      // Submit vendor registration
      const token = localStorage.getItem('vibeventure_token') || localStorage.getItem('token');
      const regHeaders: Record<string,string> = { "Content-Type": "application/json" };
      if (token) regHeaders['Authorization'] = `Bearer ${token.replace('Bearer ', '')}`;

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/register.php`, {
        method: "POST",
        headers: regHeaders,
        body: JSON.stringify({
          user_id: user.id,
          ...form,
          license_image: licenseImageUrl,
          idcard_image: idcardImageUrl,
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch (err) {
        const text = await res.text();
        throw new Error(`Register failed: ${res.status} ${text}`);
      }
      setLoading(false);
      if (data.success) {
        toast({
          title: "Đăng ký thành công",
          description: "Hồ sơ của bạn đã được gửi đi và đang chờ xét duyệt.",
          variant: "success",
        });
        setRegistrationStatus("pending");
        setSellerInfo({
          store_name: form.store_name,
          business_type: form.business_type,
          tax_id: form.tax_id,
          establish_year: form.establish_year,
          description: form.description,
          phone: form.phone,
          email: form.email,
          business_address: form.business_address,
          created_at: new Date().toISOString(),
        });
      } else {
        throw new Error(data.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const RequirementItem = ({ icon: Icon, title, description }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="flex gap-4 p-4 rounded-2xl bg-background border border-foreground/5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h4 className="font-bold text-sm mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );

  if (registrationStatus === 'pending') {
    const infoItems = [
      { label: "Tên doanh nghiệp", value: sellerInfo?.store_name, icon: Store },
      { label: "Loại hình", value: sellerInfo?.business_type, icon: ShieldCheck },
      { label: "Mã số thuế", value: sellerInfo?.tax_id, icon: FileText },
      {
        label: "Ngày gửi hồ sơ",
        value: sellerInfo?.created_at ? new Date(sellerInfo.created_at).toLocaleDateString("vi-VN") : "",
        icon: Calendar
      },
      { label: "Số điện thoại", value: sellerInfo?.phone, icon: Phone },
      { label: "Email liên hệ", value: sellerInfo?.email, icon: Mail },
    ];

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-background/60 backdrop-blur-2xl overflow-hidden relative">
              {/* Hiệu ứng tia sáng trang trí */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full -mr-16 -mt-16" />

              <CardHeader className="pt-12 pb-8 text-center relative z-10">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-24 h-24 bg-gradient-to-tr from-amber-500 to-orange-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/20 rotate-3"
                >
                  <Clock className="w-12 h-12 text-white" />
                </motion.div>

                <Badge variant="secondary" className="mb-4 px-4 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-none uppercase tracking-widest text-[10px] font-bold">
                  Đang xử lý hồ sơ
                </Badge>

                <CardTitle className="text-3xl font-black tracking-tight mb-3">
                  Hệ thống đang xem xét
                </CardTitle>
                <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Chào <span className="text-foreground font-semibold">{sellerInfo?.store_name}</span>, hồ sơ của bạn đã được tiếp nhận và đang trong quá trình thẩm định.
                </p>
              </CardHeader>

              <CardContent className="px-8 pb-12 relative z-10">
                {/* Timeline đơn giản */}
                <div className="flex justify-between max-w-xs mx-auto mb-10">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase opacity-60">Gửi đơn</span>
                  </div>
                  <div className="flex-1 h-[2px] bg-gradient-to-r from-green-500 to-amber-500 mt-4 mx-2 opacity-30" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 animate-pulse">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                    <span className="text-[10px] font-bold uppercase">Đang duyệt</span>
                  </div>
                  <div className="flex-1 h-[2px] bg-muted mt-4 mx-2" />
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Store className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase opacity-40">Mở shop</span>
                  </div>
                </div>

                {/* Thông tin chi tiết */}
                <div className="bg-secondary/30 rounded-3xl p-6 border border-foreground/5 mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Chi tiết đăng ký
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-sm">
                    {infoItems.map((item, index) => (
                      <div key={index} className="group flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <item.icon className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-medium uppercase tracking-tight">{item.label}</span>
                        </div>
                        <p className="font-semibold text-foreground/90 pl-5.5">{item.value || "---"}</p>
                      </div>
                    ))}

                    <Separator className="md:col-span-2 opacity-50" />

                    <div className="md:col-span-2 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium uppercase tracking-tight">Địa chỉ kinh doanh</span>
                      </div>
                      <p className="font-semibold text-foreground/90 leading-snug">
                        {sellerInfo?.business_address || "Chưa cung cấp địa chỉ"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Thông báo footer */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Thời gian dự kiến</p>
                      <p className="text-[11px] text-amber-700/70">Từ 3 đến 5 ngày làm việc (trừ T7, CN)</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors uppercase tracking-widest">
                    Hỗ trợ trực tuyến <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (registrationStatus === 'approved') {
    const benefits = [
      { title: "Đăng bán sản phẩm", desc: "Không giới hạn số lượng", icon: Package, color: "text-blue-500" },
      { title: "Quản lý đơn hàng", desc: "Hệ thống tự động hóa", icon: Zap, color: "text-amber-500" },
      { title: "Báo cáo chi tiết", desc: "Theo dõi doanh thu 24/7", icon: BarChart3, color: "text-emerald-500" },
      { title: "Tiếp cận khách hàng", desc: "Hàng triệu người dùng", icon: Users, color: "text-rose-500" },
    ];

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <Card className="border shadow-[0_30px_60px_rgba(0,0,0,0.12)] bg-background/70 backdrop-blur-3xl overflow-hidden relative">
              {/* Hiệu ứng trang trí phía sau */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />

              <CardHeader className="pt-16 pb-8 text-center relative z-10">
                <motion.div
                  initial={{ rotate: -20, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="relative w-28 h-28 mx-auto mb-8"
                >
                  {/* Vòng tròn hào quang */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl"
                  />
                  <div className="relative bg-gradient-to-tr from-emerald-500 to-green-400 w-full h-full rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                    <CheckCircle2 className="w-14 h-14 text-white" />
                  </div>
                  {/* Icon trang trí xung quanh */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-2 -right-2 bg-background p-1.5 rounded-lg shadow-md"
                  >
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </motion.div>
                </motion.div>

                <Badge variant="outline" className="mb-4 px-4 py-1 border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] text-[10px] font-black">
                  Tài khoản đã kích hoạt
                </Badge>

                <CardTitle className="text-4xl font-black tracking-tight mb-4 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Chào mừng Vendor mới!
                </CardTitle>
                <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Chúc mừng <span className="text-emerald-600 font-bold">{sellerInfo?.store_name}</span>. Hồ sơ của bạn đã được phê duyệt xuất sắc. Cánh cửa kinh doanh đã sẵn sàng chào đón bạn!
                </p>
              </CardHeader>

              <CardContent className="px-10 pb-16 relative z-10">
                {/* Grid quyền lợi được thiết kế lại */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/40 border border-foreground/5 hover:bg-secondary/60 transition-colors group"
                    >
                      <div className={`p-3 rounded-xl bg-background shadow-sm group-hover:scale-110 transition-transform`}>
                        <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{benefit.title}</h4>
                        <p className="text-[11px] text-muted-foreground leading-tight">{benefit.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Box hành động chính */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                  <Button
                    className="relative w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center gap-3 transition-all overflow-hidden"
                    size="lg"
                    onClick={() => navigate('/vendor-management')}
                  >
                    <motion.div
                      className="flex items-center gap-2 text-lg font-bold"
                      whileHover={{ x: 5 }}
                    >
                      <Store className="w-6 h-6" />
                      Bắt đầu kinh doanh ngay
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>

                    {/* Hiệu ứng ánh sáng chạy qua nút */}
                    <motion.div
                      className="absolute top-0 -left-[100%] w-[50%] h-full bg-white/20 skew-x-[-25deg]"
                      animate={{ left: ["100%", "-100%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                  </Button>
                </motion.div>

                <p className="text-center mt-6 text-[11px] text-muted-foreground uppercase tracking-widest font-medium opacity-60">
                  Bạn cần hỗ trợ? <span className="underline cursor-pointer hover:text-emerald-600">Liên hệ đội ngũ Vendor Success</span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-background pb-20">
        <div className="container mx-auto px-4 py-12 max-w-5xl">

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/30 bg-primary/5 text-primary uppercase tracking-[0.2em] text-[10px] font-black">
              Vendor Partnership
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              Bắt đầu hành trình <span className="text-primary">Kinh doanh</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Tham gia cộng đồng VibeMarket để tiếp cận hàng triệu khách hàng và hệ thống quản lý bán hàng chuyên nghiệp.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cột trái: Yêu cầu & Hỗ trợ */}
            <div className="lg:col-span-1 space-y-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Yêu cầu cơ bản
                </h3>
                <div className="space-y-4">
                  <RequirementItem
                    icon={Building2}
                    title="Pháp lý"
                    description="Giấy phép kinh doanh hoặc hộ kinh doanh cá thể."
                  />
                  <RequirementItem
                    icon={FileText}
                    title="Định danh"
                    description="CCCD/CMND người đại diện còn hiệu lực."
                  />
                  <RequirementItem
                    icon={MapPin}
                    title="Vận hành"
                    description="Địa chỉ kho hàng hoặc cửa hàng cụ thể."
                  />
                </div>

                <Card className="mt-8 bg-primary/5 border-primary/10 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Info className="w-20 h-20" />
                  </div>
                  <CardContent className="p-6 relative z-10">
                    <h4 className="font-bold text-sm mb-2">Cần hỗ trợ đăng ký?</h4>
                    <p className="text-xs text-muted-foreground mb-4">Đội ngũ chuyên viên của chúng tôi luôn sẵn sàng hướng dẫn bạn hoàn thiện hồ sơ.</p>
                    <Button variant="link" className="p-0 h-auto text-primary font-bold text-xs uppercase tracking-wider">
                      Liên hệ ngay <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Cột phải: Form đăng ký */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-background/70 backdrop-blur-xl">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-2xl font-bold">Hồ sơ đăng ký</CardTitle>
                    <CardDescription>Vui lòng cung cấp thông tin chính xác để quá trình duyệt nhanh hơn.</CardDescription>
                  </CardHeader>

                  <CardContent className="pt-8 space-y-10">

                    {/* Section 1: Business */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-foreground/70" />
                        </div>
                        <h3 className="font-bold text-lg">Thông tin doanh nghiệp</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="store_name" className="text-xs font-bold uppercase tracking-wide">
                            Tên cửa hàng *
                          </Label>
                          <Input
                            id="store_name"
                            value={form.store_name} // Kết nối logic
                            onChange={handleChange} // Kết nối logic
                            className="h-12 bg-secondary/30 border-none focus-visible:ring-primary"
                            placeholder="VD: Vibe Art Studio"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="business_type" className="text-xs font-bold uppercase tracking-wide">
                            Loại hình *
                          </Label>
                          <Input
                            id="business_type"
                            value={form.business_type} // Kết nối logic
                            onChange={handleChange} // Kết nối logic
                            className="h-12 bg-secondary/30 border-none"
                            placeholder="VD: Thời trang & Phụ kiện"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tax_id" className="text-xs font-bold uppercase tracking-wide">
                            Mã số thuế
                          </Label>
                          <Input
                            id="tax_id"
                            value={form.tax_id} // Kết nối logic
                            onChange={handleChange} // Kết nối logic
                            className="h-12 bg-secondary/30 border-none"
                            placeholder="10 chữ số"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="establish_year" className="text-xs font-bold uppercase tracking-wide">
                            Năm hoạt động
                          </Label>
                          <Input
                            id="establish_year"
                            type="number"
                            value={form.establish_year} // Kết nối logic
                            onChange={handleChange} // Kết nối logic
                            className="h-12 bg-secondary/30 border-none"
                            placeholder="2024"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wide">
                          Giới thiệu ngắn *
                        </Label>
                        <Textarea
                          id="description"
                          value={form.description} // Kết nối logic
                          onChange={handleChange} // Kết nối logic
                          className="bg-secondary/30 border-none min-h-[100px] focus-visible:ring-primary"
                          placeholder="Chia sẻ một chút về câu chuyện thương hiệu của bạn..."
                        />
                      </div>
                    </div>

                    <Separator className="opacity-50" />

                    {/* Section 2: Contact */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                          <Phone className="w-4 h-4 text-foreground/70" />
                        </div>
                        <h3 className="font-bold text-lg">Thông tin liên hệ</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wide">
                            Số điện thoại *
                          </Label>
                          <Input
                            id="phone"
                            value={form.phone} // Kết nối logic
                            onChange={handleChange} // Kết nối logic
                            className="h-12 bg-secondary/30 border-none focus-visible:ring-primary"
                            placeholder="090 ••• ••••"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wide">
                            Email kinh doanh *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={form.email} // Kết nối logic
                            onChange={handleChange} // Kết nối logic
                            className="h-12 bg-secondary/30 border-none focus-visible:ring-primary"
                            placeholder="hello@brand.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="business_address" className="text-xs font-bold uppercase tracking-wide">
                          Địa chỉ trụ sở *
                        </Label>
                        <Input
                          id="business_address"
                          value={form.business_address} // Kết nối logic
                          onChange={handleChange} // Kết nối logic
                          className="h-12 bg-secondary/30 border-none focus-visible:ring-primary"
                          placeholder="Số nhà, tên đường, quận/huyện..."
                        />
                      </div>
                    </div>

                    <Separator className="opacity-50" />

                    {/* Section 3: Uploads */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                          <Upload className="w-4 h-4 text-foreground/70" />
                        </div>
                        <h3 className="font-bold text-lg">Tài liệu xác minh</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { id: "license_image", label: "Giấy phép kinh doanh" },
                          { id: "idcard_image", label: "Mặt trước CMND/CCCD" }
                        ].map((doc) => (
                          <div key={doc.id} className="relative group">
                            <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground mb-3 block">
                              {doc.label} *
                            </Label>

                            {/* Input gốc bị ẩn */}
                            <input
                              type="file"
                              id={doc.id}
                              className="hidden"
                              accept="image/*,application/pdf"
                              onChange={(e) => handleFilePick(e, doc.id)} // Hàm xử lý file của bạn
                            />

                            {/* Vùng hiển thị hoặc Click để chọn */}
                            <div
                              onClick={() => document.getElementById(doc.id).click()}
                              className={`
            relative border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden
            h-[200px] flex flex-col items-center justify-center gap-3
            ${previewUrls[doc.id]
                                  ? 'border-emerald-500/50 bg-emerald-500/5'
                                  : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5'}
          `}
                            >
                              {previewUrls[doc.id] ? (
                                // GIAO DIỆN KHI ĐÃ CHỌN FILE
                                <div className="w-full h-full relative group/preview">
                                  <img
                                    src={previewUrls[doc.id]}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                  {/* Lớp phủ khi hover vào ảnh để xóa */}
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      className="rounded-full"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Ngăn việc kích hoạt click vào input
                                        setPendingFiles(prev => ({ ...prev, [doc.id]: null }));
                                        setPreviewUrls(prev => ({ ...prev, [doc.id]: null }));
                                        const inputEl = document.getElementById(doc.id) as HTMLInputElement | null;
                                        if (inputEl) inputEl.value = '';
                                      }}
                                    >
                                      <X className="w-4 h-4 mr-2" /> Xóa và chọn lại
                                    </Button>
                                  </div>
                                  {/* Badge đánh dấu đã xong */}
                                  <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full">
                                    <CheckCircle2 className="w-4 h-4" />
                                  </div>
                                </div>
                              ) : (
                                // GIAO DIỆN KHI CHƯA CHỌN FILE
                                <>
                                  <div className="p-4 bg-background rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                                    <Upload className="w-6 h-6 text-primary" />
                                  </div>
                                  <div className="text-center px-4">
                                    <p className="text-sm font-bold">Nhấn để tải lên</p>
                                    <p className="text-[10px] text-muted-foreground uppercase mt-1 tracking-tight">
                                      Hỗ trợ PNG, JPG hoặc PDF (Tối đa 5MB)
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="pt-6 space-y-6">
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/40 border border-foreground/5">
                        <input type="checkbox" id="terms" className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <label htmlFor="terms" className="text-xs text-muted-foreground leading-normal">
                          Tôi cam kết các thông tin cung cấp trên là hoàn toàn chính xác và đồng ý với
                          <span className="text-primary font-bold mx-1 cursor-pointer">Điều khoản cộng tác</span>
                          của VibeMarket.
                        </label>
                      </div>

                      <Button type="submit" disabled={loading} className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                        Gửi hồ sơ đăng ký <ChevronRight className="ml-2 w-5 h-5" />
                      </Button>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default VendorRegistration;