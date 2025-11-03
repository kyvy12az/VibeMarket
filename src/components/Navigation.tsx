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
    {
        to: "/",
        label: "Trang chủ",
        icon: Home,
        hasSubmenu: false
    },
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
            { to: "/ai-stylist", label: "AI Stylist", icon: Gift },
            { to: "/ai-recomment", label: "AI gợi ý & Bạn bè", icon: UserCircle },
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
                        <Link to="/messages">
                            <Button variant="ghost" size="icon" className="relative">
                                <MessageCircle className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="w-5 h-5" />
                        </Button>
                        <ThemeToggle />
                        <Button variant="ghost" size="icon" className="relative" onClick={() => setCartModalOpen(true)}>
                            <ShoppingCart className="w-5 h-5" />
                            {items.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-card shadow">
                                    {items.length}
                                </span>
                            )}
                        </Button>
                        {/* Nếu chưa đăng nhập thì hiển thị icon user, nhấp vào mở modal đăng nhập */}
                        {!user ? (
                            <Link to="/login">
                                <Button variant="ghost" size="icon" className="relative" aria-label="Đăng nhập">
                                    <User className="w-7 h-7" />
                                </Button>
                            </Link>
                        ) : (
                            <div className="relative" ref={userMenuRef}>
                                <motion.button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-2 p-1 rounded-xl hover:bg-card/50 transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar || "/images/avatars/Avt-Default.png"}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 hover:ring-primary/50 transition-all duration-300"
                                        />
                                    ) : (
                                        <img
                                            src="/images/avatars/Avt-Default.png"
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 hover:ring-primary/50 transition-all duration-300"
                                        />
                                    )}
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
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary/20 hover:ring-primary/50 transition-all duration-300"
                                                    />
                                                ) : (
                                                    <img
                                                        src="/images/avatars/Avt-Default.png"
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 hover:ring-primary/50 transition-all duration-300"
                                                    />
                                                )}
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
                                side="left"
                                className={cn(
                                    "p-0 bg-black text-white w-72 border-none",
                                    "animate-in slide-in-from-left duration-300 ease-out" // 👈 hiệu ứng mượt
                                )}
                            >
                                {/* Title ẩn để bỏ cảnh báo accessibility */}
                                <VisuallyHidden>
                                    <SheetTitle>Navigation Menu</SheetTitle>
                                </VisuallyHidden>

                                <div className="flex flex-col h-full">
                                    {/* Header */}
                                    <div className="flex items-center space-x-3 px-6 py-6 border-b border-white/10">
                                        <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center">
                                            <span className="text-white font-bold text-xl">V</span>
                                        </div>
                                        <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                                            VibeMarket
                                        </span>
                                    </div>

                                    {/* Navigation */}
                                    <nav className="flex-1 flex flex-col gap-1 px-6 py-4">
                                        {[
                                            { name: "Trang chủ", href: "/", icon: <Home className="w-5 h-5 mr-4 ml-2" /> },
                                            { name: "Mua sắm", href: "/shop", icon: <ShoppingCart className="w-5 h-5 mr-4 ml-2" /> },
                                            { name: "Cộng đồng", href: "/community", icon: <User className="w-5 h-5 mr-4 ml-2" /> },
                                            { name: "Khám phá", href: "/discover", icon: <Search className="w-5 h-5 mr-4 ml-2" /> },
                                            { name: "Flash Sale", href: "/flash-sale", icon: <Zap className="w-5 h-5 mr-4 ml-2" /> },
                                            { name: "Local Brand", href: "/local-brand", icon: <StoreIcon className="w-5 h-5 mr-4 ml-2" /> },
                                            { name: "AI Stylist", href: "/ai-stylist", icon: <Sparkles className="w-5 h-5 mr-4 ml-2" /> },
                                            { name: "Ví & Điểm thưởng", href: "/wallet", icon: <Wallet className="w-5 h-5 mr-4 ml-2" /> },
                                            { name: "Vòng quay nhận quà", href: "/lucky-wheel", icon: <Gift className="w-5 h-5 mr-4 ml-2" /> },
                                            { name: "Giới thiệu", href: "/about", icon: <Info className="w-5 h-5 mr-4 ml-2" /> },
                                        ].map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className="flex items-center py-3 px-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
                                            >
                                                {item.icon}
                                                {item.name}
                                            </a>
                                        ))}
                                    </nav>

                                    {/* User info */}
                                    {user ? (
                                        <div className="px-6 pb-6 mt-auto">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Avatar className="w-8 h-8">
                                                    <AvatarImage src={user.avatar} alt={user.name} />
                                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-semibold">{user.name}</div>
                                                    <div className="text-xs text-white/70">{user.email}</div>
                                                    <div className="text-xs text-yellow-400 font-semibold flex items-center gap-1 mt-1">
                                                        <Star className="w-4 h-4 inline-block" /> {user.role}
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                variant="outline"
                                                className="w-full border-white/20 text-white hover:bg-white/10"
                                            >
                                                Đăng xuất
                                            </Button>
                                        </div>
                                    ) : null}
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