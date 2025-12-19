import { supabase } from '../lib/supabase';
import { Badge } from '../types/badge';

const BADGES_BUCKET = 'badges';
const ICONS_FOLDER = 'icons'; // Sottocartella per le icone dentro il bucket badges

export interface BadgeMeta {
  id: string;
  name: string;
  updatedAt: string;
}

/**
 * Lista tutti i badge salvati nel bucket
 */
export async function listBadges(): Promise<BadgeMeta[]> {
  const { data, error } = await supabase.storage
    .from(BADGES_BUCKET)
    .list('', {
      sortBy: { column: 'updated_at', order: 'desc' },
    });

  if (error) {
    console.error('Error listing badges:', error);
    throw error;
  }

  return (data || [])
    .filter(file => file.name.endsWith('.json') && file.name !== ICONS_FOLDER)
    .map(file => ({
      id: file.name.replace('.json', ''),
      name: file.name.replace('.json', ''),
      updatedAt: file.updated_at || file.created_at || '',
    }));
}

/**
 * Carica un badge specifico dal bucket
 */
export async function getBadge(id: string): Promise<Badge> {
  const { data, error } = await supabase.storage
    .from(BADGES_BUCKET)
    .download(`${id}.json`);

  if (error) {
    console.error('Error downloading badge:', error);
    throw error;
  }

  const text = await data.text();
  return JSON.parse(text) as Badge;
}

/**
 * Salva un badge nel bucket
 */
export async function saveBadge(badge: Badge): Promise<void> {
  const blob = new Blob([JSON.stringify(badge, null, 2)], {
    type: 'application/json',
  });

  const { error } = await supabase.storage
    .from(BADGES_BUCKET)
    .upload(`${badge.id}.json`, blob, {
      upsert: true,
      contentType: 'application/json',
    });

  if (error) {
    console.error('Error saving badge:', error);
    throw error;
  }
}

/**
 * Elimina un badge dal bucket
 */
export async function deleteBadge(id: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BADGES_BUCKET)
    .remove([`${id}.json`]);

  if (error) {
    console.error('Error deleting badge:', error);
    throw error;
  }
}

/**
 * Upload di un'icona badge e ritorna l'URL pubblico
 * Le icone vengono salvate in badges/icons/{badgeId}.{ext}
 */
export async function uploadBadgeIcon(file: File, badgeId: string, isDark: boolean = false): Promise<string> {
  const extension = file.name.split('.').pop() || 'png';
  const fileName = isDark ? `${badgeId}_dark.${extension}` : `${badgeId}.${extension}`;
  const filePath = `${ICONS_FOLDER}/${fileName}`;

  console.log('[uploadBadgeIcon] Uploading to:', filePath);
  console.log('[uploadBadgeIcon] File:', file.name, file.type, file.size);

  const { data, error } = await supabase.storage
    .from(BADGES_BUCKET)
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  console.log('[uploadBadgeIcon] Upload result:', { data, error });

  if (error) {
    console.error('Error uploading icon:', error);
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from(BADGES_BUCKET)
    .getPublicUrl(filePath);

  // Aggiungi timestamp per evitare cache del browser
  const urlWithCacheBust = `${urlData.publicUrl}?t=${Date.now()}`;
  console.log('[uploadBadgeIcon] Public URL:', urlWithCacheBust);

  return urlWithCacheBust;
}

/**
 * Elimina un'icona badge dal bucket usando l'URL completo
 */
export async function deleteBadgeIconByUrl(iconUrl: string): Promise<void> {
  if (!iconUrl) {
    console.log('[deleteBadgeIconByUrl] No URL provided, skipping');
    return;
  }

  console.log('[deleteBadgeIconByUrl] Deleting:', iconUrl);

  try {
    // Estrae il path dal URL pubblico (rimuove query string se presente)
    // URL formato: https://xxx.supabase.co/storage/v1/object/public/badges/icons/uuid.png?t=123
    const url = new URL(iconUrl);
    const pathParts = url.pathname.split('/'); // pathname non include query string

    console.log('[deleteBadgeIconByUrl] Path parts:', pathParts);

    // Trova l'indice di 'badges' e prende tutto quello che viene dopo
    const bucketIndex = pathParts.findIndex(p => p === BADGES_BUCKET);
    if (bucketIndex === -1) {
      console.log('[deleteBadgeIconByUrl] Bucket not found in URL');
      return;
    }

    const filePath = pathParts.slice(bucketIndex + 1).join('/');
    console.log('[deleteBadgeIconByUrl] File path to delete:', filePath);

    const { data, error } = await supabase.storage
      .from(BADGES_BUCKET)
      .remove([filePath]);

    console.log('[deleteBadgeIconByUrl] Delete result:', { data, error });

    if (error) {
      console.error('Error deleting icon:', error);
    }
  } catch (err) {
    console.error('Error parsing icon URL:', err);
  }
}
