import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import ProductGrid from "@/components/ProductGrid";
import CommunityFeed from "@/components/CommunityFeed";
import QuickActions from "@/components/QuickActions";
import { motion } from "framer-motion";
import StatisticsSection from "@/components/StatisticsSection";

const Index = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <main>
        <HeroSection />
        <CategorySection />
        <StatisticsSection />
        <ProductGrid />
        <QuickActions />
        <CommunityFeed />
      </main>
      
    </motion.div>
  );
};

export default Index;