import { NetworkId, suiNativeAddress } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { bidsCacheKey, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { Bid } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const bidsMemo = new MemoizedCache<Bid[]>(bidsCacheKey, {
  prefix: platformId,
  networkId: NetworkId.sui,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const allBids = await bidsMemo.getItem(cache);
  if (!allBids) return [];

  const bids = allBids.filter((bid) => bid.buyer === owner);
  if (!bids) return [];

  const registry = new ElementRegistry(NetworkId.sui, platformId);
  const element = registry.addElementMultiple({
    label: 'Deposit',
    tags: ['Bids'],
  });
  bids.forEach((bid) => {
    element.addAsset({
      address: suiNativeAddress,
      amount: bid.wallet.fields.balance,
    });
  });

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-bids`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
