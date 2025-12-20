import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useUIStore } from "../store/uiStore";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isCommentModalOpen = useUIStore((state) => state.isCommentModalOpen);
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && !isCommentModalOpen && (
        <motion.button
          className="fixed bottom-6 left-6 md:bottom-8 md:left-10 bg-gradient-to-r from-primary to-purple-600 hover:from-primary hover:to-purple-700 text-white w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-green-500/25 backdrop-blur-sm z-50 rounded-xl"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.5 }}
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
