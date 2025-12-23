import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, CreditCard, MapPin, Package, Shield, Star, Truck, Info, ChevronRight, Sparkles, Clock, ChevronsUpDown, Ticket, Percent, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import CheckoutLoadingOverlay from "@/components/CheckoutLoadingOverlay";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const productData = location.state?.product;
  const productsData = location.state?.products || [];
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
    address: "",
    city: "",
    ward: "",
    note: "",
    paymentMethod: "cod"
  });

  const [product, setProduct] = useState(productData || null);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [openProvinceCombo, setOpenProvinceCombo] = useState(false);
  const [openWardCombo, setOpenWardCombo] = useState(false);

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [showCouponList, setShowCouponList] = useState(false);
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const subtotal = productsData.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [feeLoading, setFeeLoading] = useState(false);
  const [distanceInfo, setDistanceInfo] = useState<any>(null);
  const discountAmount = appliedCoupon?.discount_amount || 0;
  const customer_address_full = formData.address && formData.ward && formData.city
    ? `${formData.address}, ${formData.ward}, ${formData.city}`
    : "";
  // Updated effectiveShippingFee to only include shippingFee if it is not null
  const effectiveShippingFee = customer_address_full && shippingFee !== null ? shippingFee : 0;
  // Updated total calculation to reflect the change in effectiveShippingFee
  const total = subtotal + effectiveShippingFee - discountAmount;

  useEffect(() => {
    if (!productData && location.state?.productId) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/detail.php?id=${location.state.productId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setProduct(data.product);
        });
    } else if (productData) {
      setProduct(productData);
    }
  }, [productData, location.state]);

  // Fetch provinces on mount
  useEffect(() => {
    console.log('DEBUG: Gọi API danh sách tỉnh (provinces)');
    fetch('https://provinces.open-api.vn/api/v2/p/')
      .then((res) => res.json())
      .then((data) => {
        console.log('DEBUG: provinces response', data?.length ?? 'no-data');
        setProvinces(data);
      })
      .catch((err) => console.error('Lỗi khi lấy danh sách tỉnh:', err));
  }, []);

  // Fetch wards when province changes
  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://provinces.open-api.vn/api/v2/p/${selectedProvince}?depth=2`)
        .then((res) => res.json())
          .then((data) => {
            console.log('DEBUG: wards response for province', selectedProvince, data);
            // API v2 trả về trực tiếp mảng wards (đã gộp từ tất cả districts)
            if (data.wards && Array.isArray(data.wards)) {
              setWards(data.wards);
            } else {
              setWards([]);
            }
            setSelectedWard("");
            handleInputChange("ward", "");
          })
          .catch((err) => console.error('Lỗi khi lấy wards:', err));
    } else {
      setWards([]);
      setSelectedWard("");
    }
  }, [selectedProvince]);

  // Fetch available coupons when component mounts
  useEffect(() => {
    fetchAvailableCoupons();
  }, [productsData]);

    const fetchAvailableCoupons = async () => {
    if (!productsData.length) return;

    const sellerId = productsData[0]?.seller_id;
    if (!sellerId) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/vendor/coupons/get_coupons.php?vendor_id=${sellerId}`
      );
      const data = await response.json();

      if (data.success && data.coupons) {
        // Filter active coupons and sort by best discount
        const activeCoupons = data.coupons
          .filter((c: any) => c.status === 'active')
          .map((coupon: any) => {
            // Calculate potential discount for sorting
            let potentialDiscount = 0;
            const orderTotal = subtotal + (customer_address_full ? shippingFee : 0);

            if (coupon.min_purchase && orderTotal < coupon.min_purchase) {
              potentialDiscount = 0; // Can't use this coupon
            } else if (coupon.discount_type === 'percentage') {
              potentialDiscount = (orderTotal * coupon.discount_value) / 100;
              if (coupon.max_discount && potentialDiscount > coupon.max_discount) {
                potentialDiscount = coupon.max_discount;
              }
            } else {
              potentialDiscount = coupon.discount_value;
            }

            return { ...coupon, potentialDiscount };
          })
          .sort((a: any, b: any) => b.potentialDiscount - a.potentialDiscount); // Sort by best discount first

        setAvailableCoupons(activeCoupons);
      }
    } catch (error) {
      console.error('Lỗi khi lấy coupon:', error);
    }
  };

  const validateAndApplyCoupon = async (code: string) => {
    if (!code.trim()) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    setLoadingCoupon(true);
    const sellerId = productsData[0]?.seller_id;
    const orderTotal = subtotal + (customer_address_full ? shippingFee : 0);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/vendor/coupons/validate_coupon.php`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            coupon_code: code.toUpperCase(),
            seller_id: sellerId,
            product_id: null,
            order_total: orderTotal
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        setAppliedCoupon(data.coupon);
        toast.success(`Áp dụng mã giảm giá thành công! Giảm ${data.coupon.discount_amount.toLocaleString('vi-VN')}₫`);
        setShowCouponList(false);
      } else {
        toast.error(data.message || 'Mã giảm giá không hợp lệ');
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      toast.error('Lỗi khi áp dụng mã giảm giá');
    } finally {
      setLoadingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Đã xóa mã giảm giá');
  };

  const selectCoupon = (coupon: any) => {
    setCouponCode(coupon.code);
    validateAndApplyCoupon(coupon.code);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return false;
    }
    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      toast.error("Số điện thoại không hợp lệ (phải có 10 chữ số)");
      return false;
    }
    if (!formData.address.trim()) {
      toast.error("Vui lòng nhập địa chỉ chi tiết");
      return false;
    }
    if (!formData.city.trim()) {
      toast.error("Vui lòng chọn tỉnh/thành phố");
      return false;
    }
    if (!formData.ward.trim()) {
      toast.error("Vui lòng chọn xã/phường");
      return false;
    }
    return true;
  };

  // Fetch dynamic shipping fee from backend calculate_fee.php
  useEffect(() => {
    // Need a full customer address to calculate
    const customer_address = formData.address && formData.ward && formData.city
      ? `${formData.address}, ${formData.ward}, ${formData.city}`
      : "";

    // Try to get seller address from products data if available
    const seller_address = productsData?.[0]?.seller_address || productsData?.[0]?.seller?.address || import.meta.env.VITE_STORE_ADDRESS || "";

    if (!customer_address) {
      console.warn('DEBUG: customer_address thiếu, bỏ qua tính phí:', { customer_address });
      // cannot calculate without customer address — use fallback fee
      setShippingFee(0);
      setDistanceInfo(null);
      return;
    }
    if (!seller_address) {
      console.warn('DEBUG: seller_address rỗng — sẽ gửi seller_id để backend lookup business_address');
    }

    const controller = new AbortController();
    const fetchFee = async () => {
      setFeeLoading(true);
      try {
        const seller_id_payload = productsData?.[0]?.seller_id || null;
        const payload = { seller_id: seller_id_payload, seller_address, customer_address };
        console.log('DEBUG: Gửi yêu cầu tính phí vận chuyển đến backend', payload);
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/shipping/calculate_fee.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        const text = await res.text();
        let data = null;
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          console.error('Lỗi parse JSON từ calculate_fee.php:', parseErr, 'raw:', text);
        }

        console.log('DEBUG: calculate_fee.php trả về:', data ?? text);

        if (data && data.success && typeof data.shipping_fee !== 'undefined') {
          console.log('DEBUG: Phí vận chuyển tính được:', data.shipping_fee, 'khoảng cách:', data.distance_km);
          setShippingFee(Number(data.shipping_fee));
          setDistanceInfo({ distance_km: data.distance_km, duration: data.duration, note: data.note });
        } else {
          console.warn('DEBUG: calculate_fee không trả phí hợp lệ, không đặt phí vận chuyển', data);
          setShippingFee(null);
          setDistanceInfo(null);
        }
      } catch (err) {
        console.error('Lỗi khi gọi calculate_fee.php:', err);
        // on network/error, do not set a default fee
        setShippingFee(null);
        setDistanceInfo(null);
      } finally {
        setFeeLoading(false);
      }
    };

    fetchFee();
    return () => controller.abort();
  }, [formData.address, formData.ward, formData.city, productsData]);

  const handleSubmit = async () => {
    if (isProcessing) return;

    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!formData.paymentMethod) {
        toast.error("Vui lòng chọn phương thức thanh toán");
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      if (!validateStep1()) return;
    }

    const isOnlinePayment = ["momo", "vnpay", "zalopay"].includes(formData.paymentMethod);
    if (!isOnlinePayment) setIsProcessing(true);
    let keepLoadingForRedirect = false;

    const products = productsData.map((item) => ({
      id: item.id,
      seller_id: item.seller_id,
      quantity: item.quantity,
      price: item.price,
      size: item.selectedSize,
      color: item.selectedColor,
    }));

    const seller_id = productsData[0]?.seller_id || 1;
    const customer_id = user?.id || null;
    const address = `${formData.address}, ${formData.ward}, ${formData.city}`;
    // Use the computed `subtotal`, `shippingFee` (state) and `discountAmount` from outer scope
    const discountAmountLocal = appliedCoupon?.discount_amount || 0;
    const total = subtotal + effectiveShippingFee - discountAmountLocal;

    const orderData = {
      customer_id,
      fullName: formData.fullName,
      phone: formData.phone,
      address,
      note: formData.note,
      payment_method: formData.paymentMethod,
      products,
      total,
      shipping_fee: effectiveShippingFee,
      email: formData.email,
      coupon_id: appliedCoupon?.id || null,
      discount_amount: discountAmountLocal,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/create.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      console.log('DEBUG: Gửi order.create với payload:', orderData);
      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Lỗi parse JSON từ create.php:', e, 'raw:', text);
      }
      console.log('DEBUG: create.php trả về:', data ?? text);

      if (!data.success) {
        toast.error(data.message || "Có lỗi xảy ra!");
        return;
      }

      // Apply coupon usage count after successful order
      if (appliedCoupon?.id) {
        try {
          await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/vendor/coupons/apply_coupon.php`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ coupon_id: appliedCoupon.id })
            }
          );
        } catch (err) {
          console.error('Error applying coupon usage:', err);
          // Don't show error to user as order is already created
        }
      }

      if (formData.paymentMethod === "zalopay") {
        const zalopayRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment/zalopay/pay.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("vibeventure_token") || ""}`
          },
          body: JSON.stringify({
            orderCode: data.code,
            orderInfo: `Thanh toán đơn hàng #${data.code}`,
            amount: total
          }),
        });
        const zalopayData = await zalopayRes.json();
        if (zalopayData.success && zalopayData.payUrl) {
          keepLoadingForRedirect = true;
          window.location.href = zalopayData.payUrl;
          return;
        } else {
          toast.error(zalopayData.message || "Không thể tạo thanh toán ZaloPay!");
        }
      } else if (formData.paymentMethod === "momo") {
        const momoRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment/momo/pay.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("vibeventure_token") || ""}`
          },
          body: JSON.stringify({
            orderCode: data.code,
            orderInfo: `Thanh toán đơn hàng #${data.code}`
          }),
        });
        const momoData = await momoRes.json();
        if (momoData.success && momoData.payUrl) {
          keepLoadingForRedirect = true;
          window.location.href = momoData.payUrl;
          return;
        } else {
          toast.error(momoData.error || "Không thể tạo thanh toán MoMo!");
        }
      } else if (formData.paymentMethod === "payos") {
        const payosRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment/payos/pay.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderCode: data.id,
            orderInfo: `Thanh toán đơn hàng #${data.code}`
          }),
        });
        const payosData = await payosRes.json();
        if (payosData.success && payosData.payUrl) {
          keepLoadingForRedirect = true;
          window.location.href = payosData.payUrl;
          return;
        } else {
          toast.error(payosData.message || "Không thể tạo thanh toán PayOS!");
        }
      } else if (formData.paymentMethod === "vnpay") {
        try {
          const vnpRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment/vnpay/pay.php`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderCode: data.code || data.id || data.order_code,
              orderInfo: `Thanh toán đơn hàng #${data.code || data.id}`,
              amount: total
            }),
          });

          if (!vnpRes.ok) {
            const txt = await vnpRes.text();
            toast.error("Lỗi khi tạo VNPay: " + vnpRes.status + " " + txt);
            return;
          }

          const vnpData = await vnpRes.json();
          if (vnpData.success && vnpData.payUrl) {
            keepLoadingForRedirect = true;
            window.location.href = vnpData.payUrl;
            return;
          } else {
            toast.error(vnpData.message || "Không thể tạo thanh toán VNPay!");
          }
        } catch (err) {
          console.error(err);
          toast.error("Không thể kết nối máy chủ cho VNPay!");
        }
      } else {
        toast.success("Đặt hàng thành công! Mã đơn: " + data.code);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể kết nối máy chủ!");
    } finally {
      if (!keepLoadingForRedirect) {
        setIsProcessing(false);
      }
    }
  };

  const steps = [
    { id: 1, title: "Thông tin giao hàng", icon: MapPin, description: "Điền thông tin nhận hàng" },
    { id: 2, title: "Phương thức thanh toán", icon: CreditCard, description: "Chọn cách thanh toán" },
    { id: 3, title: "Xác nhận đơn hàng", icon: Package, description: "Kiểm tra và hoàn tất" }
  ];

  if (!productsData.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Giỏ hàng trống</h3>
          <p className="text-muted-foreground mb-4">Không có sản phẩm nào để thanh toán</p>
          <Button onClick={() => navigate("/")} variant="outline">
            Tiếp tục mua sắm
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CheckoutLoadingOverlay isVisible={isProcessing} />
      
      {/* Enhanced Header */}
      <div className="bg-background/80 backdrop-blur-xl border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="shrink-0 hover:bg-primary/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Thanh toán
                </h1>
                <p className="text-sm text-muted-foreground">Hoàn tất đơn hàng của bạn</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">Bảo mật SSL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Progress Steps */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 w-full h-1 bg-gradient-to-r from-muted via-muted to-muted">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary via-purple-500 to-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${((step - 1) / 2) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>

            <div className="relative flex items-center justify-between">
              {steps.map((stepItem, index) => (
                <motion.div
                  key={stepItem.id}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      step >= stepItem.id
                        ? "bg-gradient-to-br from-primary to-purple-600 border-transparent text-white shadow-lg shadow-primary/50"
                        : "border-muted-foreground bg-background text-muted-foreground"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    animate={{ 
                      scale: step === stepItem.id ? [1, 1.1, 1] : 1,
                      rotate: step === stepItem.id ? [0, 5, -5, 0] : 0
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {step > stepItem.id ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <stepItem.icon className="w-6 h-6" />
                    )}
                    {step === stepItem.id && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary"
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                  <div className="mt-3 text-center">
                    <p className={`text-sm font-semibold transition-colors ${
                      step >= stepItem.id ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {stepItem.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 hidden md:block">
                      {stepItem.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 && (
                  <Card className="overflow-hidden border-none shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-b">
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <span className="text-xl">Thông tin giao hàng</span>
                          <p className="text-sm font-normal text-muted-foreground mt-1">
                            Vui lòng điền đầy đủ thông tin để nhận hàng
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                          <Label htmlFor="fullName" className="flex items-center gap-2">
                            Họ và tên <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                            placeholder="Nguyễn Văn A"
                            className="transition-all focus:ring-2 focus:ring-primary/20"
                          />
                        </motion.div>
                        <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center gap-2">
                            Số điện thoại <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="0123456789"
                            className="transition-all focus:ring-2 focus:ring-primary/20"
                          />
                        </motion.div>
                      </div>

                      <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                        <Label htmlFor="email">Email (tùy chọn)</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="email@example.com"
                          className="transition-all focus:ring-2 focus:ring-primary/20"
                        />
                      </motion.div>

                      <Separator className="my-6" />

                      <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                        <Label htmlFor="address" className="flex items-center gap-2">
                          Địa chỉ chi tiết <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="Số nhà, tên đường, khu vực..."
                          className="transition-all focus:ring-2 focus:ring-primary/20"
                        />
                      </motion.div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                          <Label htmlFor="city" className="flex items-center gap-2">
                            Tỉnh/Thành phố <span className="text-destructive">*</span>
                          </Label>
                          <Popover open={openProvinceCombo} onOpenChange={setOpenProvinceCombo}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openProvinceCombo}
                                className="w-full justify-between transition-all focus:ring-2 focus:ring-primary/20"
                              >
                                {selectedProvince
                                  ? provinces.find((province) => province.code.toString() === selectedProvince)?.name
                                  : "Chọn tỉnh/thành phố..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                              <Command>
                                <CommandInput placeholder="Tìm kiếm tỉnh/thành phố..." />
                                <CommandList>
                                  <CommandEmpty>Không tìm thấy.</CommandEmpty>
                                  <CommandGroup>
                                    {provinces.map((province) => (
                                      <CommandItem
                                        key={province.code}
                                        value={province.name}
                                        onSelect={() => {
                                          setSelectedProvince(province.code.toString());
                                          handleInputChange("city", province.name);
                                          setOpenProvinceCombo(false);
                                        }}
                                      >
                                        <Check
                                          className={`mr-2 h-4 w-4 ${
                                            selectedProvince === province.code.toString()
                                              ? "opacity-100"
                                              : "opacity-0"
                                          }`}
                                        />
                                        {province.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </motion.div>
                        <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                          <Label htmlFor="ward" className="flex items-center gap-2">
                            Xã/Phường <span className="text-destructive">*</span>
                          </Label>
                          <Popover open={openWardCombo} onOpenChange={setOpenWardCombo}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openWardCombo}
                                disabled={!selectedProvince}
                                className="w-full justify-between transition-all focus:ring-2 focus:ring-primary/20"
                              >
                                {selectedWard
                                  ? wards.find((ward) => ward.code.toString() === selectedWard)?.name
                                  : "Chọn xã/phường..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                              <Command>
                                <CommandInput placeholder="Tìm kiếm xã/phường..." />
                                <CommandList className="max-h-[300px]">
                                  <CommandEmpty>Không tìm thấy.</CommandEmpty>
                                  <CommandGroup>
                                    {wards.map((ward) => (
                                      <CommandItem
                                        key={ward.code}
                                        value={ward.name}
                                        onSelect={() => {
                                          setSelectedWard(ward.code.toString());
                                          handleInputChange("ward", ward.name);
                                          setOpenWardCombo(false);
                                        }}
                                      >
                                        <Check
                                          className={`mr-2 h-4 w-4 ${
                                            selectedWard === ward.code.toString()
                                              ? "opacity-100"
                                              : "opacity-0"
                                          }`}
                                        />
                                        {ward.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </motion.div>
                      </div>

                      {/* Address Preview */}
                      {formData.address && formData.ward && formData.city && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200 dark:border-blue-800"
                        >
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                                Địa chỉ đầy đủ:
                              </p>
                              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                {formData.address}, {formData.ward}, {formData.city}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                        <Label htmlFor="note">Ghi chú đơn hàng</Label>
                        <Textarea
                          id="note"
                          value={formData.note}
                          onChange={(e) => handleInputChange("note", e.target.value)}
                          placeholder="Ghi chú về đơn hàng, thời gian giao hàng..."
                          rows={3}
                          className="transition-all focus:ring-2 focus:ring-primary/20 resize-none"
                        />
                      </motion.div>

                      <Separator className="my-6" />
                      
                    </CardContent>
                  </Card>
                )}

                {step === 2 && (
                  <Card className="overflow-hidden border-none shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-b">
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <span className="text-xl">Phương thức thanh toán</span>
                          <p className="text-sm font-normal text-muted-foreground mt-1">
                            Chọn phương thức thanh toán phù hợp
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <RadioGroup
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleInputChange("paymentMethod", value)}
                        className="space-y-4"
                      >
                        <motion.div 
                          whileHover={{ scale: 1.02, y: -2 }}
                          className={`flex items-center space-x-3 p-5 border-2 rounded-xl transition-all cursor-pointer shadow-sm ${
                            formData.paymentMethod === "cod"
                              ? "border-green-500 bg-green-50 dark:bg-green-950/30 shadow-lg"
                              : "border-border hover:border-green-400 hover:bg-muted/50"
                          }`}
                        >
                          <RadioGroupItem value="cod" id="cod" />
                          <div className="flex-1">
                            <Label htmlFor="cod" className="flex items-center justify-between cursor-pointer">
                              <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                  <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                  <p className="font-semibold text-lg">Thanh toán khi nhận hàng (COD)</p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Thanh toán bằng tiền mặt khi nhận hàng
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Phổ biến nhất
                              </Badge>
                            </Label>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          whileHover={{ scale: 1.02, y: -2 }}
                          className={`flex items-center space-x-3 p-5 border-2 rounded-xl transition-all cursor-pointer shadow-sm ${
                            formData.paymentMethod === "vnpay"
                              ? "border-red-500 bg-red-50 dark:bg-red-950/30 shadow-lg"
                              : "border-border hover:border-red-400 hover:bg-muted/50"
                          }`}
                        >
                          <RadioGroupItem value="vnpay" id="vnpay" />
                          <div className="flex-1">
                            <Label htmlFor="vnpay" className="flex items-center gap-3 cursor-pointer">
                              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                                <img src="/images/icons/vnpay.png" alt="VNPay" className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="font-semibold text-lg">VNPay</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Thanh toán qua ví VNPay, QR Code, ATM
                                </p>
                              </div>
                            </Label>
                          </div>
                        </motion.div>

                        <motion.div 
                          whileHover={{ scale: 1.02, y: -2 }}
                          className={`flex items-center space-x-3 p-5 border-2 rounded-xl transition-all cursor-pointer shadow-sm ${
                            formData.paymentMethod === "momo"
                              ? "border-pink-500 bg-pink-50 dark:bg-pink-950/30 shadow-lg"
                              : "border-border hover:border-pink-400 hover:bg-muted/50"
                          }`}
                        >
                          <RadioGroupItem value="momo" id="momo" />
                          <div className="flex-1">
                            <Label htmlFor="momo" className="flex items-center gap-3 cursor-pointer">
                              <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                                <img src="/images/icons/momo.png" alt="MoMo" className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="font-semibold text-lg">Ví MoMo</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Thanh toán nhanh chóng qua ví MoMo
                                </p>
                              </div>
                            </Label>
                          </div>
                        </motion.div>

                        <motion.div 
                          whileHover={{ scale: 1.02, y: -2 }}
                          className={`flex items-center space-x-3 p-5 border-2 rounded-xl transition-all cursor-pointer shadow-sm ${
                            formData.paymentMethod === "zalopay"
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-lg"
                              : "border-border hover:border-blue-400 hover:bg-muted/50"
                          }`}
                        >
                          <RadioGroupItem value="zalopay" id="zalopay" />
                          <div className="flex-1">
                            <Label htmlFor="zalopay" className="flex items-center gap-3 cursor-pointer">
                              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <img src="/images/icons/zalopay.webp" alt="ZaloPay" className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="font-semibold text-lg">ZaloPay</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Thanh toán qua ví ZaloPay, QR Code
                                </p>
                              </div>
                            </Label>
                          </div>
                        </motion.div>
                      </RadioGroup>
                    </CardContent>
                  </Card>
                )}

                {step === 3 && (
                  <Card className="overflow-hidden border-none shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-b">
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <span className="text-xl">Xác nhận đơn hàng</span>
                          <p className="text-sm font-normal text-muted-foreground mt-1">
                            Kiểm tra thông tin trước khi đặt hàng
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                      {/* Shipping Info */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2 text-lg">
                          <MapPin className="w-5 h-5 text-primary" />
                          Thông tin giao hàng
                        </h4>
                        <div className="bg-gradient-to-br from-muted/50 to-muted/30 p-5 rounded-xl border border-border/50 space-y-2">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                            <div className="flex-1">
                              <p className="font-semibold text-lg">{formData.fullName}</p>
                              <p className="text-muted-foreground mt-1">{formData.phone}</p>
                            </div>
                          </div>
                          <Separator className="my-3" />
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                            <p className="flex-1 text-sm leading-relaxed">
                              {formData.address}, {formData.ward}, {formData.city}
                            </p>
                          </div>
                          {formData.note && (
                            <>
                              <Separator className="my-3" />
                              <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                                <div className="flex-1">
                                  <p className="text-sm text-muted-foreground">Ghi chú:</p>
                                  <p className="text-sm mt-1">{formData.note}</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Payment & Shipping Method */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" />
                            Thanh toán
                          </h4>
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2">
                              {formData.paymentMethod === "cod" && (
                                <>
                                  <div className="w-6 h-6 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <span className="text-sm">💵</span>
                                  </div>
                                  <p className="font-medium">Thanh toán khi nhận hàng</p>
                                </>
                              )}
                              {formData.paymentMethod === "zalopay" && (
                                <>
                                  <img src="/images/icons/zalopay.webp" alt="ZaloPay" className="w-6 h-6 object-contain" />
                                  <p className="font-medium">ZaloPay</p>
                                </>
                              )}
                              {formData.paymentMethod === "vnpay" && (
                                <>
                                  <img src="/images/icons/vnpay.png" alt="VNPay" className="w-6 h-6 object-contain" />
                                  <p className="font-medium">VNPay</p>
                                </>
                              )}
                              {formData.paymentMethod === "momo" && (
                                <>
                                  <img src="/images/icons/momo.png" alt="MoMo" className="w-6 h-6 object-contain" />
                                  <p className="font-medium">Ví MoMo</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Truck className="w-5 h-5 text-primary" />
                            Vận chuyển
                          </h4>
                          <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                            <p className="font-medium">
                              {formData.shippingMethod === "standard" ? "🚚 Giao hàng tiêu chuẩn" : "⚡ Giao hàng nhanh"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Terms */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 rounded-xl border border-blue-200 dark:border-blue-800"
                      >
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                          <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                            Bằng cách đặt hàng, bạn đồng ý với{" "}
                            <span className="underline cursor-pointer font-semibold hover:text-primary transition-colors">
                              Điều khoản sử dụng
                            </span>{" "}
                            và{" "}
                            <span className="underline cursor-pointer font-semibold hover:text-primary transition-colors">
                              Chính sách bảo mật
                            </span>{" "}
                            của chúng tôi.
                          </p>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.div 
              className="flex gap-3 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {step > 1 && (
                <Button
                  onClick={() => setStep(step - 1)}
                  variant="outline"
                  size="lg"
                  className="flex-1 border-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
              )}
              <Button
                onClick={handleSubmit}
                size="lg"
                className="flex-1 bg-gradient-to-r from-primary via-purple-600 to-primary hover:opacity-90 shadow-lg shadow-primary/30"
              >
                {step < 3 ? (
                  <>
                    Tiếp tục
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Xác nhận đặt hàng
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Enhanced Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <Card className="overflow-hidden border-none shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-b">
                  <CardTitle className="flex items-center justify-between">
                    <span>Đơn hàng của bạn</span>
                    <Badge variant="secondary" className="text-xs">
                      {productsData.length} sản phẩm
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 p-6">
                  {/* Products List */}
                  <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {productsData.map((product, idx) => (
                      <motion.div
                        key={product.id + "-" + idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all group"
                      >
                        <div className="relative">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-20 h-20 object-cover rounded-lg border-2 border-border group-hover:border-primary transition-all" 
                          />
                          <Badge className="absolute -top-2 -right-2 w-6 h-6 p-0 flex items-center justify-center bg-primary text-xs">
                            {product.quantity}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm line-clamp-2 mb-1">{product.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Badge variant="outline" className="text-xs px-2 py-0">
                              {product.selectedSize}
                            </Badge>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs px-2 py-0">
                              {product.selectedColor}
                            </Badge>
                          </div>
                          <p className="font-bold text-primary">{(product.price * product.quantity).toLocaleString()}₫</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Separator />

                  {/* Coupon Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-primary" />
                        Mã giảm giá
                      </h4>
                      {availableCoupons.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowCouponList(!showCouponList)}
                          className="text-xs h-7"
                        >
                          {showCouponList ? "Ẩn" : `${availableCoupons.length} mã`}
                        </Button>
                      )}
                    </div>

                    {!appliedCoupon ? (
                      <>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Nhập mã giảm giá"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="font-mono"
                            disabled={loadingCoupon}
                          />
                          <Button
                            onClick={() => validateAndApplyCoupon(couponCode)}
                            disabled={loadingCoupon || !couponCode.trim()}
                            size="sm"
                          >
                            {loadingCoupon ? "..." : "Áp dụng"}
                          </Button>
                        </div>

                        {/* Available Coupons List */}
                        <AnimatePresence>
                          {showCouponList && availableCoupons.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar"
                            >
                              {availableCoupons.map((coupon) => {
                                const canUse = !coupon.min_purchase || (subtotal + shippingFee) >= coupon.min_purchase;
                                const isUsageLimitReached = coupon.usage_limit && coupon.used_count >= coupon.usage_limit;

                                return (
                                  <motion.div
                                    key={coupon.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.02 }}
                                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                      canUse && !isUsageLimitReached
                                        ? "border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5 hover:border-primary/50 hover:shadow-md"
                                        : "border-border/50 bg-muted/20 opacity-60 cursor-not-allowed"
                                    }`}
                                    onClick={() => {
                                      if (canUse && !isUsageLimitReached) {
                                        selectCoupon(coupon);
                                      }
                                    }}
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <Tag className="w-3 h-3 text-primary" />
                                          <code className="font-bold text-sm bg-primary/10 px-2 py-0.5 rounded">
                                            {coupon.code}
                                          </code>
                                          {coupon.potentialDiscount > 0 && (
                                            <Badge variant="secondary" className="text-xs">
                                              Tốt nhất
                                            </Badge>
                                          )}
                                        </div>
                                        
                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                          {coupon.description || "Mã giảm giá"}
                                        </p>

                                        <div className="flex items-center gap-2 mt-2">
                                          {coupon.discount_type === "percentage" ? (
                                            <Badge variant="outline" className="text-xs gap-1">
                                              <Percent className="w-3 h-3" />
                                              {coupon.discount_value}%
                                              {coupon.max_discount && (
                                                <span className="text-muted-foreground">
                                                  (max {coupon.max_discount.toLocaleString()}₫)
                                                </span>
                                              )}
                                            </Badge>
                                          ) : (
                                            <Badge variant="outline" className="text-xs">
                                              -{coupon.discount_value.toLocaleString()}₫
                                            </Badge>
                                          )}
                                        </div>

                                        {coupon.min_purchase && (
                                          <p className="text-xs text-muted-foreground mt-1">
                                            Đơn tối thiểu: {coupon.min_purchase.toLocaleString()}₫
                                            {!canUse && (
                                              <span className="text-red-500 ml-1">(Chưa đủ điều kiện)</span>
                                            )}
                                          </p>
                                        )}

                                        {isUsageLimitReached && (
                                          <p className="text-xs text-red-500 mt-1">Đã hết lượt sử dụng</p>
                                        )}
                                      </div>

                                      {canUse && !isUsageLimitReached && coupon.potentialDiscount > 0 && (
                                        <div className="text-right">
                                          <p className="text-xs text-muted-foreground">Giảm</p>
                                          <p className="font-bold text-sm text-primary">
                                            -{coupon.potentialDiscount.toLocaleString()}₫
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-lg border-2 border-green-500/30 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Ticket className="w-4 h-4 text-green-600" />
                              <code className="font-bold text-sm bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                                {appliedCoupon.code}
                              </code>
                            </div>
                            {appliedCoupon.description && (
                              <p className="text-xs text-muted-foreground mb-2">
                                {appliedCoupon.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                                Giảm {appliedCoupon.discount_amount.toLocaleString()}₫
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={removeCoupon}
                            className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-3 bg-muted/20 p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span className="font-medium">{subtotal.toLocaleString()}₫</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Truck className="w-4 h-4" />
                        Phí vận chuyển
                      </span>
                      <span className="font-medium">
                        {!customer_address_full ? (
                          <span className="text-sm text-muted-foreground">Chọn địa chỉ để tính phí</span>
                        ) : feeLoading ? (
                          <span className="inline-flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                            <span className="text-sm">Đang tải...</span>
                          </span>
                        ) : (
                          <span>{shippingFee?.toLocaleString() || "Liên hệ để biết giá"}đ</span>
                        )}
                      </span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                          <Ticket className="w-4 h-4" />
                          Giảm giá
                        </span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          -{discountAmount.toLocaleString()}₫
                        </span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg">
                    <span className="font-bold text-lg">Tổng cộng</span>
                    <span className="font-bold text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      {total.toLocaleString()}₫
                    </span>
                  </div>

                  {/* Trust Badges */}
                  <div className="space-y-3 pt-2">
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 text-sm p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                    >
                      <Shield className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                      <span className="font-medium text-green-700 dark:text-green-300">
                        Thanh toán an toàn & bảo mật
                      </span>
                    </motion.div>
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 text-sm p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800"
                    >
                      <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0" />
                      <span className="font-medium text-yellow-700 dark:text-yellow-300">
                        Đánh giá 4.8/5 từ 10,000+ khách hàng
                      </span>
                    </motion.div>
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 text-sm p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
                    >
                      <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="font-medium text-blue-700 dark:text-blue-300">
                        Miễn phí đổi trả trong 7 ngày
                      </span>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground));
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary));
        }
      `}</style>
    </div>
  );
}