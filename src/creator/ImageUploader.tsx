import { useRef, useState } from 'react';

interface ImageUploaderProps {
  label: string;
  currentUrl?: string;
  onUpload: (file: File) => Promise<void>;
  onClear?: () => Promise<void>;
  disabled?: boolean;
}

export function ImageUploader({
  label,
  currentUrl,
  onUpload,
  onClear,
  disabled = false,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const isProcessing = uploading || deleting;

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Formato non supportato. Usa PNG, JPG, GIF, WEBP o SVG.');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Il file è troppo grande. Massimo 2MB.');
      return;
    }

    try {
      setUploading(true);
      await onUpload(file);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Errore durante l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled || isProcessing) return;

    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isProcessing) {
      setDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: 'block',
          fontSize: 14,
          fontWeight: 500,
          color: '#374151',
          marginBottom: 6,
        }}
      >
        {label}
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && !isProcessing && inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? '#2563eb' : '#d1d5db'}`,
          borderRadius: 8,
          padding: 20,
          textAlign: 'center',
          cursor: disabled || isProcessing ? 'not-allowed' : 'pointer',
          backgroundColor: dragOver ? '#eff6ff' : '#f9fafb',
          transition: 'all 0.2s',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {currentUrl ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <img
              src={currentUrl}
              alt="Preview"
              style={{
                width: 64,
                height: 64,
                objectFit: 'cover',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                opacity: deleting ? 0.5 : 1,
              }}
            />
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, fontSize: 13, color: '#374151' }}>
                {deleting ? 'Eliminazione...' : 'Immagine caricata'}
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                  disabled={isProcessing}
                  style={{
                    padding: '4px 12px',
                    fontSize: 12,
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                >
                  Cambia
                </button>
                {onClear && (
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        setDeleting(true);
                        await onClear();
                      } catch (err) {
                        console.error('Error clearing image:', err);
                        alert("Errore durante l'eliminazione");
                      } finally {
                        setDeleting(false);
                      }
                    }}
                    disabled={isProcessing}
                    style={{
                      padding: '4px 12px',
                      fontSize: 12,
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    Rimuovi
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : uploading ? (
          <p style={{ margin: 0, color: '#6b7280' }}>Caricamento...</p>
        ) : (
          <>
            <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
              Trascina un'immagine o clicca per selezionare
            </p>
            <p style={{ margin: '8px 0 0', color: '#9ca3af', fontSize: 12 }}>
              PNG, JPG, GIF, WEBP, SVG (max 2MB)
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        style={{ display: 'none' }}
        disabled={disabled || isProcessing}
      />
    </div>
  );
}
