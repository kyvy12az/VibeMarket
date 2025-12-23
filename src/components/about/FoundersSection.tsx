import { motion } from "framer-motion";
import { Github, Mail, Award, Sparkles, Quote, ChevronRight, Facebook } from "lucide-react";
import { useState } from "react";

const founders = [
  {
    id: 1,
    name: "Lê Tô Diệu Thảo",
    role: "Developer",
    bio: "Đam mê công nghệ và thời trang Việt, với hơn 10 năm kinh nghiệm trong lĩnh vực e-commerce và phát triển sản phẩm số.",
    avatar: "/images/founder-1.jpg",
    gradient: "from-blue-500 to-cyan-500",
    social: {
      instagram: "#",
      github: "#",
      facebook: "#",
      email: "nguyenvana@vibemarket.vn"
    },
    achievements: [
      "Top 30 under 30 Forbes Vietnam",
      "10+ năm kinh nghiệm E-commerce",
      "Founder 3 startup thành công"
    ]
  },
  {
    id: 2,
    name: "Nguyễn Kỳ Vỹ",
    role: "Developer",
    bio: "Chuyên gia công nghệ với niềm đam mê xây dựng nền tảng số giúp kết nối cộng đồng và thúc đẩy thương mại điện tử Việt Nam.",
    avatar: "/images/avatars/Avt-Vy.jpg",
    gradient: "from-purple-500 to-pink-500",
    social: {
      instagram: "https://www.instagram.com/valt_1902",
      github: "https://github.com/kyvy12az",
      facebook: "https://www.facebook.com/kyvy.nguyen.2k6",
      email: "nguyenkyvy112az@gmail.com"
    },
    achievements: [
      "Giải xuất sắc BWD 2025",
      "Giải ba Olympic Tin học trẻ Quảng Trị 2022",
      "Open source contributor"
    ]
  },
  {
    id: 3,
    name: "Hoàng Minh Nhật",
    role: "Developer",
    bio: "Chuyên gia marketing với tầm nhìn về xây dựng thương hiệu bền vững và kết nối cộng đồng yêu thời trang local brand.",
    avatar: "/images/founder-3.jpg",
    gradient: "from-orange-500 to-red-500",
    social: {
      instagram: "#",
      github: "#",
      facebook: "#",
      email: "levanc@vibemarket.vn"
    },
    achievements: [
      "15+ năm kinh nghiệm Marketing",
      "Brand Builder of the Year 2023",
      "Mentor cho 50+ startups"
    ]
  }
];

export function FoundersSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 overflow-hidden bg-background">
      {/* --- BACKGROUND ADVANCED --- */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(var(--primary),0.05),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(var(--accent),0.05),transparent_40%)]" />

        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* Animated Moving Lines */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
          <div className="absolute top-0 left-2/4 w-[1px] h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent" />
          <div className="absolute top-0 left-3/4 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl">
        {/* --- HEADER --- */}
        <div className="relative z-10 flex flex-col items-center text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">The Visionaries</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]"
          >
            NHỮNG NGƯỜI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x">
              DẪN DẮT CUỘC CHƠI
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-zinc-500 text-lg md:text-xl font-medium"
          >
            Sự kết hợp giữa tư duy công nghệ đột phá và niềm đam mê mãnh liệt với bản sắc thời trang nội địa.
          </motion.p>
        </div>

        {/* --- FOUNDERS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {founders.map((founder, idx) => (
            <FounderCard key={founder.id} founder={founder} idx={idx} />
          ))}
        </div>

        {/* --- BOTTOM TEAM VALUES (BENTO STYLE) --- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 p-8 md:p-16 rounded-[3rem] bg-zinc-950 text-white relative overflow-hidden"
        >
          {/* Background element for CTA */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[120px] -z-10" />

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Xây dựng giá trị <br /> dựa trên <span className="text-primary italic">niềm tin.</span>
              </h3>
              <div className="flex flex-wrap gap-4">
                {['Đổi mới', 'Đam mê', 'Chất lượng'].map((val) => (
                  <span key={val} className="px-6 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-semibold hover:bg-white/10 transition-colors">
                    {val}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <Quote className="absolute -top-10 -left-10 w-20 h-20 text-white/5" />
              <p className="text-xl text-zinc-400 leading-relaxed italic">
                "Chúng tôi không chỉ bán quần áo, chúng tôi tạo ra một nền tảng nơi mỗi Local Brand có thể tự hào kể câu chuyện của chính mình."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-[1px] bg-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">VibeMarket Founders</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const FounderCard = ({ founder, idx }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.15, duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Photo Container */}
      <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 bg-zinc-100 dark:bg-zinc-900 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
        {/* Glow effect on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 z-10 transition-opacity duration-500 ${isHovered ? 'opacity-90' : 'opacity-60'}`} />

        {/* Placeholder or Real Image */}
        <img
          src={founder.avatar}
          alt={founder.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
        />

        {/* Social Dock (Overlay) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <SocialIcon icon={Facebook} href={founder.social.facebook} />
          <SocialIcon icon={Github} href={founder.social.github} />
          <SocialIcon icon={Mail} href={`mailto:${founder.social.email}`} />
        </div>

        {/* Achievement Badge (Top Right) */}
        <div className="absolute top-6 right-6 z-20">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${founder.gradient} shadow-lg shadow-black/20 text-white transform rotate-12 group-hover:rotate-0 transition-transform`}>
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="space-y-3 px-2">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl font-bold tracking-tight group-hover:text-primary transition-colors">
            {founder.name}
          </h3>
          <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-primary" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
          {founder.role}
        </p>

        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
          {founder.bio}
        </p>

        {/* Micro-tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {founder.achievements.slice(0, 2).map((ach, i) => (
            <span key={i} className="text-[10px] font-bold px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 uppercase">
              {ach}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const SocialIcon = ({ icon: Icon, href }) => (
  <a
    href={href}
    target="_blank"
    className="p-2.5 rounded-xl hover:bg-white hover:text-black text-white transition-all"
  >
    <Icon className="w-4 h-4" />
  </a>
);