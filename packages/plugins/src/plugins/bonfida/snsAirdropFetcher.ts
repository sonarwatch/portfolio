import { NetworkId } from '@sonarwatch/portfolio-core';
import { platformId, snsAirdropStatics, snsMint } from './constants';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { snsAllocation } from './SNS_allocation';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const alloc = snsAllocation[owner];
  if (!alloc) {
    return getAirdropRaw({
      statics: snsAirdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'SNS',
          address: snsMint,
          imageUri: snsAirdropStatics.image,
        },
      ],
    });
  }

  return getAirdropRaw({
    statics: snsAirdropStatics,
    items: [
      {
        amount: alloc,
        isClaimed: false,
        label: 'SNS',
        address: snsMint,
        imageUri: snsAirdropStatics.image,
      },
    ],
  });
};

export const airdropFetcher: AirdropFetcher = {
  id: snsAirdropStatics.id,
  networkId: NetworkId.solana,
  executor,
};

export const fetcher = airdropFetcherToFetcher(
  airdropFetcher,
  platformId,
  snsAirdropStatics.id,
  snsAirdropStatics.claimEnd
);
