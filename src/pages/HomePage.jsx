import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import XPBar from '../components/ui/XPBar';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useXP } from '../hooks/useXP';

export default function HomePage() {
  const [stats] = useLocalStorage('trivia_stats', { gamesPlayed: 0, questionsAnswered: 0 });
  const { totalXP, level, levelTitle, xpProgress } = useXP();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center relative">
      {/* Decorative glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary-500/[0.08] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/[0.06] rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent flex items-center justify-center shadow-[0_0_40px_rgba(255,107,53,0.4)] border border-white/10">
          <span className="text-white font-extrabold text-4xl md:text-5xl drop-shadow-lg">?</span>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-5xl md:text-7xl font-bold mb-4 tracking-tight bg-gradient-to-r from-primary-300 via-accent-light to-primary-400 bg-clip-text text-transparent"
      >
        Trivia
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-white/35 text-base md:text-lg mb-8 max-w-sm leading-relaxed"
      >
        Test your knowledge. Build streaks. Climb the leaderboard.
      </motion.p>

      {/* XP Level Badge */}
      {totalXP > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full max-w-xs mb-8"
        >
          <XPBar level={level} levelTitle={levelTitle} xpProgress={xpProgress} />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 mb-12"
      >
        <Link to="/setup">
          <Button size="lg">Start Game</Button>
        </Link>
        <Link to="/daily">
          <Button variant="secondary" size="lg">Daily Challenge</Button>
        </Link>
        <Link to="/leaderboard">
          <Button variant="secondary" size="lg">Leaderboard</Button>
        </Link>
        <Link to="/recap">
          <Button variant="secondary" size="lg">Weekly Recap</Button>
        </Link>
      </motion.div>

      {stats.gamesPlayed > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-8 text-center"
        >
          <div>
            <div className="text-2xl font-bold text-white/80">{stats.gamesPlayed}</div>
            <div className="text-[10px] text-white/20 uppercase tracking-widest mt-1">Games</div>
          </div>
          <div className="w-px bg-white/[0.06]" />
          <div>
            <div className="text-2xl font-bold text-white/80">{stats.questionsAnswered}</div>
            <div className="text-[10px] text-white/20 uppercase tracking-widest mt-1">Questions</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
