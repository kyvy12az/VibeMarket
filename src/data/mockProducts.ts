export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  availability: 'in-stock' | 'out-of-stock' | 'pre-order';
  affiliateLink?: string;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Glow Serum Vitamin C',
    description: 'Serum vitamin C giúp làm sáng da và chống lão hóa',
    price: 299000,
    image: 'https://images.unsplash.com/photo-1556228578-dd75ca7b38b9?w=300&h=300&fit=crop',
    category: 'Beauty',
    brand: 'GlowLab',
    rating: 4.8,
    reviews: 1234,
    availability: 'in-stock',
    affiliateLink: 'https://example.com/glow-serum'
  },
  {
    id: '2', 
    name: 'Wireless Headphones Pro',
    description: 'Tai nghe không dây với chất lượng âm thanh cao cấp',
    price: 2999000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    category: 'Tech',
    brand: 'AudioMax',
    rating: 4.6,
    reviews: 892,
    availability: 'in-stock',
    affiliateLink: 'https://example.com/wireless-headphones'
  },
  {
    id: '3',
    name: 'Trendy Sneakers',
    description: 'Giày sneaker thời trang phối màu độc đáo',
    price: 1599000,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
    category: 'Fashion',
    brand: 'StyleWalk',
    rating: 4.5,
    reviews: 567,
    availability: 'in-stock',
    affiliateLink: 'https://example.com/trendy-sneakers'
  },
  {
    id: '4',
    name: 'Smart Home Speaker',
    description: 'Loa thông minh điều khiển bằng giọng nói',
    price: 1299000,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    category: 'Tech',
    brand: 'SmartLife',
    rating: 4.7,
    reviews: 445,
    availability: 'in-stock',
    affiliateLink: 'https://example.com/smart-speaker'
  },
  {
    id: '5',
    name: 'Organic Green Tea',
    description: 'Trà xanh hữu cơ cao cấp giúp thư giãn',
    price: 189000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=300&fit=crop',
    category: 'Food',
    brand: 'TeaHouse',
    rating: 4.9,
    reviews: 234,
    availability: 'in-stock',
    affiliateLink: 'https://example.com/organic-tea'
  },
  {
    id: '6',
    name: 'Yoga Mat Premium',
    description: 'Thảm yoga cao cấp chống trượt và thân thiện môi trường',
    price: 899000,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop',
    category: 'Fitness',
    brand: 'YogaLife',
    rating: 4.8,
    reviews: 678,
    availability: 'in-stock',
    affiliateLink: 'https://example.com/yoga-mat'
  }
];