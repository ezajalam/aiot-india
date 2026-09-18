import React, { useState, useMemo } from 'react';
import {
  Search,
  Star,
  Zap,
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
  FileText,
  Image as ImageIcon,
  Calculator,
  Code2,
  Lock,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ToolCategory, ToolDefinition } from '../types';

interface ToolGridProps {
  categories: ToolCategory[];
  tools: ToolDefinition[];
  onSelectTool: (toolSlug: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({
  categories,
  tools,
  onSelectTool,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<'all' | 'popular' | 'featured' | 'ai'>('all');
  const [visibleCount, setVisibleCount] = useState(48);

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      // Category filter
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }

      // Mode filter
      if (filterMode === 'popular' && !tool.isPopular) return false;
      if (filterMode === 'featured' && !tool.isFeatured) return false;
      if (filterMode === 'ai' && !tool.isAi) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = tool.name.toLowerCase().includes(q);
        const matchDesc = tool.shortDescription.toLowerCase().includes(q);
        const matchCategory = tool.category.toLowerCase().includes(q);
        const matchFormats = tool.supportedFormats?.some(f => f.toLowerCase().includes(q));
        return matchName || matchDesc || matchCategory || matchFormats;
      }

      return true;
    });
  }, [tools, selectedCategory, filterMode, searchQuery]);

  const displayedTools = filteredTools.slice(0, visibleCount);

  return (
    <section id="tools" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Category Pills Scroller */}
      <div id="categories" className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#172b28] dark:text-[#e2ede7] tracking-tight flex items-center gap-2.5 font-heading">
            <span className="p-1.5 rounded-xl bg-[#137659] dark:bg-[#258263] text-white shadow-xs">
              <Layers className="w-5 h-5" />
            </span>
            <span>Explore 200+ Utilities by Category</span>
          </h2>
          <span className="text-xs font-bold text-[#137659] dark:text-[#62c39a] bg-[#e9f5ee] dark:bg-[#203b2a] px-3 py-1 rounded-full border border-[#bad5c8] dark:border-[#355c41]">
            {filteredTools.length} tools available
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#137659] text-white dark:bg-[#258263] shadow-sm'
                : 'bg-white dark:bg-[#1c2d28] text-[#70807c] dark:text-[#a2b5a9] border border-[#e5ebe8] dark:border-[#33463c] hover:border-[#137659] dark:hover:border-[#62c39a]'
            }`}
          >
            All Categories ({tools.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#137659] text-white dark:bg-[#258263] shadow-sm font-black'
                  : 'bg-white dark:bg-[#1c2d28] text-[#70807c] dark:text-[#a2b5a9] border border-[#e5ebe8] dark:border-[#33463c] hover:border-[#137659] dark:hover:border-[#62c39a]'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  selectedCategory === cat.id
                    ? 'bg-white/20 text-white'
                    : 'bg-[#e9f5ee] dark:bg-[#254334] text-[#137659] dark:text-[#62c39a]'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Row & Live Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white dark:bg-[#1c2d28] p-3.5 rounded-3xl border border-[#e5ebe8] dark:border-[#33463c] shadow-[0_4px_20px_rgba(22,55,44,0.03)]">
        {/* Quick Filter tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-[#137659] text-white dark:bg-[#258263] shadow-xs'
                : 'text-[#70807c] dark:text-[#a2b5a9] hover:text-[#137659] dark:hover:text-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#254334]'
            }`}
          >
            All Tools
          </button>
          <button
            onClick={() => setFilterMode('popular')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              filterMode === 'popular'
                ? 'bg-[#137659] text-white dark:bg-[#258263] shadow-xs'
                : 'text-[#70807c] dark:text-[#a2b5a9] hover:text-[#137659] dark:hover:text-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#254334]'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            Popular
          </button>
          <button
            onClick={() => setFilterMode('featured')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              filterMode === 'featured'
                ? 'bg-[#137659] text-white dark:bg-[#258263] shadow-xs'
                : 'text-[#70807c] dark:text-[#a2b5a9] hover:text-[#137659] dark:hover:text-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#254334]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Featured
          </button>
          <button
            onClick={() => setFilterMode('ai')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              filterMode === 'ai'
                ? 'bg-[#137659] text-white dark:bg-[#258263] shadow-xs'
                : 'text-[#70807c] dark:text-[#a2b5a9] hover:text-[#137659] dark:hover:text-[#62c39a] hover:bg-[#e9f5ee] dark:hover:bg-[#254334]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Gemini AI
          </button>
        </div>

        {/* Search input field */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#70807c] dark:text-[#a2b5a9] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="tool-grid-search-input"
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search 200+ tools (Image, PDF, GST, QR)..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[#f8faf9] dark:bg-[#14221f] border border-[#e5ebe8] dark:border-[#33463c] text-xs focus:outline-hidden focus:border-[#137659] dark:focus:border-[#62c39a] text-[#172b28] dark:text-[#e2ede7] placeholder:text-[#70807c] dark:placeholder:text-[#a2b5a9] transition-all"
          />
        </div>
      </div>

      {/* Tools Cards Grid */}
      {displayedTools.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1c2d28] rounded-3xl border border-[#e5ebe8] dark:border-[#33463c] p-8 shadow-xs">
          <Search className="w-12 h-12 text-[#70807c] dark:text-[#a2b5a9] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#172b28] dark:text-[#e2ede7] mb-1 font-heading">
            No utilities found matching "{searchQuery}"
          </h3>
          <p className="text-xs text-[#70807c] dark:text-[#a2b5a9] max-w-sm mx-auto mb-4">
            Try searching for another keyword like "Image", "PDF", "GST", "QR", or reset the filter.
          </p>
          <button
            onClick={() => {
              onSearchChange('');
              setSelectedCategory('all');
              setFilterMode('all');
            }}
            className="px-5 py-2.5 rounded-2xl bg-[#137659] text-white dark:bg-[#258263] text-xs font-bold hover:bg-[#0f5e47] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedTools.map(tool => {
            return (
              <motion.div
                key={tool.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                onClick={() => onSelectTool(tool.slug)}
                className="group cursor-pointer p-5 rounded-3xl bg-white dark:bg-[#1c2d28] border border-[#e5ebe8] dark:border-[#33463c] hover:border-[#137659] dark:hover:border-[#62c39a] shadow-[0_4px_20px_rgba(22,55,44,0.03)] hover:shadow-[0_12px_30px_rgba(19,118,89,0.12)] transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#e9f5ee] dark:bg-[#254334] text-[#137659] dark:text-[#62c39a] group-hover:bg-[#137659] group-hover:text-white dark:group-hover:bg-[#62c39a] dark:group-hover:text-[#14221f] flex items-center justify-center transition-colors duration-200 shadow-xs">
                      {tool.isAi ? (
                        <Sparkles className="w-5 h-5" />
                      ) : tool.category === 'pdf' ? (
                        <FileText className="w-5 h-5" />
                      ) : tool.category === 'image' ? (
                        <ImageIcon className="w-5 h-5" />
                      ) : tool.category === 'calculators' || tool.category === 'finance' ? (
                        <Calculator className="w-5 h-5" />
                      ) : tool.category === 'developer' ? (
                        <Code2 className="w-5 h-5" />
                      ) : (
                        <Zap className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {tool.isPopular && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e9f5ee] text-[#137659] dark:bg-[#203b2a] dark:text-[#62c39a] border border-[#bad5c8] dark:border-[#355c41] flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          Popular
                        </span>
                      )}
                      {tool.isAi && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#137659] text-white dark:bg-[#258263]">
                          AI
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-[#172b28] dark:text-[#e2ede7] group-hover:text-[#137659] dark:group-hover:text-[#62c39a] transition-colors mb-1.5 tracking-tight font-heading">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-[#70807c] dark:text-[#a2b5a9] line-clamp-2 leading-relaxed">
                    {tool.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#e5ebe8] dark:border-[#33463c] flex items-center justify-between text-[11px]">
                  <span className="text-[#70807c] dark:text-[#a2b5a9] font-medium capitalize">
                    {tool.category}
                  </span>
                  <span className="text-[#137659] dark:text-[#62c39a] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Launch
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination / Load more */}
      {filteredTools.length > visibleCount && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setVisibleCount(prev => prev + 36)}
            className="px-6 py-3 rounded-2xl bg-white dark:bg-[#1c2d28] border border-[#bad5c8] dark:border-[#355c41] hover:border-[#137659] dark:hover:border-[#62c39a] text-xs font-bold text-[#137659] dark:text-[#62c39a] shadow-xs transition-all"
          >
            Load More Utilities ({filteredTools.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </section>
  );
};
