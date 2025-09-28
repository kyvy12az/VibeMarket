import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List, Search, SlidersHorizontal, Shirt, Monitor, Home as HomeIcon, Sparkles, Heart, Eye, ShoppingCart, Star, ShoppingBag } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useCart } from "@/contexts/CartContext";
import ShoppingCartModal from "@/components/ShoppingCartModal";
import { useState, useRef } from "react";
import { toast } from "@/components/ui/use-toast";

const Shopping = () => {
  const { addToCart } = useCart();
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const categories = [
    { name: "Thời trang", count: 2450, color: "bg-primary", icon: <Shirt className="w-7 h-7 mx-auto" /> },
    { name: "Điện tử", count: 1890, color: "bg-accent", icon: <Monitor className="w-7 h-7 mx-auto" /> },
    { name: "Gia dụng", count: 1250, color: "bg-success", icon: <HomeIcon className="w-7 h-7 mx-auto" /> },
    { name: "Làm đẹp", count: 890, color: "bg-warning", icon: <Sparkles className="w-7 h-7 mx-auto" /> },
  ];

  const allProducts = [
    {
      id: 1,
      name: "Áo sơ mi cotton premium",
      price: "299.000đ",
      originalPrice: "399.000đ",
      image: "https://i.ibb.co/ycq9LhXR/o-s-mi-cotton-prenium.jpg",
      rating: 4.8,
      sold: 1250,
      discount: 25,
      isLive: true,
      seller: {
        name: "Canifa",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop"
      },
    },
    {
      id: 2,
      name: "Điện thoại Samsung Galaxy",
      price: "12.990.000đ",
      originalPrice: "14.990.000đ",
      image: "https://i.ibb.co/xKpQhF2S/samsung-galaxy.webp",
      rating: 4.9,
      sold: 450,
      discount: 13,
      isLive: false,
      seller: {
        name: "SamsungStore",
        avatar: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=60&h=60&fit=crop"
      },
    },
    {
      id: 3,
      name: "Máy xay sinh tố mini",
      price: "450.000đ",
      originalPrice: "550.000đ",
      image: "https://i.ibb.co/KxNnBKb1/shopping.webp",
      rating: 4.6,
      sold: 890,
      discount: 18,
      isLive: true,
      seller: {
        name: "GiaDungPro",
        avatar: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=60&h=60&fit=crop"
      },
    },
    {
      id: 4,
      name: "Son môi lâu trôi Maybelline",
      price: "179.000đ",
      originalPrice: "220.000đ",
      image: "https://i.ibb.co/S1hDx7B/shopping.webp",
      rating: 4.7,
      sold: 2340,
      discount: 19,
      isLive: true,
      seller: {
        name: "BeautyShop",
        avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=60&h=60&fit=crop"
      },
    },
  ];

  // State for filter/sort modal and grid/list view
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>('Mặc định');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mock AI suggestions
  const aiSuggestions = [
    "giày thể thao nam",
    "giày chạy bộ nữ",
    "giày sneaker",
    "giày lười",
    "giày da công sở",
    "giày sandal",
    "giày trẻ em"
  ];
  const filteredSuggestions = searchTerm.length > 0
    ? aiSuggestions.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  // Dummy filter/sort handlers
  const handleFilter = (filter: string) => {
    setActiveFilters((prev) => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
  };
  const handleSort = (option: string) => {
    setSortOption(option);
    setShowSort(false);
  };

  // Category filter
  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat === selectedCategory ? null : cat);
  };

  // Product search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowAutocomplete(true);
    setHighlightedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowAutocomplete(false);
    if (searchInputRef.current) searchInputRef.current.blur();
  };

  const handleSearchFocus = () => {
    if (searchTerm.length > 0) setShowAutocomplete(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowAutocomplete(false), 100); // allow click
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showAutocomplete || filteredSuggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      setHighlightedIndex(i => (i + 1) % filteredSuggestions.length);
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex(i => (i - 1 + filteredSuggestions.length) % filteredSuggestions.length);
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      setSearchTerm(filteredSuggestions[highlightedIndex]);
      setShowAutocomplete(false);
      if (searchInputRef.current) searchInputRef.current.blur();
    }
  };

  // Add to cart feedback + open modal
  const handleAddToCart = (product: typeof allProducts[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image
    });
    setCartModalOpen(true);
    toast({
      title: "Đã thêm vào giỏ hàng!",
      description: product.name,
      duration: 2000,
    });
  };

  // Filtered and sorted products
  let products = allProducts.filter(p =>
    (!selectedCategory || (selectedCategory && categories.find(c => c.name === selectedCategory)?.name === selectedCategory && selectedCategory === getCategoryName(p))) &&
    (searchTerm === "" || p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Helper to map product to category (simple demo logic)
  function getCategoryName(product: typeof allProducts[0]) {
    if (product.name.toLowerCase().includes("áo")) return "Thời trang";
    if (product.name.toLowerCase().includes("điện thoại")) return "Điện tử";
    if (product.name.toLowerCase().includes("máy xay")) return "Gia dụng";
    if (product.name.toLowerCase().includes("son")) return "Làm đẹp";
    return "Khác";
  }

  // Sort logic
  if (sortOption === "Giá tăng dần") {
    products = [...products].sort((a, b) => parseInt(a.price.replace(/\D/g, "")) - parseInt(b.price.replace(/\D/g, "")));
  } else if (sortOption === "Giá giảm dần") {
    products = [...products].sort((a, b) => parseInt(b.price.replace(/\D/g, "")) - parseInt(a.price.replace(/\D/g, "")));
  } else if (sortOption === "Bán chạy") {
    products = [...products].sort((a, b) => b.sold - a.sold);
  } else if (sortOption === "Mới nhất") {
    products = [...products].sort((a, b) => b.id - a.id);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Filter Modal */}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-xl p-6 w-full max-w-md shadow-xl relative">
            <h2 className="text-lg font-bold mb-4">Bộ lọc</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Giá rẻ', 'Bán chạy', 'Có giảm giá', 'Đánh giá cao'].map(f => (
                <Button key={f} variant={activeFilters.includes(f) ? 'default' : 'outline'} size="sm" onClick={() => handleFilter(f)}>{f}</Button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowFilter(false)}>Đóng</Button>
              <Button onClick={() => setShowFilter(false)}>Áp dụng</Button>
            </div>
          </div>
        </div>
      )}
      {/* Sort Modal */}
      {showSort && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-xl p-6 w-full max-w-md shadow-xl relative">
            <h2 className="text-lg font-bold mb-4">Sắp xếp</h2>
            <div className="flex flex-col gap-2 mb-4">
              {['Mặc định', 'Giá tăng dần', 'Giá giảm dần', 'Bán chạy', 'Mới nhất'].map(option => (
                <Button key={option} variant={sortOption === option ? 'default' : 'outline'} size="sm" onClick={() => handleSort(option)}>{option}</Button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSort(false)}>Đóng</Button>
            </div>
          </div>
        </div>
      )}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-left space-y-3 max-w-3xl">
            <div className="flex items-center gap-3">
              {/* Icon từ lucide-react, ví dụ ShoppingBag */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Mua sắm thông minh
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Khám phá hàng nghìn sản phẩm chất lượng với giá tốt nhất
            </p>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`p-6 text-center cursor-pointer bg-gradient-card border border-border rounded-2xl flex flex-col items-center hover:shadow-xl transition-all duration-300 ${selectedCategory === category.name ? "border-primary ring-2 ring-primary/40" : "hover:border-primary/50"}`}
                  onClick={() => handleCategoryClick(category.name)}
                  tabIndex={0}
                  aria-pressed={selectedCategory === category.name}
                >
                  {/* Icon trong vòng tròn */}
                  <div
                    className={`w-14 h-14 ${category.color} rounded-full flex items-center justify-center mb-3 shadow-md`}
                  >
                    <span className="text-white text-2xl">{category.icon}</span>
                  </div>
                  {/* Tên category */}
                  <h3 className={`font-semibold text-card-foreground mb-1 transition-colors duration-300 ${selectedCategory === category.name ? "text-primary" : "group-hover:text-primary"}`}>
                    {category.name}
                  </h3>
                  {/* Số lượng sản phẩm */}
                  <p className="text-sm text-muted-foreground">{category.count} sản phẩm</p>
                </Card>
              </motion.div>
            ))}
          </div>


          {/* Filters & Controls */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between w-full">
            <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-60 md:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={handleSearch}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth text-sm"
                  autoComplete="off"
                />
                {showAutocomplete && filteredSuggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-20 max-h-56 overflow-auto text-sm animate-fade-in">
                    {filteredSuggestions.map((s, i) => (
                      <li
                        key={s}
                        className={`px-4 py-2 cursor-pointer hover:bg-primary/10 ${highlightedIndex === i ? "bg-primary/10 text-primary" : ""}`}
                        onMouseDown={() => handleSuggestionClick(s)}
                        onMouseEnter={() => setHighlightedIndex(i)}
                      >
                        <span className="mr-2 text-primary font-medium">🤖</span>{s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-row gap-2 w-full sm:w-auto">
                <Button variant="outline" className="gap-2 flex-1 sm:flex-none" onClick={() => setShowFilter(true)}>
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden xs:inline">Bộ lọc</span>
                </Button>
                <Button variant="outline" className="gap-2 flex-1 sm:flex-none" onClick={() => setShowSort(true)}>
                  <Filter className="w-4 h-4" />
                  <span className="hidden xs:inline">Sắp xếp</span>
                </Button>
              </div>
            </div>
            <div className="flex flex-row gap-2 mt-2 md:mt-0 justify-end">
              <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('grid')} aria-label="Grid view">
                <Grid className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('list')} aria-label="List view">
                <List className="w-4 h-4" />
              </Button>
            </div>
            {(activeFilters.length > 0 || sortOption !== 'Mặc định') && (
              <div className="flex flex-wrap gap-1 mt-2 md:mt-0 w-full">
                {activeFilters.map(f => (
                  <Badge key={f} className="bg-primary/10 text-primary border border-primary/20">{f}</Badge>
                ))}
                {sortOption !== 'Mặc định' && (
                  <Badge className="bg-accent/10 text-accent border border-accent/20">{sortOption}</Badge>
                )}
              </div>
            )}
          </div>

          {/* Products Grid */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-card border-border hover-glow overflow-hidden group transition-transform duration-300 will-change-transform hover:scale-105">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-contain bg-white transition-transform duration-500 group-hover:scale-110"
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
                      {/* Quick Actions Overlay (only show on hover) */}
                      <div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto flex gap-2">
                          <Button size="icon" variant="secondary" className="w-10 h-10" tabIndex={-1}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            onClick={() => handleAddToCart(product)}
                            className="w-10 h-10 bg-gradient-primary" 
                            tabIndex={-1}
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <img src={product.seller.avatar} alt={product.seller.name} className="w-7 h-7 rounded-full object-cover border border-muted" />
                        <span className="text-sm font-semibold text-primary">{product.seller.name}</span>
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground mt-2 mb-2 md:mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-warning text-warning" />
                          <span className="text-sm font-medium">{product.rating}</span>
                        </div>
                        <span>Đã bán {product.sold}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-primary">
                            {product.price}đ
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {product.originalPrice}đ
                            </span>
                          )}
                        </div>

                        <Button
                          size="sm"
                          className="bg-gradient-primary hover:opacity-90 transition-smooth"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Thêm vào giỏ
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4 md:gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="flex flex-col md:flex-row overflow-hidden hover-lift bg-gradient-card border-border group">
                    <div className="relative md:w-1/3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 xs:h-48 md:h-full object-contain bg-white"
                      />
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
                      {/* Quick Actions Overlay (only show on hover) */}
                      <div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto flex gap-2">
                          <Button size="icon" variant="secondary" className="w-10 h-10" tabIndex={-1}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            onClick={() => handleAddToCart(product)}
                            className="w-10 h-10 bg-gradient-primary" 
                            tabIndex={-1}
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 md:p-4 flex-1 flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-2">
                        <img src={product.seller.avatar} alt={product.seller.name} className="w-7 h-7 rounded-full object-cover border border-muted" />
                        <span className="text-sm font-semibold text-primary">{product.seller.name}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-card-foreground text-base md:text-lg mb-1 md:mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-1 md:mb-2">
                          <span className="text-base md:text-lg font-bold text-primary">{product.price}</span>
                          <span className="text-xs md:text-sm text-muted-foreground line-through">
                            {product.originalPrice}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">
                          <span>⭐ {product.rating}</span>
                          <span>Đã bán {product.sold}</span>
                        </div>
                      </div>
                      <Button
                        className="w-full md:w-auto mt-2 md:mt-0 text-xs md:text-base py-2 md:py-3"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Thêm vào giỏ
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          {/* ShoppingCart Modal */}
          {/* <ShoppingCartModal
            open={cartModalOpen}
            onOpenChange={setCartModalOpen}
          /> */}
        </motion.div>
      </main>
    </div>
  );
};

export default Shopping;