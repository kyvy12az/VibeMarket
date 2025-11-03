import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import Navigation from '@/components/Navigation';
// import AnimatedBackground from '@/components/AnimatedBackground';
import { Wheel } from '@/components/lucky-wheel/Wheel';
import { PrizeModal } from '@/components/lucky-wheel/PrizeModal';
import { RewardList } from '@/components/lucky-wheel/RewardList';
import { SpinHistory } from '@/components/lucky-wheel/SpinHistory';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLuckyWheel } from '@/hooks/useLuckyWheel';
import { DEFAULT_PRIZES, Prize, selectRandomPrize } from '@/lib/luckyWheelUtils';
import { useState } from 'react';

const LuckyWheel = () => {
    const {
        spinsLeft: storedSpinsLeft,
        history,
        // if your hook exposes isSpinning/handlers use them, otherwise use local state
    } = useLuckyWheel();

    const [isSpinning, setIsSpinning] = useState(false);
    const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [spinsLeft, setSpinsLeft] = useState<number>(storedSpinsLeft ?? 10);

    const handleSpinEnd = (prize: Prize) => {
        // set prize and show modal
        setCurrentPrize(prize);
        setShowModal(true);
        setIsSpinning(false);

        // decrement available spins (and persist via hook if available)
        setSpinsLeft(prev => Math.max(0, prev - 1));
        // TODO: call hook method to persist (e.g., saveDailySpins) if present
    };

    const handleSpinStart = () => {
        setIsSpinning(true);
    };

    const { width, height } = useWindowSize();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 relative overflow-hidden">

            {/* Confetti Effect */}
            {showModal && (
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={500}
                    gravity={0.3}
                />
            )}

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 mt-8"
                >
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                        🎉 Vòng Quay May Mắn – Săn Quà Cực Đỉnh 🎉
                    </h1>
                    <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto">
                        Tham gia quay mỗi ngày để nhận voucher, quà tặng và nhiều phần thưởng hấp dẫn!
                    </p>
                </motion.div>

                {/* Wheel Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center mb-8"
                >
                    <Wheel
                        prizes={DEFAULT_PRIZES}
                        onSpinComplete={handleSpinEnd}
                        isSpinning={isSpinning}
                        spinsLeft={spinsLeft}
                        onStart={handleSpinStart}
                    />
                </motion.div>

                {/* Spins Info Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8"
                >
                    <Badge className="bg-white/90 text-primary hover:bg-white text-base px-6 py-2 font-bold">
                        Còn {spinsLeft}/10 lượt quay hôm nay
                    </Badge>
                    <Button
                        disabled
                        variant="outline"
                        className="bg-white/80 border-white/50 hover:bg-white"
                    >
                        Nhận thêm lượt
                        {/* TODO: Implement feature to get more spins
              - Watch ads
              - Share on social media
              - Complete tasks
              - Purchase with points/money
            */}
                    </Button>
                    <Button
                        variant="ghost"
                        className="bg-white/10 text-white"
                        onClick={() => setSpinsLeft(10)}
                    >
                        Reset lượt (10)
                    </Button>
                </motion.div>

                {/* Rewards List */}
                <RewardList prizes={DEFAULT_PRIZES} />

                {/* Spin History */}
                <SpinHistory history={history} />

                {/* Info Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 max-w-2xl mx-auto bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6"
                >
                    <h3 className="text-xl font-bold text-white mb-3">📝 Thể lệ chương trình</h3>
                    <ul className="text-white/90 space-y-2 text-sm">
                        <li>✨ Mỗi người dùng có 3 lượt quay miễn phí mỗi ngày</li>
                        <li>🔄 Lượt quay sẽ được reset vào 00:00 hàng ngày</li>
                        <li>🎁 Phần thưởng sẽ được tự động cộng vào tài khoản</li>
                        <li>💎 Voucher có thể sử dụng ngay khi mua hàng</li>
                        <li>🎯 Tỷ lệ trúng phụ thuộc vào độ hiếm của phần thưởng</li>
                    </ul>
                </motion.div>
            </main>

            {/* Prize Modal */}
            <PrizeModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                prize={currentPrize}
            />
        </div>
    );
};

export default LuckyWheel;
