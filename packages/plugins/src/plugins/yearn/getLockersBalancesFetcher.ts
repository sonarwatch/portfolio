import {
  EvmNetworkIdType,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { getLockersBalances } from './helpers';
import { Cache } from '../../Cache';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Contract } from './types';

export default function getLockersBalancesFetcher(
  networkId: EvmNetworkIdType,
  platformId: string,
  lockers: Contract[]
): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const lockedBalances = await getLockersBalances(
      networkId,
      lockers.map((l) => l.address),
      owner
    );

    const elements: PortfolioElement[] = [];
    for (let index = 0; index < lockedBalances.length; index++) {
      const balance = lockedBalances[index];
      if (balance.amount > BigInt(0)) {
        const { underlying } = lockers[index];
        const tokenPrice = await cache.getTokenPrice(underlying, networkId);
        if (!tokenPrice) continue;

        const amount = new BigNumber(balance.amount.toString())
          .dividedBy(10 ** tokenPrice.decimals)
          .toNumber();
        const asset = tokenPriceToAssetToken(
          underlying,
          amount,
          networkId,
          tokenPrice
        );
        elements.push({
          networkId,
          label: 'Staked',
          platformId,
          name: `Locked`,
          type: PortfolioElementType.multiple,
          value: asset.value,
          data: {
            assets: [asset],
          },
        });
      }
    }
    return elements;
  };

  return {
    networkId,
    executor,
    id: `${platformId}-${networkId}-lockers`,
  };
}
