import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ShopSidebar } from "@/components/dashboard-Seller/ShopSidebar";
import { DashboardOverview } from "@/components/dashboard-Seller/DashboardOverview";
import { OrdersManagement } from "@/components/dashboard-Seller/OrdersManagement";
import { ProductsManagement } from "@/components/dashboard-Seller/ProductsManagement";
import { ShopAnalytics } from "@/components/dashboard-Seller/ShopAnalytics";
import AddProduct from "@/components/dashboard-Seller/AddProduct";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const ShopDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ShopSidebar />

        <main className="flex-1">
          <header className="sticky top-0 z-20 h-16 flex items-center border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/50 px-6 shadow-sm">
            {/* <div className="flex items-center gap-3"> */}
            <SidebarTrigger />
            <div className="ml-4 flex-1">
              <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
                Quản lý cửa hàng
              </h2>
            </div>
            <ThemeToggle />
            {/* </div> */}
          </header>
          
          <div className="container mx-auto px-6 py-8">
            <Routes>
              <Route index element={<DashboardOverview />} />
              <Route path="order-management" element={<OrdersManagement />} />
              <Route path="product-management" element={<ProductsManagement />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="statistics" element={<ShopAnalytics />} />
              <Route path="setting" element={<SettingsPlaceholder />} />
              <Route path="*" element={<Navigate to="/vendor-management" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const SettingsPlaceholder = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-8"
  >
    <div className="flex items-center gap-4">
      {/* Icon gradient */}
      <div className="p-3 rounded-xl bg-gradient-to-tr from-sky-500 via-cyan-500 to-teal-400 text-white shadow-md">
        <Settings className="w-6 h-6" />
      </div>

      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
          Cài đặt cửa hàng
        </h1>
        <p className="text-muted-foreground">
          Chức năng đang được phát triển...
        </p>
      </div>
    </div>
  </motion.div>
);

export default ShopDashboard;
