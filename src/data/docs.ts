import { DocumentationArticle } from '../types';

export const DOCUMENTATION_ARTICLES: DocumentationArticle[] = [
  {
    id: 'doc_1',
    file: 'index.html',
    title: 'Documentation Hub & Overview',
    category: 'Getting Started',
    summary: 'Welcome to All in One Tool India commercial documentation. Architecture overview, quick start, and directory reference.',
    content: `All in One Tool India is a production-grade utility engine architected for high concurrency, shared hosting compatibility, and frictionless AdSense monetization.

Key Highlights:
- 200+ utilities across 15 high-demand categories.
- Zero mandatory background daemons (runs natively on PHP 8.4+ / modern Node / cPanel / Cloud Run).
- Seven-layer security architecture protecting uploads, preventing XSS/CSRF, and isolating tenant operations.
- Built-in monetization engine with guest limits, ad-rewarded bonus usages, and tiered subscription plans (Free, Standard ₹9, Premium ₹29).`,
  },
  {
    id: 'doc_2',
    file: 'installation.html',
    title: 'Installation Wizard & Setup',
    category: 'Getting Started',
    summary: 'Step-by-step installation instructions for cPanel, VPS, or container environments.',
    content: `Step 1: Upload the contents of the /upload directory to your document root (e.g. public_html/).
Step 2: Create a MySQL 8.0+ / MariaDB database and user in your hosting control panel.
Step 3: Confirm 755 permissions on /storage, /cache, and /app/config.
Step 4: Navigate to https://yourdomain.com/install in your browser.
Step 5: Follow the 7-step wizard:
  1. Welcome & License Agreement
  2. Server Requirements Check (green checks on PDO, GD, OpenSSL, ZipArchive)
  3. Database Credentials & Connection Test
  4. Master Administrator Account Setup
  5. Website Name, Currency (INR ₹), and Timezone (Asia/Kolkata)
  6. Automated Database Migration & Default Seeds
  7. Completion Screen & Security Lockfile creation.
Step 6: Log into your admin panel at /admin and begin configuring your preferences.`,
  },
  {
    id: 'doc_3',
    file: 'requirements.html',
    title: 'Server & Hosting Requirements',
    category: 'Hosting & Server',
    summary: 'Detailed prerequisites for optimal execution on Apache, LiteSpeed, Nginx, or cPanel.',
    content: `Hardware & Runtime Prerequisites:
- PHP 8.4+ (or Node 20+ runtime for container deployment)
- MySQL 8.0+ or MariaDB 10.6+
- Mandatory Extensions: pdo_mysql, mbstring, openssl, json, fileinfo, curl, gd, zip
- Memory Limit: 128 MB minimum (256 MB recommended for large PDF/image operations)
- Post Max Size: 50 MB (configurable via Admin Settings)
- Max Execution Time: 60 seconds.`,
  },
  {
    id: 'doc_4',
    file: 'cpanel-setup.html',
    title: 'cPanel Step-by-Step Deployment',
    category: 'Hosting & Server',
    summary: 'How to deploy All in One Tool India on standard shared cPanel hosting without SSH.',
    content: `1. Log into your cPanel account.
2. Open File Manager, enter public_html.
3. Upload the packaged ZIP file and click "Extract".
4. Open "MySQL Databases", create a new database (e.g. u123_aiti), add a user with ALL PRIVILEGES.
5. In "Select PHP Version", verify PHP 8.4 is active with "fileinfo", "gd", and "zip" enabled.
6. Open your site URL in a new tab to launch the web installer.`,
  },
  {
    id: 'doc_5',
    file: 'database-setup.html',
    title: 'Database Architecture & Schemas',
    category: 'Hosting & Server',
    summary: 'Overview of all 32 normalized database tables, indexes, and foreign keys.',
    content: `The database employs a fully normalized relational schema:
- users, admins, roles, permissions
- tools, categories, tool_usage, tool_logs
- plans, user_subscriptions, daily_usage, guest_usage, ad_rewards
- payment_transactions, invoices
- ad_slots, advertisements, seo_meta
- All financial records store timestamps in UTC and display localized to Asia/Kolkata.`,
  },
  {
    id: 'doc_6',
    file: 'admin-login.html',
    title: 'Admin Panel Access & Security',
    category: 'Getting Started',
    summary: 'Logging into the administration console, custom path hiding, and 2FA readiness.',
    content: `Default access path is /admin.
Security Recommendation: In Admin Settings -> Security, change the default admin URL to a custom slug (e.g. /my-secret-console). If an unauthenticated visitor attempts to access /admin, the server returns a clean 404 Not Found header.`,
  },
  {
    id: 'doc_10',
    file: 'seo.html',
    title: 'SEO Architecture & Google Compliance',
    category: 'Tools & SEO',
    summary: 'Configuring XML sitemaps, robots.txt, Schema.org JSON-LD, and SERP previews.',
    content: `Every tool page includes over 500 words of original, value-dense educational copy, structured JSON-LD schemas (WebApplication, FAQPage, BreadcrumbList), canonical tags, and Open Graph previews. Sitemaps are dynamically generated at /sitemap.xml.`,
  },
  {
    id: 'doc_16',
    file: 'ai-setup.html',
    title: 'Gemini AI Configuration & Thinking Mode',
    category: 'Tools & SEO',
    summary: 'Setting up Gemini API keys and enabling High Thinking reasoning mode.',
    content: `Configure your GEMINI_API_KEY securely.
The platform uses the official @google/genai TypeScript SDK:
- gemini-3.5-flash: general high-speed operations.
- gemini-3.1-flash-lite: instant lightweight prompts.
- gemini-3.1-pro-preview: complex STEM, coding, and multi-step reasoning with thinkingLevel set to ThinkingLevel.HIGH without maxOutputTokens.`,
  },
  {
    id: 'doc_18',
    file: 'resale-keys.html',
    title: '10,000 Resale License Keys Manager',
    category: 'Monetization',
    summary: 'How to distribute, validate, and export pre-generated AITI license keys.',
    content: `The software includes 10,000 cryptographically generated, unique resale keys formatted as AITI-XXXX-XXXX-XXXX-XXXX.
Admins can export the full key list in TXT or CSV with a single click from the Admin Resale Keys tab. Each key can be assigned a custom domain, activation limit, and expiration date.`,
  },
  {
    id: 'doc_27',
    file: 'adsense.html',
    title: 'Google AdSense Approval Blueprint',
    category: 'Monetization',
    summary: 'Essential checklist for getting your domain approved for Google AdSense monetization.',
    content: `To achieve fast Google AdSense approval:
1. Ensure all mandatory policy pages (Privacy, Terms, About, Contact, Cookie, Disclaimer, DMCA) are published.
2. Keep the GDPR/DPDP Cookie Consent Banner enabled to prevent unconsented script execution.
3. Comply with the 3-ad density rule per page to keep content prominent.
4. Auto-generate your ads.txt at the domain root.
5. All 200+ tool pages provide genuine working utility with no deceptive download buttons.`,
  },
  {
    id: 'doc_28',
    file: 'monetization.html',
    title: 'Usage Limits & Pricing Plans',
    category: 'Monetization',
    summary: 'Configuring guest quotas, Free Forever daily limits, ad-watch rewards, and payment gateways.',
    content: `Monetization defaults:
- Guest users receive 10 free uses before seeing the signup modal.
- Free Forever plan: 25 uses/day, reset at midnight IST.
- Ad Bonus: Free users can watch up to three 10-second sponsor messages per day to earn +10 extra tool uses each.
- Standard Plan: ₹9/month (250 uses/day, ad-free, 7-day trial).
- Premium Plan: ₹29/month (unlimited uses, priority processing, 7-day trial).
- Supported gateways: Razorpay, Cashfree, Stripe, UPI direct QR.`,
  },
  {
    id: 'doc_23',
    file: 'security.html',
    title: 'Seven-Layer Security Architecture',
    category: 'Advanced & Security',
    summary: 'Complete technical breakdown of defenses protecting against XSS, SQLi, CSRF, and arbitrary uploads.',
    content: `Layer 1: Server hardening (.htaccess / Nginx security headers, HSTS, CSP).
Layer 2: Application security (CSRF tokens, prepared statements, input sanitization).
Layer 3: Authentication (bcrypt password hashing, rate limiting, brute-force lockout).
Layer 4: File storage (storage outside web root, MIME & magic byte verification, signed temporary download tokens).
Layer 5: API protection (Bearer tokens, per-key rate limiting).
Layer 6: Database defense (strict least-privilege users, encrypted sensitive fields).
Layer 7: Auditing & Monitoring (activity log, failed login alarms).`,
  },
  {
    id: 'doc_35',
    file: 'api-reference.html',
    title: 'REST API v1 Reference',
    category: 'Advanced & Security',
    summary: 'Technical specifications for /api/health, /api/gemini/chat, /api/tools/run-tests, and tool processing.',
    content: `Available Endpoints:
- GET /api/health: Returns system status, uptime, and Gemini readiness.
- GET /api/tools/run-tests: Executes automated unit and regression checks on tool engines.
- POST /api/gemini/chat: Multi-turn chat with model selection and ThinkingLevel.HIGH.
- POST /api/gemini/tool-process: AI tool helper for summarization, rewrite, and translation.
- GET /api/resale-keys/export: Downloadable TXT or CSV containing license keys.`,
  },
];
