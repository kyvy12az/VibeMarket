import { motion } from "framer-motion";
import { Heart, Users, Leaf, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const coreValues = [
  {
    icon: Heart,
    title: "Đam mê",
    description: "Chúng tôi yêu thời trang và sáng tạo từ local brands Việt",
    gradient: "from-pink-500/10 to-red-500/10"
  },
  {
    icon: Users,
    title: "Cộng đồng",
    description: "Xây dựng không gian kết nối, chia sẻ và truyền cảm hứng",
    gradient: "from-blue-500/10 to-cyan-500/10"
  },
  {
    icon: Leaf,
    title: "Bền vững",
    description: "Ưu tiên các sản phẩm thân thiện môi trường và đạo đức",
    gradient: "from-green-500/10 to-emerald-500/10"
  },
  {
    icon: Sparkles,
    title: "Sáng tạo",
    description: "Khuyến khích sự độc đáo và cá tính trong phong cách",
    gradient: "from-purple-500/10 to-pink-500/10"
  }
];

export function CoreValuesGrid() {
  return (
    <section className="relative sm:py-24 py-12 px-6 overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Hiệu ứng ánh sáng */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] bg-gradient-to-r from-primary/30 via-accent/20 to-transparent blur-[120px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[25%] w-[500px] h-[500px] bg-gradient-to-tl from-accent/30 via-primary/10 to-transparent blur-[100px] opacity-30 animate-pulse delay-300" />
      </div>

      {/* Ảnh minh họa 3D viên kim cương */}
      <div className="absolute right-[-80px] bottom-[-40px] lg:right-[-120px] lg:bottom-[-60px] w-[300px] md:w-[400px] opacity-70 hover:opacity-100 transition-opacity duration-700 ease-in-out">
        <motion.img
          src="/images/crystal-3d.png"
          alt="3D Diamond Crystal"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="w-full h-auto object-contain drop-shadow-[0_0_40px_rgba(137,88,255,0.4)] animate-float"
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Tiêu đề */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary via-accent to-indigo-500 bg-clip-text text-transparent">
            Giá trị cốt lõi
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Những nguyên tắc định hướng mọi hành động và tầm nhìn của VibeMarket
          </p>
        </motion.div>

        {/* Danh sách giá trị */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
              >
                <Card className="group h-full border border-white/10 bg-white/10 backdrop-blur-xl hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] hover:-translate-y-2 transition-all duration-500 rounded-3xl overflow-hidden">
                  <CardContent className="relative p-10 flex flex-col items-start text-left">
                    {/* Hiệu ứng nền gradient khi hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
                    />

                    <div className="relative z-10 space-y-5">
                      <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-background/70 border border-border/50 shadow-inner backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>

                      <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-indigo-500 bg-clip-text text-transparent group-hover:brightness-110 transition-all duration-300">
                        {value.title}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>


  );
}
