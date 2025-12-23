import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Search, ShoppingCart, MessageCircle, Gamepad, Box, User, Users, Bell, Menu, Settings, LogOut, Heart, Package, CreditCard, HelpCircle, Star, Home, Zap, StoreIcon, Store, SearchCheck, LucideIcon, ChevronDown, ShoppingBag, Sparkles, Percent, Gift, UserCircle, Wallet, Info } from "lucide-react";
import ShoppingCartModal from "./ShoppingCartModal";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect, useRef } from "react";
import { useLocation, Link, NavLink } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationDropdown } from "./NoficationDropdown";
interface SubMenuItem {
    to: string;
    label: string;
    icon: LucideIcon;
}

interface MenuItem {
    label: string;
    icon: LucideIcon;
    hasSubmenu: boolean;
    to?: string;
    submenu?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
    // {
    //     to: "/",
    //     label: "Trang chủ",
    //     icon: Home,
    //     hasSubmenu: false
    // },
    {
        label: "Mua sắm & Khám phá",
        icon: Store,
        hasSubmenu: true,
        submenu: [
            { to: "/shop", label: "Mua sắm", icon: ShoppingBag },
            { to: "/discover", label: "Khám phá", icon: Sparkles },
            { to: "/flash-sale", label: "Flash Sale", icon: Percent },
            { to: "/local-brand", label: "Local Brand", icon: Store },
        ]
    },
    {
        to: "/community",
        label: "Cộng đồng",
        icon: Users,
        hasSubmenu: false
    },
    {
        label: "AI & Cá nhân hóa",
        icon: Sparkles,
        hasSubmenu: true,
        submenu: [
            // { to: "/ai-stylist", label: "AI Stylist", icon: Gift },
            { to: "/ai-shopping", label: "AI trợ lý mua sắm", icon: UserCircle },
        ]
    },
    {
        label: "Tiện ích & Dịch vụ",
        icon: Box,
        hasSubmenu: true,
        submenu: [
            { to: "/wallet", label: "Ví & Điểm thưởng", icon: Wallet },
            { to: "/lucky-wheel", label: "Vòng quay nhận quà", icon: Gamepad },
        ]
    },
    {
        to: "/about",
        label: "Giới thiệu",
        icon: Info,
        hasSubmenu: false
    }
];

