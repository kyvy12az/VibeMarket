import { motion, AnimatePresence } from "framer-motion";
import { Package, Upload, CheckCircle2, Sparkles } from "lucide-react";

interface AddProductLoadingOverlayProps {
  isVisible: boolean;
}

export const AddProductLoadingOverlay = ({ isVisible }: AddProductLoadingOverlayProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md"
          style={{ willChange: "opacity" }}
        >
          {/* Animated gradient orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
            />
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center gap-8 max-w-md mx-auto px-4">
            {/* Product icon with animation */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
              />
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="w-10 h-10 text-primary-foreground" />
              </div>
            </motion.div>

            {/* Loading text */}
            <div className="text-center space-y-3">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
              >
                Đang tạo sản phẩm
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground"
              >
                Vui lòng chờ trong giây lát...
              </motion.p>
            </div>

            {/* Progress steps */}
            <div className="w-full max-w-xs space-y-3">
              {[
                { icon: Package, label: "Xử lý thông tin", delay: 0 },
                { icon: Upload, label: "Tải hình ảnh", delay: 0.8 },
                { icon: Sparkles, label: "Tối ưu SEO", delay: 1.6 },
                { icon: CheckCircle2, label: "Hoàn thành", delay: 2.4 }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: step.delay, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      delay: step.delay,
                      duration: 0.6,
                      ease: "easeInOut"
                    }}
                    className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
                  >
                    <step.icon className="w-4 h-4 text-primary" />
                  </motion.div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: step.delay + 0.3, duration: 0.5 }}
                    className="h-1 bg-gradient-to-r from-primary to-accent rounded-full"
                  />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: step.delay + 0.2 }}
                    className="text-sm text-muted-foreground whitespace-nowrap"
                  >
                    {step.label}
                  </motion.span>
                </motion.div>
              ))}
            </div>

            {/* Animated dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
              ))}
            </div>

            {/* Success message */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3 }}
              className="flex items-center gap-2 text-success"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Sản phẩm đã được tạo thành công!</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
