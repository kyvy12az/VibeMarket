import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const usePageLoading = (delay: number = 400) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [location.pathname, delay]);

  return isLoading;
};
