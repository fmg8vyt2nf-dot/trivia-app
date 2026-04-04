import { useLocalStorage } from './useLocalStorage';

const MAX_ENTRIES = 10;

export function useLeaderboard() {
  const [entries, setEntries] = useLocalStorage('trivia_leaderboard', []);

  function addEntry(entry) {
    setEntries(prev => {
      const newEntries = [
        ...prev,
        { ...entry, id: crypto.randomUUID(), date: new Date().toISOString() },
      ];
      return newEntries.sort((a, b) => b.score - a.score).slice(0, MAX_ENTRIES);
    });
  }

  function clearLeaderboard() {
    setEntries([]);
  }

  function qualifiesForLeaderboard(score) {
    if (entries.length < MAX_ENTRIES) return true;
    return score > (entries[entries.length - 1]?.score ?? 0);
  }

  return { entries, addEntry, clearLeaderboard, qualifiesForLeaderboard };
}
