/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DropZoneHero } from './components/DropZoneHero';
import { ToolGrid } from './components/ToolGrid';
import { ToolRunnerModal } from './components/ToolRunnerModal';
import { GeminiChatModal } from './components/GeminiChatModal';
import { LiveTestCenter } from './components/LiveTestCenter';
import { MonetizationModal } from './components/MonetizationModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { DocumentationViewer } from './components/DocumentationViewer';
import { InstallerModal } from './components/InstallerModal';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { Footer } from './components/Footer';
import { MouseAnimation } from './components/MouseAnimation';
import { MobileDock } from './components/MobileDock';
import { MobileQuickDropSheet } from './components/MobileQuickDropSheet';

import { TOOL_CATEGORIES } from './data/categories';
import { TOOLS_DATABASE } from './data/tools';
import { ToolDefinition, UserUsageState } from './types';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem('aiti_theme') === 'dark' ||
      (!('aiti_theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  // Active Tool state
  const [activeTool, setActiveTool] = useState<ToolDefinition | null>(null);
  const [stagedPayload, setStagedPayload] = useState<{
    type: string;
    data: string | File;
    fileName?: string;
  } | undefined>(undefined);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTestCenterOpen, setIsTestCenterOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isInstallerOpen, setIsInstallerOpen] = useState(false);
  const [isQuickDropOpen, setIsQuickDropOpen] = useState(false);

  // User Quota & Usage state
  const [usageState, setUsageState] = useState<UserUsageState>(() => {
    const saved = localStorage.getItem('aiti_usage_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      userType: 'guest',
      guestUsesRemaining: 10,
      dailyUsesRemaining: 10,
      lastResetDate: new Date().toISOString().split('T')[0],
      isTrialActive: false,
    };
  });

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('aiti_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('aiti_theme', 'light');
    }
  }, [darkMode]);

  // Persist usage state
  useEffect(() => {
    localStorage.setItem('aiti_usage_state', JSON.stringify(usageState));
  }, [usageState]);

  // Global Keyboard shortcuts (Cmd+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('tool-grid-search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTool = (
    toolSlug: string,
    initialPayload?: { type: string; data: string | File; fileName?: string }
  ) => {
    const found = TOOLS_DATABASE.find(t => t.slug === toolSlug);
    if (found) {
      setActiveTool(found);
      setStagedPayload(initialPayload);
    }
  };

  const handleConsumeUsage = (): boolean => {
    if (usageState.userType === 'premium') {
      return true; // Unlimited
    }

    if (usageState.userType === 'guest') {
      if (usageState.guestUsesRemaining <= 0) {
        setIsPricingOpen(true);
        return false;
      }
      setUsageState(prev => ({
        ...prev,
        guestUsesRemaining: Math.max(0, prev.guestUsesRemaining - 1),
      }));
      return true;
    }

    if (usageState.dailyUsesRemaining <= 0) {
      setIsPricingOpen(true);
      return false;
    }

    setUsageState(prev => ({
      ...prev,
      dailyUsesRemaining: Math.max(0, prev.dailyUsesRemaining - 1),
    }));
    return true;
  };

  const handleWatchAdBonus = () => {
    setUsageState(prev => ({
      ...prev,
      guestUsesRemaining: prev.guestUsesRemaining + 10,
      dailyUsesRemaining: prev.dailyUsesRemaining + 10,
    }));
  };

  const handleActivateKey = (key: string): boolean => {
    const regex = /^AITI-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (regex.test(key)) {
      setUsageState(prev => ({
        ...prev,
        userType: 'premium',
        licenseKey: key,
        dailyUsesRemaining: -1,
      }));
      return true;
    }
    return false;
  };

  const handleSelectPlan = (plan: 'free' | 'standard' | 'premium') => {
    if (plan === 'free') {
      setUsageState(prev => ({
        ...prev,
        userType: 'guest',
        guestUsesRemaining: 10,
      }));
    } else if (plan === 'standard') {
      setUsageState(prev => ({
        ...prev,
        userType: 'standard',
        dailyUsesRemaining: 250,
        isTrialActive: true,
      }));
    } else {
      setUsageState(prev => ({
        ...prev,
        userType: 'premium',
        dailyUsesRemaining: -1,
        isTrialActive: true,
      }));
    }
    setIsPricingOpen(false);
  };

  const handleScrollToTools = () => {
    const el = document.getElementById('tools');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] dark:bg-[#14221f] text-[#172b28] dark:text-[#e2ede7] flex flex-col font-sans transition-colors duration-200 pb-20 md:pb-0">
      {/* Desktop / Windows Interactive Custom Mouse Animation with Tool Icon */}
      <MouseAnimation />

      {/* Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenSearch={() => {
          const searchInput = document.getElementById('tool-grid-search-input');
          searchInput?.focus();
          searchInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenTestCenter={() => setIsTestCenterOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenInstaller={() => setIsInstallerOpen(true)}
        usageState={usageState}
      />

      {/* Main Flagship Dropzone Hero */}
      <main className="flex-1">
        <DropZoneHero
          allTools={TOOLS_DATABASE}
          onSelectTool={handleSelectTool}
        />

        {/* 200+ Tools Explorer Grid */}
        <ToolGrid
          categories={TOOL_CATEGORIES}
          tools={TOOLS_DATABASE}
          onSelectTool={handleSelectTool}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </main>

      {/* Footer */}
      <Footer
        onSelectTool={handleSelectTool}
        onOpenTestCenter={() => setIsTestCenterOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Unique & Loved Mobile Floating Navigation Dock */}
      <MobileDock
        onOpenQuickDrop={() => setIsQuickDropOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenSearch={() => {
          const searchInput = document.getElementById('tool-grid-search-input');
          searchInput?.focus();
          searchInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onScrollToTools={handleScrollToTools}
      />

      {/* Mobile Quick Drop Sheet */}
      <MobileQuickDropSheet
        isOpen={isQuickDropOpen}
        onClose={() => setIsQuickDropOpen(false)}
        onSelectTool={handleSelectTool}
      />

      {/* Modals & Dialogs */}

      {/* 1. Tool Runner Workspace */}
      {activeTool && (
        <ToolRunnerModal
          tool={activeTool}
          initialPayload={stagedPayload}
          onClose={() => {
            setActiveTool(null);
            setStagedPayload(undefined);
          }}
          onSelectRelatedTool={handleSelectTool}
          usageState={usageState}
          onConsumeUsage={handleConsumeUsage}
        />
      )}

      {/* 2. Gemini Multi-Turn AI Chatbot with High Thinking Mode */}
      {isChatOpen && (
        <GeminiChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      {/* 3. Live System Diagnostic Test Center */}
      {isTestCenterOpen && (
        <LiveTestCenter
          isOpen={isTestCenterOpen}
          onClose={() => setIsTestCenterOpen(false)}
        />
      )}

      {/* 4. Plans & Monetization */}
      {isPricingOpen && (
        <MonetizationModal
          isOpen={isPricingOpen}
          onClose={() => setIsPricingOpen(false)}
          usageState={usageState}
          onSelectPlan={handleSelectPlan}
          onWatchAdBonus={handleWatchAdBonus}
          onActivateKey={handleActivateKey}
        />
      )}

      {/* 5. 24-Section Super Admin Console with Master Credentials Authentication */}
      {isAdminOpen && (
        <AdminPanelModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          tools={TOOLS_DATABASE}
          onToggleToolStatus={slug => console.log('Toggled', slug)}
        />
      )}

      {/* 6. 35-Article Documentation Viewer */}
      {isDocsOpen && (
        <DocumentationViewer
          isOpen={isDocsOpen}
          onClose={() => setIsDocsOpen(false)}
          onLaunchTool={handleSelectTool}
        />
      )}

      {/* 7. 7-Step Commercial Installer Simulator */}
      {isInstallerOpen && (
        <InstallerModal
          isOpen={isInstallerOpen}
          onClose={() => setIsInstallerOpen(false)}
        />
      )}

      {/* Cookie & DPDP Consent Banner */}
      <CookieConsentBanner onConsentChange={accepted => console.log('Cookie consent:', accepted)} />
    </div>
  );
}
