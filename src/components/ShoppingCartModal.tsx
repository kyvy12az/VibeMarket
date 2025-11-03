import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import hotToast from "react-hot-toast";

interface ShoppingCartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShoppingCartModal: React.FC<ShoppingCartModalProps> = ({ open, onOpenChange }) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Giỏ hàng trống",
        description: "Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.",
        variant: "destructive"
      });
      return;
    }
    onOpenChange(false);
    hotToast.loading("Đang chuyển đến trang thanh toán...", {
      duration: 1500,
      position: "top-center",
    });

    setTimeout(() => {
      navigate('/checkout', { state: { products: items } });
    }, 1000);
  };

  const handleRemoveItem = (id: number, name: string) => {
    removeFromCart(id);
    toast({
      title: "Đã xóa sản phẩm",
      description: `${name} đã được xóa khỏi giỏ hàng.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-gradient-card border-border">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <ShoppingBag className="w-6 h-6 text-primary" />
            Giỏ hàng của bạn
            {getTotalItems() > 0 && (
              <Badge className="bg-primary text-primary-foreground">
                {getTotalItems()} sản phẩm
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col max-h-[60vh]">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Giỏ hàng trống
              </h3>
              <p className="text-muted-foreground mb-6">
                Hãy thêm một số sản phẩm để bắt đầu mua sắm
              </p>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-gradient-primary hover:opacity-90 transition-smooth"
              >
                Tiếp tục mua sắm
              </Button>
            </motion.div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 p-4 bg-background/50 rounded-lg border border-border hover-glow"
                    >
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <h4 className="font-semibold text-foreground">{item.name}</h4>

                        {(item.size || item.color) && (
                          <div className="flex gap-2">
                            {item.size && (
                              <Badge variant="outline" className="text-xs">
                                Size: {item.size}
                              </Badge>
                            )}
                            {item.color && (
                              <Badge variant="outline" className="text-xs">
                                Màu: {item.color}
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="font-bold text-primary">
                              {formatPrice(item.price)}
                            </span>
                            {item.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(item.originalPrice)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-background rounded-md border border-border">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="w-8 h-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="w-8 h-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            <Button
                              size="icon"
                              variant="ghost"
                              className="w-8 h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemoveItem(item.id, item.name)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-primary text-primary hover:bg-primary/10 transition-smooth"
                    onClick={() => onOpenChange(false)}
                  >
                    Tiếp tục mua sắm
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-primary hover:opacity-90 transition-smooth"
                    onClick={handleCheckout}
                  >
                    Thanh toán
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingCartModal;