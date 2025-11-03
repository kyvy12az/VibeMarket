import { motion, useAnimationControls } from "framer-motion";
import { Prize, calculateRotation } from "@/lib/luckyWheelUtils";
import { Sparkles, Gift, Tag, Star, Percent, Coffee, Heart, Zap, MapPin } from "lucide-react";
import { useRef } from "react";

interface WheelProps {
    prizes: Prize[];
    onSpinComplete: (prize: Prize) => void;
    isSpinning?: boolean;
    spinsLeft: number;
    onStart?: () => void;           // <-- new
    onEnd?: (prize: Prize) => void; // <-- new
}

const ICON_SIZE = 28; // size inside SVG viewBox (400x400)

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

export const Wheel = ({
    prizes,
    onSpinComplete,
    isSpinning,
    spinsLeft,
    onStart,
    onEnd,
}: WheelProps) => {
    const controls = useAnimationControls();
    const rotationAccum = useRef<number>(0); // accumulate absolute rotation so animation is smooth every spin

    const handleSpin = async () => {
        if (isSpinning || spinsLeft <= 0) return;

        // notify parent spin started
        onStart?.();

        const winningIndex = Math.floor(Math.random() * prizes.length);
        const winningPrize = prizes[winningIndex];
        const deltaDegrees = calculateRotation(winningIndex, prizes);
        const targetRotation = rotationAccum.current + deltaDegrees;
        rotationAccum.current = targetRotation;

        await controls.start({
            rotate: targetRotation,
            transition: {
                duration: 4,
                ease: [0.22, 1, 0.36, 1],
            },
        });

        // small settle
        await controls.start({
            rotate: targetRotation,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 1,
                duration: 0.5,
            },
        });

        // notify parent the spin finished and pass prize
        onEnd?.(winningPrize);
        onSpinComplete(winningPrize);
    };

    return (
        <div className="relative flex flex-col items-center justify-center p-6">
            {/* Decorative glow around the wheel */}
            <div className="absolute w-[520px] h-[520px] rounded-full bg-gradient-to-r from-fuchsia-500/30 via-cyan-400/30 to-indigo-500/30 blur-3xl animate-pulse" />

            {/* Pointer */}
            <div className="absolute top-[8px] z-30">
                <div
                    className="w-0 h-0 border-l-[18px] border-r-[18px] border-t-[40px]
                    border-l-transparent border-r-transparent border-t-yellow-400
                    drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
                />
            </div>

            {/* Wheel */}
            <div className="relative w-[340px] h-[340px] md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px]">
                <motion.div
                    animate={controls}
                    className="absolute inset-0"
                    style={{
                        transformOrigin: "center",
                        willChange: "transform",
                        backfaceVisibility: "hidden",
                    }}
                >
                    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl">
                        <defs>
                            <radialGradient id="wheelGradient" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#fff" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </radialGradient>
                        </defs>

                        {/* Outer ring */}
                        <circle cx="200" cy="200" r="195" fill="url(#wheelGradient)" />

                        {/* Segments */}
                        {prizes.map((prize, index) => {
                            const segmentAngle = 360 / prizes.length;
                            const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
                            const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
                            const middleAngle = ((index + 0.5) * segmentAngle - 90) * (Math.PI / 180);

                            const x1 = 200 + Math.cos(startAngle) * 185;
                            const y1 = 200 + Math.sin(startAngle) * 185;
                            const x2 = 200 + Math.cos(endAngle) * 185;
                            const y2 = 200 + Math.sin(endAngle) * 185;
                            const largeArcFlag = segmentAngle > 180 ? 1 : 0;

                            // vị trí text/icon nằm trong từng phần
                            const labelRadius = 120; // khoảng cách từ tâm đến text
                            const iconRadius = 95;   // khoảng cách từ tâm đến icon
                            const textX = 200 + Math.cos(middleAngle) * labelRadius;
                            const textY = 200 + Math.sin(middleAngle) * labelRadius;
                            const iconX = 200 + Math.cos(middleAngle) * iconRadius;
                            const iconY = 200 + Math.sin(middleAngle) * iconRadius;

                            // determine icon component from prize.icon (string key) or fallback
                            const IconComp = prize.icon && typeof prize.icon === "string"
                                ? iconMap[prize.icon.toLowerCase()]
                                : null;

                            return (
                                <g key={prize.id}>
                                    <path
                                        d={`M 200 200 L ${x1} ${y1} A 185 185 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                                        fill={index % 2 === 0 ? '#8B5CF6' : '#06B6D4'}
                                        stroke="white"
                                        strokeWidth="2"
                                    />

                                    {/* icon: use foreignObject to render React SVG icon inside the svg */}
                                    {IconComp ? (
                                        <foreignObject
                                            x={iconX - ICON_SIZE / 2}
                                            y={iconY - ICON_SIZE / 2}
                                            width={ICON_SIZE}
                                            height={ICON_SIZE}
                                            style={{ overflow: "visible" }}
                                        >
                                            <div xmlns="http://www.w3.org/1999/xhtml" className="flex items-center justify-center">
                                                <IconComp className="w-6 h-6 text-white" />
                                            </div>
                                        </foreignObject>
                                    ) : (
                                        <text
                                            x={iconX}
                                            y={iconY}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fontSize="26"
                                            fill="white"
                                        >
                                            {prize.icon}
                                        </text>
                                    )}

                                    {/* text */}
                                    <text
                                        x={textX}
                                        y={textY}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fontSize="12"
                                        fontWeight="600"
                                        fill="white"
                                        transform={`rotate(${index * segmentAngle + segmentAngle / 2}, ${textX}, ${textY})`}
                                    >
                                        {prize.name}
                                    </text>
                                </g>
                            );
                        })}


                        {/* Center circle */}
                        <circle
                            cx="200"
                            cy="200"
                            r="60"
                            fill="white"
                            stroke="#9333EA"
                            strokeWidth="3"
                        />
                    </svg>
                </motion.div>

                {/* Center Button */}
                <motion.button
                    onClick={handleSpin}
                    disabled={isSpinning || spinsLeft <= 0}
                    whileHover={
                        !isSpinning && spinsLeft > 0
                            ? { scale: 1.1, rotate: 2 }
                            : {}
                    }
                    whileTap={
                        !isSpinning && spinsLeft > 0
                            ? { scale: 0.95, rotate: -2 }
                            : {}
                    }
                    animate={{
                        boxShadow: isSpinning
                            ? "0 0 0 rgba(251,191,36,0)"
                            : "0 0 25px rgba(251,191,36,0.8)",
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     w-24 h-24 md:w-28 md:h-28 rounded-full text-white 
                     font-extrabold text-base bg-gradient-to-tr 
                     from-yellow-400 via-orange-400 to-orange-500 
                     shadow-2xl flex flex-col items-center justify-center
                     z-20 disabled:opacity-60"
                >
                    {isSpinning ? (
                        <div className="animate-pulse text-xs text-center leading-tight">
                            <span>ĐANG</span>
                            <br />
                            <span>QUAY...</span>
                        </div>
                    ) : spinsLeft <= 0 ? (
                        <div className="text-xs text-center leading-tight">
                            <span>HẾT</span>
                            <br />
                            <span>LƯỢT</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Sparkles className="w-4 h-4 mb-1 text-white animate-spin-slow" />
                            <span>QUAY</span>
                            <span>NGAY</span>
                        </div>
                    )}
                </motion.button>
            </div>
        </div>
    );
};