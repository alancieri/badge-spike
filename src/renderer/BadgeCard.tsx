import { Badge, RARITY_CONFIG, CATEGORY_LABELS } from '../types/badge';

interface BadgeCardProps {
  badge: Partial<Badge>;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

// Helper per generare palette dal primaryColor
function getColorPalette(primaryColor: string = '#2563eb') {
  const num = parseInt(primaryColor.replace('#', ''), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  return {
    primary: primaryColor,
    glowColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
    iconBg: `rgba(${r}, ${g}, ${b}, 0.08)`,
  };
}

export function BadgeCard({ badge, size = 'medium', showDetails = true }: BadgeCardProps) {
  const rarity = badge.rarity || 'common';
  const rarityConfig = RARITY_CONFIG[rarity];
  const colors = getColorPalette(badge.primaryColor);

  const sizeConfig = {
    small: {
      width: 200,
      padding: 20,
      icon: 64,
      title: 15,
      subtitle: 12,
      description: 11,
      badgeSize: 10,
      gap: 12,
    },
    medium: {
      width: 280,
      padding: 28,
      icon: 88,
      title: 18,
      subtitle: 13,
      description: 12,
      badgeSize: 10,
      gap: 16,
    },
    large: {
      width: 340,
      padding: 36,
      icon: 112,
      title: 22,
      subtitle: 15,
      description: 13,
      badgeSize: 11,
      gap: 20,
    },
  };

  const s = sizeConfig[size];

  const title = badge.title?.default || 'Untitled Badge';
  const subtitle = badge.subtitle?.default || '';
  const description = badge.description?.default || '';
  const category = badge.category ? CATEGORY_LABELS[badge.category] : '';
  const iconUrl = badge.icon?.url || '';

  return (
    <div
      style={{
        width: s.width,
        padding: s.padding,
        borderRadius: 16,
        background: '#ffffff',
        border: `1px solid rgba(0, 0, 0, 0.06)`,
        boxShadow: `0 2px 8px ${colors.glowColor}`,
        display: 'flex',
        flexDirection: 'column',
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
          borderRadius: '50%',
          background: iconUrl ? '#fff' : colors.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
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

      {/* Title & Subtitle */}
      <div style={{ textAlign: 'center' }}>
        <h3
          style={{
            margin: 0,
            fontSize: s.title,
            fontWeight: 600,
            color: '#0f172a',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            style={{
              margin: '6px 0 0',
              fontSize: s.subtitle,
              fontWeight: 400,
              color: '#64748b',
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Rarity Pill */}
      <span
        style={{
          padding: '4px 12px',
          borderRadius: 100,
          backgroundColor: colors.primary,
          color: '#ffffff',
          fontSize: s.badgeSize,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {rarityConfig.label}
      </span>

      {showDetails && (
        <>
          {/* Category */}
          {category && (
            <span
              style={{
                fontSize: s.description,
                fontWeight: 500,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {category}
            </span>
          )}

          {/* Description */}
          {description && (
            <p
              style={{
                margin: 0,
                fontSize: s.description,
                fontWeight: 400,
                color: '#475569',
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              {description}
            </p>
          )}

          {/* Tags */}
          {badge.tags && badge.tags.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                justifyContent: 'center',
              }}
            >
              {badge.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 4,
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    fontSize: s.badgeSize,
                    fontWeight: 500,
                    color: '#64748b',
                  }}
                >
                  {tag}
                </span>
              ))}
              {badge.tags.length > 3 && (
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: 4,
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    fontSize: s.badgeSize,
                    fontWeight: 500,
                    color: '#94a3b8',
                  }}
                >
                  +{badge.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
