import { LayoutDashboard, Package, ShoppingCart, BarChart3, Plus, Settings, Store, Home } from "lucide-react";
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

const menuItems = [
    { title: "Tổng quan", url: "/vendor-management", icon: LayoutDashboard },
    { title: "Đơn hàng", url: "/vendor-management/order-management", icon: ShoppingCart },
    { title: "Sản phẩm", url: "/vendor-management/product-management", icon: Package },
    { title: "Thêm sản phẩm", url: "/vendor-management/add-product", icon: Plus },
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
        <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
            <SidebarContent className="bg-card border-r flex flex-col h-full justify-between">
                <div>
                    {/* Header */}
                    <div className="p-4 border-b">
                        <div className="flex items-center gap-3">
                            {loading ? (
                                <>
                                    <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                                    {!collapsed && (
                                        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                                    )}
                                </>
                            ) : storeInfo ? (
                                <>
                                    <Avatar className={collapsed ? "w-5 h-5" : "w-10 h-10"} collapsible="icon">
                                        <AvatarImage src={storeInfo.avatar || undefined} alt={storeInfo.store_name} />
                                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs">
                                            {getInitials(storeInfo.store_name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {!collapsed && (
                                        <span className="font-bold text-base bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent truncate">
                                            {storeInfo.store_name}
                                        </span>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Store className="w-6 h-6 text-primary" />
                                    {!collapsed && (
                                        <span className="font-bold text-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                            Shop Manager
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Menu chính */}
                    <SidebarGroup>
                        <SidebarGroupLabel>Quản lý cửa hàng</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {menuItems.map((item: any) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <NavLink
                                                to={item.url}
                                                end={item.url === "/vendor-management"}
                                                className={getNavCls(isActive(item.url))}
                                            >
                                                <item.icon className={collapsed ? "w-4 h-4" : "w-4 h-4 mr-2"} />
                                                {!collapsed && <span>{item.title}</span>}
                                            </NavLink>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </div>

                {/* Footer với icon Home */}
                <div className="border-t p-4 flex justify-center">
                    <NavLink
                        to="/"
                        className="flex items-center justify-center w-full text-muted-foreground hover:text-primary transition-colors"
                    >
                        <Home className="w-6 h-6" />
                        {!collapsed && <span className="ml-2 font-medium">Trang chủ</span>}
                    </NavLink>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}
