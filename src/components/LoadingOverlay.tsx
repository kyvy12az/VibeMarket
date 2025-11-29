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
                    <div className="relative z-10 flex flex-col items-center space-y-8">
                        {/* Logo với animation chuyên nghiệp */}
                        <div className="relative">
                            {/* Outer glow ring */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="absolute inset-0 w-24 h-24 -translate-x-2 -translate-y-2 bg-gradient-to-br from-purple-500/30 via-violet-500/30 to-fuchsia-500/30 rounded-full blur-2xl"
                            />
                            
                            {/* Spinning ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="absolute inset-0 w-20 h-20 rounded-full"
                                style={{
                                    background: "conic-gradient(from 0deg, transparent 0%, hsl(var(--primary)) 50%, transparent 100%)",
                                }}
                            />

                            {/* Logo container */}
                            <motion.div
                                animate={{
                                    y: [0, -8, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="relative"
                            >
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-accent to-emerald-600 p-0.5 shadow-2xl shadow-primary/40">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                                        <motion.img 
                                            src="/logo-2.png" 
                                            alt="VibeMarket Logo"
                                            className="w-12 h-12 object-contain"
                                            animate={{
                                                scale: [1, 1.1, 1],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                const container = e.currentTarget.parentElement;
                                                if (container) {
                                                    container.classList.remove('bg-white', 'dark:bg-gray-900');
                                                    container.classList.add('bg-gradient-to-br', 'from-primary', 'via-accent', 'to-emerald-600');
                                                    const fallback = document.createElement('span');
                                                    fallback.className = 'text-white font-black text-3xl';
                                                    fallback.textContent = 'V';
                                                    container.appendChild(fallback);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Brand name */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center -space-y-1"
                        >
                            <span className="text-3xl font-black bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-600 bg-clip-text text-transparent tracking-tight">
                                VibeMarket
                            </span>
                            <span className="text-[10px] text-muted-foreground/60 font-bold tracking-[0.3em] uppercase">
                                Fashion & Lifestyle
                            </span>
                        </motion.div>

                        {/* Modern Progress Bar */}
                        <div className="w-72 space-y-3">
                            <div className="relative h-1.5 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-purple-600 to-transparent rounded-full"
                                    style={{
                                        boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)",
                                    }}
                                />
                            </div>
                            
                            {/* Loading dots */}
                            <div className="flex items-center justify-center space-x-2">
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
                                            ease: "easeInOut",
                                            delay: i * 0.2,
                                        }}
                                        className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-violet-500"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Loading Text */}
                        <motion.p
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="text-sm text-muted-foreground font-semibold tracking-wide"
                        >
                            Đang tải nội dung...
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingOverlay;
