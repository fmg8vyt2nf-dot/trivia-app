import { motion } from 'framer-motion';

export default function Card({ children, className = '', ...props }) {
  return (
    <motion.div
      className={`bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] rounded-2xl p-6 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/[0.16] hover:shadow-[0_4px_20px_rgba(255,107,53,0.06)] ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
