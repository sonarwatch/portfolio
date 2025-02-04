import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { airdropApi, airdropStatics, sonicMint, platform } from './constants';
import { AirdropResponse } from './types';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const res: AxiosResponse<AirdropResponse[]> = await axios.get(
    airdropApi + owner
  );

  if (!res.data.length)
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'SONIC',
          address: sonicMint,
        },
      ],
    });

  let amount = 0;
  let claimedAmount = 0;
  for (const airdrop of res.data) {
    amount += airdrop.total;
    claimedAmount += airdrop.claimed;
  }

  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount,
        isClaimed: claimedAmount === amount,
        label: 'SONIC',
        address: sonicMint,
      },
    ],
  });
};

export const airdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.solana,
  executor,
};
export const fetcher = airdropFetcherToFetcher(
  airdropFetcher,
  platform.id,
  'sonic-airdrop',
  airdropStatics.claimEnd
);
