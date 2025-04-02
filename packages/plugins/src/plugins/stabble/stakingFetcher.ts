import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { platformId, stakingPid } from './constants';
import { getClientSolana } from '../../utils/clients';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { minerStruct } from './structs';
import { PoolInfo } from './types';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const minerAccounts = await ParsedGpa.build(
    connection,
    minerStruct,
    stakingPid
  )
    .addFilter('accountDiscriminator', [223, 113, 15, 54, 123, 122, 140, 100])
    .addFilter('authority', new PublicKey(owner))
    .addDataSizeFilter(137)
    .run();
  if (minerAccounts.length === 0) return [];

  const poolsInfo = await cache.getItems<PoolInfo>(
    minerAccounts.map((miner) => miner.pool.toString()),
    {
      prefix: platformId,
      networkId: NetworkId.solana,
    }
  );
  if (!poolsInfo) throw new Error('No poolsInfo found in cache');

  const tokenPricesById = await cache.getTokenPricesAsMap(
    poolsInfo.map((pool) => (pool ? pool.mint : [])).flat(),
    NetworkId.solana
  );

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const element = registry.addElementMultiple({
    label: 'Farming',
  });
  for (let i = 0; i < minerAccounts.length; i += 1) {
    const miner = minerAccounts[i];
    const poolInfo = poolsInfo[i];
    if (!poolInfo) continue;

    const tokenPrice = tokenPricesById.get(poolInfo.mint);
    element.addAsset({
      address: poolInfo.mint,
      amount: miner.amount,
      ref: miner.pubkey.toString(),
      sourceRefs: [{ address: poolInfo.address, name: 'Pool' }],
      link: tokenPrice?.link,
    });
  }
  return registry.getElements(cache);
};
const fetcher: Fetcher = {
  id: `${platformId}-staked-pools`,
  executor,
  networkId: NetworkId.solana,
};
export default fetcher;
