import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { verifyPayment } from '../api/payment/vnpay';

const useVnpay = (code: string) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await verifyPayment(code);
        if (res.success && res.paid) {
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

    if (code) {
      verify();
    } else {
      setLoading(false);
      setSuccess(false);
    }
  }, [code]);

  return { loading, success };
};

export default useVnpay;