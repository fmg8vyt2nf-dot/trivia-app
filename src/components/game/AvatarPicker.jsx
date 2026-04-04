import { motion } from 'framer-motion';
import { AVATARS } from '../../data/avatars';
import { LOCKED_AVATARS } from '../../data/levelPerks';
import { LEVEL_TITLES } from '../../utils/xpLevels';

export default function AvatarPicker({ selectedId, onSelect, playerLevel = 10 }) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {AVATARS.map(avatar => {
        const requiredLevel = LOCKED_AVATARS[avatar.id];
        const isLocked = requiredLevel !== undefined && playerLevel < requiredLevel;

        return (
          <motion.button
            key={avatar.id}
            whileHover={isLocked ? {} : { scale: 1.1 }}
            whileTap={isLocked ? {} : { scale: 0.9 }}
            onClick={() => !isLocked && onSelect(avatar.id)}
            disabled={isLocked}
            className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
              isLocked
                ? 'border-white/[0.04] bg-white/[0.02] cursor-not-allowed'
                : selectedId === avatar.id
                  ? 'border-primary-500/50 bg-primary-500/10 shadow-[0_0_15px_rgba(255,107,53,0.15)] cursor-pointer'
                  : 'border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer'
            }`}
          >
            <span className={`text-2xl ${isLocked ? 'grayscale blur-[2px]' : ''}`}>
              {avatar.emoji}
            </span>
            <span className="text-[9px] text-white/40 font-medium">{avatar.name}</span>
            {isLocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/40">
                <span className="text-sm">🔒</span>
                <span className="text-[8px] text-white/50 mt-0.5">
                  Lv.{requiredLevel} {LEVEL_TITLES[requiredLevel - 1]}
                </span>
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
