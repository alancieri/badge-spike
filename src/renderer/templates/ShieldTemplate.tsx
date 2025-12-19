import { RARITY_CONFIG } from '../../types/badge';
import { TemplateProps, getSizeConfig, getColorFromPrimary } from './shared';

export function ShieldTemplate({ badge, size = 'medium' }: TemplateProps) {
  const rarity = badge.rarity || 'common';
  const config = RARITY_CONFIG[rarity];
  const colors = getColorFromPrimary(badge.primaryColor);
  const s = getSizeConfig(size);

  const title = badge.title?.default || 'Untitled';
  const subtitle = badge.subtitle?.default || '';
  const iconUrl = badge.icon?.url || '';

  // Shield clip path
  const shieldClip = 'polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)';

  const shieldHeight = s.container * 1.15;

  return (
    <div
      style={{
        width: s.container,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Shield container */}
      <div
        style={{
          width: s.container * 0.85,
          height: shieldHeight,
          position: 'relative',
        }}
      >
        {/* Outer shield (border sottile) */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: colors.primary,
            clipPath: shieldClip,
            filter: `drop-shadow(0 2px 8px ${colors.glow})`,
          }}
        />

        {/* Inner shield (white) */}
        <div
          style={{
            position: 'absolute',
            top: '2%',
            left: '3%',
            width: '94%',
            height: '96%',
            background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
            clipPath: shieldClip,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: s.container * 0.12,
            gap: 6,
          }}
        >
          {/* Decorative top bar */}
          <div
            style={{
              width: '50%',
              height: 2,
              background: colors.primary,
              borderRadius: 1,
            }}
          />

          {/* Icon */}
          <div
            style={{
              width: s.icon,
              height: s.icon,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 4,
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
                <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
              </svg>
            )}
          </div>

          {/* Title */}
          <span
            style={{
              fontSize: s.title,
              fontWeight: 600,
              color: '#0f172a',
              textAlign: 'center',
              lineHeight: 1.1,
              maxWidth: '85%',
            }}
          >
            {title}
          </span>

          {/* Subtitle */}
          {subtitle && size !== 'small' && (
            <span
              style={{
                fontSize: s.subtitle * 0.9,
                color: '#64748b',
                textAlign: 'center',
                maxWidth: '80%',
              }}
            >
              {subtitle}
            </span>
          )}

          {/* Rarity at bottom */}
          <span
            style={{
              marginTop: 'auto',
              marginBottom: s.container * 0.08,
              fontSize: size === 'small' ? 7 : 9,
              fontWeight: 500,
              color: colors.primary,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
}
