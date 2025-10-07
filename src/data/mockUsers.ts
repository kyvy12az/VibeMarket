export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  zalo_id?: string;
  facebook_id?: string;
  role: 'admin' | 'user' | 'seller';
  created_at?: string;
  token?: string;
  points?: number;
  isVendor?: boolean;
}
