import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Users, Store, Package, Heart } from "lucide-react";
import { useEffect, useRef } from "react";

const statistics = [
  {
    value: 10000,
    suffix: "+",
    label: "Thành viên",
    icon: Users,
    color: "text-blue-500"
  },
  {
    value: 500,
    suffix: "+",
    label: "Local Brands",
    icon: Store,
    color: "text-purple-500"
  },
  {
    value: 50000,
    suffix: "+",
    label: "Sản phẩm",
    icon: Package,
    color: "text-green-500"
  },
  {
    value: 98,
    suffix: "%",
    label: "Khách hàng hài lòng",
    icon: Heart,
    color: "text-pink-500"
  }
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString();
      }
    });
  }, [springValue]);

  return (
    <span className="inline-block">
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

export function StatisticsCounter() {
  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Hiệu ứng ánh sáng động */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[5%] left-[10%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-gradient-to-tr from-primary/30 via-accent/20 to-transparent blur-[90px] sm:blur-[120px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[5%] right-[10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-bl from-accent/30 via-primary/10 to-transparent blur-[80px] sm:blur-[100px] opacity-30 animate-pulse delay-300" />
      </div>

      <div className="container mx-auto max-w-7xl">
        {/* Tiêu đề */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-accent to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">
            Chúng tôi tự hào về
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl sm:max-w-3xl mx-auto px-2">
            Những con số thể hiện sức mạnh và niềm tin từ cộng đồng VibeMarket
          </p>
        </motion.div>

        {/* Thống kê */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {statistics.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center shadow-[0_0_12px_rgba(99,102,241,0.15)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all duration-500 hover:-translate-y-2">
                  {/* Icon nổi */}
                  <div className="inline-flex items-center justify-center p-3 sm:p-5 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/20 mb-4 sm:mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary drop-shadow-md" />
                  </div>

                  {/* Số liệu */}
                  <div className="text-2xl sm:text-5xl font-extrabold mb-1 sm:mb-2 bg-gradient-to-r from-primary via-accent to-indigo-500 bg-clip-text text-transparent">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>

                  {/* Nhãn */}
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium tracking-wide">
                    {stat.label}
                  </p>

                  {/* Hiệu ứng ánh sáng nhỏ */}
                  <div className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent blur-[60px]" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Hình minh họa pha lê 3D ở giữa */}
        <div className="mt-16 sm:mt-24 flex justify-center">
          <img
            src="/images/crystal-3d.png"
            alt="Crystal illustration"
            className="w-40 sm:w-64 h-40 sm:h-64 object-contain opacity-90 drop-shadow-[0_0_25px_rgba(139,92,246,0.5)] animate-float"
          />
        </div>
      </div>
    </section>


  );
}
