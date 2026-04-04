import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSound } from '../../hooks/useSound';

export default function Header() {
  const location = useLocation();
  const isPlaying = location.pathname === '/play';
  const { soundEnabled, toggleSound } = useSound();

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="flex items-center justify-between px-5 py-4 md:px-8 md:py-5 bg-white/[0.03] backdrop-blur-xl border-b border-white/[0.06]"
    >
      <Link to="/" className="flex items-center gap-2.5 text-lg font-bold text-white/90 hover:text-white transition-colors">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white font-extrabold text-sm shadow-[0_0_12px_rgba(255,107,53,0.4)]">
          ?
        </div>
        <span className="hidden sm:inline tracking-tight">Trivia</span>
      </Link>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSound}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all cursor-pointer"
          title={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
        >
          <span className="text-sm">{soundEnabled ? '🔊' : '🔇'}</span>
        </button>
        {!isPlaying && (
          <nav className="flex gap-4 md:gap-6">
            <Link
              to="/mastery"
              className="text-sm text-white/40 hover:text-white/90 transition-colors font-medium"
            >
              Mastery
            </Link>
            <Link
              to="/leaderboard"
              className="text-sm text-white/40 hover:text-white/90 transition-colors font-medium"
            >
              Leaderboard
            </Link>
            <Link
              to="/settings"
              className="text-sm text-white/40 hover:text-white/90 transition-colors font-medium"
            >
              Settings
            </Link>
          </nav>
        )}
      </div>
    </motion.header>
  );
}
