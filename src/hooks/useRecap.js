import { useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

function getISOWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function formatWeekRange(weekStart) {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  const opts = { month: "short", day: "numeric" };
  return `${weekStart.toLocaleDateString("en-US", opts)} - ${end.toLocaleDateString("en-US", opts)}`;
}

function aggregateGames(games) {
  if (games.length === 0) return null;
  const cats = [...new Set(games.map((g) => g.category))];
  const modes = {};
  games.forEach((g) => {
    modes[g.gameMode || "standard"] =
      (modes[g.gameMode || "standard"] || 0) + 1;
  });
  const totalCorrect = games.reduce((s, g) => s + (g.correctCount || 0), 0);
  const totalQuestions = games.reduce((s, g) => s + (g.total || 0), 0);
  return {
    gamesPlayed: games.length,
    questionsAnswered: totalQuestions,
    correctAnswers: totalCorrect,
    accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
    xpEarned: games.reduce((s, g) => s + (g.xp || g.score || 0), 0),
    bestStreak: Math.max(...games.map((g) => g.longestStreak || 0)),
    categoriesPlayed: cats,
    perfectGames: games.filter((g) => g.accuracy === 100).length,
    gameModes: modes,
  };
}

export function useRecap() {
  const [stats] = useLocalStorage("trivia_stats", {
    gamesPlayed: 0,
    questionsAnswered: 0,
  });
  const history = stats.gameHistory || [];

  const { thisWeek, lastWeek, thisWeekRange, weekOverWeek, isEmpty } =
    useMemo(() => {
      const now = new Date();
      const thisWeekStart = getISOWeekStart(now);
      const lastWeekStart = new Date(thisWeekStart);
      lastWeekStart.setDate(lastWeekStart.getDate() - 7);

      const thisWeekGames = history.filter(
        (g) => new Date(g.date) >= thisWeekStart,
      );
      const lastWeekGames = history.filter((g) => {
        const d = new Date(g.date);
        return d >= lastWeekStart && d < thisWeekStart;
      });

      const tw = aggregateGames(thisWeekGames);
      const lw = aggregateGames(lastWeekGames);

      const wow = {};
      if (tw && lw) {
        wow.gamesPlayed = tw.gamesPlayed - lw.gamesPlayed;
        wow.accuracy = tw.accuracy - lw.accuracy;
        wow.xpEarned = tw.xpEarned - lw.xpEarned;
      }

      return {
        thisWeek: tw,
        lastWeek: lw,
        thisWeekRange: formatWeekRange(thisWeekStart),
        weekOverWeek: wow,
        isEmpty: !tw,
      };
    }, [history]);

  return { thisWeek, lastWeek, thisWeekRange, weekOverWeek, isEmpty };
}
