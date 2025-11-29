import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SpinHistory as SpinHistoryType } from '@/lib/luckyWheelUtils';
import { format } from 'date-fns';
import { 
  History, 
  Calendar, 
  Clock, 
  Trophy,
  Sparkles,
  Gift,
  Star,
  TrendingUp,
  Award,
  PartyPopper
} from 'lucide-react';

interface SpinHistoryProps {
  history: SpinHistoryType[];
}

export const SpinHistory = ({ history }: SpinHistoryProps) => {
  if (history.length === 0) {
    return (
      <section className="mt-12">
        <Card className="border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl shadow-xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-600 to-primary" />
          <CardContent className="p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-600/30 blur-2xl rounded-full" />
                <div className="relative p-6 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 border-2 border-primary/30">
                  <History className="w-20 h-20 text-primary" />
                </div>
              </div>
            </motion.div>
            
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
              Lịch sử quay thưởng
            </h3>
            <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
              Chưa có lịch sử quay nào. Hãy bắt đầu quay để săn quà ngay! 🍀
            </p>
            
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Mỗi lần quay đều có cơ hội trúng</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Calculate stats
  const totalValue = history.reduce((sum, item) => {
    const value = parseInt(item.prize.value.replace(/[^\d]/g, '')) || 0;
    return sum + value;
  }, 0);

  const recentWins = history.slice(0, 5);
  const bestPrize = history.reduce((max, item) => {
    const value = parseInt(item.prize.value.replace(/[^\d]/g, '')) || 0;
    const maxValue = parseInt(max.prize.value.replace(/[^\d]/g, '')) || 0;
    return value > maxValue ? item : max;
  });

  return (
    <section className="mt-12 space-y-6">
      {/* Header Card */}
      <Card className="border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl shadow-xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-600 to-primary" />
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Title */}
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="p-3 rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg"
              >
                <History className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                  Lịch sử quay thưởng
                </h3>
                <p className="text-sm text-muted-foreground">
                  {history.length} lượt quay gần đây
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg px-4 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                Tổng giá trị: {totalValue.toLocaleString('vi-VN')}đ
              </Badge>
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                {history.length} giải thưởng
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Prize Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-border/50 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/10 backdrop-blur-xl shadow-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-amber-500 opacity-30" />
            </motion.div>
          </div>

          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Giải thưởng lớn nhất</h4>
                <p className="text-xs text-muted-foreground">Phần quà có giá trị cao nhất bạn đã trúng</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-background/50 to-card/30 border border-amber-500/20">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{bestPrize.prize.icon}</div>
                <div>
                  <p className="font-bold text-xl mb-1">{bestPrize.prize.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(bestPrize.timestamp), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg text-lg px-4 py-2">
                <Star className="w-5 h-5 mr-2" />
                {bestPrize.prize.value}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* History List */}
      <Card className="border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl shadow-xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-600 to-primary" />
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-lg">Lượt quay gần đây</h4>
          </div>

          <div className="space-y-3">
            {recentWins.map((item, index) => {
              const value = parseInt(item.prize.value.replace(/[^\d]/g, '')) || 0;
              const isHighValue = value >= 50000;

              return (
                <motion.div
                  key={`${item.timestamp}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="group"
                >
                  <Card className={`border-border/50 bg-gradient-to-br from-background/50 to-card/30 hover:shadow-lg transition-all cursor-pointer overflow-hidden ${
                    isHighValue ? 'border-amber-500/30' : ''
                  }`}>
                    {isHighValue && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500" />
                    )}
                    
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        {/* Left Side */}
                        <div className="flex items-center gap-4 flex-1">
                          {/* Icon */}
                          <motion.div
                            whileHover={{ rotate: 360, scale: 1.2 }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                          >
                            <div className={`absolute inset-0 blur-xl ${
                              isHighValue 
                                ? 'bg-gradient-to-br from-amber-500/40 to-orange-500/40' 
                                : 'bg-gradient-to-br from-primary/40 to-purple-600/40'
                            }`} />
                            <div className="relative text-5xl">{item.prize.icon}</div>
                          </motion.div>

                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-lg group-hover:text-primary transition-colors">
                                {item.prize.name}
                              </p>
                              {isHighValue && (
                                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Giá trị cao
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {format(new Date(item.timestamp), 'dd/MM/yyyy')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {format(new Date(item.timestamp), 'HH:mm:ss')}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                #{index + 1}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Right Side - Value Badge */}
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Badge className={`${
                            isHighValue
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                              : 'bg-gradient-to-r from-green-500 to-emerald-500'
                          } text-white border-0 shadow-lg text-base px-4 py-2 font-bold`}>
                            <Gift className="w-4 h-4 mr-2" />
                            {item.prize.value}
                          </Badge>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* View More */}
          {history.length > 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-center"
            >
              <button className="text-primary hover:text-purple-600 font-semibold text-sm flex items-center gap-2 mx-auto group">
                Xem tất cả {history.length} lượt quay
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <TrendingUp className="w-4 h-4" />
                </motion.div>
              </button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Fun Fact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="border-border/50 bg-gradient-to-br from-primary/10 via-purple-600/10 to-primary/10 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <PartyPopper className="w-8 h-8 mx-auto mb-3 text-primary" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Mẹo nhỏ:</span> Hãy quay vào những khung giờ vàng để tăng cơ hội trúng giải lớn! 🍀
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};