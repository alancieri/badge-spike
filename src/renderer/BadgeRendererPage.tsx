import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBadge } from '../services/bucketStorage';
import {
  Badge,
  BadgeTemplate,
  BADGE_TEMPLATES,
  TEMPLATE_CONFIG,
  PRIMARY_COLORS,
} from '../types/badge';
import { BadgeRenderer } from './BadgeRenderer';

export function BadgeRendererPage() {
  const { id } = useParams<{ id: string }>();
  const [badge, setBadge] = useState<Badge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Override controls
  const [templateOverride, setTemplateOverride] = useState<BadgeTemplate | ''>('');
  const [colorOverride, setColorOverride] = useState<string>('');

  useEffect(() => {
    if (!id) return;

    const loadBadge = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBadge(id);
        setBadge(data);
      } catch (err) {
        setError('Errore nel caricamento del badge');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBadge();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>Caricamento...</p>
      </div>
    );
  }

  if (error || !badge) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: '#dc2626' }}>{error || 'Badge non trovato'}</p>
        <Link to="/" style={{ color: '#2563eb' }}>
          Torna alla lista
        </Link>
      </div>
    );
  }

  const selectStyle: React.CSSProperties = {
    padding: '6px 10px',
    fontSize: 13,
    border: '1px solid #d1d5db',
    borderRadius: 6,
    backgroundColor: '#fff',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: '#f8fafc',
      }}
    >
      {/* Override Controls */}
      <div
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          padding: 16,
          backgroundColor: '#fff',
          borderRadius: 10,
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          fontSize: 13,
          zIndex: 100,
        }}
      >
        <span style={{ fontWeight: 600, color: '#374151' }}>Override Test</span>

        {/* Template Override */}
        <div>
          <label style={{ display: 'block', marginBottom: 4, color: '#6b7280' }}>
            Template
          </label>
          <select
            value={templateOverride}
            onChange={(e) => setTemplateOverride(e.target.value as BadgeTemplate | '')}
            style={selectStyle}
          >
            <option value="">Default (dal badge)</option>
            {BADGE_TEMPLATES.map((t) => (
              <option key={t} value={t}>
                {TEMPLATE_CONFIG[t].label}
              </option>
            ))}
          </select>
        </div>

        {/* Color Override */}
        <div>
          <label style={{ display: 'block', marginBottom: 4, color: '#6b7280' }}>
            Colore
          </label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              onClick={() => setColorOverride('')}
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                border: colorOverride === '' ? '2px solid #0f172a' : '1px solid #d1d5db',
                backgroundColor: '#fff',
                cursor: 'pointer',
                fontSize: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Default"
            >
              ✕
            </button>
            {PRIMARY_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setColorOverride(c.value)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  backgroundColor: c.value,
                  border: colorOverride === c.value ? '2px solid #0f172a' : 'none',
                  cursor: 'pointer',
                }}
                title={c.label}
              />
            ))}
            <input
              type="color"
              value={colorOverride || badge.primaryColor || '#2563eb'}
              onChange={(e) => setColorOverride(e.target.value)}
              style={{
                width: 24,
                height: 24,
                padding: 0,
                border: '1px solid #d1d5db',
                borderRadius: 4,
                cursor: 'pointer',
              }}
              title="Personalizzato"
            />
          </div>
        </div>

        {/* Reset button */}
        {(templateOverride || colorOverride) && (
          <button
            onClick={() => {
              setTemplateOverride('');
              setColorOverride('');
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            Reset Override
          </button>
        )}
      </div>

      <BadgeRenderer
        badge={badge}
        size="large"
        templateOverride={templateOverride || undefined}
        primaryColorOverride={colorOverride || undefined}
      />

      <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
        <Link
          to={`/creator/${id}`}
          style={{
            padding: '10px 24px',
            backgroundColor: '#2563eb',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 8,
            fontWeight: 500,
          }}
        >
          Modifica
        </Link>
        <Link
          to="/"
          style={{
            padding: '10px 24px',
            backgroundColor: '#f1f5f9',
            color: '#1e293b',
            textDecoration: 'none',
            borderRadius: 8,
            fontWeight: 500,
          }}
        >
          Torna alla lista
        </Link>
      </div>

      {/* JSON debug */}
      <details style={{ marginTop: 40, width: '100%', maxWidth: 600 }}>
        <summary style={{ cursor: 'pointer', color: '#6b7280' }}>
          Mostra JSON
        </summary>
        <pre
          style={{
            marginTop: 12,
            padding: 16,
            backgroundColor: '#1f2937',
            color: '#f9fafb',
            borderRadius: 8,
            overflow: 'auto',
            fontSize: 12,
          }}
        >
          {JSON.stringify(badge, null, 2)}
        </pre>
      </details>
    </div>
  );
}
