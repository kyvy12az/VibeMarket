import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const MomoCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Lấy các tham số từ URL callback của MoMo
    const params = new URLSearchParams(location.search);
    const resultCode = params.get("resultCode");
    const orderId = params.get("orderId");
    const message = params.get("message");

    if (resultCode === "0") {
      toast({
        title: "Thanh toán thành công!",
        description: `Đơn hàng #${orderId} đã được thanh toán qua MoMo.`,
        variant: "success",
      });
      // Có thể chuyển hướng về trang đơn hàng hoặc trang chủ
      setTimeout(() => navigate("/orders"), 2000);
    } else {
      toast({
        title: "Thanh toán thất bại!",
        description: message || "Có lỗi xảy ra khi thanh toán qua MoMo.",
        variant: "destructive",
      });
      setTimeout(() => navigate("/checkout"), 2500);
    }
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-2xl font-bold mb-4">Đang xử lý kết quả thanh toán MoMo...</div>
      <div className="text-muted-foreground">Vui lòng chờ trong giây lát.</div>
    </div>
  );
};

export default MomoCallback;