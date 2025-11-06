import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Twitter, Award, Code, Heart, Sparkles, Facebook, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const founders = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    role: "Co-Founder & CEO",
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
    name: "Lê Văn C",
    role: "Co-Founder & CMO",
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
    <section className="relative py-8 px-4 sm:px-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/5 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.1),transparent_50%)]" />
        
        {/* Animated orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-tr from-primary/20 via-accent/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-tl from-accent/30 via-primary/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary),0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 backdrop-blur-sm"
          >
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Đội ngũ sáng lập
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Gặp gỡ những
            </span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mt-2">
              người sáng lập
            </span>
          </h2>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-1.5 w-24 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-6"
          />

          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Đội ngũ đam mê và tận tâm, mang đến trải nghiệm mua sắm tuyệt vời cho cộng đồng thời trang Việt
          </p>
        </motion.div>

        {/* Founders Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {founders.map((founder, idx) => (
            <motion.div
              key={founder.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.8 }}
            >
              <Card className="group relative overflow-hidden border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full">
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Decorative top border */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${founder.gradient}`} />

                <CardContent className="relative p-8">
                  {/* Avatar Section */}
                  <div className="text-center mb-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="relative inline-block"
                    >
                      {/* Glow effect */}
                      <div className={`absolute -inset-2 bg-gradient-to-r ${founder.gradient} opacity-20 blur-xl rounded-full group-hover:opacity-40 transition-opacity duration-500`} />
                      
                      {/* Avatar */}
                      <Avatar className="relative w-32 h-32 border-4 border-card shadow-xl">
                        <AvatarImage src={founder.avatar} alt={founder.name} />
                        <AvatarFallback className={`text-2xl font-bold text-white bg-gradient-to-br ${founder.gradient}`}>
                          {founder.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      {/* Status badge */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + idx * 0.2 }}
                        className="absolute -bottom-2 -right-2"
                      >
                        <div className={`p-2 rounded-full bg-gradient-to-br ${founder.gradient} shadow-lg`}>
                          <Award className="w-5 h-5 text-white" />
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Info Section */}
                  <div className="text-center mb-6 space-y-2">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {founder.name}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className={`bg-gradient-to-r ${founder.gradient} text-white border-0 shadow-md`}
                    >
                      {founder.role}
                    </Badge>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 text-center">
                    {founder.bio}
                  </p>

                  {/* Achievements */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${founder.gradient}`} />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Thành tựu
                      </span>
                    </div>
                    {founder.achievements.map((achievement, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${founder.gradient} mt-2 flex-shrink-0`} />
                        <span>{achievement}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center justify-center gap-3 pt-6 border-t border-border/50">
                    {[
                      { icon: Linkedin, href: founder.social.linkedin, label: "LinkedIn" },
                      { icon: Github, href: founder.social.github, label: "GitHub" },
                      { icon: Facebook, href: founder.social.facebook, label: "Facebook" },
                      { icon: Mail, href: `mailto:${founder.social.email}`, label: "Email" },
                    ].map((social, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="relative h-10 w-10 rounded-full hover:bg-primary/10 group/social"
                          asChild
                        >
                          <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                            <social.icon className="h-4 w-4 text-muted-foreground group-hover/social:text-primary transition-colors" />
                          </a>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section - Team Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20"
        >
          <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
            
            <CardContent className="relative p-8 sm:p-12">
              <div className="text-center space-y-6">
                {/* Icon */}
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                  }}
                  transition={{ 
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="inline-flex p-6 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg"
                >
                  <Heart className="h-12 w-12 text-white" />
                </motion.div>

                <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Giá trị cốt lõi của đội ngũ
                </h3>

                {/* Values Grid */}
                <div className="grid sm:grid-cols-3 gap-6 pt-6">
                  {[
                    {
                      icon: Code,
                      title: "Đổi mới",
                      description: "Không ngừng sáng tạo và cải tiến"
                    },
                    {
                      icon: Heart,
                      title: "Đam mê",
                      description: "Yêu thương hiệu Việt, kết nối cộng đồng"
                    },
                    {
                      icon: Award,
                      title: "Chất lượng",
                      description: "Cam kết mang đến trải nghiệm tốt nhất"
                    }
                  ].map((value, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="p-6 rounded-xl bg-gradient-to-br from-background/50 to-card/30 border border-border/50 backdrop-blur-sm"
                    >
                      <value.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                      <h4 className="font-semibold mb-2">{value.title}</h4>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}