import { NetworkId } from '@sonarwatch/portfolio-core';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { cloudMint, platform, nclbAirdropStatics } from './constants';
import noCLBAllocations from './noCloudLeftBehindAllocation.json';

const allocs = noCLBAllocations as { [key: string]: number };

const executor: AirdropFetcherExecutor = async (owner: string) => {
  if (!(owner in allocs)) {
    return getAirdropRaw({
      statics: nclbAirdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'CLOUD',
          address: cloudMint,
        },
      ],
    });
  }

  return getAirdropRaw({
    statics: nclbAirdropStatics,
    items: [
      {
        amount: allocs[owner],
        isClaimed: false,
        label: 'CLOUD',
        address: cloudMint,
      },
    ],
  });
};

export const airdropFetcher: AirdropFetcher = {
  id: nclbAirdropStatics.id,
  networkId: NetworkId.solana,
  executor,
};

export const fetcher = airdropFetcherToFetcher(
  airdropFetcher,
  platform.id,
  `${platform.id}-airdrop-nclb`,
  nclbAirdropStatics.claimEnd
);
