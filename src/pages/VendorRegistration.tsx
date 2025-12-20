import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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

    // Validate các trường bắt buộc
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
        description: "Vui lòng nhập đầy đủ các trường bắt buộc và tải lên đầy đủ hình ảnh.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Upload ảnh nếu chưa upload
    let licenseImageUrl = form.license_image;
    let idcardImageUrl = form.idcard_image;

    if (pendingFiles.license_image) {
      const formData = new FormData();
      formData.append("file", pendingFiles.license_image);
      formData.append("type", "license_image");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload.php`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        licenseImageUrl = data.url;
      } else {
        toast({
          title: "Upload ảnh thất bại",
          description: "Không thể upload giấy phép kinh doanh.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }

    if (pendingFiles.idcard_image) {
      const formData = new FormData();
      formData.append("file", pendingFiles.idcard_image);
      formData.append("type", "idcard_image");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload.php`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        idcardImageUrl = data.url;
      } else {
        toast({
          title: "Upload ảnh thất bại",
          description: "Không thể upload CMND/CCCD.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }

    // Gửi đăng ký vendor
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/register.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        ...form,
        license_image: licenseImageUrl,
        idcard_image: idcardImageUrl,
      })
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      toast({
        title: "Đăng ký thành công",
        description: "Hồ sơ của bạn đã được gửi đi và đang chờ xét duyệt.",
        variant: "success",
      });
      setRegistrationStatus("pending");
    } else {
      toast({
        title: "Đăng ký thất bại",
        description: data.message || "Đã có lỗi xảy ra. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const RequirementItem = ({ icon: Icon, title, description, completed = false }: {
    icon: any;
    title: string;
    description: string;
    completed?: boolean;
  }) => (
    <div className="flex items-start gap-4 p-4 border border-border rounded-lg">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${completed ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
        }`}>
        {completed ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
      </div>
      <div>
        <h4 className="font-medium mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );

  if (registrationStatus === 'pending') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl">Đăng ký đang được xem xét</CardTitle>
                <p className="text-muted-foreground mt-2">
                  Cảm ơn bạn đã gửi đăng ký trở thành vendor. Chúng tôi đang xem xét hồ sơ của bạn.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Thông tin đã gửi:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Tên doanh nghiệp:</span>
                      <p className="font-medium">{sellerInfo?.store_name || ""}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Loại hình:</span>
                      <p className="font-medium">{sellerInfo?.business_type || ""}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mã số thuế:</span>
                      <p className="font-medium">{sellerInfo?.tax_id || ""}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ngày gửi:</span>
                      <p className="font-medium">{sellerInfo?.created_at ? new Date(sellerInfo.created_at).toLocaleDateString('vi-VN') : ""}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Số điện thoại:</span>
                      <p className="font-medium">{sellerInfo?.phone || ""}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-medium">{sellerInfo?.email || ""}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-muted-foreground">Địa chỉ:</span>
                      <p className="font-medium">{sellerInfo?.business_address || ""}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-muted-foreground">Mô tả:</span>
                      <p className="font-medium">{sellerInfo?.description || ""}</p>
                    </div>
                  </div>
                </div>
                <Badge className="w-fit mx-auto" variant="outline">
                  Thời gian xem xét: 3-5 ngày làm việc
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (registrationStatus === 'approved') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl">Chúc mừng! Đăng ký đã được duyệt</CardTitle>
                <p className="text-muted-foreground mt-2">
                  Tài khoản vendor của bạn đã được kích hoạt. Bạn có thể bắt đầu bán hàng ngay bây giờ.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">Quyền lợi vendor:</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Đăng bán sản phẩm không giới hạn</li>
                    <li>• Quản lý đơn hàng và khách hàng</li>
                    <li>• Báo cáo doanh thu chi tiết</li>
                    <li>• Hỗ trợ marketing và khuyến mãi</li>
                  </ul>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => navigate('/vendor-management')}
                >
                  <Store className="w-5 h-5 mr-2" />
                  Đi đến Dashboard Vendor
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Đăng ký trở thành Vendor</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tham gia cộng đồng bán hàng của VibeMarket và tiếp cận hàng triệu khách hàng tiềm năng
            </p>
          </motion.div>

          {/* Requirements */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Yêu cầu để trở thành Vendor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RequirementItem
                icon={Building}
                title="Giấy phép kinh doanh"
                description="Cần có giấy phép kinh doanh hợp lệ hoặc đăng ký hộ kinh doanh"
              />
              <RequirementItem
                icon={FileText}
                title="Chứng minh thư/CCCD"
                description="Bản sao chứng minh thư hoặc căn cước công dân còn hiệu lực"
              />
              <RequirementItem
                icon={MapPin}
                title="Địa chỉ kinh doanh"
                description="Có địa chỉ cửa hàng/kho hàng rõ ràng, có thể xác minh"
              />
              <RequirementItem
                icon={Phone}
                title="Thông tin liên hệ"
                description="Số điện thoại và email để khách hàng có thể liên hệ"
              />
            </CardContent>
          </Card>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đăng ký</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Business Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Thông tin doanh nghiệp</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="store_name">Tên doanh nghiệp/Cửa hàng *</Label>
                    <Input
                      id="store_name"
                      value={form.store_name}
                      onChange={handleChange}
                      placeholder="VD: Beauty World Store"
                    />
                  </div>
                  <div>
                    <Label htmlFor="business_type">Loại hình kinh doanh *</Label>
                    <Input
                      id="business_type"
                      value={form.business_type}
                      onChange={handleChange}
                      placeholder="VD: Cửa hàng mỹ phẩm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tax_id">Mã số thuế</Label>
                    <Input
                      id="tax_id"
                      value={form.tax_id}
                      onChange={handleChange}
                      placeholder="VD: 0123456789"
                    />
                  </div>
                  <div>
                    <Label htmlFor="establish_year">Năm thành lập</Label>
                    <Input
                      id="establish_year"
                      value={form.establish_year}
                      onChange={handleChange}
                      type="number"
                      placeholder="VD: 2020"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Mô tả doanh nghiệp *</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Mô tả về sản phẩm/dịch vụ chính của cửa hàng..."
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Thông tin liên hệ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="VD: 0901234567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email liên hệ *</Label>
                    <Input
                      id="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="VD: contact@store.com"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="business_address">Địa chỉ kinh doanh *</Label>
                  <Textarea
                    id="business_address"
                    value={form.business_address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Địa chỉ cụ thể của cửa hàng/kho hàng..."
                  />
                </div>
              </div>

              {/* Document Upload */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Tải lên giấy tờ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Giấy phép kinh doanh */}
                  <div className="border-2 border-dashed border-border rounded-lg p-0 h-48 w-full flex items-center justify-center relative overflow-hidden">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      style={{ display: "none" }}
                      id="license_image_upload"
                      onChange={e => handleFilePick(e, "license_image")}
                    />
                    {form.license_image ? (
                      <div className="w-full h-full relative group">
                        {form.license_image.endsWith(".pdf") ? (
                          <div className="flex flex-col items-center justify-center h-full w-full">
                            <a
                              href={form.license_image}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary underline"
                            >
                              Xem file PDF
                            </a>
                          </div>
                        ) : (
                          <img
                            src={form.license_image}
                            alt="Giấy phép kinh doanh"
                            className="object-contain w-full h-full"
                          />
                        )}
                      </div>
                    ) : pendingFiles.license_image && previewUrls.license_image ? (
                      <div className="w-full h-full flex flex-col items-center justify-center relative">
                        <img
                          src={previewUrls.license_image}
                          alt="Preview giấy phép kinh doanh"
                          className="object-contain w-full h-full"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white"
                          onClick={() => setPendingFiles(f => ({ ...f, license_image: null }))}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                        onClick={() => document.getElementById("license_image_upload")?.click()}
                      >
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium mb-1">Giấy phép kinh doanh</p>
                        <p className="text-xs text-muted-foreground mb-3">PNG, JPG, PDF tối đa 5MB</p>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                        >
                          Chọn tệp
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* CMND/CCCD */}
                  <div className="border-2 border-dashed border-border rounded-lg p-0 h-48 w-full flex items-center justify-center relative overflow-hidden">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      style={{ display: "none" }}
                      id="idcard_image_upload"
                      onChange={e => handleFilePick(e, "idcard_image")}
                    />
                    {form.idcard_image ? (
                      <div className="w-full h-full relative group">
                        {form.idcard_image.endsWith(".pdf") ? (
                          <div className="flex flex-col items-center justify-center h-full w-full">
                            <a
                              href={form.idcard_image}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary underline"
                            >
                              Xem file PDF
                            </a>
                          </div>
                        ) : (
                          <img
                            src={form.idcard_image}
                            alt="CMND/CCCD"
                            className="object-contain w-full h-full"
                          />
                        )}
                      </div>
                    ) : pendingFiles.idcard_image && previewUrls.idcard_image ? (
                      <div className="w-full h-full flex flex-col items-center justify-center relative">
                        <img
                          src={previewUrls.idcard_image}
                          alt="Preview CMND/CCCD"
                          className="object-contain w-full h-full"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white"
                          onClick={() => setPendingFiles(f => ({ ...f, idcard_image: null }))}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                        onClick={() => document.getElementById("idcard_image_upload")?.click()}
                      >
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium mb-1">CMND/CCCD</p>
                        <p className="text-xs text-muted-foreground mb-3">PNG, JPG, PDF tối đa 5MB</p>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                        >
                          Chọn tệp
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Terms */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="terms" className="mt-1" />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    Tôi đồng ý với <a href="#" className="text-primary underline">Điều khoản dịch vụ</a> và
                    <a href="#" className="text-primary underline ml-1">Chính sách bán hàng</a> của VibeMarket
                  </label>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full" size="lg">
                <FileText className="w-5 h-5 mr-2" />
                Gửi đăng ký
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default VendorRegistration;