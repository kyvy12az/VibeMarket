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
  LineChart,
  Line,
  AreaChart,
  Area,
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
  ThumbsUp,
  Target,
  Star,
  Gift,
  Zap,
  Save,
  Package,
  UserPlus
} from "lucide-react";

const UserProfile = () => {
  const mockUser = {
    name: "Nguyễn Minh Anh",
    email: "minhanh@example.com",
    phone: "0901234567",
    avatar: "/placeholder.svg",
    bio: "Yêu thích mua sắm và chia sẻ những sản phẩm tuyệt vời với cộng đồng. Đam mê làm đẹp và thời trang.",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
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

  // Analytics Data
  const spendingData = [
    { month: "T1", amount: 1200000, orders: 3 },
    { month: "T2", amount: 800000, orders: 2 },
    { month: "T3", amount: 1500000, orders: 4 },
    { month: "T4", amount: 2200000, orders: 6 },
    { month: "T5", amount: 1800000, orders: 5 },
    { month: "T6", amount: 2500000, orders: 7 },
    { month: "T7", amount: 1900000, orders: 5 },
    { month: "T8", amount: 2800000, orders: 8 },
    { month: "T9", amount: 2100000, orders: 6 },
    { month: "T10", amount: 3200000, orders: 9 },
    { month: "T11", amount: 2700000, orders: 7 },
    { month: "T12", amount: 3500000, orders: 10 }
  ];

  const categoryData = [
    { name: "Làm đẹp", value: 35, amount: 8750000, color: "hsl(var(--primary))" },
    { name: "Thời trang", value: 25, amount: 6250000, color: "hsl(var(--accent))" },
    { name: "Điện tử", value: 20, amount: 5000000, color: "hsl(var(--success))" },
    { name: "Gia dụng", value: 12, amount: 3000000, color: "hsl(var(--warning))" },
    { name: "Khác", value: 8, amount: 2000000, color: "hsl(var(--muted-foreground))" }
  ];

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

  const socialConnections = [
    { name: "Beauty Guru", avatar: "/placeholder.svg", mutual: 12, type: "influencer" },
    { name: "Fashion Lover", avatar: "/placeholder.svg", mutual: 8, type: "user" },
    { name: "Tech Reviewer", avatar: "/placeholder.svg", mutual: 15, type: "expert" },
    { name: "Lifestyle Blog", avatar: "/placeholder.svg", mutual: 6, type: "blogger" }
  ];

  const recentActivity = [
    { type: "review", content: "Đánh giá 5 sao cho Kem dưỡng da Olay", time: "2 giờ trước" },
    { type: "order", content: "Đặt hàng thành công #DH001234", time: "1 ngày trước" },
    { type: "follow", content: "Theo dõi cửa hàng Beauty World", time: "3 ngày trước" },
    { type: "post", content: "Chia sẻ bài viết về xu hướng thời trang mùa hè", time: "5 ngày trước" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#3B82F6] 
                     rounded-2xl p-8 text-white mb-8 shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-primary shadow-lg">
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                <AvatarFallback className="text-2xl text-primary bg-white">{mockUser.name[0]}</AvatarFallback>
              </Avatar>
              <Button size="icon" className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white hover:bg-primary/80 shadow-md">
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2 text-shadow-lg drop-shadow-md">{mockUser.name}</h1>
              <p className="text-white/80 mb-3">{mockUser.bio}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="secondary" className="bg-primary/80 text-white border-primary/40 shadow">
                  {mockUser.level}
                </Badge>
                <Badge variant="secondary" className="bg-accent/80 text-white border-accent/40 shadow">
                  {mockUser.points} điểm
                </Badge>
              </div>
            </div>

            <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Edit3 className="w-4 h-4 mr-2 text-white" />
              <span className="text-white">Chỉnh sửa</span>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
            {[
              { value: mockUser.stats.totalOrders, label: "Đơn hàng", gradient: "from-purple-400 to-indigo-400", icon: Package },
              { value: mockUser.stats.reviews, label: "Đánh giá", gradient: "from-pink-400 to-fuchsia-400", icon: Star },
              { value: mockUser.stats.followers, label: "Người theo dõi", gradient: "from-yellow-400 to-orange-400", icon: Users },
              { value: mockUser.stats.following, label: "Đang theo dõi", gradient: "from-green-400 to-emerald-400", icon: UserPlus },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow"
              >
                <div className="flex flex-col items-center gap-2">
                  <item.icon className="w-6 h-6 text-white/80" />
                  <div
                    className={`text-2xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent drop-shadow`}
                  >
                    {item.value}
                  </div>
                  <div className="text-sm text-white/80">{item.label}</div>
                </div>
              </div>
            ))}
          </div>

        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger value="activity">Hoạt động</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="social">Kết nối</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-card border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Chi tiêu tháng này</p>
                      <p className="text-2xl font-bold">3.5M</p>
                      <p className="text-xs text-success">+12% so với tháng trước</p>
                    </div>
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Điểm thưởng</p>
                      <p className="text-2xl font-bold">{mockUser.points}</p>
                      <p className="text-xs text-warning">Còn 250 điểm lên VIP</p>
                    </div>
                    <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-warning" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Hoạt động cộng đồng</p>
                      <p className="text-2xl font-bold">156</p>
                      <p className="text-xs text-accent">Tương tác tuần này</p>
                    </div>
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Thứ hạng</p>
                      <p className="text-2xl font-bold">#47</p>
                      <p className="text-xs text-success">Top 5% người dùng</p>
                    </div>
                    <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Chi tiêu theo tháng (12 tháng)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={spendingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                        formatter={(value: number, name: string) => [
                          name === 'amount' ? `${(value / 1000000).toFixed(1)}M đ` : value,
                          name === 'amount' ? 'Chi tiêu' : 'Số đơn'
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-accent" />
                    Danh mục yêu thích
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string, props: any) => [
                          `${value}%`,
                          `${(props.payload.amount / 1000000).toFixed(1)}M đ`
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-success" />
                    Hoạt động cộng đồng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
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
                      <Bar dataKey="posts" fill="hsl(var(--primary))" name="Bài viết" />
                      <Bar dataKey="likes" fill="hsl(var(--accent))" name="Lượt thích" />
                      <Bar dataKey="comments" fill="hsl(var(--success))" name="Bình luận" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-warning" />
                    Thành tích & Huy hiệu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${achievement.color}20` }}
                        >
                          <achievement.icon
                            className="w-6 h-6"
                            style={{ color: achievement.color }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{achievement.title}</h4>
                            {achievement.earned && (
                              <Badge variant="secondary" className="bg-success/20 text-success">
                                Hoàn thành
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          {!achievement.earned && achievement.target && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span>{achievement.progress}</span>
                                <span>{achievement.target}</span>
                              </div>
                              <Progress
                                value={(achievement.progress / achievement.target) * 100}
                                className="h-2"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input id="name" value={mockUser.name} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={mockUser.email} type="email" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" value={mockUser.phone} />
                  </div>
                  <div>
                    <Label htmlFor="joinDate">Ngày tham gia</Label>
                    <Input id="joinDate" value={mockUser.joinDate} disabled />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Giới thiệu bản thân</Label>
                  <Textarea id="bio" value={mockUser.bio} rows={3} />
                </div>
                <div>
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input id="address" value={mockUser.address} />
                </div>
                <Button
                  className="w-full md:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {activity.type === 'review' && <Award className="w-5 h-5 text-primary" />}
                        {activity.type === 'order' && <ShoppingBag className="w-5 h-5 text-primary" />}
                        {activity.type === 'follow' && <Heart className="w-5 h-5 text-primary" />}
                        {activity.type === 'post' && <Edit3 className="w-5 h-5 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">{activity.content}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Danh sách yêu thích ({wishlistItems.length} sản phẩm)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlistItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-border rounded-lg hover-lift">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                        <p className="text-primary font-semibold">{item.price.toLocaleString('vi-VN')}đ</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Mua ngay
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  Kết nối xã hội
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Người theo dõi nổi bật</h3>
                    <div className="space-y-3">
                      {socialConnections.map((connection, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={connection.avatar} />
                            <AvatarFallback>{connection.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{connection.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {connection.mutual} bạn chung
                            </p>
                          </div>
                          <Badge variant="secondary" className="capitalize">
                            {connection.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Xu hướng theo dõi</h3>
                    <div className="space-y-4">
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Beauty Influencers</p>
                              <p className="text-sm text-muted-foreground">Đang theo dõi 23</p>
                            </div>
                            <TrendingUp className="w-5 h-5 text-primary" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-accent/5 border-accent/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Fashion Brands</p>
                              <p className="text-sm text-muted-foreground">Đang theo dõi 15</p>
                            </div>
                            <Heart className="w-5 h-5 text-accent" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-success/5 border-success/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Tech Reviewers</p>
                              <p className="text-sm text-muted-foreground">Đang theo dõi 8</p>
                            </div>
                            <Star className="w-5 h-5 text-success" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;