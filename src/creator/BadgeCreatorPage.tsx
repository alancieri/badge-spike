import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Badge, createEmptyBadge } from '../types/badge';
import { getBadge, saveBadge } from '../services/bucketStorage';
import { BadgeForm } from './BadgeForm';
import { BadgeRenderer } from '../renderer/BadgeRenderer';
import { useRightSidebar } from '../components/layout';

export function BadgeCreatorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setContent } = useRightSidebar();
  const isEditing = Boolean(id);

  const [badgeId] = useState(() => id || crypto.randomUUID());
  const [badge, setBadge] = useState<Partial<Badge>>(() => createEmptyBadge());
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set right sidebar content
  useEffect(() => {
    setContent(
      <>
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
          Anteprima
        </h3>
        <div className="flex justify-center">
          <BadgeRenderer badge={badge} size="medium" showDetails />
        </div>
      </>
    );

    return () => setContent(null);
  }, [badge, setContent]);

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

  const handleSave = async () => {
    if (!badge.title?.default) {
      alert('Il titolo è obbligatorio');
      return;
    }
    if (!badge.slug) {
      alert('Lo slug è obbligatorio');
      return;
    }

    try {
      setSaving(true);
      const now = new Date().toISOString();
      const fullBadge: Badge = {
        id: badgeId,
        slug: badge.slug || '',
        version: badge.version || 1,
        tenantId: badge.tenantId || null,
        title: badge.title || { default: '' },
        subtitle: badge.subtitle || { default: '' },
        description: badge.description || { default: '' },
        category: badge.category || 'education',
        rarity: badge.rarity || 'common',
        template: badge.template || 'card',
        primaryColor: badge.primaryColor || '#2563eb',
        tags: badge.tags || [],
        icon: badge.icon || { url: '' },
        createdAt: badge.createdAt || now,
        createdBy: badge.createdBy || 'anonymous',
        updatedAt: now,
        updatedBy: 'anonymous',
      };

      await saveBadge(fullBadge);
      navigate(`/badge/${badgeId}`);
    } catch (err) {
      console.error('Error saving badge:', err);
      alert('Errore durante il salvataggio');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Caricamento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-600">{error}</p>
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
              {isEditing ? 'Modifica Badge' : 'Nuovo Badge'}
            </h1>
            {badge.title?.default && (
              <p className="text-sm text-gray-500">{badge.title.default}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Annulla
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Salvataggio...' : 'Salva Badge'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8 flex justify-center">
        {/* Form */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 w-full max-w-4xl">
          <BadgeForm
            badge={badge}
            onChange={setBadge}
            badgeId={badgeId}
            disabled={saving}
          />
        </div>
      </div>
    </div>
  );
}
