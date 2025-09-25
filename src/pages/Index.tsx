import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import ProductGrid from "@/components/ProductGrid";
import CommunityFeed from "@/components/CommunityFeed";
import QuickActions from "@/components/QuickActions";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <Navigation />
      <main>
        <HeroSection />
        <CategorySection />
        <ProductGrid />
        <QuickActions />
        <CommunityFeed />
      </main>
      
      {/* Footer */}
      <footer className="relative bg-gradient-card border-t border-border/30 py-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center space-x-3 mb-6"
              >
                <div className="w-12 h-12 bg-gradient-hero rounded-2xl flex items-center justify-center shadow-lg glow-primary">
                  <span className="text-white font-bold text-2xl">V</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  VibeMarket
                </span>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-muted-foreground text-sm leading-relaxed mb-6"
              >
                Nền tảng thương mại điện tử và cộng đồng hàng đầu Việt Nam, kết nối người mua và người bán trong một cộng đồng sôi động.
              </motion.p>
              
              {/* Social Links */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex space-x-3"
              >
                {['Facebook', 'Instagram', 'Twitter', 'YouTube'].map((social, index) => (
                  <a 
                    key={social}
                    href="#" 
                    className="w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <span className="text-xs font-medium">{social[0]}</span>
                  </a>
                ))}
              </motion.div>
            </div>
            
            {/* Links Sections */}
            {[
              {
                title: "Mua sắm",
                links: ["Flash Sale", "Thời trang", "Điện tử", "Local Brand", "Gia dụng", "Làm đẹp"]
              },
              {
                title: "Cộng đồng", 
                links: ["Diễn đàn", "Review", "Livestream", "Nhóm", "Sự kiện", "Blog"]
              },
              {
                title: "Hỗ trợ",
                links: ["Trung tâm trợ giúp", "Chính sách", "Liên hệ", "Về chúng tôi", "Tuyển dụng", "Đối tác"]
              }
            ].map((section, sectionIndex) => (
              <motion.div 
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * (sectionIndex + 1) }}
              >
                <h4 className="font-bold text-foreground mb-6 text-lg relative">
                  {section.title}
                  <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-primary rounded-full" />
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <motion.li 
                      key={link}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.05 * linkIndex }}
                    >
                      <a 
                        href="#" 
                        className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block relative group"
                      >
                        {link}
                        <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          
          {/* Newsletter Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 pt-8 border-t border-border/30"
          >
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Đăng ký nhận thông tin ưu đãi
              </h3>
              <p className="text-muted-foreground mb-6">
                Nhận ngay thông tin về các chương trình khuyến mãi và sản phẩm mới nhất
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Nhập email của bạn"
                  className="flex-1 px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                />
                <button className="px-6 py-3 bg-gradient-primary text-primary-foreground rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 glow-primary">
                  Đăng ký
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* Bottom Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="border-t border-border/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <p className="text-sm text-muted-foreground">
              © 2024 VibeMarket. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Điều khoản sử dụng</a>
              <a href="#" className="hover:text-primary transition-colors">Chính sách bảo mật</a>
              <a href="#" className="hover:text-primary transition-colors">Cookie</a>
            </div>
          </motion.div>
        </div>
      </footer>
    </motion.div>
  );
};

export default Index;