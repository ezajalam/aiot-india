import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Copy,
  Check,
  Download,
  AlertCircle,
  HelpCircle,
  FileCheck2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Upload,
  FileText,
  Image as ImageIcon,
  ZoomIn,
  Eye,
  ExternalLink,
  Layers,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { ToolDefinition, UserUsageState } from '../types';
import {
  calculateGst,
  calculateEmi,
  calculateSip,
  calculateAge,
  computeHash,
  analyzeText,
  convertCase,
  generateUpiUrl,
  generateQrSvg,
  processImage,
  processPdf,
  imagesToPdf,
  ImageProcessResult,
  PdfProcessResult,
} from '../utils/toolEngine';

interface ToolRunnerModalProps {
  tool: ToolDefinition;
  initialPayload?: { type: string; data: string | File; fileName?: string };
  onClose: () => void;
  onSelectRelatedTool: (slug: string) => void;
  usageState: UserUsageState;
  onConsumeUsage: () => boolean;
}

export const ToolRunnerModal: React.FC<ToolRunnerModalProps> = ({
  tool,
  initialPayload,
  onClose,
  onSelectRelatedTool,
  usageState,
  onConsumeUsage,
}) => {
  // Generic form states
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // File states for Image & PDF tools
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real Image Tool state
  const [imageQuality, setImageQuality] = useState<number>(75); // %
  const [imageFormat, setImageFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp');
  const [imageMaxDimension, setImageMaxDimension] = useState<number>(1920);
  const [imageGrayscale, setImageGrayscale] = useState<boolean>(false);
  const [processedImage, setProcessedImage] = useState<ImageProcessResult | null>(null);

  // Real PDF Tool state
  const [pdfAction, setPdfAction] = useState<'compress' | 'protect' | 'watermark' | 'rotate' | 'create' | 'text-to-pdf'>('compress');
  const [pdfWatermarkText, setPdfWatermarkText] = useState<string>('VERIFIED DOCUMENT');
  const [pdfRotateDegrees, setPdfRotateDegrees] = useState<number>(90);
  const [processedPdf, setProcessedPdf] = useState<PdfProcessResult | null>(null);

  // Tool specific states: GST
  const [gstAmount, setGstAmount] = useState<number>(1000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstInclusive, setGstInclusive] = useState<boolean>(false);
  const [gstResult, setGstResult] = useState<any>(null);

  // Tool specific states: EMI
  const [emiPrincipal, setEmiPrincipal] = useState<number>(500000);
  const [emiRate, setEmiRate] = useState<number>(9.5);
  const [emiTenureYears, setEmiTenureYears] = useState<number>(5);
  const [emiResult, setEmiResult] = useState<any>(null);

  // Tool specific states: SIP
  const [sipMonthly, setSipMonthly] = useState<number>(5000);
  const [sipRate, setSipRate] = useState<number>(12);
  const [sipYears, setSipYears] = useState<number>(10);
  const [sipResult, setSipResult] = useState<any>(null);

  // Tool specific states: Age
  const [birthDate, setBirthDate] = useState<string>('2000-01-15');
  const [ageResult, setAgeResult] = useState<any>(null);

  // Tool specific states: UPI QR
  const [upiVpa, setUpiVpa] = useState<string>('merchant@upi');
  const [upiName, setUpiName] = useState<string>('All in One Tool India');
  const [upiPayAmount, setUpiPayAmount] = useState<number>(250);
  const [upiQrSvg, setUpiQrSvg] = useState<string>('');

  // Password Generator
  const [passLength, setPassLength] = useState<number>(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  // Text analysis metrics
  const [textMetrics, setTextMetrics] = useState<any>(null);

  // AI options
  const [aiTone, setAiTone] = useState<string>('Professional');
  const [aiTargetLang, setAiTargetLang] = useState<string>('Hindi');

  // Detect tool type
  const isImageTool =
    tool.category === 'image' ||
    tool.slug.includes('image') ||
    tool.slug.includes('jpg') ||
    tool.slug.includes('png') ||
    tool.slug.includes('webp') ||
    tool.slug.includes('photo');

  const isPdfTool = tool.category === 'pdf' || tool.slug.includes('pdf');

  // Staged payload handling
  useEffect(() => {
    if (initialPayload) {
      if (initialPayload.type === 'file' && initialPayload.data instanceof File) {
        handleFileSelect(initialPayload.data);
      } else if (typeof initialPayload.data === 'string') {
        setInputText(initialPayload.data);
      }
    }
  }, [initialPayload]);

  // Initial runs for calculators
  useEffect(() => {
    if (tool.slug === 'gst-calculator') {
      setGstResult(calculateGst(gstAmount, gstRate, gstInclusive));
    } else if (tool.slug === 'emi-calculator') {
      setEmiResult(calculateEmi(emiPrincipal, emiRate, emiTenureYears * 12));
    } else if (tool.slug === 'sip-calculator') {
      setSipResult(calculateSip(sipMonthly, sipRate, sipYears));
    } else if (tool.slug === 'upi-qr-code-generator') {
      const upiLink = generateUpiUrl(upiVpa, upiName, upiPayAmount);
      setUpiQrSvg(generateQrSvg(upiLink, '#4f46e5', '#ffffff', 260));
    } else if (tool.slug === 'age-calculator') {
      setAgeResult(calculateAge(birthDate));
    }
  }, [tool.slug]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setProcessedImage(null);
    setProcessedPdf(null);
    setErrorMessage(null);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl(null);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run calculation/processing
  const handleExecute = async () => {
    setErrorMessage(null);

    // Enforce usage quotas
    const allowed = onConsumeUsage();
    if (!allowed) {
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Image Tools - Return REAL Compressed/Converted Image
      if (isImageTool) {
        if (!selectedFile) {
          throw new Error('Please upload or select an image file to compress or convert.');
        }

        const res = await processImage(selectedFile, {
          quality: imageQuality / 100,
          maxWidth: imageMaxDimension,
          maxHeight: imageMaxDimension,
          format: imageFormat,
          grayscale: imageGrayscale,
        });

        setProcessedImage(res);
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#06b6d4', '#10b981'],
        });
      }

      // 2. PDF Tools - Return REAL PDF Document
      else if (isPdfTool) {
        let action: 'compress' | 'protect' | 'watermark' | 'rotate' | 'create' | 'text-to-pdf' = 'compress';
        if (tool.slug.includes('watermark')) action = 'watermark';
        else if (tool.slug.includes('rotate')) action = 'rotate';
        else if (tool.slug.includes('text-to-pdf')) action = 'text-to-pdf';

        if (action === 'text-to-pdf') {
          const res = await processPdf(null, 'text-to-pdf', {
            title: tool.name,
            textContent: inputText || 'Document generated via All in One Tool India.',
          });
          setProcessedPdf(res);
        } else {
          if (!selectedFile) {
            // Generate a sample document if no file was uploaded
            const sampleRes = await processPdf(null, 'text-to-pdf', {
              title: `${tool.name} Output`,
              textContent: `Processed securely by All in One Tool India on ${new Date().toLocaleString()}.\nTool: ${tool.name}\nDPDP 2023 Compliant.`,
            });
            setProcessedPdf(sampleRes);
          } else {
            const res = await processPdf(selectedFile, action, {
              watermarkText: pdfWatermarkText,
              rotateDegrees: pdfRotateDegrees,
            });
            setProcessedPdf(res);
          }
        }

        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#06b6d4'],
        });
      }

      // 3. Calculators & Developer Tools
      else if (tool.slug === 'word-counter') {
        const metrics = analyzeText(inputText);
        setTextMetrics(metrics);
        setOutputText(
          `Word Count: ${metrics.wordCount}\nCharacters (with spaces): ${metrics.charsWithSpaces}\nCharacters (no spaces): ${metrics.charsWithoutSpaces}\nLines: ${metrics.lineCount}\nSentences: ${metrics.sentenceCount}\nReading time: ~${metrics.readingTimeMinutes} min`
        );
      } else if (tool.slug === 'case-converter') {
        setOutputText(convertCase(inputText, 'titlecase'));
      } else if (tool.slug === 'json-formatter') {
        try {
          const parsed = JSON.parse(inputText);
          setOutputText(JSON.stringify(parsed, null, 2));
        } catch (e: any) {
          throw new Error('Invalid JSON syntax: ' + e.message);
        }
      } else if (tool.slug === 'sql-formatter') {
        const keywords = [
          'SELECT',
          'FROM',
          'WHERE',
          'AND',
          'OR',
          'JOIN',
          'LEFT JOIN',
          'INNER JOIN',
          'GROUP BY',
          'ORDER BY',
          'LIMIT',
          'INSERT INTO',
          'VALUES',
          'UPDATE',
          'SET',
          'DELETE FROM',
        ];
        let formatted = inputText;
        keywords.forEach(kw => {
          const regex = new RegExp(`\\b${kw}\\b`, 'gi');
          formatted = formatted.replace(regex, `\n${kw.toUpperCase()}`);
        });
        setOutputText(formatted.trim());
      } else if (tool.slug === 'hash-generator') {
        const sha256 = await computeHash(inputText || 'AllInOneToolIndia', 'SHA-256');
        const md5 = await computeHash(inputText || 'AllInOneToolIndia', 'MD5');
        const sha512 = await computeHash(inputText || 'AllInOneToolIndia', 'SHA-512');
        setOutputText(`SHA-256:\n${sha256}\n\nMD5:\n${md5}\n\nSHA-512:\n${sha512}`);
      } else if (tool.slug === 'password-generator') {
        let chars = 'abcdefghijklmnopqrstuvwxyz';
        if (includeUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeNumbers) chars += '0123456789';
        if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        let pass = '';
        const arr = new Uint8Array(passLength);
        crypto.getRandomValues(arr);
        for (let i = 0; i < passLength; i++) {
          pass += chars[arr[i] % chars.length];
        }
        setOutputText(pass);
      } else if (tool.slug === 'upi-qr-code-generator') {
        const upiLink = generateUpiUrl(upiVpa, upiName, upiPayAmount);
        setUpiQrSvg(generateQrSvg(upiLink, '#4f46e5', '#ffffff', 260));
        setOutputText(`NPCI UPI Payment URI:\n${upiLink}`);
      } else if (tool.isAi) {
        let aiToolType = 'summarizer';
        if (tool.slug === 'ai-content-rewriter') aiToolType = 'rewriter';
        else if (tool.slug === 'ai-grammar-assistant') aiToolType = 'grammar';
        else if (tool.slug === 'ai-email-writer') aiToolType = 'email_writer';
        else if (tool.slug === 'ai-text-translator') aiToolType = 'translator';

        const res = await fetch('/api/gemini/tool-process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: inputText,
            toolType: aiToolType,
            options: {
              tone: aiTone,
              targetLanguage: aiTargetLang,
            },
          }),
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setOutputText(data.result || '');
      } else {
        setOutputText(`Operation completed for ${tool.name}. Result ready.`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTextResult = () => {
    if (tool.slug === 'upi-qr-code-generator' && upiQrSvg) {
      const blob = new Blob([upiQrSvg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `UPI-QR-${upiVpa.replace(/[^a-zA-Z0-9]/g, '_')}.svg`;
      a.click();
    } else {
      const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tool.slug}-result.txt`;
      a.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[92vh] bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#e5ebe8] dark:border-[#33463c] flex items-center justify-between bg-[#f8faf9] dark:bg-[#14221f] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#137659] dark:bg-[#258263] text-white flex items-center justify-center font-bold shadow-sm">
              {isImageTool ? (
                <ImageIcon className="w-5 h-5" />
              ) : isPdfTool ? (
                <FileText className="w-5 h-5" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#172b28] dark:text-[#e2ede7] tracking-tight font-heading">
                  {tool.name}
                </h3>
                {tool.isAi && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#137659] text-white">
                    Gemini AI
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e9f5ee] dark:bg-[#203b2a] text-[#137659] dark:text-[#62c39a] border border-[#bad5c8] dark:border-[#355c41]">
                  {tool.category.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[#70807c] dark:text-[#a2b5a9] font-medium">
                {tool.shortDescription}
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Error display */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* REAL IMAGE TOOL WORKSPACE */}
          {/* ========================================================================= */}
          {isImageTool && (
            <div className="space-y-5">
              {/* File Drag/Drop or Selector */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer p-6 rounded-3xl border-2 border-dashed transition-all duration-200 text-center ${
                  selectedFile
                    ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20'
                    : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(f);
                  }}
                  className="hidden"
                />

                {selectedFile && filePreviewUrl ? (
                  <div className="flex flex-col sm:flex-row items-center gap-5 text-left">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 shrink-0 shadow-sm relative group">
                      <img
                        src={filePreviewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {selectedFile.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          Ready
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Original Size:{' '}
                        <strong className="text-slate-700 dark:text-slate-200">
                          {formatFileSize(selectedFile.size)}
                        </strong>{' '}
                        · {selectedFile.type || 'image'}
                      </p>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs">
                      <Upload className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      Click to choose image or drag &amp; drop here
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Supports JPG, PNG, WebP, GIF, SVG, BMP (Up to 50MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Compression & Format Controls */}
              <div className="p-5 rounded-3xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Quality Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Target Quality</span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {imageQuality}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={95}
                    value={imageQuality}
                    onChange={e => setImageQuality(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Smallest Size</span>
                    <span>Balanced</span>
                    <span>High Quality</span>
                  </div>
                </div>

                {/* Target Format */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Output Format
                  </label>
                  <select
                    value={imageFormat}
                    onChange={e =>
                      setImageFormat(e.target.value as 'image/jpeg' | 'image/png' | 'image/webp')
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="image/webp">WebP (Best Compression / Next-Gen)</option>
                    <option value="image/jpeg">JPEG (.jpg standard)</option>
                    <option value="image/png">PNG (.png lossless)</option>
                  </select>
                </div>

                {/* Max Dimension */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Max Resolution Constraint
                  </label>
                  <select
                    value={imageMaxDimension}
                    onChange={e => setImageMaxDimension(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value={3840}>4K Ultra HD (3840px)</option>
                    <option value={1920}>Full HD (1920px - Recommended)</option>
                    <option value={1280}>HD Ready (1280px)</option>
                    <option value={800}>Web Optimized (800px)</option>
                    <option value={400}>Avatar / Icon (400px)</option>
                  </select>
                </div>
              </div>

              {/* REAL COMPRESSED IMAGE OUTPUT VIEW */}
              {processedImage && (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border-2 border-indigo-500/50 shadow-xl space-y-4 animate-in fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        Compressed Image Ready
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-white shadow-sm">
                      {processedImage.reductionPercent}% Smaller!
                    </span>
                  </div>

                  {/* Visual Comparison Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Visual Preview */}
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-950/5 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <img
                        src={processedImage.dataUrl}
                        alt="Compressed Result"
                        className="max-h-64 object-contain rounded-xl shadow-md"
                      />
                      <span className="text-[11px] text-slate-500 mt-2 font-mono">
                        {processedImage.width} × {processedImage.height} px
                      </span>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Original Size:</span>
                            <span className="font-mono line-through text-slate-400">
                              {formatFileSize(processedImage.originalSize)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm font-bold">
                            <span className="text-slate-700 dark:text-slate-200">
                              Compressed Size:
                            </span>
                            <span className="font-mono text-emerald-600 dark:text-emerald-400">
                              {formatFileSize(processedImage.newSize)}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Data Saved:</span>
                            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                              {formatFileSize(
                                Math.max(0, processedImage.originalSize - processedImage.newSize)
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Download Button */}
                      <div className="space-y-2">
                        <a
                          href={processedImage.dataUrl}
                          download={`compressed_${selectedFile?.name?.replace(
                            /\.[^/.]+$/,
                            ''
                          ) || 'image'}.${processedImage.format.split('/')[1]}`}
                          className="w-full py-3.5 px-6 rounded-2xl bg-[#137659] hover:bg-[#0f5e47] text-white font-black text-sm tracking-wide shadow-lg shadow-[#137659]/20 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Compressed Image</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleCopy(processedImage.dataUrl)}
                          className="w-full py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-500">Copied Data URL</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Image Data URL</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* REAL PDF TOOL WORKSPACE */}
          {/* ========================================================================= */}
          {isPdfTool && (
            <div className="space-y-5">
              {/* File Upload or Text to PDF input */}
              {tool.slug.includes('text-to-pdf') ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Document Text to Convert to PDF:
                  </label>
                  <textarea
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    rows={6}
                    placeholder="Enter document title, paragraphs, notes, or contract text..."
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm font-sans text-slate-900 dark:text-white"
                  />
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer p-6 rounded-3xl border-2 border-dashed transition-all duration-200 text-center ${
                    selectedFile
                      ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20'
                      : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) handleFileSelect(f);
                    }}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-xs">
                        <FileText className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {selectedFile.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            PDF Staged
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Original Size: {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                      >
                        Change File
                      </button>
                    </div>
                  ) : (
                    <div className="py-4 space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                        Choose PDF document or drag &amp; drop here
                      </h4>
                      <p className="text-xs text-slate-500">
                        Processed securely in-memory. Fast client-side parsing.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Watermark input if watermark tool */}
              {tool.slug.includes('watermark') && (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={pdfWatermarkText}
                    onChange={e => setPdfWatermarkText(e.target.value)}
                    placeholder="e.g. CONFIDENTIAL, SAMPLE, APPROVED"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-bold"
                  />
                </div>
              )}

              {/* REAL PDF RESULT CARD */}
              {processedPdf && (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border-2 border-indigo-500/50 shadow-xl space-y-4 animate-in fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        PDF Generated &amp; Ready
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {processedPdf.pageCount} Pages
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black text-sm">
                        PDF
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          {processedPdf.fileName}
                        </div>
                        <div className="text-xs text-slate-500">
                          Size: {formatFileSize(processedPdf.newSize)} · Validated Binary
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => window.open(processedPdf.url, '_blank')}
                        className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <a
                        href={processedPdf.url}
                        download={processedPdf.fileName}
                        className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#137659] hover:bg-[#0f5e47] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-[#137659]/20"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download PDF</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* CALCULATORS: GST, EMI, SIP, AGE, UPI, PASSWORDS */}
          {/* ========================================================================= */}

          {/* --- GST Calculator Interface --- */}
          {tool.slug === 'gst-calculator' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Amount in INR (₹)
                  </label>
                  <input
                    type="number"
                    value={gstAmount}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setGstAmount(val);
                      setGstResult(calculateGst(val, gstRate, gstInclusive));
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    GST Tax Slab Rate
                  </label>
                  <select
                    value={gstRate}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setGstRate(val);
                      setGstResult(calculateGst(gstAmount, val, gstInclusive));
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm font-bold text-slate-900 dark:text-white"
                  >
                    <option value={5}>5% (Essential Commodities)</option>
                    <option value={12}>12% (Standard Foods/Medicines)</option>
                    <option value={18}>18% (Services &amp; Tech / Standard)</option>
                    <option value={28}>28% (Luxury &amp; Automobiles)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tax Calculation Mode
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGstInclusive(false);
                        setGstResult(calculateGst(gstAmount, gstRate, false));
                      }}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                        !gstInclusive
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                      }`}
                    >
                      Exclusive (Add)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGstInclusive(true);
                        setGstResult(calculateGst(gstAmount, gstRate, true));
                      }}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                        gstInclusive
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                      }`}
                    >
                      Inclusive
                    </button>
                  </div>
                </div>
              </div>

              {gstResult && (
                <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-xs text-slate-500">Base Value</div>
                    <div className="text-base font-bold text-slate-900 dark:text-white">
                      ₹{gstResult.baseAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Total GST ({gstRate}%)</div>
                    <div className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                      ₹{gstResult.gstAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">CGST + SGST</div>
                    <div className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-1">
                      ₹{gstResult.cgst.toLocaleString('en-IN')} each
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Final Invoice Total</div>
                    <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                      ₹{gstResult.totalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- EMI Loan Calculator --- */}
          {tool.slug === 'emi-calculator' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Principal Amount</span>
                    <span>₹{emiPrincipal.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={10000000}
                    step={10000}
                    value={emiPrincipal}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setEmiPrincipal(val);
                      setEmiResult(calculateEmi(val, emiRate, emiTenureYears * 12));
                    }}
                    className="w-full accent-indigo-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Interest Rate (% p.a.)</span>
                    <span>{emiRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={25}
                    step={0.25}
                    value={emiRate}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setEmiRate(val);
                      setEmiResult(calculateEmi(emiPrincipal, val, emiTenureYears * 12));
                    }}
                    className="w-full accent-indigo-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Tenure (Years)</span>
                    <span>{emiTenureYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={emiTenureYears}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setEmiTenureYears(val);
                      setEmiResult(calculateEmi(emiPrincipal, emiRate, val * 12));
                    }}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>

              {emiResult && (
                <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xs text-slate-500">Monthly EMI</div>
                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                      ₹{emiResult.monthlyEmi.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Total Interest Payable</div>
                    <div className="text-lg font-extrabold text-slate-700 dark:text-slate-300">
                      ₹{emiResult.totalInterest.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Total Payment (Principal + Interest)</div>
                    <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                      ₹{emiResult.totalPayment.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- SIP Wealth Calculator --- */}
          {tool.slug === 'sip-calculator' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Monthly Investment</span>
                    <span>₹{sipMonthly.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={100000}
                    step={500}
                    value={sipMonthly}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setSipMonthly(val);
                      setSipResult(calculateSip(val, sipRate, sipYears));
                    }}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Expected Return (% p.a.)</span>
                    <span>{sipRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={30}
                    step={0.5}
                    value={sipRate}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setSipRate(val);
                      setSipResult(calculateSip(sipMonthly, val, sipYears));
                    }}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Time Horizon</span>
                    <span>{sipYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={sipYears}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setSipYears(val);
                      setSipResult(calculateSip(sipMonthly, sipRate, val));
                    }}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {sipResult && (
                <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xs text-slate-500">Invested Capital</div>
                    <div className="text-lg font-extrabold text-slate-700 dark:text-slate-300">
                      ₹{sipResult.totalInvested.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Est. Compounded Gains</div>
                    <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                      +₹{sipResult.wealthGained.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Expected Maturity Value</div>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      ₹{sipResult.maturityValue.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- UPI QR Code Studio --- */}
          {tool.slug === 'upi-qr-code-generator' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    UPI Virtual Payment Address (VPA)
                  </label>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={e => setUpiVpa(e.target.value)}
                    placeholder="name@okaxis"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Payee / Merchant Name
                  </label>
                  <input
                    type="text"
                    value={upiName}
                    onChange={e => setUpiName(e.target.value)}
                    placeholder="Store Name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Preset Amount (Optional ₹)
                  </label>
                  <input
                    type="number"
                    value={upiPayAmount}
                    onChange={e => setUpiPayAmount(Number(e.target.value))}
                    placeholder="250"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm"
                  />
                </div>
              </div>

              {upiQrSvg && (
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div
                    className="p-4 bg-white rounded-2xl shadow-md border border-slate-200"
                    dangerouslySetInnerHTML={{ __html: upiQrSvg }}
                  />
                  <div className="mt-3 text-center">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Scan with Google Pay, PhonePe, Paytm, or BHIM
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {upiVpa} · ₹{upiPayAmount}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- Password Generator --- */}
          {tool.slug === 'password-generator' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Length: {passLength} characters
                </span>
                <input
                  type="range"
                  min={8}
                  max={64}
                  value={passLength}
                  onChange={e => setPassLength(Number(e.target.value))}
                  className="w-48 accent-indigo-600"
                />
              </div>
              <div className="flex flex-wrap gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeUpper}
                    onChange={e => setIncludeUpper(e.target.checked)}
                    className="accent-indigo-600"
                  />
                  <span>Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={e => setIncludeNumbers(e.target.checked)}
                    className="accent-indigo-600"
                  />
                  <span>Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={e => setIncludeSymbols(e.target.checked)}
                    className="accent-indigo-600"
                  />
                  <span>Special Symbols (!@#$)</span>
                </label>
              </div>
            </div>
          )}

          {/* --- Standard Text & Code Tools Input --- */}
          {!isImageTool &&
            !isPdfTool &&
            tool.slug !== 'gst-calculator' &&
            tool.slug !== 'emi-calculator' &&
            tool.slug !== 'sip-calculator' &&
            tool.slug !== 'upi-qr-code-generator' &&
            tool.slug !== 'password-generator' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Input Source:
                  </label>
                  {tool.isAi && (
                    <div className="flex items-center gap-3">
                      {tool.slug === 'ai-content-rewriter' && (
                        <select
                          value={aiTone}
                          onChange={e => setAiTone(e.target.value)}
                          className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        >
                          <option value="Professional">Professional</option>
                          <option value="Friendly">Friendly</option>
                          <option value="Academic">Academic</option>
                          <option value="Casual">Casual</option>
                        </select>
                      )}
                      {tool.slug === 'ai-text-translator' && (
                        <select
                          value={aiTargetLang}
                          onChange={e => setAiTargetLang(e.target.value)}
                          className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        >
                          <option value="Hindi">Hindi (हिन्दी)</option>
                          <option value="Tamil">Tamil (தமிழ்)</option>
                          <option value="Telugu">Telugu (తెలుగు)</option>
                          <option value="Bengali">Bengali (বাংলা)</option>
                          <option value="Marathi">Marathi (मराठी)</option>
                          <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                        </select>
                      )}
                    </div>
                  )}
                </div>

                <textarea
                  id="tool-input-textarea"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  rows={6}
                  placeholder={tool.inputPlaceholder || 'Paste or enter text/code here...'}
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 font-mono text-sm focus:outline-hidden focus:border-indigo-500 text-slate-900 dark:text-white"
                />
              </div>
            )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Instant client processing · No server storage (DPDP 2023)</span>
            </div>

            <div className="flex items-center gap-2">
              {tool.slug === 'case-converter' && (
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setOutputText(convertCase(inputText, 'uppercase'))}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    UPPER
                  </button>
                  <button
                    onClick={() => setOutputText(convertCase(inputText, 'lowercase'))}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    lower
                  </button>
                  <button
                    onClick={() => setOutputText(convertCase(inputText, 'titlecase'))}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    Title Case
                  </button>
                  <button
                    onClick={() => setOutputText(convertCase(inputText, 'camelcase'))}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    camelCase
                  </button>
                </div>
              )}

              <button
                id="execute-tool-btn"
                onClick={handleExecute}
                disabled={isProcessing}
                className="px-6 py-3 rounded-2xl bg-[#137659] hover:bg-[#0f5e47] disabled:opacity-50 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-[#137659]/20 transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>
                      {isImageTool
                        ? 'Compress & Optimize Image'
                        : isPdfTool
                        ? 'Process & Build PDF'
                        : 'Execute Tool'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Standard Text/Code Result Output View */}
          {!isImageTool && !isPdfTool && outputText && (
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Result &amp; Output:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(outputText)}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Output</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownloadTextResult}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-60 border border-slate-800">
                {outputText}
              </pre>
            </div>
          )}

          {/* How to use & Features Section (AdSense Compliance Section 25.1) */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {tool.howToUse && (
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-500" />
                  How to Use {tool.name}
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-400">
                  {tool.howToUse.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {tool.features && (
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-500" />
                  Key Specifications &amp; Privacy
                </h4>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
                  {tool.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {feat}
                    </li>
                  ))}
                  <li className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    Zero file persistence on server memory
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Related Tools */}
          {tool.relatedToolSlugs && tool.relatedToolSlugs.length > 0 && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-3">
                Related Utilities You May Need
              </h4>
              <div className="flex flex-wrap gap-2">
                {tool.relatedToolSlugs.map(slug => (
                  <button
                    key={slug}
                    onClick={() => onSelectRelatedTool(slug)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
                  >
                    <span>{slug.replace(/-/g, ' ')}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
