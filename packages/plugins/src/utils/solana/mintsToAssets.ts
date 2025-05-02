import {
  NetworkId,
  PortfolioAsset,
  RpcEndpoint,
} from '@sonarwatch/portfolio-core';
import { getAssetBatchDasAsMap } from './das/getAssetBatchDas';
import { Cache } from '../../Cache';
import tokenPriceToAssetToken from '../misc/tokenPriceToAssetToken';
import { heliusAssetToAssetCollectible } from './das/heliusAssetToAssetCollectible';
import { heliusAssetToAssetToken } from './das/heliusAssetToAssetToken';

export const mintsToAssets = async (
  dasUrl: RpcEndpoint,
  cache: Cache,
  mints: string[],
  amounts: number[]
) => {
  if (mints.length !== amounts.length)
    throw new Error('mintsToAssets: wrong parameters');

  const uniqueMints = Array.from(new Set(mints));

  const [heliusAssets, tokenPrices] = await Promise.all([
    getAssetBatchDasAsMap(dasUrl, uniqueMints),
    cache.getTokenPricesAsMap(uniqueMints, NetworkId.solana),
  ]);

  const assets = new Map<string, PortfolioAsset>();

  for (const mint of mints) {
    const i = mints.indexOf(mint);
    const heliusAsset = heliusAssets.get(mint);
    const tokenPrice = tokenPrices.get(mint);
    const amount = amounts[i];
    if (!heliusAsset && !tokenPrice) continue;
    if (!amount) continue;

    if (tokenPrice) {
      // TOKEN
      assets.set(
        mint,
        tokenPriceToAssetToken(
          tokenPrice.address,
          amount,
          NetworkId.solana,
          tokenPrice
        )
      );
    } else if (heliusAsset) {
      // NFT
      const assetCollectible = await heliusAssetToAssetCollectible(heliusAsset, cache);
      if (assetCollectible) assets.set(mint, assetCollectible);
      else {
        // Unknown token
        const assetToken = heliusAssetToAssetToken(heliusAsset, amount);
        if (assetToken) assets.set(mint, assetToken);
      }
    }
  }

  return assets;
};
