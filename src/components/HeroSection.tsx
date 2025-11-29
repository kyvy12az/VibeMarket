import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Zap, Users, ShoppingBag, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Gift } from "lucide-react";
import heroBanner1 from "@/assets/hero-banner-1.png";
import heroBanner2 from "@/assets/hero-banner-2.png";
import heroBanner3 from "@/assets/hero-banner-3.png";
import heroBanner4 from "@/assets/hero-banner-4.png";
import { useState, useEffect } from "react";

const heroSlides = [
  {
    id: 1,
    bg: heroBanner1,
    overlay: "from-[#2a174d]/95 via-[#1e2a6d]/70 to-transparent",
    accentColor: "#b983ff",
    subtitle: {
      icon: "🔥",
      text: "Trending Now",
      bgColor: "bg-gradient-to-r from-[#b983ff] to-[#8b5cf6]",
    },
    title: {
      line1: "Mua sắm thông minh,",
      line2: "Kết nối cộng đồng",
      gradient: "from-[#b983ff] via-[#5f8fff] to-[#3be8b0]",
    },
    desc: "Khám phá hàng ngàn sản phẩm độc đáo, tham gia cộng đồng sôi động và trải nghiệm mua sắm livestream đầy thú vị.",
    tags: [],
    cta: [
      { label: "Khám phá ngay", variant: "primary", icon: <ArrowRight className="w-4 h-4" />, color: "from-[#b983ff] to-[#8b5cf6]" },
      { label: "Xem Livestream", variant: "outline", icon: <Play className="w-4 h-4" />, borderColor: "border-[#b983ff]" },
    ],
    stats: [
      { icon: <Users className="w-6 h-6" />, label: "Thành viên", value: "50K+", color: "text-[#b983ff]" },
      { icon: <ShoppingBag className="w-6 h-6" />, label: "Sản phẩm", value: "10K+", color: "text-[#5f8fff]" },
      { icon: <Zap className="w-6 h-6" />, label: "Flash Sale", value: "24/7", color: "text-[#3be8b0]" },
    ],
  },
  {
    id: 2,
    bg: heroBanner2,
    overlay: "from-black/90 via-black/50 to-transparent",
    accentColor: "#f97316",
    subtitle: {
      icon: "🛒",
      text: "VibeMarket - Mua sắm thông minh",
      bgColor: "bg-gradient-to-r from-orange-500 to-orange-600",
    },
    title: {
      line1: "Khám phá xu hướng mới",
      line2: "Sản phẩm mới 2025",
      gradient: "from-orange-400 via-orange-600 to-yellow-500",
    },
    desc: "Nền tảng thương mại điện tử hiện đại, kết nối cộng đồng, săn deal hot và trải nghiệm mua sắm tiện lợi mọi lúc mọi nơi.",
    tags: ["Thời trang", "Điện tử", "Gia dụng", "Làm đẹp"],
    cta: [
      { label: "Khám phá ngay", variant: "primary", icon: <ArrowRight className="w-4 h-4" />, color: "from-orange-500 to-orange-600" },
      { label: "Xem ưu đãi", variant: "outline", icon: <Gift className="w-4 h-4" />, borderColor: "border-orange-500" },
    ],
    stats: [],
  },
  {
    id: 3,
    bg: heroBanner3,
    overlay: "from-[#1e2a6d]/90 via-[#5f8fff]/70 to-transparent",
    accentColor: "#3b82f6",
    subtitle: {
      icon: "🎥",
      text: "Livestream mua sắm",
      bgColor: "bg-gradient-to-r from-blue-600 to-blue-700",
    },
    title: {
      line1: "Flash Sale 24/7",
      line2: "Ưu đãi livestream",
      gradient: "from-[#5f8fff] via-[#3be8b0] to-[#b983ff]",
    },
    desc: "Tham gia các phiên livestream, săn deal sốc và nhận quà tặng hấp dẫn mỗi ngày.",
    tags: ["Flash Sale", "Livestream", "Quà tặng"],
    cta: [
      { label: "Xem Livestream", variant: "primary", icon: <Play className="w-4 h-4" />, color: "from-blue-600 to-blue-700" },
      { label: "Nhận ưu đãi", variant: "outline", icon: <Sparkles className="w-4 h-4" />, borderColor: "border-blue-500" },
    ],
    stats: [],
  },
  {
    id: 4,
    bg: heroBanner4,
    overlay: "from-green-900/85 via-green-700/50 to-transparent",
    accentColor: "#16a34a",
    subtitle: {
      icon: "🤝",
      text: "Cộng đồng mua sắm",
      bgColor: "bg-gradient-to-r from-green-600 to-green-700",
    },
    title: {
      line1: "Kết nối & Tiết kiệm",
      line2: "Chương trình thành viên",
      gradient: "from-green-400 via-green-600 to-green-400",
    },
    desc: "Tham gia cộng đồng, tích điểm đổi quà, nhận badge và xếp hạng thành viên.",
    tags: ["Tích điểm", "Đổi quà", "Badge"],
    cta: [
      { label: "Tham gia ngay", variant: "primary", icon: <Users className="w-4 h-4" />, color: "from-green-600 to-green-700" },
      { label: "Xem quyền lợi", variant: "outline", icon: <TrendingUp className="w-4 h-4" />, borderColor: "border-green-600" },
    ],
    stats: [],
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const slide = heroSlides[current];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const goTo = (idx: number) => {
    setCurrent(idx);
    setIsAutoPlay(false);
  };

  const prev = () => {
    setCurrent((c) => (c === 0 ? heroSlides.length - 1 : c - 1));
    setIsAutoPlay(false);
  };

  const next = () => {
    setCurrent((c) => (c === heroSlides.length - 1 ? 0 : c + 1));
    setIsAutoPlay(false);
  };

  return (
    <section className="relative overflow-hidden h-screen w-full group">
      {/* Animated Background with Parallax Effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <motion.img
            src={slide.bg}
            alt="Hero background"
            className="w-full h-full object-cover object-center"
            animate={{ scale: [1, 1.05] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          />
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />
          
          {/* Animated Mesh Gradient */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 20% 50%, ${slide.accentColor}15 0%, transparent 50%),
                           radial-gradient(circle at 80% 50%, ${slide.accentColor}10 0%, transparent 50%)`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Floating Particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full hidden md:block"
              style={{
                background: slide.accentColor,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 0.6, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row w-full gap-8 lg:gap-12 items-center justify-between">
            {/* Left Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={{
                  initial: { opacity: 0 },
                  animate: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.2,
                    },
                  },
                  exit: { opacity: 0 },
                }}
                className="flex-1 flex flex-col justify-center z-10 w-full lg:max-w-2xl"
              >
                {/* Subtitle Badge */}
                <motion.div
                  variants={{
                    initial: { opacity: 0, y: 20, scale: 0.9 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: -20, scale: 0.9 },
                  }}
                  className="mb-4 md:mb-6"
                >
                  <Badge
                    className={`${slide.subtitle.bgColor} text-white border-0 shadow-2xl px-4 md:px-5 py-2 md:py-2.5 text-sm md:text-base font-bold hover:scale-105 transition-transform`}
                  >
                    <span className="mr-2 text-lg md:text-xl">{slide.subtitle.icon}</span>
                    <span className="hidden sm:inline">{slide.subtitle.text}</span>
                    <span className="sm:hidden">{slide.subtitle.text.split(' ')[0]}</span>
                  </Badge>
                </motion.div>

                {/* Title */}
                <motion.div
                  variants={{
                    initial: { opacity: 0, y: 30 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -30 },
                  }}
                  className="mb-4 md:mb-6"
                >
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight">
                    <span className="block text-white drop-shadow-2xl font-dancing mb-1 md:mb-2">
                      {slide.title.line1}
                    </span>
                    <span
                      className={`block bg-gradient-to-r ${slide.title.gradient} bg-clip-text text-transparent drop-shadow-2xl font-dancing`}
                    >
                      {slide.title.line2}
                    </span>
                  </h1>
                </motion.div>

                {/* Description */}
                <motion.p
                  variants={{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -20 },
                  }}
                  className="text-white/90 text-base sm:text-lg md:text-xl max-w-xl mb-6 md:mb-8 leading-relaxed"
                >
                  {slide.desc}
                </motion.p>

                {/* Tags */}
                {slide.tags && slide.tags.length > 0 && (
                  <motion.div
                    variants={{
                      initial: { opacity: 0, y: 20 },
                      animate: { opacity: 1, y: 0 },
                      exit: { opacity: 0, y: -20 },
                    }}
                    className="flex gap-2 md:gap-3 mb-6 md:mb-8 flex-wrap"
                  >
                    {slide.tags.map((tag, i) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="px-3 md:px-5 py-1.5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold bg-white/10 backdrop-blur-md border-2"
                        style={{ borderColor: slide.accentColor, color: "white" }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </motion.div>
                )}

                {/* CTA Buttons */}
                <motion.div
                  variants={{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -20 },
                  }}
                  className="flex gap-3 md:gap-4 mb-6 md:mb-10 flex-wrap"
                >
                  {slide.cta.map((btn, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {btn.variant === "primary" ? (
                        <Button
                          size="lg"
                          className={`bg-gradient-to-r ${btn.color} text-white px-5 sm:px-6 md:px-8 py-4 md:py-6 text-sm sm:text-base md:text-lg font-bold rounded-full shadow-2xl border-0 hover:opacity-90 transition-all`}
                        >
                          <span className="hidden sm:inline">{btn.label}</span>
                          <span className="sm:hidden">{btn.label.split(' ')[0]}</span>
                          {btn.icon && <span className="ml-2">{btn.icon}</span>}
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          variant="outline"
                          className={`${btn.borderColor} text-white px-5 sm:px-6 md:px-8 py-4 md:py-6 text-sm sm:text-base md:text-lg font-bold rounded-full border-3 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all`}
                        >
                          <span className="hidden sm:inline">{btn.label}</span>
                          <span className="sm:hidden">{btn.label.split(' ')[0]}</span>
                          {btn.icon && <span className="ml-2">{btn.icon}</span>}
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </motion.div>

                {/* Stats */}
                {slide.stats && slide.stats.length > 0 && (
                  <motion.div
                    variants={{
                      initial: { opacity: 0, y: 20 },
                      animate: { opacity: 1, y: 0 },
                      exit: { opacity: 0, y: -20 },
                    }}
                    className="flex gap-6 md:gap-10 flex-wrap"
                  >
                    {slide.stats.map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        whileHover={{ scale: 1.1, y: -5 }}
                        className="flex flex-col items-center group cursor-pointer"
                      >
                        <motion.div
                          className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md mb-2 md:mb-3 shadow-xl group-hover:shadow-2xl transition-all"
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <span className={stat.color}>{stat.icon}</span>
                        </motion.div>
                        <div className="text-xl md:text-3xl font-bold text-white mb-1">
                          {stat.value}
                        </div>
                        <div className="text-xs md:text-sm text-white/70 font-medium">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Right Image - Enhanced */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`right-${slide.id}`}
                initial={{ opacity: 0, scale: 0.9, x: 100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -100 }}
                transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
                className="hidden lg:block flex-1 relative z-10 max-w-xl xl:max-w-2xl"
              >
                <div className="relative">
                  {/* Glow Effect */}
                  <motion.div
                    className="absolute -inset-4 rounded-[56px] blur-3xl opacity-40"
                    style={{ background: slide.accentColor }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Image Container */}
                  <motion.div
                    className="relative overflow-hidden rounded-[48px] shadow-2xl"
                    whileHover={{ scale: 1.02, rotate: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={slide.bg}
                      alt="Hero visual"
                      className="w-full h-[400px] lg:h-[500px] xl:h-[600px] object-cover"
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Decorative Frame */}
                    <div className="absolute inset-0 rounded-[48px] border-4 border-white/10" />
                  </motion.div>

                  {/* Floating Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 lg:p-6"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center text-white"
                        style={{ background: slide.accentColor }}
                      >
                        <Sparkles className="w-5 h-5 lg:w-6 lg:h-6" />
                      </div>
                      <div>
                        <div className="text-xl lg:text-2xl font-bold text-gray-900">99%</div>
                        <div className="text-xs text-gray-600 font-medium">Hài lòng</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Controls */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 md:gap-4 z-20">
        {/* Previous Button */}
        <motion.button
          onClick={prev}
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </motion.button>

        {/* Indicators */}
        <div className="flex gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full bg-white/10 backdrop-blur-md shadow-lg">
          {heroSlides.map((s, index) => (
            <motion.button
              key={s.id}
              onClick={() => goTo(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`relative h-2 md:h-2.5 rounded-full transition-all duration-500 ${
                current === index ? "w-8 md:w-10" : "w-2 md:w-2.5"
              }`}
              style={{
                background: current === index ? s.accentColor : "rgba(255,255,255,0.3)",
              }}
            >
              {current === index && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: s.accentColor }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Next Button */}
        <motion.button
          onClick={next}
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all shadow-lg"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </motion.button>
      </div>

      {/* Auto-play Indicator */}
      <motion.div
        className="absolute top-6 md:top-8 right-4 md:right-8 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-xs md:text-sm font-medium hover:bg-white/20 transition-all shadow-lg"
        >
          {isAutoPlay ? (
            <>
              <motion.div
                className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="hidden sm:inline">Auto</span>
            </>
          ) : (
            <>
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gray-400" />
              <span className="hidden sm:inline">Manual</span>
            </>
          )}
        </motion.button>
      </motion.div>
    </section>
  );
};

export default HeroSection;