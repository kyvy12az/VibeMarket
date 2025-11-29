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
        saveDailySpins({ spinsLeft: 10, history: [] });
        setHistory([]); // Clear history on new day
      }
    };
    
    checkReset();
    const interval = setInterval(checkReset, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  // Auto-save whenever spinsLeft or history changes
  useEffect(() => {
    if (spinsLeft !== null && history !== null) {
      saveDailySpins({ spinsLeft, history });
    }
  }, [spinsLeft, history]);

  const handleSpin = async (winningPrize: Prize) => {
    if (spinsLeft <= 0 || isSpinning) return;

    setIsSpinning(true);

    // Play spin sound
    playSpinSound();

    // Wait for wheel animation to complete (4.5 seconds)
    // await new Promise(resolve => setTimeout(resolve, 4500));

    // Decrease spins
    const newSpinsLeft = spinsLeft - 1;
    setSpinsLeft(newSpinsLeft);

    // Update history
    const newHistoryItem: SpinHistory = { 
      prize: winningPrize, 
      timestamp: Date.now() 
    };
    const newHistory = [newHistoryItem, ...history].slice(0, 50); // Keep 50 latest
    setHistory(newHistory);

    // Update state
    setCurrentPrize(winningPrize);
    setShowModal(true);
    setShowConfetti(true);
    setIsSpinning(false);

    // Play win sound
    playWinSound();

    // Save to localStorage (will be auto-saved by useEffect, but we can force it here too)
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
  };
};