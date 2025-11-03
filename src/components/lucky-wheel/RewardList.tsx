import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Prize } from '@/lib/luckyWheelUtils';

interface RewardListProps {
  prizes: Prize[];
}

const rarityColors = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500'
};

const rarityLabels = {
  common: 'Phổ biến',
  rare: 'Hiếm',
  epic: 'Siêu hiếm',
  legendary: 'Huyền thoại'
};

export const RewardList = ({ prizes }: RewardListProps) => {
  return (
    <section className="mt-16 container mx-auto px-4">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold text-white text-center mb-8"
      >
        🎁 Phần thưởng có thể nhận được
      </motion.h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {prizes.map((prize, index) => (
          <motion.div
            key={prize.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className="bg-white/90 backdrop-blur border-none p-6 text-center shadow-lg hover:shadow-2xl transition-all">
              <div className="text-5xl mb-3">{prize.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">
                {prize.name}
              </h3>
              <p className="text-sm text-primary font-bold mb-2">
                {prize.value}
              </p>
              <Badge className={`${rarityColors[prize.rarity]} text-white text-xs`}>
                {rarityLabels[prize.rarity]}
              </Badge>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
