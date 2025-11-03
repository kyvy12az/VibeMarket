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
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";

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
    const location = useLocation();
    const collapsed = state === "collapsed";

    const isActive = (path: string) => {
        if (path === "/vendor-management") {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const getNavCls = (active: boolean) =>
        active ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted/50";

    return (
        <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
            {/* Nội dung chính */}
            <SidebarContent className="bg-card border-r flex flex-col h-full justify-between">
                <div>
                    {/* Header */}
                    <div className="p-4 border-b">
                        <div className="flex items-center gap-2">
                            <Store className="w-6 h-6 text-primary" />
                            {!collapsed && (
                                <span className="font-bold text-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                    Shop Manager
                                </span>
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
