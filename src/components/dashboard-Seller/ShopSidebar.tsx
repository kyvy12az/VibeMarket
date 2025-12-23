import { LayoutDashboard, Package, ShoppingCart, BarChart3, Plus, Settings, Store, Home, MessageSquare, Ticket } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const menuItems = [
    { title: "Tổng quan", url: "/vendor-management", icon: LayoutDashboard },
    { title: "Đơn hàng", url: "/vendor-management/order-management", icon: ShoppingCart },
    { title: "Sản phẩm", url: "/vendor-management/product-management", icon: Package },
    { title: "Thêm sản phẩm", url: "/vendor-management/add-product", icon: Plus },
    { title: "Mã giảm giá", url: "/vendor-management/coupons", icon: Ticket },
    { title: "Thống kê", url: "/vendor-management/statistics", icon: BarChart3 },
    { title: "Cài đặt", url: "/vendor-management/setting", icon: Settings },
];

export function ShopSidebar() {
    const { state } = useSidebar();
    const { user } = useAuth();
    const location = useLocation();
    const collapsed = state === "collapsed";

    const [storeInfo, setStoreInfo] = useState<{
        store_name: string;
        avatar: string | null;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStoreInfo = async () => {
            if (!user?.id) return;

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/vendor/get_store_info.php?user_id=${user.id}`
                );
                const data = await response.json();

                if (data.success) {
                    setStoreInfo({
                        store_name: data.store_name,
                        avatar: data.avatar,
                    });
                }
            } catch (error) {
                console.error("Error fetching store info:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStoreInfo();
    }, [user]);

    const isActive = (path: string) => {
        if (path === "/vendor-management") {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const getNavCls = (active: boolean) =>
        active ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted/50";

    // Lấy chữ cái đầu của tên cửa hàng để làm fallback
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Sidebar
            className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300 border-none group`}
            collapsible="icon"
        >
            <SidebarContent className="bg-background border-r border-slate-200/60 dark:border-slate-800/60 flex flex-col h-full justify-between overflow-hidden">
                <div>
                    {/* --- HEADER: STORE IDENTITY --- */}
                    <div className={`p-6 mb-2 ${collapsed ? "flex justify-center" : ""}`}>
                        <div className="flex items-center gap-4">
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                    {!collapsed && <div className="h-5 w-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />}
                                </div>
                            ) : storeInfo ? (
                                <>
                                    {/* Avatar với viền Gradient nịnh mắt */}
                                    <div className="relative group/avatar">
                                        <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover/avatar:opacity-50 transition duration-500" />
                                        <Avatar className={`${collapsed ? "w-10 h-10" : "w-12 h-12"} rounded-2xl border-2 border-background relative`}>
                                            <AvatarImage src={storeInfo.avatar || "/images/avatars/Store-Avatar.png"} className="object-cover" />
                                            <AvatarFallback className="bg-slate-100 dark:bg-slate-800 font-black text-indigo-500">
                                                {getInitials(storeInfo.store_name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    {!collapsed && (
                                        <div className="flex flex-col truncate">
                                            <span className="font-black text-slate-900 dark:text-white tracking-tight truncate leading-none mb-1">
                                                {storeInfo.store_name}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cửa hàng xác thực</span>
                                            </div>
                                        </ div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="p-2.5 rounded-2xl bg-indigo-500 shadow-lg shadow-indigo-500/20">
                                        <Store className="w-6 h-6 text-white" />
                                    </div>
                                    {!collapsed && (
                                        <span className="font-black text-xl tracking-tighter bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                                            VibeMarket
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* --- MAIN MENU --- */}
                    <SidebarGroup className="px-4">
                        {!collapsed && (
                            <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 px-2">
                                Hệ thống quản lý
                            </SidebarGroupLabel>
                        )}
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-1.5">
                                {menuItems.map((item: any) => {
                                    const active = isActive(item.url);
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <NavLink
                                                    to={item.url}
                                                    end={item.url === "/vendor-management"}
                                                    className={`
                        flex items-center gap-3 px-4 py-6 rounded-2xl transition-all duration-300 group/item
                        ${active
                                                            ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/5"
                                                            : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                                                        }
                      `}
                                                >
                                                    <div className={`
                        transition-transform duration-300 group-hover/item:scale-110
                        ${active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500 group-hover/item:text-indigo-500"}
                      `}>
                                                        <item.icon className={collapsed ? "w-6 h-6" : "w-5 h-5"} strokeWidth={active ? 2.5 : 2} />
                                                    </div>

                                                    {!collapsed && (
                                                        <span className={`font-bold tracking-tight ${active ? "text-indigo-600 dark:text-indigo-400" : ""}`}>
                                                            {item.title}
                                                        </span>
                                                    )}

                                                    {/* Hiệu ứng thanh chỉ báo bên phải khi Active */}
                                                    {active && !collapsed && (
                                                        <motion.div
                                                            layoutId="activeBar"
                                                            className="absolute right-0 w-1 h-6 bg-indigo-500 rounded-l-full"
                                                        />
                                                    )}
                                                </NavLink>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </div>

                {/* --- FOOTER: BACK HOME --- */}
                <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                    <NavLink
                        to="/"
                        className="group/home flex items-center justify-center w-full p-3 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none"
                    >
                        <div className="relative">
                            <Home className="w-6 h-6 text-slate-400 group-hover/home:text-indigo-500 transition-colors" />
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full border-2 border-background group-hover:scale-110 transition-transform" />
                        </div>
                        {!collapsed && (
                            <div className="ml-3 flex flex-col items-start leading-none">
                                <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tighter">Trang chủ</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Quay lại chợ</span>
                            </div>
                        )}
                    </NavLink>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}
