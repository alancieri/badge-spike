import { Badge, BadgeRarity } from '../../types/badge';

// Props comuni a tutti i template
export interface TemplateProps {
  badge: Partial<Badge>;
  size?: 'small' | 'medium' | 'large';
}

// Default primary color
const DEFAULT_PRIMARY = '#2563eb';

// Stili per rarità condivisi tra tutti i template
export const RARITY_STYLES: Record<
  BadgeRarity,
  {
    primary: string;
    secondary: string;
    glow: string;
    gradient: string;
  }
> = {
  common: {
    primary: '#64748b',
    secondary: '#94a3b8',
    glow: 'rgba(100, 116, 139, 0.2)',
    gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
  },
  rare: {
    primary: '#2563eb',
    secondary: '#60a5fa',
    glow: 'rgba(37, 99, 235, 0.2)',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  },
  epic: {
    primary: '#7c3aed',
    secondary: '#a78bfa',
    glow: 'rgba(124, 58, 237, 0.2)',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
  },
  legendary: {
    primary: '#d97706',
    secondary: '#fbbf24',
    glow: 'rgba(217, 119, 6, 0.25)',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  },
};

// Helper per calcolare colori dal primaryColor
export function getColorFromPrimary(primaryColor: string = DEFAULT_PRIMARY) {
  // Genera una versione più chiara per secondary
  const lighten = (hex: string, percent: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + Math.round(255 * percent));
    const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.round(255 * percent));
    const b = Math.min(255, (num & 0x0000ff) + Math.round(255 * percent));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  // Genera una versione più scura
  const darken = (hex: string, percent: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - Math.round(255 * percent));
    const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(255 * percent));
    const b = Math.max(0, (num & 0x0000ff) - Math.round(255 * percent));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  // Estrai RGB per glow
  const num = parseInt(primaryColor.replace('#', ''), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  return {
    primary: primaryColor,
    secondary: lighten(primaryColor, 0.3),
    glow: `rgba(${r}, ${g}, ${b}, 0.15)`,
    gradient: `linear-gradient(135deg, ${primaryColor} 0%, ${darken(primaryColor, 0.15)} 100%)`,
  };
}

// Helper per ottenere dimensioni in base alla size
export function getSizeConfig(size: 'small' | 'medium' | 'large') {
  return {
    small: {
      container: 140,
      icon: 48,
      title: 12,
      subtitle: 10,
    },
    medium: {
      container: 200,
      icon: 72,
      title: 15,
      subtitle: 12,
    },
    large: {
      container: 280,
      icon: 100,
      title: 20,
      subtitle: 14,
    },
  }[size];
}
