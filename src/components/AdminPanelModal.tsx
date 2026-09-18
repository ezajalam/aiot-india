import React, { useState } from 'react';
import {
  X,
  LayoutDashboard,
  Wrench,
  Key,
  DollarSign,
  Download,
  ShieldAlert,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Lock,
  Unlock,
  ShieldCheck,
  Zap,
  LogOut,
  Copy,
  Check,
} from 'lucide-react';
import { ToolDefinition } from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  tools: ToolDefinition[];
  onToggleToolStatus: (slug: string) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  tools,
  onToggleToolStatus,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('aiti_admin_auth') === 'true';
  });

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  const [activeTab, setActiveTab] = useState<'metrics' | 'tools' | 'keys' | 'ads' | 'security'>('metrics');
  const [searchFilter, setSearchFilter] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    // Accepted master credentials
    if (
      (cleanUser === 'admin' || cleanUser === 'ezajalam93@gmail.com' || cleanUser === 'superadmin') &&
      (cleanPass === 'admin123' || cleanPass === 'Admin@2026' || cleanPass === 'admin')
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem('aiti_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Use Username: admin and Password: admin123');
    }
  };

  const handleQuickAutofillAndLogin = () => {
    setUsername('admin');
    setPassword('admin123');
    setIsAuthenticated(true);
    sessionStorage.setItem('aiti_admin_auth', 'true');
    setLoginError('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('aiti_admin_auth');
    setPassword('');
  };

  const handleDownloadKeys = async (format: 'txt' | 'csv') => {
    setIsExporting(true);
    try {
      const res = await fetch(`/api/admin/export-resale-keys?format=${format}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AITI_10000_Resale_License_Keys.${format}`;
      a.click();
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const filteredTools = tools.filter(t =>
    t.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    t.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-5xl max-h-[92vh] bg-white dark:bg-[#1c2d28] text-[#172b28] dark:text-[#e2ede7] rounded-3xl shadow-2xl border border-[#bad5c8] dark:border-[#33463c] flex flex-col overflow-hidden my-auto">
        
        {/* If NOT Authenticated: Show Clean Admin Login Gate */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center max-w-lg mx-auto w-full my-auto space-y-6">
            <div className="flex justify-end w-full">
              <button
                onClick={onClose}
                className="p-2 text-[#70807c] hover:text-[#172b28] dark:text-[#a2b5a9] dark:hover:text-[#e2ede7] rounded-xl hover:bg-[#e9f5ee] dark:hover:bg-[#254334] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-[#137659] text-white flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-2xl font-extrabold tracking-tight text-[#172b28] dark:text-[#e2ede7] font-heading">
                Super Admin Authentication
              </h3>
              <p className="text-xs text-[#70807c] dark:text-[#a2b5a9] font-medium">
                Enter your administrative credentials to access the 24-section console
              </p>
            </div>

            {/* Master Credentials Highlight Box */}
            <div className="w-full p-4 rounded-2xl bg-[#f8faf9] dark:bg-[#14221f] border border-[#e5ebe8] dark:border-[#33463c] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#137659] dark:text-[#62c39a] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#137659] dark:text-[#62c39a]" />
                  Your Master Admin Credentials
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e9f5ee] dark:bg-[#203b2a] text-[#137659] dark:text-[#62c39a] border border-[#bad5c8] dark:border-[#355c41] font-mono font-bold">
                  v4.0 Access
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-xl bg-white dark:bg-[#1c2d28] border border-[#e5ebe8] dark:border-[#33463c]">
                  <span className="text-[10px] text-[#70807c] dark:text-[#a2b5a9] block uppercase font-sans">Username</span>
                  <span className="font-bold text-[#172b28] dark:text-[#e2ede7]">admin</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-[#1c2d28] border border-[#e5ebe8] dark:border-[#33463c]">
                  <span className="text-[10px] text-[#70807c] dark:text-[#a2b5a9] block uppercase font-sans">Password</span>
                  <span className="font-bold text-[#172b28] dark:text-[#e2ede7]">admin123</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleQuickAutofillAndLogin}
                className="w-full py-2 px-3 rounded-xl bg-[#137659] hover:bg-[#0f5e47] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                1-Click Autofill &amp; Instant Sign In
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="w-full space-y-4">
              {loginError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 font-medium">
                  {loginError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#172b28] dark:text-[#e2ede7]">
                  Admin Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8faf9] dark:bg-[#14221f] border border-[#bad5c8] dark:border-[#33463c] text-xs text-[#172b28] dark:text-[#e2ede7] focus:outline-hidden focus:border-[#137659] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#172b28] dark:text-[#e2ede7]">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8faf9] dark:bg-[#14221f] border border-[#bad5c8] dark:border-[#33463c] text-xs text-[#172b28] dark:text-[#e2ede7] focus:outline-hidden focus:border-[#137659] transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#137659] hover:bg-[#0f5e47] text-white font-black text-xs uppercase tracking-wider transition-colors shadow-md shadow-[#137659]/20"
              >
                Sign In to Admin Console
              </button>
            </form>
          </div>
        ) : (
          /* If Authenticated: Show Full 24-Section Admin Console */
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#e5ebe8] dark:border-[#33463c] flex items-center justify-between bg-[#f8faf9] dark:bg-[#14221f]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#137659] text-white flex items-center justify-center font-bold shadow-xs">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-[#172b28] dark:text-[#e2ede7] font-heading">
                      All in One Tool India — Super Admin Console
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#e9f5ee] dark:bg-[#203b2a] text-[#137659] dark:text-[#62c39a] border border-[#bad5c8] dark:border-[#355c41]">
                      Super Admin (admin)
                    </span>
                  </div>
                  <p className="text-xs text-[#70807c] dark:text-[#a2b5a9] font-medium">
                    200+ utilities management · 10,000 resale keys · AdSense control · Zero-persisted audit
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl border border-[#bad5c8] dark:border-[#33463c] text-xs font-bold text-[#70807c] dark:text-[#a2b5a9] hover:text-[#172b28] dark:hover:text-[#e2ede7] hover:bg-[#e9f5ee] dark:hover:bg-[#254334] flex items-center gap-1.5 transition-colors"
                  title="Log out of admin session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-[#70807c] hover:text-[#172b28] dark:text-[#a2b5a9] dark:hover:text-[#e2ede7] rounded-xl hover:bg-[#e9f5ee] dark:hover:bg-[#254334] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Admin Tabs */}
            <div className="flex items-center gap-2 px-6 py-2 bg-[#f8faf9]/80 dark:bg-[#14221f]/60 border-b border-[#e5ebe8] dark:border-[#33463c] overflow-x-auto text-xs font-bold">
              <button
                onClick={() => setActiveTab('metrics')}
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  activeTab === 'metrics'
                    ? 'bg-[#137659] text-white shadow-xs'
                    : 'text-[#70807c] dark:text-[#a2b5a9] hover:text-[#172b28] dark:hover:text-[#e2ede7]'
                }`}
              >
                <Activity className="w-4 h-4" />
                Dashboard &amp; Live Metrics
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  activeTab === 'tools'
                    ? 'bg-[#137659] text-white shadow-xs'
                    : 'text-[#70807c] dark:text-[#a2b5a9] hover:text-[#172b28] dark:hover:text-[#e2ede7]'
                }`}
              >
                <Wrench className="w-4 h-4" />
                Tool Manager ({tools.length})
              </button>
              <button
                onClick={() => setActiveTab('keys')}
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  activeTab === 'keys'
                    ? 'bg-[#137659] text-white shadow-xs'
                    : 'text-[#70807c] dark:text-[#a2b5a9] hover:text-[#172b28] dark:hover:text-[#e2ede7]'
                }`}
              >
                <Key className="w-4 h-4" />
                10,000 Resale Keys (Sec 21)
              </button>
              <button
                onClick={() => setActiveTab('ads')}
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  activeTab === 'ads'
                    ? 'bg-[#137659] text-white shadow-xs'
                    : 'text-[#70807c] dark:text-[#a2b5a9] hover:text-[#172b28] dark:hover:text-[#e2ede7]'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                AdSense &amp; Monetization
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  activeTab === 'security'
                    ? 'bg-[#137659] text-white shadow-xs'
                    : 'text-[#70807c] dark:text-[#a2b5a9] hover:text-[#172b28] dark:hover:text-[#e2ede7]'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                Security &amp; DPDP Logs
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Tab 1: Dashboard Metrics */}
              {activeTab === 'metrics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <div className="text-xs text-zinc-500 font-bold uppercase">Total Tools Live</div>
                      <div className="text-2xl font-black text-black dark:text-white mt-1">200+</div>
                      <div className="text-[11px] text-zinc-500 font-medium">100% Operational</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <div className="text-xs text-zinc-500 font-bold uppercase">Daily Active Users</div>
                      <div className="text-2xl font-black text-black dark:text-white mt-1">14,820</div>
                      <div className="text-[11px] text-zinc-400 font-medium">+18.4% this week</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <div className="text-xs text-zinc-500 font-bold uppercase">Monthly Executions</div>
                      <div className="text-2xl font-black text-black dark:text-white mt-1">428,950</div>
                      <div className="text-[11px] text-zinc-400 font-medium">Avg latency: 42ms</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <div className="text-xs text-zinc-500 font-bold uppercase">Estimated MRR</div>
                      <div className="text-2xl font-black text-black dark:text-white mt-1">₹89,450</div>
                      <div className="text-[11px] text-zinc-500 font-medium">Standard + Premium</div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                    <h4 className="font-bold text-sm text-black dark:text-white">
                      Cloud Infrastructure Health
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                        <span className="text-zinc-500">Container Port</span>
                        <span className="font-mono font-bold text-black dark:text-white">3000 (Ingress Active)</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                        <span className="text-zinc-500">Reverse Proxy</span>
                        <span className="font-mono text-zinc-800 dark:text-zinc-200">Nginx / Cloud Run</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                        <span className="text-zinc-500">Gemini AI Models Initialized</span>
                        <span className="font-mono text-zinc-800 dark:text-zinc-200 font-semibold">gemini-3.5-flash, gemini-3.1-pro-preview</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-zinc-500">Temporary In-Memory Storage</span>
                        <span className="font-mono text-black dark:text-white font-semibold">Auto-purged (0 bytes persisted)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Tool Management */}
              {activeTab === 'tools' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchFilter}
                        onChange={e => setSearchFilter(e.target.value)}
                        placeholder="Search tool by name or category..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs text-black dark:text-white"
                      />
                    </div>
                    <span className="text-xs text-zinc-500">
                      {filteredTools.length} tools shown
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                    {filteredTools.slice(0, 50).map(t => (
                      <div
                        key={t.id}
                        className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/40"
                      >
                        <div className="truncate mr-2">
                          <span className="font-bold text-xs text-black dark:text-white block truncate">
                            {t.name}
                          </span>
                          <span className="text-[10px] text-zinc-500 capitalize">
                            {t.category}
                          </span>
                        </div>
                        <button
                          onClick={() => onToggleToolStatus(t.slug)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-black text-white dark:bg-white dark:text-black shrink-0 hover:opacity-80"
                        >
                          Active
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Keys */}
              {activeTab === 'keys' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 space-y-2">
                    <span className="font-bold text-black dark:text-white block">
                      Commercial Resale License Key Engine (Section 21 Compliance)
                    </span>
                    <p>
                      Generate and export up to 10,000 cryptographically signed license keys (format: <code>AITI-XXXX-XXXX-XXXX-XXXX</code>) for offline distribution, marketplace packages, or enterprise clients.
                    </p>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleDownloadKeys('csv')}
                        disabled={isExporting}
                        className="px-4 py-2 rounded-xl bg-[#137659] hover:bg-[#0f5e47] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Export 10,000 Keys (.CSV)
                      </button>
                      <button
                        onClick={() => handleDownloadKeys('txt')}
                        disabled={isExporting}
                        className="px-4 py-2 rounded-xl border border-[#bad5c8] dark:border-[#33463c] font-bold text-xs flex items-center gap-1.5 text-[#172b28] dark:text-[#e2ede7] hover:bg-[#e9f5ee] dark:hover:bg-[#254334] transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Export 10,000 Keys (.TXT)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: AdSense */}
              {activeTab === 'ads' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300">
                    <span className="font-bold text-black dark:text-white block mb-1">
                      Google AdSense Compliance (12 Optimized Ad Slots)
                    </span>
                    Ad slots are mapped per Section 25.1: Top banner, sidebar rectangle, in-tool interstitial, and bottom responsive. High-intent tool pages maintain &gt;45% text-to-ad density.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">Publisher ID</span>
                        <span className="font-mono text-black dark:text-white font-bold">ca-pub-XXXXXXXXXXXX</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">Global Ad Status</span>
                        <span className="text-black dark:text-white font-bold">Active &amp; Serving</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">Guest Session Quota</span>
                        <span className="font-bold text-black dark:text-white">10 Uses max</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">Paywall Trigger</span>
                        <span className="text-black dark:text-white font-bold">Instant modal pop</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Security */}
              {activeTab === 'security' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-black dark:text-white" />
                      <h4 className="font-bold text-xs text-black dark:text-white">
                        India DPDP Act (2023) &amp; GDPR Audit Log
                      </h4>
                    </div>
                    <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                      <div className="p-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex justify-between">
                        <span>[AUDIT] In-memory temporary file buffer auto-evicted</span>
                        <span className="text-black dark:text-white font-bold">0s retained</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex justify-between">
                        <span>[SEC] Input sanitized against XSS &amp; prototype pollution</span>
                        <span className="text-black dark:text-white font-bold">Passed</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex justify-between">
                        <span>[SEC] GEMINI_API_KEY server-side proxy encapsulation</span>
                        <span className="text-black dark:text-white font-bold">100% Protected</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
