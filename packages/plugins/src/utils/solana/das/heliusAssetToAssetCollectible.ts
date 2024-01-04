import {
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioAssetType,
} from '@sonarwatch/portfolio-core';
import { HeliusAsset } from './types';

export function heliusAssetToAssetCollectible(
  asset: HeliusAsset
): PortfolioAssetCollectible {
  let amount = 1;
  if (asset.token_info && asset.token_info.decimals === 0) {
    amount = asset.token_info.balance;
  }

  let tags: string[] | undefined = [];
  if (asset.compression.compressed) tags.push('compressed');
  if (asset.spl20) tags.push('spl20');
  if (asset.inscription) tags.push('inscription');
  if (tags.length === 0) tags = undefined;

  return {
    type: PortfolioAssetType.collectible,
    attributes: {
      tags,
    },
    data: {
      address: asset.id,
      amount,
      price: null,
      name: asset.content.metadata.name,
      dataUri: asset.content.json_uri,
      imageUri: asset.content.links?.image,
    },
    networkId: NetworkId.solana,
    value: null,
  };
}
