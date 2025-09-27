import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import ShoppingCartModal from "./ShoppingCartModal";

const ProductGrid = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const products = [
    {
      id: 1,
      name: "Áo thun local brand",
      price: "299.000",
      originalPrice: "399.000",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      rating: 4.8,
      reviews: 124,
      discount: 25,
      isLive: true,
    },
    {
      id: 2,
      name: "Túi xách vintage",
      price: "450.000",
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
      rating: 4.9,
      reviews: 89,
      discount: 0,
      isLive: false,
    },
    {
      id: 3,
      name: "Sneakers limited",
      price: "1.299.000",
      originalPrice: "1.599.000",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      rating: 4.7,
      reviews: 256,
      discount: 19,
      isLive: true,
    },
    {
      id: 4,
      name: "Tai nghe gaming",
      price: "899.000",
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
      rating: 4.6,
      reviews: 167,
      discount: 0,
      isLive: false,
    },
    {
      id: 5,
      name: "Đồng hồ thông minh",
      price: "2.299.000",
      originalPrice: "2.799.000",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      rating: 4.9,
      reviews: 203,
      discount: 18,
      isLive: true,
    },
    {
      id: 6,
      name: "Balo laptop cao cấp",
      price: "799.000",
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      rating: 4.5,
      reviews: 92,
      discount: 0,
      isLive: false,
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Sản phẩm <span className="bg-gradient-hero bg-clip-text text-transparent">Hot Trend</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Khám phá những sản phẩm được yêu thích nhất từ cộng đồng
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="bg-gradient-card border-border hover-glow overflow-hidden">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full object-contain bg-white group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.discount > 0 && (
                      <Badge className="bg-destructive text-white">
                        -{product.discount}%
                      </Badge>
                    )}
                    {product.isLive && (
                      <Badge className="bg-accent text-white animate-pulse">
                        🔴 Live
                      </Badge>
                    )}
                  </div>

                  {/* Heart Icon */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-3 right-3 w-8 h-8 bg-background/20 backdrop-blur-sm hover:bg-background/40 text-white"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="w-10 h-10"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="w-10 h-10 bg-gradient-primary"
                      onClick={() => {
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          originalPrice: product.originalPrice,
                          image: product.image
                        });
                        toast({
                          title: "Đã thêm vào giỏ hàng",
                          description: `${product.name} đã được thêm vào giỏ hàng.`,
                        });
                      }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-1 mt-2 mb-3">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews} đánh giá)
                    </span> 
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-primary">
                        {product.price}đ
                      </span>
                      <span className="text-sm text-muted-foreground line-through min-h-[20px] flex items-center">
                        {product.originalPrice ? `${product.originalPrice}đ` : ''}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      className="bg-gradient-primary hover:opacity-90 transition-smooth"
                      onClick={() => {
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          originalPrice: product.originalPrice,
                          image: product.image
                        });
                        setCartModalOpen(true);
                      }}
                    >
                      Thêm vào giỏ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <Link to="/shop">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary/10 transition-smooth"
            >
              Xem tất cả sản phẩm
            </Button>
          </motion.div>
        </Link>
        <ShoppingCartModal
          open={cartModalOpen}
          onOpenChange={setCartModalOpen}
        />
      </div>
    </section>
  );
};

export default ProductGrid;