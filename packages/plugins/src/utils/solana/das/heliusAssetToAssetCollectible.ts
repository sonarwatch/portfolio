import {
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioAssetType,
} from '@sonarwatch/portfolio-core';
import { CollectionGroup, HeliusAsset } from './types';

export function heliusAssetToAssetCollectible(
  asset: HeliusAsset
): PortfolioAssetCollectible | null {
  // Tags
  const tags: string[] | undefined = [];
  if (asset.compression.compressed) tags.push('compressed');
  if (asset.spl20) tags.push('spl20');
  if (asset.inscription) tags.push('inscription');

  const decimals = asset.token_info?.decimals;
  const balance = asset.token_info?.balance;
  if (decimals !== undefined && decimals !== 0) return null;

  // Amount
  let amount = 1;
  if (balance && balance !== 0) {
    amount = balance;
    tags.push('sft');
  }

  // Collection
  const collection = asset.grouping.find(
    (g) => g.group_key === 'collection'
  ) as CollectionGroup | undefined;

  return {
    type: PortfolioAssetType.collectible,
    attributes: {
      tags: tags.length > 0 ? tags : undefined,
    },
    data: {
      address: asset.id,
      amount,
      price: null,
      name: asset.content.metadata.name,
      dataUri: asset.content.json_uri,
      imageUri: asset.content.links?.image,
      attributes: asset.content.metadata.attributes,
      collection: collection
        ? {
            id: collection?.group_value,
            name: collection?.collection_metadata.name,
            floorPrice: null,
          }
        : undefined,
    },
    networkId: NetworkId.solana,
    value: null,
  };
}
