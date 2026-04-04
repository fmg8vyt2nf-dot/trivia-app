import { BASE_POINTS, DIFFICULTY_MULTIPLIER, STREAK_MULTIPLIER, TIME_BONUS_MAX } from './constants';

export function calculatePoints({ difficulty, streak, timeRemaining, maxTime }) {
  const diffMult = DIFFICULTY_MULTIPLIER[difficulty] || 1;
  const streakMult = STREAK_MULTIPLIER[Math.min(streak, STREAK_MULTIPLIER.length - 1)];
  const timeBonus = maxTime > 0 ? Math.round((timeRemaining / maxTime) * TIME_BONUS_MAX) : 0;
  return Math.round(BASE_POINTS * diffMult * streakMult + timeBonus);
}
