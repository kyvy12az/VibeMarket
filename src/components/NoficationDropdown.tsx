import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, ShoppingBag, Tag, Users, Star, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "order" | "promotion" | "community" | "system";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon?: React.ReactNode;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "Đơn hàng đã được giao",
    message: "Đơn hàng #12345 đã được giao thành công",
    time: "5 phút trước",
    isRead: false,
  },
  {
    id: "2",
    type: "promotion",
    title: "Flash Sale sắp bắt đầu",
    message: "Giảm giá lên đến 50% cho danh mục thời trang",
    time: "1 giờ trước",
    isRead: false,
  },
  {
    id: "3",
    type: "community",
    title: "Bài viết mới từ người bạn theo dõi",
    message: "Nguyễn Văn A vừa đăng bài viết mới",
    time: "2 giờ trước",
    isRead: false,
  },
  {
    id: "4",
    type: "system",
    title: "Cập nhật hệ thống",
    message: "Chúng tôi đã thêm tính năng AI Stylist mới",
    time: "1 ngày trước",
    isRead: true,
  },
  {
    id: "5",
    type: "order",
    title: "Đơn hàng đang được vận chuyển",
    message: "Đơn hàng #12344 đang trên đường giao đến bạn",
    time: "2 ngày trước",
    isRead: true,
  },
  {
    id: "6",
    type: "promotion",
    title: "Nhận voucher 100K",
    message: "Bạn có voucher giảm giá 100K cho đơn hàng tiếp theo",
    time: "3 ngày trước",
    isRead: true,
  },
];

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "order":
      return <ShoppingBag className="w-5 h-5 text-primary" />;
    case "promotion":
      return <Tag className="w-5 h-5 text-accent" />;
    case "community":
      return <Users className="w-5 h-5 text-success" />;
    case "system":
      return <Star className="w-5 h-5 text-warning" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
};

const getNotificationBgColor = (type: Notification["type"]) => {
  switch (type) {
    case "order":
      return "bg-primary/10";
    case "promotion":
      return "bg-accent/10";
    case "community":
      return "bg-success/10";
    case "system":
      return "bg-warning/10";
    default:
      return "bg-muted";
  }
};

export const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="icon" className="relative group">
            <motion.div
              animate={unreadCount > 0 ? { rotate: [0, -15, 15, -15, 0] } : {}}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <Bell className="w-5 h-5 group-hover:text-primary transition-colors" />
            </motion.div>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1"
              >
                <Badge className="w-5 h-5 p-0 flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-600 text-white text-xs font-bold border-2 border-background shadow-lg">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              </motion.div>
            )}
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[420px] p-0 overflow-hidden" align="end">
        {/* Header với gradient */}
        <div className="bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/5 backdrop-blur-sm border-b border-border/50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Thông báo
                </h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {unreadCount} thông báo chưa đọc
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs h-8 hover:bg-primary/10"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Đọc tất cả
                  </Button>
                </motion.div>
              )}
              {notifications.length > 0 && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Xóa
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <ScrollArea className="h-[450px]">
          <AnimatePresence mode="popLayout">
            {notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-16 px-4"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-4 shadow-lg"
                >
                  <Bell className="w-10 h-10 text-primary" />
                </motion.div>
                <p className="text-muted-foreground text-center font-medium">
                  Không có thông báo nào
                </p>
                <p className="text-xs text-muted-foreground/70 text-center mt-1">
                  Các thông báo mới sẽ xuất hiện ở đây
                </p>
              </motion.div>
            ) : (
              notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{
                    delay: index * 0.03,
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                >
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={cn(
                      "p-4 transition-all cursor-pointer relative group border-l-4",
                      !notification.isRead
                        ? "bg-gradient-to-r from-primary/10 via-transparent to-transparent border-l-primary hover:from-primary/15"
                        : "border-l-transparent hover:bg-accent/30"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md",
                          notification.type === "order" && "bg-gradient-to-br from-blue-500/20 to-blue-600/30",
                          notification.type === "promotion" && "bg-gradient-to-br from-orange-500/20 to-red-600/30",
                          notification.type === "community" && "bg-gradient-to-br from-green-500/20 to-emerald-600/30",
                          notification.type === "system" && "bg-gradient-to-br from-purple-500/20 to-pink-600/30"
                        )}
                      >
                        {getNotificationIcon(notification.type)}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4
                            className={cn(
                              "font-medium text-sm line-clamp-1",
                              !notification.isRead && "text-foreground font-bold"
                            )}
                          >
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-primary to-purple-600 flex-shrink-0 mt-1 shadow-lg shadow-primary/50"
                            />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
                            <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                            {notification.time}
                          </div>
                        </div>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0 hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                  {index < notifications.length - 1 && (
                    <Separator className="opacity-50" />
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <Separator className="opacity-50" />
            <div className="p-3 bg-gradient-to-r from-transparent via-primary/5 to-transparent">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="ghost"
                  className="w-full text-sm font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent hover:from-primary hover:to-purple-600 hover:bg-primary/5"
                >
                  Xem tất cả thông báo
                </Button>
              </motion.div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
