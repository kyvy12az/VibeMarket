import { color, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Zap, Users, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import heroBanner1 from "@/assets/hero-banner-1.png";
import heroBanner2 from "@/assets/hero-banner-2.png";
import heroBanner3 from "@/assets/hero-banner-3.png";
import heroBanner4 from "@/assets/hero-banner-4.png";


import { useState } from "react";

const heroSlides = [
  {
    bg: heroBanner1,
    overlay: "bg-gradient-to-r from-[#2a174d]/90 via-[#1e2a6d]/60 to-transparent",
    subtitle: (
      <span className="inline-flex items-center px-4 py-1 rounded-full text-base font-semibold bg-[#b983ff] text-white mb-4">
        <span className="mr-2">🔥</span> Trending Now
      </span>
    ),
    title: (
      <>
        <span className="block text-4xl md:text-6xl font-extrabold text-white leading-tight mb-2 font-dancing">Mua sắm thông minh,</span>
        <span className="block text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-[#b983ff] via-[#5f8fff] to-[#3be8b0] bg-clip-text text-transparent leading-tight font-dancing">Kết nối cộng đồng</span>
      </>
    ),
    desc: "Khám phá hàng ngàn sản phẩm độc đáo, tham gia cộng đồng sôi động và trải nghiệm mua sắm livestream đầy thú vị.",
    highlight: null,
    tags: [],
    cta1: { label: "Khám phá ngay", color: "bg-[#b983ff] text-white", icon: <ArrowRight className="ml-2 w-4 h-4" /> },
    cta2: { label: "Xem Livestream", color: "border-[#b983ff] text-[#b983ff]", icon: <Play className="ml-2 w-4 h-4" /> },
    stats: [
      { icon: <Users className="w-6 h-6" />, label: "Thành viên", value: "50K+" },
      { icon: <ShoppingBag className="w-6 h-6" />, label: "Sản phẩm", value: "10K+" },
      { icon: <Zap className="w-6 h-6" />, label: "Flash Sale", value: "24/7" },
    ],
  },
  {
    bg: heroBanner2,
    overlay: "bg-gradient-to-r from-black/70 via-black/40 to-transparent",
    subtitle: (
      <span className="inline-flex items-center px-4 py-1 rounded-full text-base font-bold bg-orange-500 text-white mb-4 shadow-lg">
        <span className="mr-2">🛒</span> VibeMarket - Mua sắm thông minh
      </span>
    ),
    title: (
      <>
        <span className="block text-4xl md:text-6xl font-extrabold text-white leading-tight mb-2 drop-shadow-lg font-dancing">Khám phá xu hướng mới</span>
        <span className="block text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-400 via-orange-600 to-yellow-500 bg-clip-text text-transparent leading-tight drop-shadow-lg font-dancing">Sản phẩm mới 2025</span>
      </>
    ),
    desc: "Nền tảng thương mại điện tử hiện đại, kết nối cộng đồng, săn deal hot và trải nghiệm mua sắm tiện lợi mọi lúc mọi nơi.",
    highlight: <span className="text-orange-500 font-semibold">Sản phẩm mới 2025</span>,
    tags: [
      <span key="fashion" className="border border-orange-500 text-orange-500 px-4 py-2 rounded-full text-sm font-medium shadow-sm bg-transparent">Thời trang</span>,
      <span key="electronic" className="border border-orange-500 text-orange-500 px-4 py-2 rounded-full text-sm font-medium shadow-sm bg-transparent">Điện tử</span>,
      <span key="household" className="border border-orange-500 text-orange-500 px-4 py-2 rounded-full text-sm font-medium shadow-sm bg-transparent">Gia dụng</span>,
      <span key="beautify" className="border border-orange-500 text-orange-500 px-4 py-2 rounded-full text-sm font-medium shadow-sm bg-transparent">Làm đẹp</span>,
    ],
    cta1: { label: "Khám phá ngay", color: "bg-orange-500 text-white hover:bg-orange-600", icon: <ArrowRight className="ml-2 w-4 h-4" /> },
    cta2: { label: "Xem ưu đãi", color: "border-orange-500 text-orange-500", icon: null },
  },
  {
    bg: heroBanner3,
    overlay: "bg-gradient-to-r from-[#1e2a6d]/90 via-[#5f8fff]/60 to-transparent",
    subtitle: (
      <span className="inline-flex items-center px-4 py-1 rounded-full text-base font-bold bg-blue-600 text-white mb-4 shadow-lg">
        <span className="mr-2">🎥</span> Livestream mua sắm
      </span>
    ),
    title: (
      <>
        <span className="block text-4xl md:text-6xl font-extrabold text-white leading-tight mb-2 drop-shadow-lg font-dancing">Flash Sale 24/7</span>
        <span className="block text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-[#5f8fff] via-[#3be8b0] to-[#b983ff] bg-clip-text text-transparent leading-tight drop-shadow-lg font-dancing">Ưu đãi livestream</span>
      </>
    ),
    desc: "Tham gia các phiên livestream, săn deal sốc và nhận quà tặng hấp dẫn mỗi ngày.",
    highlight: <span className="text-blue-500 font-semibold">Livestream đặc biệt hôm nay</span>,
    tags: [
      <span key="flash" className="border border-blue-500 text-blue-500 px-4 py-2 rounded-full text-sm font-medium shadow-sm bg-transparent">Flash Sale</span>,
      <span key="live" className="border border-blue-500 text-blue-500 px-4 py-2 rounded-full text-sm font-medium shadow-sm bg-transparent">Livestream</span>,
      <span key="gift" className="border border-blue-500 text-blue-500 px-4 py-2 rounded-full text-sm font-medium shadow-sm bg-transparent">Quà tặng</span>,
    ],
    cta1: { label: "Xem Livestream", color: "bg-blue-600 hover:bg-blue-700 text-white", icon: <Play className="ml-2 w-4 h-4" /> },
    cta2: { label: "Nhận ưu đãi", color: "border-blue-500 text-blue-500", icon: null },
  },
  {
    bg: heroBanner4,
    overlay: "bg-gradient-to-r from-green-900/80 via-green-700/40 to-transparent",
    subtitle: (
      <span className="inline-flex items-center px-4 py-1 rounded-full text-base font-bold bg-green-600 text-white mb-4 shadow-lg">
        <span className="mr-2">🤝</span> Cộng đồng mua sắm
      </span>
    ),
    title: (
      <>
        <span className="block text-4xl md:text-6xl font-extrabold text-white leading-tight mb-2 drop-shadow-lg font-dancing">Kết nối & Tiết kiệm</span>
        <span className="block text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-green-400 via-green-600 to-green-400 bg-clip-text text-transparent leading-tight drop-shadow-lg font-dancing">Chương trình thành viên</span>
      </>
    ),
    desc: "Tham gia cộng đồng, tích điểm đổi quà, nhận badge và xếp hạng thành viên.",
    highlight: <span className="text-green-600 font-semibold">Chương trình thành viên</span>,
    tags: [
      <span key="points" className="border border-green-600 text-green-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm bg-transparent">Tích điểm</span>,
      <span key="exchange gift" className="border border-green-600 text-green-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm bg-transparent">Đổi quà</span>,
      <span key="badge" className="border border-green-600 text-green-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm bg-transparent">Badge</span>,
    ],
    cta1: { label: "Tham gia ngay", color: "bg-green-600 text-white hover:bg-green-700", icon: <Users className="ml-2 w-4 h-4" /> },
    cta2: { label: "Xem quyền lợi", color: "border-green-600 text-green-600", icon: null },
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const slide = heroSlides[current];

  const goTo = (idx: number) => setCurrent(idx);
  const prev = () => setCurrent((c) => (c === 0 ? heroSlides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === heroSlides.length - 1 ? 0 : c + 1));

  return (
  <section className="relative overflow-hidden min-h-screen md:min-h-[700px] group">
      {/* Background Image with Overlay - dùng framer-motion để animate khi chuyển slide */}
      <motion.div
        key={current}
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.08, opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <img
          src={slide.bg}
          alt="Hero background"
          className="w-full h-full object-cover object-center"
        />
        <div className={`absolute inset-0 ${slide.overlay}`} />
      </motion.div>

      <div className="relative container mx-auto px-4 py-16 md:py-24 flex items-center min-h-screen md:min-h-[700px]">
        <div className="flex flex-col md:flex-row w-full gap-0 md:gap-8 items-stretch">
          {/* Left Content */}
          <motion.div
            key={current}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: { opacity: 0, y: 60 },
              animate: { opacity: 1, y: 0, transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
              exit: { opacity: 0, y: 60 }
            }}
            className="flex-1 flex flex-col justify-center z-10"
          >
            {/* Subtitle badge or text */}
            {slide.subtitle && (
              <motion.div variants={{ initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 40 } }} className="mb-2">{slide.subtitle}</motion.div>
            )}
            {/* Title (can be string or JSX) */}
            <motion.div variants={{ initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 40 } }} className="mb-4">
              {slide.title}
            </motion.div>
            <motion.p variants={{ initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 40 } }} className="text-white/90 text-base md:text-lg max-w-2xl mb-4">
              {slide.desc}
            </motion.p>
            {slide.highlight && (
              <motion.div variants={{ initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 40 } }} className="mb-4">
                <span className="text-orange-300 font-semibold text-base md:text-lg">{slide.highlight}</span>
              </motion.div>
            )}
            {slide.tags && slide.tags.length > 0 && (
              <motion.div variants={{ initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 40 } }} className="flex gap-2 mb-6 flex-wrap">
                {slide.tags.map((tag) => (
                  <span key={tag} className="py-2 rounded-full text-sm font-medium shadow-sm">
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}
            <motion.div variants={{ initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 40 } }} className="flex gap-4 mb-8 flex-wrap">
              <Button className={slide.cta1.color + " px-6 py-3 text-base font-semibold rounded-full flex items-center gap-2 shadow-lg hover:opacity-90 transition-smooth"}>
                {slide.cta1.label} {slide.cta1.icon}
              </Button>
              <Button variant="outline" className={slide.cta2.color + " px-6 py-3 text-base font-semibold rounded-full flex items-center gap-2 border-2 bg-transparent hover:bg-white/10 transition-smooth"}>
                {slide.cta2.label} {slide.cta2.icon}
              </Button>
            </motion.div>
            {/* Stats row for first slide */}
            {slide.stats && (
              <motion.div variants={{ initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 40 } }} className="flex gap-8 mt-6 mb-2">
                {slide.stats.map((stat, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/30 mb-1 text-[#b983ff]">
                      {stat.icon}
                    </div>
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/70">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
          {/* Custom Slider Navigation (fixed outside motion.div) */}
          <div className="absolute bottom-4 md:left-0 left-4 flex items-center gap-3 z-10">
            {/* Prev button */}
            <button
              onClick={prev}
              aria-label="Previous Slide"
              className="p-1.5 md:p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>

            {/* Indicators */}
            <div className="flex gap-1.5 md:gap-2">
              {heroSlides.map((slide, index) => {
                // Define per-tab indicator color
                let indicatorColor = "";
                if (index === 0) indicatorColor = "bg-[#b983ff] hover:bg-[#a16ae8]";
                else if (index === 1) indicatorColor = "bg-orange-500 hover:bg-orange-600";
                else if (index === 2) indicatorColor = "bg-blue-600 hover:bg-blue-700";
                else if (index === 3) indicatorColor = "bg-green-600 hover:bg-green-700";
                return (
                  <button
                    key={index}
                    onClick={() => goTo(index)}
                    aria-label={`Slide ${index + 1}`}
                    aria-current={current === index}
                    className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${current === index
                      ? `w-6 md:w-8 ${indicatorColor}`
                      : "w-1.5 md:w-2 bg-white/30 hover:bg-white/50"}`}
                  />
                );
              })}
            </div>

            {/* Next button */}
            <button
              onClick={next}
              aria-label="Next Slide"
              className="p-1.5 md:p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          </div>

          {/* Right Image (animate khi chuyển slide) */}
          <motion.div
            key={"right-" + current}
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.08, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="hidden lg:block absolute right-0 top-6 bottom-6 h-[90%] w-1/2 z-0"
          >
            <div
              className="h-full w-full overflow-hidden shadow-2xl lg:p-10 xl:p-0 lg:rounded-tl-[48px] lg:rounded-br-[48px] lg:rounded-tr-[6px] lg:rounded-bl-[6px]"
            >
              <img
                src={slide.bg}
                alt="Hero visual"
                className="w-full h-full object-cover object-center lg:scale-90 xl:scale-100 lg:rounded-tl-[48px] lg:rounded-br-[48px] lg:rounded-tr-[6px] lg:rounded-bl-[6px]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;