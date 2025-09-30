import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wallet2, CreditCard, Gift, History, Plus, TrendingUp, Star, Coins, Wallet } from "lucide-react";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";

const WalletPage = () => {
  const balance = 2450000;
  const loyaltyPoints = 850;
  const nextRewardAt = 1000;

  const transactions = [
    { id: 1, type: "purchase", amount: -150000, description: "Mua áo thun Basic Tee", date: "2024-01-15", points: 15 },
    { id: 2, type: "topup", amount: 500000, description: "Nạp tiền từ ngân hàng", date: "2024-01-14", points: 0 },
    { id: 3, type: "reward", amount: 50000, description: "Phần thưởng sinh nhật", date: "2024-01-10", points: 50 },
    { id: 4, type: "purchase", amount: -250000, description: "Mua giày sneaker", date: "2024-01-08", points: 25 },
  ];

  const rewards = [
    { id: 1, title: "Giảm 10%", points: 100, description: "Cho đơn hàng từ 500K" },
    { id: 2, title: "Miễn phí ship", points: 50, description: "Áp dụng toàn quốc" },
    { id: 3, title: "Giảm 50K", points: 200, description: "Cho đơn hàng từ 1M" },
    { id: 4, title: "Quà tặng", points: 500, description: "Túi canvas cao cấp" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Ví điện tử & Điểm thưởng</h1>
            <p className="text-muted-foreground">Quản lý số dư và tích lũy điểm thưởng</p>
          </div> */}

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h1 className="md:text-4xl text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Ví điện tử & Điểm thưởng
              </h1>
            </div>
            <p className="text-muted-foreground md:text-lg text-base">
              Quản lý số dư và tích lũy điểm thưởng
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Balance Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Số dư ví</CardTitle>
                  <Wallet2 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {balance.toLocaleString('vi-VN')} đ
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">
                      <Plus className="w-4 h-4 mr-1" />
                      Nạp tiền
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <CreditCard className="w-4 h-4 mr-1" />
                      Rút tiền
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Loyalty Points Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Điểm thưởng</CardTitle>
                  <Star className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">{loyaltyPoints} điểm</div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Đến phần thưởng tiếp theo</span>
                      <span>{loyaltyPoints}/{nextRewardAt}</span>
                    </div>
                    <Progress value={(loyaltyPoints / nextRewardAt) * 100} className="h-1" />
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-4">
                    <Gift className="w-4 h-4 mr-1" />
                    Đổi thưởng
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Thống kê tháng</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">12 giao dịch</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tăng 25% so với tháng trước
                  </p>
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Chi tiêu:</span>
                      <span className="font-medium">1.2M đ</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Điểm tích lũy:</span>
                      <span className="font-medium">120 điểm</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaction History */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Lịch sử giao dịch
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${transaction.type === 'purchase' ? 'bg-red-100 text-red-600' :
                            transaction.type === 'topup' ? 'bg-green-100 text-green-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                            {transaction.type === 'purchase' ? <CreditCard className="w-4 h-4" /> :
                              transaction.type === 'topup' ? <Plus className="w-4 h-4" /> :
                                <Gift className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-sm ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('vi-VN')} đ
                          </p>
                          {transaction.points > 0 && (
                            <p className="text-xs text-amber-600">+{transaction.points} điểm</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Rewards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    Phần thưởng có thể đổi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rewards.map((reward) => (
                      <div key={reward.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                            <Coins className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{reward.title}</p>
                            <p className="text-xs text-muted-foreground">{reward.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="mb-1">
                            {reward.points} điểm
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            className="block"
                            disabled={loyaltyPoints < reward.points}
                          >
                            Đổi
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
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