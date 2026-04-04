import { useMemo } from 'react';
import { useXP } from './useXP';
import { PERKS, isPerkUnlocked, isAvatarUnlocked, getPerkAdjustedPowerUps } from '../data/levelPerks';

export function usePerks() {
  const { level } = useXP();

  const unlockedPerks = useMemo(
    () => PERKS.filter(p => isPerkUnlocked(p.id, level)),
    [level]
  );

  const lockedPerks = useMemo(
    () => PERKS.filter(p => !isPerkUnlocked(p.id, level)),
    [level]
  );

  const checkPerk = (perkId) => isPerkUnlocked(perkId, level);
  const checkAvatar = (avatarId) => isAvatarUnlocked(avatarId, level);
  const adjustedPowerUps = useMemo(() => getPerkAdjustedPowerUps(level), [level]);

  const hasSpeedRound = isPerkUnlocked('speed_round', level);
  const hasDoubleDip = isPerkUnlocked('double_dip', level);
  const hasExtraFiftyFifty = isPerkUnlocked('extra_fifty_fifty', level);
  const hasCategoryBlitz = isPerkUnlocked('category_blitz', level);

  return {
    level,
    unlockedPerks,
    lockedPerks,
    checkPerk,
    checkAvatar,
    adjustedPowerUps,
    hasSpeedRound,
    hasDoubleDip,
    hasExtraFiftyFifty,
    hasCategoryBlitz,
  };
}
