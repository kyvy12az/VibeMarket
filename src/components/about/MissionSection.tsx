import { motion } from "framer-motion";
import { Target, Eye, Heart } from "lucide-react";

export function MissionSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Hiệu ứng ánh sáng mờ */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/3 w-[500px] h-[500px] bg-gradient-to-r from-primary/30 via-accent/20 to-transparent blur-[120px] opacity-40 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-accent/30 via-primary/10 to-transparent blur-[100px] opacity-30 animate-pulse delay-300" />
      </div>

      <div className="container mx-auto max-w-7xl relative">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary via-accent to-indigo-500 bg-clip-text text-transparent">
            Sứ mệnh của chúng tôi
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Kết nối cộng đồng yêu thời trang Việt và lan tỏa giá trị sáng tạo bản địa
          </p>
        </motion.div>

        {/* Nội dung chính */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Text Blocks */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {[
              {
                icon: Target,
                color: "from-primary to-accent",
                title: "Mục tiêu",
                text: "VibeMarket hướng tới việc tạo ra một nền tảng kết nối giữa các local brand Việt với cộng đồng yêu thời trang, mang lại trải nghiệm mua sắm khác biệt và đầy cảm hứng.",
              },
              {
                icon: Eye,
                color: "from-indigo-400 to-primary",
                title: "Tầm nhìn",
                text: "Trở thành không gian sáng tạo nơi người Việt có thể thể hiện phong cách, chia sẻ đam mê và cùng nhau xây dựng bản sắc thời trang Việt.",
              },
              {
                icon: Heart,
                color: "from-pink-400 to-rose-500",
                title: "Giá trị",
                text: "Chúng tôi tin rằng mỗi thương hiệu địa phương đều mang trong mình câu chuyện riêng — và VibeMarket là nơi giúp câu chuyện đó được tỏa sáng.",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-5">
                <div
                  className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} opacity-90 text-white shadow-md shadow-primary/20`}
                >
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Right side - Glass card quote */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-12 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="space-y-6 text-center">
                <div className="inline-block p-5 rounded-full bg-gradient-to-r from-primary to-accent shadow-md shadow-primary/30">
                  <Heart className="h-12 w-12 text-white" />
                </div>
                <blockquote className="text-lg md:text-2xl italic font-medium bg-gradient-to-r from-primary via-accent to-indigo-400 bg-clip-text text-transparent">
                  "Thời trang không chỉ là phong cách — mà là ngôn ngữ của cảm xúc và cá tính Việt."
                </blockquote>
                <p className="text-sm text-muted-foreground tracking-wide">
                  — Đội ngũ VibeMarket
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

  );
}
