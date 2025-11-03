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
  HeartHandshake
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
              <Card className="overflow-hidden border-0 shadow-lg">
                <div className="h-24 bg-gradient-primary" />
                <CardContent className="relative pt-0 pb-6">
                  <div className="flex flex-col items-center -mt-12">
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-4 border-card shadow-xl">
                        <AvatarImage src={avatarPreview || mockUser.avatar} alt={mockUser.name} />
                        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                          {mockUser.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full shadow-md"
                            variant="default"
                          >
                            <Camera className="w-4 h-4" />
                          </Button>
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
                              <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-lg">
                                <AvatarImage src={avatarPreview || mockUser.avatar} alt="Preview" />
                                <AvatarFallback className="text-4xl">{mockUser.name[0]}</AvatarFallback>
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
                              className="w-full sm:w-auto"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Lưu ảnh đại diện
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <h2 className="mt-4 text-xl font-bold text-center">{mockUser.name}</h2>
                    <p className="text-sm text-muted-foreground text-center mt-1">{mockUser.bio}</p>

                    <div className="flex gap-2 mt-4">
                      <Badge className="bg-gradient-primary text-white border-0 shadow-sm">
                        <Crown className="w-3 h-3 mr-1" />
                        {mockUser.level}
                      </Badge>
                      <Badge variant="secondary" className="shadow-sm">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {mockUser.points} điểm
                      </Badge>
                    </div>

                    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full mt-4" variant="outline">
                          <Edit3 className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </Button>
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
                          <Button onClick={() => setIsEditModalOpen(false)}>
                            <Save className="w-4 h-4 mr-2" />
                            Lưu thay đổi
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t">
                    <div className="text-center p-3 rounded-lg bg-primary/5">
                      <Package className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <div className="text-xl font-bold">{mockUser.stats.totalOrders}</div>
                      <div className="text-xs text-muted-foreground">Đơn hàng</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-accent/5">
                      <Star className="w-5 h-5 mx-auto mb-1 text-accent" />
                      <div className="text-xl font-bold">{mockUser.stats.reviews}</div>
                      <div className="text-xs text-muted-foreground">Đánh giá</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-success/5">
                      <Users className="w-5 h-5 mx-auto mb-1 text-success" />
                      <div className="text-xl font-bold">{mockUser.stats.followers}</div>
                      <div className="text-xs text-muted-foreground">Followers</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-warning/5">
                      <UserPlus className="w-5 h-5 mx-auto mb-1 text-warning" />
                      <div className="text-xl font-bold">{mockUser.stats.following}</div>
                      <div className="text-xs text-muted-foreground">Following</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Achievements */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-warning" />
                    Thành tích & Huy hiệu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg shadow-sm flex flex-col items-center text-center border hover-lift"
                        aria-labelledby={`achv-title-${index}`}
                        role="group"
                      >
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center mb-3 flex-shrink-0"
                          style={{ backgroundColor: `${achievement.color}10` }}
                          aria-hidden="true"
                        >
                          <achievement.icon className="sm:w-7 sm:h-7 w-6 h-6" style={{ color: achievement.color }} />
                        </div>

                        <h4 id={`achv-title-${index}`} className="sm:text-sm text-xs font-semibold mb-1 truncate">
                          {achievement.title}
                        </h4>

                        <p className="text-xs text-muted-foreground mb-3 truncate">
                          {achievement.description}
                        </p>

                        {achievement.earned ? (
                          <Badge className="px-2 py-1 text-xs bg-success/10 text-success">Hoàn thành</Badge>
                        ) : null}

                        {!achievement.earned && achievement.target && (
                          <div className="w-full mt-1">
                            <div className="flex justify-between text-xs mb-2">
                              <span>{achievement.progress}</span>
                              <span>{achievement.target}</span>
                            </div>
                            <Progress
                              value={(achievement.progress / achievement.target) * 100}
                              className="h-2 w-full"
                              aria-valuenow={(achievement.progress / achievement.target) * 100}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              role="progressbar"
                            />
                          </div>
                        )}
                      </div>
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
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Chi tiêu 6 tháng gần đây
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={spendingData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px"
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="hsl(var(--primary))"
                            strokeWidth={3}
                            dot={{ fill: "hsl(var(--primary))", r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Category Distribution - Donut Chart */}
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-accent" />
                        Danh mục yêu thích
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={110}
                            paddingAngle={2}
                            dataKey="value"
                            label={false}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CategoryTooltip />} wrapperStyle={{ pointerEvents: "none" }} />
                          <text
                            x="50%"
                            y="45%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-3xl font-bold fill-foreground"
                          >
                            {categoryData.reduce((sum, item) => sum + item.value, 0)}%
                          </text>
                          <text
                            x="50%"
                            y="55%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-sm fill-muted-foreground"
                          >
                            Danh mục
                          </text>
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => <span className="text-sm">{value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Community Activity */}
                  <Card className="border-0 shadow-md lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-success" />
                        Hoạt động cộng đồng
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={communityData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px"
                            }}
                          />
                          <Bar dataKey="posts" fill="hsl(var(--primary))" name="Bài viết" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="likes" fill="hsl(var(--accent))" name="Lượt thích" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="comments" fill="hsl(var(--success))" name="Bình luận" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* ACTIVITY TAB */}
              <TabsContent value="activity" className="space-y-4">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Hoạt động gần đây</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 rounded-xl border hover-lift"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <activity.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">{activity.content}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* WISHLIST TAB */}
              <TabsContent value="wishlist" className="space-y-4">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-accent" />
                      Danh sách yêu thích ({wishlistItems.length} sản phẩm)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlistItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 rounded-xl border hover-lift"
                        >
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                            <Gift className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
                            <p className="text-xs text-muted-foreground mb-1">{item.category}</p>
                            <p className="text-primary font-bold text-sm">
                              {item.price.toLocaleString('vi-VN')}đ
                            </p>
                          </div>
                          <Button size="sm" className="flex-shrink-0">
                            <ShoppingBag className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* INFO TAB */}
              <TabsContent value="info" className="space-y-6">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Thông tin cơ bản
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Họ và tên
                        </Label>
                        <Input id="name" defaultValue={mockUser.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </Label>
                        <Input id="email" type="email" defaultValue={mockUser.email} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Số điện thoại
                        </Label>
                        <Input id="phone" defaultValue={mockUser.phone} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="joinDate" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Ngày tham gia
                        </Label>
                        <Input id="joinDate" defaultValue={mockUser.joinDate} disabled />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Giới thiệu bản thân</Label>
                      <Textarea id="bio" defaultValue={mockUser.bio} rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Địa chỉ
                      </Label>
                      <Input id="address" defaultValue={mockUser.address} />
                    </div>
                    <Button className="w-full md:w-auto">
                      <Save className="w-4 h-4 mr-2" />
                      Lưu thay đổi
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
