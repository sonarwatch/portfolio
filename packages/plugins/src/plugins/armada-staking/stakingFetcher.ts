import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  armadaPlatformId,
  platformByMint,
  platformId,
  poolsKey,
  stakePid,
} from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { StakeDepositReceiptStruct } from './structs';
import { stakeFilters } from './filters';
import { getClientSolana } from '../../utils/clients';
import { PoolInfo } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const pools = await cache.getItem<PoolInfo[]>(poolsKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!pools) throw new Error('No pools cached');

  const mintByPool: Map<string, string> = new Map();
  pools.forEach((pool) => mintByPool.set(pool.pubkey, pool.mint));

  const stakeAccounts = await getParsedProgramAccounts(
    client,
    StakeDepositReceiptStruct,
    stakePid,
    stakeFilters(owner)
  );
  if (stakeAccounts.length === 0) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  for (const stakeAccount of stakeAccounts) {
    if (stakeAccount.depositAmount.isZero()) continue;

    const mint = mintByPool.get(stakeAccount.stakePool.toString());
    if (!mint) continue;

    const platform = platformByMint.get(mint) || armadaPlatformId;
    if (!platform) continue;

    const element = elementRegistry.addElementMultiple({
      label: 'Staked',
      platformId: platform,
      ref: stakeAccount.pubkey,
      sourceRefs: [
        { name: 'Pool', address: stakeAccount.stakePool.toString() },
      ],
    });

    const lockedUntil = new Date(
      stakeAccount.depositTimestamp
        .plus(stakeAccount.lockupDuration)
        .times(1000)
        .toNumber()
    ).getTime();

    element.addAsset({
      address: mint,
      amount: stakeAccount.depositAmount,
      attributes: {
        lockedUntil,
      },
    });
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
