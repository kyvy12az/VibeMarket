import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const PayosCallBack = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Lấy các tham số từ URL callback của PayOS
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const orderCode = params.get("orderCode");
    const message = params.get("message");
    const amount = params.get("amount");
    const transId = params.get("transId");
    const cancelUrl = params.get("cancelUrl");
    const description = params.get("description");
    const returnUrl = params.get("returnUrl");
    const signature = params.get("signature");

    // Gửi callback về BE để cập nhật trạng thái đơn hàng
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment/payos/callback.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: code || "",
        orderCode: orderCode || "",
        message: message || "",
        amount: amount || "",
        transId: transId || "",
        cancelUrl: cancelUrl || "",
        description: description || "",
        returnUrl: returnUrl || "",
        signature: signature || "",
      }).toString(),
    });

    if (code === "00") {
      toast({
        title: "Thanh toán thành công!",
        description: `Đơn hàng #${orderCode} đã được thanh toán qua PayOS.`,
        variant: "success",
      });
      setTimeout(() => navigate("/orders"), 2000);
    } else {
      toast({
        title: "Thanh toán thất bại!",
        description: message || "Có lỗi xảy ra khi thanh toán qua PayOS.",
        variant: "destructive",
      });
      setTimeout(() => navigate("/checkout"), 2500);
    }
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-2xl font-bold mb-4">Đang xử lý kết quả thanh toán PayOS...</div>
      <div className="text-muted-foreground">Vui lòng chờ trong giây lát.</div>
    </div>
  );
};

export default PayosCallBack;