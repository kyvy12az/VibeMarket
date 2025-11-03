import { useState, useEffect } from 'react';
import { Prize, SpinHistory, loadDailySpins, saveDailySpins, playSpinSound, playWinSound } from '@/lib/luckyWheelUtils';

export const useLuckyWheel = () => {
  const [spinsLeft, setSpinsLeft] = useState(10);
  const [history, setHistory] = useState<SpinHistory[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load từ localStorage khi mount
  useEffect(() => {
    const data = loadDailySpins();
    setSpinsLeft(data.spinsLeft);
    setHistory(data.history);
  }, []);

  // Reset daily spins vào 00:00 mỗi ngày
  useEffect(() => {
    const checkReset = () => {
      const lastReset = localStorage.getItem('lastResetDate');
      const today = new Date().toDateString();
      
      if (lastReset !== today) {
        setSpinsLeft(10);
        localStorage.setItem('lastResetDate', today);
        saveDailySpins({ spinsLeft: 10, history });
      }
    };
    
    checkReset();
    const interval = setInterval(checkReset, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [history]);

  const handleSpin = async (winningPrize: Prize) => {
    if (spinsLeft <= 0 || isSpinning) return;

    setIsSpinning(true);
    const newSpinsLeft = spinsLeft - 1;
    setSpinsLeft(newSpinsLeft);

    // Play spin sound
    playSpinSound();

    // Wait for animation to complete (4 seconds)
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Update state
    const newHistory: SpinHistory[] = [
      { prize: winningPrize, timestamp: Date.now() },
      ...history
    ].slice(0, 10); // Keep only 10 latest

    setHistory(newHistory);
    setCurrentPrize(winningPrize);
    setShowModal(true);
    setShowConfetti(true);
    setIsSpinning(false);

    // Play win sound
    playWinSound();

    // Save to localStorage
    saveDailySpins({ spinsLeft: newSpinsLeft, history: newHistory });

    // Hide confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000);

    // TODO: Integration with backend
    // POST /api/lucky-wheel/spin
    // - Verify user có đủ lượt quay
    // - Random prize từ server (prevent client manipulation)
    // - Save history vào database
    // - Cấp thưởng tự động vào tài khoản
  };

  const resetSpins = (count = 10) => {
    setSpinsLeft(count);
    setHistory([]); // optional: clear history
    saveDailySpins({ spinsLeft: count, history: [] });
    localStorage.setItem('lastResetDate', new Date().toDateString());
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
    resetSpins, // <-- expose reset
  };
};
