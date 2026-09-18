export type CategoryId =
  | 'pdf'
  | 'image'
  | 'text'
  | 'developer'
  | 'calculators'
  | 'seo'
  | 'qr'
  | 'generators'
  | 'ai'
  | 'security'
  | 'color'
  | 'datetime'
  | 'finance'
  | 'education'
  | 'file';

export interface ToolCategory {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
  count: number;
  badge?: string;
}

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: CategoryId;
  icon: string;
  status: 'active' | 'popular' | 'new' | 'featured' | 'pro' | 'ai';
  isPopular?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isAi?: boolean;
  supportedFormats?: string[];
  maxFileSizeMB?: number;
  inputPlaceholder?: string;
  howToUse?: string[];
  features?: string[];
  faq?: ToolFAQ[];
  relatedToolSlugs?: string[];
  recommendedToolSlugs?: string[];
}

export interface UserUsageState {
  userType: 'guest' | 'free' | 'standard' | 'premium';
  guestUsesRemaining: number; // starts at 10
  dailyUsesRemaining: number; // 25 for free, 250 standard, -1 premium
  adBonusUses?: number;
  adWatchesToday?: number; // max 3
  lastAdWatchTime?: string;
  history?: {
    toolId: string;
    toolName: string;
    timestamp: string;
  }[];
  favorites?: string[]; // tool slugs
  licenseKey?: string;
  isTrialActive?: boolean;
  lastResetDate?: string;
}

export interface PricingPlan {
  id: string;
  slug: 'free-forever' | 'standard' | 'premium';
  name: string;
  priceINR: number;
  billingPeriod: string;
  dailyLimit: number; // -1 for unlimited
  trialDays: number;
  badge?: string;
  description: string;
  features: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  thinking?: string;
  modelUsed?: string;
}

export interface AdSlotConfig {
  id: string;
  slug: string;
  name: string;
  position: string;
  size: string;
  isActive: boolean;
  customHtml?: string;
}

export interface DocumentationArticle {
  id: string;
  file: string;
  title: string;
  category: 'Getting Started' | 'Hosting & Server' | 'Tools & SEO' | 'Monetization' | 'Advanced & Security';
  summary: string;
  content: string;
}
