import { ClientType, NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, stakePid } from './constants';
import { getClientSolana } from '../../utils/clients';
import { stakeEntryStruct } from './structs';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { StakePoolInfo } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const stakePoolsMemo = new MemoizedCache<StakePoolInfo[]>('stakePools', {
  prefix: platformId,
  networkId: NetworkId.solana,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana({ clientType: ClientType.FAST_LIMITED });
  const stakePools = await stakePoolsMemo.getItem(cache);
  if (stakePools.length === 0) throw new Error('No stakePools found in cache');

  const stakeEntryAccounts = await ParsedGpa.build(
    client,
    stakeEntryStruct,
    stakePid
  )
    .addFilter('accountDiscriminator', [187, 127, 9, 35, 155, 68, 86, 40])
    .addFilter('authority', new PublicKey(owner))
    .addDataSizeFilter(224)
    .run();

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  for (let i = 0; i < stakeEntryAccounts.length; i += 1) {
    const stakeEntry = stakeEntryAccounts[i];
    const stakePool = stakePools.find(
      (pool) => pool.address === stakeEntry.stakePool.toString()
    );
    if (!stakePool) continue;
    if (stakeEntry.amount.isZero()) continue;

    const element = registry.addElementMultiple({
      label: 'Staked',
      link: `https://app.streamflow.finance/staking/solana/mainnet/${stakeEntry.stakePool.toString()}`,
      ref: stakeEntry.pubkey.toString(),
      sourceRefs: [{ address: stakePool.address, name: 'Pool' }],
    });
    element.addAsset({
      address: stakePool.mint,
      amount: stakeEntry.amount,
      attributes: {
        lockedUntil: stakeEntry.createdTs
          .plus(stakeEntry.duration)
          .times(1000)
          .toNumber(),
      },
    });
  }

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
