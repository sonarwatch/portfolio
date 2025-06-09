import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { claimStatusStruct } from './structs';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { getPdas } from './helpers';
import { MerkleInfo } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';

const merkleMemo = new MemoizedCache<MerkleInfo[]>('merkles', {
  prefix: platformId,
  networkId: NetworkId.solana,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const merkles = await merkleMemo.getItem(cache);
  if (!merkles) throw new Error('No active merkles found in cache');

  const pdas = getPdas(
    owner,
    merkles.map((m) => m.address)
  );

  // This will only return accounts that exist
  // meaning if the user didn't start to claim we won't but able to find his account
  const claimsAccounts = await getMultipleAccountsInfoSafe(client, pdas);

  const claimsStatuses = claimsAccounts.flatMap((claim, index) => {
    if (!claim) return [];
    // fully claimed, it's a CompressedClaimStatus
    if (claim.data.byteLength === 9) return [];
    return {
      ...claimStatusStruct.deserialize(claim.data)[0],
      pubkey: pdas[index],
    };
  });

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  for (let i = 0; i < claimsStatuses.length; i += 1) {
    const claim = claimsStatuses[i];
    if (!claim) continue;

    const merkle = merkles[i];
    if (claim.closed) continue;

    const element = registry.addElementMultiple({
      label: 'Airdrop',
      link: `https://app.streamflow.finance/airdrops/solana/mainnet/${merkle.address}`,
      ref: claim.pubkey.toString(),
      sourceRefs: [{ address: merkle.address, name: 'Distributor' }],
    });
    element.addAsset({
      address: merkle.mint,
      amount: claim.unlockedAmount.minus(claim.lockedAmountWithdrawn),
      attributes: { isClaimable: true },
    });
    element.addAsset({
      address: merkle.mint,
      amount: claim.lockedAmount.minus(claim.lockedAmountWithdrawn),
      attributes: { lockedUntil: -1 },
    });
  }

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-merkles`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
