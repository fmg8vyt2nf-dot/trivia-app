import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useCategoryMastery() {
  const [masteryData, setMasteryData] = useLocalStorage('trivia_mastery', {});

  const getMastery = useCallback((categoryName) => {
    const data = masteryData[categoryName];
    if (!data) return null;
    const accuracy = data.totalAnswers > 0 ? Math.round((data.correctAnswers / data.totalAnswers) * 100) : 0;
    let stars = 0;
    if (data.totalAnswers >= 5) {
      if (accuracy >= 90) stars = 5;
      else if (accuracy >= 75) stars = 4;
      else if (accuracy >= 60) stars = 3;
      else if (accuracy >= 40) stars = 2;
      else stars = 1;
    }
    return { ...data, accuracy, stars };
  }, [masteryData]);

  const updateMastery = useCallback((categoryName, correctCount, totalCount) => {
    if (!categoryName) return;
    setMasteryData(prev => {
      const existing = prev[categoryName] || { gamesPlayed: 0, correctAnswers: 0, totalAnswers: 0 };
      return {
        ...prev,
        [categoryName]: {
          gamesPlayed: existing.gamesPlayed + 1,
          correctAnswers: existing.correctAnswers + correctCount,
          totalAnswers: existing.totalAnswers + totalCount,
        },
      };
    });
  }, [setMasteryData]);

  const getAllMasteryEntries = useCallback(() => {
    return Object.entries(masteryData)
      .map(([name, data]) => {
        const accuracy = data.totalAnswers > 0 ? Math.round((data.correctAnswers / data.totalAnswers) * 100) : 0;
        let stars = 0;
        if (data.totalAnswers >= 5) {
          if (accuracy >= 90) stars = 5;
          else if (accuracy >= 75) stars = 4;
          else if (accuracy >= 60) stars = 3;
          else if (accuracy >= 40) stars = 2;
          else stars = 1;
        }
        return { name, ...data, accuracy, stars };
      })
      .sort((a, b) => b.accuracy - a.accuracy);
  }, [masteryData]);

  return { masteryData, getMastery, updateMastery, getAllMasteryEntries };
}
