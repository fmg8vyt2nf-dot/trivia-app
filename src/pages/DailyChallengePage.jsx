import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDailyChallenge } from '../hooks/useDailyChallenge';
import { useTrivia } from '../hooks/useTrivia';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function DailyChallengePage() {
  const navigate = useNavigate();
  const { todayKey, hasPlayedToday, todayResult, getDailyQuestions, streak, history } = useDailyChallenge();
  const { startDailyChallenge } = useTrivia();

  // Time until midnight
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setDate(midnight.getDate() + 1);
      midnight.setHours(0, 0, 0, 0);
      const diff = midnight - now;
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  function handleStart() {
    const questions = getDailyQuestions();
    startDailyChallenge(questions);
    navigate('/play');
  }

  // Format today's date nicely
  const formattedDate = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }, []);

  return (
    <div className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-5xl mb-4">📅</div>
        <h1 className="text-3xl font-bold mb-2 text-white/90">Daily Challenge</h1>
        <p className="text-sm text-white/40">{formattedDate}</p>
      </motion.div>

      {/* Streak */}
      {streak > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <Card className="inline-block !px-8 !py-4">
            <div className="text-2xl font-bold text-streak">🔥 {streak}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Day Streak</div>
          </Card>
        </motion.div>
      )}

      {!hasPlayedToday ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <Card className="mb-8 !py-8">
            <div className="text-lg font-semibold text-white/80 mb-2">Ready for today&apos;s challenge?</div>
            <p className="text-sm text-white/35 mb-6">
              10 questions &middot; Mixed categories &middot; Same quiz for everyone today
            </p>
            <Button size="lg" onClick={handleStart}>
              Start Today&apos;s Challenge
            </Button>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8 text-center !py-8">
            <div className="text-4xl mb-3">
              {todayResult.accuracy >= 80 ? '🏆' : todayResult.accuracy >= 50 ? '⭐' : '💪'}
            </div>
            <div className="text-lg font-semibold text-white/80 mb-4">Challenge Complete!</div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <div className="text-2xl font-bold text-primary-300">{todayResult.score}</div>
                <div className="text-[10px] text-white/25 uppercase tracking-widest mt-1">Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-correct">{todayResult.accuracy}%</div>
                <div className="text-[10px] text-white/25 uppercase tracking-widest mt-1">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-streak">{todayResult.longestStreak}</div>
                <div className="text-[10px] text-white/25 uppercase tracking-widest mt-1">Streak</div>
              </div>
            </div>

            <div className="text-sm text-white/30">
              Next challenge in <span className="text-accent font-medium">{timeLeft}</span>
            </div>
          </Card>
        </motion.div>
      )}

      {/* History */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-semibold mb-4">Recent History</h3>
          <div className="space-y-2">
            {history.slice(0, 7).map((entry, i) => (
              <motion.div
                key={entry.date}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <Card className="!p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm">
                      {entry.accuracy >= 80 ? '🏆' : entry.accuracy >= 50 ? '⭐' : '💪'}
                    </span>
                    <div>
                      <div className="text-xs text-white/60">
                        {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-[10px] text-white/25">
                        {entry.correctCount}/{entry.totalQuestions} correct
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-primary-300">{entry.score}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
