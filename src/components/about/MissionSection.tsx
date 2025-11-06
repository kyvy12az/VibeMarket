import { motion, useScroll, useTransform } from "framer-motion";
import { Target, Eye, Heart, Sparkles, TrendingUp, Users, Award } from "lucide-react";
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
      className="relative py-10 px-4 sm:px-6 overflow-hidden"
    >
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10" />
        
        {/* Animated mesh gradient */}
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary),0.15),transparent_50%)]"
          style={{ opacity }}
        />
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--accent),0.15),transparent_50%)]"
          style={{ opacity }}
        />
        
        {/* Floating orbs with parallax */}
        <motion.div
          style={{ y }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-tr from-primary/30 via-accent/30 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-accent/40 via-primary/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary),0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="container mx-auto max-w-7xl">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 backdrop-blur-sm"
          >
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Sứ mệnh & Tầm nhìn
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Sứ mệnh của
            </span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mt-2">
              chúng tôi
            </span>
          </h2>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-1.5 w-24 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-6"
          />

          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Kết nối cộng đồng yêu thời trang Việt và lan tỏa giá trị sáng tạo bản địa
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
          {/* Left - Mission Cards */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {[
              {
                icon: Target,
                color: "from-primary to-accent",
                shadowColor: "shadow-primary/20",
                title: "Mục tiêu",
                text: "VibeMarket hướng tới việc tạo ra một nền tảng kết nối giữa các local brand Việt với cộng đồng yêu thời trang, mang lại trải nghiệm mua sắm khác biệt và đầy cảm hứng.",
              },
              {
                icon: Eye,
                color: "from-blue-500 to-indigo-500",
                shadowColor: "shadow-blue-500/20",
                title: "Tầm nhìn",
                text: "Trở thành không gian sáng tạo nơi người Việt có thể thể hiện phong cách, chia sẻ đam mê và cùng nhau xây dựng bản sắc thời trang Việt.",
              },
              {
                icon: Heart,
                color: "from-pink-500 to-rose-500",
                shadowColor: "shadow-pink-500/20",
                title: "Giá trị",
                text: "Chúng tôi tin rằng mỗi thương hiệu địa phương đều mang trong mình câu chuyện riêng — và VibeMarket là nơi giúp câu chuyện đó được tỏa sáng.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardContent className="p-6 relative">
                    <div className="flex items-start gap-5">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className={`flex-shrink-0 p-4 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg ${item.shadowColor} group-hover:shadow-2xl transition-shadow duration-500`}
                      >
                        <item.icon className="h-7 w-7 text-white" />
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Right - Quote Card & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Quote Card */}
            <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl shadow-2xl">
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent" />
              
              <CardContent className="relative p-8 sm:p-12">
                <div className="space-y-6 text-center">
                  {/* Icon */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-flex p-6 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30"
                  >
                    <Heart className="h-12 w-12 text-white" />
                  </motion.div>

                  {/* Quote */}
                  <blockquote className="text-xl sm:text-2xl lg:text-3xl italic font-semibold leading-relaxed">
                    <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                      "Thời trang không chỉ là phong cách — mà là ngôn ngữ của cảm xúc và cá tính Việt."
                    </span>
                  </blockquote>

                  {/* Author */}
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm font-medium text-muted-foreground tracking-wide">
                      — Đội ngũ VibeMarket
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: "Cộng đồng", value: "10K+", color: "from-blue-500 to-cyan-500" },
                { icon: TrendingUp, label: "Tăng trưởng", value: "+150%", color: "from-green-500 to-emerald-500" },
                { icon: Award, label: "Thương hiệu", value: "500+", color: "from-orange-500 to-red-500" },
                { icon: Sparkles, label: "Sản phẩm", value: "50K+", color: "from-purple-500 to-pink-500" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                    <CardContent className="p-6 text-center space-y-2">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-md`}
                      >
                        <stat.icon className="h-6 w-6 text-white" />
                      </motion.div>
                      <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 backdrop-blur-sm">
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            />

            <CardContent className="relative p-8 sm:p-12 text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Cùng nhau xây dựng cộng đồng thời trang Việt
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Tham gia VibeMarket để kết nối với hàng nghìn người yêu thời trang và khám phá những thương hiệu độc đáo
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="pt-4"
                >
                  <Badge className="px-6 py-3 text-base bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 cursor-pointer shadow-lg">
                    Tìm hiểu thêm →
                  </Badge>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}