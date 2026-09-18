import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Search,
  ChevronRight,
  Sparkles,
  Layers,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { DOCUMENTATION_ARTICLES } from '../data/docs';
import { DocumentationArticle } from '../types';

interface DocumentationViewerProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchTool?: (slug: string) => void;
}

export const DocumentationViewer: React.FC<DocumentationViewerProps> = ({
  isOpen,
  onClose,
  onLaunchTool,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentationArticle>(DOCUMENTATION_ARTICLES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(DOCUMENTATION_ARTICLES.map(d => d.category)))];

  const filteredDocs = DOCUMENTATION_ARTICLES.filter(d => {
    if (selectedCategory !== 'All' && d.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-5xl h-[92vh] bg-white dark:bg-[#1c2d28] rounded-3xl shadow-2xl border border-[#bad5c8] dark:border-[#33463c] flex flex-col overflow-hidden my-auto text-[#172b28] dark:text-[#e2ede7]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e5ebe8] dark:border-[#33463c] flex items-center justify-between bg-[#f8faf9] dark:bg-[#14221f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#e9f5ee] dark:bg-[#203b2a] text-[#137659] dark:text-[#62c39a] border border-[#bad5c8] dark:border-[#355c41] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#172b28] dark:text-[#e2ede7] flex items-center gap-2 font-heading">
                All in One Tool India Documentation (35 Guides)
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#e9f5ee] dark:bg-[#203b2a] text-[#137659] dark:text-[#62c39a] border border-[#bad5c8] dark:border-[#355c41]">
                  Handbook
                </span>
              </h3>
              <p className="text-xs text-[#70807c] dark:text-[#a2b5a9] font-medium">
                Detailed guides on tools, Indian taxation, algorithms, and Gemini AI
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

        {/* Body Split View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar */}
          <div className="w-full md:w-80 border-r border-[#e5ebe8] dark:border-[#33463c] flex flex-col bg-[#f8faf9]/60 dark:bg-[#14221f]/60">
            {/* Search */}
            <div className="p-3 border-b border-[#e5ebe8] dark:border-[#33463c]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#70807c] dark:text-[#a2b5a9] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search 35 guides..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-[#1c2d28] border border-[#bad5c8] dark:border-[#33463c] text-xs text-[#172b28] dark:text-[#e2ede7]"
                />
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-1 overflow-x-auto pt-2 scrollbar-none">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#137659] text-white'
                        : 'bg-white dark:bg-[#1c2d28] text-[#70807c] dark:text-[#a2b5a9] hover:text-[#172b28] dark:hover:text-[#e2ede7] border border-[#e5ebe8] dark:border-[#33463c]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Doc list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredDocs.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start justify-between gap-2 ${
                    selectedDoc.id === doc.id
                      ? 'bg-[#e9f5ee] dark:bg-[#203b2a] border border-[#bad5c8] dark:border-[#355c41] text-[#137659] dark:text-[#62c39a] font-bold'
                      : 'hover:bg-[#e9f5ee]/40 dark:hover:bg-[#254334]/40 text-[#70807c] dark:text-[#a2b5a9]'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs truncate">{doc.title}</div>
                    <div className="text-[10px] text-[#70807c] dark:text-[#a2b5a9] truncate">{doc.category}</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#70807c] dark:text-[#a2b5a9] shrink-0 mt-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Article View */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#e9f5ee] dark:bg-[#203b2a] text-[#137659] dark:text-[#62c39a] border border-[#bad5c8] dark:border-[#355c41]">
                  {selectedDoc.category}
                </span>
                <span className="text-xs text-[#70807c] dark:text-[#a2b5a9]">
                  Updated for Commercial Release 2025-2026
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#172b28] dark:text-[#e2ede7] tracking-tight font-heading">
                {selectedDoc.title}
              </h2>
              <p className="text-sm text-[#70807c] dark:text-[#a2b5a9] mt-2 leading-relaxed">
                {selectedDoc.summary}
              </p>
            </div>

            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-[#172b28] dark:text-[#e2ede7] whitespace-pre-wrap leading-relaxed border-t border-[#e5ebe8] dark:border-[#33463c] pt-6">
              {selectedDoc.content}
            </div>

            <div className="pt-6 border-t border-[#e5ebe8] dark:border-[#33463c] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#70807c] dark:text-[#a2b5a9]">Document Source:</span>
                <span className="px-2.5 py-1 rounded-md bg-[#f8faf9] dark:bg-[#14221f] font-mono text-[#70807c] dark:text-[#a2b5a9] text-[11px] border border-[#e5ebe8] dark:border-[#33463c]">
                  /docs/{selectedDoc.file}
                </span>
                <span className="text-xs text-[#137659] dark:text-[#62c39a] font-bold">
                  DPDP &amp; Commercial Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
