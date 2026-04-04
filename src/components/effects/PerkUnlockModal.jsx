import { motion, AnimatePresence } from "framer-motion";
import Confetti from "./Confetti";
import Button from "../ui/Button";

export default function PerkUnlockModal({ isOpen, perks, onClose }) {
  if (!perks || perks.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Confetti celebration */}
          <Confetti active={isOpen} />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-[#141425] border border-white/[0.12] rounded-2xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative glow */}
            <div
              className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,107,53,0.2), transparent 70%)",
              }}
            />

            {/* Header */}
            <div className="relative text-center mb-5">
              <motion.div
                className="text-4xl mb-2"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {"\uD83C\uDF89"}
              </motion.div>
              <h2 className="text-xl font-bold text-white/90">
                {perks.length === 1
                  ? "New Perk Unlocked!"
                  : "New Perks Unlocked!"}
              </h2>
            </div>

            {/* Perk list */}
            <div className="relative space-y-3 mb-6">
              {perks.map((perk, index) => (
                <motion.div
                  key={perk.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.15 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.06] border border-white/[0.08]"
                >
                  <motion.span
                    className="text-3xl flex-shrink-0"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ delay: 0.5 + index * 0.15, duration: 0.4 }}
                  >
                    {perk.icon}
                  </motion.span>
                  <div className="min-w-0">
                    <div className="font-semibold text-white/90 text-sm">
                      {perk.name}
                    </div>
                    <div className="text-xs text-white/50 mt-0.5">
                      {perk.description}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Dismiss button */}
            <div className="relative text-center">
              <Button onClick={onClose} size="lg" className="w-full">
                Awesome!
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
