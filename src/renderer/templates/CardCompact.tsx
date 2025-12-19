import { Badge, RARITY_CONFIG } from '../../types/badge';

interface CardCompactProps {
  badge: Partial<Badge>;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

function getColorPalette(primaryColor: string = '#2563eb') {
  const num = parseInt(primaryColor.replace('#', ''), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  return {
    primary: primaryColor,
    glowColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
    lightBg: `rgba(${r}, ${g}, ${b}, 0.04)`,
  };
}

export function CardCompact({ badge, size = 'medium', showDetails = true }: CardCompactProps) {
  const rarity = badge.rarity || 'common';
  const rarityConfig = RARITY_CONFIG[rarity];
  const colors = getColorPalette(badge.primaryColor);

  const sizeConfig = {
    small: {
      containerSize: 120,
      padding: 12,
      icon: 40,
      title: 11,
      subtitle: 9,
      badgeSize: 7,
      gap: 8,
    },
    medium: {
      containerSize: 160,
      padding: 16,
      icon: 56,
      title: 13,
      subtitle: 10,
      badgeSize: 8,
      gap: 10,
    },
    large: {
      containerSize: 200,
      padding: 20,
      icon: 72,
      title: 15,
      subtitle: 11,
      badgeSize: 9,
      gap: 12,
    },
  };

  const s = sizeConfig[size];

  const title = badge.title?.default || 'Untitled';
  const subtitle = badge.subtitle?.default || '';
  const iconUrl = badge.icon?.url || '';

  return (
    <div
      style={{
        width: s.containerSize,
        height: s.containerSize,
        padding: s.padding,
        borderRadius: 14,
        background: '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: `0 2px 6px ${colors.glowColor}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
        boxSizing: 'border-box',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 4px 12px ${colors.glowColor}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 2px 6px ${colors.glowColor}`;
      }}
    >
      {/* Icon with colored accent border */}
      <div
        style={{
          width: s.icon,
          height: s.icon,
          borderRadius: '50%',
          border: `2px solid ${colors.primary}`,
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: iconUrl ? '#fff' : colors.lightBg,
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
              borderRadius: '50%',
            }}
          />
        ) : (
          <svg
            width={s.icon * 0.4}
            height={s.icon * 0.4}
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
          lineHeight: 1.2,
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </h3>

      {/* Subtitle */}
      {showDetails && subtitle && (
        <p
          style={{
            margin: 0,
            fontSize: s.subtitle,
            fontWeight: 400,
            color: '#64748b',
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Rarity Pill - positioned at bottom */}
      <span
        style={{
          padding: '2px 8px',
          borderRadius: 100,
          backgroundColor: colors.primary,
          color: '#ffffff',
          fontSize: s.badgeSize,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
        }}
      >
        {rarityConfig.label}
      </span>
    </div>
  );
}
