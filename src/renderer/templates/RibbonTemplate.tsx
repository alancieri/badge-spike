import { RARITY_CONFIG } from '../../types/badge';
import { TemplateProps, getSizeConfig, getColorFromPrimary } from './shared';

export function RibbonTemplate({ badge, size = 'medium' }: TemplateProps) {
  const rarity = badge.rarity || 'common';
  const config = RARITY_CONFIG[rarity];
  const colors = getColorFromPrimary(badge.primaryColor);
  const s = getSizeConfig(size);

  const title = badge.title?.default || 'Untitled';
  const iconUrl = badge.icon?.url || '';

  const ribbonWidth = s.container * 0.25;
  const ribbonHeight = s.container * 0.35;

  return (
    <div
      style={{
        width: s.container,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: ribbonHeight * 0.5,
      }}
    >
      {/* Medal circle */}
      <div
        style={{
          width: s.container * 0.75,
          height: s.container * 0.75,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Outer ring - bordo sottile */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `2px solid ${colors.primary}`,
            background: '#ffffff',
            boxShadow: `0 2px 8px ${colors.glow}`,
          }}
        />

        {/* Inner circle with icon */}
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '12%',
            width: '76%',
            height: '76%',
            borderRadius: '50%',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={title}
              style={{
                width: '70%',
                height: '70%',
                objectFit: 'contain',
              }}
            />
          ) : (
            <svg
              width={s.icon * 0.5}
              height={s.icon * 0.5}
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.primary}
              strokeWidth="1.5"
            >
              <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
            </svg>
          )}
        </div>

        {/* Small dot decoration */}
        <div
          style={{
            position: 'absolute',
            top: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: colors.primary,
          }}
        />
      </div>

      {/* Ribbons */}
      <div
        style={{
          position: 'relative',
          width: s.container * 0.55,
          height: ribbonHeight,
          marginTop: -s.container * 0.12,
          zIndex: 1,
        }}
      >
        {/* Left ribbon */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: ribbonWidth,
            height: ribbonHeight,
            background: colors.primary,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%)',
            transform: 'rotate(-12deg)',
            transformOrigin: 'top center',
            opacity: 0.9,
          }}
        />

        {/* Right ribbon */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: ribbonWidth,
            height: ribbonHeight,
            background: colors.primary,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%)',
            transform: 'rotate(12deg)',
            transformOrigin: 'top center',
            opacity: 0.9,
          }}
        />
      </div>

      {/* Title */}
      <span
        style={{
          fontSize: s.title,
          fontWeight: 600,
          color: '#0f172a',
          textAlign: 'center',
          marginTop: 8,
          lineHeight: 1.2,
        }}
      >
        {title}
      </span>

      {/* Rarity pill */}
      <span
        style={{
          marginTop: 6,
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
