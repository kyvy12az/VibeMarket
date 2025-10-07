import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ZaloCallback = () => {
  const [params] = useSearchParams();
  const { zaloLogin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const code = params.get("code");
    if (code) {
      zaloLogin(code).then((ok) => {
        navigate(ok ? "/" : "/login");
      });
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex min-h-[100vh] items-center justify-center">
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 flex items-center justify-center">
                <img src="/images/icons/zalo.png" alt="Logo" className="w-10 h-10" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-gray-300 border-t-transparent animate-spin"></div>
            </div>
            <span className="mt-4 text-sm text-gray-500 animate-pulse">
              Đang xác thực với Zalo...
            </span>
          </div>
        </div>
      )}
      {!isLoading && error && (
        <div className='flex flex-col items-center'>
          <div className="mb-4 p-4 bg-error-50 text-error-700 rounded-lg text-sm">
            {error}
          </div>
          <button onClick={() => (navigate('/login', { replace: true }))} className='mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg'>
            Thử lại
          </button>
        </div>
      )}
    </div>
  );
};

export default ZaloCallback;