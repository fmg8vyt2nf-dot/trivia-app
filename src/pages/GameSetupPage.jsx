import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { CATEGORIES } from '../data/categories';
import { DIFFICULTIES, QUESTION_COUNTS, TIMER_DURATION, SPEED_ROUND_TIMER } from '../utils/constants';
import { useTrivia } from '../hooks/useTrivia';
import { usePerks } from '../hooks/usePerks';
import { useCategoryMastery } from '../hooks/useCategoryMastery';
import { CATEGORY_NAME_MAP } from '../data/fallbackQuestions';
import MasteryStars from '../components/game/MasteryStars';

export default function GameSetupPage() {
  const navigate = useNavigate();
  const { startGame, startSpeedRound, startCategoryBlitz } = useTrivia();
  const { hasSpeedRound, hasCategoryBlitz, level } = usePerks();
  const { getMastery } = useCategoryMastery();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [selectedCount, setSelectedCount] = useState(10);
  const [gameMode, setGameMode] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isSpeed = gameMode === 'speed';
  const isBlitz = gameMode === 'blitz';
  const timerDisplay = isSpeed ? SPEED_ROUND_TIMER : TIMER_DURATION[selectedDifficulty];

  async function handleStart() {
    setLoading(true);
    setError(null);
    try {
      if (isBlitz) {
        await startCategoryBlitz({
          difficulty: selectedDifficulty,
          questionCount: selectedCount,
        });
      } else if (isSpeed) {
        await startSpeedRound({
          category: selectedCategory,
          difficulty: selectedDifficulty,
          questionCount: selectedCount,
        });
      } else {
        await startGame({
          category: selectedCategory,
          difficulty: selectedDifficulty,
          questionCount: selectedCount,
        });
      }
      navigate('/play');
    } catch (err) {
      console.error('Failed to start game:', err);
      setError('Failed to load questions. Please try again.');
      setLoading(false);
    }
  }

  const diffColors = {
    easy: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.1)]',
    medium: 'border-amber-500/50 bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.1)]',
    hard: 'border-rose-500/50 bg-rose-500/10 text-rose-400 shadow-[0_0_15px_rgba(248,113,113,0.1)]',
  };

  return (
    <div className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-10 text-center text-white/90"
      >
        Game Setup
      </motion.h1>

      {/* Category Selection */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10"
      >
        <h2 className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-semibold mb-4">Choose a Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <motion.button
                key={cat.id ?? 'any'}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  borderColor: isSelected ? `${cat.accent}80` : undefined,
                  backgroundColor: isSelected ? `${cat.accent}18` : undefined,
                  boxShadow: isSelected ? `0 0 20px ${cat.accent}30` : undefined,
                }}
                className={`relative overflow-hidden p-3.5 pl-4 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? ''
                    : 'border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                  style={{ backgroundColor: cat.accent, opacity: isSelected ? 1 : 0.55 }}
                />
                <div className="text-2xl mb-1.5">{cat.icon}</div>
                <div className="text-[11px] font-medium text-white/70">{cat.name}</div>
                {cat.id && (() => {
                  const catName = typeof cat.id === 'string' ? (CATEGORY_NAME_MAP[cat.id] || cat.name) : (CATEGORY_NAME_MAP[cat.id] || cat.name);
                  const mastery = getMastery(catName);
                  return mastery?.stars > 0 ? <div className="mt-1"><MasteryStars stars={mastery.stars} size="sm" /></div> : null;
                })()}
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* Difficulty Selection */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10"
      >
        <h2 className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-semibold mb-4">Difficulty</h2>
        <div className="flex gap-3">
          {DIFFICULTIES.map(diff => (
            <motion.button
              key={diff}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedDifficulty(diff)}
              className={`flex-1 py-3.5 px-4 rounded-xl border text-center font-semibold capitalize transition-all duration-200 cursor-pointer ${
                selectedDifficulty === diff ? diffColors[diff] : 'border-white/[0.06] bg-white/[0.03] text-white/40 hover:bg-white/[0.06]'
              }`}
            >
              <span>{diff}</span>
              <div className="text-[10px] font-normal mt-1 opacity-60">{TIMER_DURATION[diff]}s per question</div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Question Count */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-10"
      >
        <h2 className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-semibold mb-4">Number of Questions</h2>
        <div className="flex gap-3">
          {QUESTION_COUNTS.map(count => (
            <motion.button
              key={count}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCount(count)}
              className={`flex-1 py-3 rounded-xl border text-center font-bold transition-all duration-200 cursor-pointer ${
                selectedCount === count
                  ? 'border-primary-500/50 bg-primary-500/10 text-primary-300 shadow-[0_0_15px_rgba(255,107,53,0.1)]'
                  : 'border-white/[0.06] bg-white/[0.03] text-white/40 hover:bg-white/[0.06]'
              }`}
            >
              {count}
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Game Mode */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-12"
      >
        <h2 className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-semibold mb-4">Game Mode</h2>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setGameMode('standard')}
            className={`flex-1 py-3.5 px-4 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
              gameMode === 'standard'
                ? 'border-primary-500/50 bg-primary-500/10 shadow-[0_0_15px_rgba(255,107,53,0.1)]'
                : 'border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06]'
            }`}
          >
            <span className="text-lg">📝</span>
            <div className="text-xs font-semibold mt-1 text-white/70">Standard</div>
          </motion.button>

          <motion.button
            whileHover={hasSpeedRound ? { scale: 1.02 } : {}}
            whileTap={hasSpeedRound ? { scale: 0.98 } : {}}
            onClick={() => hasSpeedRound && setGameMode('speed')}
            disabled={!hasSpeedRound}
            className={`relative flex-1 py-3.5 px-4 rounded-xl border text-center transition-all duration-200 ${
              !hasSpeedRound
                ? 'border-white/[0.04] bg-white/[0.02] cursor-not-allowed'
                : gameMode === 'speed'
                  ? 'border-amber-500/50 bg-amber-500/10 shadow-[0_0_15px_rgba(251,191,36,0.1)] cursor-pointer'
                  : 'border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer'
            }`}
          >
            <span className="text-lg">⚡</span>
            <div className={`text-xs font-semibold mt-1 ${hasSpeedRound ? 'text-white/70' : 'text-white/30'}`}>Speed Round</div>
            <div className={`text-[9px] mt-0.5 ${hasSpeedRound ? 'text-white/30' : 'text-white/15'}`}>5s timer, 2x points</div>
            {!hasSpeedRound && (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/50 backdrop-blur-[2px]">
                <span className="text-2xl mb-1">🔒</span>
                <span className="text-[10px] text-white/70 font-semibold">Unlocks at Lv.4</span>
                <span className="text-[9px] text-white/35 mt-0.5">You're Lv.{level}</span>
              </div>
            )}
          </motion.button>

          <motion.button
            whileHover={hasCategoryBlitz ? { scale: 1.02 } : {}}
            whileTap={hasCategoryBlitz ? { scale: 0.98 } : {}}
            onClick={() => hasCategoryBlitz && setGameMode('blitz')}
            disabled={!hasCategoryBlitz}
            className={`relative flex-1 py-3.5 px-4 rounded-xl border text-center transition-all duration-200 ${
              !hasCategoryBlitz
                ? 'border-white/[0.04] bg-white/[0.02] cursor-not-allowed'
                : gameMode === 'blitz'
                  ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.1)] cursor-pointer'
                  : 'border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer'
            }`}
          >
            <span className="text-lg">🌀</span>
            <div className={`text-xs font-semibold mt-1 ${hasCategoryBlitz ? 'text-white/70' : 'text-white/30'}`}>Category Blitz</div>
            <div className={`text-[9px] mt-0.5 ${hasCategoryBlitz ? 'text-white/30' : 'text-white/15'}`}>Mixed categories</div>
            {!hasCategoryBlitz && (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/50 backdrop-blur-[2px]">
                <span className="text-2xl mb-1">🔒</span>
                <span className="text-[10px] text-white/70 font-semibold">Unlocks at Lv.7</span>
                <span className="text-[9px] text-white/35 mt-0.5">You're Lv.{level}</span>
              </div>
            )}
          </motion.button>
        </div>
      </motion.section>

      {/* Summary and Start */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 px-4 py-3 rounded-xl border border-wrong/30 bg-wrong/10 text-wrong text-sm font-medium"
          >
            {error}
          </motion.div>
        )}

        <Card className="inline-block mb-6 !py-3 !px-5">
          <div className="text-xs text-white/40">
            {isSpeed && '⚡ Speed Round · '}
            {isBlitz && '🌀 Category Blitz · '}
            {selectedCount} {selectedDifficulty} questions
            {isBlitz ? ' from mixed categories' : selectedCategory ? ` in ${CATEGORIES.find(c => c.id === selectedCategory)?.name}` : ' in any category'}
            &nbsp;&middot;&nbsp;{timerDisplay}s each
            {isSpeed && ' · 2x points'}
          </div>
        </Card>

        <div>
          <Button size="lg" onClick={handleStart} disabled={loading} className="min-w-48">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner size="sm" /> Loading...
              </span>
            ) : (
              isBlitz ? '🌀 Start Category Blitz' : isSpeed ? '⚡ Start Speed Round' : 'Start Quiz'
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
