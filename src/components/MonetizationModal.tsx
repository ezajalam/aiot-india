import React, { useState } from 'react';
import {
  X,
  Check,
  Zap,
  Shield,
  CreditCard,
  Gift,
  Key,
  Play,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { UserUsageState } from '../types';

interface MonetizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  usageState: UserUsageState;
  onSelectPlan: (plan: 'free' | 'standard' | 'premium') => void;
  onWatchAdBonus: () => void;
  onActivateKey: (key: string) => boolean;
}

export const MonetizationModal: React.FC<MonetizationModalProps> = ({
  isOpen,
  onClose,
  usageState,
  onSelectPlan,
  onWatchAdBonus,
  onActivateKey,
}) => {
  const [adWatching, setAdWatching] = useState(false);
  const [adCountdown, setAdCountdown] = useState(10);
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [keyStatus, setKeyStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!isOpen) return null;

  const handleStartAd = () => {
    setAdWatching(true);
    setAdCountdown(10);
    const interval = setInterval(() => {
      setAdCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setAdWatching(false);
          onWatchAdBonus();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleKeyRedeem = () => {
    if (!licenseKeyInput.trim()) return;
    const ok = onActivateKey(licenseKeyInput.trim());
    if (ok) {
      setKeyStatus({
        success: true,
        message: 'Resale License Key successfully activated! Enjoy Lifetime Unlimited Premium.',
      });
      setLicenseKeyInput('');
    } else {
      setKeyStatus({
        success: false,
        message: 'Invalid key format. Expected: AITI-XXXX-XXXX-XXXX-XXXX',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              Flexible Plans & Usage Quota
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                7-Day Free Trial
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Affordable Indian pricing in INR (₹) · UPI, Cards & NetBanking accepted
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Current Status banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                  Current Quota
                </span>
                <div className="text-base font-extrabold text-slate-900 dark:text-white">
                  {usageState.userType === 'guest'
                    ? `Guest: ${usageState.guestUsesRemaining} of 10 Free Uses Remaining`
                    : usageState.userType === 'standard'
                    ? `Standard Plan: ${usageState.dailyUsesRemaining} Uses Remaining`
                    : 'Lifetime / Premium Unlimited Plan Active'}
                </div>
              </div>
            </div>

            {/* Quick Watch Ad Bonus button */}
            <div className="w-full sm:w-auto">
              <button
                onClick={handleStartAd}
                disabled={adWatching}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {adWatching ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Watching Ad ({adCountdown}s remaining)...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    Watch 10-Sec Ad for +10 Uses
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Free Tier */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Free Forever
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                    Default
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                  ₹0
                  <span className="text-xs font-normal text-slate-400"> / month</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Essential tools for occasional tasks and quick file conversions.
                </p>

                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>10 Free uses per session</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Standard PDF & Image tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Watch quick video for +10 uses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Ad-supported access</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSelectPlan('free')}
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
              >
                Continue Free
              </button>
            </div>

            {/* Standard Tier */}
            <div className="p-5 rounded-2xl border-2 border-amber-500/80 bg-amber-50/20 dark:bg-amber-950/10 flex flex-col justify-between relative shadow-lg">
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm">
                Most Popular
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                    Standard
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold">
                    7-Day Trial
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                  ₹9
                  <span className="text-xs font-normal text-slate-400"> / month</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  For students, accountants, and freelancers handling daily documents.
                </p>

                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-semibold">250 Tool uses per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Ad-Free experience</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Priority high-speed processing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Standard Gemini AI tokens</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSelectPlan('standard')}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-md transition-colors"
              >
                Start 7-Day Free Trial (₹9/mo)
              </button>
            </div>

            {/* Premium Tier */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">
                    Premium Pro
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold">
                    Unlimited
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                  ₹29
                  <span className="text-xs font-normal text-slate-400"> / month</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Full power for businesses, power users, and software developers.
                </p>

                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-semibold">Unlimited tool executions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Gemini 3.1 Pro High Thinking access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Batch file processing (10 files at once)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Zero Ads + 24/7 priority support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSelectPlan('premium')}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-colors"
              >
                Get Premium (₹29/mo)
              </button>
            </div>
          </div>

          {/* Resale License Key Activation (Section 21 & 118) */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                Have a Lifetime Resale License Key?
              </h4>
            </div>
            <p className="text-[11px] text-slate-500">
              Enter your pre-generated 24-character Resale Key (e.g., AITI-9F4K-M2P7-X8R1-Q6L9) to activate lifetime unrestricted access immediately.
            </p>

            <div className="flex gap-2">
              <input
                id="license-key-redeem-input"
                type="text"
                value={licenseKeyInput}
                onChange={e => setLicenseKeyInput(e.target.value.toUpperCase())}
                placeholder="AITI-XXXX-XXXX-XXXX-XXXX"
                className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white uppercase tracking-wider"
              />
              <button
                onClick={handleKeyRedeem}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold transition-colors"
              >
                Redeem Key
              </button>
            </div>

            {keyStatus && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  keyStatus.success
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                }`}
              >
                {keyStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{keyStatus.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
