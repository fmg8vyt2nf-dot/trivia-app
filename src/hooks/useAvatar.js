import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { AVATARS } from '../data/avatars';
import { isAvatarUnlocked } from '../data/levelPerks';

export function useAvatar() {
  const [data, setData] = useLocalStorage('trivia_avatar', { selectedAvatar: 'fox' });

  const rawAvatar = AVATARS.find(a => a.id === data.selectedAvatar) || AVATARS[0];
  // Guard: fall back to Fox if selected avatar is locked (e.g. after data reset)
  const selectedAvatar = isAvatarUnlocked(rawAvatar.id) ? rawAvatar : AVATARS[0];

  const setAvatar = useCallback((id) => {
    if (!isAvatarUnlocked(id)) return; // silently reject locked avatars
    setData({ selectedAvatar: id });
  }, [setData]);

  return {
    selectedAvatar,
    setAvatar,
    avatars: AVATARS,
  };
}
