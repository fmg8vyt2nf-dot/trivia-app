import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { AVATARS } from '../data/avatars';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { useSwipeBack } from '../hooks/useSwipeBack';

const rankColors = ['text-amber-400', 'text-gray-300', 'text-amber-600'];

export default function LeaderboardPage() {
  useSwipeBack();
  const { entries, clearLeaderboard } = useLeaderboard();
  const [showClearModal, setShowClearModal] = useState(false);

  function handleClear() {
    clearLeaderboard();
    setShowClearModal(false);
  }

  return (
    <div className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-10 text-center text-white/90"
      >
        Leaderboard
      </motion.h1>

      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-7xl mb-6 inline-block drop-shadow-[0_0_30px_rgba(245,158,11,0.3)]"
          >
            🏆
          </motion.div>
          <h2 className="text-xl font-semibold text-white/80 mb-2">No scores yet</h2>
          <p className="text-white/35 mb-8 text-sm max-w-xs mx-auto">Play your first game to claim the top spot on the leaderboard.</p>
          <Link to="/setup">
            <Button>Start Playing</Button>
          </Link>
        </motion.div>
      ) : (
        <>
          <div className="space-y-2.5 mb-10">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="!p-4 flex items-center gap-4">
                  <span className={`text-xl font-bold w-8 text-center ${rankColors[i] || 'text-white/20'}`}>
                    {i + 1}
                  </span>
                  <span className="text-xl">{entry.avatar ? (AVATARS.find(a => a.id === entry.avatar)?.emoji || '👤') : '👤'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate text-white/85 text-sm">{entry.name}</div>
                    <div className="text-[10px] text-white/40 mt-0.5">
                      {entry.category} &middot; {entry.difficulty} &middot; {entry.correctCount}/{entry.totalQuestions}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-300">{entry.score}</div>
                    <div className="text-[10px] text-white/20">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <Link to="/setup">
              <Button>Play Again</Button>
            </Link>
            <Button variant="danger" onClick={() => setShowClearModal(true)}>
              Clear All
            </Button>
          </div>
        </>
      )}

      <Modal isOpen={showClearModal} onClose={() => setShowClearModal(false)} title="Clear Leaderboard">
        <p className="text-white/50 mb-6 text-sm">Are you sure? This cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setShowClearModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleClear}>Clear</Button>
        </div>
      </Modal>
    </div>
  );
}
