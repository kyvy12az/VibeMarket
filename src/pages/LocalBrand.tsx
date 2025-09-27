import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Users, Award, Star, ExternalLink } from "lucide-react";
import Navigation from "@/components/Navigation";

const LocalBrand = () => {
  const featuredBrands = [
    {
      id: 1,
      name: "Canifa",
      category: "Thời trang",
      description: "Thương hiệu thời trang Việt Nam với 20 năm kinh nghiệm, mang đến những sản phẩm chất lượng cao với giá cả phải chăng.",
      image: "/placeholder.svg",
      logo: "/placeholder.svg",
      location: "Hà Nội",
      followers: 125000,
      products: 1500,
      rating: 4.8,
      established: "2001",
      verified: true,
    },
    {
      id: 2,
      name: "Biti's",
      category: "Giày dép",
      description: "Thương hiệu giày Việt Nam hàng đầu, tiên phong trong việc ứng dụng công nghệ vào sản xuất giày thể thao.",
      image: "/placeholder.svg",
      logo: "/placeholder.svg",
      location: "TP.HCM",
      followers: 98000,
      products: 850,
      rating: 4.7,
      established: "1982",
      verified: true,
    },
    {
      id: 3,
      name: "Saigon Skirt",
      category: "Thời trang nữ",
      description: "Thương hiệu váy áo nữ hiện đại, kết hợp giữa phong cách truyền thống và xu hướng thế giới.",
      image: "/placeholder.svg",
      logo: "/placeholder.svg",
      location: "TP.HCM",
      followers: 45000,
      products: 320,
      rating: 4.9,
      established: "2015",
      verified: false,
    },
    {
      id: 4,
      name: "Cầu Tre Việt",
      category: "Thủ công mỹ nghệ",
      description: "Chuyên sản xuất các sản phẩm thủ công từ tre nứa, thân thiện với môi trường và mang đậm bản sắc Việt.",
      image: "/placeholder.svg",
      logo: "/placeholder.svg",
      location: "Hưng Yên",
      followers: 23000,
      products: 180,
      rating: 4.6,
      established: "2018",
      verified: false,
    },
  ];

  const categories = [
    { name: "Thời trang", count: 156, color: "bg-primary" },
    { name: "Mỹ phẩm", count: 89, color: "bg-accent" },
    { name: "Ẩm thực", count: 234, color: "bg-success" },
    { name: "Thủ công", count: 67, color: "bg-warning" },
    { name: "Công nghệ", count: 45, color: "bg-destructive" },
    { name: "Nông sản", count: 123, color: "bg-secondary" },
  ];

  const topProducts = [
    {
      id: 1,
      name: "Áo sơ mi Canifa Premium",
      brand: "Canifa",
      price: "299.000đ",
      image: "/placeholder.svg",
      rating: 4.8,
      sold: 1250,
    },
    {
      id: 2,
      name: "Giày thể thao Biti's Hunter",
      brand: "Biti's",
      price: "850.000đ",
      image: "/placeholder.svg",
      rating: 4.9,
      sold: 890,
    },
    {
      id: 3,
      name: "Váy midi Saigon Skirt",
      brand: "Saigon Skirt",
      price: "450.000đ",
      image: "/placeholder.svg",
      rating: 4.7,
      sold: 567,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              🇻🇳 Local Brand Việt Nam
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tự hào với những thương hiệu Việt chất lượng cao, mang đậm bản sắc dân tộc
            </p>
          </div>

          {/* Categories */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Danh mục thương hiệu</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 text-center hover-lift cursor-pointer bg-gradient-card border-border">
                    <div className={`w-12 h-12 ${category.color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-card-foreground text-sm">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">{category.count} thương hiệu</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Featured Brands */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-warning" />
              Thương hiệu nổi bật
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredBrands.map((brand, index) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className="overflow-hidden hover-lift bg-gradient-card border-border">
                    <div className="relative h-48">
                      <img
                        src={brand.image}
                        alt={brand.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <img
                          src={brand.logo}
                          alt={`${brand.name} logo`}
                          className="w-12 h-12 bg-card rounded-full border-2 border-card"
                        />
                      </div>
                      {brand.verified && (
                        <Badge className="absolute top-4 right-4 bg-success text-success-foreground gap-1">
                          <Award className="w-3 h-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="text-xl font-bold text-card-foreground">{brand.name}</h3>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                        <Badge variant="secondary">{brand.category}</Badge>
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {brand.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-card-foreground">{brand.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-card-foreground">{brand.followers.toLocaleString()} followers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          <span className="text-card-foreground">{brand.rating}/5</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-muted-foreground" />
                          <span className="text-card-foreground">Từ {brand.established}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1">
                          Xem {brand.products} sản phẩm
                        </Button>
                        <Button variant="outline" size="icon">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Top Products */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Sản phẩm nổi bật từ Local Brand</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {topProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover-lift bg-gradient-card border-border">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 space-y-3">
                      <div>
                        <Badge variant="secondary" className="text-xs mb-2">
                          {product.brand}
                        </Badge>
                        <h3 className="font-medium text-card-foreground">{product.name}</h3>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">{product.price}</span>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          <span className="text-muted-foreground">{product.rating}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        Đã bán {product.sold}
                      </div>
                      
                      <Button className="w-full">Xem chi tiết</Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default LocalBrand;