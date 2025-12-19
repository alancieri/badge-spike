import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listBadges, deleteBadge, BadgeMeta } from '../services/bucketStorage';

export function BadgeList() {
  const [badges, setBadges] = useState<BadgeMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBadges = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listBadges();
      setBadges(data);
    } catch (err) {
      setError('Errore nel caricamento dei badge');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBadges();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(`Sei sicuro di voler eliminare "${id}"?`)) return;

    try {
      await deleteBadge(id);
      await loadBadges();
    } catch (err) {
      alert("Errore durante l'eliminazione");
      console.error(err);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('it-IT');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h1 style={{ margin: 0 }}>Badge</h1>
        <Link
          to="/creator"
          style={{
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 500,
          }}
        >
          + Nuovo Badge
        </Link>
      </div>

      {loading && <p>Caricamento...</p>}

      {error && <p style={{ color: '#dc2626' }}>{error}</p>}

      {!loading && !error && badges.length === 0 && (
        <p style={{ color: '#64748b' }}>
          Nessun badge trovato. Crea il tuo primo badge!
        </p>
      )}

      {!loading && badges.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ textAlign: 'left', padding: '12px 8px' }}>Nome</th>
              <th style={{ textAlign: 'left', padding: '12px 8px' }}>
                Ultima modifica
              </th>
              <th style={{ textAlign: 'right', padding: '12px 8px' }}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {badges.map((badge) => (
              <tr key={badge.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 8px' }}>{badge.name}</td>
                <td style={{ padding: '12px 8px', color: '#64748b' }}>
                  {formatDate(badge.updatedAt)}
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                  <Link
                    to={`/badge/${badge.id}`}
                    style={{
                      marginRight: '8px',
                      padding: '6px 12px',
                      backgroundColor: '#f1f5f9',
                      color: '#1e293b',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  >
                    Visualizza
                  </Link>
                  <Link
                    to={`/creator/${badge.id}`}
                    style={{
                      marginRight: '8px',
                      padding: '6px 12px',
                      backgroundColor: '#f1f5f9',
                      color: '#1e293b',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  >
                    Modifica
                  </Link>
                  <button
                    onClick={() => handleDelete(badge.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
