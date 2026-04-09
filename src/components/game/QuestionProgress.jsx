import { motion } from 'framer-motion';

export default function QuestionProgress({ current, total }) {
  return (
    <div className="w-full flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current;
        const isDone = i < current;
        return (
          <motion.div
            key={i}
            initial={false}
            animate={{
              backgroundColor: isDone
                ? 'rgba(255,107,53,0.85)'
                : isActive
                ? 'rgba(255,107,53,1)'
                : 'rgba(255,255,255,0.08)',
              boxShadow: isActive ? '0 0 8px rgba(255,107,53,0.5)' : '0 0 0 rgba(0,0,0,0)',
            }}
            transition={{ duration: 0.3 }}
            className="flex-1 h-1 rounded-full"
          />
        );
      })}
    </div>
  );
}
