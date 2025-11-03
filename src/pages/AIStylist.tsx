import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Sparkles,
  ShoppingCart,
  Heart,
  Share2,
  MessageCircle,
  ThumbsUp,
  Image as ImageIcon,
  Home,
  Laptop,
  Shirt,
  Palette,
  TrendingUp,
  Users,
  Save,
  Eye,
  Plus,
  Zap,
  Target,
  BookmarkPlus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AIStylist = () => {
  const { toast } = useToast();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("outfit");
  const API_URL = (import.meta as any).env?.VITE_AI_ANALYZE_URL ||
    "http://localhost/VIBE_MARKET_BACKEND/VibeMarket-BE/api/ai/analyze.php";

  type AnalysisResult = {
    id: number;
    imageUrl: string;
    category: string;
    detectedStyle: string;
    colorPalette: string[];
    mood: string;
    confidence: number;
    suggestions: string[];
  };

  type ProductSuggestion = {
    id: number;
    name: string;
    price: number;
    image: string;
    matchScore: number;
    reason: string;
    category: string;
    rating: number;
    shop: string;
  };

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<ProductSuggestion[]>([]);

  // Note: analysisResult & aiSuggestions will be populated from API

  // Suggestions are generated from API response

  // Mock community posts
  const communityPosts = [
    {
      id: 1,
      user: { name: "Minh Anh", avatar: "/placeholder.svg", verified: true },
      image: "/placeholder.svg",
      category: "outfit",
      detectedStyle: "Vintage Chic",
      products: [
        { name: "Váy midi hoa", price: 450000, id: 1 },
        { name: "Túi xách da", price: 890000, id: 2 },
        { name: "Giày cao gót", price: 650000, id: 3 },
      ],
      votes: 234,
      comments: 45,
      views: 1234,
      time: "2 giờ trước",
      tags: ["#VintageStyle", "#OutfitOfTheDay"],
      description: "Set đồ vintage cho ngày đi chơi cuối tuần 🌸",
    },
    {
      id: 2,
      user: { name: "Thu Hương", avatar: "/placeholder.svg", verified: true },
      image: "/placeholder.svg",
      category: "home",
      detectedStyle: "Scandinavian",
      products: [
        { name: "Ghế sofa xám", price: 8900000, id: 4 },
        { name: "Bàn gỗ thông", price: 2500000, id: 5 },
        { name: "Đèn cây", price: 890000, id: 6 },
      ],
      votes: 567,
      comments: 89,
      views: 3421,
      time: "5 giờ trước",
      tags: ["#HomeDecor", "#Scandinavian"],
      description: "Góc phòng khách tối giản mà vẫn ấm cúng ✨",
    },
    {
      id: 3,
      user: { name: "Đức Anh", avatar: "/placeholder.svg", verified: false },
      image: "/placeholder.svg",
      category: "workspace",
      detectedStyle: "Modern Tech",
      products: [
        { name: "Bàn làm việc điện tử", price: 5600000, id: 7 },
        { name: "Ghế gaming", price: 3200000, id: 8 },
        { name: "Đèn LED", price: 450000, id: 9 },
      ],
      votes: 345,
      comments: 67,
      views: 2156,
      time: "1 ngày trước",
      tags: ["#WorkspaceSetup", "#TechLife"],
      description: "Setup góc làm việc tại nhà cho dev 💻",
    },
  ];

  // Style statistics
  const styleStats = {
    favoriteStyles: [
      { name: "Modern", percentage: 35 },
      { name: "Minimalist", percentage: 28 },
      { name: "Vintage", percentage: 20 },
      { name: "Sporty", percentage: 17 },
    ],
    colorPreferences: [
      { color: "#2C3E50", name: "Navy", count: 45 },
      { color: "#ECF0F1", name: "White", count: 38 },
      { color: "#95A5A6", name: "Gray", count: 32 },
      { color: "#E74C3C", name: "Red", count: 25 },
    ],
    topCategories: [
      { name: "Thời trang", engagement: 89 },
      { name: "Trang trí nhà", engagement: 76 },
      { name: "Workspace", engagement: 65 },
    ],
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        toast({
          title: "Ảnh đã được tải lên",
          description: "Click 'Phân tích AI' để bắt đầu!",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) return;
    try {
      setAnalyzing(true);
      setShowResults(false);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_base64: uploadedImage }),
      });
      const data = await res.json();
      if (!data?.success) {
        throw new Error(data?.error || "Phân tích thất bại");
      }

      const a = data.analysis;
      const detectedStyle: string = a?.detectedStyle || "Modern Minimalist";
      const colors: string[] = a?.colorPalette || ["#2C3E50", "#ECF0F1", "#95A5A6", "#E74C3C"];
      const mood: string = a?.mood || "Professional & Clean";
      const confidence: number = a?.confidence ?? 90;
      const sugg: string[] = Array.isArray(a?.suggestions) ? a.suggestions : ["blazer", "trousers", "loafers", "watch"];

      setAnalysisResult({
        id: 1,
        imageUrl: uploadedImage,
        category: selectedCategory,
        detectedStyle,
        colorPalette: colors,
        mood,
        confidence,
        suggestions: sugg,
      });

      const mappedFromApi: ProductSuggestion[] | null = Array.isArray(a?.products)
        ? a.products.map((p: any, idx: number) => ({
            id: Number(p.id ?? idx + 1),
            name: String(p.name ?? sugg[idx] ?? `Sản phẩm ${idx + 1}`),
            price: Number(p.price ?? 0),
            image: String(p.image ?? "/placeholder.svg"),
            matchScore: Number(p.matchScore ?? Math.max(75, 95 - idx * 3)),
            reason: String(p.reason ?? `Gợi ý theo phong cách ${detectedStyle}`),
            category: String(p.category ?? selectedCategory),
            rating: Number(p.rating ?? 4.7),
            shop: String(p.shop ?? "AI Stylist"),
          }))
        : null;

      if (mappedFromApi && mappedFromApi.length > 0) {
        setAiSuggestions(mappedFromApi);
      } else {
        const fallback: ProductSuggestion[] = sugg.map((name: string, idx: number) => ({
          id: idx + 1,
          name,
          price: 0,
          image: "/placeholder.svg",
          matchScore: Math.max(75, 95 - idx * 3),
          reason: `Gợi ý theo phong cách ${detectedStyle}`,
          category: selectedCategory,
          rating: 4.7,
          shop: "AI Stylist",
        }));
        setAiSuggestions(fallback);
      }

      setShowResults(true);
      toast({
        title: "✨ Phân tích hoàn tất!",
        description: `AI đã phát hiện phong cách: ${detectedStyle}`,
      });
    } catch (err: any) {
      toast({
        title: "Không thể phân tích",
        description: err?.message || "Vui lòng thử lại sau",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const categories = [
    { id: "outfit", name: "Trang phục", icon: Shirt },
    { id: "home", name: "Phòng khách", icon: Home },
    { id: "workspace", name: "Bàn làm việc", icon: Laptop },
    { id: "bedroom", name: "Phòng ngủ", icon: Home },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <div className="text-center lg:text-left space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="md:text-4xl text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                AI Stylist & Lifestyle Coach
              </h1>
            </motion.div>
            <p className="text-muted-foreground md:text-lg text-base">
              Upload ảnh để AI phân tích phong cách và gợi ý sản phẩm phù hợp từ cộng đồng
            </p>
          </div>

          {/* Upload & Analysis Section */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-6 h-6 text-primary" />
                Tải lên & Phân tích
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    className={`h-20 ${selectedCategory === cat.id ? "bg-gradient-primary" : ""
                      }`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <cat.icon className="w-6 h-6" />
                      <span className="text-sm">{cat.name}</span>
                    </div>
                  </Button>
                ))}
              </div>

              {/* Upload Zone */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-smooth cursor-pointer group">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <p className="text-sm text-muted-foreground">
                        Click để tải ảnh khác
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground group-hover:text-primary transition-smooth" />
                      <div>
                        <p className="text-lg font-medium">
                          Kéo thả ảnh hoặc click để tải lên
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Hỗ trợ JPG, PNG, WEBP (Tối đa 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* Analyze Button */}
              {uploadedImage && (
                <Button
                  size="lg"
                  className="w-full bg-gradient-primary hover:opacity-90"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Đang phân tích...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Phân tích AI
                    </>
                  )}
                </Button>
              )}

              {/* AI Analysis Results */}
              {showResults && analysisResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 p-6 bg-card rounded-lg border border-primary/20"
                >
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Kết quả phân tích
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Phong cách phát hiện
                      </p>
                          <Badge className="text-lg px-4 py-2">
                        {analysisResult?.detectedStyle}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Độ tự tin
                      </p>
                      <div className="space-y-2">
                        <Progress value={analysisResult?.confidence || 0} className="h-2" />
                        <p className="text-sm font-medium">
                          {analysisResult?.confidence}% phù hợp
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Bảng màu chính
                    </p>
                    <div className="flex gap-2">
                      {(analysisResult?.colorPalette || []).map((color, index) => (
                        <div
                          key={index}
                          className="w-12 h-12 rounded-lg border-2 border-border"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Mood/Vibe</p>
                    <p className="text-lg font-medium">{analysisResult?.mood}</p>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* AI Product Recommendations */}
          {showResults && aiSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="md:text-3xl text-2xl font-bold flex items-center gap-2">
                  <Target className="md:w-8 md:h-8 w-6 h-6 text-accent" />
                  Gợi ý sản phẩm AI
                </h2>
                <Badge className="bg-primary/10 text-primary text-sm px-3 py-1">
                  {aiSuggestions.length} sản phẩm
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {aiSuggestions.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group hover-lift hover-glow">
                      <CardContent className="p-0">
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <Badge className="absolute top-2 right-2 bg-primary">
                            {product.matchScore}% phù hợp
                          </Badge>
                        </div>

                        <div className="p-4 space-y-3">
                          <div>
                            <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                              {product.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {product.shop}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-primary">
                              {product.price.toLocaleString("vi-VN")}đ
                            </span>
                            <Badge variant="outline" className="text-xs">
                              ⭐ {product.rating}
                            </Badge>
                          </div>

                          <div className="p-2 bg-accent/10 rounded-lg">
                            <p className="text-xs text-accent font-medium flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              {product.reason}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              Thêm
                            </Button>
                            <Button size="sm" variant="outline">
                              <Heart className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Community Inspiration Feed */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="md:text-3xl text-2xl font-bold flex items-center gap-2">
                <Users className="md:w-8 md:h-8 w-6 h-6 text-primary" />
                Cảm hứng từ cộng đồng
              </h2>
            </div>

            <Tabs defaultValue="outfit" className="w-full">
              <TabsList className="grid w-full md:grid-cols-4 grid-cols-2 mb-6">
                <TabsTrigger value="outfit" className="gap-2">
                  <Shirt className="w-4 h-4" />
                  Outfit
                </TabsTrigger>
                <TabsTrigger value="home" className="gap-2">
                  <Home className="w-4 h-4" />
                  Home Decor
                </TabsTrigger>
                <TabsTrigger value="workspace" className="gap-2">
                  <Laptop className="w-4 h-4" />
                  Workspace
                </TabsTrigger>
                <TabsTrigger value="trending" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trending
                </TabsTrigger>
              </TabsList>

              <TabsContent value="outfit" className="space-y-6">
                {communityPosts
                  .filter((p) => p.category === "outfit")
                  .map((post) => (
                    <Card key={post.id} className="bg-gradient-card hover-lift">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={post.user.avatar} />
                            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{post.user.name}</h4>
                              {post.user.verified && (
                                <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                                  <span className="text-xs">✓</span>
                                </div>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {post.detectedStyle}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {post.time}
                            </p>
                          </div>
                        </div>

                        <p className="mb-4">{post.description}</p>

                        <img
                          src={post.image}
                          alt="Community post"
                          className="w-full h-64 object-cover rounded-lg mb-4"
                        />

                        {/* Product Tags */}
                        <div className="mb-4 space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            Sản phẩm trong ảnh:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {post.products.map((product) => (
                              <Badge
                                key={product.id}
                                variant="secondary"
                                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth"
                              >
                                {product.name} -{" "}
                                {product.price.toLocaleString("vi-VN")}đ
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <Separator className="my-4" />

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center justify-between sm:justify-start w-full">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 hover:text-red-500"
                              >
                                <ThumbsUp className="w-4 h-4" />
                                {post.votes}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 hover:text-white"
                              >
                                <MessageCircle className="w-4 h-4" />
                                {post.comments}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 hover:text-primary"
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-3 md:ml-4">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {post.views}
                              </span>
                              <Button variant="ghost" size="sm">
                                <BookmarkPlus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-gradient-accent w-full sm:w-auto sm:self-end"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Tạo lại look này
                          </Button>
                        </div>

                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="home" className="space-y-6">
                {communityPosts
                  .filter((p) => p.category === "home")
                  .map((post) => (
                    <Card key={post.id} className="bg-gradient-card hover-lift">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={post.user.avatar} />
                            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{post.user.name}</h4>
                              {post.user.verified && (
                                <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                                  <span className="text-xs">✓</span>
                                </div>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {post.detectedStyle}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {post.time}
                            </p>
                          </div>
                        </div>

                        <p className="mb-4">{post.description}</p>

                        <img
                          src={post.image}
                          alt="Community post"
                          className="w-full h-64 object-cover rounded-lg mb-4"
                        />

                        <div className="mb-4 space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            Sản phẩm trong ảnh:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {post.products.map((product) => (
                              <Badge
                                key={product.id}
                                variant="secondary"
                                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth"
                              >
                                {product.name} -{" "}
                                {product.price.toLocaleString("vi-VN")}đ
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <Separator className="my-4" />

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center justify-between sm:justify-start w-full">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 hover:text-red-500"
                              >
                                <ThumbsUp className="w-4 h-4" />
                                {post.votes}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 hover:text-white"
                              >
                                <MessageCircle className="w-4 h-4" />
                                {post.comments}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 hover:text-primary"
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-3 md:ml-4">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {post.views}
                              </span>
                              <Button variant="ghost" size="sm">
                                <BookmarkPlus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-gradient-accent w-full sm:w-auto sm:self-end"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Tạo lại look này
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="workspace" className="space-y-6">
                {communityPosts
                  .filter((p) => p.category === "workspace")
                  .map((post) => (
                    <Card key={post.id} className="bg-gradient-card hover-lift">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={post.user.avatar} />
                            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{post.user.name}</h4>
                              {post.user.verified && (
                                <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                                  <span className="text-xs">✓</span>
                                </div>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {post.detectedStyle}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {post.time}
                            </p>
                          </div>
                        </div>

                        <p className="mb-4">{post.description}</p>

                        <img
                          src={post.image}
                          alt="Community post"
                          className="w-full h-64 object-cover rounded-lg mb-4"
                        />

                        <div className="mb-4 space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            Sản phẩm trong ảnh:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {post.products.map((product) => (
                              <Badge
                                key={product.id}
                                variant="secondary"
                                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth"
                              >
                                {product.name} -{" "}
                                {product.price.toLocaleString("vi-VN")}đ
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <Separator className="my-4" />

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center justify-between sm:justify-start w-full">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 hover:text-red-500"
                              >
                                <ThumbsUp className="w-4 h-4" />
                                {post.votes}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 hover:text-white"
                              >
                                <MessageCircle className="w-4 h-4" />
                                {post.comments}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 hover:text-primary"
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-3 md:ml-4">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {post.views}
                              </span>
                              <Button variant="ghost" size="sm">
                                <BookmarkPlus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-gradient-accent w-full sm:w-auto sm:self-end"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Tạo lại look này
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="trending">
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Trending posts from all categories coming soon!
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Style Statistics */}
          <div className="space-y-6">
            <h2 className="md:text-3xl text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="md:w-8 md:h-8 w-6 h-6 text-accent" />
              Thống kê phong cách
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Favorite Styles */}
              <Card className="bg-gradient-card">
                <CardHeader>
                  <CardTitle className="text-lg">Phong cách yêu thích</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {styleStats.favoriteStyles.map((style) => (
                    <div key={style.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{style.name}</span>
                        <span className="text-muted-foreground">
                          {style.percentage}%
                        </span>
                      </div>
                      <Progress value={style.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Color Preferences */}
              <Card className="bg-gradient-card">
                <CardHeader>
                  <CardTitle className="text-lg">Màu sắc ưa thích</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {styleStats.colorPreferences.map((color) => (
                    <div
                      key={color.color}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/10 transition-smooth"
                    >
                      <div
                        className="w-10 h-10 rounded-lg border-2 border-border"
                        style={{ backgroundColor: color.color }}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{color.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {color.count} lần sử dụng
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Top Categories */}
              <Card className="bg-gradient-card">
                <CardHeader>
                  <CardTitle className="text-lg">Danh mục quan tâm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {styleStats.topCategories.map((cat) => (
                    <div key={cat.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{cat.name}</span>
                        <span className="text-muted-foreground">
                          {cat.engagement}%
                        </span>
                      </div>
                      <Progress value={cat.engagement} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AIStylist;