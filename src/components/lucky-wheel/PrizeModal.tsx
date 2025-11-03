import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Prize } from '@/lib/luckyWheelUtils';
import { Sparkles, Gift, Tag, Star, Percent, Coffee, Heart, Zap, MapPin } from "lucide-react";

interface PrizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  prize: Prize | null;
}

const iconMap: Record<string, any> = {
  gift: Gift,
  tag: Tag,
  star: Star,
  percent: Percent,
  coffee: Coffee,
  heart: Heart,
  zap: Zap,
  pin: MapPin,
  sparkles: Sparkles,
};

export const PrizeModal = ({ isOpen, onClose, prize }: PrizeModalProps) => {
  if (!prize) return null;

  const handleClaim = () => {
    // TODO: Implement claim reward logic
    // - Call API to add reward to user account
    // - Update user's wallet/vouchers
    // - Show success notification
    onClose();
  };

  const IconComp = typeof prize.icon === "string" ? iconMap[prize.icon.toLowerCase()] : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-6"
        >
          {/* Prize Icon with shake animation */}
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ 
              duration: 0.6, 
              repeat: 2,
              ease: "easeInOut"
            }}
            className="text-8xl mb-4"
          >
            {IconComp ? <IconComp className="w-16 h-16 mx-auto" /> : (typeof prize.icon === "string" ? prize.icon : prize.icon)}
          </motion.div>

          <DialogTitle className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
            Chúc mừng! 🎉
          </DialogTitle>

          <DialogDescription className="text-lg mb-4">
            Bạn đã trúng: <strong className="text-foreground">{prize.name}</strong>
          </DialogDescription>

          <div className="mb-2 text-xl font-semibold text-primary">
            {prize.value}
          </div>

          <p className="text-muted-foreground mb-6 text-sm">
            {prize.description}
          </p>

          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600" 
              onClick={handleClaim}
            >
              Nhận thưởng
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Đóng
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
