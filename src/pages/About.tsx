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
import { FoundersSection } from "@/components/about/FoundersSection";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: 'opacity' }}
      >
        <AboutHero />

        <ProductShowcase3D />

        <MissionSection />

        <FoundersSection />

      </motion.div>
    </div>
  );
};

export default About;
