import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Calendar, TrendingUp, ShoppingBag, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface UserVoucher {
  id: number;
  voucher_code: string;
  prize_name: string;
  voucher_type: 'discount' | 'freeship' | 'coins' | 'extra_spin' | 'no_prize';
  discount_amount: number;
  min_order_value: number;
  is_used: boolean;
  is_expired: boolean;
  used_at: string | null;
  expires_at: string;
  created_at: string;
  description: string;
}

interface VoucherCounts {
  unused: number;
  used: number;
  expired: number;
  total: number;
}

const UserVouchers = () => {
  const [vouchers, setVouchers] = useState<UserVoucher[]>([]);
  const [counts, setCounts] = useState<VoucherCounts>({ unused: 0, used: 0, expired: 0, total: 0 });
  const [filter, setFilter] = useState<'unused' | 'used' | 'expired' | 'all'>('unused');
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchVouchers();
  }, [filter]);

  const fetchVouchers = async () => {
    const token = localStorage.getItem('vibeventure_token');
    if (!token) {
      alert('Vui lòng đăng nhập để xem voucher');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/lucky_wheel/get_vouchers.php?filter=${filter}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        setVouchers(result.data.vouchers);
        setCounts(result.data.counts);
      } else {
        console.error('Failed to fetch vouchers:', result.message);
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVoucherIcon = (type: string) => {
    switch (type) {
      case 'discount': return '🎫';
      case 'freeship': return '🚚';
      case 'coins': return '🪙';
      case 'extra_spin': return '🔄';
      default: return '🍀';
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent mb-2">
            Kho Voucher Của Tôi
          </h1>
          <p className="text-gray-600">Quản lý các voucher từ vòng quay may mắn</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Chưa dùng', value: counts.unused, icon: Ticket, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Đã dùng', value: counts.used, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Hết hạn', value: counts.expired, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Tổng cộng', value: counts.total, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`${stat.bg} p-4 rounded-xl`}
            >
              <stat.icon className={`${stat.color} mb-2`} size={24} />
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: 'unused' as const, label: 'Chưa dùng', count: counts.unused },
            { key: 'used' as const, label: 'Đã dùng', count: counts.used },
            { key: 'expired' as const, label: 'Hết hạn', count: counts.expired },
            { key: 'all' as const, label: 'Tất cả', count: counts.total }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                filter === tab.key
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Vouchers List */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Đang tải voucher...</p>
          </div>
        ) : vouchers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Ticket size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Không có voucher nào</p>
            <p className="text-gray-400 mt-2">Hãy quay vòng may mắn để nhận voucher!</p>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vouchers.map((voucher, idx) => (
              <motion.div
                key={voucher.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`relative bg-white rounded-xl shadow-md overflow-hidden border-2 ${
                  voucher.is_used ? 'border-gray-300 opacity-70' :
                  voucher.is_expired ? 'border-red-300 opacity-70' :
                  'border-purple-300 hover:shadow-xl transition-shadow'
                }`}
              >
                {/* Status Badge */}
                <div className="absolute top-3 right-3 z-10">
                  {voucher.is_used ? (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      Đã dùng
                    </span>
                  ) : voucher.is_expired ? (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                      Hết hạn
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      Có thể dùng
                    </span>
                  )}
                </div>

                {/* Voucher Header */}
                <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 p-6 text-white">
                  <div className="text-4xl mb-2">{getVoucherIcon(voucher.voucher_type)}</div>
                  <h3 className="text-xl font-bold mb-1">{voucher.prize_name}</h3>
                  <p className="text-sm opacity-90">{voucher.description}</p>
                </div>

                {/* Voucher Body */}
                <div className="p-4">
                  {/* Voucher Code */}
                  <div className="mb-3">
                    <label className="text-xs text-gray-500 mb-1 block">Mã voucher</label>
                    <div 
                      onClick={() => !voucher.is_used && !voucher.is_expired && copyVoucherCode(voucher.voucher_code)}
                      className={`flex items-center justify-between bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-3 ${
                        !voucher.is_used && !voucher.is_expired ? 'cursor-pointer hover:bg-gray-100' : ''
                      }`}
                    >
                      <code className="font-mono font-bold text-purple-600">{voucher.voucher_code}</code>
                      {copiedCode === voucher.voucher_code && (
                        <span className="text-xs text-green-600 font-semibold">Đã sao chép!</span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-gray-600">
                    {voucher.min_order_value > 0 && (
                      <div className="flex items-center gap-2">
                        <ShoppingBag size={16} className="text-gray-400" />
                        <span>Đơn tối thiểu: {voucher.min_order_value.toLocaleString('vi-VN')}₫</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span>HSD: {formatDate(voucher.expires_at)}</span>
                    </div>

                    {voucher.is_used && voucher.used_at && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Clock size={16} />
                        <span>Đã dùng: {formatDate(voucher.used_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserVouchers;
