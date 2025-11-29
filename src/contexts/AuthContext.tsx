import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/data/mockUsers';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:80";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Hàm cập nhật status (online/offline)
  const updateUserStatus = async (status: 'online' | 'offline') => {
    const token = localStorage.getItem('vibeventure_token');
    if (!token) return;
    
    try {
      await fetch(`${BACKEND_URL}/api/community/users/update_status.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.error('Failed to update user status:', err);
    }
  };

  // Hàm ping activity (cập nhật last_seen)
  const pingActivity = async () => {
    const token = localStorage.getItem('vibeventure_token');
    if (!token) return;
    
    try {
      await fetch(`${BACKEND_URL}/api/community/users/update_activity.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error('Failed to ping activity:', err);
    }
  };

  // Lấy lại user và token khi load lại trang
  useEffect(() => {
    const savedUser = localStorage.getItem('vibeventure_user');
    const savedToken = localStorage.getItem('vibeventure_token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        // Set status = online khi load lại trang
        updateUserStatus('online');
      } catch (error) {
        localStorage.removeItem('vibeventure_user');
        localStorage.removeItem('vibeventure_token');
      }
    }
  }, []);

  // Ping activity mỗi 30 giây khi user đang đăng nhập
  useEffect(() => {
    if (!user) return;
    
    // Ping ngay lập tức
    pingActivity();
    
    // Ping mỗi 30 giây
    const interval = setInterval(pingActivity, 30000);
    
    // Cleanup
    return () => clearInterval(interval);
  }, [user]);

  // Set offline khi đóng tab/browser
  useEffect(() => {
    const handleBeforeUnload = () => {
      updateUserStatus('offline');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('vibeventure_user', JSON.stringify(data.user));
        localStorage.setItem('vibeventure_token', data.token);
        
        // Set status = online
        await updateUserStatus('online');
        
        toast({
          title: "Đăng nhập thành công!",
          description: `Chào mừng ${data.user.name}`,
        });
        setIsLoading(false);
        return true;
      } else {
        toast({
          title: "Đăng nhập thất bại",
          description: data.error || "Email hoặc mật khẩu không đúng",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      toast({
        title: "Lỗi hệ thống",
        description: "Không thể kết nối máy chủ",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('vibeventure_user', JSON.stringify(data.user));
        localStorage.setItem('vibeventure_token', data.token);
        toast({
          title: "Đăng ký thành công!",
          description: `Chào mừng ${data.user.name}`,
        });
        setIsLoading(false);
        return true;
      } else {
        toast({
          title: "Đăng ký thất bại",
          description: data.error || "Đã có lỗi xảy ra",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      toast({
        title: "Lỗi hệ thống",
        description: "Không thể kết nối máy chủ",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const googleLogin = async (credential: string, type: "id_token" | "code" = "id_token"): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/google.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(type === "id_token" ? { googleToken: credential } : { code: credential }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('vibeventure_user', JSON.stringify(data.user));
        localStorage.setItem('vibeventure_token', data.token);
        toast({
          title: "Đăng nhập Google thành công!",
          description: `Chào mừng ${data.user.name}`,
        });
        setIsLoading(false);
        return true;
      } else {
        toast({
          title: "Đăng nhập Google thất bại",
          description: data.message || "Có lỗi xảy ra",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      toast({
        title: "Lỗi hệ thống",
        description: "Không thể kết nối máy chủ",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const zaloLogin = async (zaloToken: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/zalo.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zaloToken }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('vibeventure_user', JSON.stringify(data.user));
        localStorage.setItem('vibeventure_token', data.token);
        toast({
          title: "Đăng nhập Zalo thành công!",
          description: `Chào mừng ${data.user.name}`,
        });
        setIsLoading(false);
        return true;
      } else {
        toast({
          title: "Đăng nhập Zalo thất bại",
          description: data.message || "Có lỗi xảy ra",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      toast({
        title: "Lỗi hệ thống",
        description: "Không thể kết nối máy chủ",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const facebookLogin = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Đổi code lấy accessToken từ Facebook
      const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;
      const FACEBOOK_APP_SECRET = import.meta.env.VITE_FACEBOOK_APP_SECRET;
      const REDIRECT_URI_FACEBOOK = `${window.location.origin}/callback/facebook`;

      // Lấy access_token từ Facebook
      const tokenRes = await fetch(
        `https://graph.facebook.com/v19.0/oauth/access_token?` +
        `client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI_FACEBOOK)}` +
        `&client_secret=${FACEBOOK_APP_SECRET}&code=${code}`
      );
      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        toast({
          title: "Đăng nhập Facebook thất bại",
          description: tokenData.error?.message || "Không lấy được access token",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }

      // Gửi access_token lên backend để lấy user & token
      const res = await fetch(`${BACKEND_URL}/api/auth/facebook.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: tokenData.access_token }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('vibeventure_user', JSON.stringify(data.user));
        localStorage.setItem('vibeventure_token', data.token);
        toast({
          title: "Đăng nhập Facebook thành công!",
          description: `Chào mừng ${data.user.name}`,
        });
        setIsLoading(false);
        return true;
      } else {
        toast({
          title: "Đăng nhập Facebook thất bại",
          description: data.message || "Có lỗi xảy ra",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      toast({
        title: "Lỗi hệ thống",
        description: "Không thể kết nối máy chủ",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    // Set status = offline trước khi logout
    await updateUserStatus('offline');
    
    setUser(null);
    localStorage.removeItem('vibeventure_user');
    localStorage.removeItem('vibeventure_token');
    
    toast({
      title: "Đã đăng xuất",
      description: "Hẹn gặp lại bạn!",
    });
  };

  const value = {
    user,
    login,
    register,
    googleLogin,
    facebookLogin,
    zaloLogin,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};