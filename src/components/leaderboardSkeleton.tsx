import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
export const LeaderboardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center min-h-[95vh] gap-6"
  >
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 360],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative"
    >
      <Trophy className="w-16 h-16 text-[#98FB98]" />
      <motion.div
        animate={{
          scale: [1.2, 1.5, 1.2],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full bg-[#98FB98]/20 blur-xl"
      />
    </motion.div>
    <div className="text-center space-y-2">
      <h3 className="text-2xl font-bold text-[#98FB98] opacity-100">
        Fetching Leaderboard
      </h3>
    </div>
  </motion.div>
);
