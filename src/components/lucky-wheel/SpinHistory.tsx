import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SpinHistory as SpinHistoryType } from '@/lib/luckyWheelUtils';
import { format } from 'date-fns';

interface SpinHistoryProps {
  history: SpinHistoryType[];
}

export const SpinHistory = ({ history }: SpinHistoryProps) => {
  if (history.length === 0) {
    return (
      <section className="mt-12 container mx-auto px-4">
        <Card className="bg-white/10 backdrop-blur border-white/20 p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            📜 Lịch sử quay gần đây
          </h3>
          <p className="text-white/70 text-center py-8">
            Chưa có lịch sử quay nào. Hãy bắt đầu quay thử vận may! 🍀
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section className="mt-12 container mx-auto px-4">
      <Card className="bg-white/10 backdrop-blur border-white/20 p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          📜 Lịch sử quay gần đây
        </h3>
        
        <div className="space-y-3">
          {history.slice(0, 5).map((item, index) => (
            <motion.div
              key={`${item.timestamp}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between bg-white/20 backdrop-blur rounded-lg p-4 hover:bg-white/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{item.prize.icon}</span>
                <div>
                  <p className="font-medium text-white">{item.prize.name}</p>
                  <p className="text-sm text-white/70">
                    {format(new Date(item.timestamp), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-500 hover:bg-green-600 text-white">
                {item.prize.value}
              </Badge>
            </motion.div>
          ))}
        </div>
      </Card>
    </section>
  );
};
