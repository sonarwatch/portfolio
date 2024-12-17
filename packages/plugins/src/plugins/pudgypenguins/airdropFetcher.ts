import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  getAirdropRaw,
  airdropFetcherToFetcher,
} from '../../AirdropFetcher';

import { airdropApi, airdropStatics, pudgyMint, platform } from './constants';
import { AirdropResponse } from './types';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  let res: AxiosResponse<AirdropResponse>;
  try {
    res = await axios.get(`${airdropApi + owner}?`);
  } catch (err) {
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'PENGU',
          address: pudgyMint,
        },
      ],
    });
  }

  if (!res || !res.data)
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'PENGU',
          address: pudgyMint,
        },
      ],
    });

  if (res.data.total === 0)
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'PENGU',
          address: pudgyMint,
        },
      ],
    });

  const isClaimed = res.data.totalUnclaimed === 0;

  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount: res.data.total,
        isClaimed,
        label: 'PENGU',
        address: pudgyMint,
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
  'pudgy-airdrop',
  airdropStatics.claimEnd
);
