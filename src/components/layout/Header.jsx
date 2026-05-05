import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSound } from '../../hooks/useSound';

export default function Header() {
  const location = useLocation();
  const isPlaying = location.pathname === '/play';
  const { soundEnabled, toggleSound } = useSound();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 30);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isPlaying) return null;

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-40 flex items-center justify-between px-3 sm:px-5 md:px-8 bg-white/[0.03] backdrop-blur-xl border-b border-white/[0.06] transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-4 md:py-5'
      }`}
    >
      <Link to="/" className="flex items-center gap-2.5 text-lg font-bold text-white/90 hover:text-white transition-colors">
        <div className={`rounded-lg bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white font-extrabold shadow-[0_0_12px_rgba(255,107,53,0.4)] transition-all duration-300 ${
          scrolled ? 'w-6 h-6 text-xs' : 'w-7 h-7 text-sm'
        }`}>
          ?
        </div>
        <span className="hidden lg:inline tracking-tight">Trivia</span>
      </Link>
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleSound}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
          title={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
        >
          <span className="text-sm">{soundEnabled ? '🔊' : '🔇'}</span>
        </button>
        {!isPlaying && (
          <nav className="flex gap-3 md:gap-6 items-center">
            <Link
              to="/mastery"
              className="text-sm text-white/40 hover:text-white/90 transition-colors font-medium focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2 rounded"
              title="Mastery"
            >
              <span className="lg:hidden text-lg">⭐</span>
              <span className="hidden lg:inline">Mastery</span>
            </Link>
            <Link
              to="/leaderboard"
              className="text-sm text-white/40 hover:text-white/90 transition-colors font-medium focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2 rounded"
              title="Leaderboard"
            >
              <span className="lg:hidden text-lg">🏆</span>
              <span className="hidden lg:inline">Leaderboard</span>
            </Link>
            <Link
              to="/settings"
              className="text-sm text-white/40 hover:text-white/90 transition-colors font-medium focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2 rounded"
              title="Settings"
            >
              <span className="lg:hidden text-lg">⚙️</span>
              <span className="hidden lg:inline">Settings</span>
            </Link>
          </nav>
        )}
      </div>
    </motion.header>
  );
}
