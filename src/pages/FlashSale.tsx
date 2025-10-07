import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
// Force refresh - Fire icon fixed to Flame
import { Clock, Zap, Flame, Star, Timer } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useState, useEffect } from "react";

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 30,
    seconds: 45,
  });

  const [flashSaleItems, setFlashSaleItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const upcomingSales = [
    { time: "14:00", title: "Thời trang nam", discount: "Giảm 50%" },
    { time: "16:00", title: "Mỹ phẩm cao cấp", discount: "Giảm 40%" },
    { time: "18:00", title: "Đồ gia dụng", discount: "Giảm 60%" },
    { time: "20:00", title: "Phụ kiện điện tử", discount: "Giảm 35%" },
  ];

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/flash_sale.php`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setFlashSaleItems(data.products);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // const flashSaleItems = [
  //   {
  //     id: 1,
  //     name: "iPhone 17 Pro Max 256GB",
  //     originalPrice: "39.990.000đ",
  //     salePrice: "35.990.000đ",
  //     discount: 23,
  //     image: "https://i.ibb.co/4ZK1RRgY/shopping.webp",
  //     sold: 78,
  //     total: 100,
  //     rating: 4.9,
  //     reviews: 1250,
  //   },
  //   {
  //     id: 2,
  //     name: "MacBook Air M3 13 inch",
  //     originalPrice: "31.990.000đ",
  //     salePrice: "25.990.000đ",
  //     discount: 19,
  //     image: "https://i.ibb.co/7d5WcVF6/shopping.webp",
  //     sold: 92,
  //     total: 120,
  //     rating: 4.8,
  //     reviews: 890,
  //   },
  //   {
  //     id: 3,
  //     name: "Samsung Galaxy S24 Ultra",
  //     originalPrice: "29.990.000đ",
  //     salePrice: "22.990.000đ",
  //     discount: 23,
  //     image: "https://i.ibb.co/7xMqxLqQ/download.jpg",
  //     sold: 156,
  //     total: 200,
  //     rating: 4.7,
  //     reviews: 2340,
  //   },
  //   {
  //     id: 4,
  //     name: "iPad Pro M4 11 inch",
  //     originalPrice: "24.990.000đ",
  //     salePrice: "19.990.000đ",
  //     discount: 20,
  //     image: "https://i.ibb.co/5h1kBgvq/shopping.webp",
  //     sold: 67,
  //     total: 80,
  //     rating: 4.9,
  //     reviews: 670,
  //   },
  //   {
  //     id: 5,
  //     name: "Apple Watch Series 10",
  //     originalPrice: "12.990.000đ",
  //     salePrice: "9.990.000đ",
  //     discount: 23,
  //     image: "https://i.ibb.co/4ZS7Pmbb/download.jpg",
  //     sold: 234,
  //     total: 300,
  //     rating: 4.6,
  //     reviews: 1890,
  //   },
  //   {
  //     id: 6,
  //     name: "AirPods Pro 3rd Gen",
  //     originalPrice: "6.990.000đ",
  //     salePrice: "4.990.000đ",
  //     discount: 29,
  //     image: "https://i.ibb.co/DdtSwM1/download.jpg",
  //     sold: 445,
  //     total: 500,
  //     rating: 4.8,
  //     reviews: 3450,
  //   },
  // ];

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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-400 to-red-500 flex items-center justify-center shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="md:text-4xl text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Flash Sale ⚡
              </h1>
              <Flame className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-muted-foreground md:text-lg text-base">
              Săn deal siêu hot - Giá sốc chỉ trong thời gian có hạn!
            </p>
          </div>

          {/* Countdown Timer */}
          <Card className="p-8 text-center bg-gradient-primary border-border space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Timer className="w-6 h-6 text-destructive" />
              <h2 className="text-2xl font-bold text-primary-foreground">
                Kết thúc trong:
              </h2>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="bg-card/20 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
                <div className="text-3xl font-bold text-primary-foreground">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-primary-foreground/80">Giờ</div>
              </div>
              <div className="text-2xl text-primary-foreground">:</div>
              <div className="bg-card/20 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
                <div className="text-3xl font-bold text-primary-foreground">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-primary-foreground/80">Phút</div>
              </div>
              <div className="text-2xl text-primary-foreground">:</div>
              <div className="bg-card/20 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
                <div className="text-3xl font-bold text-primary-foreground">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-primary-foreground/80">Giây</div>
              </div>
            </div>
          </Card>

          {/* Flash Sale Products */}
          <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Flame className="w-6 h-6 text-destructive" />
            Sản phẩm Flash Sale
          </h2>
          {loading ? (
            <div className="text-center py-10">Đang tải...</div>
          ) : flashSaleItems.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">Chưa có sản phẩm Flash Sale</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashSaleItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover-lift bg-gradient-card border-border relative">
                    <Badge className="absolute top-2 right-2 z-10 bg-destructive text-destructive-foreground text-lg px-3 py-1">
                      -{item.discount}%
                    </Badge>
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-64 object-contain bg-white"
                      />
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-card/90 backdrop-blur-sm rounded-lg p-2">
                          <div className="flex items-center justify-between text-xs text-card-foreground mb-1">
                            <span>Đã bán: {item.sold}/{item.quantity}</span>
                            <span>{item.quantity > 0 ? Math.round((item.sold / item.quantity) * 100) : 0}%</span>
                          </div>
                          <Progress value={item.quantity > 0 ? (item.sold / item.quantity) * 100 : 0} className="h-2" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="font-medium text-card-foreground line-clamp-2 min-h-[2.5rem]">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-warning text-warning" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({item.reviews} đánh giá)
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-primary">{item.price.toLocaleString()}đ</span>
                          <span className="text-sm text-muted-foreground line-through">
                            {item.originalPrice.toLocaleString()}đ
                          </span>
                        </div>
                      </div>
                      <Button className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                        <Zap className="w-4 h-4 mr-2" />
                        Mua ngay
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>

          {/* Upcoming Sales */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-accent" />
              Flash Sale sắp tới
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingSales.map((sale, index) => (
                <motion.div
                  key={sale.time}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 text-center bg-gradient-card border-border hover-lift cursor-pointer">
                    <div className="text-2xl font-bold text-accent mb-2">{sale.time}</div>
                    <h3 className="font-semibold text-card-foreground mb-2">{sale.title}</h3>
                    <Badge className="bg-warning text-warning-foreground">{sale.discount}</Badge>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      Đặt nhắc nhở
                    </Button>
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

export default FlashSale;