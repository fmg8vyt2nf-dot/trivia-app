export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  500,    // Level 2
  1500,   // Level 3
  3000,   // Level 4
  5000,   // Level 5
  8000,   // Level 6
  12000,  // Level 7
  17000,  // Level 8
  23000,  // Level 9
  30000,  // Level 10 (max)
];

export const LEVEL_TITLES = [
  'Novice',
  'Learner',
  'Quizzer',
  'Scholar',
  'Expert',
  'Master',
  'Grandmaster',
  'Legend',
  'Mythic',
  'Trivia God',
];

export function getLevelFromXP(totalXP) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getLevelTitle(level) {
  return LEVEL_TITLES[level - 1] || LEVEL_TITLES[0];
}

export function getXPProgress(totalXP) {
  const level = getLevelFromXP(totalXP);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

  if (level >= LEVEL_THRESHOLDS.length) {
    return { current: totalXP - currentThreshold, needed: 0, percentage: 100 };
  }

  const xpInLevel = totalXP - currentThreshold;
  const xpNeeded = nextThreshold - currentThreshold;
  const percentage = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  return { current: xpInLevel, needed: xpNeeded, percentage };
}
