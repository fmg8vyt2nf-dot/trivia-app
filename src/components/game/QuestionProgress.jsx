import ProgressBar from '../ui/ProgressBar';

export default function QuestionProgress({ current, total }) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] text-white/30 font-medium tracking-wide">Question {current + 1} of {total}</span>
        <span className="text-[10px] text-white/30 font-medium">{Math.round(((current + 1) / total) * 100)}%</span>
      </div>
      <ProgressBar value={current + 1} max={total} />
    </div>
  );
}
