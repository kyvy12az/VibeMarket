import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Prize } from '@/lib/luckyWheelUtils';
import { 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Crown,
  Star,
  Gem,
  Gift
} from 'lucide-react';

interface RewardListProps {
  prizes: Prize[];
}

const rarityConfig = {
  common: {
    gradient: 'from-gray-500 to-gray-600',
    borderColor: 'border-gray-500/30',
    bgGradient: 'from-gray-500/10 to-gray-600/10',
    glowColor: 'gray-500/40',
    label: 'Phổ biến',
    icon: Gift,
  },
  rare: {
    gradient: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/30',
    bgGradient: 'from-blue-500/10 to-cyan-500/10',
    glowColor: 'blue-500/40',
    label: 'Hiếm',
    icon: Star,
  },
  epic: {
    gradient: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-500/30',
    bgGradient: 'from-purple-500/10 to-pink-500/10',
    glowColor: 'purple-500/40',
    label: 'Siêu hiếm',
    icon: Gem,
  },
  legendary: {
    gradient: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-500/30',
    bgGradient: 'from-amber-500/10 to-orange-500/10',
    glowColor: 'amber-500/40',
    label: 'Huyền thoại',
    icon: Crown,
  }
};

export const RewardList = ({ prizes }: RewardListProps) => {
  // Group prizes by rarity
  const groupedPrizes = prizes.reduce((acc, prize) => {
    if (!acc[prize.rarity]) {
      acc[prize.rarity] = [];
    }
    acc[prize.rarity].push(prize);
    return acc;
  }, {} as Record<string, Prize[]>);

  const rarityOrder: Array<keyof typeof rarityConfig> = ['legendary', 'epic', 'rare', 'common'];

  return (
    <section className="mt-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header Card */}
        <Card className="border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl shadow-xl overflow-hidden mb-8">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-600 to-primary" />
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="p-3 rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg"
                >
                  <Gift className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                    Kho Phần Thưởng
                  </h2>
                  <p className="text-muted-foreground">
                    {prizes.length} phần quà đang chờ bạn khám phá
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg px-4 py-2">
                  <Crown className="w-4 h-4 mr-2" />
                  {groupedPrizes.legendary?.length || 0} Huyền thoại
                </Badge>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg px-4 py-2">
                  <Gem className="w-4 h-4 mr-2" />
                  {groupedPrizes.epic?.length || 0} Siêu hiếm
                </Badge>
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg px-4 py-2">
                  <Star className="w-4 h-4 mr-2" />
                  {groupedPrizes.rare?.length || 0} Hiếm
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prizes Grid by Rarity */}
        <div className="space-y-8">
          {rarityOrder.map((rarity) => {
            const prizes = groupedPrizes[rarity];
            if (!prizes || prizes.length === 0) return null;

            const config = rarityConfig[rarity];
            const RarityIcon = config.icon;

            return (
              <motion.div
                key={rarity}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Rarity Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${config.gradient} shadow-lg`}>
                    <RarityIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{config.label}</h3>
                  <Badge className={`bg-gradient-to-r ${config.gradient} text-white border-0`}>
                    {prizes.length} phần quà
                  </Badge>
                </div>

                {/* Prizes Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {prizes.map((prize, index) => (
                    <motion.div
                      key={prize.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -8 }}
                      className="group"
                    >
                      <Card className={`relative overflow-hidden border-2 ${config.borderColor} bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm hover:shadow-2xl transition-all duration-300`}>
                        {/* Glow Effect */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />

                        {/* Top Border */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`} />

                        {/* Rarity Badge */}
                        <div className="absolute top-2 right-2 z-10">
                          <Badge className={`bg-gradient-to-r ${config.gradient} text-white border-0 shadow-lg text-xs px-2 py-1`}>
                            <RarityIcon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                        </div>

                        <CardContent className="p-6 text-center relative">
                          {/* Icon with Animation */}
                          <motion.div
                            animate={{
                              rotate: [0, -10, 10, -10, 10, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 3,
                            }}
                            className="relative mb-4"
                          >
                            {/* Glow behind icon */}
                            <motion.div
                              className={`absolute inset-0 bg-gradient-to-r ${config.gradient} blur-2xl opacity-50`}
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.3, 0.6, 0.3],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                            <div className="relative text-6xl">
                              {prize.icon}
                            </div>
                          </motion.div>

                          {/* Prize Name */}
                          <h3 className="font-bold text-foreground mb-2 text-sm md:text-base group-hover:text-primary transition-colors line-clamp-2">
                            {prize.name}
                          </h3>

                          {/* Prize Value */}
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`inline-block px-3 py-1.5 rounded-full bg-gradient-to-r ${config.gradient} text-white font-bold text-sm shadow-lg mb-2`}
                          >
                            {prize.value}
                          </motion.div>

                          {/* Description */}
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {prize.description}
                          </p>

                          {/* Shine Effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 3,
                              ease: "easeInOut",
                            }}
                          />
                        </CardContent>

                        {/* Hover Particles */}
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`absolute w-1 h-1 bg-gradient-to-r ${config.gradient} rounded-full opacity-0 group-hover:opacity-100`}
                            style={{
                              top: `${25 + i * 25}%`,
                              left: `${10 + i * 20}%`,
                            }}
                            animate={{
                              y: [0, -20, 0],
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Fun Fact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="border-border/50 bg-gradient-to-br from-primary/10 via-purple-600/10 to-primary/10 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Sparkles className="w-6 h-6 text-primary" />
                <h4 className="font-bold text-lg">Bí quyết tăng tỷ lệ trúng</h4>
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                Phần thưởng <span className="font-semibold text-foreground">Huyền thoại</span> và{' '}
                <span className="font-semibold text-foreground">Siêu hiếm</span> có tỷ lệ trúng thấp hơn nhưng giá trị cao gấp nhiều lần! 
                Hãy kiên nhẫn và may mắn sẽ đến với bạn! 🍀
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
};