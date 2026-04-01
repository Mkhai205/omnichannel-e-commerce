import { StorageService } from '../../infrastructure/storage/storage.service';

const SHOP_MEDIA_BUCKET = 'products';

export function resolveShopAvatarUrl(
  storageService: StorageService,
  avatarKey?: string | null,
): string | null {
  const resolvedObjectKey =
    normalizeObjectKey(avatarKey) ?? 'placeholders/shop-avatar-default.png';

  try {
    return storageService.getPublicUrl(SHOP_MEDIA_BUCKET, resolvedObjectKey);
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
