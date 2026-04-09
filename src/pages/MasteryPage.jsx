import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCategoryMastery } from '../hooks/useCategoryMastery';
import { CATEGORIES } from '../data/categories';
import Card from '../components/ui/Card';
import MasteryStars from '../components/game/MasteryStars';
import Button from '../components/ui/Button';
import { useSwipeBack } from '../hooks/useSwipeBack';

export default function MasteryPage() {
  useSwipeBack();
  const { getAllMasteryEntries, getMastery } = useCategoryMastery();
  const entries = getAllMasteryEntries();

  // Build category lookup for icons
  const categoryIcons = {};
  CATEGORIES.forEach(c => {
    if (c.name !== 'Any Category') categoryIcons[c.name] = c.icon;
  });

  return (
    <div className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-3 text-center text-white/90"
      >
        Category Mastery
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center text-white/30 text-sm mb-10"
      >
        Track your performance across categories
      </motion.p>

      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-7xl mb-6 inline-block drop-shadow-[0_0_30px_rgba(14,165,233,0.3)]"
          >
            📊
          </motion.div>
          <h2 className="text-xl font-semibold text-white/80 mb-2">No stats yet</h2>
          <p className="text-white/35 mb-8 text-sm max-w-xs mx-auto">Answer at least 5 questions in a category to earn mastery stars and track your accuracy.</p>
          <Link to="/setup">
            <Button>Start Playing</Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Card className="!p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{categoryIcons[entry.name] || '📚'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm text-white/80 truncate">{entry.name}</h3>
                      <span className="text-sm font-bold text-primary-300">{entry.accuracy}%</span>
                    </div>
                    {entry.stars > 0 ? (
                      <MasteryStars stars={entry.stars} />
                    ) : (
                      <span className="text-[10px] text-white/25">Need {5 - entry.totalAnswers} more answers</span>
                    )}
                    <div className="flex gap-4 mt-2">
                      <span className="text-[10px] text-white/25">
                        {entry.correctAnswers}/{entry.totalAnswers} correct
                      </span>
                      <span className="text-[10px] text-white/25">
                        {entry.gamesPlayed} {entry.gamesPlayed === 1 ? 'game' : 'games'}
                      </span>
                    </div>
                    {/* Accuracy bar */}
                    <div className="h-1 bg-white/[0.06] rounded-full mt-2 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${entry.accuracy}%` }}
                        transition={{ duration: 0.8, delay: 0.1 * i }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
