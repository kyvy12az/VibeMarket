import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Chrome, Facebook, Twitter } from 'lucide-react';
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
  const { login, isLoading, googleLogin } = useAuth();
  const navigate = useNavigate();

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
          <Button
            type="submit"
            className="w-full bg-white text-primary hover:bg-white/90 font-medium"
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>

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
            <Button
              type="button"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={handleGoogleLogin}
            >
              <img src="/images/icons/google.png" alt="Icon Google" className='w-5 h-5' />
              Đăng nhập với Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={handleFacebookLogin}
            >
              <img src="/images/icons/facebook.png" alt="Icon Facebook" className='w-5 h-5' />
              Đăng nhập với Facebook
            </Button>
            <Button
              type="button"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => {
                handleZaloLogin();
              }}
            >
              <img src="/images/icons/zalo.png" alt="Icon Zalo" className="w-5 h-5" />
              Đăng nhập với Zalo
            </Button>
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