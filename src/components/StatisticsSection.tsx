import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

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
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
            Thống kê VibeMarket
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Chứng kiến sự phát triển vượt bậc của nền tảng và cộng đồng qua từng năm
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Statistics Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Sản phẩm theo năm</CardTitle>
                    <CardDescription>
                      Tổng số sản phẩm được đăng bán trên nền tảng
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productData}>
                      <XAxis 
                        dataKey="year" 
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
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
                        fill="var(--color-products)"
                        radius={[4, 4, 0, 0]}
                        className="drop-shadow-sm"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Community Statistics Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Cộng đồng theo năm</CardTitle>
                    <CardDescription>
                      Số lượng thành viên tham gia cộng đồng VibeMarket
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={communityData}>
                      <XAxis 
                        dataKey="year"
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
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
                      <Line 
                        type="monotone"
                        dataKey="members" 
                        stroke="var(--color-members)"
                        strokeWidth={3}
                        dot={{ fill: "var(--color-members)", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: "var(--color-members)" }}
                        className="drop-shadow-sm"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;