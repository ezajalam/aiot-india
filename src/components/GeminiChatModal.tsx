import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Brain,
  Trash2,
  ChevronDown,
  Loader2,
  Copy,
  Check,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { ChatMessage } from '../types';

interface GeminiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiChatModal: React.FC<GeminiChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      role: 'model',
      content:
        'Namaste! I am your AI Assistant for All in One Tool India. I can recommend utilities, write code, calculate taxes, summarize contracts, or engage in deep reasoning with High Thinking mode enabled. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview'>('gemini-3.5-flash');
  const [role, setRole] = useState<'general' | 'tools_guru' | 'code_expert' | 'tax_advisor'>('general');
  const [enableThinking, setEnableThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const roleInstructions: Record<string, string> = {
    general:
      'You are the intelligent assistant for All in One Tool India ("Drop Anything. Get Useful Tools"). Provide comprehensive, helpful, and concise guidance on utilities, file conversions, and everyday digital productivity.',
    tools_guru:
      'You are a specialized All in One Tool India Master Architect. Guide the user directly to the exact tool among the 200+ utilities available (PDF, Image, Developers, Calculators, SEO, QR, etc.) and explain optimal file settings.',
    code_expert:
      'You are a Principal Software Engineer. Provide immaculate, clean, production-grade code, unit test examples, and deep architectural analyses. Never use placeholder shortcuts.',
    tax_advisor:
      'You are a Chartered Accountant and Indian Taxation Specialist. Guide users through GST rates (5%, 12%, 18%, 28%), CGST/SGST/IGST compliance, and compare the New Tax Regime (115BAC) vs Old Tax Regime with clear numerical tables in INR (₹).',
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);
    setErrorMessage(null);

    // Auto-switch to gemini-3.1-pro-preview if thinking mode is enabled per instructions
    const effectiveModel = enableThinking ? 'gemini-3.1-pro-preview' : model;

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role, content: m.content })),
          model: effectiveModel,
          systemInstruction: roleInstructions[role],
          enableThinking,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to communicate with Gemini AI.');
      }

      const modelMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'model',
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.model,
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(err.message || 'Error communicating with Gemini.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'init_reset',
        role: 'model',
        content: 'Conversation history cleared. How can I assist you with your tools or workflow today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-4xl h-[90vh] bg-white dark:bg-[#1c2d28] text-[#172b28] dark:text-[#e2ede7] rounded-3xl shadow-2xl border border-[#bad5c8] dark:border-[#33463c] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e5ebe8] dark:border-[#33463c] flex items-center justify-between bg-[#f8faf9] dark:bg-[#14221f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#137659] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#172b28] dark:text-[#e2ede7] font-heading">
                  Gemini AI Multi-turn Chat
                </h3>
                {enableThinking && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#e9f5ee] dark:bg-[#203b2a] text-[#137659] dark:text-[#62c39a] border border-[#bad5c8] dark:border-[#355c41] flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    High Thinking
                  </span>
                )}
              </div>
              <p className="text-xs text-[#70807c] dark:text-[#a2b5a9] font-medium">
                Powered by official Google Gemini models with multi-turn memory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              className="p-2 text-[#70807c] hover:text-red-500 rounded-xl hover:bg-[#e9f5ee] dark:hover:bg-[#254334] transition-colors"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#70807c] hover:text-[#172b28] dark:text-[#a2b5a9] dark:hover:text-[#e2ede7] rounded-xl hover:bg-[#e9f5ee] dark:hover:bg-[#254334] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Model, Thinking Mode & Role Bar */}
        <div className="px-5 py-2.5 bg-[#f8faf9]/90 dark:bg-[#14221f]/90 border-b border-[#e5ebe8] dark:border-[#33463c] flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Model Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[#70807c] dark:text-[#a2b5a9] font-medium">Model:</span>
            <select
              value={enableThinking ? 'gemini-3.1-pro-preview' : model}
              disabled={enableThinking}
              onChange={e => setModel(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1c2d28] border border-[#bad5c8] dark:border-[#33463c] font-medium text-[#172b28] dark:text-[#e2ede7] focus:outline-hidden"
            >
              <option value="gemini-3.5-flash">gemini-3.5-flash (General)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fastest)</option>
              <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex & STEM)</option>
            </select>
          </div>

          {/* Role selector */}
          <div className="flex items-center gap-2">
            <span className="text-[#70807c] dark:text-[#a2b5a9] font-medium">Role:</span>
            <select
              value={role}
              onChange={e => setRole(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1c2d28] border border-[#bad5c8] dark:border-[#33463c] font-medium text-[#172b28] dark:text-[#e2ede7] focus:outline-hidden"
            >
              <option value="general">General Utility Assistant</option>
              <option value="tools_guru">Tools Guru (200+ Tools Expert)</option>
              <option value="code_expert">Principal Software Engineer</option>
              <option value="tax_advisor">India GST & Tax Advisor</option>
            </select>
          </div>

          {/* High Thinking Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={enableThinking}
              onChange={e => {
                setEnableThinking(e.target.checked);
                if (e.target.checked) {
                  setModel('gemini-3.1-pro-preview');
                }
              }}
              className="w-4 h-4 accent-[#137659] rounded"
            />
            <span className="font-semibold text-[#137659] dark:text-[#62c39a] flex items-center gap-1">
              <Brain className="w-3.5 h-3.5" />
              Enable High Thinking (Gemini 3.1 Pro)
            </span>
          </label>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-[#137659] text-white'
                    : 'bg-[#203b2a] text-[#62c39a]'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                className={`group relative rounded-2xl px-4 py-3 text-sm shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-[#137659] text-white font-medium rounded-tr-xs'
                    : 'bg-[#f8faf9] dark:bg-[#14221f] text-[#172b28] dark:text-[#e2ede7] rounded-tl-xs border border-[#e5ebe8] dark:border-[#33463c]'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>

                <div className="flex items-center justify-between gap-4 mt-2 pt-1 border-t border-black/5 dark:border-white/5 text-[10px] opacity-70">
                  <span>{msg.timestamp}</span>
                  {msg.modelUsed && <span>Model: {msg.modelUsed}</span>}
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="hover:opacity-100 flex items-center gap-1"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-[#137659] dark:text-[#62c39a]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-2xl mr-auto animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-[#203b2a] text-[#62c39a] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-[#f8faf9] dark:bg-[#14221f] rounded-tl-xs border border-[#e5ebe8] dark:border-[#33463c] text-xs text-[#70807c] dark:text-[#a2b5a9] flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#137659]" />
                <span>
                  {enableThinking
                    ? 'Gemini 3.1 Pro is performing High Thinking reasoning...'
                    : 'Gemini is generating response...'}
                </span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#e5ebe8] dark:border-[#33463c] bg-white dark:bg-[#1c2d28]">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="gemini-chat-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything (e.g. 'Compare GST rates for IT services', 'Explain JSON schema', 'Write a clean text diff function')..."
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-2xl bg-[#f8faf9] dark:bg-[#14221f] border border-[#bad5c8] dark:border-[#33463c] text-sm focus:outline-hidden focus:border-[#137659] text-[#172b28] dark:text-[#e2ede7]"
            />
            <button
              id="send-gemini-message-btn"
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-2xl bg-[#137659] hover:bg-[#0f5e47] disabled:opacity-50 text-white font-bold text-xs tracking-wide shadow-md shadow-[#137659]/20 transition-colors flex items-center gap-1.5"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
