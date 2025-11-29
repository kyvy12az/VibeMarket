import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, ShoppingCart, Eye, TrendingUp, Sparkles, Zap, Crown, ArrowRight } from "lucide-react";
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
  const [likedProducts, setLikedProducts] = useState<number[]>([]);

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
      isTrending: true,
      seller: {
        name: "LocalBrandVN",
        avatar: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=60&h=60&fit=crop",
        verified: true,
      },
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
      isTrending: false,
      seller: {
        name: "VintageShop",
        avatar: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=60&h=60&fit=crop",
        verified: true,
      },
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
      isTrending: true,
      seller: {
        name: "SneakerZone",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop",
        verified: true,
      },
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
      isTrending: false,
      seller: {
        name: "GameAudio",
        avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=60&h=60&fit=crop",
        verified: false,
      },
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
      isTrending: true,
      seller: {
        name: "SmartWatchVN",
        avatar: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=60&h=60&fit=crop",
        verified: true,
      },
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
      isTrending: false,
      seller: {
        name: "LaptopBagPro",
        avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=60&h=60&fit=crop",
        verified: false,
      },
    },
  ];

  const toggleLike = (productId: number) => {
    setLikedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex flex-col items-center justify-center mb-6">
            {/* Animated Icon Container */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.8 }}
              className="relative mb-4"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl blur-xl opacity-50"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
              Sản phẩm{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Hot Trend
              </span>
            </h2>

            <motion.div
              className="flex items-center justify-center gap-2 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.div
                className="h-1 w-16 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "4rem" }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              ></motion.div>
              <motion.div
                className="h-1.5 w-8 bg-gradient-to-r from-primary to-purple-600 rounded-full"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4, type: "spring" }}
              ></motion.div>
              <motion.div
                className="h-1 w-16 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "4rem" }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              ></motion.div>
            </motion.div>

            {/* Subtitle */}
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
              Khám phá những sản phẩm được yêu thích nhất từ cộng đồng
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">6</div>
                  <div className="text-xs text-muted-foreground">Hot Items</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">50%</div>
                  <div className="text-xs text-muted-foreground">Sale Off</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group cursor-pointer"
            >
              <Card className="relative overflow-hidden border-2 border-border/50 hover:border-primary/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                {/* Top Border Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />

                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.discount > 0 && (
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg animate-pulse">
                        <Zap className="w-3 h-3 mr-1" />
                        -{product.discount}%
                      </Badge>
                    )}
                    {product.isLive && (
                      <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white border-0 shadow-lg">
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-2 h-2 bg-white rounded-full mr-2"
                        />
                        LIVE
                      </Badge>
                    )}
                    {product.isTrending && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Hot
                      </Badge>
                    )}
                  </div>

                  {/* Heart Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`absolute top-3 right-3 w-10 h-10 rounded-full backdrop-blur-md shadow-lg transition-all ${likedProducts.includes(product.id)
                          ? "bg-red-500/90 hover:bg-red-500 text-white"
                          : "bg-white/20 hover:bg-white/40 text-white"
                        }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(product.id);
                      }}
                    >
                      <Heart
                        className={`w-5 h-5 transition-all ${likedProducts.includes(product.id) ? "fill-white" : ""
                          }`}
                      />
                    </Button>
                  </motion.div>

                  {/* Quick Actions Overlay */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-center gap-3"
                  >
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="backdrop-blur-md bg-background shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product.id}`);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
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
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Thêm
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.6 }}
                  />
                </div>

                {/* Content */}
                <CardContent className="p-5 relative">
                  {/* Seller Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="relative">
                      <img
                        src={product.seller.avatar}
                        alt={product.seller.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-primary/20"
                      />
                      {product.seller.verified && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-card">
                          <Crown className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {product.seller.name}
                    </span>
                  </div>

                  {/* Product Name */}
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating)
                              ? "fill-amber-500 text-amber-500"
                              : "fill-gray-300 text-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews} đánh giá)
                    </span>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {product.price}đ
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.originalPrice}đ
                        </span>
                      )}
                    </div>

                    {/* Mobile Add to Cart */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="lg:hidden"
                    >
                      <Button
                        size="icon"
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-lg"
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
                        <ShoppingCart className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <Link to="/shop">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-600 text-white font-bold px-10 py-7 rounded-2xl shadow-2xl hover:shadow-primary/50 transition-all duration-300 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Xem tất cả sản phẩm
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>

      <ShoppingCartModal
        open={cartModalOpen}
        onOpenChange={setCartModalOpen}
      />
    </section>
  );
};

export default ProductGrid;