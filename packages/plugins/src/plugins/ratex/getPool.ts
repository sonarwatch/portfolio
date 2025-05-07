import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { poolPrefix } from './constants';
import { getClientSolana } from '../../utils/clients';
import { oracleStruct, yieldMarketStruct } from './structs';
import { YieldMarketWithOracle } from './types';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';

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

  const account = await connection.getAccountInfo(poolId);
  if (!account) return undefined;

  let pool;
  try {
    [pool] = yieldMarketStruct.deserialize(account.data);
  } catch (err) {
    return undefined;
  }

  const oracle = await getParsedAccountInfo(
    connection,
    oracleStruct,
    pool.oracle
  );
  if (!oracle) return undefined;

  const poolWithOracle = {
    ...pool,
    rate: oracle.rate,
  };

  await cache.setItem(poolId.toString(), poolWithOracle, cacheOpts);

  return poolWithOracle;
};
