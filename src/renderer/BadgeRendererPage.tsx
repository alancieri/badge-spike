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
import { useRightSidebar } from '../components/layout';

export function BadgeRendererPage() {
  const { id } = useParams<{ id: string }>();
  const { setContent } = useRightSidebar();
  const [badge, setBadge] = useState<Badge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Override controls
  const [templateOverride, setTemplateOverride] = useState<BadgeTemplate | ''>('');
  const [colorOverride, setColorOverride] = useState<string>('');

  // Set right sidebar content
  useEffect(() => {
    if (!badge) {
      setContent(null);
      return;
    }

    setContent(
      <>
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
          Override Test
        </h3>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          {/* Template Override */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1.5">
              Template
            </label>
            <select
              value={templateOverride}
              onChange={(e) => setTemplateOverride(e.target.value as BadgeTemplate | '')}
              className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
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
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1.5">
              Colore
            </label>
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setColorOverride('')}
                className={`w-6 h-6 rounded flex items-center justify-center text-xs border transition-all ${
                  colorOverride === ''
                    ? 'border-gray-900 bg-gray-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                title="Default"
              >
                ✕
              </button>
              {PRIMARY_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColorOverride(c.value)}
                  className={`w-6 h-6 rounded transition-all ${
                    colorOverride === c.value
                      ? 'ring-2 ring-gray-900 ring-offset-1'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
              <input
                type="color"
                value={colorOverride || badge.primaryColor || '#2563eb'}
                onChange={(e) => setColorOverride(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border border-gray-200"
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
              className="w-full px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset Override
            </button>
          )}
        </div>
      </>
    );

    return () => setContent(null);
  }, [badge, templateOverride, colorOverride, setContent]);

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
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Caricamento...</p>
      </div>
    );
  }

  if (error || !badge) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-600">{error || 'Badge non trovato'}</p>
        <Link to="/" className="text-gray-600 hover:text-gray-900">
          Torna alla lista
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="h-[72px] border-b border-gray-200 bg-white">
        <div className="px-8 h-full flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 leading-tight">
              {badge.title?.default || 'Badge'}
            </h1>
            {badge.subtitle?.default && (
              <p className="text-sm text-gray-500">{badge.subtitle.default}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Annulla
            </Link>
            <Link
              to={`/creator/${id}`}
              className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Modifica
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8 flex flex-col items-center">
        {/* Badge Preview */}
        <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center border border-gray-100 mb-8 w-full max-w-4xl">
          <BadgeRenderer
            badge={badge}
            size="large"
            templateOverride={templateOverride || undefined}
            primaryColorOverride={colorOverride || undefined}
          />
        </div>

        {/* JSON */}
        <div className="rounded-lg overflow-hidden border border-gray-200 w-full max-w-4xl">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
            <span className="text-sm text-gray-600 font-mono">badge.json</span>
          </div>
          <pre className="p-4 bg-gray-900 text-gray-100 overflow-auto text-xs font-mono leading-relaxed">
            {JSON.stringify(badge, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
