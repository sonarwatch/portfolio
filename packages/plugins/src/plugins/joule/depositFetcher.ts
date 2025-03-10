import { apyToApr, NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { marketsCacheKey, platformId, userPositionMapType } from './constants';
import { MarketDatum, UserPositionMap } from './types';
import { getAccountResource } from '../../utils/aptos';
import { getClientAptos } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';

const marketsMemo = new MemoizedCache<MarketDatum[]>(marketsCacheKey, {
  prefix: platformId,
  networkId: NetworkId.aptos,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientAptos();

  const positionMap = await getAccountResource<UserPositionMap>(
    client,
    owner,
    userPositionMapType
  );

  const markets = await marketsMemo.getItem(cache);

  if (!positionMap) return [];

  const registry = new ElementRegistry(NetworkId.aptos, platformId);

  for (const position of positionMap.positions_map.data) {
    const element = registry.addElementBorrowlend({
      label: 'Lending',
      name: position.value.position_name,
    });
    for (const lendingPos of position.value.lend_positions.data) {
      const market = markets.find((m) =>
        lendingPos.key.includes(m.asset.assetName)
      );
      element.addSuppliedAsset({
        address: lendingPos.key,
        amount: Number(lendingPos.value),
      });
      if (market)
        element.addSuppliedYield([
          {
            apr: apyToApr(market.depositApy / 100),
            apy: market.depositApy / 100,
          },
        ]);
    }

    for (const borrowPos of position.value.borrow_positions.data) {
      const market = markets.find((m) =>
        borrowPos.key.includes(m.asset.assetName)
      );
      element.addBorrowedAsset({
        address: borrowPos.key,
        amount: Number(borrowPos.value.borrow_amount),
      });
      if (market)
        element.addBorrowedYield([
          {
            apr: apyToApr(market.borrowApy / 100),
            apy: market.borrowApy / 100,
          },
        ]);
    }
  }

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.aptos,
  executor,
};

export default fetcher;
