import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Package, Home, Clock, CreditCard, Receipt } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

interface OrderData {
  code: string;
  payment_status: string;
  status: string;
  total: number;
}

interface TransactionData {
  app_trans_id: string;
  status: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

type PaymentMethod = "zalopay" | "momo" | "vnpay";

export default function PayCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [orderCode, setOrderCode] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [countdown, setCountdown] = useState<number>(5);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("zalopay");
  
  // Thông tin giao dịch chi tiết
  const [transactionInfo, setTransactionInfo] = useState<{
    orderId: string;
    amount: string;
    transId: string;
    orderInfo: string;
    payType: string;
    responseTime: string;
    bankCode?: string;
  }>({
    orderId: "",
    amount: "0",
    transId: "",
    orderInfo: "",
    payType: "",
    responseTime: "",
  });

  useEffect(() => {
    // Xác định payment method từ URL path
    const path = window.location.pathname;
    if (path.includes("zalopay")) {
      setPaymentMethod("zalopay");
      handleZaloPayCallback();
    } else if (path.includes("momo")) {
      setPaymentMethod("momo");
      handleMomoCallback();
    } else if (path.includes("vnpay")) {
      setPaymentMethod("vnpay");
      handleVnpayCallback();
    }
  }, [searchParams]);

  // Countdown effect - chỉ chạy khi thanh toán thành công
  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === "success" && countdown === 0) {
      navigate("/orders");
    }
  }, [status, countdown, navigate]);

  const handleZaloPayCallback = async () => {
    const appTransId = searchParams.get("apptransid");
    const statusParam = searchParams.get("status");

    if (!appTransId) {
      setStatus("failed");
      setMessage("Không tìm thấy thông tin giao dịch");
      return;
    }

    const parts = appTransId.split("_");
    const code = parts[1] || "";
    setOrderCode(code);

    if (statusParam === "1") {
      setStatus("success");
      setMessage(`Thanh toán đơn hàng #${code} thành công!`);
      await verifyZaloPayPayment(appTransId);
    } else {
      setStatus("failed");
      setMessage("Thanh toán không thành công. Vui lòng thử lại!");
    }
  };

  const handleMomoCallback = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const resultCode = params.get("resultCode");
      const orderId = params.get("orderId");
      const message = params.get("message");
      const amount = params.get("amount");
      const orderInfo = params.get("orderInfo");
      const transId = params.get("transId");
      const payType = params.get("payType");
      const responseTime = params.get("responseTime");

      setOrderCode(orderId || "");
      setTransactionInfo({
        orderId: orderId || "",
        amount: amount || "0",
        transId: transId || "",
        orderInfo: orderInfo || "",
        payType: payType || "",
        responseTime: responseTime || "",
      });

      const token = localStorage.getItem("vibeventure_token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/momo/callback.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            partnerCode: params.get("partnerCode"),
            orderId,
            requestId: params.get("requestId"),
            amount,
            orderInfo,
            orderType: params.get("orderType"),
            transId,
            resultCode,
            message,
            payType,
            responseTime,
            extraData: params.get("extraData"),
            signature: params.get("signature"),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API trả về lỗi: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage("Thanh toán thành công!");
        toast({
          title: "Thanh toán thành công!",
          description: `Đơn hàng #${orderId} đã được thanh toán qua MoMo.`,
        });
      } else {
        setStatus("failed");
        setMessage(data.message || message || "Thanh toán thất bại!");
        toast({
          title: "Thanh toán thất bại!",
          description: data.message || message || "Có lỗi xảy ra khi thanh toán qua MoMo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error processing MoMo callback:", error);
      setStatus("failed");
      setMessage("Không thể kết nối máy chủ. Vui lòng kiểm tra lại đơn hàng.");
      toast({
        title: "Lỗi xử lý thanh toán!",
        description: "Không thể kết nối máy chủ. Vui lòng kiểm tra lại đơn hàng.",
        variant: "destructive",
      });
    }
  };

  const handleVnpayCallback = () => {
    const txnRef = searchParams.get("vnp_TxnRef");
    const statusParam = searchParams.get("status");
    const amount = searchParams.get("amount");
    const bankCode = searchParams.get("bank");
    const payDate = searchParams.get("payDate");
    const transactionNo = searchParams.get("transactionNo");

    if (!txnRef || !statusParam) {
      setStatus("failed");
      setMessage("Thông tin giao dịch không hợp lệ.");
      return;
    }

    setOrderCode(txnRef);
    setTransactionInfo({
      orderId: txnRef,
      transId: transactionNo || "",
      amount: amount || "0",
      bankCode: bankCode || "",
      payType: "VNPay",
      responseTime: payDate || "",
      orderInfo: `Thanh toán đơn hàng #${txnRef}`,
    });

    if (statusParam === "success") {
      setStatus("success");
      setMessage("Thanh toán thành công!");
    } else {
      setStatus("failed");
      setMessage("Thanh toán không thành công.");
    }
  };

  const verifyZaloPayPayment = async (appTransId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/zalopay/verify.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("vibeventure_token") || ""}`,
          },
          body: JSON.stringify({
            app_trans_id: appTransId,
            update_status: true,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        if (data.order) {
          setOrderData(data.order);
        }
        if (data.transaction) {
          setTransactionData(data.transaction);
        }
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === "string" ? parseInt(amount) : amount;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numAmount);
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "";
    
    // Nếu là timestamp (responseTime của MoMo/VNPay)
    if (/^\d+$/.test(dateString)) {
      const date = new Date(parseInt(dateString));
      return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }
    
    // Nếu là datetime string (created_at của ZaloPay)
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getPaymentStatusText = (paymentStatus: string) => {
    const statusMap: Record<string, string> = {
      pending: "Chờ thanh toán",
      paid: "Đã thanh toán",
      failed: "Thanh toán thất bại",
    };
    return statusMap[paymentStatus] || paymentStatus;
  };

  const getOrderStatusText = (orderStatus: string) => {
    const statusMap: Record<string, string> = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      processing: "Đang xử lý",
      shipping: "Đang giao hàng",
      delivered: "Đã giao hàng",
      cancelled: "Đã hủy",
    };
    return statusMap[orderStatus] || orderStatus;
  };

  const getPaymentMethodName = (payType: string) => {
    const methods: Record<string, string> = {
      qr: "Quét mã QR",
      napas: "Thẻ ATM nội địa",
      credit: "Thẻ tín dụng/ghi nợ quốc tế",
      momo_wallet: "Ví MoMo",
      VNPay: "VNPay",
    };
    return methods[payType] || payType || "ZaloPay";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8">
          {status === "loading" && (
            <div className="text-center">
              <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
              <h3 className="text-xl font-semibold mb-2">Đang xử lý thanh toán...</h3>
              <p className="text-muted-foreground">Vui lòng đợi trong giây lát</p>
            </div>
          )}

          {status === "success" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-center mb-6"
              >
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-2xl font-semibold mb-2 text-green-600">
                  Thanh toán thành công!
                </h3>
                <p className="text-muted-foreground">{message}</p>
              </motion.div>

              {/* Countdown Timer */}
              <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-4 mb-6 border border-primary/20">
                <div className="flex items-center justify-center gap-3">
                  <Clock className="w-5 h-5 text-primary animate-pulse" />
                  <span className="text-sm font-medium">
                    Tự động chuyển đến trang đơn hàng sau {countdown} giây...
                  </span>
                </div>
              </div>

              {/* Order Information */}
              <div className="space-y-4 mb-6">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Thông tin đơn hàng
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Mã đơn hàng:</span>
                      <span className="font-mono font-semibold">#{orderCode}</span>
                    </div>
                    
                    {paymentMethod === "zalopay" && orderData && (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Tổng tiền:</span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(orderData.total)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Trạng thái thanh toán:</span>
                          <span
                            className={`font-semibold ${
                              orderData.payment_status === "paid"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {getPaymentStatusText(orderData.payment_status)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Trạng thái đơn hàng:</span>
                          <span className="font-semibold">
                            {getOrderStatusText(orderData.status)}
                          </span>
                        </div>
                      </>
                    )}

                    {(paymentMethod === "momo" || paymentMethod === "vnpay") && (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Thông tin đơn hàng:</span>
                          <span className="font-medium">{transactionInfo.orderInfo}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Số tiền:</span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(transactionInfo.amount)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Transaction Information */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Thông tin giao dịch
                  </h4>
                  <div className="space-y-2">
                    {paymentMethod === "zalopay" && transactionData && (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Mã giao dịch:</span>
                          <span className="font-mono text-xs">
                            {transactionData.app_trans_id}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Số tiền:</span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(transactionData.amount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Trạng thái:</span>
                          <span
                            className={`font-semibold ${
                              transactionData.status === "success"
                                ? "text-green-600"
                                : transactionData.status === "pending"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {transactionData.status === "success"
                              ? "Thành công"
                              : transactionData.status === "pending"
                              ? "Đang xử lý"
                              : "Thất bại"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Thời gian tạo:</span>
                          <span className="text-xs">
                            {formatDateTime(transactionData.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Cập nhật lúc:</span>
                          <span className="text-xs">
                            {formatDateTime(transactionData.updated_at)}
                          </span>
                        </div>
                      </>
                    )}

                    {(paymentMethod === "momo" || paymentMethod === "vnpay") && (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Phương thức:</span>
                          <span className="font-medium">
                            {getPaymentMethodName(transactionInfo.payType)}
                          </span>
                        </div>
                        {transactionInfo.transId && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Mã giao dịch:</span>
                            <span className="font-mono text-sm">
                              {transactionInfo.transId}
                            </span>
                          </div>
                        )}
                        {transactionInfo.bankCode && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Ngân hàng:</span>
                            <span className="font-medium uppercase">
                              {transactionInfo.bankCode}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Thời gian
                          </span>
                          <span className="text-sm">
                            {formatDateTime(transactionInfo.responseTime)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => navigate("/orders")}
                  className="w-full bg-gradient-to-r from-primary to-purple-600"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Xem đơn hàng ngay
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Tiếp tục mua sắm
                </Button>
              </div>
            </>
          )}

          {status === "failed" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-center mb-6"
              >
                <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                <h3 className="text-2xl font-semibold mb-2 text-red-600">
                  Thanh toán thất bại!
                </h3>
                <p className="text-muted-foreground">{message}</p>
              </motion.div>

              {orderCode && (
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Mã đơn hàng:</span>
                    <span className="font-mono font-semibold">#{orderCode}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                {orderCode && (
                  <Button
                    onClick={() => navigate(`/checkout?retry=${orderCode}`)}
                    className="w-full bg-gradient-to-r from-primary to-purple-600"
                  >
                    Thử lại thanh toán
                  </Button>
                )}
                <Button
                  onClick={() => navigate("/orders")}
                  variant="outline"
                  className="w-full"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Danh sách đơn hàng
                </Button>
                <Button onClick={() => navigate("/")} variant="ghost" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Về trang chủ
                </Button>
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
