import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Loader,
  ArrowRight,
  ShoppingBag,
  CreditCard,
  Calendar,
  Building2,
  Receipt,
  Sparkles,
  Home,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-white p-4 font-inter relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-2xl w-full relative z-10">
        <AnimatePresence mode="wait">
          {/* Loading */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-white/50"
            >
              <motion.div
                className="relative mb-8 inline-block"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Loader className="h-12 w-12 text-white" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </motion.div>
              </motion.div>

              <motion.h2
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-4"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Đang xử lý thanh toán
              </motion.h2>

              <p className="text-gray-600 text-lg mb-8">
                Vui lòng đợi trong giây lát, chúng tôi đang xác thực giao dịch của bạn...
              </p>

              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    animate={{ y: [0, -10, 0], opacity: [1, 0.5, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-8 bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}

          {/* Success */}
          {!isLoading && success && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50"
            >
              {/* Success Header */}
              <div className="relative bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 p-8 md:p-10 text-center overflow-hidden">
                {/* Animated Background Elements */}
                <motion.div
                  className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.5, 1],
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                  animate={{
                    scale: [1.5, 1, 1.5],
                    x: [0, -50, 0],
                    y: [0, -30, 0],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                />

                <motion.div
                  className="relative inline-block mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
                    <CheckCircle className="w-14 h-14 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-8 h-8 text-yellow-300" />
                  </motion.div>
                </motion.div>

                <motion.h2
                  className="text-3xl md:text-4xl font-bold text-white mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {success}
                </motion.h2>
                <motion.p
                  className="text-pink-100 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Cảm ơn bạn đã mua sắm tại{" "}
                  <span className="font-bold text-white">VibeMarket</span>
                </motion.p>
              </div>

              {/* Payment Details */}
              <div className="p-6 md:p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-purple-50 via-pink-50 to-white rounded-2xl p-6 mb-6 border border-purple-100 shadow-lg"
                >
                  <div className="flex items-center mb-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                      <Receipt className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Chi tiết giao dịch
                    </h3>
                  </div>

                  {paymentInfo.orderCode && (
                    <div className="space-y-4">
                      {/* Order Code */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-purple-600" />
                          </div>
                          <span className="text-gray-700 font-medium">Mã đơn hàng</span>
                        </div>
                        <span className="font-bold text-purple-600 bg-purple-50 px-4 py-2 rounded-lg text-sm">
                          #{paymentInfo.orderCode}
                        </span>
                      </motion.div>

                      {/* Transaction No */}
                      {paymentInfo.transactionNo && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 }}
                          className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-fuchsia-100 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-fuchsia-600" />
                            </div>
                            <span className="text-gray-700 font-medium">Mã giao dịch</span>
                          </div>
                          <span className="font-bold text-fuchsia-600 bg-fuchsia-50 px-4 py-2 rounded-lg text-sm">
                            {paymentInfo.transactionNo}
                          </span>
                        </motion.div>
                      )}

                      {/* Amount */}
                      {paymentInfo.amount && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 }}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl shadow-sm border-2 border-pink-200"
                        >
                          <span className="text-gray-700 font-semibold text-lg">
                            Số tiền thanh toán
                          </span>
                          <span className="font-bold text-3xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            {formatPrice(paymentInfo.amount)}
                          </span>
                        </motion.div>
                      )}

                      {/* Bank Code */}
                      {paymentInfo.bankCode && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 }}
                          className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-gray-700 font-medium">Ngân hàng</span>
                          </div>
                          <span className="font-bold text-blue-600 uppercase">
                            {paymentInfo.bankCode}
                          </span>
                        </motion.div>
                      )}

                      {/* Pay Date */}
                      {paymentInfo.payDate && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 }}
                          className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-gray-700 font-medium">Thời gian</span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {paymentInfo.payDate}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="text-center space-y-4"
                >
                  <div className="flex items-center justify-center text-sm text-gray-500 mb-4 gap-2">
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Tự động chuyển hướng sau 5 giây
                    </motion.div>
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  <motion.button
                    onClick={() => navigate("/orders", { replace: true })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Xem đơn hàng ngay
                    </span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50"
            >
              {/* Error Header */}
              <div className="relative bg-gradient-to-br from-red-500 via-orange-500 to-pink-500 p-8 md:p-10 text-center overflow-hidden">
                {/* Animated Background */}
                <motion.div
                  className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.5, 1],
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                />

                <motion.div
                  className="relative inline-block mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
                    <XCircle className="w-14 h-14 text-white" />
                  </div>
                  <motion.div
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-2xl">⚠️</span>
                  </motion.div>
                </motion.div>

                <motion.h2
                  className="text-3xl md:text-4xl font-bold text-white mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Thanh toán thất bại
                </motion.h2>
                <motion.p
                  className="text-orange-100 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Đã có lỗi xảy ra trong quá trình thanh toán
                </motion.p>
              </div>

              {/* Error Details */}
              <div className="p-6 md:p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 mb-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-red-900 mb-1">Lỗi thanh toán</h3>
                      <p className="text-red-700 font-medium">{error}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6"
                >
                  <div className="flex items-start gap-3 text-sm text-blue-800">
                    <div className="text-lg">💡</div>
                    <div>
                      <p className="font-semibold mb-1">Gợi ý khắc phục:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-700">
                        <li>Kiểm tra lại số dư tài khoản</li>
                        <li>Đảm bảo thông tin thanh toán chính xác</li>
                        <li>Thử lại với phương thức thanh toán khác</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center justify-center text-sm text-gray-500 mb-6 gap-2"
                >
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Tự động chuyển hướng sau 5 giây
                  </motion.div>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-3"
                >
                  <motion.button
                    onClick={() => navigate("/checkout", { replace: true })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Thử lại thanh toán
                    </span>
                  </motion.button>

                  <motion.button
                    onClick={() => navigate("/", { replace: true })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all border-2 border-gray-200 hover:border-gray-300"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Home className="w-5 h-5" />
                      Về trang chủ
                    </span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VnpayCallBack;