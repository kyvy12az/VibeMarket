import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Wheel } from '@/components/lucky-wheel/Wheel';
import { PrizeModal } from '@/components/lucky-wheel/PrizeModal';
import { RewardList } from '@/components/lucky-wheel/RewardList';
import { SpinHistory } from '@/components/lucky-wheel/SpinHistory';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLuckyWheel } from '@/hooks/useLuckyWheel';
import { DEFAULT_PRIZES, Prize } from '@/lib/luckyWheelUtils';
import { 
    Sparkles, 
    Gift, 
    Star, 
    Zap, 
    TrendingUp, 
    Clock, 
    Crown,
    Award,
    Flame,
    RefreshCw,
    PartyPopper,
    Trophy,
    Heart
} from 'lucide-react';

const LuckyWheel = () => {
    // Sử dụng hook - Tất cả logic được xử lý trong hook
    const {
        spinsLeft,
        history,
        isSpinning,
        showModal,
        setShowModal,
        currentPrize,
        showConfetti,
        handleSpin,
        resetSpins,
        voucherCode,
        voucherExpiry
    } = useLuckyWheel();

    const { width, height } = useWindowSize();
    const totalSpins = 1;
    const progressPercentage = ((totalSpins - spinsLeft) / totalSpins) * 100;

    // Handler khi vòng quay kết thúc - Gọi handleSpin từ hook
    const handleSpinComplete = async (prize: Prize) => {
        await handleSpin(prize);
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Enhanced Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
                
                {/* Multiple animated orbs */}
                <motion.div
                    className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary/30 via-purple-600/30 to-primary/30 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-purple-600/30 via-pink-500/30 to-primary/30 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, -30, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-primary/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.1, 0.3, 0.1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Animated grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary),0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

                {/* Floating particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/30 rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Confetti Effect - Controlled by hook */}
            {showConfetti && (
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={500}
                    gravity={0.3}
                    colors={['#8B5CF6', '#A855F7', '#7C3AED', '#6D28D9', '#F59E0B', '#F97316']}
                />
            )}

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 relative z-10">
                {/* Enhanced Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 mt-8"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <PartyPopper className="w-12 h-12 text-primary" />
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                            Vòng Quay May Mắn
                        </h1>
                        <motion.div
                            animate={{ rotate: [360, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <Trophy className="w-12 h-12 text-amber-500" />
                        </motion.div>
                    </div>
                    
                    <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto mb-6">
                        Quay thật mạnh để săn ngay voucher, quà tặng và hàng ngàn phần thưởng cực khủng! 🎁
                    </p>

                    {/* Stats Row */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0 shadow-lg px-4 py-2">
                            <Flame className="w-4 h-4 mr-2" />
                            <span className="font-bold">HOT</span> nhất hôm nay
                        </Badge>
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg px-4 py-2">
                            <Trophy className="w-4 h-4 mr-2" />
                            {history.length.toLocaleString()} lượt đã quay
                        </Badge>
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg px-4 py-2">
                            <Gift className="w-4 h-4 mr-2" />
                            {DEFAULT_PRIZES.length} phần quà
                        </Badge>
                    </div>
                </motion.div>

                {/* Spins Info Card - Enhanced */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-4xl mx-auto mb-8"
                >
                    <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl shadow-2xl">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-600 to-primary" />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-600/5" />
                        
                        <CardContent className="p-8 relative">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                {/* Spins Info */}
                                <div className="flex-1 space-y-4 w-full">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="p-3 rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg"
                                            >
                                                <Zap className="w-6 h-6 text-white" />
                                            </motion.div>
                                            <div>
                                                <h3 className="text-2xl font-bold">Lượt quay của bạn</h3>
                                                <p className="text-sm text-muted-foreground">Reset vào 00:00 hàng ngày</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                                    {spinsLeft}
                                                </span>
                                                <span className="text-2xl text-muted-foreground">/{totalSpins}</span>
                                            </div>
                                            <Badge className="mt-2 bg-primary/20 text-primary">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Hôm nay
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Đã sử dụng</span>
                                            <span className="font-semibold">{totalSpins - spinsLeft}/{totalSpins} lượt</span>
                                        </div>
                                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progressPercentage}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className="h-full bg-gradient-to-r from-primary via-purple-600 to-primary"
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-3">
                                        <Button
                                            disabled
                                            size="lg"
                                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 shadow-lg"
                                        >
                                            <Star className="w-5 h-5 mr-2" />
                                            Nhận thêm lượt
                                            <Badge className="ml-2 bg-white/20">Soon</Badge>
                                        </Button>
                                        {/* <Button
                                            variant="outline"
                                            size="lg"
                                            className="border-2 hover:border-primary hover:bg-primary/5"
                                            onClick={() => resetSpins(1)}
                                        >
                                            <RefreshCw className="w-5 h-5 mr-2" />
                                            Reset (1 lượt)
                                        </Button> */}
                                    </div>
                                </div>

                                {/* Bonus Info */}
                                <div className="w-full md:w-64">
                                    <Card className="border-border/50 bg-gradient-to-br from-amber-500/10 to-orange-500/10">
                                        <CardContent className="p-6 space-y-3">
                                            <div className="flex items-center gap-2 text-amber-500">
                                                <Crown className="w-5 h-5" />
                                                <span className="font-bold">Đặc quyền VIP</span>
                                            </div>
                                            <ul className="space-y-2 text-sm text-muted-foreground">
                                                <li className="flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-primary" />
                                                    +5 lượt quay thêm
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4 text-primary" />
                                                    Tăng 2x tỷ lệ trúng
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Gift className="w-4 h-4 text-primary" />
                                                    Quà độc quyền
                                                </li>
                                            </ul>
                                            <Button size="sm" className="w-full bg-gradient-to-r from-amber-500 to-orange-500">
                                                <Crown className="w-4 h-4 mr-2" />
                                                Nâng cấp VIP
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Wheel Section - Enhanced */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="flex justify-center mb-12 relative"
                >
                    {/* Decorative rings */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="w-[600px] h-[600px] rounded-full border-2 border-primary/20"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[650px] h-[650px] rounded-full border border-purple-600/20"
                        />
                    </div>

                    {/* Wheel Container */}
                    <Card className="relative border-border/50 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm shadow-2xl rounded-3xl overflow-visible">
                        <CardContent className="p-8">
                            <Wheel
                                prizes={DEFAULT_PRIZES}
                                onSpinComplete={handleSpinComplete}
                                isSpinning={isSpinning}
                                spinsLeft={spinsLeft}
                            />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Rewards List - Enhanced */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <RewardList prizes={DEFAULT_PRIZES} />
                </motion.div>

                {/* Spin History - Enhanced */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8"
                >
                    <SpinHistory history={history} />
                </motion.div>

                {/* Enhanced Info Box */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 max-w-4xl mx-auto"
                >
                    <Card className="border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl shadow-xl overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-600 to-primary" />
                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold">Thể lệ chương trình</h3>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-primary flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        Cách chơi
                                    </h4>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            Mỗi người dùng có 1 lượt quay miễn phí mỗi ngày
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            Nhấn nút "QUAY NGAY" để bắt đầu
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            Chờ vòng quay dừng để nhận giải thưởng
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            Phần thưởng tự động cộng vào tài khoản
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-semibold text-primary flex items-center gap-2">
                                        <Gift className="w-4 h-4" />
                                        Quy định
                                    </h4>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            Lượt quay reset vào 00:00 hàng ngày
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            Voucher có hạn sử dụng 30 ngày
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            Tỷ lệ trúng phụ thuộc độ hiếm
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            Không giới hạn số lần trúng thưởng
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Call to action */}
                            <div className="mt-8 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Heart className="w-5 h-5 text-red-500" />
                                    <p className="text-sm text-muted-foreground">
                                        Chúc bạn may mắn và nhận được nhiều phần quà giá trị!
                                    </p>
                                </div>
                                <Button className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-lg">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Chia sẻ với bạn bè
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>

            {/* Prize Modal - Controlled by hook */}
            <PrizeModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                prize={currentPrize}
                voucherCode={voucherCode}
                voucherExpiry={voucherExpiry}
            />
        </div>
    );
};

export default LuckyWheel;