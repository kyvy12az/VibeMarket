export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user' | 'seller';
  createdAt: Date;
  points?: number;
}

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@vibeventure.com',
    password: '123456',
    name: 'Kỳ Vỹ DEV',
    avatar: '../../public/images/avatars/Avt-Vy.jpg',
    role: 'admin',
  createdAt: new Date('2024-01-01'),
  points: 9999
  },
  {
    id: '2',
    email: 'user@gmail.com',
    password: '123456',
    name: 'Kỳ Vỹ DEV',
    avatar: '../../public/images/avatars/Avt-Vy.jpg',
    role: 'user',
  createdAt: new Date('2024-01-15'),
  points: 1200
  },
  {
    id: '3',
    email: 'seller@gmail.com',
    password: '123456',
    name: 'Kỳ Vỹ DEV',
    avatar: '../../public/images/avatars/Avt-Vy.jpg',
    role: 'seller',
  createdAt: new Date('2024-02-01'),
  points: 3500
  }
];