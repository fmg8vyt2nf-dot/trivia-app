import { motion } from 'framer-motion';

export default function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  return (
    <motion.div
      className={`${sizes[size]} border-3 border-white/20 border-t-primary-400 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
    />
  );
}
