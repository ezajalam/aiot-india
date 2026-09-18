import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Code2,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileArchive,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ToolDefinition } from '../types';

interface DropZoneHeroProps {
  onSelectTool: (toolSlug: string, initialPayload?: { type: string; data: string | File; fileName?: string }) => void;
  allTools: ToolDefinition[];
}

export const DropZoneHero: React.FC<DropZoneHeroProps> = ({ onSelectTool, allTools }) => {
  const [activeTab, setActiveTab] = useState<'file' | 'text' | 'url'>('file');
  const [isDragging, setIsDragging] = useState(false);
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [detectedFileName, setDetectedFileName] = useState<string | null>(null);
  const [detectedFileSize, setDetectedFileSize] = useState<string | null>(null);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setStagedFile(file);
    setDetectedFileName(file.name);
    setDetectedFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (file.type === 'application/pdf' || ext === 'pdf') {
      setDetectedType('pdf');
    } else if (file.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext || '')) {
      setDetectedType('image');
    } else if (['json', 'xml', 'html', 'css', 'js', 'ts', 'sql', 'csv'].includes(ext || '')) {
      setDetectedType('code');
    } else {
      setDetectedType('text');
    }
  };

  const resetDropzone = () => {
    setDetectedType(null);
    setDetectedFileName(null);
    setDetectedFileSize(null);
    setStagedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLaunchTool = (slug: string) => {
    if (stagedFile) {
      onSelectTool(slug, {
        type: 'file',
        data: stagedFile,
        fileName: detectedFileName || stagedFile.name,
      });
    } else if (textInput.trim()) {
      onSelectTool(slug, {
        type: 'text',
        data: textInput,
      });
    } else if (urlInput.trim()) {
      onSelectTool(slug, {
        type: 'text',
        data: urlInput,
      });
    } else {
      onSelectTool(slug);
    }
  };

  return (
    <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto emerald-radial-hero overflow-hidden">
      {/* Hero Headline & Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center max-w-3xl mx-auto mb-10 space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#e9f5ee] dark:bg-[#203b2a] text-[#137659] dark:text-[#62c39a] border border-[#bad5c8] dark:border-[#355c41] shadow-2xs">
          <Zap className="w-3.5 h-3.5 fill-current text-[#137659] dark:text-[#62c39a]" />
          <span>India’s Everyday Toolbox · 200+ Client-Side Online Utilities</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#172b28] dark:text-[#e2ede7] leading-tight font-heading">
          Drop Anything.{' '}
          <span className="underline decoration-[#137659]/50 dark:decoration-[#62c39a]/50 underline-offset-8">
            Get Useful Tools.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#70807c] dark:text-[#a2b5a9] font-medium max-w-2xl mx-auto leading-relaxed">
          Compress &amp; convert actual images and PDFs directly in your browser. Calculate GST &amp; EMI, generate UPI QR codes, format code, and chat with Gemini AI.
        </p>

        {/* Quick launch tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <button
            onClick={() => onSelectTool('image-compressor')}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-[#e9f5ee] dark:bg-[#1c2d28] text-[#137659] dark:text-[#62c39a] border border-[#bad5c8] dark:border-[#33463c] hover:bg-[#137659] hover:text-white dark:hover:bg-[#62c39a] dark:hover:text-[#14221f] transition-all flex items-center gap-1"
          >
            <ImageIcon className="w-3 h-3" />
            Image Compressor
          </button>
          <button
            onClick={() => onSelectTool('pdf-compressor')}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-[#e9f5ee] dark:bg-[#1c2d28] text-[#137659] dark:text-[#62c39a] border border-[#bad5c8] dark:border-[#33463c] hover:bg-[#137659] hover:text-white dark:hover:bg-[#62c39a] dark:hover:text-[#14221f] transition-all flex items-center gap-1"
          >
            <FileText className="w-3 h-3" />
            PDF Compressor
          </button>
          <button
            onClick={() => onSelectTool('gst-calculator')}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-[#e9f5ee] dark:bg-[#1c2d28] text-[#137659] dark:text-[#62c39a] border border-[#bad5c8] dark:border-[#33463c] hover:bg-[#137659] hover:text-white dark:hover:bg-[#62c39a] dark:hover:text-[#14221f] transition-all"
          >
            GST Calculator
          </button>
          <button
            onClick={() => onSelectTool('upi-qr-code-generator')}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-[#e9f5ee] dark:bg-[#1c2d28] text-[#137659] dark:text-[#62c39a] border border-[#bad5c8] dark:border-[#33463c] hover:bg-[#137659] hover:text-white dark:hover:bg-[#62c39a] dark:hover:text-[#14221f] transition-all"
          >
            UPI QR Code
          </button>
        </div>
      </motion.div>

      {/* Central Smart Drop Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="max-w-3xl mx-auto bg-white dark:bg-[#1c2d28] backdrop-blur-xl rounded-3xl shadow-[0_12px_40px_rgba(22,55,44,0.06)] border border-[#e5ebe8] dark:border-[#33463c] p-4 sm:p-7 transition-all"
      >
        {/* Mode Switcher */}
        <div className="flex items-center justify-center gap-1.5 mb-5 p-1.5 bg-[#f8faf9] dark:bg-[#14221f] rounded-2xl max-w-sm mx-auto border border-[#e5ebe8] dark:border-[#33463c]">
          <button
            onClick={() => { setActiveTab('file'); resetDropzone(); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'file'
                ? 'bg-[#137659] dark:bg-[#258263] text-white shadow-sm'
                : 'text-[#70807c] hover:text-[#137659] dark:text-[#a2b5a9] dark:hover:text-[#62c39a]'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Upload File
          </button>
          <button
            onClick={() => { setActiveTab('text'); resetDropzone(); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'text'
                ? 'bg-[#137659] dark:bg-[#258263] text-white shadow-sm'
                : 'text-[#70807c] hover:text-[#137659] dark:text-[#a2b5a9] dark:hover:text-[#62c39a]'
            }`}
          >
            <FileText className="w-4 h-4" />
            Paste Text
          </button>
          <button
            onClick={() => { setActiveTab('url'); resetDropzone(); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'url'
                ? 'bg-[#137659] dark:bg-[#258263] text-white shadow-sm'
                : 'text-[#70807c] hover:text-[#137659] dark:text-[#a2b5a9] dark:hover:text-[#62c39a]'
            }`}
          >
            <Globe className="w-4 h-4" />
            Enter URL
          </button>
        </div>

        {/* Tab 1: File Upload Mode */}
        {activeTab === 'file' && (
          <div>
            {!detectedType ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all ${
                  isDragging
                    ? 'border-[#137659] dark:border-[#62c39a] bg-[#e9f5ee] dark:bg-[#203b2a] scale-[1.01]'
                    : 'border-[#bad5c8] dark:border-[#355c41] hover:border-[#137659] dark:hover:border-[#62c39a] hover:bg-[#e9f5ee]/40 dark:hover:bg-[#203b2a]/40 bg-[#f8faf9]/60 dark:bg-[#14221f]/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="w-16 h-16 rounded-3xl bg-[#e9f5ee] dark:bg-[#254334] text-[#137659] dark:text-[#62c39a] mx-auto flex items-center justify-center mb-4 border border-[#bad5c8] dark:border-[#355c41] shadow-xs"
                >
                  <UploadCloud className="w-8 h-8" />
                </motion.div>
                <h3 className="text-lg font-extrabold text-[#172b28] dark:text-[#e2ede7] mb-1 font-heading">
                  Drag &amp; Drop any file here
                </h3>
                <p className="text-xs sm:text-sm text-[#70807c] dark:text-[#a2b5a9] mb-4">
                  or{' '}
                  <span className="text-[#137659] dark:text-[#62c39a] font-bold underline">
                    browse from your computer or phone
                  </span>
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#70807c] dark:text-[#a2b5a9]">
                  <span className="px-2.5 py-0.5 rounded-lg bg-white dark:bg-[#1c2d28] border border-[#e5ebe8] dark:border-[#33463c] font-medium">
                    PDF Documents
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-white dark:bg-[#1c2d28] border border-[#e5ebe8] dark:border-[#33463c] font-medium">
                    JPG / PNG / WebP
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-white dark:bg-[#1c2d28] border border-[#e5ebe8] dark:border-[#33463c] font-medium">
                    JSON / SQL / Code
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-white dark:bg-[#1c2d28] border border-[#e5ebe8] dark:border-[#33463c] font-medium">
                    Max 50MB
                  </span>
                </div>
              </div>
            ) : (
              /* Smart Detection Panel */
              <div className="rounded-3xl border border-[#bad5c8] dark:border-[#355c41] bg-[#e9f5ee]/40 dark:bg-[#203b2a]/30 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#137659] text-white dark:bg-[#258263] flex items-center justify-center font-bold shadow-md shadow-[#137659]/20">
                      {detectedType === 'pdf' ? (
                        <FileText className="w-6 h-6" />
                      ) : (
                        <ImageIcon className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-[#137659] dark:text-[#62c39a]">
                          {detectedType.toUpperCase()} File Detected
                        </span>
                        <CheckCircle2 className="w-4 h-4 text-[#137659] dark:text-[#62c39a]" />
                      </div>
                      <p className="font-bold text-sm text-[#172b28] dark:text-[#e2ede7] truncate max-w-xs sm:max-w-md">
                        {detectedFileName}{' '}
                        <span className="text-xs text-[#70807c] dark:text-[#a2b5a9] font-normal">
                          ({detectedFileSize})
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetDropzone}
                    className="text-xs font-semibold text-[#70807c] hover:text-[#137659] dark:text-[#a2b5a9] dark:hover:text-[#62c39a] flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-[#e9f5ee] dark:hover:bg-[#254334] transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Change</span>
                  </button>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#bad5c8]/50 dark:border-[#355c41]">
                  <p className="text-xs font-bold text-[#172b28] dark:text-[#e2ede7]">
                    Recommended utilities for this file:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {detectedType === 'pdf' && (
                      <>
                        <button
                          onClick={() => handleLaunchTool('pdf-compressor')}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1c2d28] border border-[#e5ebe8] dark:border-[#33463c] hover:border-[#137659] dark:hover:border-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#203b2a] text-left text-xs font-bold text-[#172b28] dark:text-[#e2ede7] transition-all group"
                        >
                          <span>Compress PDF</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#137659] dark:text-[#62c39a]" />
                        </button>
                        <button
                          onClick={() => handleLaunchTool('merge-pdf')}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1c2d28] border border-[#e5ebe8] dark:border-[#33463c] hover:border-[#137659] dark:hover:border-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#203b2a] text-left text-xs font-bold text-[#172b28] dark:text-[#e2ede7] transition-all group"
                        >
                          <span>Merge PDF</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#137659] dark:text-[#62c39a]" />
                        </button>
                        <button
                          onClick={() => handleLaunchTool('protect-pdf')}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1c2d28] border border-[#e5ebe8] dark:border-[#33463c] hover:border-[#137659] dark:hover:border-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#203b2a] text-left text-xs font-bold text-[#172b28] dark:text-[#e2ede7] transition-all group"
                        >
                          <span>Watermark</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#137659] dark:text-[#62c39a]" />
                        </button>
                        <button
                          onClick={() => handleLaunchTool('pdf-to-jpg')}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1c2d28] border border-[#e5ebe8] dark:border-[#33463c] hover:border-[#137659] dark:hover:border-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#203b2a] text-left text-xs font-bold text-[#172b28] dark:text-[#e2ede7] transition-all group"
                        >
                          <span>Rotate PDF</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#137659] dark:text-[#62c39a]" />
                        </button>
                      </>
                    )}

                    {detectedType === 'image' && (
                      <>
                        <button
                          onClick={() => handleLaunchTool('image-compressor')}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1c2d28] border border-[#e5ebe8] dark:border-[#33463c] hover:border-[#137659] dark:hover:border-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#203b2a] text-left text-xs font-bold text-[#172b28] dark:text-[#e2ede7] transition-all group"
                        >
                          <span>Compress Image</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#137659] dark:text-[#62c39a]" />
                        </button>
                        <button
                          onClick={() => handleLaunchTool('image-resizer')}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1c2d28] border border-[#e5ebe8] dark:border-[#33463c] hover:border-[#137659] dark:hover:border-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#203b2a] text-left text-xs font-bold text-[#172b28] dark:text-[#e2ede7] transition-all group"
                        >
                          <span>Resize Image</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#137659] dark:text-[#62c39a]" />
                        </button>
                        <button
                          onClick={() => handleLaunchTool('jpg-to-webp')}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1c2d28] border border-[#e5ebe8] dark:border-[#33463c] hover:border-[#137659] dark:hover:border-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#203b2a] text-left text-xs font-bold text-[#172b28] dark:text-[#e2ede7] transition-all group"
                        >
                          <span>Convert to WebP</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#137659] dark:text-[#62c39a]" />
                        </button>
                        <button
                          onClick={() => handleLaunchTool('passport-photo-maker')}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1c2d28] border border-[#e5ebe8] dark:border-[#33463c] hover:border-[#137659] dark:hover:border-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#203b2a] text-left text-xs font-bold text-[#172b28] dark:text-[#e2ede7] transition-all group"
                        >
                          <span>Passport Photo</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#137659] dark:text-[#62c39a]" />
                        </button>
                      </>
                    )}

                    {(detectedType === 'code' || detectedType === 'text') && (
                      <>
                        <button
                          onClick={() => handleLaunchTool('json-formatter')}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1c2d28] border border-[#e5ebe8] dark:border-[#33463c] hover:border-[#137659] dark:hover:border-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#203b2a] text-left text-xs font-bold text-[#172b28] dark:text-[#e2ede7] transition-all group"
                        >
                          <span>JSON Formatter</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#137659] dark:text-[#62c39a]" />
                        </button>
                        <button
                          onClick={() => handleLaunchTool('word-counter')}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1c2d28] border border-[#e5ebe8] dark:border-[#33463c] hover:border-[#137659] dark:hover:border-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#203b2a] text-left text-xs font-bold text-[#172b28] dark:text-[#e2ede7] transition-all group"
                        >
                          <span>Word Counter</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#137659] dark:text-[#62c39a]" />
                        </button>
                        <button
                          onClick={() => handleLaunchTool('ai-text-summarizer')}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1c2d28] border border-[#e5ebe8] dark:border-[#33463c] hover:border-[#137659] dark:hover:border-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#203b2a] text-left text-xs font-bold text-[#172b28] dark:text-[#e2ede7] transition-all group"
                        >
                          <span>AI Summarizer</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#137659] dark:text-[#62c39a]" />
                        </button>
                        <button
                          onClick={() => handleLaunchTool('text-diff')}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1c2d28] border border-[#e5ebe8] dark:border-[#33463c] hover:border-[#137659] dark:hover:border-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#203b2a] text-left text-xs font-bold text-[#172b28] dark:text-[#e2ede7] transition-all group"
                        >
                          <span>Text Diff</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#137659] dark:text-[#62c39a]" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Paste Text Mode */}
        {activeTab === 'text' && (
          <div className="space-y-3">
            <textarea
              id="hero-text-paste-input"
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              placeholder="Paste text, articles, code, JSON, or SQL here to format or analyze..."
              rows={4}
              className="w-full rounded-2xl p-4 bg-[#f8faf9] dark:bg-[#14221f] border border-[#e5ebe8] dark:border-[#33463c] text-sm focus:outline-hidden focus:border-[#137659] dark:focus:border-[#62c39a] text-[#172b28] dark:text-[#e2ede7] font-mono placeholder:font-sans"
            ></textarea>
            {textInput.trim() && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-[#70807c] dark:text-[#a2b5a9] font-semibold">Quick Actions:</span>
                <button
                  onClick={() => handleLaunchTool('word-counter')}
                  className="px-3 py-1.5 rounded-xl bg-[#e9f5ee] dark:bg-[#254334] text-[#137659] dark:text-[#62c39a] text-xs font-bold hover:bg-[#137659] hover:text-white dark:hover:bg-[#62c39a] dark:hover:text-[#14221f] transition-all"
                >
                  Count Words
                </button>
                <button
                  onClick={() => handleLaunchTool('ai-text-summarizer')}
                  className="px-3 py-1.5 rounded-xl bg-[#137659] hover:bg-[#0f5e47] dark:bg-[#258263] dark:hover:bg-[#1d6b51] text-white text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                >
                  <Sparkles className="w-3 h-3" />
                  Summarize with AI
                </button>
                <button
                  onClick={() => handleLaunchTool('json-formatter')}
                  className="px-3 py-1.5 rounded-xl bg-[#e9f5ee] dark:bg-[#254334] text-[#137659] dark:text-[#62c39a] text-xs font-bold hover:bg-[#137659] hover:text-white dark:hover:bg-[#62c39a] dark:hover:text-[#14221f] transition-all"
                >
                  Format JSON
                </button>
                <button
                  onClick={() => handleLaunchTool('case-converter')}
                  className="px-3 py-1.5 rounded-xl bg-[#e9f5ee] dark:bg-[#254334] text-[#137659] dark:text-[#62c39a] text-xs font-bold hover:bg-[#137659] hover:text-white dark:hover:bg-[#62c39a] dark:hover:text-[#14221f] transition-all"
                >
                  Convert Case
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Enter URL Mode */}
        {activeTab === 'url' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                id="hero-url-input"
                type="url"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://example.com/page-to-test"
                className="flex-1 rounded-2xl px-4 py-3 bg-[#f8faf9] dark:bg-[#14221f] border border-[#e5ebe8] dark:border-[#33463c] text-sm focus:outline-hidden focus:border-[#137659] dark:focus:border-[#62c39a] text-[#172b28] dark:text-[#e2ede7]"
              />
              <button
                onClick={() => handleLaunchTool('url-qr-code-generator')}
                className="px-5 py-3 rounded-2xl bg-[#137659] hover:bg-[#0f5e47] dark:bg-[#258263] dark:hover:bg-[#1d6b51] text-white font-bold text-xs tracking-wide shrink-0 transition-all shadow-sm"
              >
                Generate QR
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Trust & Policy Assurance strip */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#70807c] dark:text-[#a2b5a9] font-medium">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#137659] dark:text-[#62c39a]" />
          Zero server storage of user images or files
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#137659] dark:text-[#62c39a]" />
          Client-side hardware acceleration
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#137659] dark:text-[#62c39a]" />
          Instant file downloads
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#137659] dark:text-[#62c39a]" />
          100% Free Daily Usage Tier
        </span>
      </div>
    </section>
  );
};
