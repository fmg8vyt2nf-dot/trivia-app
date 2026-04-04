import { motion, AnimatePresence } from 'framer-motion';

export default function XPAnimation({ xpAmount, show, leveledUp }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0.5, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: -40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent bg-clip-text text-transparent drop-shadow-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6, repeat: 1 }}
            >
              +{xpAmount} XP
            </motion.div>
            {leveledUp && (
              <motion.div
                className="text-lg font-bold text-streak mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Level Up!
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
