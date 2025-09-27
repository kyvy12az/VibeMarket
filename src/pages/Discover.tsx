import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Star, Clock, TrendingUp, Zap, Gift, Compass, Search } from "lucide-react";
import Navigation from "@/components/Navigation";

const Discover = () => {
  const featuredContent = [
    {
      id: 1,
      title: "Xu hướng thời trang Thu/Đông 2024",
      description: "Khám phá những xu hướng hot nhất cho mùa lạnh sắp tới",
      image: "https://i.ibb.co/NnHFp7Vr/download.jpg",
      category: "Thời trang",
      trending: true,
      views: 12500,
    },
    {
      id: 2,
      title: "Top 10 gadget công nghệ không thể bỏ qua",
      description: "Những sản phẩm công nghệ đột phá đang làm mưa làm gió",
      image: "https://i.ibb.co/ycwsRm3K/qua-tang-cong-nghe-695c822c80.webp",
      category: "Công nghệ",
      trending: true,
      views: 8900,
    },
    {
      id: 3,
      title: "Local brand Việt đang hot nhất hiện tại",
      description: "Tự hào với những thương hiệu made in Vietnam chất lượng cao",
      image: "/placeholder.svg",
      category: "Local Brand",
      trending: false,
      views: 6700,
    },
  ];

  const events = [
    {
      id: 1,
      title: "Lễ hội mua sắm 12.12",
      description: "Siêu sale cuối năm với hàng triệu deal hấp dẫn",
      date: "12/12/2024",
      discount: "Giảm đến 70%",
      participants: 25000,
      color: "bg-warning",
    },
    {
      id: 2,
      title: "Festival Local Brand 2024",
      description: "Tôn vinh và quảng bá các thương hiệu Việt Nam",
      date: "20/12/2024",
      discount: "Ưu đãi độc quyền",
      participants: 15000,
      color: "bg-success",
    },
  ];

  const hotDeals = [
    {
      id: 1,
      title: "iPhone 17 Pro Max",
      originalPrice: "65.490.000đ",
      salePrice: "63.490.000đ",
      discount: 17,
      timeLeft: "2h 30m",
      image: "https://i.ibb.co/4ZK1RRgY/shopping.webp",
    },
    {
      id: 2,
      title: "MacBook Air M2",
      originalPrice: "32.990.000đ",
      salePrice: "27.990.000đ",
      discount: 15,
      timeLeft: "4h 15m",
      image: "https://i.ibb.co/xqLp6YHx/download.jpg",
    },
    {
      id: 3,
      title: "Samsung Galaxy S24",
      originalPrice: "22.990.000đ",
      salePrice: "18.990.000đ",
      discount: 17,
      timeLeft: "1h 45m",
      image: "https://i.ibb.co/svyfTbr9/shopping.webp",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-left space-y-3 max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Khám phá điều mới
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Cập nhật xu hướng, sự kiện hot và những deal không thể bỏ lỡ
            </p>
          </div>

          {/* Featured Content */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Flame className="w-5 h-5 text-warning" />
              <h2 className="text-2xl font-bold text-foreground">Nội dung nổi bật</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredContent.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover-lift bg-gradient-card border-border cursor-pointer">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-64 object-contain bg-white"
                      />
                      {item.trending && (
                        <Badge className="absolute top-2 right-2 bg-warning text-warning-foreground gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <div className="p-6 space-y-3">
                      <Badge variant="secondary">{item.category}</Badge>
                      <h3 className="font-semibold text-card-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{item.views.toLocaleString()} lượt xem</span>
                        <Button variant="ghost" size="sm">Xem thêm</Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Events */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Sự kiện đặc biệt</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className="p-6 bg-gradient-card border-border hover-lift">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${event.color} rounded-xl flex items-center justify-center`}>
                        <Gift className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-bold text-card-foreground">{event.title}</h3>
                          <p className="text-muted-foreground">{event.description}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant="outline">{event.date}</Badge>
                          <Badge className="bg-primary text-primary-foreground">{event.discount}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.participants.toLocaleString()} người tham gia
                        </p>
                        <Button className="w-full">Tham gia ngay</Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Hot Deals */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Deal hot trong ngày</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {hotDeals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover-lift bg-gradient-card border-border">
                    <div className="relative">
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="w-full h-40 object-contain bg-white"
                      />
                      <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
                        -{deal.discount}%
                      </Badge>
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="font-medium text-card-foreground">{deal.title}</h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">{deal.salePrice}</span>
                          <span className="text-sm text-muted-foreground line-through">
                            {deal.originalPrice}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-destructive" />
                          <span className="text-destructive font-medium">Còn {deal.timeLeft}</span>
                        </div>
                      </div>
                      <Button className="w-full">Mua ngay</Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default Discover;