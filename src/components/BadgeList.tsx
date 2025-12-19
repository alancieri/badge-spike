import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listBadges, deleteBadge, BadgeMeta } from '../services/bucketStorage';
import { useRightSidebar } from './layout';

function EyeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

export function BadgeList() {
  const navigate = useNavigate();
  const { setContent } = useRightSidebar();
  const [badges, setBadges] = useState<BadgeMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Set empty right sidebar to maintain layout consistency
  useEffect(() => {
    setContent(<div />);
    return () => setContent(null);
  }, [setContent]);

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

  const handleDelete = async () => {
    if (!deleteModal) return;

    try {
      setDeleting(true);
      await deleteBadge(deleteModal.id);
      setDeleteModal(null);
      await loadBadges();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('it-IT');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="h-[72px] border-b border-gray-200 bg-white">
        <div className="px-8 h-full flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 leading-tight">Badge</h1>
            <p className="text-sm text-gray-500">
              {loading ? 'Caricamento...' : `${badges.length} badge`}
            </p>
          </div>
          <Link
            to="/creator"
            className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Nuovo Badge
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8 flex justify-center">
        <div className="w-full max-w-4xl">
          {/* Loading state */}
          {loading && (
            <div className="py-12 text-center text-gray-500">
              Caricamento...
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="py-12 text-center text-red-600">
              {error}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && badges.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Nessun badge</h3>
              <p className="text-gray-500 mb-6">Inizia creando il tuo primo badge</p>
              <Link
                to="/creator"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Nuovo Badge
              </Link>
            </div>
          )}

          {/* Badge table */}
          {!loading && badges.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ultima modifica
                    </th>
                    <th className="w-24"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {badges.map((badge) => (
                    <tr
                      key={badge.id}
                      onClick={() => navigate(`/creator/${badge.id}`)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-gray-900">{badge.name}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-500">{formatDate(badge.updatedAt)}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/badge/${badge.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                            title="Visualizza"
                          >
                            <EyeIcon />
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteModal({ id: badge.id, name: badge.name });
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Elimina"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !deleting && setDeleteModal(null)}
          />
          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Elimina badge
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Sei sicuro di voler eliminare <span className="font-medium">"{deleteModal.name}"</span>? Questa azione non può essere annullata.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Annulla
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleting ? 'Eliminazione...' : 'Elimina'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
