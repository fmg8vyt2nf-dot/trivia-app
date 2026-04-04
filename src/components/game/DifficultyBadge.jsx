const colors = {
  easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export default function DifficultyBadge({ difficulty }) {
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider border ${colors[difficulty] || ''}`}>
      {difficulty}
    </span>
  );
}
