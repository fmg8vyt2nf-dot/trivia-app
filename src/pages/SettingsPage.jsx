import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSound } from '../hooks/useSound';
import { useAvatar } from '../hooks/useAvatar';
import { useXP } from '../hooks/useXP';
import { useTheme } from '../context/ThemeContext';
import AvatarPicker from '../components/game/AvatarPicker';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { useSwipeBack } from '../hooks/useSwipeBack';

export default function SettingsPage() {
  useSwipeBack();
  const [settings, setSettings] = useLocalStorage('trivia_settings', {
    timerEnabled: true,
    soundEnabled: true,
    volume: 0.5,
    musicEnabled: false,
  });
  const [showResetModal, setShowResetModal] = useState(false);
  const { soundEnabled, volume, musicEnabled, toggleSound, setVolume, toggleMusic } = useSound();
  const { selectedAvatar, setAvatar } = useAvatar();
  const { level } = useXP();
  const { activeTheme, setTheme, availableThemes, lockedThemes, selectedId } = useTheme();

  function toggleSetting(key) {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handleReset() {
    localStorage.removeItem('trivia_leaderboard');
    localStorage.removeItem('trivia_stats');
    localStorage.removeItem('trivia_settings');
    localStorage.removeItem('trivia_xp');
    localStorage.removeItem('trivia_mastery');
    localStorage.removeItem('trivia_avatar');
    localStorage.removeItem('trivia_daily');
    localStorage.removeItem('trivia_seen_questions');
    sessionStorage.removeItem('trivia_token');
    setShowResetModal(false);
    window.location.reload();
  }

  return (
    <div className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-10 text-center text-white/90"
      >
        Settings
      </motion.h1>

      <div className="space-y-3 mb-10">
        <Card className="flex items-center justify-between">
          <div>
            <div className="font-medium text-sm text-white/80">Timer</div>
            <div className="text-[11px] text-white/25 mt-0.5">Countdown timer for each question</div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className={`text-[10px] font-semibold uppercase tracking-wider w-6 text-right ${settings.timerEnabled ? 'text-primary-300' : 'text-white/30'}`}>
              {settings.timerEnabled ? 'On' : 'Off'}
            </span>
            <button
              role="switch"
              aria-checked={settings.timerEnabled}
              aria-label="Timer"
              onClick={() => toggleSetting('timerEnabled')}
              className={`w-11 h-6 rounded-full transition-all duration-200 cursor-pointer ${
                settings.timerEnabled ? 'bg-primary-500 shadow-[0_0_12px_rgba(255,107,53,0.3)]' : 'bg-white/10'
              }`}
            >
              <motion.div
                className="w-4.5 h-4.5 bg-white rounded-full shadow-sm"
                animate={{ x: settings.timerEnabled ? 22 : 3 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <div className="font-medium text-sm text-white/80">Sound Effects</div>
            <div className="text-[11px] text-white/25 mt-0.5">Play sounds for correct/wrong answers</div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className={`text-[10px] font-semibold uppercase tracking-wider w-6 text-right ${soundEnabled ? 'text-primary-300' : 'text-white/30'}`}>
              {soundEnabled ? 'On' : 'Off'}
            </span>
            <button
              role="switch"
              aria-checked={soundEnabled}
              aria-label="Sound Effects"
              onClick={toggleSound}
              className={`w-11 h-6 rounded-full transition-all duration-200 cursor-pointer ${
                soundEnabled ? 'bg-primary-500 shadow-[0_0_12px_rgba(255,107,53,0.3)]' : 'bg-white/10'
              }`}
            >
              <motion.div
                className="w-4.5 h-4.5 bg-white rounded-full shadow-sm"
                animate={{ x: soundEnabled ? 22 : 3 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </Card>

        {/* Volume Slider */}
        {soundEnabled && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            <Card>
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-sm text-white/80">Volume</div>
                <span className="text-xs text-white/40">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(volume * 100)}
                onChange={e => setVolume(Number(e.target.value) / 100)}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 accent-primary-500"
              />
            </Card>
          </motion.div>
        )}

        <Card className="flex items-center justify-between">
          <div>
            <div className="font-medium text-sm text-white/80">Background Music</div>
            <div className="text-[11px] text-white/25 mt-0.5">Ambient music during gameplay</div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className={`text-[10px] font-semibold uppercase tracking-wider w-6 text-right ${musicEnabled && soundEnabled ? 'text-primary-300' : 'text-white/30'}`}>
              {musicEnabled && soundEnabled ? 'On' : 'Off'}
            </span>
            <button
              role="switch"
              aria-checked={musicEnabled && soundEnabled}
              aria-label="Background Music"
              onClick={toggleMusic}
              className={`w-11 h-6 rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                musicEnabled && soundEnabled ? 'bg-primary-500 shadow-[0_0_12px_rgba(255,107,53,0.3)]' : 'bg-white/10'
              }`}
              disabled={!soundEnabled}
            >
              <motion.div
                className="w-4.5 h-4.5 bg-white rounded-full shadow-sm"
                animate={{ x: musicEnabled && soundEnabled ? 22 : 3 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </Card>
      </div>

      {/* Theme Picker */}
      <div className="mb-10">
        <h2 className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-semibold mb-4">Theme</h2>
        <Card>
          <div className="grid grid-cols-4 gap-2">
            {availableThemes.map(theme => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id === 'default' ? null : theme.id)}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-lg transition-all cursor-pointer ${
                  activeTheme.id === theme.id
                    ? 'bg-white/10 ring-1 ring-white/20 shadow-[0_0_12px_rgba(255,255,255,0.05)]'
                    : 'bg-white/[0.03] hover:bg-white/[0.06]'
                }`}
              >
                <span className="text-xl">{theme.icon}</span>
                <span className="text-[9px] text-white/50 leading-tight text-center">{theme.name}</span>
                {theme.seasonal && <span className="text-[8px] text-accent/60">seasonal</span>}
              </button>
            ))}
            {lockedThemes.map(theme => (
              <div
                key={theme.id}
                className="flex flex-col items-center gap-1 p-2.5 rounded-lg bg-white/[0.02] opacity-40"
              >
                <span className="text-xl grayscale">🔒</span>
                <span className="text-[9px] text-white/30 leading-tight text-center">{theme.name}</span>
                <span className="text-[8px] text-white/20">Lv {theme.unlockLevel}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Avatar Picker */}
      <div className="mb-10">
        <h2 className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-semibold mb-4">Choose Avatar</h2>
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{selectedAvatar.emoji}</span>
            <div>
              <div className="text-sm font-medium text-white/80">{selectedAvatar.name}</div>
              <div className="text-[10px] text-white/30">Your game avatar</div>
            </div>
          </div>
          <AvatarPicker selectedId={selectedAvatar.id} onSelect={setAvatar} playerLevel={level} />
        </Card>
      </div>

      <div className="text-center">
        <Button variant="danger" onClick={() => setShowResetModal(true)}>
          Reset All Data
        </Button>
      </div>

      <Modal isOpen={showResetModal} onClose={() => setShowResetModal(false)} title="Reset All Data">
        <p className="text-white/40 mb-6 text-sm">This will clear your leaderboard, stats, and settings. Are you sure?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setShowResetModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleReset}>Reset</Button>
        </div>
      </Modal>
    </div>
  );
}
