import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Badge, createEmptyBadge } from '../types/badge';
import { getBadge, saveBadge } from '../services/bucketStorage';
import { BadgeForm } from './BadgeForm';
import { BadgeRenderer } from '../renderer/BadgeRenderer';

export function BadgeCreatorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [badgeId] = useState(() => id || crypto.randomUUID());
  const [badge, setBadge] = useState<Partial<Badge>>(() => createEmptyBadge());
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    // Validazione base
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
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>Caricamento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: '#dc2626' }}>{error}</p>
        <Link to="/" style={{ color: '#2563eb' }}>
          Torna alla lista
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div
        style={{
          padding: '16px 24px',
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link
            to="/"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            ← Indietro
          </Link>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
            {isEditing ? 'Modifica Badge' : 'Nuovo Badge'}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '10px 24px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontWeight: 500,
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'Salvataggio...' : 'Salva Badge'}
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          display: 'flex',
          gap: 40,
          padding: 24,
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        {/* Form */}
        <div
          style={{
            flex: 1,
            backgroundColor: 'white',
            padding: 24,
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <BadgeForm
            badge={badge}
            onChange={setBadge}
            badgeId={badgeId}
            disabled={saving}
          />
        </div>

        {/* Preview */}
        <div
          style={{
            width: 320,
            position: 'sticky',
            top: 24,
            alignSelf: 'flex-start',
          }}
        >
          <h3
            style={{
              margin: '0 0 16px',
              fontSize: 14,
              fontWeight: 500,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Anteprima
          </h3>
          <BadgeRenderer badge={badge} size="medium" showDetails />
        </div>
      </div>
    </div>
  );
}
