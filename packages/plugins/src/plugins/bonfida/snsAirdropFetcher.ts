import { NetworkId } from '@sonarwatch/portfolio-core';
import { platformId, snsAirdropStatics, snsMint } from './constants';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { snsAllocation } from './SNS_allocation';
import { getClaimStatusPda } from './helpers';
import { getClientSolana } from '../../utils/clients';

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

  const claimed = await getClientSolana().getAccountInfo(
    getClaimStatusPda(owner)
  );

  return getAirdropRaw({
    statics: snsAirdropStatics,
    items: [
      {
        amount: alloc,
        isClaimed: !!claimed,
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
