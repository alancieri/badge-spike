import { Badge, RARITY_CONFIG, CATEGORY_LABELS } from '../../types/badge';

interface CardHorizontalProps {
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
    lightBg: `rgba(${r}, ${g}, ${b}, 0.06)`,
  };
}

export function CardHorizontal({ badge, size = 'medium', showDetails = true }: CardHorizontalProps) {
  const rarity = badge.rarity || 'common';
  const rarityConfig = RARITY_CONFIG[rarity];
  const colors = getColorPalette(badge.primaryColor);

  const sizeConfig = {
    small: {
      width: 280,
      height: 80,
      padding: 12,
      icon: 48,
      title: 14,
      subtitle: 11,
      badgeSize: 9,
      gap: 12,
    },
    medium: {
      width: 360,
      height: 100,
      padding: 16,
      icon: 64,
      title: 16,
      subtitle: 12,
      badgeSize: 10,
      gap: 16,
    },
    large: {
      width: 440,
      height: 120,
      padding: 20,
      icon: 80,
      title: 18,
      subtitle: 13,
      badgeSize: 10,
      gap: 20,
    },
  };

  const s = sizeConfig[size];

  const title = badge.title?.default || 'Untitled Badge';
  const subtitle = badge.subtitle?.default || '';
  const category = badge.category ? CATEGORY_LABELS[badge.category] : '';
  const iconUrl = badge.icon?.url || '';

  return (
    <div
      style={{
        width: s.width,
        height: s.height,
        padding: s.padding,
        borderRadius: 12,
        background: '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: `0 2px 8px ${colors.glowColor}`,
        display: 'flex',
        alignItems: 'center',
        gap: s.gap,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 4px 16px ${colors.glowColor}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 2px 8px ${colors.glowColor}`;
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: s.icon,
          height: s.icon,
          borderRadius: 10,
          background: iconUrl ? '#fff' : colors.lightBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
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
              borderRadius: 10,
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

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h3
            style={{
              margin: 0,
              fontSize: s.title,
              fontWeight: 600,
              color: '#0f172a',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </h3>
          {/* Rarity Pill */}
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
              flexShrink: 0,
            }}
          >
            {rarityConfig.label}
          </span>
        </div>

        {subtitle && (
          <p
            style={{
              margin: 0,
              fontSize: s.subtitle,
              fontWeight: 400,
              color: '#64748b',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {subtitle}
          </p>
        )}

        {showDetails && category && (
          <span
            style={{
              display: 'inline-block',
              marginTop: 6,
              fontSize: s.badgeSize,
              fontWeight: 500,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {category}
          </span>
        )}
      </div>
    </div>
  );
}
