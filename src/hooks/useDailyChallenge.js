import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { questions } from '../data/fallbackQuestions';
import { seededShuffle } from '../utils/seededRandom';
import { shuffle } from '../utils/shuffle';

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function useDailyChallenge() {
  const [dailyData, setDailyData] = useLocalStorage('trivia_daily', {});
  const todayKey = getTodayKey();
  const hasPlayedToday = !!dailyData[todayKey]?.completed;
  const todayResult = dailyData[todayKey] || null;

  const getDailyQuestions = useCallback(() => {
    // Use today's date as seed for deterministic selection
    const shuffled = seededShuffle(questions, todayKey);

    // Pick 10 questions — mix of difficulties
    const selected = shuffled.slice(0, 10);

    // Normalize questions for gameplay
    return selected.map((q, i) => ({
      id: `daily-${todayKey}-${i}`,
      category: q.category,
      difficulty: q.difficulty,
      question: q.question,
      correctAnswer: q.correctAnswer,
      allAnswers: shuffle([q.correctAnswer, ...q.incorrectAnswers]),
    }));
  }, [todayKey]);

  const saveDailyResult = useCallback((result) => {
    setDailyData(prev => {
      const updated = { ...prev };
      updated[todayKey] = {
        completed: true,
        score: result.score,
        correctCount: result.correctCount,
        totalQuestions: result.totalQuestions,
        accuracy: result.accuracy,
        longestStreak: result.longestStreak,
        completedAt: new Date().toISOString(),
      };

      // Prune entries older than 30 days
      const keys = Object.keys(updated);
      if (keys.length > 30) {
        const sorted = keys.sort();
        sorted.slice(0, keys.length - 30).forEach(k => delete updated[k]);
      }

      return updated;
    });
  }, [setDailyData, todayKey]);

  // Calculate daily streak (consecutive days played)
  const streak = useMemo(() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (dailyData[key]?.completed) {
        count++;
      } else if (i > 0) {
        break; // Don't count today if not played yet, but don't break streak
      } else {
        // Today not played yet — check if yesterday was played
        continue;
      }
    }
    return count;
  }, [dailyData]);

  // History (last 30 days)
  const history = useMemo(() => {
    return Object.entries(dailyData)
      .filter(([, v]) => v.completed)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [dailyData]);

  return {
    todayKey,
    hasPlayedToday,
    todayResult,
    getDailyQuestions,
    saveDailyResult,
    streak,
    history,
  };
}
