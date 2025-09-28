import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Phone,
    Mail,
    MapPin,
    Calendar,
    CreditCard,
    Store,
    Star,
    MessageCircle,
    ShoppingCart,
    RefreshCw,
    Printer,
    Share2,
    ChevronRight
} from 'lucide-react';

// Mock data cho chi tiết đơn hàng
const mockOrderDetails = {
    'DH001234': {
        id: 'DH001234',
        status: 'shipping',
        orderDate: '2024-01-15T10:30:00Z',
        estimatedDelivery: '2024-01-18T15:00:00Z',
        total: 2750000,
        subtotal: 2500000,
        shippingFee: 50000,
        discount: 200000,
        timeline: [
            { status: 'ordered', label: 'Đặt hàng', timestamp: '2024-01-15T10:30:00Z', completed: true },
            { status: 'confirmed', label: 'Xác nhận', timestamp: '2024-01-15T11:15:00Z', completed: true },
            { status: 'packed', label: 'Đóng gói', timestamp: '2024-01-15T14:20:00Z', completed: true },
            { status: 'shipping', label: 'Vận chuyển', timestamp: '2024-01-16T08:00:00Z', completed: true },
            { status: 'delivered', label: 'Giao hàng', timestamp: null, completed: false }
        ],
        customer: {
            name: 'Nguyễn Văn Minh',
            phone: '0987654321',
            email: 'minh.nguyen@email.com',
            address: '123 Đường Láng, Phường Láng Thượng, Quận Đống Đa, Hà Nội'
        },
        shipping: {
            method: 'Giao hàng nhanh',
            carrier: 'Giao Hàng Tiết Kiệm',
            trackingCode: 'GHTK123456789',
            fee: 50000,
            estimatedDays: '2-3 ngày'
        },
        payment: {
            method: 'Ví điện tử MoMo',
            status: 'Đã thanh toán',
            transactionId: 'TXN_20240115_001234',
            paidAt: '2024-01-15T10:35:00Z'
        },
        vendor: {
            name: 'Cửa hàng Thời trang Elegance',
            rating: 4.8,
            reviewCount: 2341,
            phone: '024-3456-7890',
            email: 'elegance@shop.vn',
            address: '456 Phố Huế, Quận Hai Bà Trưng, Hà Nội',
            policies: 'Đổi trả trong 7 ngày, bảo hành 12 tháng'
        },
        items: [
            {
                id: 1,
                name: 'Áo sơ mi nam cao cấp',
                image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcToZKuhEkjvFh1i8c_PdmKtch991gRuqZe_3ocLnyLcyJONLE14moHTUvXEeTUXfm8ZLnaeyENWybWnCJDQIfAn0uz3eXkpdz9PsMUQB7QK2q03W1-MYj3TjZh32MPlCo64BXnVX1o&usqp=CAc',
                price: 890000,
                quantity: 2,
                variant: 'Màu xanh navy, Size L',
                sku: 'ASM-XN-L-001'
            },
            {
                id: 2,
                name: 'Quần tây công sở',
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRamO-KXzYK8E_y65BJ-qOI2B0fmyFKTE1xBQ&s',
                price: 1200000,
                quantity: 1,
                variant: 'Màu đen, Size 32',
                sku: 'QT-DEN-32-002'
            },
            {
                id: 3,
                name: 'Cà vạt lụa cao cấp',
                image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQAbBKOACS-vhD8FJRGDuaFJOy1ZrKXLGRcNc4wZk2Ky3CRlHLKLJCgRjL60ccMVTot1wIe5UJZ3oLhommG6GNUFtZPKfua1uJANKYbaL3CWAN9CVrCvCcNOQ5Y&usqp=CAc',
                price: 410000,
                quantity: 1,
                variant: 'Màu đỏ đô, họa tiết sọc',
                sku: 'CV-DO-SOC-003'
            }
        ]
    }
};

