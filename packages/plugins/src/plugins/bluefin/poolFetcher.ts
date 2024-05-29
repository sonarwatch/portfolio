import {
  formatMoveTokenAddress,
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  usdcOnSuiAddress,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, poolKey } from './constants';
import { Pool } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import BigNumber from 'bignumber.js';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const elements: PortfolioElement[] = [];

  const [pool, tokenPrice] = await Promise.all([
    cache.getItem<Pool>(poolKey, {
      prefix: platformId,
      networkId: NetworkId.sui,
    }),
    cache.getTokenPrice(
      formatMoveTokenAddress(usdcOnSuiAddress),
      NetworkId.sui
    ),
  ]);

  if (tokenPrice && pool) {
    pool.users.forEach((u) => {
      if (u.owner === owner) {
        const assets: PortfolioAsset[] = [];

        if (u.amount_locked !== '0')
          assets.push(
            tokenPriceToAssetToken(
              usdcOnSuiAddress,
              new BigNumber(u.amount_locked)
                .dividedBy(10 ** tokenPrice.decimals)
                .toNumber(),
              NetworkId.sui,
              tokenPrice
            )
          );

        if (u.pending_withdrawal !== '0')
          assets.push({
            ...tokenPriceToAssetToken(
              usdcOnSuiAddress,
              new BigNumber(u.pending_withdrawal)
                .dividedBy(10 ** tokenPrice.decimals)
                .toNumber(),
              NetworkId.sui,
              tokenPrice
            ),
            attributes: { isClaimable: false },
          });

        // TODO handle 'available to claim'

        if (assets.length > 0)
          elements.push({
            type: PortfolioElementType.multiple,
            label: 'LiquidityPool',
            networkId: NetworkId.sui,
            platformId,
            data: { assets },
            value: getUsdValueSum(assets.map((asset) => asset.value)),
            name: pool.name,
          });
      }
    });
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-pool`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
