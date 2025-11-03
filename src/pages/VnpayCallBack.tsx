import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Loader,
  ArrowRight,
  ShoppingBag,
  CreditCard,
} from "lucide-react";

const VnpayCallBack = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<{
    orderCode?: string;
    transactionNo?: string;
    amount?: string;
    bankCode?: string;
    payDate?: string;
  }>({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const txnRef = urlParams.get("vnp_TxnRef");
    const status = urlParams.get("status");
    const amount = urlParams.get("amount");
    const bankCode = urlParams.get("bank");
    const payDate = urlParams.get("payDate");
    const transactionNo = urlParams.get("transactionNo");

    if (!txnRef || !status) {
      setError("Thông tin giao dịch không hợp lệ.");
      setIsLoading(false);
      setTimeout(() => {
        navigate("/checkout", { replace: true });
      }, 5000);
      return;
    }

    setPaymentInfo({
      orderCode: txnRef,
      transactionNo: transactionNo || "",
      amount: amount || "",
      bankCode: bankCode || "",
      payDate: payDate || "",
    });

    if (status === "success") {
      setSuccess("Thanh toán thành công!");
      setIsLoading(false);
      setTimeout(() => {
        navigate("/orders", { replace: true });
      }, 5000);
    } else {
      setError("Thanh toán không thành công.");
      setIsLoading(false);
      setTimeout(() => {
        navigate("/checkout", { replace: true });
      }, 5000);
    }
  }, [navigate]);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("vi-VN").format(parseInt(price)) + "đ";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-100 font-inter">
      <div className="max-w-lg w-full">
        {/* Loading */}
        {isLoading && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-fuchsia-200/40">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Loader className="animate-spin h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-fuchsia-500 rounded-full flex items-center justify-center shadow">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent mb-3">
              Đang xử lý thanh toán
            </h2>
            <p className="text-gray-600 mb-6">
              Vui lòng đợi trong giây lát, chúng tôi đang xác thực giao dịch của bạn...
            </p>
            <div className="flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Success */}
        {!isLoading && success && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-fuchsia-200/40">
            <div className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 p-6 text-center">
              <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{success}</h2>
              <p className="text-pink-100">
                Cảm ơn bạn đã mua sắm tại <span className="font-bold">VibeMarket</span>
              </p>
            </div>

            <div className="p-6">
              <div className="bg-gradient-to-r from-gray-50 to-pink-50 rounded-xl p-4 mb-6 border border-pink-100">
                <div className="flex items-center mb-3">
                  <ShoppingBag className="w-5 h-5 text-fuchsia-500 mr-2" />
                  <span className="font-semibold text-gray-900">Chi tiết giao dịch</span>
                </div>

                {paymentInfo.orderCode && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <span className="text-gray-600 font-medium">Mã đơn hàng</span>
                      <span className="font-bold text-fuchsia-500 bg-pink-100 px-3 py-1 rounded-full text-sm">
                        {paymentInfo.orderCode}
                      </span>
                    </div>
                    {paymentInfo.transactionNo && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                        <span className="text-gray-600 font-medium">Mã giao dịch</span>
                        <span className="font-bold text-fuchsia-600 bg-purple-100 px-3 py-1 rounded-full text-sm">
                          {paymentInfo.transactionNo}
                        </span>
                      </div>
                    )}
                    {paymentInfo.amount && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium">Số tiền thanh toán</span>
                        <span className="font-bold text-2xl text-pink-600">
                          {formatPrice(paymentInfo.amount)}
                        </span>
                      </div>
                    )}
                    {paymentInfo.bankCode && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium">Ngân hàng</span>
                        <span className="font-bold text-fuchsia-600">
                          {paymentInfo.bankCode}
                        </span>
                      </div>
                    )}
                    {paymentInfo.payDate && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium">Thời gian thanh toán</span>
                        <span className="font-bold text-gray-900">{paymentInfo.payDate}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                  <span>Bạn sẽ được chuyển đến trang đơn hàng trong 5 giây</span>
                  <ArrowRight className="w-4 h-4 ml-2 animate-pulse" />
                </div>

                <button
                  onClick={() => navigate("/orders", { replace: true })}
                  className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:opacity-90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Xem đơn hàng ngay
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-red-200/50">
            <div className="bg-gradient-to-r from-red-500 via-fuchsia-500 to-pink-500 p-6 text-center">
              <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow">
                <XCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Thanh toán thất bại</h2>
              <p className="text-pink-100">Đã có lỗi xảy ra trong quá trình thanh toán</p>
            </div>

            <div className="p-6 text-center">
              <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-6">
                <p className="text-red-700 font-medium">{error}</p>
              </div>

              <div className="flex items-center justify-center text-sm text-gray-500 mb-6">
                <span>Bạn sẽ được chuyển về trang thanh toán trong 3 giây</span>
                <ArrowRight className="w-4 h-4 ml-2 animate-pulse" />
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/checkout", { replace: true })}
                  className="w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:opacity-90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Thử lại thanh toán
                </button>
                <button
                  onClick={() => navigate("/", { replace: true })}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Về trang chủ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default VnpayCallBack;