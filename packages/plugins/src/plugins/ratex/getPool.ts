import { NetworkId } from '@sonarwatch/portfolio-core';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { poolPrefix } from './constants';
import { Oracle, YieldMarket, YieldMarketWithOracle } from './types';
import { getAutoParsedMultipleAccountsInfo } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';

export const getPool = async (
  poolId: PublicKey,
  idlItem: IdlItem,
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

  const pools = await getAutoParsedMultipleAccountsInfo<YieldMarket>(
    connection,
    idlItem,
    [poolId]
  );

  if (!pools[0]) return undefined;

  const oracles = await getAutoParsedMultipleAccountsInfo<Oracle>(
    connection,
    idlItem,
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
