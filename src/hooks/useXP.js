import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getLevelFromXP, getLevelTitle, getXPProgress } from '../utils/xpLevels';

const DEFAULT_XP = { totalXP: 0 };

export function useXP() {
  const [xpData, setXPData] = useLocalStorage('trivia_xp', DEFAULT_XP);

  const totalXP = xpData.totalXP || 0;
  const level = getLevelFromXP(totalXP);
  const levelTitle = getLevelTitle(level);
  const xpProgress = getXPProgress(totalXP);

  const addXP = useCallback((amount) => {
    setXPData(prev => {
      const newTotal = (prev.totalXP || 0) + amount;
      return { totalXP: newTotal };
    });
    const prevLevel = getLevelFromXP(totalXP);
    const newLevel = getLevelFromXP(totalXP + amount);
    return { leveledUp: newLevel > prevLevel, newLevel, prevLevel };
  }, [setXPData, totalXP]);

  return {
    totalXP,
    level,
    levelTitle,
    xpProgress,
    addXP,
  };
}
