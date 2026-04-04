import { getLevelFromXP } from '../utils/xpLevels';
import { LEVEL_TITLES } from '../utils/xpLevels';

// Perk registry — single source of truth for all level-gated features
export const PERKS = [
  {
    id: 'streak_shield',
    name: 'Streak Shield',
    description: 'Protect your streak once per game when you answer wrong',
    unlockLevel: 2,
    unlockTitle: 'Learner',
    icon: '🛡️',
    type: 'passive_powerup',
  },
  {
    id: 'extra_fifty_fifty',
    name: 'Extra 50/50',
    description: 'Get 2 uses of 50/50 per game instead of 1',
    unlockLevel: 3,
    unlockTitle: 'Quizzer',
    icon: '✂️',
    type: 'powerup_upgrade',
  },
  {
    id: 'speed_round',
    name: 'Speed Round',
    description: '5s timer, 2× points multiplier',
    unlockLevel: 4,
    unlockTitle: 'Scholar',
    icon: '⚡',
    type: 'game_mode',
  },
  {
    id: 'category_blitz',
    name: 'Category Blitz',
    description: 'Random categories every few questions',
    unlockLevel: 7,
    unlockTitle: 'Grandmaster',
    icon: '🌀',
    type: 'game_mode',
  },
  {
    id: 'double_dip',
    name: 'Double Dip',
    description: 'Pick two answers — if either is correct, you get it right (50% points)',
    unlockLevel: 5,
    unlockTitle: 'Expert',
    icon: '🎯',
    type: 'new_powerup',
  },
  {
    id: 'locked_avatar_dragon',
    name: 'Dragon Avatar',
    description: 'Unlock the Dragon avatar',
    unlockLevel: 4,
    unlockTitle: 'Scholar',
    icon: '🐲',
    type: 'avatar_lock',
    avatarId: 'dragon',
  },
  {
    id: 'locked_avatar_unicorn',
    name: 'Unicorn Avatar',
    description: 'Unlock the Unicorn avatar',
    unlockLevel: 6,
    unlockTitle: 'Master',
    icon: '🦄',
    type: 'avatar_lock',
    avatarId: 'unicorn',
  },
  {
    id: 'locked_avatar_alien',
    name: 'Alien Avatar',
    description: 'Unlock the Alien avatar',
    unlockLevel: 8,
    unlockTitle: 'Legend',
    icon: '👽',
    type: 'avatar_lock',
    avatarId: 'alien',
  },
  {
    id: 'theme_ocean_blue',
    name: 'Ocean Blue Theme',
    description: 'Unlock the Ocean Blue color scheme',
    unlockLevel: 2,
    unlockTitle: 'Learner',
    icon: '🌊',
    type: 'theme_lock',
    themeId: 'ocean_blue',
  },
  {
    id: 'theme_neon_green',
    name: 'Neon Green Theme',
    description: 'Unlock the Neon Green color scheme',
    unlockLevel: 7,
    unlockTitle: 'Grandmaster',
    icon: '💚',
    type: 'theme_lock',
    themeId: 'neon_green',
  },
  {
    id: 'theme_purple_galaxy',
    name: 'Purple Galaxy Theme',
    description: 'Unlock the Purple Galaxy color scheme',
    unlockLevel: 9,
    unlockTitle: 'Champion',
    icon: '🔮',
    type: 'theme_lock',
    themeId: 'purple_galaxy',
  },
];

// Quick lookup: avatarId → required level
export const LOCKED_AVATARS = Object.fromEntries(
  PERKS.filter(p => p.type === 'avatar_lock').map(p => [p.avatarId, p.unlockLevel])
);

/**
 * Pure function that reads localStorage directly (no hook needed).
 * Safe to call from reducer action payloads, callbacks, or components.
 */
export function getPlayerLevel() {
  try {
    const raw = localStorage.getItem('trivia_xp');
    if (!raw) return 1;
    const data = JSON.parse(raw);
    return getLevelFromXP(data.totalXP || 0);
  } catch {
    return 1;
  }
}

/** Check if a specific perk is unlocked */
export function isPerkUnlocked(perkId, level = null) {
  const playerLevel = level ?? getPlayerLevel();
  const perk = PERKS.find(p => p.id === perkId);
  return perk ? playerLevel >= perk.unlockLevel : false;
}

/** Check if an avatar is unlocked (returns true for non-locked avatars) */
export function isAvatarUnlocked(avatarId, level = null) {
  const playerLevel = level ?? getPlayerLevel();
  const requiredLevel = LOCKED_AVATARS[avatarId];
  if (requiredLevel === undefined) return true; // not locked
  return playerLevel >= requiredLevel;
}

/** Get all perks that unlock at a specific level (returns empty array if none) */
export function getPerksForLevel(level) {
  return PERKS.filter((p) => p.unlockLevel === level);
}

/** Get initial power-up counts adjusted for player level */
export function getPerkAdjustedPowerUps(level = null) {
  const playerLevel = level ?? getPlayerLevel();
  return {
    fiftyFifty: playerLevel >= 3 ? 2 : 1,
    skip: 1,
    extraTime: 1,
    categoryHint: 1,
    doubleDip: playerLevel >= 5 ? 1 : 0,
    audiencePoll: 1,
  };
}
