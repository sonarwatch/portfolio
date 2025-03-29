import { NetworkId } from '@sonarwatch/portfolio-core';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { airdropStatics, platformId } from './constants';
import { usdcSolanaMint } from '../../utils/solana';

const executor: AirdropFetcherExecutor = async () =>
  getAirdropRaw({
    statics: airdropStatics,
    items: [
      { amount: 10, isClaimed: false, label: 'USDC', address: usdcSolanaMint },
    ],
  });

export const airdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.solana,
  executor,
};
export const fetcher = airdropFetcherToFetcher(
  airdropFetcher,
  platformId,
  `${platformId}-airdrop`,
  airdropStatics.claimEnd
);
