import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { mockEvents } from "@/data/mockEvents";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import {
    ArrowLeft, Calendar, Clock, MapPin, Users, Share2, Heart,
    Download, Star, User, Mail, Phone,
    PartyPopper,
    GalleryVertical,
    GalleryHorizontal,
    MessagesSquare,
    CalendarRange
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const event = mockEvents.find((e) => e.id === id);
    const [isFavorite, setIsFavorite] = useState(false);
    const [registrationForm, setRegistrationForm] = useState({ name: "", email: "", phone: "" });

    if (!event) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Không tìm thấy sự kiện</h1>
                    <Button onClick={() => navigate("/")}>Quay về trang chủ</Button>
                </div>
            </div>
        );
    }

    const relatedEvents = mockEvents
        .filter((e) => e.category === event.category && e.id !== event.id)
        .slice(0, 3);

    const handleShare = () => {
        toast({ title: "Đã sao chép link!", description: "Link sự kiện đã được copy vào clipboard" });
    };

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
        toast({ title: isFavorite ? "Đã bỏ yêu thích" : "Đã thêm vào yêu thích" });
    };

    const handleRegistration = (e: React.FormEvent) => {
        e.preventDefault();
        toast({ title: "Đăng ký thành công!", description: "Chúng tôi sẽ gửi xác nhận qua email" });
        setRegistrationForm({ name: "", email: "", phone: "" });
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative h-[500px] overflow-hidden"
            >
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="backdrop-blur-sm"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={handleFavorite}
                            className="backdrop-blur-sm"
                        >
                            <Heart className={`h-5 w-5 ${isFavorite ? "fill-primary text-primary" : ""}`} />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={handleShare}
                            className="backdrop-blur-sm"
                        >
                            <Share2 className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <div className="absolute bottom-8 md:left-8 right-8">
                    <div className="container mx-auto">
                        <Badge className="mb-4">{event.category}</Badge>
                        <h1 className="md:text-5xl text-4xl font-bold text-white mb-4">{event.title}</h1>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                <PartyPopper className="w-6 h-6 text-primary" />
                                Về sự kiện
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {event.fullDescription || event.description}
                            </p>
                        </motion.section>

                        {/* Organizer */}
                        {event.organizer && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                    <Users className="w-6 h-6 text-primary" />
                                    Ban tổ chức
                                </h2>
                                <Card className="p-6">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-16 w-16">
                                            <img src={event.organizer.avatar} alt={event.organizer.name} />
                                        </Avatar>
                                        <div>
                                            <h3 className="font-bold text-lg">{event.organizer.name}</h3>
                                            <p className="text-muted-foreground">{event.organizer.description}</p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.section>
                        )}

                        {/* Agenda */}
                        {event.agenda && event.agenda.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                    <Clock className="w-6 h-6 text-primary" />
                                    Lịch trình
                                </h2>
                                <Card className="p-6">
                                    <div className="space-y-6">
                                        {event.agenda.map((item, index) => (
                                            <div key={index} className="flex gap-4">
                                                <div className="flex-shrink-0 w-24 text-primary font-semibold">
                                                    {item.time}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold mb-1">{item.title}</h4>
                                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </motion.section>
                        )}

                        {/* Gallery */}
                        {event.gallery && event.gallery.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                    <GalleryHorizontal className="w-6 h-6 text-primary" />
                                    Hình ảnh
                                </h2>
                                <div className="grid grid-cols-3 gap-4">
                                    {event.gallery.map((img, index) => (
                                        <motion.img
                                            key={index}
                                            src={img}
                                            alt={`Gallery ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                                            whileHover={{ scale: 1.05 }}
                                        />
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Map */}
                        {event.locationMap && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                    <MapPin className="w-6 h-6 text-primary" />
                                    Địa điểm
                                </h2>
                                <div className="rounded-lg overflow-hidden h-[400px]">
                                    <iframe
                                        src={event.locationMap}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                    />
                                </div>
                            </motion.section>
                        )}

                        {/* Reviews */}
                        {event.reviews && event.reviews.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                    <MessagesSquare className="w-6 h-6 text-primary" />
                                    Đánh giá
                                </h2>
                                <div className="space-y-4">
                                    {event.reviews.map((review) => (
                                        <Card key={review.id} className="p-6">
                                            <div className="flex items-start gap-4">
                                                <Avatar>
                                                    <img src={review.avatar} alt={review.user} />
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-bold">{review.user}</h4>
                                                        <span className="text-sm text-muted-foreground">{review.date}</span>
                                                    </div>
                                                    <div className="flex gap-1 mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted"
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className="text-muted-foreground">{review.comment}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </motion.section>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Event Info Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="sticky top-8"
                        >
                            <Card className="p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Ngày</p>
                                        <p className="font-semibold">{new Date(event.date).toLocaleDateString("vi-VN")}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Thời gian</p>
                                        <p className="font-semibold">{event.time}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Địa điểm</p>
                                        <p className="font-semibold">{event.location}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Người tham gia</p>
                                        <p className="font-semibold">{event.attendees} người</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="pt-2">
                                    <p className="text-2xl font-bold text-primary mb-4">{event.price}</p>

                                    <form onSubmit={handleRegistration} className="space-y-3">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Họ và tên"
                                                value={registrationForm.name}
                                                onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })}
                                                className="w-full px-4 py-2 rounded-md border bg-background"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                value={registrationForm.email}
                                                onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
                                                className="w-full px-4 py-2 rounded-md border bg-background"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="tel"
                                                placeholder="Số điện thoại"
                                                value={registrationForm.phone}
                                                onChange={(e) => setRegistrationForm({ ...registrationForm, phone: e.target.value })}
                                                className="w-full px-4 py-2 rounded-md border bg-background"
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full" size="lg">
                                            Đăng ký ngay
                                        </Button>
                                    </form>
                                </div>
                            </Card>

                            {/* Related Events */}
                            {relatedEvents.length > 0 && (
                                <Card className="p-6 mt-6">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-3">
                                        <CalendarRange className="w-5 h-5 text-primary" />
                                        Sự kiện liên quan
                                    </h3>
                                    <div className="space-y-4">
                                        {relatedEvents.map((relatedEvent) => (
                                            <Link key={relatedEvent.id} to={`/event/${relatedEvent.id}`}>
                                                <div className="flex gap-3 hover:bg-accent/50 p-2 rounded-lg transition-colors cursor-pointer">
                                                    <img
                                                        src={relatedEvent.image}
                                                        alt={relatedEvent.title}
                                                        className="w-20 h-20 object-cover rounded-md"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                                                            {relatedEvent.title}
                                                        </h4>
                                                        <p className="text-xs text-muted-foreground">{relatedEvent.date}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </Card>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;