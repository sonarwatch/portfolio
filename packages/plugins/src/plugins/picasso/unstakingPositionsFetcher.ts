import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  platformId,
  unstakingNftsCacheKey,
  unstakingNftsCachePrefix,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { ParsedAccount } from '../../utils/solana';
import { Vault } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const allVaultsMemo = new MemoizedCache<ParsedAccount<Vault>[]>(
  unstakingNftsCacheKey,
  {
    prefix: unstakingNftsCachePrefix,
    networkId: NetworkId.solana,
  }
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  // NFTs for active positions are in wallet
  // NFTS for unstaking positions are in 'unstakingOwner' wallet

  const allVaults = await allVaultsMemo.getItem(cache);

  if (!allVaults) throw new Error('Vaults not cached');

  const myVaults = allVaults.filter(
    (v) => v.withdrawalRequest?.owner.toString() === owner
  );
  if (myVaults.length === 0) return [];

  const registry = new ElementRegistry(NetworkId.solana, platformId);

  myVaults.forEach((vault) => {
    const element = registry.addElementMultiple({
      label: 'Staked',
      link: 'https://app.picasso.network/restake',
      ref: vault.pubkey.toString(),
    });
    if (!vault.withdrawalRequest) return;

    const locketUntil = new BigNumber(vault.withdrawalRequest.timestampInSec)
      .plus(7 * 24 * 60 * 60)
      .times(1000)
      .toNumber();

    element.addAsset({
      address: vault.stakeMint.toString(),
      amount: new BigNumber(vault.stakeAmount),
      attributes: {
        lockedUntil: locketUntil,
        isClaimable: locketUntil < Date.now(),
      },
    });
  });

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-unstaking-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
