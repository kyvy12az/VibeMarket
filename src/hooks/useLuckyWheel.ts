import { useState, useEffect } from 'react';
import { Prize, SpinHistory, loadDailySpins, saveDailySpins, playSpinSound, playWinSound } from '@/lib/luckyWheelUtils';

export const useLuckyWheel = () => {
  const [spinsLeft, setSpinsLeft] = useState(1);
  const [history, setHistory] = useState<SpinHistory[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [voucherCode, setVoucherCode] = useState<string | null>(null);
  const [voucherExpiry, setVoucherExpiry] = useState<string | null>(null);

  // Get authentication token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('vibeventure_token');
  };

  // Fetch spins remaining from backend
  const fetchSpinsRemaining = async () => {
    const token = getAuthToken();
    if (!token) {
      console.log('No token found, using localStorage fallback');
      const data = loadDailySpins();
      setSpinsLeft(data.spinsLeft);
      setHistory(data.history);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/lucky_wheel/get_spins.php`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setSpinsLeft(result.data.spins_remaining);
      } else {
        console.error('Failed to fetch spins:', result.message);
        // Fallback to localStorage
        const data = loadDailySpins();
        setSpinsLeft(data.spinsLeft);
      }
    } catch (error) {
      console.error('Error fetching spins:', error);
      // Fallback to localStorage
      const data = loadDailySpins();
      setSpinsLeft(data.spinsLeft);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch spin history from backend
  const fetchSpinHistory = async () => {
    const token = getAuthToken();
    if (!token) {
      const data = loadDailySpins();
      setHistory(data.history);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/lucky_wheel/get_history.php?limit=50`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setHistory(result.data.history);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchSpinsRemaining();
    fetchSpinHistory();
  }, []);

  const handleSpin = async (winningPrize: Prize) => {
    if (spinsLeft <= 0 || isSpinning) return;

    setIsSpinning(true);
    playSpinSound();

    const token = getAuthToken();
    
    if (token) {
      // Backend-integrated spin
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/lucky_wheel/spin.php`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();

        if (result.success) {
          const backendPrize = result.data.prize;
          const newSpinsLeft = result.data.spins_remaining;
          
          setSpinsLeft(newSpinsLeft);
          setCurrentPrize(backendPrize);
          
          // Save voucher code and expiry if available
          if (result.data.voucher_code) {
            setVoucherCode(result.data.voucher_code);
            setVoucherExpiry(result.data.expires_at);
          } else {
            setVoucherCode(null);
            setVoucherExpiry(null);
          }
          
          setShowModal(true);
          setShowConfetti(true);
          setIsSpinning(false);
          
          playWinSound();
          
          // Refresh history
          fetchSpinHistory();
          
          setTimeout(() => setShowConfetti(false), 5000);
        } else {
          console.error('Spin failed:', result.message);
          setIsSpinning(false);
          alert(result.message || 'Có lỗi xảy ra khi quay');
        }
      } catch (error) {
        console.error('Error spinning:', error);
        setIsSpinning(false);
        alert('Không thể kết nối tới server');
      }
    } else {
      // Fallback to localStorage-based spin (for users not logged in)
      const newSpinsLeft = spinsLeft - 1;
      setSpinsLeft(newSpinsLeft);

      const newHistoryItem: SpinHistory = { 
        prize: winningPrize, 
        timestamp: Date.now() 
      };
      const newHistory = [newHistoryItem, ...history].slice(0, 50);
      setHistory(newHistory);

      setCurrentPrize(winningPrize);
      setShowModal(true);
      setShowConfetti(true);
      setIsSpinning(false);
      setVoucherCode(null);
      setVoucherExpiry(null);

      playWinSound();
      saveDailySpins({ spinsLeft: newSpinsLeft, history: newHistory });

      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const resetSpins = (count = 1) => {
    setSpinsLeft(count);
    saveDailySpins({ spinsLeft: count, history });
    localStorage.setItem('lastResetDate', new Date().toDateString());
  };

  const clearHistory = () => {
    setHistory([]);
    saveDailySpins({ spinsLeft, history: [] });
  };

  return {
    spinsLeft,
    history,
    isSpinning,
    showModal,
    setShowModal,
    currentPrize,
    showConfetti,
    handleSpin,
    resetSpins,
    clearHistory,
    isLoading,
    refreshSpins: fetchSpinsRemaining,
    refreshHistory: fetchSpinHistory,
    voucherCode,
    voucherExpiry
  };
};