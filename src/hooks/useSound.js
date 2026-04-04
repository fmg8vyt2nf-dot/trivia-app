import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { soundManager } from '../services/soundManager';

export function useSound() {
  const [settings, setSettings] = useLocalStorage('trivia_settings', {
    timerEnabled: true,
    soundEnabled: true,
    volume: 0.5,
    musicEnabled: false,
  });

  const soundEnabled = settings.soundEnabled ?? true;
  const vol = settings.volume ?? 0.5;
  const musicEnabled = settings.musicEnabled ?? false;

  // Sync soundManager with settings
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
    soundManager.setVolume(vol);
  }, [soundEnabled, vol]);

  // Handle background music
  useEffect(() => {
    if (musicEnabled && soundEnabled) {
      soundManager.startMusic();
    } else {
      soundManager.stopMusic();
    }
    return () => soundManager.stopMusic();
  }, [musicEnabled, soundEnabled]);

  const playSound = useCallback((name) => {
    soundManager.play(name);
  }, []);

  const toggleSound = useCallback(() => {
    setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, [setSettings]);

  const setVolume = useCallback((v) => {
    setSettings(prev => ({ ...prev, volume: v }));
  }, [setSettings]);

  const toggleMusic = useCallback(() => {
    setSettings(prev => ({ ...prev, musicEnabled: !prev.musicEnabled }));
  }, [setSettings]);

  return {
    playSound,
    toggleSound,
    setVolume,
    toggleMusic,
    soundEnabled,
    volume: vol,
    musicEnabled,
  };
}
