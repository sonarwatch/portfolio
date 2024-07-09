import {
  NetworkId,
  PortfolioAssetToken,
  PortfolioAssetType,
} from '@sonarwatch/portfolio-core';
import { HeliusAsset } from './types';

export function heliusAssetToAssetToken(
  asset: HeliusAsset,
  amount: number,
  props?: {
    price?: number;
    tags?: string[];
  }
): PortfolioAssetToken | null {
  // Tags
  const tags: string[] | undefined = [];
  if (props?.tags?.length) tags.push(...props.tags);

  return {
    type: PortfolioAssetType.token,
    attributes: {
      tags: tags.length > 0 ? tags : [],
    },
    name: asset.token_info?.symbol,
    data: {
      address: asset.id,
      amount,
      price: props?.price ?? null,
    },
    networkId: NetworkId.solana,
    value: props?.price ? props.price * amount : null,
  };
}
