import { useLocation, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const bearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (bearRef.current) {
        const bearRect = bearRef.current.getBoundingClientRect();
        const bearCenterX = bearRect.left + bearRect.width / 2;
        const bearCenterY = bearRect.top + bearRect.height / 2;
        
        setMousePosition({
          x: e.clientX - bearCenterX,
          y: e.clientY - bearCenterY
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Tính toán góc và khoảng cách để di chuyển mắt
  const calculateEyePosition = (maxMove: number = 8) => {
    const distance = Math.sqrt(mousePosition.x ** 2 + mousePosition.y ** 2);
    const maxDistance = 500; // Khoảng cách tối đa để mắt di chuyển hết cỡ
    const moveRatio = Math.min(distance / maxDistance, 1);
    
    const angle = Math.atan2(mousePosition.y, mousePosition.x);
    const moveX = Math.cos(angle) * maxMove * moveRatio;
    const moveY = Math.sin(angle) * maxMove * moveRatio;
    
    return { x: moveX, y: moveY };
  };

  const eyePosition = calculateEyePosition();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-card/80 to-accent/10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center bg-card/80 border border-border rounded-2xl shadow-2xl px-10 py-14 max-w-lg mx-auto backdrop-blur-md"
      >
        {/* Con gấu với mắt theo chuột */}
        <motion.div
          ref={bearRef}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex justify-center mb-8 relative"
        >
          {/* Đầu gấu */}
          <div className="relative w-40 h-40">
            {/* Tai trái */}
            <motion.div
              animate={{ rotate: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-4 left-6 w-16 h-16 bg-gradient-to-br from-amber-700 to-amber-800 rounded-full shadow-lg"
            />
            {/* Tai phải */}
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              className="absolute -top-4 right-6 w-16 h-16 bg-gradient-to-br from-amber-700 to-amber-800 rounded-full shadow-lg"
            />
            
            {/* Mặt gấu */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full shadow-2xl border-4 border-amber-800/30">
              {/* Mắt trái */}
              <div className="absolute top-12 left-8 w-10 h-12 bg-white rounded-full shadow-inner">
                <motion.div
                  animate={{
                    x: eyePosition.x,
                    y: eyePosition.y
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-2 left-2 w-5 h-5 bg-gradient-to-br from-gray-900 to-black rounded-full"
                >
                  <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-80" />
                </motion.div>
              </div>
              
              {/* Mắt phải */}
              <div className="absolute top-12 right-8 w-10 h-12 bg-white rounded-full shadow-inner">
                <motion.div
                  animate={{
                    x: eyePosition.x,
                    y: eyePosition.y
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-2 left-2 w-5 h-5 bg-gradient-to-br from-gray-900 to-black rounded-full"
                >
                  <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-80" />
                </motion.div>
              </div>
              
              {/* Mũi */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 w-8 h-6 bg-gradient-to-br from-gray-900 to-black rounded-full"
              />
              
              {/* Miệng */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-8">
                <motion.svg
                  animate={{ d: ["M 0 0 Q 8 8 16 0", "M 0 0 Q 8 4 16 0", "M 0 0 Q 8 8 16 0"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  width="64"
                  height="32"
                  viewBox="0 0 16 8"
                  className="fill-none stroke-gray-900 stroke-2"
                >
                  <path d="M 0 0 Q 8 8 16 0" />
                </motion.svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Số 404 */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl font-extrabold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4"
        >
          404
        </motion.div>

        {/* Tiêu đề */}
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          Không tìm thấy trang
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Oops! Đường dẫn bạn truy cập không tồn tại hoặc đã bị thay đổi.
        </p>

        {/* Nút quay về */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            Quay về trang chủ
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
