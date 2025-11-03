import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const LoadingOverlay = () => {
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Các đường dẫn không cần overlay (thêm cả prefix /vendor-management)
        const excludedExact = ["/", "/callback/zalo", "/callback/google", "/callback/facebook", "/callback/vnpay"];
        const isVendorArea = location.pathname.startsWith("/vendor-management/");
        if (excludedExact.includes(location.pathname) || isVendorArea) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 600);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-background/100 backdrop-blur-lg"
                >
                    {/* Gradient Background Orbs */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 180, 360],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
                        />
                        <motion.div
                            animate={{
                                scale: [1.2, 1, 1.2],
                                rotate: [360, 180, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
                        />
                    </div>

                    {/* Loading Content */}
                    <div className="relative z-10 flex flex-col items-center space-y-6">
                        {/* Logo với animation */}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="w-20 h-20 bg-background rounded-2xl flex items-center justify-center shadow-2xl"
                        >
                            {/* <span className="text-white font-bold text-3xl">V</span> */}
                            <img src="/logo.png" alt="Logo VibeMarket" />
                        </motion.div>

                        {/* Spinning Ring Loader */}
                        <div className="relative w-16 h-16">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="absolute inset-0 border-4 border-transparent border-t-primary border-r-accent rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="absolute inset-2 border-4 border-transparent border-b-primary border-l-accent rounded-full"
                            />
                        </div>

                        {/* Progress Bar */}
                        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="h-full w-1/2 bg-gradient-hero"
                            />
                        </div>

                        {/* Loading Text */}
                        <motion.p
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="text-sm text-muted-foreground font-medium"
                        >
                            Đang tải...
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingOverlay;
