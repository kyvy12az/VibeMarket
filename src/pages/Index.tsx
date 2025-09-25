import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import ProductGrid from "@/components/ProductGrid";
import CommunityFeed from "@/components/CommunityFeed";
import QuickActions from "@/components/QuickActions";
import Footer from "@/components/Footer";
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
      
      <Footer />
    </motion.div>
  );
};

export default Index;