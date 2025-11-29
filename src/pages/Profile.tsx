import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Award,
  Heart,
  ShoppingBag,
  Edit3,
  Camera,
  TrendingUp,
  Trophy,
  Users,
  MessageSquare,
  Target,
  Star,
  Gift,
  Zap,
  Save,
  Package,
  UserPlus,
  Settings,
  LogOut,
  Crown,
  Sparkles,
  Wallet,
  Wallet2,
  DollarSign,
  HeartHandshake,
  CheckCircle,
  Clock,
  ChevronRight,
  SeparatorHorizontal
} from "lucide-react";

const Profile = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const mockUser = {
    name: "Nguyễn Kỳ Vỹ",
    email: "kyvydev@gmail.com",
    phone: "0901234567",
    avatar: "/images/avatars/Avt-Vy.jpg",
    bio: "Yêu thích mua sắm và chia sẻ những sản phẩm tuyệt vời với cộng đồng.",
    address: "Cổ Thành, Triệu Phong, Quảng Trị",
    joinDate: "Tháng 3, 2023",
    points: 1250,
    level: "Gold Member",
    stats: {
      totalOrders: 45,
      totalSpent: 12500000,
      reviews: 23,
      followers: 156,
      following: 89,
    }
  };

  const spendingData = [
    { month: "T1", amount: 1200000, orders: 3 },
    { month: "T2", amount: 800000, orders: 2 },
    { month: "T3", amount: 1500000, orders: 4 },
    { month: "T4", amount: 2200000, orders: 6 },
    { month: "T5", amount: 1800000, orders: 5 },
    { month: "T6", amount: 2500000, orders: 7 },
  ];

  const categoryData = [
    { name: "Làm đẹp", value: 35, amount: 8750000, color: "hsl(var(--primary))" },
    { name: "Thời trang", value: 25, amount: 6250000, color: "hsl(var(--accent))" },
    { name: "Điện tử", value: 20, amount: 5000000, color: "hsl(var(--success))" },
    { name: "Gia dụng", value: 12, amount: 3000000, color: "hsl(var(--warning))" },
    { name: "Khác", value: 8, amount: 2000000, color: "hsl(var(--muted-foreground))" }
  ];

  const CategoryTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0].payload;
    const value = payload[0].value;
    const bg = item.color || "hsl(var(--primary))";
    const amount = item.amount ?? 0;

    return (
      <div
        style={{
          background: bg,
          color: "background",
          padding: "8px 12px",
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          border: "1px solid rgba(255,255,255,0.08)",
          minWidth: 140,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 13 }}>{item.name}</div>
        <div style={{ fontSize: 12, opacity: 0.95, marginTop: 4 }}>
          {value}% · {(amount / 1000000).toFixed(1)}M đ
        </div>
      </div>
    );
  };

  const communityData = [
    { month: "T7", posts: 5, likes: 45, comments: 12 },
    { month: "T8", posts: 8, likes: 67, comments: 18 },
    { month: "T9", posts: 6, likes: 52, comments: 15 },
    { month: "T10", posts: 12, likes: 98, comments: 25 },
    { month: "T11", posts: 9, likes: 76, comments: 20 },
    { month: "T12", posts: 15, likes: 124, comments: 32 }
  ];

  const achievements = [
    {
      title: "Khách hàng trung thành",
      description: "Mua sắm 12 tháng liên tiếp",
      progress: 100,
      icon: Trophy,
      earned: true,
      color: "hsl(var(--warning))"
    },
    {
      title: "Người ảnh hưởng",
      description: "Có 100+ người theo dõi",
      progress: 156,
      target: 100,
      icon: Users,
      earned: true,
      color: "hsl(var(--primary))"
    },
    {
      title: "Chuyên gia đánh giá",
      description: "Viết 50 đánh giá sản phẩm",
      progress: 23,
      target: 50,
      icon: Star,
      earned: false,
      color: "hsl(var(--accent))"
    },
    {
      title: "Tín đồ mua sắm",
      description: "Chi tiêu 50 triệu trong năm",
      progress: 25,
      target: 50,
      icon: Target,
      earned: false,
      color: "hsl(var(--success))"
    }
  ];

  const wishlistItems = [
    { name: "iPhone 15 Pro", price: 28900000, image: "/placeholder.svg", category: "Điện tử" },
    { name: "Túi Chanel Classic", price: 89000000, image: "/placeholder.svg", category: "Thời trang" },
    { name: "Serum Vitamin C", price: 1200000, image: "/placeholder.svg", category: "Làm đẹp" },
    { name: "Máy pha cà phê", price: 15000000, image: "/placeholder.svg", category: "Gia dụng" }
  ];

  const recentActivity = [
    { type: "review", content: "Đánh giá 5 sao cho Kem dưỡng da Olay", time: "2 giờ trước", icon: Star },
    { type: "order", content: "Đặt hàng thành công #DH001234", time: "1 ngày trước", icon: ShoppingBag },
    { type: "follow", content: "Theo dõi cửa hàng Beauty World", time: "3 ngày trước", icon: Heart },
    { type: "post", content: "Chia sẻ bài viết về xu hướng thời trang", time: "5 ngày trước", icon: Edit3 },
  ];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSave = () => {
    if (avatarPreview) {
      toast.success("Avatar đã được cập nhật thành công!");
      setIsAvatarModalOpen(false);
      // TODO: Upload avatar to server
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDEBAR - Profile Info */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-6 space-y-4">
              {/* Profile Card */}
              <Card className="overflow-hidden border-none shadow-2xl">
                <div className="h-32 bg-gradient-to-r from-primary via-purple-500 to-pink-500 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 opacity-30"
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    style={{
                      backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                      backgroundSize: "20px 20px"
                    }}
                  />
                </div>
                <CardContent className="relative pt-0 pb-6">
                  <div className="flex flex-col items-center -mt-16">
                    <motion.div 
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Avatar className="w-32 h-32 border-4 border-background shadow-2xl ring-4 ring-primary/20">
                        <AvatarImage src={avatarPreview || mockUser.avatar} alt={mockUser.name} />
                        <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-purple-600 text-white">
                          {mockUser.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
                        <DialogTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              size="icon"
                              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full shadow-lg bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                            >
                              <Camera className="w-5 h-5" />
                            </Button>
                          </motion.div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Camera className="w-5 h-5 text-primary" />
                              Thay đổi ảnh đại diện
                            </DialogTitle>
                            <DialogDescription>
                              Chọn một ảnh mới để làm ảnh đại diện của bạn
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="flex flex-col items-center gap-4">
                              <Avatar className="w-40 h-40 border-4 border-primary/20 shadow-2xl">
                                <AvatarImage src={avatarPreview || mockUser.avatar} alt="Preview" />
                                <AvatarFallback className="text-5xl">{mockUser.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="w-full space-y-2">
                                <Label htmlFor="avatar-upload" className="text-sm font-medium">
                                  Chọn ảnh từ thiết bị của bạn
                                </Label>
                                <Input
                                  id="avatar-upload"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleAvatarChange}
                                  className="cursor-pointer file:mr-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                />
                                <p className="text-xs text-muted-foreground">
                                  Định dạng: JPG, PNG, GIF. Kích thước tối đa: 5MB
                                </p>
                              </div>
                            </div>
                          </div>
                          <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsAvatarModalOpen(false);
                                setAvatarPreview(null);
                              }}
                              className="w-full sm:w-auto"
                            >
                              Hủy
                            </Button>
                            <Button
                              onClick={handleAvatarSave}
                              disabled={!avatarPreview}
                              className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-600"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Lưu ảnh đại diện
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <motion.div
                        className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Crown className="w-4 h-4 text-white" />
                      </motion.div>
                    </motion.div>

                    <motion.h2 
                      className="mt-4 text-2xl font-bold text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {mockUser.name}
                    </motion.h2>
                    <p className="text-sm text-muted-foreground text-center mt-2 px-4">
                      {mockUser.bio}
                    </p>

                    <div className="flex gap-2 mt-4 flex-wrap justify-center">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none shadow-lg px-3 py-1.5">
                          <Crown className="w-3.5 h-3.5 mr-1" />
                          {mockUser.level}
                        </Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none shadow-lg px-3 py-1.5">
                          <Sparkles className="w-3.5 h-3.5 mr-1" />
                          {mockUser.points} điểm
                        </Badge>
                      </motion.div>
                    </div>

                    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                      <DialogTrigger asChild>
                        <motion.div 
                          className="w-full mt-4"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-lg" variant="default">
                            <Edit3 className="w-4 h-4 mr-2" />
                            Chỉnh sửa hồ sơ
                          </Button>
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Chỉnh sửa thông tin cá nhân</DialogTitle>
                          <DialogDescription>
                            Cập nhật thông tin cá nhân của bạn
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">Họ và tên</Label>
                            <Input id="edit-name" defaultValue={mockUser.name} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input id="edit-email" type="email" defaultValue={mockUser.email} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-phone">Số điện thoại</Label>
                            <Input id="edit-phone" defaultValue={mockUser.phone} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-bio">Giới thiệu</Label>
                            <Textarea id="edit-bio" defaultValue={mockUser.bio} rows={3} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-address">Địa chỉ</Label>
                            <Input id="edit-address" defaultValue={mockUser.address} />
                          </div>
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Hủy
                          </Button>
                          <Button onClick={() => setIsEditModalOpen(false)} className="bg-gradient-to-r from-primary to-purple-600">
                            <Save className="w-4 h-4 mr-2" />
                            Lưu thay đổi
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t">
                    {[
                      { icon: Package, value: mockUser.stats.totalOrders, label: "Đơn hàng", color: "from-blue-500 to-cyan-500" },
                      { icon: Star, value: mockUser.stats.reviews, label: "Đánh giá", color: "from-yellow-500 to-orange-500" },
                      { icon: Users, value: mockUser.stats.followers, label: "Followers", color: "from-green-500 to-emerald-500" },
                      { icon: UserPlus, value: mockUser.stats.following, label: "Following", color: "from-purple-500 to-pink-500" }
                    ].map((stat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="text-center p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 hover:shadow-lg transition-shadow"
                      >
                        <div className={`w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                          {stat.value}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Achievements */}
              <Card className="border-none shadow-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    Thành tích & Huy hiệu
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4, scale: 1.05 }}
                        className={`p-4 rounded-xl shadow-md flex flex-col items-center text-center border-2 transition-all ${
                          achievement.earned 
                            ? 'border-transparent bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20' 
                            : 'border-dashed border-muted-foreground/20 bg-muted/30'
                        }`}
                      >
                        <motion.div
                          className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                            achievement.earned ? 'shadow-lg' : ''
                          }`}
                          style={{ 
                            background: achievement.earned 
                              ? `linear-gradient(135deg, ${achievement.color}, ${achievement.color}dd)` 
                              : `${achievement.color}20` 
                          }}
                          animate={achievement.earned ? {
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                          <achievement.icon 
                            className={`w-8 h-8 ${achievement.earned ? '' : ''}`} 
                            style={{ color: achievement.earned ? '' : achievement.color }} 
                          />
                        </motion.div>

                        <h4 className="text-sm font-semibold mb-1 line-clamp-1">
                          {achievement.title}
                        </h4>

                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {achievement.description}
                        </p>

                        {achievement.earned ? (
                          <Badge className="px-2 py-1 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none shadow-md">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Hoàn thành
                          </Badge>
                        ) : null}

                        {!achievement.earned && achievement.target && (
                          <div className="w-full mt-2">
                            <div className="flex justify-between text-xs mb-2 font-medium">
                              <span className="text-primary">{achievement.progress}</span>
                              <span className="text-muted-foreground">{achievement.target}</span>
                            </div>
                            <Progress
                              value={(achievement.progress / achievement.target) * 100}
                              className="h-2 w-full"
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.aside>

          {/* RIGHT MAIN CONTENT */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="w-full grid grid-cols-4 h-auto p-1 bg-card shadow-md">
                <TabsTrigger
                  value="dashboard"
                  className="peer data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:pb-2"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="peer data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:pb-2"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Hoạt động
                </TabsTrigger>
                <TabsTrigger
                  value="wishlist"
                  className="peer data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:pb-2"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Wishlist
                </TabsTrigger>
                <TabsTrigger
                  value="info"
                  className="peer data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:pb-2"
                >
                  <User className="w-4 h-4 mr-2" />
                  Thông tin
                </TabsTrigger>
              </TabsList>

              {/* DASHBOARD TAB */}
              <TabsContent value="dashboard" className="space-y-6">
                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="border border-primary/20 bg-primary/10 rounded-lg shadow-sm hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-primary/80 mb-1">Chi tiêu tháng này</p>
                          <p className="text-3xl font-bold text-primary">2.5M</p>
                          <p className="text-xs text-primary mt-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +12% so với tháng trước
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-accent/20 bg-accent/10 rounded-lg shadow-sm hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-500 mb-1">Điểm thưởng</p>
                          <p className="text-3xl font-bold text-blue-500">{mockUser.points}</p>
                          <p className="text-xs text-blue-500 mt-1">Còn 250 điểm lên VIP</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                          <Gift className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-success/20 bg-success/10 rounded-lg shadow-sm hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-success/80 mb-1">Cộng đồng</p>
                          <p className="text-3xl font-bold text-success">156</p>
                          <p className="text-xs text-success/80 mt-1">Tương tác tuần này</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center">
                          <HeartHandshake className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-warning/20 bg-warning/10 rounded-lg shadow-sm hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-warning/80 mb-1">Thứ hạng</p>
                          <p className="text-3xl font-bold text-warning">#47</p>
                          <p className="text-xs text-warning/80 mt-1">Top 5% người dùng</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-warning flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Spending Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="border-0 shadow-md">
                      <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b">
                        <CardTitle className="flex items-center gap-2">
                          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          Chi tiêu 6 tháng gần đây
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <ResponsiveContainer width="100%" height={280}>
                          <LineChart data={spendingData}>
                            <defs>
                              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "12px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="amount"
                              stroke="hsl(var(--primary))"
                              strokeWidth={3}
                              dot={{ fill: "hsl(var(--primary))", r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                              activeDot={{ r: 8 }}
                              fill="url(#colorAmount)"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Category Distribution */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="border-0 shadow-md">
                      <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b">
                        <CardTitle className="flex items-center gap-2">
                          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                            <Target className="w-5 h-5 text-white" />
                          </div>
                          Danh mục yêu thích
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <ResponsiveContainer width="100%" height={280}>
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="45%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={5}
                              dataKey="value"
                              label={false}
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<CategoryTooltip />} />
                            <text
                              x="50%"
                              y="42%"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="text-3xl font-bold fill-foreground"
                            >
                              100%
                            </text>
                            <text
                              x="50%"
                              y="52%"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="text-sm fill-muted-foreground"
                            >
                              Tổng danh mục
                            </text>
                            <Legend
                              verticalAlign="bottom"
                              height={36}
                              iconType="circle"
                              formatter={(value) => <span className="text-xs">{value}</span>}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Community Activity */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2"
                  >
                    <Card className="border-0 shadow-md">
                      <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b">
                        <CardTitle className="flex items-center gap-2">
                          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-white" />
                          </div>
                          Hoạt động cộng đồng
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <ResponsiveContainer width="100%" height={280}>
                          <BarChart data={communityData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "12px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                              }}
                            />
                            <Legend />
                            <Bar dataKey="posts" fill="hsl(var(--primary))" name="Bài viết" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="likes" fill="hsl(var(--accent))" name="Lượt thích" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="comments" fill="hsl(var(--success))" name="Bình luận" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              {/* ACTIVITY TAB */}
              <TabsContent value="activity" className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-none shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-b">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Hoạt động gần đây
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ x: 4 }}
                            className="flex items-start gap-4 p-4 rounded-xl border-2 border-transparent hover:border-primary/20 bg-gradient-to-r from-muted/50 to-muted/30 hover:shadow-lg transition-all group"
                          >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                              <activity.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-1 group-hover:text-primary transition-colors">
                                {activity.content}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {activity.time}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* WISHLIST TAB */}
              <TabsContent value="wishlist" className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-none shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Heart className="w-5 h-5 text-pink-500" />
                          Danh sách yêu thích
                        </div>
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                          {wishlistItems.length} sản phẩm
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {wishlistItems.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="flex items-center gap-4 p-4 rounded-xl border-2 border-transparent hover:border-primary/20 bg-gradient-to-r from-muted/50 to-muted/30 hover:shadow-xl transition-all group"
                          >
                            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                              <Gift className="w-10 h-10 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                                {item.name}
                              </h4>
                              <Badge variant="outline" className="text-xs mb-2">
                                {item.category}
                              </Badge>
                              <p className="font-bold text-base bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                {item.price.toLocaleString('vi-VN')}₫
                              </p>
                            </div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button 
                                size="sm" 
                                className="flex-shrink-0 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-lg"
                              >
                                <ShoppingBag className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* INFO TAB */}
              <TabsContent value="info" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-none shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-b">
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Thông tin cơ bản
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div 
                          className="space-y-2"
                          whileFocus={{ scale: 1.02 }}
                        >
                          <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                            <User className="w-4 h-4 text-primary" />
                            Họ và tên
                          </Label>
                          <Input 
                            id="name" 
                            defaultValue={mockUser.name}
                            className="border-2 focus:border-primary transition-all"
                          />
                        </motion.div>
                        <motion.div 
                          className="space-y-2"
                          whileFocus={{ scale: 1.02 }}
                        >
                          <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                            <Mail className="w-4 h-4 text-primary" />
                            Email
                          </Label>
                          <Input 
                            id="email" 
                            type="email" 
                            defaultValue={mockUser.email}
                            className="border-2 focus:border-primary transition-all"
                          />
                        </motion.div>
                        <motion.div 
                          className="space-y-2"
                          whileFocus={{ scale: 1.02 }}
                        >
                          <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                            <Phone className="w-4 h-4 text-primary" />
                            Số điện thoại
                          </Label>
                          <Input 
                            id="phone" 
                            defaultValue={mockUser.phone}
                            className="border-2 focus:border-primary transition-all"
                          />
                        </motion.div>
                        <motion.div 
                          className="space-y-2"
                          whileFocus={{ scale: 1.02 }}
                        >
                          <Label htmlFor="joinDate" className="flex items-center gap-2 text-sm font-medium">
                            <Calendar className="w-4 h-4 text-primary" />
                            Ngày tham gia
                          </Label>
                          <Input 
                            id="joinDate" 
                            defaultValue={mockUser.joinDate} 
                            disabled
                            className="border-2 bg-muted"
                          />
                        </motion.div>
                      </div>
                      <SeparatorHorizontal />
                      <motion.div 
                        className="space-y-2"
                        whileFocus={{ scale: 1.02 }}
                      >
                        <Label htmlFor="bio" className="text-sm font-medium">Giới thiệu bản thân</Label>
                        <Textarea 
                          id="bio" 
                          defaultValue={mockUser.bio} 
                          rows={4}
                          className="border-2 focus:border-primary transition-all resize-none"
                        />
                      </motion.div>
                      <motion.div 
                        className="space-y-2"
                        whileFocus={{ scale: 1.02 }}
                      >
                        <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium">
                          <MapPin className="w-4 h-4 text-primary" />
                          Địa chỉ
                        </Label>
                        <Input 
                          id="address" 
                          defaultValue={mockUser.address}
                          className="border-2 focus:border-primary transition-all"
                        />
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button className="w-full md:w-auto bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-lg">
                          <Save className="w-4 h-4 mr-2" />
                          Lưu thay đổi
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
