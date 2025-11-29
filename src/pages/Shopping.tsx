import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Filter,
  Grid,
  List,
  Search,
  SlidersHorizontal,
  Shirt,
  Monitor,
  Home as HomeIcon,
  Sparkles,
  Heart,
  Eye,
  ShoppingCart,
  Star,
  ShoppingBag,
  TrendingUp,
  Zap,
  Crown,
  CheckCircle2,
  ArrowRight,
  X,
  Package
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { useCart } from "@/contexts/CartContext";
import ShoppingCartModal from "@/components/ShoppingCartModal";
import { useState, useRef, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Shopping = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState<number[]>([]);

  const categories = [
    {
      name: "Thời trang",
      count: 2450,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500/20",
      icon: <Shirt className="w-7 h-7" />
    },
    {
      name: "Điện tử",
      count: 1890,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/20",
      icon: <Monitor className="w-7 h-7" />
    },
    {
      name: "Gia dụng",
      count: 1250,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/20",
      icon: <HomeIcon className="w-7 h-7" />
    },
    {
      name: "Làm đẹp",
      count: 890,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/20",
      icon: <Sparkles className="w-7 h-7" />
    },
  ];

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

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/list.php`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleLike = (productId: number) => {
    setLikedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleFilter = (filter: string) => {
    setActiveFilters((prev) => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
  };

  const handleSort = (option: string) => {
    setSortOption(option);
    setShowSort(false);
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat === selectedCategory ? null : cat);
  };

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
    setTimeout(() => setShowAutocomplete(false), 100);
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

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity: 1,
      seller_id: product.seller_id,
    });
    setCartModalOpen(true);
    toast({
      title: "Đã thêm vào giỏ hàng!",
      description: product.name,
      duration: 2000,
    });
  };

  let filteredProducts = products.filter(p =>
    (!selectedCategory || p.category === selectedCategory) &&
    (searchTerm === "" || p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (sortOption === "Giá tăng dần") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortOption === "Giá giảm dần") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortOption === "Bán chạy") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.sold - a.sold);
  } else if (sortOption === "Mới nhất") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.id - a.id);
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getSellerAvatar = (avatar: string | null) => {
    if (!avatar) {
      return '/images/avatars/default-shop-avatar.png';
    }
    return avatar;
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Animated Background */}
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
      </div>

      {/* Enhanced Filter Modal */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowFilter(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-card/95 to-card/90 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md shadow-2xl relative border-2 border-border/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <SlidersHorizontal className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">Bộ lọc</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowFilter(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Lọc theo tiêu chí</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Giá rẻ', 'Bán chạy', 'Có giảm giá', 'Đánh giá cao'].map(f => (
                      <motion.div key={f} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={activeFilters.includes(f) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleFilter(f)}
                          className={activeFilters.includes(f) ? 'bg-gradient-to-r from-primary to-purple-600' : ''}
                        >
                          {activeFilters.includes(f) && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {f}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
                <Button variant="outline" onClick={() => setShowFilter(false)}>Đóng</Button>
                <Button
                  onClick={() => setShowFilter(false)}
                  className="bg-gradient-to-r from-primary to-purple-600"
                >
                  Áp dụng ({activeFilters.length})
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Sort Modal */}
      <AnimatePresence>
        {showSort && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSort(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-card/95 to-card/90 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md shadow-2xl relative border-2 border-border/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500" />

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Filter className="w-5 h-5 text-blue-500" />
                  </div>
                  <h2 className="text-xl font-bold">Sắp xếp</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowSort(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-2 mb-6">
                {['Mặc định', 'Giá tăng dần', 'Giá giảm dần', 'Bán chạy', 'Mới nhất'].map((option, index) => (
                  <motion.div
                    key={option}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 5 }}
                  >
                    <Button
                      variant={sortOption === option ? 'default' : 'ghost'}
                      className={`w-full justify-start ${sortOption === option ? 'bg-gradient-to-r from-primary to-purple-600' : ''}`}
                      onClick={() => handleSort(option)}
                    >
                      {sortOption === option && <CheckCircle2 className="w-4 h-4 mr-2" />}
                      {option}
                    </Button>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-border/50">
                <Button variant="outline" onClick={() => setShowSort(false)}>Đóng</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Enhanced Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="relative flex-shrink-0"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur-xl opacity-50"
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
                <div className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-2xl">
                  <ShoppingBag className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                </div>
              </motion.div>

              {/* Title & Subtitle */}
              <div className="text-left">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl lg:text-4xl font-extrabold mb-2"
                >
                  Mua sắm{" "}
                  <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Thông minh
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground text-base lg:text-lg"
                >
                  Khám phá hàng nghìn sản phẩm chất lượng với giá tốt nhất
                </motion.p>
              </div>
            </div>
          </div>

          {/* Enhanced Categories */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`relative overflow-hidden cursor-pointer bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm border-2 transition-all duration-300 ${selectedCategory === category.name
                      ? "border-primary shadow-2xl shadow-primary/20"
                      : "border-border/50 hover:border-primary/50 shadow-lg hover:shadow-xl"
                    }`}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  {/* Top Border */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.color}`} />

                  {/* Glow Effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 ${selectedCategory === category.name ? 'opacity-10' : 'group-hover:opacity-10'} transition-opacity duration-300`}
                  />

                  <CardContent className="p-6 text-center relative">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="relative mb-4"
                    >
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg text-white`}>
                        {category.icon}
                      </div>
                    </motion.div>

                    {/* Name */}
                    <h3 className={`font-bold text-lg mb-2 transition-colors ${selectedCategory === category.name ? 'text-primary' : ''}`}>
                      {category.name}
                    </h3>

                    {/* Count */}
                    <p className="text-sm text-muted-foreground">
                      {category.count} sản phẩm
                    </p>

                    {/* Selected Indicator */}
                    {selectedCategory === category.name && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Filters & Controls */}
          <Card className="border-2 border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-600" />

            <CardContent className="p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={handleSearch}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    onKeyDown={handleSearchKeyDown}
                    className="w-full pl-11 pr-4 py-3 bg-background/50 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-primary transition-all text-sm font-medium"
                    autoComplete="off"
                  />

                  {/* AI Autocomplete */}
                  {showAutocomplete && filteredSuggestions.length > 0 && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-0 right-0 mt-2 bg-card border-2 border-border/50 rounded-xl shadow-2xl z-20 max-h-56 overflow-auto backdrop-blur-xl"
                    >
                      {filteredSuggestions.map((s, i) => (
                        <motion.li
                          key={s}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`px-4 py-3 cursor-pointer transition-colors ${highlightedIndex === i
                              ? "bg-primary/20 text-primary"
                              : "hover:bg-primary/10"
                            }`}
                          onMouseDown={() => handleSuggestionClick(s)}
                          onMouseEnter={() => setHighlightedIndex(i)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                              <Search className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium">{s}</span>
                          </div>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </div>

                {/* Filter & Sort Buttons */}
                <div className="flex gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="gap-2 border-2"
                      onClick={() => setShowFilter(true)}
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      Bộ lọc
                      {activeFilters.length > 0 && (
                        <Badge className="ml-1 bg-primary text-white px-1.5 py-0.5 text-xs">
                          {activeFilters.length}
                        </Badge>
                      )}
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="gap-2 border-2"
                      onClick={() => setShowSort(true)}
                    >
                      <Filter className="w-4 h-4" />
                      {sortOption}
                    </Button>
                  </motion.div>
                </div>

                {/* View Toggle */}
                <div className="flex gap-2 p-1 bg-muted/50 rounded-lg border border-border/50">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-gradient-to-r from-primary to-purple-600' : ''}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-gradient-to-r from-primary to-purple-600' : ''}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Active Filters */}
              {(activeFilters.length > 0 || sortOption !== 'Mặc định') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50"
                >
                  {activeFilters.map(f => (
                    <Badge
                      key={f}
                      className="bg-primary/10 text-primary border border-primary/20 px-3 py-1"
                    >
                      {f}
                      <X
                        className="w-3 h-3 ml-2 cursor-pointer"
                        onClick={() => handleFilter(f)}
                      />
                    </Badge>
                  ))}
                  {sortOption !== 'Mặc định' && (
                    <Badge className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1">
                      {sortOption}
                    </Badge>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Products Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
              />
              <p className="mt-4 text-muted-foreground">Đang tải sản phẩm...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <p className="text-xl font-semibold text-foreground mb-2">Không tìm thấy sản phẩm</p>
              <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
            </motion.div>
          ) : viewMode === 'grid' ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <Card className="relative overflow-hidden border-2 border-border/50 hover:border-primary/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                    {/* Top Border */}
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
                    <div className="relative overflow-hidden bg-white">
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-contain"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />

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
                              className="w-2 h-2 bg-white rounded-full mr-2 inline-block"
                            />
                            LIVE
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
                              : "bg-background"
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
                            Xem
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
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

                    <CardContent className="p-5 relative">
                      {/* Seller Info */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="relative">
                          <img
                            src={getSellerAvatar(product.seller.avatar)}
                            alt={product.seller.name}
                            className="w-8 h-8 rounded-full object-cover border-2 border-primary/20"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/avatars/default-shop-avatar.png';
                            }}
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
                      <div className="flex items-center gap-3 mb-4">
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
                          Đã bán {product.sold}
                        </span>
                      </div>

                      {/* Price Section */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.originalPrice)}
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
                            onClick={() => handleAddToCart(product)}
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
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <Card className="flex flex-col md:flex-row overflow-hidden border-2 border-border/50 hover:border-primary/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300">
                    {/* Top Border */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />

                    {/* Image Section */}
                    <div className="relative md:w-1/3 bg-white">
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 md:h-full object-contain"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                      />

                      {/* Badges & Actions - same as grid view */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.discount > 0 && (
                          <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg animate-pulse">
                            <Zap className="w-3 h-3 mr-1" />
                            -{product.discount}%
                          </Badge>
                        )}
                      </div>

                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`absolute top-3 right-3 w-10 h-10 rounded-full backdrop-blur-md shadow-lg transition-all ${likedProducts.includes(product.id)
                              ? "bg-red-500/90 hover:bg-red-500 text-white"
                              : "bg-background"
                            }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(product.id);
                          }}
                        >
                          <Heart
                            className={`w-5 h-5 ${likedProducts.includes(product.id) ? "fill-white text-white" : ""
                              }`}
                          />
                        </Button>
                      </motion.div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex-1 flex flex-col justify-between relative">
                      {/* Seller Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <img
                            src={getSellerAvatar(product.seller.avatar)}
                            alt={product.seller.name}
                            className="w-8 h-8 rounded-full object-cover border-2 border-primary/20"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/avatars/default-shop-avatar.png';
                            }}
                          />
                          <span className="text-sm font-semibold text-primary">
                            {product.seller.name}
                          </span>
                        </div>

                        <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors mb-3">
                          {product.name}
                        </h3>

                        <div className="flex items-center gap-4 mb-4">
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
                          <span className="text-sm text-muted-foreground">
                            Đã bán {product.sold}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-lg text-muted-foreground line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                          <Button
                            variant="outline"
                            className="w-full border-2"
                            onClick={() => navigate(`/product/${product.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Xem chi tiết
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                          <Button
                            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Thêm vào giỏ
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </main>

      <ShoppingCartModal
        open={cartModalOpen}
        onOpenChange={setCartModalOpen}
      />
    </div>
  );
};

export default Shopping;