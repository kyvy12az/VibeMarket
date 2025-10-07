import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Gift, 
  Star, 
  ShoppingBag, 
  Coffee, 
  Smartphone,
  Ticket,
  TrendingUp,
  Clock,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";

const RewardsRedemption = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userPoints] = useState(2580);

  const categories = [
    { id: "all", name: "Tất cả", icon: Gift, color: "text-primary" },
    { id: "voucher", name: "Voucher", icon: Ticket, color: "text-accent" },
    { id: "product", name: "Sản phẩm", icon: ShoppingBag, color: "text-success" },
    { id: "service", name: "Dịch vụ", icon: Coffee, color: "text-warning" },
    { id: "tech", name: "Công nghệ", icon: Smartphone, color: "text-destructive" },
  ];

  const rewards = [
    {
      id: 1,
      name: "Voucher Giảm 100K",
      description: "Áp dụng cho đơn hàng từ 500K",
      points: 500,
      image: "/placeholder.svg",
      category: "voucher",
      stock: 50,
      trending: true,
      discount: "100.000đ",
      expiry: "30 ngày",
      type: "Mã giảm giá"
    },
    {
      id: 2,
      name: "Voucher Giảm 50K",
      description: "Áp dụng cho đơn hàng từ 200K",
      points: 250,
      image: "/placeholder.svg",
      category: "voucher",
      stock: 100,
      trending: true,
      discount: "50.000đ",
      expiry: "30 ngày",
      type: "Mã giảm giá"
    },
    {
      id: 3,
      name: "Tai nghe Bluetooth",
      description: "Tai nghe không dây chất lượng cao",
      points: 1200,
      image: "/placeholder.svg",
      category: "tech",
      stock: 20,
      trending: true,
      originalPrice: "899.000đ",
      type: "Điện tử"
    },
    {
      id: 4,
      name: "Balo thời trang",
      description: "Balo canvas phong cách Hàn Quốc",
      points: 800,
      image: "/placeholder.svg",
      category: "product",
      stock: 35,
      trending: false,
      originalPrice: "599.000đ",
      type: "Thời trang"
    },
    {
      id: 5,
      name: "Free Ship 30K",
      description: "Miễn phí vận chuyển cho mọi đơn hàng",
      points: 150,
      image: "/placeholder.svg",
      category: "service",
      stock: 200,
      trending: true,
      discount: "30.000đ",
      expiry: "15 ngày",
      type: "Dịch vụ"
    },
    {
      id: 6,
      name: "Cà phê miễn phí",
      description: "1 ly cà phê bất kỳ tại Highland Coffee",
      points: 300,
      image: "/placeholder.svg",
      category: "service",
      stock: 80,
      trending: false,
      discount: "Miễn phí",
      expiry: "30 ngày",
      type: "F&B"
    },
    {
      id: 7,
      name: "Chuột không dây",
      description: "Chuột wireless cao cấp, pin 12 tháng",
      points: 600,
      image: "/placeholder.svg",
      category: "tech",
      stock: 25,
      trending: false,
      originalPrice: "449.000đ",
      type: "Điện tử"
    },
    {
      id: 8,
      name: "Áo thun Premium",
      description: "Áo thun cotton 100% cao cấp",
      points: 450,
      image: "/placeholder.svg",
      category: "product",
      stock: 60,
      trending: false,
      originalPrice: "299.000đ",
      type: "Thời trang"
    },
    {
      id: 9,
      name: "Voucher Giảm 200K",
      description: "Áp dụng cho đơn hàng từ 1.000K",
      points: 900,
      image: "/placeholder.svg",
      category: "voucher",
      stock: 30,
      trending: true,
      discount: "200.000đ",
      expiry: "30 ngày",
      type: "Mã giảm giá"
    },
    {
      id: 10,
      name: "Sạc dự phòng 10000mAh",
      description: "Pin dự phòng sạc nhanh 2 cổng",
      points: 1000,
      image: "/placeholder.svg",
      category: "tech",
      stock: 15,
      trending: true,
      originalPrice: "699.000đ",
      type: "Điện tử"
    },
    {
      id: 11,
      name: "Mũ lưỡi trai",
      description: "Mũ cap thêu logo thời trang",
      points: 350,
      image: "/placeholder.svg",
      category: "product",
      stock: 45,
      trending: false,
      originalPrice: "249.000đ",
      type: "Phụ kiện"
    },
    {
      id: 12,
      name: "Massage 60 phút",
      description: "Voucher massage body toàn thân",
      points: 1500,
      image: "/placeholder.svg",
      category: "service",
      stock: 10,
      trending: false,
      discount: "Miễn phí",
      expiry: "60 ngày",
      type: "Spa & Wellness"
    },
  ];

  const filteredRewards = selectedCategory === "all" 
    ? rewards 
    : rewards.filter(r => r.category === selectedCategory);

  const handleRedeem = (reward: any) => {
    if (userPoints >= reward.points) {
      toast.success(
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
          <div>
            <p className="font-semibold">Đổi thưởng thành công!</p>
            <p className="text-sm text-muted-foreground">{reward.name} đã được thêm vào ví của bạn</p>
          </div>
        </div>
      );
    } else {
      toast.error(`Bạn cần thêm ${reward.points - userPoints} điểm để đổi phần quà này`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Đổi thưởng
              </h1>
              <p className="text-muted-foreground mt-1">
                Sử dụng điểm tích lũy để đổi quà tặng hấp dẫn
              </p>
            </div>
          </div>

          {/* Points Balance Card */}
          <Card className="bg-gradient-hero p-6 border-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Điểm hiện có</p>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-warning" />
                  <span className="text-4xl font-bold text-white">
                    {userPoints.toLocaleString()}
                  </span>
                  <span className="text-white/80 text-lg">điểm</span>
                </div>
              </div>
              <Button 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={() => navigate("/vi-dien-tu")}
              >
                Lịch sử đổi thưởng
              </Button>
            </div>
          </Card>

          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="gap-2 whitespace-nowrap"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon className={`w-4 h-4 ${selectedCategory === category.id ? "" : category.color}`} />
                  {category.name}
                </Button>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-card border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Gift className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{filteredRewards.length}</p>
                  <p className="text-xs text-muted-foreground">Phần quà</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-card border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">
                    {filteredRewards.filter(r => r.trending).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Đang hot</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-card border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">
                    {filteredRewards.filter(r => r.points <= userPoints).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Có thể đổi</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRewards.map((reward, index) => {
              const canRedeem = userPoints >= reward.points;
              const isLowStock = reward.stock < 20;

              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden hover-lift bg-gradient-card border-border h-full flex flex-col group">
                    <div className="relative">
                      <img
                        src={reward.image}
                        alt={reward.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {reward.trending && (
                          <Badge className="bg-warning text-warning-foreground gap-1 shadow-lg">
                            <TrendingUp className="w-3 h-3" />
                            Hot
                          </Badge>
                        )}
                        {isLowStock && (
                          <Badge variant="destructive" className="gap-1 shadow-lg">
                            <Clock className="w-3 h-3" />
                            Sắp hết
                          </Badge>
                        )}
                      </div>

                      {/* Points Badge */}
                      <div className="absolute bottom-3 right-3">
                        <div className={`px-3 py-1.5 rounded-full backdrop-blur-md ${
                          canRedeem 
                            ? 'bg-success/90 text-success-foreground' 
                            : 'bg-muted/90 text-muted-foreground'
                        } font-bold text-sm shadow-lg flex items-center gap-1`}>
                          <Star className="w-4 h-4" />
                          {reward.points.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-3 flex-1 flex flex-col">
                      <div className="flex-1">
                        <Badge variant="secondary" className="mb-2 text-xs">
                          {reward.type}
                        </Badge>
                        <h3 className="font-bold text-card-foreground mb-1 line-clamp-1">
                          {reward.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {reward.description}
                        </p>
                      </div>

                      {/* Value Info */}
                      <div className="space-y-2 pt-2 border-t border-border">
                        {reward.discount && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Giá trị:</span>
                            <span className="font-semibold text-success">{reward.discount}</span>
                          </div>
                        )}
                        {reward.originalPrice && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Giá gốc:</span>
                            <span className="font-semibold text-card-foreground">{reward.originalPrice}</span>
                          </div>
                        )}
                        {reward.expiry && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Hạn dùng:</span>
                            <span className="text-card-foreground">{reward.expiry}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Còn lại:</span>
                          <span className="text-card-foreground">{reward.stock} phần</span>
                        </div>
                      </div>

                      <Button
                        className="w-full gap-2"
                        onClick={() => handleRedeem(reward)}
                        disabled={!canRedeem}
                      >
                        <Gift className="w-4 h-4" />
                        {canRedeem ? 'Đổi ngay' : `Cần ${reward.points - userPoints} điểm nữa`}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredRewards.length === 0 && (
            <Card className="p-12 text-center bg-gradient-card border-border">
              <Gift className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                Không có phần quà nào
              </h3>
              <p className="text-muted-foreground">
                Không tìm thấy phần quà trong danh mục này
              </p>
            </Card>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default RewardsRedemption;