import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brain, Users, Heart, Share2, ShoppingCart, Star, Sparkles, UserPlus } from "lucide-react";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";

const AIRecommendationsPage = () => {
  const aiRecommendations = [
    {
      id: 1,
      name: "Áo thun Uniqlo Premium",
      price: 299000,
      originalPrice: 399000,
      image: "/placeholder.svg",
      rating: 4.8,
      reason: "Dựa trên lịch sử mua hàng thời trang của bạn",
      confidence: 95,
      category: "Thời trang"
    },
    {
      id: 2,
      name: "iPhone 15 Pro Max",
      price: 28990000,
      image: "/placeholder.svg",
      rating: 4.9,
      reason: "Phù hợp với sở thích công nghệ cao cấp",
      confidence: 88,
      category: "Điện tử"
    },
    {
      id: 3,
      name: "Giày Nike Air Max",
      price: 2199000,
      originalPrice: 2599000,
      image: "/placeholder.svg",
      rating: 4.7,
      reason: "Bạn bè cùng sở thích đã mua sản phẩm này",
      confidence: 92,
      category: "Giày dép"
    }
  ];

  const friends = [
    {
      id: 1,
      name: "Minh Anh",
      avatar: "/placeholder.svg",
      mutualFriends: 15,
      recentPurchase: "Túi xách Chanel",
      isOnline: true,
      sharedInterests: ["Thời trang", "Làm đẹp"]
    },
    {
      id: 2,
      name: "Đức Thành",
      avatar: "/placeholder.svg",
      mutualFriends: 8,
      recentPurchase: "Gaming laptop ASUS",
      isOnline: false,
      sharedInterests: ["Công nghệ", "Gaming"]
    },
    {
      id: 3,
      name: "Thu Hương",
      avatar: "/placeholder.svg",
      mutualFriends: 23,
      recentPurchase: "Nước hoa Dior",
      isOnline: true,
      sharedInterests: ["Làm đẹp", "Du lịch"]
    }
  ];

  const friendsActivity = [
    {
      id: 1,
      friend: "Minh Anh",
      avatar: "/placeholder.svg",
      action: "đã thích",
      item: "Váy midi hoa nhí",
      time: "2 giờ trước",
      itemImage: "/placeholder.svg"
    },
    {
      id: 2,
      friend: "Đức Thành",
      avatar: "/placeholder.svg",
      action: "đã mua",
      item: "Tai nghe Sony WH-1000XM5",
      time: "5 giờ trước",
      itemImage: "/placeholder.svg"
    },
    {
      id: 3,
      friend: "Thu Hương",
      avatar: "/placeholder.svg",
      action: "đã đánh giá 5 sao",
      item: "Kem dưỡng Cetaphil",
      time: "1 ngày trước",
      itemImage: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Brain className="w-8 h-8 text-primary" />
              AI Gợi ý & Bạn bè
            </h1>
            <p className="text-muted-foreground">Khám phá sản phẩm được AI đề xuất và hoạt động của bạn bè</p>
          </div>

          {/* AI Recommendations Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Gợi ý dành riêng cho bạn
              </h2>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                AI Powered
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {aiRecommendations.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <Badge 
                          className="absolute top-2 right-2 bg-primary text-primary-foreground"
                        >
                          {product.confidence}% phù hợp
                        </Badge>
                        {product.originalPrice && (
                          <Badge 
                            variant="destructive" 
                            className="absolute top-2 left-2"
                          >
                            Giảm giá
                          </Badge>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm ml-1">{product.rating}</span>
                          </div>
                          <Badge variant="outline">{product.category}</Badge>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl font-bold text-primary">
                            {product.price.toLocaleString('vi-VN')} đ
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm line-through text-muted-foreground">
                              {product.originalPrice.toLocaleString('vi-VN')} đ
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">
                          <Brain className="w-4 h-4 inline mr-1" />
                          {product.reason}
                        </p>

                        <div className="flex gap-2">
                          <Button className="flex-1">
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Thêm vào giỏ
                          </Button>
                          <Button variant="outline" size="icon">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Friends Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Bạn bè có cùng sở thích
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {friends.map((friend) => (
                      <div key={friend.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={friend.avatar} />
                              <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {friend.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{friend.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {friend.mutualFriends} bạn chung
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Mua gần đây: {friend.recentPurchase}
                            </p>
                            <div className="flex gap-1 mt-1">
                              {friend.sharedInterests.map((interest) => (
                                <Badge key={interest} variant="secondary" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <UserPlus className="w-4 h-4 mr-1" />
                          Kết bạn
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Friends Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Hoạt động của bạn bè
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {friendsActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg border">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={activity.avatar} />
                          <AvatarFallback>{activity.friend.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.friend}</span>
                            {' '}
                            <span className="text-muted-foreground">{activity.action}</span>
                            {' '}
                            <span className="font-medium">{activity.item}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        <img
                          src={activity.itemImage}
                          alt={activity.item}
                          className="w-10 h-10 rounded object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Xem thêm hoạt động
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AIRecommendationsPage;