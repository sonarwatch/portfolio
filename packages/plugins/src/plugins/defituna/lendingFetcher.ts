import { apyToApr, NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { defiTunaProgram, lendingPoolsCacheKey, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { LendingPool, lendingStruct } from './structs';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';

const poolsMemo = new MemoizedCache<LendingPool[]>(lendingPoolsCacheKey, {
  prefix: platformId,
  networkId: NetworkId.solana,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    connection,
    lendingStruct,
    defiTunaProgram,
    [
      {
        memcmp: {
          offset: 11,
          bytes: owner,
        },
      },
      {
        dataSize: 155,
      },
    ]
  );

  if (accounts.length === 0) return [];

  const pools = await poolsMemo.getItem(cache);

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementBorrowlend({
    label: 'Lending',
  });

  accounts.forEach((account) => {
    const pool = pools.find(
      (p) => p.mint.toString() === account.poolMint.toString()
    );

    element.addSuppliedAsset({
      address: account.poolMint,
      amount: account.depositedFunds,
    });

    if (pool?.supplyApy)
      element.addSuppliedYield([
        {
          apy: new BigNumber(pool.supplyApy).toNumber(),
          apr: apyToApr(new BigNumber(pool.supplyApy).toNumber()),
        },
      ]);
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-lending`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
