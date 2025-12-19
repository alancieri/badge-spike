import { RARITY_CONFIG } from '../../types/badge';
import { TemplateProps, getSizeConfig, getColorFromPrimary } from './shared';

export function CircleTemplate({ badge, size = 'medium' }: TemplateProps) {
  const rarity = badge.rarity || 'common';
  const config = RARITY_CONFIG[rarity];
  const colors = getColorFromPrimary(badge.primaryColor);
  const s = getSizeConfig(size);

  const title = badge.title?.default || 'Untitled';
  const iconUrl = badge.icon?.url || '';

  return (
    <div
      style={{
        width: s.container,
        height: s.container,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
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

      {/* Inner circle */}
      <div
        style={{
          position: 'absolute',
          width: '90%',
          height: '90%',
          borderRadius: '50%',
          background: '#ffffff',
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
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
              <circle cx="12" cy="8" r="4" />
              <path d="M12 12v3" />
              <path d="M8 21l2-4h4l2 4" />
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
            lineHeight: 1.2,
            maxWidth: '80%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </span>
      </div>

      {/* Rarity label at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: -8,
          padding: '2px 8px',
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
      </div>
    </div>
  );
}
