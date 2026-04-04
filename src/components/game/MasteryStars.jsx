export default function MasteryStars({ stars, size = 'md' }) {
  const totalStars = 5;
  const sizeClass = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <span className={`inline-flex gap-0.5 ${sizeClass}`}>
      {Array.from({ length: totalStars }, (_, i) => (
        <span key={i} className={i < stars ? 'text-streak' : 'text-white/15'}>
          ★
        </span>
      ))}
    </span>
  );
}
