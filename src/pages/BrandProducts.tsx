import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Users, Award, Star, ArrowLeft, Filter, ShoppingCart, Share2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const BrandProducts = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  // Mock brand data
  const brands = {
    "1": {
      id: 1,
      name: "Canifa",
      category: "Thời trang",
      description: "Thương hiệu thời trang Việt Nam với 20 năm kinh nghiệm, mang đến những sản phẩm chất lượng cao với giá cả phải chăng.",
      coverImage: "/placeholder.svg",
      logo: "/placeholder.svg",
      location: "Hà Nội",
      followers: 125000,
      products: 1500,
      rating: 4.8,
      established: "2001",
      verified: true,
    },
    "2": {
      id: 2,
      name: "Biti's",
      category: "Giày dép",
      description: "Thương hiệu giày Việt Nam hàng đầu, tiên phong trong việc ứng dụng công nghệ vào sản xuất giày thể thao.",
      coverImage: "/placeholder.svg",
      logo: "/placeholder.svg",
      location: "TP.HCM",
      followers: 98000,
      products: 850,
      rating: 4.7,
      established: "1982",
      verified: true,
    },
    "3": {
      id: 3,
      name: "Saigon Skirt",
      category: "Thời trang nữ",
      description: "Thương hiệu váy áo nữ hiện đại, kết hợp giữa phong cách truyền thống và xu hướng thế giới.",
      coverImage: "/placeholder.svg",
      logo: "/placeholder.svg",
      location: "TP.HCM",
      followers: 45000,
      products: 320,
      rating: 4.9,
      established: "2015",
      verified: false,
    },
    "4": {
      id: 4,
      name: "Cầu Tre Việt",
      category: "Thủ công mỹ nghệ",
      description: "Chuyên sản xuất các sản phẩm thủ công từ tre nứa, thân thiện với môi trường và mang đậm bản sắc Việt.",
      coverImage: "/placeholder.svg",
      logo: "/placeholder.svg",
      location: "Hưng Yên",
      followers: 23000,
      products: 180,
      rating: 4.6,
      established: "2018",
      verified: false,
    },
  };

  const brand = brands[brandId as keyof typeof brands];

  // Mock products data based on brand
  const allProducts = {
    "1": [ // Canifa
      { id: 101, name: "Áo sơ mi Premium", category: "Áo", price: 299000, image: "/placeholder.svg", rating: 4.8, sold: 1250, discount: 20, inStock: true },
      { id: 102, name: "Quần jean slim fit", category: "Quần", price: 450000, image: "/placeholder.svg", rating: 4.7, sold: 890, discount: 0, inStock: true },
      { id: 103, name: "Áo thun cotton basic", category: "Áo", price: 199000, image: "/placeholder.svg", rating: 4.9, sold: 2100, discount: 15, inStock: true },
      { id: 104, name: "Áo khoác hoodie", category: "Áo khoác", price: 550000, image: "/placeholder.svg", rating: 4.6, sold: 560, discount: 0, inStock: true },
      { id: 105, name: "Quần jogger", category: "Quần", price: 399000, image: "/placeholder.svg", rating: 4.8, sold: 780, discount: 10, inStock: false },
      { id: 106, name: "Áo polo nam", category: "Áo", price: 349000, image: "/placeholder.svg", rating: 4.7, sold: 920, discount: 0, inStock: true },
      { id: 107, name: "Quần short kaki", category: "Quần", price: 279000, image: "/placeholder.svg", rating: 4.5, sold: 670, discount: 25, inStock: true },
      { id: 108, name: "Áo cardigan", category: "Áo khoác", price: 489000, image: "/placeholder.svg", rating: 4.9, sold: 430, discount: 0, inStock: true },
    ],
    "2": [ // Biti's
      { id: 201, name: "Giày thể thao Hunter", category: "Giày thể thao", price: 850000, image: "/placeholder.svg", rating: 4.9, sold: 890, discount: 0, inStock: true },
      { id: 202, name: "Dép sandal quai ngang", category: "Dép", price: 320000, image: "/placeholder.svg", rating: 4.6, sold: 1200, discount: 15, inStock: true },
      { id: 203, name: "Giày cao gót nữ", category: "Giày cao gót", price: 650000, image: "/placeholder.svg", rating: 4.8, sold: 540, discount: 0, inStock: true },
      { id: 204, name: "Giày lười nam", category: "Giày lười", price: 590000, image: "/placeholder.svg", rating: 4.7, sold: 720, discount: 20, inStock: true },
      { id: 205, name: "Giày chạy bộ", category: "Giày thể thao", price: 920000, image: "/placeholder.svg", rating: 4.9, sold: 680, discount: 0, inStock: true },
      { id: 206, name: "Dép xỏ ngón", category: "Dép", price: 280000, image: "/placeholder.svg", rating: 4.5, sold: 950, discount: 10, inStock: true },
    ],
    "3": [ // Saigon Skirt
      { id: 301, name: "Váy midi hoa nhí", category: "Váy", price: 450000, image: "/placeholder.svg", rating: 4.9, sold: 567, discount: 0, inStock: true },
      { id: 302, name: "Áo croptop trắng", category: "Áo", price: 250000, image: "/placeholder.svg", rating: 4.7, sold: 830, discount: 15, inStock: true },
      { id: 303, name: "Váy maxi dự tiệc", category: "Váy", price: 680000, image: "/placeholder.svg", rating: 4.8, sold: 340, discount: 0, inStock: true },
      { id: 304, name: "Set áo váy công sở", category: "Set đồ", price: 790000, image: "/placeholder.svg", rating: 4.9, sold: 420, discount: 20, inStock: true },
      { id: 305, name: "Chân váy xếp ly", category: "Váy", price: 380000, image: "/placeholder.svg", rating: 4.6, sold: 610, discount: 0, inStock: true },
    ],
    "4": [ // Cầu Tre Việt
      { id: 401, name: "Giỏ tre đan tay", category: "Giỏ", price: 180000, image: "/placeholder.svg", rating: 4.8, sold: 320, discount: 0, inStock: true },
      { id: 402, name: "Khay tre decor", category: "Khay", price: 120000, image: "/placeholder.svg", rating: 4.7, sold: 450, discount: 10, inStock: true },
      { id: 403, name: "Lồng đèn tre", category: "Đèn", price: 350000, image: "/placeholder.svg", rating: 4.9, sold: 280, discount: 0, inStock: true },
      { id: 404, name: "Rổ tre mini", category: "Giỏ", price: 95000, image: "/placeholder.svg", rating: 4.6, sold: 670, discount: 15, inStock: true },
      { id: 405, name: "Bộ đũa tre cao cấp", category: "Đồ dùng", price: 150000, image: "/placeholder.svg", rating: 4.8, sold: 540, discount: 0, inStock: true },
    ],
  };

  const products = allProducts[brandId as keyof typeof allProducts] || [];

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];

  // Filter and sort products
  const filteredProducts = products
    .filter(p => selectedCategory === "all" || p.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === "popular") return b.sold - a.sold;
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const handleAddToCart = (product: any) => {
    const finalPrice = product.discount > 0 
      ? product.price * (1 - product.discount / 100) 
      : product.price;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: finalPrice.toLocaleString(),
      image: product.image,
      quantity: 1,
    });
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  if (!brand) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Không tìm thấy thương hiệu</h1>
          <Button onClick={() => navigate("/local-brand")} className="mt-4">
            Quay lại danh sách thương hiệu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/local-brand")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>

          {/* Brand Header */}
          <Card className="overflow-hidden bg-gradient-card border-border">
            <div className="relative h-48 md:h-64">
              <img
                src={brand.coverImage}
                alt={brand.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
              
              <div className="absolute bottom-6 left-6 flex items-end gap-4">
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="w-20 h-20 bg-card rounded-full border-4 border-card"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-card-foreground">{brand.name}</h1>
                    {brand.verified && (
                      <Badge className="bg-success text-success-foreground gap-1">
                        <Award className="w-3 h-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {brand.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {brand.followers.toLocaleString()} followers
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      {brand.rating}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">{brand.description}</p>
              
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Heart className="w-4 h-4" />
                  Theo dõi
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Filters and Sort */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === "all" ? "Tất cả" : cat}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm"
              >
                <option value="popular">Phổ biến nhất</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover-lift bg-gradient-card border-border h-full flex flex-col">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.discount > 0 && (
                      <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                        -{product.discount}%
                      </Badge>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <Badge variant="secondary">Hết hàng</Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <div className="flex-1">
                      <Badge variant="secondary" className="text-xs mb-2">
                        {product.category}
                      </Badge>
                      <h3 className="font-medium text-card-foreground text-sm line-clamp-2">
                        {product.name}
                      </h3>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          {product.discount > 0 ? (
                            <>
                              <span className="text-lg font-bold text-primary">
                                {(product.price * (1 - product.discount / 100)).toLocaleString()}đ
                              </span>
                              <span className="text-xs text-muted-foreground line-through block">
                                {product.price.toLocaleString()}đ
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-primary">
                              {product.price.toLocaleString()}đ
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          <span className="text-muted-foreground">{product.rating}</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Đã bán {product.sold}
                      </div>
                      
                      <Button
                        className="w-full gap-2"
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {product.inStock ? "Thêm vào giỏ" : "Hết hàng"}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Không tìm thấy sản phẩm nào</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default BrandProducts;
