import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, MessageCircle, User, Bell, Menu, Settings, LogOut, Heart, Package, CreditCard, HelpCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const Navigation = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Mock user data
  const mockUser = {
    name: "Nguyễn Văn An",
    email: "nguyen.van.an@gmail.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
    role: "Premium Member",
    points: 2450
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              VibeMarket
            </span>
          </motion.div>

          {/* Navigation Menu */}
          <div className="hidden lg:flex items-center space-x-8 mx-8">
            {[
              { name: "Trang chủ", href: "/" },
              { name: "Mua sắm", href: "/shop" },
              { name: "Cộng đồng", href: "/community" },
              { name: "Khám phá", href: "/discover" },
              { name: "Flash Sale", href: "/flash-sale" },
              { name: "Local Brand", href: "/local-brand" }
            ].map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative text-foreground hover:text-primary font-medium transition-all duration-300 group py-2"
                whileHover={{ y: -2 }}
              >
                <span className="relative z-10">{item.name}</span>
                
                {/* Hover background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-primary/10 rounded-lg -mx-3"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                
                {/* Underline effect */}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-primary rounded-full"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-lg blur-md -mx-3"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative">
              <MessageCircle className="w-5 h-5" />
              <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-accent text-xs">
                3
              </Badge>
            </Button>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-primary text-xs">
                12
              </Badge>
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-warning text-xs">
                5
              </Badge>
            </Button>

            {/* User Avatar with Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <motion.button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-1 rounded-xl hover:bg-card/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary/20 hover:ring-primary/50 transition-all duration-300"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-foreground">{mockUser.name}</p>
                  <p className="text-xs text-muted-foreground">{mockUser.points} điểm</p>
                </div>
              </motion.button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-72 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-xl z-[100] overflow-hidden"
                >
                  {/* User Info Header */}
                  <div className="p-4 bg-gradient-primary/10 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <img
                        src={mockUser.avatar}
                        alt={mockUser.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-foreground">{mockUser.name}</h3>
                        <p className="text-sm text-muted-foreground">{mockUser.email}</p>
                        <Badge className="mt-1 bg-gradient-primary text-xs">
                          {mockUser.role}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {[
                      { icon: User, label: "Hồ sơ cá nhân", href: "/profile" },
                      { icon: Package, label: "Đơn hàng của tôi", href: "/orders" },
                      { icon: Heart, label: "Sản phẩm yêu thích", href: "/wishlist" },
                      { icon: CreditCard, label: "Ví & Thanh toán", href: "/wallet" },
                      { icon: Settings, label: "Cài đặt", href: "/settings" },
                      { icon: HelpCircle, label: "Trợ giúp", href: "/help" }
                    ].map((item, index) => (
                      <motion.a
                        key={item.label}
                        href={item.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-primary/5 transition-all duration-200 group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                          {item.label}
                        </span>
                      </motion.a>
                    ))}
                    
                    {/* Logout */}
                    <div className="border-t border-border mt-2 pt-2">
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                        className="flex items-center space-x-3 px-4 py-3 w-full hover:bg-destructive/5 transition-all duration-200 group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors" />
                        <span className="text-sm text-foreground group-hover:text-destructive transition-colors">
                          Đăng xuất
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
            />
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;