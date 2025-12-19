import { RARITY_CONFIG } from '../../types/badge';
import { TemplateProps, getSizeConfig, getColorFromPrimary } from './shared';

export function HexagonTemplate({ badge, size = 'medium' }: TemplateProps) {
  const rarity = badge.rarity || 'common';
  const config = RARITY_CONFIG[rarity];
  const colors = getColorFromPrimary(badge.primaryColor);
  const s = getSizeConfig(size);

  const title = badge.title?.default || 'Untitled';
  const iconUrl = badge.icon?.url || '';

  // Hexagon clip path
  const hexClip = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

  return (
    <div
      style={{
        width: s.container,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {/* Hexagon container */}
      <div
        style={{
          width: s.container * 0.9,
          height: s.container * 0.9,
          position: 'relative',
        }}
      >
        {/* Outer hexagon (border sottile) */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: colors.primary,
            clipPath: hexClip,
            filter: `drop-shadow(0 2px 6px ${colors.glow})`,
          }}
        />

        {/* Inner hexagon (white) */}
        <div
          style={{
            position: 'absolute',
            top: '3%',
            left: '3%',
            width: '94%',
            height: '94%',
            background: '#ffffff',
            clipPath: hexClip,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: s.icon,
              height: s.icon,
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
                  objectFit: 'contain',
                }}
              />
            ) : (
              <svg
                width={s.icon * 0.6}
                height={s.icon * 0.6}
                viewBox="0 0 24 24"
                fill="none"
                stroke={colors.primary}
                strokeWidth="1.5"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M12 12v3" />
                <path d="M8 21l2-4h4l2 4" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Title below */}
      <span
        style={{
          fontSize: s.title,
          fontWeight: 600,
          color: '#0f172a',
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        {title}
      </span>

      {/* Rarity pill */}
      <span
        style={{
          padding: '2px 10px',
          backgroundColor: colors.primary,
          color: '#fff',
          fontSize: size === 'small' ? 8 : 10,
          fontWeight: 500,
          borderRadius: 100,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
        }}
      >
        {config.label}
      </span>
    </div>
  );
}
