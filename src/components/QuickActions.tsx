import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  MessageSquare,
  Video,
  Gift,
  Trophy,
  Coins,
  Users,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Star,
  Crown
} from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      id: 1,
      title: "Flash Sale",
      subtitle: "Giảm tới 70%",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-500/10 to-orange-500/10",
      badge: "HOT",
      badgeColor: "from-red-500 to-orange-500",
      description: "Hàng ngàn sản phẩm giảm giá sốc",
    },
    {
      id: 2,
      title: "Livestream",
      subtitle: "Shopping show",
      icon: Video,
      color: "from-pink-500 to-red-500",
      bgGradient: "from-pink-500/10 to-red-500/10",
      badge: "LIVE",
      badgeColor: "from-red-600 to-pink-600",
      description: "Mua sắm trực tiếp cùng streamer",
    },
    {
      id: 3,
      title: "Community Chat",
      subtitle: "Kết nối bạn bè",
      icon: MessageSquare,
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      badge: "NEW",
      badgeColor: "from-blue-500 to-cyan-500",
      description: "Thảo luận & chia sẻ kinh nghiệm",
    },
    {
      id: 4,
      title: "Rewards",
      subtitle: "Tích điểm thưởng",
      icon: Gift,
      color: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-500/10 to-indigo-500/10",
      badge: "BONUS",
      badgeColor: "from-purple-500 to-indigo-500",
      description: "Đổi điểm lấy quà hấp dẫn",
    },
  ];

  const stats = [
    {
      icon: Users,
      label: "Thành viên online",
      value: "12,345",
      growth: "+12%",
      gradient: "from-green-500 to-emerald-600",
      iconBg: "bg-green-500/20",
    },
    {
      icon: ShoppingBag,
      label: "Đơn hàng hôm nay",
      value: "8,921",
      growth: "+8%",
      gradient: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-500/20",
    },
    {
      icon: Trophy,
      label: "Xếp hạng của bạn",
      value: "#156",
      growth: "+5%",
      gradient: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-500/20",
    },
    {
      icon: Coins,
      label: "Điểm tích lũy",
      value: "2,847",
      growth: "+15%",
      gradient: "from-purple-500 to-fuchsia-600",
      iconBg: "bg-purple-500/20",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-background via-card/20 to-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
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
          className="absolute bottom-20 left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary),0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex flex-col items-center justify-center mb-6">
            {/* Animated Icon Container */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.8 }}
              className="relative mb-4"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur-xl opacity-50"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-2xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
              Trải nghiệm{" "}
              <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Đặc biệt
              </span>
            </h2>

            <motion.div
              className="flex items-center justify-center gap-2 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.div
                className="h-1 w-16 bg-gradient-to-r from-yellow-500/30 via-orange-500/30 to-red-500/30 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "4rem" }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              ></motion.div>
              <motion.div
                className="h-1.5 w-8 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4, type: "spring" }}
              ></motion.div>
              <motion.div
                className="h-1 w-16 bg-gradient-to-r from-yellow-500/30 via-orange-500/30 to-red-500/30 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "4rem" }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              ></motion.div>
            </motion.div>

            {/* Subtitle */}
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
              Khám phá những tính năng độc đáo và cơ hội hấp dẫn chỉ có tại VibeMarket
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Tính năng độc quyền
              </Badge>
              <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0 shadow-lg px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                Ưu đãi đặc biệt
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {actions.map((action, index) => (
            <motion.div
              key={action.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer group"
            >
              <Card className="relative overflow-hidden h-full border-2 border-border/50 hover:border-primary/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Top Border Accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${action.color}`} />

                {/* Background Gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${action.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                {/* Glow Effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300`}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <CardContent className="relative p-6 flex flex-col items-center text-center h-full">
                  {/* Badge */}
                  <Badge className={`absolute top-3 right-3 text-xs bg-gradient-to-r ${action.badgeColor} text-white border-0 shadow-lg px-3 py-1`}>
                    {action.badge === "LIVE" && (
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-2 bg-white rounded-full mr-2 inline-block"
                      />
                    )}
                    {action.badge}
                  </Badge>

                  {/* Icon with Animation */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-4"
                  >
                    {/* Glow behind icon */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${action.color} blur-2xl opacity-50`}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <div className={`relative w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
                      <action.icon className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className={`text-base font-semibold mb-3 bg-gradient-to-r ${action.color} bg-clip-text text-transparent`}>
                    {action.subtitle}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6 flex-grow">
                    {action.description}
                  </p>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full"
                  >
                    <Button
                      className={`w-full bg-gradient-to-r ${action.color} hover:opacity-90 text-white shadow-lg transition-all duration-300 group`}
                    >
                      Khám phá ngay
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>

                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.6 }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold mb-2">
              Thống kê{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Thời gian thực
              </span>
            </h3>
            <p className="text-muted-foreground">
              Cập nhật liên tục mỗi phút
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="group"
              >
                <Card className="relative overflow-hidden border-2 border-border/50 hover:border-primary/30 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                  {/* Top Border */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`} />

                  {/* Background Glow */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <CardContent className="p-4 lg:p-6 relative">
                    <div className="flex items-start justify-between mb-4">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                        className={`p-2.5 lg:p-3 rounded-xl ${stat.iconBg} shadow-lg group-hover:shadow-xl transition-shadow`}
                      >
                        <stat.icon className={`w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-r ${stat.gradient} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent' }} />
                      </motion.div>

                      {/* Growth Badge */}
                      <Badge className={`bg-gradient-to-r ${stat.gradient} text-white border-0 shadow-md text-xs px-2 py-1`}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.growth}
                      </Badge>
                    </div>

                    {/* Value */}
                    <div className={`text-2xl lg:text-3xl font-bold mb-1 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>

                    {/* Label */}
                    <div className="text-xs lg:text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${60 + index * 10}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Card className="relative overflow-hidden border-2 border-border/50 bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-sm shadow-2xl">
            {/* Top Border Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-600" />

            {/* Animated Background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Floating Particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary/30 rounded-full"
                style={{
                  top: `${20 + i * 15}%`,
                  left: `${10 + i * 15}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}

            <CardContent className="p-8 lg:p-12 text-center relative z-10">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", duration: 0.6 }}
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-50"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-2xl">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Title */}
              <h3 className="text-2xl lg:text-3xl font-extrabold mb-3">
                Sẵn sàng tham gia cộng đồng{" "}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  VibeMarket
                </span>
                ?
              </h3>

              {/* Description */}
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-base lg:text-lg">
                Kết nối với hàng nghìn thành viên, khám phá sản phẩm độc đáo và trải nghiệm mua sắm hoàn toàn mới!
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-purple-600 text-white font-bold px-8 py-6 rounded-2xl shadow-2xl hover:shadow-primary/50 transition-all duration-300"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Đăng ký miễn phí
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-primary/50 hover:border-primary bg-card/50 backdrop-blur-sm hover:bg-primary/10 font-bold px-8 py-6 rounded-2xl shadow-lg transition-all duration-300"
                  >
                    Tìm hiểu thêm
                  </Button>
                </motion.div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8 mt-8 pt-8 border-t border-border/50">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">95K+</div>
                  <div className="text-xs lg:text-sm text-muted-foreground">Thành viên</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">89K+</div>
                  <div className="text-xs lg:text-sm text-muted-foreground">Sản phẩm</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">98.5%</div>
                  <div className="text-xs lg:text-sm text-muted-foreground">Hài lòng</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default QuickActions;