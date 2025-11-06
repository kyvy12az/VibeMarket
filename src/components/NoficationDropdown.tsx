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
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-lg">Thông báo</h3>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-8"
              >
                <Check className="w-3 h-3 mr-1" />
                Đọc tất cả
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-xs h-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Xóa tất cả
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          <AnimatePresence mode="popLayout">
            {notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 px-4"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-center">
                  Không có thông báo nào
                </p>
              </motion.div>
            ) : (
              notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    className={cn(
                      "p-4 hover:bg-accent/50 transition-colors cursor-pointer relative group",
                      !notification.isRead && "bg-primary/5"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                          getNotificationBgColor(notification.type)
                        )}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className={cn(
                              "font-medium text-sm line-clamp-1",
                              !notification.isRead && "text-foreground font-semibold"
                            )}
                          >
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {notification.time}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-3">
              <Button variant="ghost" className="w-full text-sm text-primary hover:text-primary">
                Xem tất cả thông báo
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
