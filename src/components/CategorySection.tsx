import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Shirt,
  Home,
  Gamepad2,
  Camera,
  HeadphonesIcon,
  Watch,
  Laptop,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Zap,
  Star
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
      trending: true,
      discount: "Giảm 50%",
    },
    {
      id: 2,
      name: "Điện thoại",
      icon: Smartphone,
      count: "1.2K+",
      color: "from-blue-500 to-cyan-500",
      bgImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
      trending: true,
      discount: "Hot",
    },
    {
      id: 3,
      name: "Laptop & PC",
      icon: Laptop,
      count: "890+",
      color: "from-purple-500 to-indigo-500",
      bgImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
      trending: false,
      discount: "Sale",
    },
    {
      id: 4,
      name: "Gaming",
      icon: Gamepad2,
      count: "1.5K+",
      color: "from-green-500 to-emerald-500",
      bgImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
      trending: true,
      discount: "New",
    },
    {
      id: 5,
      name: "Nhà cửa",
      icon: Home,
      count: "3.2K+",
      color: "from-orange-500 to-amber-500",
      bgImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      trending: false,
      discount: "Deal",
    },
    {
      id: 6,
      name: "Camera",
      icon: Camera,
      count: "567+",
      color: "from-red-500 to-pink-500",
      bgImage: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
      trending: false,
      discount: "-30%",
    },
    {
      id: 7,
      name: "Audio",
      icon: HeadphonesIcon,
      count: "743+",
      color: "from-violet-500 to-purple-500",
      bgImage: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop",
      trending: true,
      discount: "Mới",
    },
    {
      id: 8,
      name: "Đồng hồ",
      icon: Watch,
      count: "432+",
      color: "from-teal-500 to-cyan-500",
      bgImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      trending: false,
      discount: "Luxury",
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
    hidden: { opacity: 0, y: 30, scale: 0.9 },
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
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
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

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
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
                className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl blur-xl opacity-50"
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
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
              Danh mục{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Nổi bật
              </span>
            </h2>

            {/* Animated Decorative Divider */}
            <motion.div
              className="flex items-center justify-center gap-2 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.div
                className="h-1 w-16 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "4rem" }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              ></motion.div>
              <motion.div
                className="h-1.5 w-8 bg-gradient-to-r from-primary to-purple-600 rounded-full"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4, type: "spring" }}
              ></motion.div>
              <motion.div
                className="h-1 w-16 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "4rem" }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              ></motion.div>
            </motion.div>

            {/* Subtitle */}
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
              Khám phá hàng ngàn sản phẩm chất lượng trong mọi lĩnh vực
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-xs text-muted-foreground">Danh mục</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-xs text-muted-foreground">Sản phẩm</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-12"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer group"
            >
              <Card className="relative overflow-hidden h-44 lg:h-52 border-2 border-border/50 hover:border-primary/50 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Background Image with Parallax Effect */}
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <img
                    src={category.bgImage}
                    alt={category.name}
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-70 group-hover:opacity-60 transition-opacity duration-300`} />
                </motion.div>

                {/* Glow Effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Top Border Accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.color}`} />

                {/* Content */}
                <CardContent className="relative h-full p-4 lg:p-5 flex flex-col justify-between text-white">
                  {/* Top Section */}
                  <div className="flex items-start justify-between">
                    {/* Icon with Animation */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="p-2.5 lg:p-3 rounded-xl bg-white/20 backdrop-blur-md shadow-lg group-hover:bg-white/30 transition-colors"
                    >
                      <category.icon className="w-6 h-6 lg:w-7 lg:h-7" />
                    </motion.div>

                    {/* Badges */}
                    <div className="flex flex-col gap-2 items-end">
                      {category.trending && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg text-xs px-2 py-0.5">
                          <Star className="w-3 h-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                      <Badge className="bg-white/30 backdrop-blur-md text-white border-0 text-xs px-2 py-0.5 font-bold">
                        {category.count}
                      </Badge>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div>
                    <h3 className="font-bold text-base lg:text-lg mb-1.5 drop-shadow-lg">
                      {category.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <p className="text-xs lg:text-sm text-white/90 font-medium">
                        Sản phẩm đa dạng
                      </p>

                      {/* Discount Badge */}
                      <Badge className={`bg-gradient-to-r ${category.color} text-white border-0 shadow-lg text-xs px-2 py-0.5`}>
                        {category.discount}
                      </Badge>
                    </div>
                  </div>

                  {/* Hover Arrow */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="absolute bottom-4 right-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
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

        {/* Enhanced Tags Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {/* Background Card */}
          <Card className="border-border/50 bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-cyan-500" />

            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Xu hướng mua sắm</h3>
                <p className="text-sm text-muted-foreground">Khám phá các từ khóa hot nhất hiện nay</p>
              </div>

              {/* Tags Grid */}
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { label: "Hot trend", icon: "🔥", color: "from-orange-500 to-red-500" },
                  { label: "Flash sale", icon: "⚡", color: "from-yellow-500 to-amber-500" },
                  { label: "Local brand", icon: "🇻🇳", color: "from-green-500 to-emerald-500" },
                  { label: "Vintage", icon: "🎨", color: "from-purple-500 to-pink-500" },
                  { label: "Gaming gear", icon: "🎮", color: "from-blue-500 to-cyan-500" },
                  { label: "Luxury", icon: "💎", color: "from-indigo-500 to-purple-500" },
                  { label: "Tech deals", icon: "💻", color: "from-cyan-500 to-blue-500" },
                  { label: "Fashion", icon: "👗", color: "from-pink-500 to-rose-500" },
                ].map((tag, index) => (
                  <motion.div
                    key={tag.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge
                      variant="outline"
                      className={`border-2 border-border/50 bg-gradient-to-r ${tag.color} bg-clip-text text-transparent hover:bg-gradient-to-r hover:${tag.color} cursor-pointer transition-all duration-300 px-4 py-2 text-sm font-semibold shadow-md hover:shadow-lg backdrop-blur-sm`}
                    >
                      <span className="mr-2">{tag.icon}</span>
                      #{tag.label}
                    </Badge>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex justify-center mt-8"
              >
                <Button
                  className="bg-gradient-to-r from-primary to-purple-600 text-white font-bold px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Khám phá tất cả
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;