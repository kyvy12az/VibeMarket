export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: string;
    image: string;
    price: string;
    attendees: number;
    fullDescription?: string;
    organizer?: {
        name: string;
        avatar: string;
        description: string;
    };
    agenda?: { time: string; title: string; description: string }[];
    gallery?: string[];
    reviews?: { id: string; user: string; avatar: string; rating: number; comment: string; date: string }[];
    locationMap?: string;
}

export const mockEvents: Event[] = [
    {
        id: "1",
        title: "Lễ hội mua sắm 12.12",
        description: "Siêu sale cuối năm với hàng triệu deal hấp dẫn, cơ hội nhận voucher khủng và quà tặng độc quyền.",
        fullDescription: "Siêu sale cuối năm với hàng triệu deal hấp dẫn, cơ hội nhận voucher khủng và quà tặng độc quyền.",
        date: "2025-12-12",
        time: "08:00 - 21:00",
        location: "Online & Toàn quốc",
        category: "Giảm đến 70%",
        image: "https://dienmaythiennamhoa.vn/static/images/Cover%20Zalo%20LHMS-01-01.jpg",
        price: "Miễn phí",
        attendees: 25000,
        organizer: {
            name: "VibeMarket",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
            description: "Tổ chức sự kiện lễ hội hàng đầu Việt Nam"
        },
        agenda: [
            { time: "08:00 - 09:00", title: "Khai mạc & Check-in", description: "Check-in online, nhận mã ưu đãi đầu ngày" },
            { time: "09:00 - 12:00", title: "Mở bán deal sốc", description: "Săn deal giới hạn, voucher giảm giá cực sâu" },
            { time: "12:00 - 14:00", title: "Livestream cùng KOLs", description: "Giao lưu, minigame, nhận quà tặng" },
            { time: "15:00 - 18:00", title: "Flash Sale giờ vàng", description: "Deal chớp nhoáng, giá sốc mỗi giờ" },
            { time: "19:00 - 20:00", title: "Bốc thăm trúng thưởng", description: "Công bố người thắng giải, trao quà tặng" },
            { time: "20:00 - 21:00", title: "Bế mạc & tổng kết", description: "Tổng kết sự kiện, cảm ơn khách hàng" }
        ],
        gallery: [
            "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800",
            "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800",
            "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800"
        ],
        reviews: [
            { id: "1", user: "Nguyễn Văn A", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50", rating: 5, comment: "Sự kiện tuyệt vời! Học được rất nhiều điều mới.", date: "2024-09-20" },
            { id: "2", user: "Trần Thị B", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50", rating: 4, comment: "Nội dung chất lượng, tổ chức tốt.", date: "2024-09-18" }
        ],
        locationMap: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0969439132675!2d105.8019274!3d21.0285582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab86cece9ac5%3A0x8a3daa2a04e9e8e2!2zVHJ1bmcgdMOibSBI4buZaSBuZ2jhu4sgUXXhu5FjIGdpYQ!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
    },
    {
        id: "2",
        title: "Festival Local Brand 2024",
        description: "Tôn vinh và quảng bá các thương hiệu Việt Nam, trải nghiệm sản phẩm mới và nhận ưu đãi độc quyền.",
        fullDescription: "Sự kiện quy tụ các local brand nổi bật, trình diễn BST mới, workshop, giao lưu cùng KOLs và nhận ưu đãi độc quyền.",
        date: "2024-06-20",
        time: "09:00 - 18:00",
        location: "TP.HCM, Hà Nội, Đà Nẵng",
        category: "Ưu đãi độc quyền",
        image: "https://ik.imagekit.io/goodid/gnfi/uploads/articles/large-local-brand-festival-2024-ajang-mahasiswa-binus-memperkenalkan-inovasi-produk-UaNZb1M0rA.jpg?tr=w-730,h-486,fo-center",
        price: "300.000 VNĐ",
        attendees: 15000,
        organizer: {
            name: "Local Brand Community",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            description: "Cộng đồng local brand lớn nhất Việt Nam"
        },
        agenda: [
            { time: "09:00 - 10:00", title: "Khai mạc & check-in", description: "Đón khách, check-in nhận quà" },
            { time: "10:00 - 12:00", title: "Workshop Local Brand", description: "Chia sẻ kinh nghiệm xây dựng thương hiệu" },
            { time: "14:00 - 16:00", title: "Trình diễn BST mới", description: "Show thời trang các local brand nổi bật" },
            { time: "16:00 - 17:00", title: "Giao lưu cùng KOLs", description: "Giao lưu, chụp ảnh cùng khách mời nổi tiếng" },
            { time: "17:00 - 18:00", title: "Bốc thăm & bế mạc", description: "Bốc thăm trúng thưởng, tổng kết sự kiện" }
        ],
        gallery: [
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
            "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800",
            "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800"
        ],
        reviews: [
            { id: "1", user: "Lê Thị Hoa", avatar: "https://randomuser.me/api/portraits/women/44.jpg", rating: 5, comment: "Không khí rất sôi động, nhiều ưu đãi hấp dẫn!", date: "2024-06-21" },
            { id: "2", user: "Nguyễn Minh Tuấn", avatar: "https://randomuser.me/api/portraits/men/45.jpg", rating: 4, comment: "Nhiều thương hiệu mới, trải nghiệm tuyệt vời.", date: "2024-06-21" }
        ],
        locationMap: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.123456789!2d106.7000000!3d10.7765300!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1b1b1b1b1b%3A0x123456789abcdef!2zQ8O0bmcgdmnDqm4gTG9jYWwgQnJhbmQ!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
    },
];

export const categories = [
    "Tất cả",
    "Công nghệ",
    "Âm nhạc",
    "Nghệ thuật",
    "Kinh doanh",
    "Ẩm thực",
    "Thể thao",
    "Giải trí"
];