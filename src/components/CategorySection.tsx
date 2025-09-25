import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Shirt, 
  Home, 
  Gamepad2, 
  Camera, 
  HeadphonesIcon,
  Watch,
  Laptop
} from "lucide-react";

const CategorySection = () => {
  const categories = [
    {
      id: 1,
      name: "Thời trang",
      icon: Shirt,
      count: "2.5K+",
      color: "from-pink-500 to-rose-500",
      bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      name: "Điện thoại",
      icon: Smartphone,
      count: "1.2K+",
      color: "from-blue-500 to-cyan-500",
      bgImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      name: "Laptop & PC",
      icon: Laptop,
      count: "890+",
      color: "from-purple-500 to-indigo-500",
      bgImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      name: "Gaming",
      icon: Gamepad2,
      count: "1.5K+",
      color: "from-green-500 to-emerald-500",
      bgImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      name: "Nhà cửa",
      icon: Home,
      count: "3.2K+",
      color: "from-orange-500 to-amber-500",
      bgImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      name: "Camera",
      icon: Camera,
      count: "567+",
      color: "from-red-500 to-pink-500",
      bgImage: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
    },
    {
      id: 7,
      name: "Audio",
      icon: HeadphonesIcon,
      count: "743+",
      color: "from-violet-500 to-purple-500",
      bgImage: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop",
    },
    {
      id: 8,
      name: "Đồng hồ",
      icon: Watch,
      count: "432+",
      color: "from-teal-500 to-cyan-500",
      bgImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <section className="py-16 bg-card/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Danh mục <span className="bg-gradient-accent bg-clip-text text-transparent">Nổi bật</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Khám phá hàng ngàn sản phẩm chất lượng trong mọi lĩnh vực
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer group"
            >
              <Card className="relative overflow-hidden h-32 lg:h-40 bg-gradient-card border-border hover-glow">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={category.bgImage}
                    alt={category.name}
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80 group-hover:opacity-70 transition-opacity`} />
                </div>

                <CardContent className="relative h-full p-4 flex flex-col justify-between text-white">
                  <div className="flex items-start justify-between">
                    <category.icon className="w-6 h-6 lg:w-8 lg:h-8" />
                    <Badge className="bg-white/20 text-white border-none text-xs">
                      {category.count}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm lg:text-base mb-1">
                      {category.name}
                    </h3>
                    <p className="text-xs lg:text-sm text-white/80">
                      Sản phẩm đa dạng
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {["Hot trend", "Flash sale", "Local brand", "Vintage", "Gaming gear"].map((tag) => (
              <Badge 
                key={tag}
                variant="outline" 
                className="border-accent text-accent hover:bg-accent/10 cursor-pointer transition-smooth"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;