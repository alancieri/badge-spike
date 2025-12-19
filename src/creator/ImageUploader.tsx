import { useRef, useState } from 'react';

interface ImageUploaderProps {
  label: string;
  hint?: string;
  currentUrl?: string;
  onUpload: (file: File) => Promise<void>;
  onClear?: () => Promise<void>;
  disabled?: boolean;
}

export function ImageUploader({
  label,
  hint,
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

    const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Formato non supportato. Usa PNG, JPG, GIF, WEBP o SVG.');
      return;
    }

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
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {hint && <span className="font-normal text-gray-400 ml-1">({hint})</span>}
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && !isProcessing && inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-5 text-center transition-all
          ${dragOver ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-gray-50/50'}
          ${disabled || isProcessing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-gray-300'}
        `}
      >
        {currentUrl ? (
          <div className="flex items-center justify-center gap-4">
            <img
              src={currentUrl}
              alt="Preview"
              className={`w-16 h-16 object-cover rounded-lg border border-gray-200 ${deleting ? 'opacity-50' : ''}`}
            />
            <div className="text-left">
              <p className="text-sm text-gray-700">
                {deleting ? 'Eliminazione...' : 'Immagine caricata'}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                  disabled={isProcessing}
                  className="px-3 py-1 text-xs font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
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
                    className="px-3 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    Rimuovi
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : uploading ? (
          <p className="text-sm text-gray-500">Caricamento...</p>
        ) : (
          <>
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              Trascina un'immagine o clicca per selezionare
            </p>
            <p className="text-xs text-gray-400 mt-1">
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
        className="hidden"
        disabled={disabled || isProcessing}
      />
    </div>
  );
}
