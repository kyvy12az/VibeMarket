import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function PaymentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const code = params.get("code") || "";
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!code) {
      setLoading(false);
      setSuccess(false);
      return;
    }

    const verify = async () => {
      try {
        // gọi API backend để xác thực giao dịch / trạng thái order bằng code
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment/vnpay/verify.php?code=${encodeURIComponent(code)}`, {
          credentials: "include"
        });
        const data = await res.json();
        if (data && data.success && data.paid) {
          setSuccess(true);
          toast.success("Thanh toán thành công");
        } else {
          setSuccess(false);
          toast.error("Thanh toán không thành công hoặc chưa xác nhận");
        }
      } catch (err) {
        console.error(err);
        setSuccess(false);
        toast.error("Lỗi khi kiểm tra giao dịch");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [code]);

  if (loading) return <div className="py-20 text-center">Đang kiểm tra giao dịch...</div>;

  return (
    <div className="container mx-auto py-12 text-center">
      {success ? (
        <>
          <h1 className="text-2xl font-bold">Thanh toán thành công</h1>
          <p className="mt-4">Mã đơn: {code}</p>
          <button className="btn mt-6" onClick={() => navigate("/")}>Quay về trang chủ</button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold">Thanh toán thất bại</h1>
          <p className="mt-4">Mã đơn: {code}</p>
          <button className="btn mt-6" onClick={() => navigate(-1)}>Quay lại</button>
        </>
      )}
    </div>
  );
}