import { CollectionConfig } from './types';

export async function getCollectionName(
  collectionConfig: CollectionConfig | undefined
): Promise<string> {
  if (!collectionConfig) return 'unknown collection';

  if (collectionConfig.collectionKey) {
    return collectionConfig.collectionKey;
  }
  return '';
}
