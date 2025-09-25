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
  ArrowRight
} from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      id: 1,
      title: "Flash Sale",
      subtitle: "Giảm tới 70%",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      badge: "HOT",
      description: "Hàng ngàn sản phẩm giảm giá sốc",
    },
    {
      id: 2,
      title: "Livestream",
      subtitle: "Shopping show",
      icon: Video,
      color: "from-pink-500 to-red-500",
      badge: "LIVE",
      description: "Mua sắm trực tiếp cùng streamer",
    },
    {
      id: 3,
      title: "Community Chat",
      subtitle: "Kết nối bạn bè",
      icon: MessageSquare,
      color: "from-blue-500 to-cyan-500",
      badge: "NEW",
      description: "Thảo luận & chia sẻ kinh nghiệm",
    },
    {
      id: 4,
      title: "Rewards",
      subtitle: "Tích điểm thưởng",
      icon: Gift,
      color: "from-purple-500 to-indigo-500",
      badge: "BONUS",
      description: "Đổi điểm lấy quà hấp dẫn",
    },
  ];

  const stats = [
    { icon: Users, label: "Thành viên online", value: "12,345", color: "text-green-500" },
    { icon: ShoppingBag, label: "Đơn hàng hôm nay", value: "8,921", color: "text-blue-500" },
    { icon: Trophy, label: "Xếp hạng của bạn", value: "#156", color: "text-yellow-500" },
    { icon: Coins, label: "Điểm tích lũy", value: "2,847", color: "text-purple-500" },
  ];

  return (
    <section className="py-16 bg-card/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Trải nghiệm <span className="bg-gradient-accent bg-clip-text text-transparent">Đặc biệt</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Khám phá những tính năng độc đáo và cơ hội hấp dẫn chỉ có tại VibeMarket
          </p>
        </motion.div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {actions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="cursor-pointer group"
            >
              <Card className="relative overflow-hidden bg-gradient-card border-border hover-glow">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                
                <CardContent className="relative p-6 text-center">
                  {/* Badge */}
                  <Badge className="absolute top-3 right-3 text-xs bg-gradient-primary text-white">
                    {action.badge}
                  </Badge>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
                    <action.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {action.title}
                  </h3>
                  <p className="text-primary font-semibold mb-3">
                    {action.subtitle}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {action.description}
                  </p>
                  
                  <Button 
                    className="w-full bg-gradient-primary hover:opacity-90 transition-smooth group"
                  >
                    Khám phá ngay
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="bg-gradient-card border-border hover-glow text-center">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-card rounded-xl">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Card className="bg-gradient-hero p-8 text-white border-none shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">
              Sẵn sàng tham gia cộng đồng VibeMarket?
            </h3>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Kết nối với hàng nghìn thành viên, khám phá sản phẩm độc đáo và trải nghiệm mua sắm hoàn toàn mới!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 transition-smooth"
              >
                Đăng ký miễn phí
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10 transition-smooth"
              >
                Tìm hiểu thêm
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default QuickActions;