const Navigation = () => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [cartModalOpen, setCartModalOpen] = useState(false);
    const { user, logout } = useAuth();
    const [vendorStatus, setVendorStatus] = useState<"none" | "pending" | "approved">("none");
    const { items } = useCart();
    const location = useLocation();
    const pathname = location.pathname;
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showSubmenu, setShowSubmenu] = useState<string | null>(null);
    const [showSubmenuMobile, setShowSubmenuMobile] = useState<string | null>(null);
    const [showMobileUserMenu, setShowMobileUserMenu] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const submenuRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

    // Helper function để lấy URL đầy đủ của avatar
    const getAvatarUrl = (avatar: string | null | undefined) => {
        if (!avatar) return '/images/avatars/Avt-Default.png';
        
        // Nếu avatar bắt đầu bằng http/https (Google, Facebook avatar) thì dùng luôn
        if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
            return avatar;
        }
        
        // Nếu avatar bắt đầu bằng /uploads (đã upload lên server) thì thêm BACKEND_URL
        if (avatar.startsWith('/uploads/')) {
            return `${import.meta.env.VITE_BACKEND_URL}${avatar}`;
        }
        
        // Các trường hợp khác (avatar local)
        return avatar;
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!user) {
            setVendorStatus("none");
            return;
        }
        // Gọi API lấy trạng thái vendor
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/status.php?user_id=${user.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === "approved") setVendorStatus("approved");
                else if (data.status === "pending") setVendorStatus("pending");
                else setVendorStatus("none");
            });
    }, [user]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && open) {
                setOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [open]);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border"
        >
            <div className="mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3"
                        >
                            <div className="relative group">
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-accent/40 to-primary/40 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-60 group-hover:opacity-80"></div>
                                {/* Logo container */}
                                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary via-accent to-emerald-600 p-0.5 shadow-xl shadow-primary/30 group-hover:shadow-2xl group-hover:shadow-primary/40 transition-all duration-300">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                                        <img 
                                            src="/logo-2.png" 
                                            alt="VibeMarket Logo" 
                                            className="w-9 h-9 object-contain transform group-hover:scale-110 transition-transform duration-300"
                                            onError={(e) => {
                                                // Fallback nếu không tìm thấy logo
                                                e.currentTarget.style.display = 'none';
                                                const container = e.currentTarget.parentElement;
                                                if (container) {
                                                    container.classList.remove('bg-white', 'dark:bg-gray-900');
                                                    container.classList.add('bg-gradient-to-br', 'from-primary', 'via-accent', 'to-emerald-600');
                                                    const fallback = document.createElement('span');
                                                    fallback.className = 'text-white font-black text-2xl';
                                                    fallback.textContent = 'V';
                                                    container.appendChild(fallback);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="hidden sm:flex flex-col -space-y-1">
                                <span className="text-xl font-black bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-600 bg-clip-text text-transparent tracking-tight">
                                    VibeMarket
                                </span>
                                <span className="text-[8px] text-muted-foreground/80 font-bold tracking-[0.25em] uppercase pl-0.5">
                                    Fashion & Lifestyle
                                </span>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Navigation Menu */}
                    <nav className="hidden lg:flex space-x-1 xl:space-x-2 mx-8" ref={submenuRef}>
                        {menuItems.map((item) => (
                            <div key={item.label} className="relative">
                                {item.hasSubmenu ? (
                                    <div
                                        className="relative"
                                        onMouseEnter={() => setShowSubmenu(item.label)}
                                        onMouseLeave={() => setShowSubmenu(null)}
                                    >
                                        <button
                                            className={`flex items-center px-2 xl:px-3 py-2 rounded-lg font-medium transition-all text-sm xl:text-base ${item.submenu?.some(subItem => location.pathname === subItem.to)
                                                ? "text-primary"
                                                : "hover:text-primary"
                                                }`}
                                        >
                                            {item.label}
                                            <ChevronDown
                                                size={16}
                                                className={`ml-1 transition-transform duration-200 ${showSubmenu === item.label ? "rotate-180" : ""
                                                    }`}
                                            />
                                            {/* Hover underline */}
                                            <span
                                                className="absolute left-0 right-0 -bottom-1 h-0.5 bg-primary rounded-full transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"
                                            />
                                        </button>

                                        {/* Submenu */}
                                        <AnimatePresence>
                                            {showSubmenu === item.label && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute top-full left-0 mt-2 w-44 lg:w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                                                >
                                                    {item.submenu?.map((subItem) => (
                                                        <NavLink
                                                            key={subItem.to}
                                                            to={subItem.to}
                                                            className={({ isActive }) =>
                                                                `relative flex items-center px-3 lg:px-4 py-2.5 text-xs lg:text-sm font-medium transition-all ${isActive
                                                                    ? "text-primary"
                                                                    : "text-black hover:text-primary"
                                                                }`
                                                            }
                                                            onClick={() => setShowSubmenu(null)}
                                                        >
                                                            <subItem.icon size={16} className="mr-3" />
                                                            {subItem.label}
                                                            {/* Hover underline */}
                                                            <span
                                                                className="absolute left-0 right-0 -bottom-1 h-0.5 bg-primary rounded-full transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"
                                                            />
                                                        </NavLink>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <NavLink
                                        to={item.to!}
                                        className={({ isActive }) =>
                                            `relative flex items-center px-2 xl:px-3 py-2 group rounded-lg font-medium transition-all text-sm xl:text-base ${isActive
                                                ? "text-primary"
                                                : "hover:text-primary"
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {item.label}
                                                {isActive && (
                                                    <motion.span
                                                        className="absolute -bottom-1 left-0 h-0.5 bg-primary w-full rounded-full"
                                                        layoutId="navbar-indicator"
                                                        transition={{
                                                            type: "spring",
                                                            damping: 20,
                                                            stiffness: 300,
                                                        }}
                                                    />
                                                )}
                                                {/* Hover underline */}
                                                <span
                                                    className="absolute left-0 right-0 -bottom-1 h-0.5 bg-primary rounded-full transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"
                                                />
                                            </>
                                        )}
                                    </NavLink>
                                )}
                            </div>
                        ))}
                    </nav>


                    {/* Search Bar (Desktop) */}
                    {/* <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                                className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                            />
                        </div>
                    </div> */}

                    {/* Action Buttons & User */}
                    <div className="flex items-center space-x-2">
                        <Link to="/messages" className="hidden md:inline-flex">
                            <Button variant="ghost" size="icon" className="relative">
                                <MessageCircle className="w-5 h-5" />
                            </Button>
                        </Link>
                        
                        <div className="">
                            <NotificationDropdown />
                        </div>
                        
                        <ThemeToggle />
                        <Button variant="ghost" size="icon" className="relative hidden md:inline-flex" onClick={() => setCartModalOpen(true)}>
                            <ShoppingCart className="w-5 h-5" />
                            {items.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-card shadow">
                                    {items.length}
                                </span>
                            )}
                        </Button>
                        {/* Nếu chưa đăng nhập thì hiển thị icon user, nhấp vào mở modal đăng nhập */}
                        {!user ? (
                            <Link to="/login" className="hidden md:inline-flex">
                                <Button variant="ghost" size="icon" className="relative" aria-label="Đăng nhập">
                                    <User className="w-7 h-7" />
                                </Button>
                            </Link>
                        ) : (
                            <div className="relative hidden md:block" ref={userMenuRef}>
                                <motion.button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-2 p-1 rounded-xl hover:bg-card/50 transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <img
                                        src={getAvatarUrl(user.avatar)}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 hover:ring-primary/50 transition-all duration-300"
                                    />
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                                        {user.points !== undefined && (
                                            <p className="text-xs text-muted-foreground">{user.points} điểm</p>
                                        )}
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
                                        <div className="hidden md:block p-4 bg-gradient-primary/10 border-b border-border">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={getAvatarUrl(user.avatar)}
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary/20 hover:ring-primary/50 transition-all duration-300"
                                                />
                                                <div>
                                                    <h3 className="font-semibold text-foreground">{user.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                                    <Badge className="mt-1 bg-gradient-primary text-xs">
                                                        {user.role}
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

                                            {/* Kiểm tra trạng thái vendor của user */}
                                            {user && user.role === "user" && vendorStatus !== "approved" && (
                                                <motion.a
                                                    key="vendor-register"
                                                    href="/vendor-registration"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.2, delay: 0.3 }}
                                                    className="flex items-center space-x-3 px-4 py-3 hover:bg-primary/5 transition-all duration-200 group"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <Store className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                                                        Đăng ký Vendor
                                                    </span>
                                                </motion.a>
                                            )}

                                            {user && (user.role === "seller" || vendorStatus === "approved") && (
                                                <motion.a
                                                    key="vendor-dashboard"
                                                    href="/vendor-management"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.2, delay: 0.3 }}
                                                    className="flex items-center space-x-3 px-4 py-3 hover:bg-primary/5 transition-all duration-200 group"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <Store className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                                                        Quản lý cửa hàng
                                                    </span>
                                                </motion.a>
                                            )}

                                            {/* Logout */}
                                            <motion.a
                                                key="logout"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.2, delay: 0.4 }}
                                                className="flex items-center space-x-3 px-4 py-3 hover:bg-destructive/10 text-destructive transition-all duration-200 group"
                                                onClick={logout}
                                            >
                                                <LogOut className="w-5 h-5" />
                                                <span className="text-sm">Đăng xuất</span>
                                            </motion.a>
                                        </div>

                                    </motion.div>
                                )}
                            </div>
                        )}
                        {/* Mobile Menu Trigger */}
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>

                            <SheetContent
                                side="bottom"
                                className={cn(
                                    "p-0 bg-black text-white w-full h-full border-none",
                                    "animate-in slide-in-from-bottom duration-300 ease-out"
                                )}
                            >
                                {/* Title ẩn để bỏ cảnh báo accessibility */}
                                <VisuallyHidden>
                                    <SheetTitle>Navigation Menu</SheetTitle>
                                </VisuallyHidden>

                                <div className="flex flex-col h-full">
                                    {/* Header */}
                                    <div className="px-6 py-6 border-b border-white/10 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative group">
                                                {/* Glow effect */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-accent/50 to-primary/50 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-70"></div>
                                                {/* Logo container */}
                                                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary via-accent to-emerald-600 p-0.5 shadow-xl shadow-primary/40">
                                                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                                                        <img 
                                                            src="/logo.png" 
                                                            alt="VibeMarket Logo" 
                                                            className="w-9 h-9 object-contain"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                const container = e.currentTarget.parentElement;
                                                                if (container) {
                                                                    container.classList.remove('bg-gray-900');
                                                                    container.classList.add('bg-gradient-to-br', 'from-primary', 'via-accent', 'to-emerald-600');
                                                                    const fallback = document.createElement('span');
                                                                    fallback.className = 'text-white font-black text-2xl';
                                                                    fallback.textContent = 'V';
                                                                    container.appendChild(fallback);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col -space-y-1">
                                                <span className="text-2xl font-black bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-600 bg-clip-text text-transparent tracking-tight">
                                                    VibeMarket
                                                </span>
                                                <span className="text-[9px] text-white/60 font-bold tracking-[0.25em] uppercase pl-0.5">
                                                    Fashion & Lifestyle
                                                </span>
                                            </div>
                                        </div>

                                        {/* Quick Action Buttons */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link to="/messages" onClick={() => setOpen(false)} className="block">
                                                <div className="flex flex-col items-center gap-2 py-3 px-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                                                    <MessageCircle className="w-5 h-5 text-white" />
                                                    <span className="text-xs font-medium text-white">Tin nhắn</span>
                                                </div>
                                            </Link>
                                            
                                            <button 
                                                className="relative flex flex-col items-center gap-2 py-3 px-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                onClick={() => {
                                                    setCartModalOpen(true);
                                                    setOpen(false);
                                                }}
                                            >
                                                <div className="relative">
                                                    <ShoppingCart className="w-5 h-5 text-white" />
                                                    {items.length > 0 && (
                                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                                            {items.length}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs font-medium text-white">Giỏ hàng</span>
                                            </button>

                                            {/* <button className="flex flex-col items-center gap-2 py-3 px-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                                                <Bell className="w-5 h-5 text-white" />
                                                <span className="text-xs font-medium text-white">Thông báo</span>
                                            </button> */}
                                        </div>
                                    </div>

                                    {/* Navigation */}
                                    <nav className="flex-1 overflow-y-auto px-4 py-4">
                                        {menuItems.map((menuItem) => (
                                            <div key={menuItem.label} className="mb-6">
                                                {menuItem.hasSubmenu ? (
                                                    <>
                                                        {/* Menu với submenu */}
                                                        <button
                                                            onClick={() => setShowSubmenuMobile(showSubmenuMobile === menuItem.label ? null : menuItem.label)}
                                                            className="w-full flex items-center justify-between px-3 py-2 mb-2 text-xs font-semibold text-white/50 uppercase tracking-wider hover:text-white/70 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <menuItem.icon className="w-4 h-4" />
                                                                <span>{menuItem.label}</span>
                                                            </div>
                                                            <ChevronDown
                                                                className={cn(
                                                                    "w-4 h-4 transition-transform duration-200",
                                                                    showSubmenuMobile === menuItem.label && "rotate-180"
                                                                )}
                                                            />
                                                        </button>
                                                        
                                                        {/* Submenu items với animation */}
                                                        <AnimatePresence>
                                                            {showSubmenuMobile === menuItem.label && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: "auto", opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="space-y-1 overflow-hidden"
                                                                >
                                                                    {menuItem.submenu?.map((subItem) => (
                                                                        <Link
                                                                            key={subItem.to}
                                                                            to={subItem.to}
                                                                            onClick={() => setOpen(false)}
                                                                            className={cn(
                                                                                "flex items-center gap-3 py-2.5 px-3 pl-6 rounded-lg transition-all",
                                                                                pathname === subItem.to
                                                                                    ? "bg-gradient-to-r from-primary/20 to-purple-600/20 text-white font-medium"
                                                                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                                                                            )}
                                                                        >
                                                                            <subItem.icon className="w-5 h-5" />
                                                                            <span className="text-sm">{subItem.label}</span>
                                                                            {pathname === subItem.to && (
                                                                                <motion.div
                                                                                    layoutId="mobile-active-pill"
                                                                                    className="ml-auto w-1.5 h-1.5 bg-primary rounded-full"
                                                                                />
                                                                            )}
                                                                        </Link>
                                                                    ))}
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </>
                                                ) : (
                                                    <>
                                                        {/* Menu không có submenu */}
                                                        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 px-3">
                                                            {menuItem.label}
                                                        </h3>
                                                        <div className="space-y-1">
                                                            <Link
                                                                to={menuItem.to!}
                                                                onClick={() => setOpen(false)}
                                                                className={cn(
                                                                    "flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all",
                                                                    pathname === menuItem.to
                                                                        ? "bg-gradient-to-r from-primary/20 to-purple-600/20 text-white font-medium"
                                                                        : "text-white/80 hover:bg-white/10 hover:text-white"
                                                                )}
                                                            >
                                                                <menuItem.icon className="w-5 h-5" />
                                                                <span className="text-sm">{menuItem.label}</span>
                                                                {pathname === menuItem.to && (
                                                                    <motion.div
                                                                        layoutId="mobile-active-pill"
                                                                        className="ml-auto w-1.5 h-1.5 bg-primary rounded-full"
                                                                    />
                                                                )}
                                                            </Link>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </nav>

                                    {/* User info */}
                                    <div className="border-t border-white/10 px-4 py-4 bg-white/5">
                                        {user ? (
                                            <div className="space-y-3">
                                                {/* User Profile Card - Clickable */}
                                                <button
                                                    onClick={() => setShowMobileUserMenu(!showMobileUserMenu)}
                                                    className="w-full bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-xl p-3 border border-white/10 hover:from-primary/30 hover:to-purple-600/30 transition-all"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={getAvatarUrl(user.avatar)}
                                                            alt={user.name}
                                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/50"
                                                        />
                                                        <div className="flex-1 min-w-0 text-left">
                                                            <div className="font-semibold text-white truncate">{user.name}</div>
                                                            <div className="text-xs text-white/70 truncate">{user.email}</div>
                                                            <Badge className="mt-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs border-0">
                                                                <Star className="w-3 h-3 mr-1" />
                                                                {user.role}
                                                            </Badge>
                                                        </div>
                                                        <ChevronDown
                                                            className={cn(
                                                                "w-5 h-5 text-white/70 transition-transform duration-200 flex-shrink-0",
                                                                showMobileUserMenu && "rotate-180"
                                                            )}
                                                        />
                                                    </div>
                                                </button>

                                                {/* User Menu Items với animation */}
                                                <AnimatePresence>
                                                    {showMobileUserMenu && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="space-y-2 overflow-hidden"
                                                        >
                                                            {/* Quick Actions Grid */}
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <Link
                                                                    to="/profile"
                                                                    onClick={() => setOpen(false)}
                                                                    className="flex flex-col items-center gap-2 py-3 px-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                                >
                                                                    <User className="w-5 h-5" />
                                                                    <span className="text-xs font-medium">Hồ sơ</span>
                                                                </Link>
                                                                <Link
                                                                    to="/orders"
                                                                    onClick={() => setOpen(false)}
                                                                    className="flex flex-col items-center gap-2 py-3 px-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                                >
                                                                    <Package className="w-5 h-5" />
                                                                    <span className="text-xs font-medium">Đơn hàng</span>
                                                                </Link>
                                                                <Link
                                                                    to="/wishlist"
                                                                    onClick={() => setOpen(false)}
                                                                    className="flex flex-col items-center gap-2 py-3 px-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                                >
                                                                    <Heart className="w-5 h-5" />
                                                                    <span className="text-xs font-medium">Yêu thích</span>
                                                                </Link>
                                                                <Link
                                                                    to="/wallet"
                                                                    onClick={() => setOpen(false)}
                                                                    className="flex flex-col items-center gap-2 py-3 px-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                                >
                                                                    <Wallet className="w-5 h-5" />
                                                                    <span className="text-xs font-medium">Ví</span>
                                                                </Link>
                                                            </div>

                                                            {/* Vendor Options */}
                                                            {user && user.role === "user" && vendorStatus !== "approved" && (
                                                                <Link
                                                                    to="/vendor-registration"
                                                                    onClick={() => setOpen(false)}
                                                                    className="flex items-center gap-3 py-2.5 px-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                                >
                                                                    <Store className="w-5 h-5" />
                                                                    <span className="text-sm font-medium">Đăng ký Vendor</span>
                                                                </Link>
                                                            )}

                                                            {user && (user.role === "seller" || vendorStatus === "approved") && (
                                                                <Link
                                                                    to="/vendor-management"
                                                                    onClick={() => setOpen(false)}
                                                                    className="flex items-center gap-3 py-2.5 px-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                                >
                                                                    <Store className="w-5 h-5" />
                                                                    <span className="text-sm font-medium">Quản lý cửa hàng</span>
                                                                </Link>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Logout Button */}
                                                <Button
                                                    onClick={() => {
                                                        logout();
                                                        setOpen(false);
                                                    }}
                                                    variant="outline"
                                                    className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500"
                                                >
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    Đăng xuất
                                                </Button>
                                            </div>
                                        ) : (
                                            <Link
                                                to="/login"
                                                onClick={() => setOpen(false)}
                                                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-primary to-purple-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all"
                                            >
                                                <User className="w-5 h-5" />
                                                Đăng nhập
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
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
            {/* ShoppingCart Modal */}
            <ShoppingCartModal
                open={cartModalOpen}
                onOpenChange={setCartModalOpen}
            />
        </motion.nav>
    );
};

export default Navigation;