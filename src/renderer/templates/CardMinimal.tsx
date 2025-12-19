import { Badge, RARITY_CONFIG } from '../../types/badge';

interface CardMinimalProps {
  badge: Partial<Badge>;
  size?: 'small' | 'medium' | 'large';
}

function getColorPalette(primaryColor: string = '#2563eb') {
  const num = parseInt(primaryColor.replace('#', ''), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  return {
    primary: primaryColor,
    glowColor: `rgba(${r}, ${g}, ${b}, 0.08)`,
  };
}

export function CardMinimal({ badge, size = 'medium' }: CardMinimalProps) {
  const rarity = badge.rarity || 'common';
  const rarityConfig = RARITY_CONFIG[rarity];
  const colors = getColorPalette(badge.primaryColor);

  const sizeConfig = {
    small: {
      width: 140,
      padding: 16,
      icon: 48,
      title: 12,
      badgeSize: 8,
      gap: 10,
    },
    medium: {
      width: 180,
      padding: 20,
      icon: 64,
      title: 14,
      badgeSize: 9,
      gap: 12,
    },
    large: {
      width: 220,
      padding: 24,
      icon: 80,
      title: 16,
      badgeSize: 10,
      gap: 14,
    },
  };

  const s = sizeConfig[size];

  const title = badge.title?.default || 'Untitled';
  const iconUrl = badge.icon?.url || '';

  return (
    <div
      style={{
        width: s.width,
        padding: s.padding,
        borderRadius: 12,
        background: '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: `0 1px 4px ${colors.glowColor}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: s.gap,
        transition: 'transform 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: s.icon,
          height: s.icon,
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: iconUrl ? 'transparent' : '#f8fafc',
        }}
      >
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <svg
            width={s.icon * 0.45}
            height={s.icon * 0.45}
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.primary}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M12 12v3" />
            <path d="M8 21l2-4h4l2 4" />
          </svg>
        )}
      </div>

      {/* Title */}
      <h3
        style={{
          margin: 0,
          fontSize: s.title,
          fontWeight: 600,
          color: '#0f172a',
          textAlign: 'center',
          lineHeight: 1.3,
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {title}
      </h3>

      {/* Rarity - small dot indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: colors.primary,
          }}
        />
        <span
          style={{
            fontSize: s.badgeSize,
            fontWeight: 500,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {rarityConfig.label}
        </span>
      </div>
    </div>
  );
}
