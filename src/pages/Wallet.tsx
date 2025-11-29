import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet2, 
  CreditCard, 
  Gift, 
  History, 
  Plus, 
  TrendingUp, 
  Star, 
  Coins, 
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Award,
  ShoppingBag,
  Calendar,
  DollarSign,
  TrendingDown,
  BarChart3,
  Filter,
  Download,
  Eye,
  EyeOff,
  Zap,
  Clock,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

const WalletPage = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const headerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const balance = 2450000;
  const loyaltyPoints = 850;
  const nextRewardAt = 1000;
  const monthlySpending = 1200000;
  const monthlySavings = 180000;

  const transactions = [
    { 
      id: 1, 
      type: "purchase", 
      amount: -150000, 
      description: "Mua áo thun Basic Tee", 
      date: "2024-01-15", 
      time: "14:30",
      points: 15,
      status: "completed",
      category: "fashion"
    },
    { 
      id: 2, 
      type: "topup", 
      amount: 500000, 
      description: "Nạp tiền từ Vietcombank", 
      date: "2024-01-14", 
      time: "09:15",
      points: 0,
      status: "completed",
      category: "wallet"
    },
    { 
      id: 3, 
      type: "reward", 
      amount: 50000, 
      description: "Phần thưởng sinh nhật", 
      date: "2024-01-10", 
      time: "00:00",
      points: 50,
      status: "completed",
      category: "reward"
    },
    { 
      id: 4, 
      type: "purchase", 
      amount: -250000, 
      description: "Mua giày sneaker Nike", 
      date: "2024-01-08", 
      time: "16:45",
      points: 25,
      status: "completed",
      category: "fashion"
    },
    { 
      id: 5, 
      type: "refund", 
      amount: 80000, 
      description: "Hoàn tiền đơn hàng #1234", 
      date: "2024-01-05", 
      time: "11:20",
      points: 0,
      status: "completed",
      category: "refund"
    },
  ];

  const rewards = [
    { 
      id: 1, 
      title: "Giảm 10%", 
      points: 100, 
      description: "Cho đơn hàng từ 500K",
      icon: "discount",
      color: "from-blue-500 to-cyan-500",
      available: true
    },
    { 
      id: 2, 
      title: "Miễn phí ship", 
      points: 50, 
      description: "Áp dụng toàn quốc",
      icon: "shipping",
      color: "from-green-500 to-emerald-500",
      available: true
    },
    { 
      id: 3, 
      title: "Giảm 50K", 
      points: 200, 
      description: "Cho đơn hàng từ 1M",
      icon: "voucher",
      color: "from-orange-500 to-red-500",
      available: true
    },
    { 
      id: 4, 
      title: "Quà tặng VIP", 
      points: 500, 
      description: "Túi canvas cao cấp",
      icon: "gift",
      color: "from-purple-500 to-pink-500",
      available: true
    },
    { 
      id: 5, 
      title: "Tặng 100K", 
      points: 1000, 
      description: "Voucher mua sắm",
      icon: "cash",
      color: "from-primary to-purple-600",
      available: false
    },
  ];

  const stats = [
    {
      label: "Chi tiêu tháng này",
      value: monthlySpending,
      change: "+15%",
      trend: "up",
      icon: ShoppingBag,
      color: "text-blue-500"
    },
    {
      label: "Tiết kiệm",
      value: monthlySavings,
      change: "+8%",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      label: "Giao dịch",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: BarChart3,
      color: "text-orange-500"
    },
    {
      label: "Điểm tích lũy",
      value: loyaltyPoints,
      change: "+25%",
      trend: "up",
      icon: Star,
      color: "text-amber-500"
    },
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return ShoppingBag;
      case "topup":
        return ArrowDownLeft;
      case "reward":
        return Gift;
      case "refund":
        return ArrowUpRight;
      default:
        return CreditCard;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "purchase":
        return "from-red-500 to-orange-500";
      case "topup":
        return "from-green-500 to-emerald-500";
      case "reward":
        return "from-purple-500 to-pink-500";
      case "refund":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-primary opacity-10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary),0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Enhanced Header */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ y: headerY, opacity: headerOpacity }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-xl shadow-primary/30"
              >
                <Wallet className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="md:text-4xl text-2xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                  Ví điện tử
                </h1>
                <p className="text-muted-foreground md:text-base text-sm">
                  Quản lý tài chính thông minh
                </p>
              </div>
            </div>
          </motion.div>

          {/* Main Balance Card - Enhanced */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl shadow-2xl">
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-600/10 to-primary/10" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-600 to-primary" />
              
              {/* Floating orbs */}
              <motion.div
                className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-primary/30 to-purple-600/30 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <CardContent className="relative p-8">
                <div className="flex items-start justify-between mb-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0 shadow-lg">
                        <Award className="w-3 h-3 mr-1" />
                        VIP Member
                      </Badge>
                      <Badge variant="outline" className="backdrop-blur-sm">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Số dư khả dụng</p>
                    <div className="flex items-center gap-3">
                      {showBalance ? (
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                          {balance.toLocaleString('vi-VN')}đ
                        </h2>
                      ) : (
                        <h2 className="text-5xl font-bold text-muted-foreground">••••••</h2>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowBalance(!showBalance)}
                        className="hover:bg-primary/10"
                      >
                        {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="p-4 rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-xl"
                  >
                    <Wallet2 className="w-8 h-8 text-white" />
                  </motion.div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Button size="lg" className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-lg">
                      <Plus className="w-5 h-5 mr-2" />
                      Nạp tiền
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Button size="lg" variant="outline" className="w-full border-2 hover:border-primary hover:bg-primary/5">
                      <ArrowUpRight className="w-5 h-5 mr-2" />
                      Rút tiền
                    </Button>
                  </motion.div>
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
                  {[
                    { label: "Chi tháng này", value: (monthlySpending / 1000000).toFixed(1) + "M", icon: TrendingDown },
                    { label: "Giao dịch", value: "24", icon: BarChart3 },
                    { label: "Điểm thưởng", value: loyaltyPoints, icon: Star },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="text-center"
                    >
                      <div className="flex justify-center mb-2">
                        <stat.icon className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Grid - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.trend === 'up' ? 'from-green-500/20 to-emerald-500/20' : 'from-red-500/20 to-orange-500/20'}`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <Badge variant={stat.trend === 'up' ? 'default' : 'secondary'} className={stat.trend === 'up' ? 'bg-green-500/20 text-green-600' : ''}>
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString('vi-VN') : stat.value}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Loyalty Points Section - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5" />
              
              <CardContent className="p-8 relative">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg"
                      >
                        <Star className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-2xl font-bold">Điểm thưởng của bạn</h3>
                        <p className="text-muted-foreground text-sm">Tích lũy và đổi quà hấp dẫn</p>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                        {loyaltyPoints}
                      </span>
                      <span className="text-2xl text-muted-foreground">điểm</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Đến phần thưởng tiếp theo</span>
                        <span className="font-semibold">{loyaltyPoints}/{nextRewardAt} điểm</span>
                      </div>
                      <Progress value={(loyaltyPoints / nextRewardAt) * 100} className="h-3" />
                      <p className="text-xs text-muted-foreground">
                        Còn {nextRewardAt - loyaltyPoints} điểm nữa để nhận quà
                      </p>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      onClick={() => navigate("/rewards")}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 shadow-xl px-8"
                    >
                      <Gift className="w-5 h-5 mr-2" />
                      Đổi thưởng ngay
                      <Sparkles className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transaction History - Enhanced */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card className="border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-600 to-primary" />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg">
                        <History className="w-5 h-5 text-white" />
                      </div>
                      Lịch sử giao dịch
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Lọc
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Xuất
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {transactions.map((transaction, idx) => {
                    const Icon = getTransactionIcon(transaction.type);
                    return (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="group"
                      >
                        <Card className="border-border/50 bg-gradient-to-br from-background/50 to-card/30 hover:shadow-lg transition-all cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <motion.div
                                  whileHover={{ rotate: 360 }}
                                  transition={{ duration: 0.6 }}
                                  className={`p-3 rounded-xl bg-gradient-to-br ${getTransactionColor(transaction.type)} shadow-lg`}
                                >
                                  <Icon className="w-5 h-5 text-white" />
                                </motion.div>
                                <div className="flex-1">
                                  <p className="font-semibold mb-1 group-hover:text-primary transition-colors">
                                    {transaction.description}
                                  </p>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {transaction.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {transaction.time}
                                    </span>
                                    <Badge variant="secondary" className="text-xs">
                                      {transaction.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`text-xl font-bold mb-1 ${
                                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('vi-VN')}đ
                                </p>
                                {transaction.points > 0 && (
                                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                                    <Star className="w-3 h-3 mr-1" />
                                    +{transaction.points}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            {/* Rewards Section - Enhanced */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm sticky top-24">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                      <Gift className="w-5 h-5 text-white" />
                    </div>
                    Đổi thưởng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                  {rewards.map((reward, idx) => (
                    <motion.div
                      key={reward.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <Card className={`border-border/50 bg-gradient-to-br from-background/50 to-card/30 hover:shadow-lg transition-all cursor-pointer ${
                        !reward.available ? 'opacity-50' : ''
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${reward.color} shadow-lg`}>
                              <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-lg">{reward.title}</h4>
                              <p className="text-xs text-muted-foreground">{reward.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-border/50">
                            <Badge className={`bg-gradient-to-r ${reward.color} text-white border-0 shadow-md`}>
                              <Coins className="w-3 h-3 mr-1" />
                              {reward.points} điểm
                            </Badge>
                            <Button
                              size="sm"
                              disabled={!reward.available || loyaltyPoints < reward.points}
                              className={reward.available && loyaltyPoints >= reward.points ? `bg-gradient-to-r ${reward.color} hover:opacity-90` : ''}
                            >
                              {reward.available ? 'Đổi ngay' : 'Sắp có'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default WalletPage;