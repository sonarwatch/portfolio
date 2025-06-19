import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, streamflowApi } from './constants';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { getPda } from './helpers';
import { AirdropsResponse, MerkleInfo } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const merkleMemo = new MemoizedCache<MerkleInfo[]>('merkles', {
  prefix: platformId,
  networkId: NetworkId.solana,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const merkles = await merkleMemo.getItem(cache);
  if (!merkles) throw new Error('No active merkles found in cache');

  const apiResponses = await Promise.all(
    merkles.map((merkle) =>
      axios
        .get(`${streamflowApi}/airdrops/${merkle.address}/claimants/${owner}`, {
          timeout: 7000
        })
        .then((response) => response.data as AirdropsResponse)
        .catch(() => undefined)
    )
  );

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  for (let i = 0; i < apiResponses.length; i += 1) {
    const allocationStatus = apiResponses[i];
    if (!allocationStatus) continue;

    const merkle = merkles[i];
    if (allocationStatus.chain !== 'SOLANA') continue;

    const element = registry.addElementMultiple({
      label: 'Airdrop',
      link: `https://app.streamflow.finance/airdrops/solana/mainnet/${merkle.address}`,
      ref: getPda(owner, allocationStatus.distributorAddress),
      sourceRefs: [{ address: merkle.address, name: 'Distributor' }],
    });
    element.addAsset({
      address: merkle.mint,
      amount: new BigNumber(allocationStatus.amountUnlocked).minus(
        allocationStatus.amountClaimed
      ),
      attributes: { isClaimable: true },
    });
    element.addAsset({
      address: merkle.mint,
      amount: new BigNumber(allocationStatus.amountLocked),
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
