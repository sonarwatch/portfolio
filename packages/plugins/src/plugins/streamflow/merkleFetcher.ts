import BigNumber from 'bignumber.js';

import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { ClaimStatus, claimStatusStruct } from './structs';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { getPdas } from './helpers';
import { MerkleInfo } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const merkleMemo = new MemoizedCache<MerkleInfo[]>('merkles', {
  prefix: platformId,
  networkId: NetworkId.solana,
});

function calculateTotalClaimable(
  claim: ClaimStatus,
  unlockPeriod?: string
): BigNumber {
  if (!unlockPeriod) {
    return BigNumber(0);
  }
  const now = Math.floor(Date.now() / 1000);
  const elapsed = now - Number(claim.lastClaimTs);
  const unlockPeriodNumber = parseInt(unlockPeriod, 10);

  const periods = Math.floor(elapsed / unlockPeriodNumber);
  const totalUnlocked = new BigNumber(periods).multipliedBy(
    claim.lastAmountPerUnlock
  );
  const remaining = new BigNumber(claim.lockedAmount).minus(
    claim.lockedAmountWithdrawn
  );

  return BigNumber.max(BigNumber.min(totalUnlocked, remaining), BigNumber(0));
}

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const merkles = await merkleMemo.getItem(cache);
  if (merkles.length === 0) throw new Error('No active merkles found in cache');

  const pdas = getPdas(
    owner,
    merkles.map((m) => m.address)
  );
  const claimAccounts = await getParsedMultipleAccountsInfo(
    client,
    claimStatusStruct,
    pdas
  );

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  for (let i = 0; i < claimAccounts.length; i += 1) {
    const claim = claimAccounts[i];
    if (!claim) continue;

    const merkle = merkles[i];
    if (claim.closed) continue;

    const element = registry.addElementMultiple({
      label: 'Airdrop',
      link: `https://app.streamflow.finance/airdrops/solana/mainnet/${merkle.address}`,
      ref: claim.pubkey.toString(),
      sourceRefs: [{ address: merkle.address, name: 'Distributor' }],
    });

    const claimable = calculateTotalClaimable(
      claim,
      merkle?.unlockPeriod?.toString()
    );
    if (claimable.gt(0)) {
      element.addAsset({
        address: merkle.mint,
        amount: claim.unlockedAmount.minus(claim.lockedAmountWithdrawn),
        attributes: { isClaimable: true },
      });
    }

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
