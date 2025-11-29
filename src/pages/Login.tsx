import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthLayout } from '@/components/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const bearRef = React.useRef<HTMLDivElement>(null);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (bearRef.current) {
        const bearRect = bearRef.current.getBoundingClientRect();
        const bearCenterX = bearRect.left + bearRect.width / 2;
        const bearCenterY = bearRect.top + bearRect.height / 2;
        
        setMousePosition({
          x: e.clientX - bearCenterX,
          y: e.clientY - bearCenterY
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const calculateEyePosition = (maxMove: number = 6) => {
    const distance = Math.sqrt(mousePosition.x ** 2 + mousePosition.y ** 2);
    const maxDistance = 400;
    const moveRatio = Math.min(distance / maxDistance, 1);
    
    const angle = Math.atan2(mousePosition.y, mousePosition.x);
    const moveX = Math.cos(angle) * maxMove * moveRatio;
    const moveY = Math.sin(angle) * maxMove * moveRatio;
    
    return { x: moveX, y: moveY };
  };

  const eyePosition = calculateEyePosition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const success = await login(values.email, values.password, values.rememberMe);
    if (success) {
      navigate('/');
    }
  };

  // Đăng nhập bằng Zalo
  const ZALO_APP_ID = import.meta.env.VITE_ZALO_APP_ID;
  const REDIRECT_URI = `${window.location.origin}/callback/zalo`;
  const handleZaloLogin = () => {
    const authUrl = `https://oauth.zaloapp.com/v4/permission?app_id=${ZALO_APP_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&state=nguyenkyvy&scope=public_profile,email`;
    window.location.href = authUrl;
  };

  // Đăng nhập bằng Google
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const REDIRECT_URI_GOOGLE = `${window.location.origin}/callback/google`;
  const handleGoogleLogin = () => {
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI_GOOGLE)}&` +
      `response_type=code&` +
      `scope=openid email profile&` +
      `state=google_oauth`;
    window.location.href = authUrl;
  };

  const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;
  const REDIRECT_URI_FACEBOOK = `${window.location.origin}/callback/facebook`;

  const handleFacebookLogin = () => {
    const authUrl =
      `https://www.facebook.com/v19.0/dialog/oauth?` +
      `client_id=${FACEBOOK_APP_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI_FACEBOOK)}&` +
      `state=facebook_oauth&` +
      `scope=email,public_profile`;
    window.location.href = authUrl;
  };

  return (
    <AuthLayout
      title="Đăng nhập"
      subtitle="Chào mừng bạn quay trở lại!"
    >
      {/* Con gấu với mắt theo chuột */}
      <motion.div
        ref={bearRef}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="flex justify-center mb-6"
      >
        <div className="relative w-24 h-24">
          {/* Tai trái */}
          <motion.div
            animate={{ rotate: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 left-3 w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full shadow-lg"
          />
          {/* Tai phải */}
          <motion.div
            animate={{ rotate: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            className="absolute -top-2 right-3 w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full shadow-lg"
          />
          
          {/* Mặt gấu */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-xl border-2 border-amber-700/20">
            {/* Mắt trái */}
            <div className="absolute top-7 left-4 w-6 h-7 bg-white rounded-full shadow-inner">
              <motion.div
                animate={{
                  x: eyePosition.x,
                  y: eyePosition.y
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 left-1 w-3 h-3 bg-gray-900 rounded-full"
              >
                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full opacity-80" />
              </motion.div>
            </div>
            
            {/* Mắt phải */}
            <div className="absolute top-7 right-4 w-6 h-7 bg-white rounded-full shadow-inner">
              <motion.div
                animate={{
                  x: eyePosition.x,
                  y: eyePosition.y
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 left-1 w-3 h-3 bg-gray-900 rounded-full"
              >
                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full opacity-80" />
              </motion.div>
            </div>
            
            {/* Mũi */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute bottom-7 left-1/2 -translate-x-1/2 w-5 h-4 bg-gray-900 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                    <Input
                      {...field}
                      type="email"
                      placeholder="Nhập email của bạn"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Mật khẩu</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu"
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-primary"
                    />
                  </FormControl>
                  <FormLabel className="text-white/80 cursor-pointer">
                    Ghi nhớ đăng nhập
                  </FormLabel>
                </FormItem>
              )}
            />
            <Link to="/forgot-password" className="text-white/80 hover:text-white text-sm">
              Quên mật khẩu?
            </Link>
          </div>

          {/* Login button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              className="w-full py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/30 transition-all group"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang đăng nhập...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Đăng nhập
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </motion.div>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg"
          >
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-xs font-medium">Kết nối được bảo mật SSL</span>
          </motion.div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-white/60">Hoặc đăng nhập với</span>
            </div>
          </div>

          {/* Social login */}
          <div className="grid grid-cols-1 gap-3">
            {/* Google Login */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="button"
                variant="outline"
                className="w-full py-5 bg-white/10 border-white/20 text-white hover:bg-gradient-to-r hover:from-primary/20 hover:to-purple-600/20 rounded-xl transition-all group"
                onClick={handleGoogleLogin}
              >
                <img src="/images/icons/google.png" alt="Icon Google" className='w-5 h-5 group-hover:scale-110 transition-transform' />
                <span className="font-semibold">Đăng nhập với Google</span>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="button"
                variant="outline"
                className="w-full py-5 bg-white/10 border-white/20 text-white hover:bg-gradient-to-r hover:from-primary/20 hover:to-purple-600/20 rounded-xl transition-all group"
                onClick={handleFacebookLogin}
              >
                <img src="/images/icons/facebook.png" alt="Icon Facebook" className='w-5 h-5 group-hover:scale-110 transition-transform' />
                <span className="font-semibold">Đăng nhập với Facebook</span>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="button"
                variant="outline"
                className="w-full py-5 bg-white/10 border-white/20 text-white hover:bg-gradient-to-r hover:from-primary/20 hover:to-purple-600/20 rounded-xl transition-all group"
                onClick={() => {
                  handleZaloLogin();
                }}
              >
                <img src="/images/icons/zalo.png" alt="Icon Zalo" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Đăng nhập với Zalo</span>
              </Button>
            </motion.div>
          </div>

          {/* Register link */}
          <div className="text-center">
            <p className="text-white/80">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-white hover:underline font-medium">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default Login;