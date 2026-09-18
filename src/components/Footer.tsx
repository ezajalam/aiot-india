import React from 'react';
import {
  Zap,
  ShieldCheck,
  Heart,
  Globe,
  Mail,
  HelpCircle,
  FileText,
  Activity,
  ArrowUp,
} from 'lucide-react';

interface FooterProps {
  onSelectTool: (slug: string) => void;
  onOpenTestCenter: () => void;
  onOpenDocs: () => void;
  onOpenPricing: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTool,
  onOpenTestCenter,
  onOpenDocs,
  onOpenPricing,
  onOpenAdmin,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 border-t border-[#e5ebe8] dark:border-[#33463c] bg-white dark:bg-[#14221f] text-[#70807c] dark:text-[#a2b5a9] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#137659] dark:bg-[#258263] text-white p-0.5 shadow-sm shadow-[#137659]/20 flex items-center justify-center">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-[#172b28] dark:text-[#e2ede7] font-heading">
                  ALL IN ONE TOOL INDIA
                </span>
                <p className="text-xs text-[#70807c] dark:text-[#a2b5a9] font-medium">
                  Drop Anything. Get Useful Tools.
                </p>
              </div>
            </div>

            <p className="text-xs text-[#70807c] dark:text-[#a2b5a9] leading-relaxed max-w-sm">
              Next-generation online utility platform with 200+ fast, client-side tools. Real image compression, PDF merge &amp; watermark generators, financial calculators, and Gemini AI.
            </p>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#137659] dark:text-[#62c39a] font-bold bg-[#e9f5ee] dark:bg-[#203b2a] px-3 py-1 rounded-xl border border-[#bad5c8] dark:border-[#355c41]">
                <ShieldCheck className="w-4 h-4" />
                India DPDP Act (2023) Compliant
              </span>
            </div>
          </div>

          {/* Col 2: Popular Calculators */}
          <div>
            <h4 className="font-bold text-xs text-[#172b28] dark:text-[#e2ede7] uppercase tracking-wider mb-3 font-heading">
              Finance &amp; India Tools
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => onSelectTool('gst-calculator')}
                  className="hover:text-[#137659] dark:hover:text-[#62c39a] hover:underline transition-colors"
                >
                  GST Calculator (CGST/SGST/IGST)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('emi-calculator')}
                  className="hover:text-[#137659] dark:hover:text-[#62c39a] hover:underline transition-colors"
                >
                  Home &amp; Car EMI Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('sip-calculator')}
                  className="hover:text-[#137659] dark:hover:text-[#62c39a] hover:underline transition-colors"
                >
                  Mutual Fund SIP Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('income-tax-calculator')}
                  className="hover:text-[#137659] dark:hover:text-[#62c39a] hover:underline transition-colors"
                >
                  New vs Old Income Tax (FY 24-25)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('upi-qr-code-generator')}
                  className="hover:text-[#137659] dark:hover:text-[#62c39a] hover:underline transition-colors"
                >
                  Instant UPI QR Code Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Media & PDF */}
          <div>
            <h4 className="font-bold text-xs text-[#172b28] dark:text-[#e2ede7] uppercase tracking-wider mb-3 font-heading">
              Image &amp; PDF Engines
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => onSelectTool('image-compressor')}
                  className="hover:text-[#137659] dark:hover:text-[#62c39a] hover:underline transition-colors"
                >
                  Target KB Image Compressor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('pdf-compressor')}
                  className="hover:text-[#137659] dark:hover:text-[#62c39a] hover:underline transition-colors"
                >
                  Client-Side PDF Compressor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('merge-pdf')}
                  className="hover:text-[#137659] dark:hover:text-[#62c39a] hover:underline transition-colors"
                >
                  Merge Multiple PDFs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('passport-photo-maker')}
                  className="hover:text-[#137659] dark:hover:text-[#62c39a] hover:underline transition-colors"
                >
                  Indian Passport Photo Maker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('protect-pdf')}
                  className="hover:text-[#137659] dark:hover:text-[#62c39a] hover:underline transition-colors"
                >
                  Watermark &amp; Protect PDF
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Compliance */}
          <div>
            <h4 className="font-bold text-xs text-[#172b28] dark:text-[#e2ede7] uppercase tracking-wider mb-3 font-heading">
              Platform &amp; Diagnostics
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={onOpenTestCenter}
                  className="hover:text-[#137659] dark:hover:text-[#62c39a] hover:underline transition-colors flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-[#137659] dark:text-[#62c39a]" />
                  Self-Test Suite (10 Engines)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPricing}
                  className="hover:text-[#137659] dark:hover:text-[#62c39a] hover:underline transition-colors"
                >
                  SaaS Plans &amp; Commercial Quotas
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDocs}
                  className="hover:text-[#137659] dark:hover:text-[#62c39a] hover:underline transition-colors"
                >
                  Knowledge Base (35 Articles)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-[#137659] dark:hover:text-[#62c39a] hover:underline transition-colors"
                >
                  24-Section Admin Console
                </button>
              </li>
              <li>
                <span className="text-[#bad5c8] dark:text-[#355c41]">
                  Instant Client Processing
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* AdSense Disclaimer & DPDP Statement */}
        <div className="pt-8 border-t border-[#e5ebe8] dark:border-[#33463c] text-[11px] text-[#70807c] dark:text-[#a2b5a9] space-y-2">
          <p>
            <strong className="text-[#172b28] dark:text-[#e2ede7]">Disclaimer:</strong> Financial calculators (GST, EMI, SIP, Income Tax) provide computational estimates for informational and planning purposes only. Please verify specific tax liabilities with a qualified Chartered Accountant (CA) or financial professional before filing statutory returns.
          </p>
          <p>
            <strong className="text-[#172b28] dark:text-[#e2ede7]">Data Privacy:</strong> All in One Tool India processes files and calculations strictly in client-side ephemeral memory. Uploaded documents are converted in your browser. Zero personal files are uploaded to external server storage.
          </p>
        </div>

        {/* Bottom microbar */}
        <div className="mt-8 pt-6 border-t border-[#e5ebe8] dark:border-[#33463c] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} All in One Tool India. Commercial High-Performance Suite.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[#70807c] hover:text-[#137659] dark:text-[#a2b5a9] dark:hover:text-[#62c39a] transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
