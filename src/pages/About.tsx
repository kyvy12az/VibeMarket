import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { AboutHero } from "@/components/about/AboutHero";
import { ProductShowcase3D } from "@/components/about/ProductShowcase3D";
import { MissionSection } from "@/components/about/MissionSection";
import { CoreValuesGrid } from "@/components/about/CoreValuesGrid";
import { StatisticsCounter } from "@/components/about/StatisticsCounter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <AboutHero />

        <ProductShowcase3D />

        <MissionSection />

        <CoreValuesGrid />

        <StatisticsCounter />

        {/* CTA Section */}
        <section className="relative py-24 px-6 overflow-hidden">
          {/* Hiệu ứng nền gradient ánh sáng */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] bg-gradient-to-r from-primary/30 via-accent/20 to-transparent blur-[120px] opacity-40 animate-pulse" />
            <div className="absolute bottom-[-10%] right-[25%] w-[500px] h-[500px] bg-gradient-to-tl from-accent/30 via-primary/10 to-transparent blur-[100px] opacity-30 animate-pulse delay-300" />
          </div>

          <div className="container mx-auto max-w-5xl text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-background/70 via-primary/10 to-accent/10 rounded-[2rem] p-12 md:p-16 border border-white/10 backdrop-blur-2xl shadow-[0_0_50px_rgba(99,102,241,0.25)] relative overflow-hidden"
            >
              {/* Viên pha lê minh họa */}
              <img
                src="/images/crystal-3d.png"
                alt="Crystal Illustration"
                className="absolute top-[-60px] right-[-60px] w-[200px] md:w-[250px] opacity-80 rotate-12 animate-float-slow"
              />

              {/* Nội dung */}
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-primary via-accent to-indigo-500 bg-clip-text text-transparent">
                Sẵn sàng khám phá?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Tham gia cộng đồng thời trang độc đáo, khám phá hàng ngàn sản phẩm từ
                local brands Việt, nơi sáng tạo và phong cách giao thoa.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate("/mua-sam")}
                  className="group text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent shadow-lg hover:shadow-primary/40 transition-all duration-300"
                >
                  Khám phá ngay
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/dang-ky-vendor")}
                  className="text-lg px-8 py-6 border-primary/40 hover:border-primary/70"
                >
                  Trở thành đối tác
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

      </motion.div>
    </div>
  );
};

export default About;
