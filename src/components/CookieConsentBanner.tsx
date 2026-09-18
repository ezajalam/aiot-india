import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface CookieConsentProps {
  onConsentChange: (accepted: boolean) => void;
}

export const CookieConsentBanner: React.FC<CookieConsentProps> = ({ onConsentChange }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('aiti_cookie_consent');
    if (!saved) {
      setVisible(true);
    } else {
      onConsentChange(saved === 'accepted');
    }
  }, [onConsentChange]);

  const handleAccept = () => {
    localStorage.setItem('aiti_cookie_consent', 'accepted');
    setVisible(false);
    onConsentChange(true);
  };

  const handleDecline = () => {
    localStorage.setItem('aiti_cookie_consent', 'declined');
    setVisible(false);
    onConsentChange(false);
  };

  if (!visible) return null;

  return (
    <div
      id="cookie-consent-banner"
      className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-xl z-50 bg-[#ffffff]/95 dark:bg-[#14221f]/95 backdrop-blur-md text-[#172b28] dark:text-[#e2ede7] p-5 rounded-3xl shadow-2xl border border-[#bad5c8] dark:border-[#33463c] transition-all duration-300 animate-in fade-in slide-in-from-bottom-6"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[#137659] dark:bg-[#258263] flex items-center justify-center shrink-0 shadow-md text-white">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1 text-sm space-y-1.5">
          <h4 className="font-extrabold text-[#172b28] dark:text-[#e2ede7] flex items-center gap-2 font-heading">
            Cookie &amp; Privacy Notice
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#e9f5ee] dark:bg-[#203b2a] text-[#137659] dark:text-[#62c39a] border border-[#bad5c8] dark:border-[#355c41]">
              India DPDP &amp; GDPR
            </span>
          </h4>
          <p className="text-[#70807c] dark:text-[#a2b5a9] text-xs leading-relaxed">
            All in One Tool India uses cookies to analyze traffic, remember your preferences, and serve non-intrusive advertisements. Temporary files uploaded for processing are sanitized and automatically deleted from memory.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <button
              id="accept-cookies-btn"
              onClick={handleAccept}
              className="px-4 py-1.5 rounded-xl bg-[#137659] hover:bg-[#0f5e47] text-white font-bold text-xs shadow-md transition-colors"
            >
              Accept All
            </button>
            <button
              id="decline-cookies-btn"
              onClick={handleDecline}
              className="px-3 py-1.5 rounded-xl bg-[#e9f5ee] hover:bg-[#bad5c8] dark:bg-[#254334] dark:hover:bg-[#355c41] text-[#172b28] dark:text-[#e2ede7] font-semibold text-xs transition-colors"
            >
              Reject Non-Essential
            </button>
            <a
              href="#privacy"
              className="text-[#137659] dark:text-[#62c39a] hover:underline text-xs ml-auto font-medium"
            >
              Privacy Policy
            </a>
          </div>
        </div>
        <button
          onClick={handleDecline}
          className="text-[#70807c] hover:text-[#172b28] dark:text-[#a2b5a9] dark:hover:text-[#e2ede7] transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
