import { motion, useAnimationControls } from "framer-motion";
import { Prize, calculateRotation } from "@/lib/luckyWheelUtils";
import { Sparkles, Gift, Tag, Star, Percent, Coffee, Heart, Zap, MapPin } from "lucide-react";
import { useRef } from "react";

interface WheelProps {
    prizes: Prize[];
    onSpinComplete: (prize: Prize) => void;
    isSpinning?: boolean;
    spinsLeft: number;
    onStart?: () => void;
    onEnd?: (prize: Prize) => void;
}

const ICON_SIZE = 28;

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

// Gradient colors matching VibeMarket theme
const segmentColors = [
    { primary: '#8B5CF6', secondary: '#A855F7' }, // purple-600 to purple-500
    { primary: '#7C3AED', secondary: '#8B5CF6' }, // purple-700 to purple-600
    { primary: '#6D28D9', secondary: '#7C3AED' }, // purple-800 to purple-700
    { primary: '#5B21B6', secondary: '#6D28D9' }, // purple-900 to purple-800
];

export const Wheel = ({
    prizes,
    onSpinComplete,
    isSpinning,
    spinsLeft,
    onStart,
    onEnd,
}: WheelProps) => {
    const controls = useAnimationControls();
    const rotationAccum = useRef<number>(0);

    const handleSpin = async () => {
        if (isSpinning || spinsLeft <= 0) return;

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

        onEnd?.(winningPrize);
        onSpinComplete(winningPrize);
    };

    return (
        <div className="relative flex flex-col items-center justify-center p-6">
            {/* Enhanced Decorative Glow - Primary Theme */}
            <motion.div 
                className="absolute w-[520px] h-[520px] rounded-full bg-gradient-to-r from-primary/40 via-purple-600/40 to-primary/40 blur-3xl"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Outer Ring Decoration */}
            <motion.div 
                className="absolute w-[500px] h-[500px] rounded-full border-4 border-primary/20"
                animate={{
                    rotate: 360,
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {/* Enhanced Pointer */}
            <div className="absolute top-[8px] z-30">
                <motion.div
                    animate={{
                        y: [0, 5, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <div
                        className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[50px]
                        border-l-transparent border-r-transparent border-t-primary
                        drop-shadow-[0_6px_12px_rgba(139,92,246,0.6)]"
                        style={{
                            filter: 'drop-shadow(0 0 10px rgba(139,92,246,0.8))',
                        }}
                    />
                </motion.div>
            </div>

            {/* Wheel Container */}
            <div className="relative w-[340px] h-[340px] md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px]">
                {/* Spinning Wheel */}
                <motion.div
                    animate={controls}
                    className="absolute inset-0"
                    style={{
                        transformOrigin: "center",
                        willChange: "transform",
                        backfaceVisibility: "hidden",
                    }}
                >
                    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
                        <defs>
                            {/* Radial Gradient for Outer Ring */}
                            <radialGradient id="wheelGradient" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="60%" stopColor="#f3e8ff" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </radialGradient>

                            {/* Segment Gradients */}
                            {segmentColors.map((color, idx) => (
                                <linearGradient 
                                    key={idx} 
                                    id={`segmentGradient${idx}`} 
                                    x1="0%" 
                                    y1="0%" 
                                    x2="100%" 
                                    y2="100%"
                                >
                                    <stop offset="0%" stopColor={color.primary} />
                                    <stop offset="100%" stopColor={color.secondary} />
                                </linearGradient>
                            ))}

                            {/* Glow Filter */}
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Outer Ring with Gradient */}
                        <circle 
                            cx="200" 
                            cy="200" 
                            r="195" 
                            fill="url(#wheelGradient)" 
                            stroke="#8B5CF6"
                            strokeWidth="3"
                        />

                        {/* Inner Decorative Ring */}
                        <circle 
                            cx="200" 
                            cy="200" 
                            r="180" 
                            fill="none" 
                            stroke="#a855f7"
                            strokeWidth="1"
                            opacity="0.3"
                        />

                        {/* Segments */}
                        {prizes.map((prize, index) => {
                            const segmentAngle = 360 / prizes.length;
                            const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
                            const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
                            const middleAngle = ((index + 0.5) * segmentAngle - 90) * (Math.PI / 180);

                            const x1 = 200 + Math.cos(startAngle) * 180;
                            const y1 = 200 + Math.sin(startAngle) * 180;
                            const x2 = 200 + Math.cos(endAngle) * 180;
                            const y2 = 200 + Math.sin(endAngle) * 180;
                            const largeArcFlag = segmentAngle > 180 ? 1 : 0;

                            const labelRadius = 120;
                            const iconRadius = 95;
                            const textX = 200 + Math.cos(middleAngle) * labelRadius;
                            const textY = 200 + Math.sin(middleAngle) * labelRadius;
                            const iconX = 200 + Math.cos(middleAngle) * iconRadius;
                            const iconY = 200 + Math.sin(middleAngle) * iconRadius;

                            const IconComp = prize.icon && typeof prize.icon === "string"
                                ? iconMap[prize.icon.toLowerCase()]
                                : null;

                            const gradientId = `segmentGradient${index % segmentColors.length}`;

                            return (
                                <g key={prize.id}>
                                    {/* Segment Path with Gradient */}
                                    <path
                                        d={`M 200 200 L ${x1} ${y1} A 180 180 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                                        fill={`url(#${gradientId})`}
                                        stroke="white"
                                        strokeWidth="3"
                                        opacity="0.95"
                                        filter="url(#glow)"
                                    />

                                    {/* Icon */}
                                    {IconComp ? (
                                        <foreignObject
                                            x={iconX - ICON_SIZE / 2}
                                            y={iconY - ICON_SIZE / 2}
                                            width={ICON_SIZE}
                                            height={ICON_SIZE}
                                            style={{ overflow: "visible" }}
                                        >
                                            <div xmlns="http://www.w3.org/1999/xhtml" className="flex items-center justify-center">
                                                <IconComp className="w-7 h-7 text-white drop-shadow-lg" />
                                            </div>
                                        </foreignObject>
                                    ) : (
                                        <text
                                            x={iconX}
                                            y={iconY}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fontSize="28"
                                            fill="white"
                                            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                                        >
                                            {prize.icon}
                                        </text>
                                    )}

                                    {/* Text Label */}
                                    <text
                                        x={textX}
                                        y={textY}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fontSize="13"
                                        fontWeight="700"
                                        fill="white"
                                        transform={`rotate(${index * segmentAngle + segmentAngle / 2}, ${textX}, ${textY})`}
                                        style={{ 
                                            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                                        }}
                                    >
                                        {prize.name}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Center Circle with Gradient */}
                        <defs>
                            <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="100%" stopColor="#f3e8ff" />
                            </radialGradient>
                        </defs>
                        <circle
                            cx="200"
                            cy="200"
                            r="60"
                            fill="url(#centerGradient)"
                            stroke="#8B5CF6"
                            strokeWidth="4"
                            filter="url(#glow)"
                        />
                    </svg>
                </motion.div>

                {/* Enhanced Center Button */}
                <motion.button
                    onClick={handleSpin}
                    disabled={isSpinning || spinsLeft <= 0}
                    whileHover={
                        !isSpinning && spinsLeft > 0
                            ? { scale: 1.15, rotate: 5 }
                            : {}
                    }
                    whileTap={
                        !isSpinning && spinsLeft > 0
                            ? { scale: 0.9, rotate: -5 }
                            : {}
                    }
                    animate={{
                        boxShadow: isSpinning
                            ? [
                                "0 0 20px rgba(139,92,246,0.6)",
                                "0 0 40px rgba(139,92,246,0.8)",
                                "0 0 20px rgba(139,92,246,0.6)",
                            ]
                            : "0 0 30px rgba(139,92,246,0.8)",
                    }}
                    transition={{
                        boxShadow: {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     w-24 h-24 md:w-28 md:h-28 rounded-full text-white 
                     font-extrabold text-base bg-gradient-to-br 
                     from-primary via-purple-600 to-primary
                     shadow-2xl flex flex-col items-center justify-center
                     z-20 disabled:opacity-50 disabled:cursor-not-allowed
                     border-4 border-white/30"
                    style={{
                        backgroundSize: '200% 200%',
                        animation: 'gradient-shift 3s ease infinite',
                    }}
                >
                    {isSpinning ? (
                        <div className="animate-pulse text-xs text-center leading-tight">
                            <Sparkles className="w-5 h-5 mx-auto mb-1 animate-spin" />
                            <span className="block">ĐANG</span>
                            <span className="block">QUAY...</span>
                        </div>
                    ) : spinsLeft <= 0 ? (
                        <div className="text-xs text-center leading-tight opacity-60">
                            <span className="block text-lg">😢</span>
                            <span className="block">HẾT</span>
                            <span className="block">LƯỢT</span>
                        </div>
                    ) : (
                        <motion.div 
                            className="flex flex-col items-center"
                            animate={{
                                y: [0, -3, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <Sparkles className="w-5 h-5 mb-1 text-white" />
                            <span className="block text-sm">QUAY</span>
                            <span className="block text-sm">NGAY</span>
                        </motion.div>
                    )}
                </motion.button>

                {/* Decorative Stars */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary rounded-full"
                        style={{
                            top: `${50 + 45 * Math.cos((i * 45 * Math.PI) / 180)}%`,
                            left: `${50 + 45 * Math.sin((i * 45 * Math.PI) / 180)}%`,
                        }}
                        animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.25,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Add CSS for gradient animation */}
            <style>{`
                @keyframes gradient-shift {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
            `}</style>
        </div>
    );
};