const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const order = mockOrderDetails[orderId as keyof typeof mockOrderDetails];

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-muted-foreground mb-4">Không tìm thấy đơn hàng</h2>
                    <Button onClick={() => navigate('/orders')} variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại
                    </Button>
                </div>
            </div>
        );
    }

    const getStatusIcon = (status: string, completed: boolean) => {
        if (!completed) return <div className="w-3 h-3 rounded-full border-2 border-muted-foreground bg-background" />;

        switch (status) {
            case 'ordered': return <Package className="w-4 h-4 text-primary" />;
            case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'packed': return <Package className="w-4 h-4 text-blue-500" />;
            case 'shipping': return <Truck className="w-4 h-4 text-orange-500" />;
            case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
            default: return <div className="w-3 h-3 rounded-full bg-muted" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'processing': return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Đang xử lý</Badge>;
            case 'shipping': return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Đang giao</Badge>;
            case 'delivered': return <Badge className="bg-green-100 text-green-800 border-green-200">Đã giao</Badge>;
            case 'cancelled': return <Badge className="bg-red-100 text-red-800 border-red-200">Đã hủy</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Chờ cập nhật';
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    };

    const getActionButtons = () => {
        switch (order.status) {
            case 'processing':
                return (
                    <div className="flex gap-2 flex-wrap">
                        <Button variant="destructive" size="sm">
                            <XCircle className="mr-2 h-4 w-4" />
                            Hủy đơn hàng
                        </Button>
                        <Button variant="outline" size="sm">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Liên hệ shop
                        </Button>
                    </div>
                );
            case 'shipping':
                return (
                    <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" size="sm">
                            <Truck className="mr-2 h-4 w-4" />
                            Theo dõi vận đơn
                        </Button>
                        <Button variant="outline" size="sm">
                            <Phone className="mr-2 h-4 w-4" />
                            Liên hệ shipper
                        </Button>
                    </div>
                );
            case 'delivered':
                return (
                    <div className="flex gap-2 flex-wrap">
                        <Button variant="default" size="sm">
                            <Star className="mr-2 h-4 w-4" />
                            Đánh giá sản phẩm
                        </Button>
                        <Button variant="outline" size="sm">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Mua lại
                        </Button>
                        <Button variant="outline" size="sm">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Yêu cầu trả hàng
                        </Button>
                    </div>
                );
            case 'cancelled':
                return (
                    <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" size="sm">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Mua lại
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Link to="/don-hang" className="hover:text-foreground">
                    Quản lý đơn hàng
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">Chi tiết đơn hàng #{order.id}</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 mb-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full">
                    <div className="flex items-center gap-2 md:gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="w-fit">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            <span className="hidden md:inline">Quay lại</span>
                        </Button>
                        <div className="flex flex-col items-start">
                            <h1 className="text-lg md:text-2xl font-bold">Đơn hàng #{order.id}</h1>
                            <p className="text-xs md:text-sm text-muted-foreground">Đặt hàng lúc {formatDate(order.orderDate)}</p>
                        </div>
                        <span className="mt-2 md:mt-0">{getStatusBadge(order.status)}</span>
                    </div>
                </div>
                <div className="flex gap-2 justify-center md:justify-end w-full md:w-auto">
                    <Button variant="outline" size="sm">
                        <Printer className="mr-2 h-4 w-4" />
                        <span className="hidden md:inline">In hóa đơn</span>
                    </Button>
                    <Button variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        <span className="hidden md:inline">Chia sẻ</span>
                    </Button>
                </div>
            </div>

            {/* Timeline - cải tiến trạng thái đơn hàng */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {/* Icon trạng thái lớn */}
                        {getStatusIcon(order.status, true)}
                        Trạng thái đơn hàng
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center gap-4">
                        {/* Hiển thị trạng thái hiện tại */}
                        <div className="flex items-center gap-3 flex-wrap text-base md:text-lg">
                            {getStatusBadge(order.status)}
                            <span className="font-semibold">
                                {order.timeline.find(t => t.status === order.status)?.label || 'Đang xử lý'}
                            </span>
                        </div>
                        {/* Ngày dự kiến giao hàng nếu có */}
                        {order.estimatedDelivery && (
                            <div className="text-xs md:text-sm text-muted-foreground">
                                Dự kiến giao: <span className="font-medium text-primary">{formatDate(order.estimatedDelivery)}</span>
                            </div>
                        )}
                        {/* Hiển thị tiến trình timeline - scroll ngang trên mobile */}
                        <div className="w-full overflow-x-auto pb-2">
                            <div className="flex items-center justify-between min-w-[400px] md:min-w-0 relative mt-6">
                                <div className="absolute top-6 left-0 right-0 h-0.5 bg-muted" />
                                <div
                                    className="absolute top-6 left-0 h-0.5 bg-primary transition-all duration-500"
                                    style={{ width: `${(order.timeline.filter(t => t.completed).length - 1) / (order.timeline.length - 1) * 100}%` }}
                                />
                                {order.timeline.map((step, index) => (
                                    <div key={index} className="flex flex-col items-center relative z-10 w-24 md:w-32 px-1 md:px-0">
                                        <div className={`p-2 md:p-3 rounded-full border-2 ${order.status === step.status ? 'border-primary bg-primary/10' : step.completed ? 'border-green-400 bg-green-50' : 'border-muted bg-muted'} mb-1 md:mb-2`}>
                                            {getStatusIcon(step.status, step.completed)}
                                        </div>
                                        <div className="text-center">
                                            <p className={`text-xs md:text-sm font-medium ${order.status === step.status ? 'text-primary' : step.completed ? 'text-green-700' : 'text-muted-foreground'}`}>{step.label}</p>
                                            <p className="text-[10px] md:text-xs text-muted-foreground mt-1">{formatDate(step.timestamp)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Sản phẩm đã đặt</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 border rounded-lg"
                                    >
                                        {/* Hình ảnh sản phẩm */}
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-md mx-auto sm:mx-0"
                                        />

                                        {/* Thông tin sản phẩm */}
                                        <div className="flex-1 w-full text-center sm:text-left mt-1 sm:mt-0">
                                            <h4 className="font-medium text-sm sm:text-base line-clamp-2">
                                                {item.name}
                                            </h4>
                                            <p className="text-xs sm:text-sm text-muted-foreground">
                                                {item.variant}
                                            </p>
                                            <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                                        </div>
                                        
                                        {/* Giá & số lượng */}
                                        <div className="flex flex-col items-end w-full sm:w-auto gap-1 text-sm">
                                            <div className="flex flex-col items-end sm:block w-full sm:w-auto">
                                                <p className="font-medium">{formatCurrency(item.price)}</p>
                                                <p className="text-muted-foreground">x{item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-primary text-right sm:text-base">
                                                {formatCurrency(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            {/* Tổng kết đơn hàng */}
                            <div className="space-y-2 text-sm sm:text-base">
                                <div className="flex justify-between">
                                    <span>Tạm tính:</span>
                                    <span>{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Phí vận chuyển:</span>
                                    <span>{formatCurrency(order.shippingFee)}</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                    <span>Giảm giá:</span>
                                    <span>-{formatCurrency(order.discount)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-base sm:text-lg">
                                    <span>Tổng cộng:</span>
                                    <span className="text-primary">{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </CardContent>

                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thao tác</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {getActionButtons()}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Thông tin giao hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="font-medium">{order.customer.name}</p>
                                <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                                <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm font-medium mb-1">Địa chỉ giao hàng:</p>
                                <p className="text-sm text-muted-foreground">{order.customer.address}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Thông tin vận chuyển
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm">Phương thức:</span>
                                <span className="text-sm font-medium">{order.shipping.method}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Đơn vị vận chuyển:</span>
                                <span className="text-sm font-medium">{order.shipping.carrier}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Mã vận đơn:</span>
                                <span className="text-sm font-medium text-primary">{order.shipping.trackingCode}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Thời gian dự kiến:</span>
                                <span className="text-sm font-medium">{order.shipping.estimatedDays}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Thông tin thanh toán
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm">Phương thức:</span>
                                <span className="text-sm font-medium">{order.payment.method}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Trạng thái:</span>
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    {order.payment.status}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Mã giao dịch:</span>
                                <span className="text-sm font-medium">{order.payment.transactionId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Thời gian:</span>
                                <span className="text-sm font-medium">{formatDate(order.payment.paidAt)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vendor Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Store className="h-5 w-5" />
                                Thông tin cửa hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <p className="font-medium">{order.vendor.name}</p>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-medium">{order.vendor.rating}</span>
                                        <span className="text-sm text-muted-foreground">({order.vendor.reviewCount})</span>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">{order.vendor.phone}</p>
                                <p className="text-sm text-muted-foreground">{order.vendor.email}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm font-medium mb-1">Địa chỉ:</p>
                                <p className="text-sm text-muted-foreground">{order.vendor.address}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm font-medium mb-1">Chính sách:</p>
                                <p className="text-sm text-muted-foreground">{order.vendor.policies}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    Chat
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                    <Store className="mr-2 h-4 w-4" />
                                    Xem shop
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;