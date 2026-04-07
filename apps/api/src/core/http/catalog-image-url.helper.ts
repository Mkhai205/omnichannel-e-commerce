import { StorageService } from '../../infrastructure/storage/storage.service';

const CATALOG_MEDIA_BUCKET = 'products';

export function resolveCatalogImageUrl(
  storageService: StorageService,
  imageKey?: string | null,
  fallbackImageKey?: string | null,
): string | null {
  const resolvedObjectKey =
    normalizeObjectKey(imageKey) ?? normalizeObjectKey(fallbackImageKey);

  if (!resolvedObjectKey) {
    return null;
  }

  try {
    return storageService.getPublicUrl(CATALOG_MEDIA_BUCKET, resolvedObjectKey);
  } catch {
    return null;
  }
}

function normalizeObjectKey(objectKey?: string | null): string | null {
  if (objectKey === undefined || objectKey === null) {
    return null;
  }

  const normalized = objectKey.trim();

  return normalized.length > 0 ? normalized : null;
}
