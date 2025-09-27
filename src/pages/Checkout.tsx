import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, CreditCard, MapPin, Package, Shield, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const productData = location.state?.product;
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    note: "",
    paymentMethod: "cod",
    shippingMethod: "standard"
  });

  // Mock product data if none provided
  const product = productData || {
    id: 1,
    name: "Áo thun nam cao cấp",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    price: 299000,
    originalPrice: 399000,
    discount: 25,
    selectedSize: "L",
    selectedColor: "Xanh Navy",
    quantity: 2
  };

  const shippingFee = formData.shippingMethod === "express" ? 50000 : 25000;
  const subtotal = product.price * product.quantity;
  const total = subtotal + shippingFee;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      toast.success("Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
      navigate("/");
    }
  };

  const steps = [
    { id: 1, title: "Thông tin giao hàng", icon: MapPin },
    { id: 2, title: "Phương thức thanh toán", icon: CreditCard },
    { id: 3, title: "Xác nhận đơn hàng", icon: Package }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Thanh toán</h1>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-8 mb-8">
          {steps.map((stepItem, index) => (
            <div key={stepItem.id} className="flex items-center gap-2">
              <motion.div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= stepItem.id 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : "border-muted-foreground text-muted-foreground"
                }`}
                animate={{ scale: step === stepItem.id ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {step > stepItem.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <stepItem.icon className="w-5 h-5" />
                )}
              </motion.div>
              <span className={`text-sm font-medium ${
                step >= stepItem.id ? "text-foreground" : "text-muted-foreground"
              }`}>
                {stepItem.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${
                  step > stepItem.id ? "bg-primary" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Thông tin giao hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Họ và tên *</Label>
                        <Input 
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          placeholder="Nhập họ và tên"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Số điện thoại *</Label>
                        <Input 
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Nhập email (tùy chọn)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Địa chỉ chi tiết *</Label>
                      <Input 
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Số nhà, tên đường..."
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">Tỉnh/Thành phố *</Label>
                        <Input 
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          placeholder="Chọn tỉnh/thành"
                        />
                      </div>
                      <div>
                        <Label htmlFor="district">Quận/Huyện *</Label>
                        <Input 
                          id="district"
                          value={formData.district}
                          onChange={(e) => handleInputChange("district", e.target.value)}
                          placeholder="Chọn quận/huyện"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ward">Phường/Xã *</Label>
                        <Input 
                          id="ward"
                          value={formData.ward}
                          onChange={(e) => handleInputChange("ward", e.target.value)}
                          placeholder="Chọn phường/xã"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="note">Ghi chú đơn hàng</Label>
                      <Textarea 
                        id="note"
                        value={formData.note}
                        onChange={(e) => handleInputChange("note", e.target.value)}
                        placeholder="Ghi chú về đơn hàng, thời gian giao hàng..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Phương thức vận chuyển</Label>
                      <RadioGroup 
                        value={formData.shippingMethod} 
                        onValueChange={(value) => handleInputChange("shippingMethod", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem value="standard" id="standard" />
                          <div className="flex-1">
                            <Label htmlFor="standard" className="flex items-center justify-between cursor-pointer">
                              <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4" />
                                <span>Giao hàng tiêu chuẩn</span>
                              </div>
                              <span className="text-sm text-muted-foreground">25.000₫</span>
                            </Label>
                            <p className="text-xs text-muted-foreground ml-6">3-5 ngày làm việc</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem value="express" id="express" />
                          <div className="flex-1">
                            <Label htmlFor="express" className="flex items-center justify-between cursor-pointer">
                              <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-orange-500" />
                                <span>Giao hàng nhanh</span>
                              </div>
                              <span className="text-sm text-muted-foreground">50.000₫</span>
                            </Label>
                            <p className="text-xs text-muted-foreground ml-6">1-2 ngày làm việc</p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Phương thức thanh toán
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup 
                      value={formData.paymentMethod} 
                      onValueChange={(value) => handleInputChange("paymentMethod", value)}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="cod" id="cod" />
                        <div className="flex-1">
                          <Label htmlFor="cod" className="flex items-center justify-between cursor-pointer">
                            <div className="flex items-center gap-3">
                              <Package className="w-5 h-5 text-green-500" />
                              <div>
                                <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                                <p className="text-xs text-muted-foreground">Thanh toán bằng tiền mặt khi nhận hàng</p>
                              </div>
                            </div>
                            <Badge variant="secondary">Phổ biến</Badge>
                          </Label>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="banking" id="banking" />
                        <div className="flex-1">
                          <Label htmlFor="banking" className="flex items-center gap-3 cursor-pointer">
                            <CreditCard className="w-5 h-5 text-blue-500" />
                            <div>
                              <p className="font-medium">Chuyển khoản ngân hàng</p>
                              <p className="text-xs text-muted-foreground">Chuyển khoản qua ATM, Internet Banking</p>
                            </div>
                          </Label>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 p-4 border rounded-lg opacity-50">
                        <RadioGroupItem value="vnpay" id="vnpay" disabled />
                        <div className="flex-1">
                          <Label htmlFor="vnpay" className="flex items-center justify-between cursor-pointer">
                            <div className="flex items-center gap-3">
                              <Shield className="w-5 h-5 text-red-500" />
                              <div>
                                <p className="font-medium">Ví điện tử VNPay</p>
                                <p className="text-xs text-muted-foreground">Thanh toán qua ví VNPay</p>
                              </div>
                            </div>
                            <Badge variant="outline">Sắp có</Badge>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>

                    {formData.paymentMethod === "banking" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 p-4 bg-muted rounded-lg"
                      >
                        <h4 className="font-medium mb-2">Thông tin chuyển khoản:</h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Ngân hàng:</strong> Vietcombank</p>
                          <p><strong>Số tài khoản:</strong> 1234567890</p>
                          <p><strong>Chủ tài khoản:</strong> CÔNG TY THƯƠNG MẠI ABC</p>
                          <p><strong>Nội dung:</strong> {product.name} - {formData.fullName}</p>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Xác nhận đơn hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Shipping Info */}
                    <div>
                      <h4 className="font-medium mb-2">Thông tin giao hàng</h4>
                      <div className="bg-muted p-3 rounded-lg text-sm">
                        <p className="font-medium">{formData.fullName}</p>
                        <p>{formData.phone}</p>
                        <p>{formData.address}, {formData.ward}, {formData.district}, {formData.city}</p>
                        {formData.note && <p className="text-muted-foreground">Ghi chú: {formData.note}</p>}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h4 className="font-medium mb-2">Phương thức thanh toán</h4>
                      <div className="bg-muted p-3 rounded-lg text-sm">
                        <p>{formData.paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" : 
                           formData.paymentMethod === "banking" ? "Chuyển khoản ngân hàng" : "Ví điện tử VNPay"}</p>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Bằng cách đặt hàng, bạn đồng ý với <span className="underline cursor-pointer">Điều khoản sử dụng</span> và 
                        <span className="underline cursor-pointer"> Chính sách bảo mật</span> của chúng tôi.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Thông tin đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product Info */}
                <div className="flex gap-3">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {product.selectedSize} / {product.selectedColor}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs">Số lượng: {product.quantity}</span>
                      <span className="font-medium">{product.price.toLocaleString()}₫</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính</span>
                    <span>{subtotal.toLocaleString()}₫</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển</span>
                    <span>{shippingFee.toLocaleString()}₫</span>
                  </div>
                  {product.discount && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá</span>
                      <span>-{((product.originalPrice - product.price) * product.quantity).toLocaleString()}₫</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{total.toLocaleString()}₫</span>
                </div>

                {/* Trust Badges */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Thanh toán an toàn & bảo mật</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Đánh giá 4.8/5 từ 10,000+ khách hàng</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Truck className="w-4 h-4 text-blue-500" />
                    <span>Miễn phí đổi trả trong 7 ngày</span>
                  </div>
                </div>

                <Button 
                  onClick={handleSubmit}
                  className="w-full bg-gradient-primary hover:opacity-90"
                  size="lg"
                >
                  {step < 3 ? "Tiếp tục" : "Đặt hàng"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}