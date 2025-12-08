import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Prize } from '@/lib/luckyWheelUtils';
import { 
  Sparkles, 
  Gift, 
  Tag, 
  Star, 
  Percent, 
  Coffee, 
  Heart, 
  Zap, 
  MapPin,
  PartyPopper,
  Crown,
  Check,
  Share2,
  Download,
  Clock
} from "lucide-react";
import { toast } from 'sonner';

interface PrizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  prize: Prize | null;
  voucherCode?: string | null;
  voucherExpiry?: string | null;
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

export const PrizeModal = ({ isOpen, onClose, prize, voucherCode, voucherExpiry }: PrizeModalProps) => {
  if (!prize) return null;

  const handleClaim = () => {
    if (voucherCode) {
      // Copy voucher code to clipboard
      navigator.clipboard.writeText(voucherCode);
      toast.success("Đã sao chép mã voucher!", {
        description: `Mã ${voucherCode} đã được lưu vào clipboard`,
        action: {
          label: "Xem kho voucher",
          onClick: () => window.location.href = "/user-vouchers"
        }
      });
    } else {
      toast.success("Đã nhận thưởng thành công!", {
        description: `${prize.value} đã được thêm vào tài khoản`,
      });
    }
    onClose();
  };

  const handleCopyVoucher = () => {
    if (voucherCode) {
      navigator.clipboard.writeText(voucherCode);
      toast.success("Đã sao chép mã voucher!");
    }
  };

  const handleShare = () => {
    toast.success("Đã sao chép link chia sẻ!");
  };

  const IconComp = typeof prize.icon === "string" ? iconMap[prize.icon.toLowerCase()] : null;

  const prizeValue = parseInt(prize.value.replace(/[^\d]/g, '')) || 0;
  const isHighValue = prizeValue >= 50000;
  const isSpecial = prizeValue >= 100000;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg border-0 p-0 overflow-hidden bg-transparent">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <Card className="border-0 shadow-2xl overflow-hidden relative">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-600/20 to-primary/20" />
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${
                isSpecial 
                  ? 'from-amber-500/30 via-orange-500/30 to-amber-500/30'
                  : isHighValue
                  ? 'from-green-500/30 via-emerald-500/30 to-green-500/30'
                  : 'from-primary/30 via-purple-600/30 to-primary/30'
              } blur-3xl`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Top Decoration */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${
              isSpecial
                ? 'from-amber-500 via-orange-500 to-amber-500'
                : isHighValue
                ? 'from-green-500 via-emerald-500 to-green-500'
                : 'from-primary via-purple-600 to-primary'
            }`} />

            {/* Floating Particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 rounded-full ${
                  isSpecial ? 'bg-amber-500/60' : 'bg-primary/60'
                }`}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}

            <CardContent className="p-8 relative">
              {/* Header Badges */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <AnimatePresence>
                  {isSpecial && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: 0.2 }}
                    >
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg px-3 py-1">
                        <Crown className="w-4 h-4 mr-1" />
                        Siêu Phẩm
                      </Badge>
                    </motion.div>
                  )}
                  {isHighValue && !isSpecial && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: 0.2 }}
                    >
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg px-3 py-1">
                        <Sparkles className="w-4 h-4 mr-1" />
                        Giá trị cao
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.3 }}
                >
                  <Badge className="bg-primary/20 text-primary border border-primary/30 px-3 py-1">
                    <PartyPopper className="w-4 h-4 mr-1" />
                    Chúc mừng
                  </Badge>
                </motion.div>
              </div>

              {/* Prize Icon with Enhanced Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: 1,
                  rotate: 0,
                }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1
                }}
                className="relative mb-6"
              >
                {/* Glow Effect */}
                <motion.div
                  className={`absolute inset-0 blur-3xl ${
                    isSpecial
                      ? 'bg-gradient-to-r from-amber-500/60 to-orange-500/60'
                      : isHighValue
                      ? 'bg-gradient-to-r from-green-500/60 to-emerald-500/60'
                      : 'bg-gradient-to-r from-primary/60 to-purple-600/60'
                  }`}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 0.9, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Icon Container */}
                <motion.div
                  animate={{ 
                    rotate: [0, -10, 10, -10, 10, 0],
                    scale: [1, 1.1, 1, 1.1, 1, 1]
                  }}
                  transition={{ 
                    duration: 0.8, 
                    repeat: 3,
                    ease: "easeInOut",
                    delay: 0.3
                  }}
                  className="relative"
                >
                  {/* Rotating Ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className={`absolute inset-0 rounded-full border-4 ${
                      isSpecial
                        ? 'border-amber-500/30'
                        : isHighValue
                        ? 'border-green-500/30'
                        : 'border-primary/30'
                    }`}
                  />

                  <div className={`relative mx-auto w-32 h-32 rounded-full bg-gradient-to-br ${
                    isSpecial
                      ? 'from-amber-500/20 to-orange-500/20'
                      : isHighValue
                      ? 'from-green-500/20 to-emerald-500/20'
                      : 'from-primary/20 to-purple-600/20'
                  } flex items-center justify-center border-4 ${
                    isSpecial
                      ? 'border-amber-500/40'
                      : isHighValue
                      ? 'border-green-500/40'
                      : 'border-primary/40'
                  } shadow-2xl`}>
                    {IconComp ? (
                      <IconComp className={`w-16 h-16 ${
                        isSpecial
                          ? 'text-amber-500'
                          : isHighValue
                          ? 'text-green-500'
                          : 'text-primary'
                      }`} />
                    ) : (
                      <span className="text-7xl">
                        {typeof prize.icon === "string" ? prize.icon : prize.icon}
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Orbiting Stars */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 4 + i,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.2,
                    }}
                  >
                    <motion.div
                      style={{
                        x: Math.cos((i * 60 * Math.PI) / 180) * 80,
                        y: Math.sin((i * 60 * Math.PI) / 180) * 80,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    >
                      <Star className={`w-4 h-4 ${
                        isSpecial ? 'text-amber-500' : 'text-primary'
                      } fill-current`} />
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <DialogTitle className="text-3xl md:text-4xl font-bold mb-3 text-center bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                  Chúc mừng bạn! 🎉
                </DialogTitle>
              </motion.div>

              {/* Prize Info Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Card className={`mb-6 border-2 ${
                  isSpecial
                    ? 'border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10'
                    : isHighValue
                    ? 'border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10'
                    : 'border-primary/30 bg-gradient-to-br from-primary/10 to-purple-600/10'
                }`}>
                  <CardContent className="p-6 text-center space-y-3">
                    <DialogDescription className="text-lg text-foreground">
                      Bạn đã trúng giải:
                    </DialogDescription>
                    
                    <h3 className="text-2xl font-bold text-foreground">
                      {prize.name}
                    </h3>

                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${
                        isSpecial
                          ? 'from-amber-500 to-orange-500'
                          : isHighValue
                          ? 'from-green-500 to-emerald-500'
                          : 'from-primary to-purple-600'
                      } text-white font-bold text-2xl shadow-lg`}
                    >
                      {prize.value}
                    </motion.div>

                    <p className="text-muted-foreground text-sm pt-2">
                      {prize.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Voucher Code Section - Only show if voucherCode exists */}
              {voucherCode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.55 }}
                  className="mb-6"
                >
                  <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <Tag className="w-5 h-5" />
                        <span className="font-semibold">Mã Voucher của bạn</span>
                      </div>
                      
                      <div 
                        onClick={handleCopyVoucher}
                        className="bg-white/50 border-2 border-dashed border-green-500/50 rounded-lg p-4 cursor-pointer hover:bg-white/70 transition-colors"
                      >
                        <code className="text-2xl font-mono font-bold text-green-600 block text-center">
                          {voucherCode}
                        </code>
                        <p className="text-xs text-center text-muted-foreground mt-2">
                          👆 Click để sao chép
                        </p>
                      </div>

                      {voucherExpiry && (
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>
                            HSD: {new Date(voucherExpiry).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-green-500/30 hover:bg-green-500/10"
                        onClick={() => window.location.href = '/user-vouchers'}
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Xem kho voucher
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <Button 
                  className={`w-full h-14 text-lg font-bold shadow-xl bg-gradient-to-r ${
                    isSpecial
                      ? 'from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600'
                      : isHighValue
                      ? 'from-green-500 via-emerald-500 to-green-500 hover:from-green-600 hover:to-emerald-600'
                      : 'from-primary via-purple-600 to-primary hover:from-purple-700 hover:to-cyan-600'
                  }`}
                  onClick={handleClaim}
                >
                  <Check className="w-6 h-6 mr-2" />
                  Nhận thưởng ngay
                  <Sparkles className="w-6 h-6 ml-2" />
                </Button>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 border-2 hover:border-primary hover:bg-primary/5"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Chia sẻ
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 border-2 hover:border-primary hover:bg-primary/5"
                    onClick={onClose}
                  >
                    Đóng
                  </Button>
                </div>
              </motion.div>

              {/* Footer Note */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4 text-amber-500" />
                Phần thưởng sẽ được thêm vào ví của bạn
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};