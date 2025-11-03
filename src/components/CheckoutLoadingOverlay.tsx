import { motion, AnimatePresence } from "framer-motion";
import { Check, CreditCard, Lock, Package, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

interface CheckoutLoadingOverlayProps {
  isVisible: boolean;
}

const CheckoutLoadingOverlay = ({ isVisible }: CheckoutLoadingOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const processingSteps = [
    { icon: ShoppingBag, text: "Đang xử lý đơn hàng...", color: "text-blue-500" },
    { icon: Lock, text: "Xác thực thanh toán...", color: "text-purple-500" },
    { icon: Package, text: "Chuẩn bị đơn hàng...", color: "text-orange-500" },
    { icon: Check, text: "Hoàn tất!", color: "text-green-500" }
  ];

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      return;
    }

    const stepDuration = 800;
    const timers: NodeJS.Timeout[] = [];

    processingSteps.forEach((_, index) => {
      const timer = setTimeout(() => {
        setCurrentStep(index);
      }, index * stepDuration);
      timers.push(timer);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [isVisible]);

  const CurrentIcon = processingSteps[currentStep]?.icon || ShoppingBag;
  const currentText = processingSteps[currentStep]?.text || "Đang xử lý...";
  const currentColor = processingSteps[currentStep]?.color || "text-blue-500";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md"
          style={{
            willChange: "opacity",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden opacity-40">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 180],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [180, 90, 0],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center space-y-8">
            {/* Animated Icon Container */}
            <div className="relative">
              {/* Outer Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 w-32 h-32 rounded-full border-4 border-transparent border-t-green-500 border-r-blue-500"
                style={{ willChange: "transform" }}
              />
              
              {/* Inner Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-2 w-28 h-28 rounded-full border-4 border-transparent border-b-green-500 border-l-blue-500"
                style={{ willChange: "transform" }}
              />

              {/* Icon */}
              <motion.div
                key={currentStep}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className={`w-32 h-32 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm ${currentColor}`}
              >
                <CurrentIcon className="w-16 h-16" strokeWidth={1.5} />
              </motion.div>
            </div>

            {/* Processing Steps */}
            <div className="flex flex-col items-center space-y-6">
              {/* Current Step Text */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {currentText}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Vui lòng đợi trong giây lát
                </p>
              </motion.div>

              {/* Progress Dots */}
              <div className="flex items-center gap-2">
                {processingSteps.map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.5, opacity: 0.3 }}
                    animate={{
                      scale: index === currentStep ? 1.2 : 0.8,
                      opacity: index <= currentStep ? 1 : 0.3,
                      backgroundColor: index <= currentStep 
                        ? "hsl(var(--primary))" 
                        : "hsl(var(--muted))",
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-2 h-2 rounded-full"
                  />
                ))}
              </div>

              {/* Security Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <Lock className="w-3 h-3" />
                <span>Giao dịch được bảo mật</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutLoadingOverlay;
