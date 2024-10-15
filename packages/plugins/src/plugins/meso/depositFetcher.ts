import { apyToApr, NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  lendingPoolType,
  marketsCacheKey,
  platformId,
  userPositionType,
} from './constants';
import { LendingPool, PoolData, UserPosition } from './types';
import { getAccountResource } from '../../utils/aptos';
import { getClientAptos } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';

const poolsMemo = new MemoizedCache<PoolData[]>(marketsCacheKey, {
  prefix: platformId,
  networkId: NetworkId.aptos,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientAptos();

  const userPosition = await getAccountResource<UserPosition>(
    client,
    owner,
    userPositionType
  );
  if (!userPosition) return [];

  const poolsData = await poolsMemo.getItem(cache);
  let lendingPools;
  const tokenByInner: Map<string, string> = new Map();
  const poolDataByInner: Map<string, PoolData> = new Map();

  if (!poolsData) {
    lendingPools = await Promise.all([
      ...userPosition.debt_shares.data.map((debt) =>
        getAccountResource<LendingPool>(client, debt.key.inner, lendingPoolType)
      ),
      ...userPosition.deposit_shares.data.map((dep) =>
        getAccountResource<LendingPool>(client, dep.key.inner, lendingPoolType)
      ),
    ]);

    lendingPools.forEach((lP) => {
      if (lP) {
        tokenByInner.set(lP.extend_ref.self, lP.token);
      }
    });
  } else {
    poolsData.forEach((pD) => poolDataByInner.set(pD.poolAddress, pD));
  }

  const registry = new ElementRegistry(NetworkId.aptos, platformId);

  const element = registry.addElementBorrowlend({
    label: 'Lending',
  });
  for (const lendingPos of userPosition.deposit_shares.data) {
    const poolData = poolDataByInner.get(lendingPos.key.inner);
    const address = poolData?.token || tokenByInner.get(lendingPos.key.inner);
    if (!address) continue;

    element.addSuppliedAsset({
      address,
      amount: Number(lendingPos.value),
    });
    if (!poolData) continue;

    element.addSuppliedYield([
      {
        apr: apyToApr(poolData.depositApy / 100),
        apy: poolData.depositApy / 100,
      },
    ]);
  }

  for (const borrowPos of userPosition.debt_shares.data) {
    const poolData = poolDataByInner.get(borrowPos.key.inner);
    const address = poolData?.token || tokenByInner.get(borrowPos.key.inner);
    if (!address) continue;

    element.addBorrowedAsset({
      address,
      amount: Number(borrowPos.value),
    });
    if (!poolData) continue;

    element.addBorrowedYield([
      {
        apr: apyToApr(poolData.borrowApy / 100),
        apy: poolData.borrowApy / 100,
      },
    ]);
  }

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.aptos,
  executor,
};

export default fetcher;
