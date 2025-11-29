import { motion } from "framer-motion";
import { HeartHandshake, Sparkles, ArrowRight, Users, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutHero() {
  return (
    <section className="relative py-8 px-4 sm:px-6 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--primary),0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(var(--accent),0.15),transparent_50%)]" />
        
        {/* Animated orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-tr from-primary/30 via-accent/30 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.45, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ willChange: 'transform, opacity' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-gradient-to-tl from-accent/40 via-primary/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.5, 0.4],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: [0.22, 1, 0.36, 1],
            delay: 1,
          }}
          style={{ willChange: 'transform, opacity' }}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary),0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
      </div>

      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 backdrop-blur-sm shadow-lg"
              style={{ willChange: 'transform, opacity' }}
            >
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Về VibeMarket
              </span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
              >
                <span className="block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Kết nối
                </span>
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mt-2">
                  Thương hiệu Việt
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-1.5 w-24 bg-gradient-to-r from-primary to-accent rounded-full"
              />
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl"
            >
              Nơi kết nối đam mê thời trang Việt với cộng đồng sáng tạo, 
              giúp thương hiệu địa phương tỏa sáng và lan tỏa phong cách riêng.
            </motion.p>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-3 gap-4 pt-6"
            >
              {[
                { icon: Users, label: "10K+", sublabel: "Người dùng" },
                { icon: TrendingUp, label: "500+", sublabel: "Thương hiệu" },
                { icon: Zap, label: "50K+", sublabel: "Sản phẩm" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="group relative p-4 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                >
                  <stat.icon className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.label}
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.sublabel}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Khám phá ngay
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 hover:border-primary hover:bg-primary/5 group"
              >
                <HeartHandshake className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Tham gia cộng đồng
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="relative"
          >
            {/* Main Image Container */}
            <div className="relative group">
              {/* Decorative elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Image card */}
              <div className="relative rounded-3xl overflow-hidden border border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
                
                <motion.img
                  src="/images/about-illustration.png"
                  alt="VibeMarket Illustration"
                  className="relative w-full h-auto object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Floating cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute -bottom-6 -left-6 p-4 rounded-2xl bg-card/90 backdrop-blur-md border border-border/50 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Thương hiệu uy tín</div>
                    <div className="text-xs text-muted-foreground">100% chính hãng</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="absolute -top-6 -right-6 p-4 rounded-2xl bg-card/90 backdrop-blur-md border border-border/50 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Tăng trưởng nhanh</div>
                    <div className="text-xs text-muted-foreground">+150% năm 2024</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative dots */}
            <div className="absolute -z-10 -top-8 -right-8 w-32 h-32 opacity-20">
              <div className="grid grid-cols-4 gap-3">
                {[...Array(16)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.3, scale: 1 }}
                    transition={{ delay: 1 + i * 0.05, duration: 0.3 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}