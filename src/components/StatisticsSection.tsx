import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, Users, Package, ShoppingBag, ArrowUpRight, Sparkles, Trophy, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const productData = [
  { year: "2020", products: 12500 },
  { year: "2021", products: 28300 },
  { year: "2022", products: 45600 },
  { year: "2023", products: 67800 },
  { year: "2024", products: 89200 },
];

const communityData = [
  { year: "2020", members: 5200 },
  { year: "2021", members: 15800 },
  { year: "2022", members: 32400 },
  { year: "2023", members: 58600 },
  { year: "2024", members: 95300 },
];

const chartConfig = {
  products: {
    label: "Sản phẩm",
    color: "hsl(var(--primary))",
  },
  members: {
    label: "Thành viên",
    color: "hsl(var(--primary))",
  },
};

const StatisticsSection = () => {
  // Calculate growth percentages
  const productGrowth = ((productData[4].products - productData[3].products) / productData[3].products * 100).toFixed(1);
  const memberGrowth = ((communityData[4].members - communityData[3].members) / communityData[3].members * 100).toFixed(1);

  const stats = [
    {
      icon: Package,
      label: "Tổng sản phẩm",
      value: "89.2K+",
      growth: `+${productGrowth}%`,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Users,
      label: "Thành viên",
      value: "95.3K+",
      growth: `+${memberGrowth}%`,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: ShoppingBag,
      label: "Giao dịch",
      value: "150K+",
      growth: "+45.2%",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Trophy,
      label: "Đánh giá 5⭐",
      value: "98.5%",
      growth: "+2.1%",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
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
          className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
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
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
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
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-50"
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
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
              Thống kê{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Ấn tượng
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
              Chứng kiến sự phát triển vượt bậc của nền tảng và cộng đồng qua từng năm
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                Top #1 Việt Nam
              </Badge>
              <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0 shadow-lg px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Tăng trưởng nhanh
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group"
            >
              <Card className="relative overflow-hidden border-2 border-border/50 hover:border-primary/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                {/* Top Border Accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />

                {/* Glow Effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300`}
                  animate={{
                    scale: [1, 1.1, 1],
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
                      className={`p-2.5 lg:p-3 rounded-xl ${stat.bgColor} shadow-lg group-hover:shadow-xl transition-shadow`}
                    >
                      <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                    </motion.div>

                    {/* Growth Badge */}
                    <Badge className={`bg-gradient-to-r ${stat.color} text-white border-0 shadow-md text-xs px-2 py-1`}>
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      {stat.growth}
                    </Badge>
                  </div>

                  {/* Value */}
                  <div className="text-2xl lg:text-3xl font-bold mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className="text-xs lg:text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Product Statistics Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="group"
          >
            <Card className="h-full border-2 border-border/50 hover:border-primary/30 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              {/* Top Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-600" />

              {/* Background Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="p-3 bg-gradient-to-br from-primary to-purple-600 rounded-xl shadow-lg"
                    >
                      <Package className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-xl lg:text-2xl font-bold mb-1">
                        Sản phẩm theo năm
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Tổng số sản phẩm được đăng bán trên nền tảng
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0 shadow-lg">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{productGrowth}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <ChartContainer config={chartConfig} className="h-[280px] lg:h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productData}>
                      <defs>
                        <linearGradient id="productGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="year"
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickLine={{ stroke: 'hsl(var(--border))' }}
                        tickFormatter={(value) => `${value / 1000}K`}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value) => [`${value.toLocaleString()} sản phẩm`, "Sản phẩm"]}
                          />
                        }
                      />
                      <Bar
                        dataKey="products"
                        fill="url(#productGradient)"
                        radius={[8, 8, 0, 0]}
                        className="drop-shadow-lg"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>

                {/* Stats Summary */}
                <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
                  <div className="text-center">
                    <div className="text-lg lg:text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">12.5K</div>
                    <div className="text-xs text-muted-foreground">Năm 2020</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg lg:text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">89.2K</div>
                    <div className="text-xs text-muted-foreground">Năm 2024</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg lg:text-xl font-bold text-primary">7.1x</div>
                    <div className="text-xs text-muted-foreground">Tăng trưởng</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Community Statistics Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="group"
          >
            <Card className="h-full border-2 border-border/50 hover:border-primary/30 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              {/* Top Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-600" />

              {/* Background Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="p-3 bg-gradient-to-br from-primary to-purple-600 rounded-xl shadow-lg"
                    >
                      <Users className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-xl lg:text-2xl font-bold mb-1">
                        Cộng đồng theo năm
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Số lượng thành viên tham gia cộng đồng VibeMarket
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0 shadow-lg">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{memberGrowth}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <ChartContainer config={chartConfig} className="h-[280px] lg:h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={communityData}>
                      <defs>
                        <linearGradient id="memberGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="year"
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickLine={{ stroke: 'hsl(var(--border))' }}
                        tickFormatter={(value) => `${value / 1000}K`}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value) => [`${value.toLocaleString()} thành viên`, "Thành viên"]}
                          />
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="members"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        fill="url(#memberGradient)"
                        className="drop-shadow-lg"
                      />
                      <Line
                        type="monotone"
                        dataKey="members"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: "hsl(var(--primary))", strokeWidth: 3 }}
                        className="drop-shadow-sm"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>

                {/* Stats Summary */}
                <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
                  <div className="text-center">
                    <div className="text-lg lg:text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">5.2K</div>
                    <div className="text-xs text-muted-foreground">Năm 2020</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg lg:text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">95.3K</div>
                    <div className="text-xs text-muted-foreground">Năm 2024</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg lg:text-xl font-bold text-primary">18.3x</div>
                    <div className="text-xs text-muted-foreground">Tăng trưởng</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Highlight Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Card className="border-border/50 bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-600" />
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">Cột mốc ấn tượng năm 2024</h3>
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Với <span className="font-bold text-foreground">89,200+ sản phẩm</span> và{" "}
                <span className="font-bold text-foreground">95,300+ thành viên</span> tích cực,
                VibeMarket đang trở thành nền tảng thương mại điện tử hàng đầu Việt Nam! 🎉
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default StatisticsSection;