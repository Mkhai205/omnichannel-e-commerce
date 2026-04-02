import { StorageService } from '../../infrastructure/storage/storage.service';

const CATALOG_MEDIA_BUCKET = 'products';

type CatalogImageEntityTypeValue = 'CATEGORY' | 'PRODUCT' | 'PRODUCT_VARIANT';

export function resolveCatalogImageUrl(
  storageService: StorageService,
  entityType: CatalogImageEntityTypeValue,
  imageKey?: string | null,
  fallbackImageKey?: string | null,
): string | null {
  const resolvedObjectKey =
    normalizeObjectKey(imageKey) ??
    normalizeObjectKey(fallbackImageKey) ??
    resolveFallbackObjectKey(entityType);

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

function resolveFallbackObjectKey(
  entityType: CatalogImageEntityTypeValue,
): string {
  switch (entityType) {
    case 'CATEGORY':
      return 'placeholders/category-default.png';
    case 'PRODUCT':
      return 'placeholders/product-default.png';
    case 'PRODUCT_VARIANT':
      return 'placeholders/variant-default.png';
  }
}
