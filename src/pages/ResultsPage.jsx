import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrivia } from '../hooks/useTrivia';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSound } from '../hooks/useSound';
import { useXP } from '../hooks/useXP';
import { useCategoryMastery } from '../hooks/useCategoryMastery';
import { useAvatar } from '../hooks/useAvatar';
import { useDailyChallenge } from '../hooks/useDailyChallenge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import XPBar from '../components/ui/XPBar';
import XPAnimation from '../components/effects/XPAnimation';
import PerkUnlockModal from '../components/effects/PerkUnlockModal';
import { getPerksForLevel } from '../data/levelPerks';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { state, resetGame } = useTrivia();
  const { addEntry, qualifiesForLeaderboard } = useLeaderboard();
  const [stats, setStats] = useLocalStorage('trivia_stats', { gamesPlayed: 0, questionsAnswered: 0 });
  const [playerName, setPlayerName] = useState('');
  const [saved, setSaved] = useState(false);
  const { playSound } = useSound();
  const { totalXP, level, levelTitle, xpProgress, addXP } = useXP();
  const { updateMastery } = useCategoryMastery();
  const { selectedAvatar } = useAvatar();
  const { saveDailyResult } = useDailyChallenge();
  const [showXPAnim, setShowXPAnim] = useState(false);
  const [leveledUp, setLeveledUp] = useState(false);
  const [showPerkModal, setShowPerkModal] = useState(false);
  const [unlockedPerks, setUnlockedPerks] = useState([]);

  const { score, correctCount, questions, answers, longestStreak, difficulty, category, questionSource, gameMode } = state;
  const isDaily = gameMode === 'daily';
  const total = questions.length;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const qualifies = qualifiesForLeaderboard(score);

  useEffect(() => {
    if (state.status !== 'finished') {
      navigate('/', { replace: true });
      return;
    }
    setStats((prev) => {
      const history = prev.gameHistory || [];
      const newEntry = {
        date: new Date().toISOString(),
        score,
        correctCount,
        total,
        category: questions[0]?.category || 'Any',
        difficulty,
        longestStreak,
        xp: score,
        gameMode: gameMode || 'standard',
        accuracy,
      };
      const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
      const trimmed = [...history, newEntry].filter(
        (g) => new Date(g.date).getTime() > cutoff,
      );
      return {
        gamesPlayed: (prev.gamesPlayed || 0) + 1,
        questionsAnswered: (prev.questionsAnswered || 0) + total,
        gameHistory: trimmed,
      };
    });

    // Award XP
    if (score > 0) {
      const result = addXP(score);
      setShowXPAnim(true);
      if (result?.leveledUp) {
        setLeveledUp(true);
        setTimeout(() => playSound('levelUp'), 500);

        // Collect all perks unlocked across the level jump
        const perks = [];
        for (let lvl = result.prevLevel + 1; lvl <= result.newLevel; lvl++) {
          perks.push(...getPerksForLevel(lvl));
        }
        if (perks.length > 0) {
          setUnlockedPerks(perks);
          // Show perk modal after XP animation completes + small buffer
          setTimeout(() => {
            setShowPerkModal(true);
            playSound('powerUp');
          }, 2800);
        }
      }
      setTimeout(() => setShowXPAnim(false), 2500);
    }

    // Update category mastery
    const categoryName = questions[0]?.category || 'Any';
    updateMastery(categoryName, correctCount, total);

    // Save daily challenge result
    if (isDaily) {
      saveDailyResult({ score, correctCount, totalQuestions: total, accuracy, longestStreak });
    }

    // Play victory or game over sound
    playSound(accuracy >= 80 ? 'victory' : 'gameOver');
  }, []);

  function handleSave() {
    if (!playerName.trim()) return;
    addEntry({
      name: playerName.trim(),
      score,
      correctCount,
      totalQuestions: total,
      category: category ? questions[0]?.category : 'Any',
      difficulty,
      longestStreak,
      avatar: selectedAvatar.id,
    });
    setSaved(true);
  }

  function handlePlayAgain() {
    resetGame();
    navigate(isDaily ? '/daily' : '/setup');
  }

  const statItems = [
    { label: 'Score', value: score, color: 'text-primary-300' },
    { label: 'Correct', value: `${correctCount}/${total}`, color: 'text-correct' },
    { label: 'Accuracy', value: `${accuracy}%`, color: 'text-white/80' },
    { label: 'Best Streak', value: longestStreak, color: 'text-streak' },
  ];

  return (
    <div className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
      <XPAnimation xpAmount={score} show={showXPAnim} leveledUp={leveledUp} />
      <PerkUnlockModal
        isOpen={showPerkModal}
        perks={unlockedPerks}
        onClose={() => setShowPerkModal(false)}
      />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="text-5xl mb-4">{accuracy >= 80 ? '🏆' : accuracy >= 50 ? '👏' : '💪'}</div>
        <h1 className="text-3xl font-bold mb-2 text-white/90">
          {accuracy >= 80 ? 'Amazing!' : accuracy >= 50 ? 'Good Job!' : 'Keep Practicing!'}
        </h1>
        {gameMode === 'speed' && (
          <p className="text-[10px] text-amber-400/50 uppercase tracking-widest mt-1">⚡ Speed Round · 2x Points</p>
        )}
        {questionSource === 'fallback' && (
          <p className="text-[10px] text-white/25 uppercase tracking-widest">Offline mode</p>
        )}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {statItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
          >
            <Card className="text-center !py-5">
              <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-[10px] text-white/25 mt-1.5 uppercase tracking-widest">{item.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* XP Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-10"
      >
        <Card>
          <XPBar level={level} levelTitle={levelTitle} xpProgress={xpProgress} />
          {score > 0 && (
            <div className="text-xs text-primary-400 mt-2 text-center font-medium">+{score} XP earned</div>
          )}
        </Card>
      </motion.div>

      {/* Leaderboard Save */}
      {qualifies && !saved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mb-8">
            <h3 className="font-semibold mb-3 text-white/80">You made the leaderboard!</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                maxLength={20}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/90 placeholder-white/20 focus:outline-none focus:border-primary-500/50 focus:shadow-[0_0_15px_rgba(255,107,53,0.1)] transition-all text-sm"
                onKeyDown={e => e.key === 'Enter' && handleSave()}
              />
              <Button onClick={handleSave} disabled={!playerName.trim()}>Save</Button>
            </div>
          </Card>
        </motion.div>
      )}

      {saved && (
        <Card className="mb-8 text-center text-correct text-sm">
          Score saved to leaderboard!
        </Card>
      )}

      {/* Question Review */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-semibold mb-4">Question Review</h3>
        <div className="space-y-2.5 mb-10">
          {answers.map((a, i) => {
            const q = questions[a.questionIndex];
            return (
              <Card key={i} className="!p-4">
                <div className="flex items-start gap-3">
                  <span className={`text-base mt-0.5 ${a.isCorrect ? 'text-correct' : 'text-wrong'}`}>
                    {a.isCorrect ? '✓' : '✗'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-1 text-white/80">{q.question}</p>
                    {!a.isCorrect && a.selected && (
                      <p className="text-xs text-wrong/60">Your answer: {a.selected}</p>
                    )}
                    {!a.isCorrect && !a.selected && (
                      <p className="text-xs text-wrong/60">{a.skipped ? 'Skipped' : 'Time expired'}</p>
                    )}
                    <p className="text-xs text-correct/60">Correct: {a.correct}</p>
                    {a.doubleDipUsed && (
                      <p className="text-[10px] text-sky-400/60 mt-0.5">🎯 Double Dip (50% points)</p>
                    )}
                  </div>
                  {a.points > 0 && (
                    <span className="text-sm font-bold text-primary-300">+{a.points}</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <Button onClick={handlePlayAgain}>Play Again</Button>
        <Link to="/">
          <Button variant="secondary">Home</Button>
        </Link>
      </div>
    </div>
  );
}
