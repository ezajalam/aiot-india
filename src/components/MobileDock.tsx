import React from 'react';
import {
  Sparkles,
  Search,
  UploadCloud,
  Grid,
  Shield,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';

interface MobileDockProps {
  onOpenQuickDrop: () => void;
  onOpenChat: () => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onScrollToTools: () => void;
  activeSection?: string;
}

export const MobileDock: React.FC<MobileDockProps> = ({
  onOpenQuickDrop,
  onOpenChat,
  onOpenSearch,
  onOpenAdmin,
  onScrollToTools,
}) => {
  return (
    <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 md:hidden pointer-events-none">
      <motion.nav
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        className="pointer-events-auto bg-[#14221f]/95 text-[#e2ede7] border border-[#33463c] backdrop-blur-2xl rounded-full px-3 py-2 shadow-2xl shadow-black/40 flex items-center gap-1 sm:gap-2 max-w-sm w-full justify-between"
      >
        {/* Tools */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={onScrollToTools}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-2xl hover:bg-[#254334] transition-colors text-[10px] font-bold text-[#a2b5a9] hover:text-[#62c39a]"
        >
          <Grid className="w-4 h-4 mb-0.5" />
          <span>Tools</span>
        </motion.button>

        {/* Search */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={onOpenSearch}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-2xl hover:bg-[#254334] transition-colors text-[10px] font-bold text-[#a2b5a9] hover:text-[#62c39a]"
        >
          <Search className="w-4 h-4 mb-0.5" />
          <span>Search</span>
        </motion.button>

        {/* Quick Drop Central Action Pill */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={onOpenQuickDrop}
          className="px-3.5 py-2 rounded-full bg-[#137659] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-[#137659]/30 shrink-0"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Drop</span>
        </motion.button>

        {/* AI Chat */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={onOpenChat}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-2xl hover:bg-[#254334] transition-colors text-[10px] font-bold text-[#a2b5a9] hover:text-[#62c39a]"
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span>AI</span>
        </motion.button>

        {/* Admin */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={onOpenAdmin}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-2xl hover:bg-[#254334] transition-colors text-[10px] font-bold text-[#a2b5a9] hover:text-[#62c39a]"
        >
          <Shield className="w-4 h-4 mb-0.5" />
          <span>Admin</span>
        </motion.button>
      </motion.nav>
    </div>
  );
};
