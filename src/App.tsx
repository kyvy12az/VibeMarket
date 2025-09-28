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
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<OrderManagement />} />
                <Route path="/orders/:orderId" element={<OrderDetail />} />
                <Route path="/vendor-registration" element={<VendorRegistration />} />
                <Route path="/vendor-management" element={<ShopManagement />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;