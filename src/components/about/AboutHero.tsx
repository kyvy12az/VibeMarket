import { motion } from "framer-motion";
import { HeartHandshake, Sparkles } from "lucide-react";

export function AboutHero() {
  return (
    <section className="relative sm:pt-20 pt-10 sm:pb-24 pb-12 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Hiệu ứng ánh sáng gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-tr from-primary/30 via-accent/30 to-transparent rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-gradient-to-tl from-accent/40 via-primary/20 to-transparent rounded-full blur-3xl opacity-40 animate-pulse delay-300"></div>
      </div>

      <div className="container mx-auto max-w-6xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Tagline nhỏ */}
          <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 backdrop-blur-sm shadow-sm mb-5 sm:mb-6">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary animate-spin-slow" />
            <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Về chúng tôi
            </span>
          </div>

          {/* Tiêu đề chính */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-5 sm:mb-6 leading-tight bg-gradient-to-r from-primary via-accent to-indigo-500 bg-clip-text text-transparent drop-shadow-lg">
            VibeMarket
          </h1>

          {/* Mô tả */}
          <p className="text-base sm:text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium px-2">
            Nơi kết nối đam mê thời trang Việt với cộng đồng sáng tạo,
            giúp thương hiệu địa phương tỏa sáng và lan tỏa phong cách riêng.
          </p>

          {/* CTA nhỏ */}
          <div className="mt-8 sm:mt-10 flex justify-center">
            <div className="flex items-center gap-2 sm:gap-3 text-primary font-medium text-sm sm:text-base">
              <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              <span>Cùng xây dựng cộng đồng sáng tạo Việt</span>
            </div>
          </div>
        </motion.div>

        {/* Ảnh minh họa */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="mt-10 sm:mt-16"
        >
          <img
            src="/images/about-illustration.png"
            alt="VibeMarket Illustration"
            className="mx-auto rounded-2xl shadow-xl border border-border/50 w-full max-w-sm sm:max-w-2xl md:max-w-4xl object-cover hover:scale-[1.02] transition-transform duration-500"
          />
        </motion.div>
      </div>
    </section>

  );
}
