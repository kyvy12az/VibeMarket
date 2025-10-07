import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Shopping from "./pages/Shopping";
import Community from "./pages/Community";
import Discover from "./pages/Discover";
import FlashSale from "./pages/FlashSale";
import LocalBrand from "./pages/LocalBrand";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import { CartProvider } from "@/contexts/CartContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./contexts/AuthContext";
import Profile from "./pages/Profile";
import OrderManagement from "./pages/OrderManagement";
import VendorRegistration from "./pages/VendorRegistration";
import ShopManagement from "./pages/ShopManagement";
import AddProduct from "./pages/AddProduct";
import OrderDetail from "./pages/OrderDetail";
import Messages from "./pages/Messages";
import AIStylist from "./pages/AIStylist";
import AIRecommendationsPage from "./pages/AIRecommendations";
import WalletPage from "./pages/Wallet";
import EventDetail from "./pages/EventDetail";
import ZaloCallback from "./pages/ZaloCallBack";
import GoogleCallback from "./pages/GoogleCallback";
import FacebookCallback from "./pages/FacebookCallBack";
import BrandProducts from "./pages/BrandProducts";
import RewardsRedemption from "./pages/RewardsRedemption";
import MomoCallback from "./pages/MomoCallBack";
import PayosCallBack from "./pages/PayosCallBack";

const queryClient = new QueryClient();

function App() {
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/shop" element={<Shopping />} />
                <Route path="/community" element={<Community />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/flash-sale" element={<FlashSale />} />
                <Route path="/local-brand" element={<LocalBrand />} />
                <Route path="/brand/:brandId" element={<BrandProducts />} />
                <Route path="/ai-stylist" element={<AIStylist />} />
                <Route path="/ai-recomment" element={<AIRecommendationsPage />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/rewards" element={<RewardsRedemption />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<OrderManagement />} />
                <Route path="/orders/:code" element={<OrderDetail />} />
                <Route path="/vendor-registration" element={<VendorRegistration />} />
                <Route path="/vendor-management" element={<ShopManagement />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/callback/zalo" element={<ZaloCallback />} />
                <Route path="/callback/google" element={<GoogleCallback />} />
                <Route path="/callback/facebook" element={<FacebookCallback />} />
                <Route path="/callback/momo" element={<MomoCallback />} />
                <Route path="/payos-callback" element={<PayosCallBack />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="/messages" element={<Messages />} />
            </Routes>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;