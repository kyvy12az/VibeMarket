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
  Building
} from "lucide-react";
import { useState } from "react";

const VendorRegistration = () => {
  // Mock trạng thái đăng ký vendor: 'none' | 'pending' | 'approved' | 'rejected'
  const [registrationStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  
  const mockRegistrationData = {
    businessName: "Beauty World Store",
    businessType: "Cửa hàng mỹ phẩm",
    taxId: "0123456789",
    address: "123 Lê Lợi, Quận 1, TP.HCM",
    phone: "0901234567",
    email: "contact@beautyworld.com",
    description: "Chuyên cung cấp mỹ phẩm chính hãng từ các thương hiệu nổi tiếng",
    submittedDate: "2024-01-20",
    documents: ["Giấy phép kinh doanh", "Chứng minh nhân dân", "Hợp đồng thuê mặt bằng"]
  };

  const RequirementItem = ({ icon: Icon, title, description, completed = false }: {
    icon: any;
    title: string;
    description: string;
    completed?: boolean;
  }) => (
    <div className="flex items-start gap-4 p-4 border border-border rounded-lg">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        completed ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
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
                      <p className="font-medium">{mockRegistrationData.businessName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Loại hình:</span>
                      <p className="font-medium">{mockRegistrationData.businessType}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mã số thuế:</span>
                      <p className="font-medium">{mockRegistrationData.taxId}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ngày gửi:</span>
                      <p className="font-medium">{new Date(mockRegistrationData.submittedDate).toLocaleDateString('vi-VN')}</p>
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

                <Button className="w-full" size="lg">
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
                  <Label htmlFor="businessName">Tên doanh nghiệp/Cửa hàng *</Label>
                  <Input id="businessName" placeholder="VD: Beauty World Store" />
                </div>
                <div>
                  <Label htmlFor="businessType">Loại hình kinh doanh *</Label>
                  <Input id="businessType" placeholder="VD: Cửa hàng mỹ phẩm" />
                </div>
                <div>
                  <Label htmlFor="taxId">Mã số thuế</Label>
                  <Input id="taxId" placeholder="VD: 0123456789" />
                </div>
                <div>
                  <Label htmlFor="establishYear">Năm thành lập</Label>
                  <Input id="establishYear" type="number" placeholder="VD: 2020" />
                </div>
              </div>
              <div>
                <Label htmlFor="businessDescription">Mô tả doanh nghiệp *</Label>
                <Textarea 
                  id="businessDescription" 
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
                  <Label htmlFor="contactPhone">Số điện thoại *</Label>
                  <Input id="contactPhone" placeholder="VD: 0901234567" />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Email liên hệ *</Label>
                  <Input id="contactEmail" type="email" placeholder="VD: contact@store.com" />
                </div>
              </div>
              <div>
                <Label htmlFor="businessAddress">Địa chỉ kinh doanh *</Label>
                <Textarea 
                  id="businessAddress" 
                  rows={3}
                  placeholder="Địa chỉ cụ thể của cửa hàng/kho hàng..."
                />
              </div>
            </div>

            {/* Document Upload */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Tải lên giấy tờ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium mb-1">Giấy phép kinh doanh</p>
                  <p className="text-xs text-muted-foreground mb-3">PNG, JPG, PDF tối đa 5MB</p>
                  <Button variant="outline" size="sm">Chọn tệp</Button>
                </div>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium mb-1">CMND/CCCD</p>
                  <p className="text-xs text-muted-foreground mb-3">PNG, JPG, PDF tối đa 5MB</p>
                  <Button variant="outline" size="sm">Chọn tệp</Button>
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

            <Button className="w-full" size="lg">
              <FileText className="w-5 h-5 mr-2" />
              Gửi đăng ký
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorRegistration;