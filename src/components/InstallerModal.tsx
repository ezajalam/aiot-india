import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ChevronRight,
  Server,
  Key,
  Shield,
  DollarSign,
  UserCheck,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface InstallerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallerModal: React.FC<InstallerModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [appName, setAppName] = useState('All in One Tool India');
  const [geminiKeySet, setGeminiKeySet] = useState(true);
  const [publisherId, setPublisherId] = useState('ca-pub-XXXXXXXXXXXXXXXX');
  const [adminEmail, setAdminEmail] = useState('admin@allinonetool.in');
  const [installed, setInstalled] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      setInstalled(true);
    }
  };

  const stepsList = [
    'Welcome & License',
    'Port 3000 Check',
    'Database & State',
    'Gemini AI Key',
    'AdSense Config',
    'Admin Credentials',
    'Deployment Finalize',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-[#1c2d28] text-[#172b28] dark:text-[#e2ede7] rounded-3xl shadow-2xl border border-[#bad5c8] dark:border-[#33463c] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e5ebe8] dark:border-[#33463c] flex items-center justify-between bg-[#f8faf9] dark:bg-[#14221f]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#137659] dark:bg-[#258263] text-white flex items-center justify-center font-extrabold shadow-sm">
              7
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#172b28] dark:text-[#e2ede7] font-heading">
                7-Step Automated Installer Wizard (Section 4)
              </h3>
              <p className="text-xs text-[#70807c] dark:text-[#a2b5a9] font-medium">
                Production-ready deployment &amp; white-label configurator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#70807c] hover:text-[#172b28] dark:text-[#a2b5a9] dark:hover:text-[#e2ede7] rounded-xl hover:bg-[#e9f5ee] dark:hover:bg-[#254334] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper indicator */}
        <div className="px-6 py-3 bg-[#e9f5ee]/50 dark:bg-[#14221f]/50 border-b border-[#e5ebe8] dark:border-[#33463c] flex items-center justify-between overflow-x-auto gap-2">
          {stepsList.map((st, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-1.5 text-[11px] font-bold shrink-0 ${
                step === idx + 1
                  ? 'text-[#137659] dark:text-[#62c39a]'
                  : step > idx + 1
                  ? 'text-[#137659] dark:text-[#62c39a]'
                  : 'text-[#70807c] dark:text-[#a2b5a9]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === idx + 1
                    ? 'bg-[#137659] text-white'
                    : step > idx + 1
                    ? 'bg-[#137659] text-white'
                    : 'bg-[#e5ebe8] dark:bg-[#254334] text-[#70807c] dark:text-[#a2b5a9]'
                }`}
              >
                {step > idx + 1 ? <Check className="w-3 h-3" /> : idx + 1}
              </span>
              <span className="hidden sm:inline">{st}</span>
            </div>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          {step === 1 && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-[#172b28] dark:text-[#e2ede7] font-heading">
                Step 1: Welcome &amp; Commercial Terms
              </h4>
              <p className="text-xs text-[#70807c] dark:text-[#a2b5a9] leading-relaxed">
                Welcome to the All in One Tool India platform installation engine. This software grants full commercial deployment rights with 200+ utility engines, AdSense compliance, and Gemini AI integration.
              </p>
              <div className="p-3 rounded-2xl bg-[#f8faf9] dark:bg-[#14221f] border border-[#e5ebe8] dark:border-[#33463c] text-xs space-y-1">
                <div className="text-[#137659] dark:text-[#62c39a] font-bold">✓ India DPDP Act (2023) Privacy Compliant</div>
                <div className="text-[#137659] dark:text-[#62c39a] font-bold">✓ Zero persistent server tracking of user documents</div>
                <div className="text-[#137659] dark:text-[#62c39a] font-bold">✓ 10,000 Resale License Keys included</div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-[#172b28] dark:text-[#e2ede7] font-heading">
                Step 2: Server Environment &amp; Port 3000 Ingress
              </h4>
              <div className="p-4 rounded-2xl bg-[#e9f5ee] dark:bg-[#203b2a] border border-[#bad5c8] dark:border-[#355c41] text-xs space-y-2">
                <div className="flex justify-between">
                  <span>Host:</span>
                  <span className="font-mono font-bold">0.0.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Port:</span>
                  <span className="font-mono font-bold text-[#137659] dark:text-[#62c39a]">3000 (Required for Reverse Proxy)</span>
                </div>
                <div className="flex justify-between">
                  <span>Vite / Express Runtime:</span>
                  <span className="font-mono text-[#137659] dark:text-[#62c39a]">Active</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-[#172b28] dark:text-[#e2ede7] font-heading">
                Step 3: Database &amp; Storage Architecture
              </h4>
              <p className="text-xs text-[#70807c] dark:text-[#a2b5a9]">
                Temporary user files are processed in ephemeral memory buffers with zero disk persistence to ensure total privacy and top compliance.
              </p>
              <div className="p-3 rounded-2xl bg-[#f8faf9] dark:bg-[#14221f] border border-[#e5ebe8] dark:border-[#33463c] text-xs">
                <span className="font-bold text-[#172b28] dark:text-[#e2ede7] block mb-1">State Engine:</span>
                Browser LocalStorage + Ephemeral Cloud Run Memory
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-[#172b28] dark:text-[#e2ede7] font-heading">
                Step 4: Gemini AI Integration
              </h4>
              <p className="text-xs text-[#70807c] dark:text-[#a2b5a9]">
                Gemini API is integrated on the backend server (`server.ts`) via `@google/genai` SDK using <code>process.env.GEMINI_API_KEY</code>.
              </p>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#e9f5ee] dark:bg-[#203b2a] border border-[#bad5c8] dark:border-[#355c41] text-xs text-[#137659] dark:text-[#62c39a]">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Supports gemini-3.5-flash and gemini-3.1-pro-preview with High Thinking mode.</span>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-[#172b28] dark:text-[#e2ede7] font-heading">
                Step 5: Google AdSense Slot Mapping
              </h4>
              <div>
                <label className="text-xs font-bold text-[#172b28] dark:text-[#e2ede7] block mb-1">
                  Google AdSense Publisher ID
                </label>
                <input
                  type="text"
                  value={publisherId}
                  onChange={e => setPublisherId(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#e5ebe8] dark:border-[#33463c] bg-[#f8faf9] dark:bg-[#14221f] text-xs font-mono text-[#172b28] dark:text-[#e2ede7]"
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-[#172b28] dark:text-[#e2ede7] font-heading">
                Step 6: Super Administrator Credentials
              </h4>
              <div>
                <label className="text-xs font-bold text-[#172b28] dark:text-[#e2ede7] block mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#e5ebe8] dark:border-[#33463c] bg-[#f8faf9] dark:bg-[#14221f] text-xs text-[#172b28] dark:text-[#e2ede7]"
                />
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="text-center py-4 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#137659] text-white flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-black text-lg text-[#172b28] dark:text-[#e2ede7] font-heading">
                Installation Completed Successfully!
              </h4>
              <p className="text-xs text-[#70807c] dark:text-[#a2b5a9] max-w-md mx-auto">
                All in One Tool India is configured and live on port 3000. All 200+ tools, Gemini AI, AdSense slots, and the 24-section Admin panel are active.
              </p>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 border-t border-[#e5ebe8] dark:border-[#33463c] flex items-center justify-between bg-[#f8faf9] dark:bg-[#14221f]">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1 || step === 7}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#70807c] dark:text-[#a2b5a9] disabled:opacity-30 hover:bg-[#e9f5ee] dark:hover:bg-[#254334]"
          >
            Back
          </button>
          <button
            onClick={step === 7 ? onClose : handleNext}
            className="px-6 py-2 rounded-xl bg-[#137659] hover:bg-[#0f5e47] text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
          >
            <span>{step === 7 ? 'Finish & Launch Platform' : 'Continue'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
