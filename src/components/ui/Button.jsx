import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white shadow-lg shadow-primary-500/30',
  secondary: 'bg-white/8 hover:bg-white/14 text-white/90 border border-white/10 hover:border-white/20',
  danger: 'bg-gradient-to-r from-wrong/70 to-red-600/70 hover:from-wrong hover:to-red-600 text-white shadow-lg shadow-wrong/20',
  ghost: 'bg-transparent hover:bg-white/8 text-white/60 hover:text-white',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base tracking-wide',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  ...props
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={`rounded-xl font-semibold transition-all duration-200 cursor-pointer ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-40 cursor-not-allowed saturate-0' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}
