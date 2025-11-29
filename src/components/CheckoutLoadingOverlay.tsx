import { motion, AnimatePresence } from "framer-motion";
import { Check, CreditCard, Lock, Package, ShoppingBag, Sparkles, Shield, Truck } from "lucide-react";
import { useEffect, useState } from "react";

interface CheckoutLoadingOverlayProps {
  isVisible: boolean;
}

const CheckoutLoadingOverlay = ({ isVisible }: CheckoutLoadingOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const processingSteps = [
    { icon: ShoppingBag, text: "Đang xử lý đơn hàng...", color: "from-blue-500 to-cyan-500", description: "Kiểm tra thông tin" },
    { icon: Shield, text: "Xác thực thanh toán...", color: "from-purple-500 to-pink-500", description: "Bảo mật giao dịch" },
    { icon: Package, text: "Chuẩn bị đơn hàng...", color: "from-orange-500 to-amber-500", description: "Đóng gói sản phẩm" },
    { icon: Check, text: "Hoàn tất!", color: "from-green-500 to-emerald-500", description: "Thành công" }
  ];

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      return;
    }

    const stepDuration = 1000;
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
  const currentColor = processingSteps[currentStep]?.color || "from-blue-500 to-cyan-500";
  const currentDescription = processingSteps[currentStep]?.description || "";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
          style={{
            willChange: "opacity",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* Enhanced Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Gradient Orbs */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                x: [0, 100, 0],
                y: [0, -50, 0],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/30 to-purple-600/30 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.3, 1, 1.3],
                x: [0, -100, 0],
                y: [0, 50, 0],
                opacity: [0.6, 0.4, 0.6],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl"
            />
            
            {/* Floating Particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -100, 0],
                  x: [0, Math.random() * 100 - 50, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                className="absolute w-1 h-1 bg-white/50 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center space-y-10 px-4">
            {/* Animated Icon Container */}
            <div className="relative">
              {/* Outer Rotating Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 w-40 h-40 rounded-full"
              >
                <div className={`w-full h-full rounded-full border-4 border-transparent border-t-primary border-r-purple-600`} />
              </motion.div>
              
              {/* Middle Rotating Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-3 w-34 h-34 rounded-full"
              >
                <div className="w-full h-full rounded-full border-4 border-transparent border-b-blue-500 border-l-cyan-500" />
              </motion.div>

              {/* Inner Pulsing Circle */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`absolute inset-6 rounded-full bg-gradient-to-br ${currentColor} opacity-20`}
              />

              {/* Icon with Glow Effect */}
              <motion.div
                key={currentStep}
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                className="relative w-40 h-40 flex items-center justify-center"
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(59, 130, 246, 0.5)',
                      '0 0 60px rgba(168, 85, 247, 0.8)',
                      '0 0 20px rgba(59, 130, 246, 0.5)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`w-28 h-28 flex items-center justify-center rounded-full bg-gradient-to-br ${currentColor} shadow-2xl`}
                >
                  <CurrentIcon className="w-14 h-14 text-white" strokeWidth={2} />
                </motion.div>
                
                {/* Sparkles around icon */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    style={{
                      top: `${50 + 45 * Math.sin((i * Math.PI) / 4)}%`,
                      left: `${50 + 45 * Math.cos((i * Math.PI) / 4)}%`,
                    }}
                  />
                ))}
              </motion.div>
            </div>

            {/* Processing Information */}
            <div className="flex flex-col items-center space-y-6 max-w-md">
              {/* Current Step Text */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center space-y-2"
              >
                <h3 className={`text-3xl font-bold bg-gradient-to-r ${currentColor} bg-clip-text text-transparent mb-2`}>
                  {currentText}
                </h3>
                <p className="text-base text-gray-300">
                  {currentDescription}
                </p>
                <p className="text-sm text-gray-500">
                  Vui lòng không tắt trang này
                </p>
              </motion.div>

              {/* Progress Bar */}
              <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  animate={{
                    width: `${((currentStep + 1) / processingSteps.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${currentColor} relative`}
                >
                  <motion.div
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </motion.div>
              </div>

              {/* Step Indicators */}
              <div className="flex items-center gap-4">
                {processingSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8, opacity: 0.3 }}
                      animate={{
                        scale: index === currentStep ? 1.2 : index < currentStep ? 1 : 0.8,
                        opacity: index <= currentStep ? 1 : 0.3,
                      }}
                      transition={{ duration: 0.3 }}
                      className="relative flex flex-col items-center gap-2"
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          index < currentStep
                            ? `bg-gradient-to-br ${step.color} shadow-lg`
                            : index === currentStep
                            ? `bg-gradient-to-br ${step.color} shadow-xl`
                            : 'bg-gray-800'
                        }`}
                      >
                        {index < currentStep ? (
                          <Check className="w-6 h-6 text-white" strokeWidth={2.5} />
                        ) : (
                          <StepIcon className="w-6 h-6 text-white" strokeWidth={2} />
                        )}
                      </div>
                      {index === currentStep && (
                        <motion.div
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                          className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color}`}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Security Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-full"
              >
                <Lock className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-300 font-medium">Giao dịch được bảo mật bởi SSL 256-bit</span>
                <Sparkles className="w-4 h-4 text-green-400" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutLoadingOverlay;
