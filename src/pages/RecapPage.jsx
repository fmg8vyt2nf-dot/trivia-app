import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRecap } from "../hooks/useRecap";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

function Delta({ value }) {
  if (value === undefined || value === null) return null;
  if (value > 0)
    return <span className="text-correct text-[10px] ml-1">+{value}</span>;
  if (value < 0)
    return <span className="text-wrong text-[10px] ml-1">{value}</span>;
  return <span className="text-white/20 text-[10px] ml-1">—</span>;
}

export default function RecapPage() {
  const { thisWeek, thisWeekRange, weekOverWeek, isEmpty } = useRecap();

  const stats = thisWeek
    ? [
        {
          label: "Games",
          value: thisWeek.gamesPlayed,
          delta: weekOverWeek.gamesPlayed,
          color: "text-primary-300",
        },
        {
          label: "Questions",
          value: thisWeek.questionsAnswered,
          color: "text-white/80",
        },
        {
          label: "Accuracy",
          value: `${thisWeek.accuracy}%`,
          delta: weekOverWeek.accuracy,
          color: "text-correct",
        },
        {
          label: "XP Earned",
          value: thisWeek.xpEarned,
          delta: weekOverWeek.xpEarned,
          color: "text-primary-300",
        },
        {
          label: "Best Streak",
          value: thisWeek.bestStreak,
          color: "text-streak",
        },
        {
          label: "Perfect Games",
          value: thisWeek.perfectGames,
          color: "text-accent",
        },
      ]
    : [];

  return (
    <div className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="text-4xl mb-3">📊</div>
        <h1 className="text-3xl font-bold text-white/90 mb-1">Weekly Recap</h1>
        <p className="text-xs text-white/30">{thisWeekRange}</p>
      </motion.div>

      {isEmpty ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="text-center !py-10">
            <div className="text-3xl mb-3">🎮</div>
            <p className="text-white/40 text-sm mb-4">
              Play some games this week to see your recap!
            </p>
            <Link to="/setup">
              <Button>Start a Game</Button>
            </Link>
          </Card>
        </motion.div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {stats.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <Card className="text-center !py-5">
                  <div className={`text-2xl font-bold ${item.color}`}>
                    {item.value}
                    <Delta value={item.delta} />
                  </div>
                  <div className="text-[10px] text-white/25 mt-1.5 uppercase tracking-widest">
                    {item.label}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Categories Played */}
          {thisWeek.categoriesPlayed.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h3 className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-semibold mb-3">
                Categories Played
              </h3>
              <Card>
                <div className="flex flex-wrap gap-2">
                  {thisWeek.categoriesPlayed.map((cat) => (
                    <span
                      key={cat}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Game Modes */}
          {thisWeek.gameModes &&
            Object.keys(thisWeek.gameModes).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-10"
              >
                <h3 className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-semibold mb-3">
                  Game Modes
                </h3>
                <Card>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(thisWeek.gameModes).map(([mode, count]) => (
                      <span
                        key={mode}
                        className="text-xs px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300"
                      >
                        {mode === "speed"
                          ? "⚡ Speed"
                          : mode === "daily"
                            ? "📅 Daily"
                            : mode === "categoryBlitz"
                              ? "🌀 Blitz"
                              : "📝 Standard"}{" "}
                        × {count}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
        </>
      )}

      <div className="flex gap-3 justify-center">
        <Link to="/">
          <Button variant="secondary">Home</Button>
        </Link>
      </div>
    </div>
  );
}
