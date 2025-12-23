import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Users, Zap, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutHero() {
  // Hiệu ứng Parallax nhẹ khi cuộn
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -50]);
  const y2 = useTransform(scrollY, [0, 500], [0, 50]);
  return (
    <section className="relative min-h-[90vh] flex items-center py-16 px-4 sm:px-6 overflow-hidden">
      {/* 1. Nền Mesh Gradient & Noise Texture */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(2,6,23,1)_100%)]" />

        {/* Animated Aurora */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-primary/20 rounded-[40%_60%_70%_30%] blur-[120px] opacity-50"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -45, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-accent/20 rounded-[30%_70%_40%_60%] blur-[120px] opacity-50"
        />

        {/* Subtle Noise Texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* Grid Dots */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.05]" />
      </div>

      <div className="container mx-auto max-w-7xl relative">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* CỘT TRÁI: NỘI DUNG */}
          <div className="relative z-10">
            {/* Badge hiện đại */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-400">
                Khát vọng vươn tầm Việt
              </span>
            </motion.div>

            {/* Heading với Text-Clipping Gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8"
            >
              <span className="block text-white">Định hình</span>
              <span className="block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent italic">
                Vibe Việt.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-zinc-400 leading-relaxed max-w-lg mb-10"
            >
              VibeMarket không chỉ là nền tảng thương mại, mà là cầu nối văn hóa sáng tạo,
              nơi mỗi Local Brand kể câu chuyện bản sắc qua ngôn ngữ thời trang hiện đại.
            </motion.p>

            {/* CTA với hiệu ứng Glow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-5"
            >
              <Button size="xl" className="relative group overflow-hidden rounded-full bg-white text-black hover:bg-white/90 px-10 h-14 font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <span className="relative z-10 flex items-center gap-2">
                  Bắt đầu ngay <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>

              <Button variant="ghost" className="rounded-full text-white hover:bg-white/5 h-14 px-8 border border-white/10 backdrop-blur-sm">
                Tìm hiểu thêm
              </Button>
            </motion.div>

            {/* Stats hiện đại kiểu Bento */}
            <div className="grid grid-cols-3 gap-4 mt-16">
              {[
                { label: "Partner Brands", value: "500+", icon: ShieldCheck },
                { label: "Community", value: "100K", icon: Users },
                { label: "Success Rate", value: "98%", icon: Star },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors"
                >
                  <stat.icon className="w-5 h-5 text-primary mb-3" />
                  <div className="text-xl font-bold text-white leading-none">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CỘT PHẢI: VISUAL COMPOSITION */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            {/* Main Image Frame */}
            <motion.div
              style={{ y: y1 }}
              className="relative z-20 w-[80%] aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
            >
              <img
                src="/images/about-main.jpg"
                alt="Brand Vibe"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
            </motion.div>

            {/* Floating Card 1: Experience */}
            <motion.div
              style={{ y: y2 }}
              className="absolute -right-4 top-20 z-30 p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl max-w-[200px]"
            >
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-bold text-white leading-snug">
                  Trải nghiệm mua sắm thế hệ mới
                </p>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-zinc-700" />
                  ))}
                  <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-primary flex items-center justify-center text-[8px] font-bold text-white">+12k</div>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 2: Quality */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -left-10 bottom-20 z-30 px-6 py-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-primary/30 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl font-black text-white italic">100%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Cam kết<br />Chính hãng
                </div>
              </div>
            </motion.div>

            {/* Abstract Decorative Circles */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center">
              <div className="w-[120%] h-[120%] border border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute w-[90%] h-[90%] border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}