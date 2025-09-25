import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-card/80 to-accent/10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center bg-card/80 border border-border rounded-2xl shadow-2xl px-10 py-14 max-w-lg mx-auto backdrop-blur-md"
      >
        {/* Icon cảnh báo */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex justify-center mb-6"
        >
          <AlertTriangle className="w-16 h-16 text-destructive drop-shadow-md" />
        </motion.div>

        {/* Số 404 */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4"
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
            className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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
