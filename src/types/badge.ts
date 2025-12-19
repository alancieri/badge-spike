// Lingue supportate
export type SupportedLanguage = 'en' | 'it' | 'fr' | 'de' | 'es' | 'zh' | 'ja' | 'ar';

export const SUPPORTED_LANGUAGES: { code: SupportedLanguage; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'it', label: 'Italiano' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ar', label: 'العربية' },
];

// Testo localizzato con fallback obbligatorio
export interface LocalizedText {
  default: string;
  en?: string;
  it?: string;
  fr?: string;
  de?: string;
  es?: string;
  zh?: string;
  ja?: string;
  ar?: string;
}

// Icona badge con supporto dark mode
export interface BadgeIcon {
  url: string;
  darkUrl?: string;
}

// Categorie disponibili
export const BADGE_CATEGORIES = [
  'education',
  'environment',
  'social',
  'health',
  'community',
] as const;
export type BadgeCategory = (typeof BADGE_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<BadgeCategory, string> = {
  education: 'Education',
  environment: 'Environment',
  social: 'Social',
  health: 'Health',
  community: 'Community',
};

// Rarità disponibili con colori
export const BADGE_RARITIES = ['common', 'rare', 'epic', 'legendary'] as const;
export type BadgeRarity = (typeof BADGE_RARITIES)[number];

export const RARITY_CONFIG: Record<BadgeRarity, { label: string; color: string; bgColor: string }> = {
  common: { label: 'Common', color: '#6b7280', bgColor: '#f3f4f6' },
  rare: { label: 'Rare', color: '#3b82f6', bgColor: '#eff6ff' },
  epic: { label: 'Epic', color: '#8b5cf6', bgColor: '#f5f3ff' },
  legendary: { label: 'Legendary', color: '#f59e0b', bgColor: '#fffbeb' },
};

// Template disponibili per il rendering
export const BADGE_TEMPLATES = [
  'card',
  'card-horizontal',
  'card-minimal',
  'card-compact',
] as const;
export type BadgeTemplate = (typeof BADGE_TEMPLATES)[number];

export const TEMPLATE_CONFIG: Record<BadgeTemplate, { label: string; description: string }> = {
  card: { label: 'Card', description: 'Layout classico a scheda verticale' },
  'card-horizontal': { label: 'Card Horizontal', description: 'Layout orizzontale, icona a sinistra' },
  'card-minimal': { label: 'Card Minimal', description: 'Ultra minimalista, solo essenziale' },
  'card-compact': { label: 'Card Compact', description: 'Compatto e quadrato, ideale per griglie' },
};

// Colori primari predefiniti
export const PRIMARY_COLORS = [
  { value: '#2563eb', label: 'Blue' },
  { value: '#059669', label: 'Green' },
  { value: '#dc2626', label: 'Red' },
  { value: '#7c3aed', label: 'Purple' },
  { value: '#ea580c', label: 'Orange' },
  { value: '#0891b2', label: 'Cyan' },
  { value: '#be185d', label: 'Pink' },
  { value: '#4b5563', label: 'Gray' },
] as const;

// Interfaccia principale Badge
export interface Badge {
  id: string;
  slug: string;
  version: number;
  tenantId: string | null;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  category: BadgeCategory;
  rarity: BadgeRarity;
  template: BadgeTemplate;
  primaryColor?: string; // Colore primario per il template
  tags: string[];
  icon: BadgeIcon;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

// Helper per creare un badge vuoto
export function createEmptyBadge(): Omit<Badge, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'> {
  return {
    slug: '',
    version: 1,
    tenantId: null,
    title: { default: '' },
    subtitle: { default: '' },
    description: { default: '' },
    category: 'education',
    rarity: 'common',
    template: 'card',
    primaryColor: '#2563eb',
    tags: [],
    icon: { url: '' },
  };
}

// Helper per generare slug da titolo
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_')
    .substring(0, 50);
}
