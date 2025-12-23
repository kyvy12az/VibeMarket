import { motion, useScroll, useTransform } from "framer-motion";
import { Target, Eye, Heart, Sparkles, TrendingUp, Users, Award, ArrowRight, Quote, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function MissionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 overflow-hidden bg-background"
    >
      {/* --- Premium Background Effects --- */}
      <div className="absolute inset-0 -z-10">
        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Modern Mesh Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />

        {/* Subtle Grid - Thinner and more elegant */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container mx-auto max-w-7xl relative">
        {/* --- Header Section --- */}
        <motion.div
          style={{ opacity }}
          className="text-center mb-24"
        >
          <Badge variant="outline" className="px-4 py-1.5 mb-8 border-primary/30 bg-primary/5 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-primary mr-2" />
            <span className="tracking-[0.2em] text-xs font-bold uppercase text-primary">
              Our Identity
            </span>
          </Badge>

          <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            Kiến tạo tương lai <br />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent italic">
              thời trang Việt
            </span>
          </h2>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Chúng tôi không chỉ xây dựng một nền tảng, chúng tôi đang nuôi dưỡng một hệ sinh thái nơi sự sáng tạo bản địa được tôn vinh.
          </p>
        </motion.div>

        {/* --- Bento Grid Content --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24">
          
          {/* Mission & Vision - Main Tile */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-8 group"
          >
            <Card className="h-full border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden relative transition-all duration-500 hover:border-primary/50">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-10 relative h-full flex flex-col justify-between">
                <div>
                  <div className="flex gap-4 mb-8">
                    {[Target, Eye, Heart].map((Icon, i) => (
                      <div key={i} className="p-3 rounded-xl bg-secondary border border-border/50">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    ))}
                  </div>
                  <h3 className="text-3xl font-semibold mb-6">Sứ mệnh của chúng tôi</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                    VibeMarket hướng tới việc tạo ra một "điểm chạm" hoàn hảo giữa các Local Brands Việt và cộng đồng yêu thời trang. Chúng tôi tin rằng mỗi sản phẩm đều mang một câu chuyện, và chúng tôi ở đây để giúp câu chuyện đó lan tỏa rộng rãi nhất.
                  </p>
                </div>
                
                <div className="mt-12 flex items-center gap-2 text-primary font-medium cursor-pointer group/btn">
                  Khám phá thêm 
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quote Section - Small Premium Tile */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-4"
          >
            <Card className="h-full border-none bg-gradient-to-br from-primary to-accent p-[1px]">
              <div className="h-full w-full bg-background/90 backdrop-blur-3xl rounded-[inherit] p-8 flex flex-col justify-center text-center">
                <Heart className="h-10 w-10 text-primary mx-auto mb-6 animate-bounce" />
                <blockquote className="text-xl font-medium leading-snug italic">
                  "Thời trang là ngôn ngữ của cảm xúc và cá tính Việt."
                </blockquote>
                <cite className="mt-6 text-sm text-muted-foreground not-italic">— VibeMarket Team</cite>
              </div>
            </Card>
          </motion.div>

          {/* Stats Section - Horizontal Bento */}
          {[
            { icon: Users, label: "Community", value: "10K+", color: "text-blue-500" },
            { icon: Award, label: "Top Brands", value: "500+", color: "text-orange-500" },
            { icon: TrendingUp, label: "Growth", value: "150%", color: "text-emerald-500" },
            { icon: Sparkles, label: "Products", value: "50K+", color: "text-purple-500" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="md:col-span-3"
            >
              <Card className="border-border/40 bg-card/20 backdrop-blur-sm hover:bg-secondary/50 transition-colors">
                <CardContent className="p-6">
                  <stat.icon className={`h-5 w-5 ${stat.color} mb-4`} />
                  <div className="text-3xl font-bold tracking-tighter mb-1">{stat.value}</div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* --- Enhanced CTA --- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <div className="absolute inset-0 blur-3xl bg-primary/20 -z-10" />
          <div className="p-12 rounded-[2.5rem] border border-primary/20 bg-background/40 backdrop-blur-md">
            <h3 className="text-3xl font-bold mb-4">Bạn đã sẵn sàng cùng VibeMarket?</h3>
            <p className="text-muted-foreground mb-8">Hãy cùng chúng tôi viết tiếp hành trình rực rỡ của thời trang bản địa.</p>
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold shadow-xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95 flex items-center gap-2 mx-auto">
              Trở thành đối tác <ArrowUpRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}