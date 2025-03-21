import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { poolPrefix } from './constants';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { oracleStruct, yieldMarketStruct } from './structs';
import { YieldMarketWithOracle } from './types';

export const getPool = async (
  poolId: PublicKey,
  cache: Cache
): Promise<YieldMarketWithOracle | undefined> => {
  const cacheOpts = {
    prefix: poolPrefix,
    networkId: NetworkId.solana,
  };
  const cachedPool = await cache.getItem<YieldMarketWithOracle>(
    poolId.toString(),
    cacheOpts
  );
  if (cachedPool) return cachedPool;

  const connection = getClientSolana();

  const pools = await getParsedMultipleAccountsInfo(
    connection,
    yieldMarketStruct,
    [poolId]
  );

  if (!pools[0]) return undefined;

  const oracles = await getParsedMultipleAccountsInfo(
    connection,
    oracleStruct,
    [new PublicKey(pools[0].oracle)]
  );

  if (!oracles[0]) return undefined;

  const poolWithOracle = {
    ...pools[0],
    rate: oracles[0].rate,
  };

  await cache.setItem(poolId.toString(), poolWithOracle, cacheOpts);

  return poolWithOracle;
};
