import React from 'react';
import {
  Search,
  Sparkles,
  Shield,
  BookOpen,
  Activity,
  Sun,
  Moon,
  Zap,
  CreditCard,
  Settings,
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserUsageState } from '../types';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  onOpenChat: () => void;
  onOpenTestCenter: () => void;
  onOpenPricing: () => void;
  onOpenDocs: () => void;
  onOpenAdmin: () => void;
  onOpenInstaller: () => void;
  usageState: UserUsageState;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  onOpenChat,
  onOpenTestCenter,
  onOpenPricing,
  onOpenDocs,
  onOpenAdmin,
  onOpenInstaller,
  usageState,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e5ebe8] dark:border-[#33463c] bg-white/95 dark:bg-[#14221f]/95 backdrop-blur-xl transition-colors">
      {/* Top Announcement Bar with Live Status */}
      <div className="bg-[#e9f5ee] dark:bg-[#1c2d28] text-[#137659] dark:text-[#a2b5a9] text-[11px] py-1.5 px-4 sm:px-8 flex justify-between items-center border-b border-[#bad5c8]/50 dark:border-[#33463c]">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-5 rounded-xs overflow-hidden border border-[#bad5c8] dark:border-[#355c41]">
            <span className="w-1.5 h-full bg-[#FF9933]"></span>
            <span className="w-2 h-full bg-white flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-[#000080]"></span>
            </span>
            <span className="w-1.5 h-full bg-[#138808]"></span>
          </span>
          <span className="font-semibold text-[#172b28] dark:text-[#e2ede7] tracking-wide">
            Commercial Utility Suite · 200+ Client-Side Tools · DPDP (2023) Compliant
          </span>
        </div>
        <div className="flex items-center gap-3 font-medium">
          <button
            onClick={onOpenTestCenter}
            className="hover:underline flex items-center gap-1.5 transition-colors text-[#137659] dark:text-[#62c39a] font-bold"
            title="Open Diagnostic Test Center"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#137659] dark:bg-[#62c39a] animate-ping"></span>
            System 100% Operational
          </button>
          <span className="text-[#bad5c8] dark:text-[#33463c]">|</span>
          <button
            onClick={onOpenInstaller}
            className="hover:text-[#137659] dark:hover:text-[#62c39a] text-[#70807c] dark:text-[#a2b5a9] transition-colors"
          >
            Installer Wizard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group focus:outline-hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-2xl bg-[#137659] dark:bg-[#258263] text-white p-0.5 shadow-md shadow-[#137659]/20 flex items-center justify-center"
          >
            <Zap className="w-5 h-5 fill-current" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-[#172b28] dark:text-[#e2ede7]">
                ALL IN ONE TOOL
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#e9f5ee] dark:bg-[#203b2a] text-[#137659] dark:text-[#62c39a] border border-[#bad5c8] dark:border-[#355c41] uppercase tracking-wider">
                INDIA
              </span>
            </div>
            <p className="text-[11px] font-medium text-[#70807c] dark:text-[#a2b5a9] -mt-0.5 tracking-wide">
              Drop Anything. Get Useful Tools.
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-[#70807c] dark:text-[#a2b5a9]">
          <a
            href="#tools"
            className="px-3 py-1.5 rounded-xl hover:text-[#137659] dark:hover:text-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#254334] transition-colors"
          >
            All Tools
          </a>
          <a
            href="#categories"
            className="px-3 py-1.5 rounded-xl hover:text-[#137659] dark:hover:text-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#254334] transition-colors"
          >
            Categories
          </a>
          <button
            onClick={onOpenChat}
            className="px-3 py-1.5 rounded-xl text-[#137659] dark:text-[#62c39a] font-bold flex items-center gap-1.5 bg-[#e9f5ee] dark:bg-[#254334] border border-[#bad5c8] dark:border-[#355c41] hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-4 h-4" />
            Gemini AI
          </button>
          <button
            onClick={onOpenTestCenter}
            className="px-3 py-1.5 rounded-xl hover:text-[#137659] dark:hover:text-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#254334] flex items-center gap-1.5 transition-colors"
          >
            <Activity className="w-4 h-4" />
            Live Tests
          </button>
          <button
            onClick={onOpenPricing}
            className="px-3 py-1.5 rounded-xl hover:text-[#137659] dark:hover:text-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#254334] flex items-center gap-1.5 transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            Plans
          </button>
          <button
            onClick={onOpenDocs}
            className="px-3 py-1.5 rounded-xl hover:text-[#137659] dark:hover:text-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#254334] flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Docs (35)
          </button>
          <button
            onClick={onOpenAdmin}
            className="px-3 py-1.5 rounded-xl hover:text-[#137659] dark:hover:text-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#254334] flex items-center gap-1.5 transition-colors"
            title="Administration Console"
          >
            <Settings className="w-4 h-4" />
            Admin
          </button>
        </nav>

        {/* Actions & Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Search trigger */}
          <button
            id="global-search-trigger"
            onClick={onOpenSearch}
            className="flex items-center gap-2 text-xs font-medium text-[#70807c] dark:text-[#a2b5a9] bg-[#f8faf9] dark:bg-[#1c2d28] hover:text-[#137659] dark:hover:text-[#62c39a] px-3.5 py-2 rounded-2xl border border-[#e5ebe8] dark:border-[#33463c] hover:border-[#bad5c8] dark:hover:border-[#355c41] transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search 200+ tools...</span>
            <kbd className="hidden sm:inline-block font-mono text-[10px] bg-white dark:bg-[#254334] text-[#137659] dark:text-[#62c39a] px-1.5 py-0.5 rounded-md border border-[#bad5c8] dark:border-[#355c41]">
              ⌘K
            </kbd>
          </button>

          {/* Usage limit pill */}
          <button
            onClick={onOpenPricing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold bg-[#137659] hover:bg-[#0f5e47] dark:bg-[#258263] dark:hover:bg-[#1d6b51] text-white shadow-sm transition-all"
            title="Click to view plan and usage quota"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            {usageState.userType === 'guest'
              ? `${usageState.guestUsesRemaining} free uses`
              : usageState.dailyUsesRemaining === -1
              ? 'Pro Plan: ∞'
              : `${usageState.dailyUsesRemaining} daily uses`}
          </button>

          {/* Dark Mode toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleDarkMode}
            className="p-2 rounded-2xl text-[#172b28] dark:text-[#e2ede7] hover:bg-[#e9f5ee] dark:hover:bg-[#254334] border border-[#e5ebe8] dark:border-[#33463c] transition-all"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-4.5 h-4.5 text-[#f4a44d]" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-[#137659]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
