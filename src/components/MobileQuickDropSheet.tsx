import React, { useRef } from 'react';
import {
  X,
  Camera,
  Image as ImageIcon,
  FileText,
  Clipboard,
  Zap,
  ArrowRight,
  Sparkles,
  QrCode,
  Calculator,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MobileQuickDropSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolSlug: string, initialPayload?: { type: string; data: string | File; fileName?: string }) => void;
}

export const MobileQuickDropSheet: React.FC<MobileQuickDropSheetProps> = ({
  isOpen,
  onClose,
  onSelectTool,
}) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, preferredTool: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onSelectTool(preferredTool, {
        type: 'file',
        data: file,
        fileName: file.name,
      });
      onClose();
    }
  };

  const handleClipboardPaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          onSelectTool('word-counter', {
            type: 'text',
            data: text,
          });
          onClose();
          return;
        }
      }
      onSelectTool('word-counter');
      onClose();
    } catch {
      onSelectTool('word-counter');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm md:hidden animate-in fade-in">
        {/* Hidden mobile inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={e => handleFileChange(e, 'image-compressor')}
          className="hidden"
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={e => handleFileChange(e, 'image-compressor')}
          className="hidden"
        />
        <input
          ref={pdfInputRef}
          type="file"
          accept="application/pdf"
          onChange={e => handleFileChange(e, 'pdf-compressor')}
          className="hidden"
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 270 }}
          className="w-full bg-white dark:bg-[#1c2d28] border-t border-[#bad5c8] dark:border-[#33463c] rounded-t-[32px] p-6 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto text-[#172b28] dark:text-[#e2ede7]"
        >
          {/* Drag Handle Bar */}
          <div className="w-12 h-1.5 rounded-full bg-[#bad5c8] dark:bg-[#355c41] mx-auto -mt-2"></div>

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-[#137659] dark:bg-[#258263] text-white">
                  <Zap className="w-4 h-4 fill-current" />
                </span>
                <h3 className="font-extrabold text-lg text-[#172b28] dark:text-[#e2ede7] tracking-tight font-heading">
                  Mobile Quick Drop
                </h3>
              </div>
              <p className="text-xs text-[#70807c] dark:text-[#a2b5a9] mt-0.5 font-medium">
                Instant smartphone actions &amp; client-side processing
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#70807c] hover:text-[#172b28] dark:text-[#a2b5a9] dark:hover:text-[#e2ede7] hover:bg-[#e9f5ee] dark:hover:bg-[#254334] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Fast Mobile Action Tiles */}
          <div className="grid grid-cols-2 gap-3">
            {/* 1. Camera Snap */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="p-4 rounded-2xl bg-[#f8faf9] dark:bg-[#14221f] border border-[#e5ebe8] dark:border-[#33463c] hover:border-[#137659] dark:hover:border-[#62c39a] transition-all text-left flex flex-col justify-between h-28 group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#137659] text-white flex items-center justify-center shadow-sm">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-bold text-xs text-[#172b28] dark:text-[#e2ede7]">
                  Snap &amp; Compress
                </span>
                <span className="text-[10px] text-[#70807c] dark:text-[#a2b5a9]">
                  Direct camera capture
                </span>
              </div>
            </button>

            {/* 2. Photo Gallery */}
            <button
              onClick={() => galleryInputRef.current?.click()}
              className="p-4 rounded-2xl bg-[#f8faf9] dark:bg-[#14221f] border border-[#e5ebe8] dark:border-[#33463c] hover:border-[#137659] dark:hover:border-[#62c39a] transition-all text-left flex flex-col justify-between h-28 group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#137659] text-white flex items-center justify-center shadow-sm">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-bold text-xs text-[#172b28] dark:text-[#e2ede7]">
                  Choose Photo
                </span>
                <span className="text-[10px] text-[#70807c] dark:text-[#a2b5a9]">
                  Convert / Resize / WebP
                </span>
              </div>
            </button>

            {/* 3. PDF Document */}
            <button
              onClick={() => pdfInputRef.current?.click()}
              className="p-4 rounded-2xl bg-[#f8faf9] dark:bg-[#14221f] border border-[#e5ebe8] dark:border-[#33463c] hover:border-[#137659] dark:hover:border-[#62c39a] transition-all text-left flex flex-col justify-between h-28 group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#137659] text-white flex items-center justify-center shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-bold text-xs text-[#172b28] dark:text-[#e2ede7]">
                  Pick PDF
                </span>
                <span className="text-[10px] text-[#70807c] dark:text-[#a2b5a9]">
                  Compress or Watermark
                </span>
              </div>
            </button>

            {/* 4. Clipboard Text */}
            <button
              onClick={handleClipboardPaste}
              className="p-4 rounded-2xl bg-[#f8faf9] dark:bg-[#14221f] border border-[#e5ebe8] dark:border-[#33463c] hover:border-[#137659] dark:hover:border-[#62c39a] transition-all text-left flex flex-col justify-between h-28 group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#137659] text-white flex items-center justify-center shadow-sm">
                <Clipboard className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-bold text-xs text-[#172b28] dark:text-[#e2ede7]">
                  Paste Clipboard
                </span>
                <span className="text-[10px] text-[#70807c] dark:text-[#a2b5a9]">
                  Count words / AI format
                </span>
              </div>
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-2 pt-2 border-t border-[#e5ebe8] dark:border-[#33463c]">
            <span className="text-[11px] font-bold text-[#70807c] dark:text-[#a2b5a9] uppercase tracking-wider block">
              Top India Mobile Utilities
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { onSelectTool('gst-calculator'); onClose(); }}
                className="flex items-center gap-2 p-3 rounded-xl bg-[#e9f5ee] dark:bg-[#254334] text-left text-xs font-bold text-[#137659] dark:text-[#62c39a] hover:bg-[#bad5c8] dark:hover:bg-[#355c41] transition-colors"
              >
                <Calculator className="w-4 h-4 text-[#137659] dark:text-[#62c39a]" />
                <span>GST Calculator</span>
              </button>
              <button
                onClick={() => { onSelectTool('upi-qr-code-generator'); onClose(); }}
                className="flex items-center gap-2 p-3 rounded-xl bg-[#e9f5ee] dark:bg-[#254334] text-left text-xs font-bold text-[#137659] dark:text-[#62c39a] hover:bg-[#bad5c8] dark:hover:bg-[#355c41] transition-colors"
              >
                <QrCode className="w-4 h-4 text-[#137659] dark:text-[#62c39a]" />
                <span>UPI Payment QR</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
