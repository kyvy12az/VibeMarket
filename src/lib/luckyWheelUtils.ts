export interface Prize {
  id: string;
  name: string;
  icon: string;
  value: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string;
}

export interface SpinHistory {
  prize: Prize;
  timestamp: number;
}

export interface DailySpins {
  spinsLeft: number;
  history: SpinHistory[];
}

// Default prizes - 8 phần thưởng
export const DEFAULT_PRIZES: Prize[] = [
  {
    id: '1',
    name: 'Voucher 50K',
    icon: '🎫',
    value: '50,000đ',
    description: 'Giảm 50K cho đơn từ 500K',
    rarity: 'common',
    color: '#8B5CF6'
  },
  {
    id: '2',
    name: 'Freeship',
    icon: '🚚',
    value: '30,000đ',
    description: 'Miễn phí vận chuyển',
    rarity: 'common',
    color: '#06B6D4'
  },
  {
    id: '3',
    name: 'Voucher 100K',
    icon: '💎',
    value: '100,000đ',
    description: 'Giảm 100K cho đơn từ 1 triệu',
    rarity: 'rare',
    color: '#8B5CF6'
  },
  {
    id: '4',
    name: 'Xu Vibe',
    icon: '🪙',
    value: '1,000 xu',
    description: 'Tích luỹ để đổi quà',
    rarity: 'common',
    color: '#06B6D4'
  },
  {
    id: '5',
    name: 'Voucher 200K',
    icon: '🎁',
    value: '200,000đ',
    description: 'Giảm 200K cho đơn từ 2 triệu',
    rarity: 'epic',
    color: '#8B5CF6'
  },
  {
    id: '6',
    name: 'Thêm lượt quay',
    icon: '🔄',
    value: '+1 lượt',
    description: 'Thêm 1 lượt quay hôm nay',
    rarity: 'rare',
    color: '#06B6D4'
  },
  {
    id: '7',
    name: 'Voucher 500K',
    icon: '👑',
    value: '500,000đ',
    description: 'Giảm 500K cho đơn từ 5 triệu',
    rarity: 'legendary',
    color: '#8B5CF6'
  },
  {
    id: '8',
    name: 'Chúc may mắn',
    icon: '🍀',
    value: 'Lần sau nhé',
    description: 'Hãy thử lại vào ngày mai!',
    rarity: 'common',
    color: '#06B6D4'
  }
];

// LocalStorage functions
export const loadDailySpins = (): DailySpins => {
  const stored = localStorage.getItem('luckyWheelData');
  if (!stored) {
    return { spinsLeft: 1, history: [] };
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return { spinsLeft: 1, history: [] };
  }
};

export const saveDailySpins = (data: DailySpins) => {
  localStorage.setItem('luckyWheelData', JSON.stringify(data));
};

// Random prize selection with weighted probability
export const selectRandomPrize = (prizes: Prize[]): Prize => {
  const weights = prizes.map(p => {
    switch (p.rarity) {
      case 'legendary': return 1;
      case 'epic': return 5;
      case 'rare': return 15;
      case 'common': return 30;
      default: return 10;
    }
  });
  
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < prizes.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return prizes[i];
    }
  }
  
  return prizes[0];
};

// Sound functions (commented - can be implemented later with actual audio files)
export const playSpinSound = () => {
  // const audio = new Audio('/sounds/spin.mp3');
  // audio.play().catch(() => {});
  console.log('🎵 Spin sound');
};

export const playWinSound = () => {
  // const audio = new Audio('/sounds/win.mp3');
  // audio.play().catch(() => {});
  console.log('🎵 Win sound');
};

// Calculate rotation angle for the winning prize
export const calculateRotation = (prizeIndex: number, prizes: Prize[]): number => {
  const segmentAngle = 360 / prizes.length;
  const fullTurns = 5; // số vòng quay đầy đủ
  // góc giữa tâm và giữa segment (theo cách vẽ trong Wheel: offset -90)
  const prizeMiddle = (prizeIndex + 0.5) * segmentAngle;
  // quay sao cho prizeMiddle về top (0°). positive rotate là chiều kim đồng hồ,
  // nên target = fullTurns*360 - prizeMiddle (+90 offset handled in prizeMiddle)
  return fullTurns * 360 - prizeMiddle;
};
// ...existing code...
