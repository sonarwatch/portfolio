import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  getAirdropRaw,
  airdropFetcherToFetcher,
} from '../../AirdropFetcher';

import { airdropApi, airdropStatics, meMint, platform } from './constants';
import { AirdropResponse } from './types';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const input = JSON.stringify({
    json: {
      claimWallet: owner,
      token: meMint,
      allocationEvent: 'tge-airdrop-final',
    },
  });

  const encodedInput = encodeURIComponent(input);
  const res: AxiosResponse<AirdropResponse> = await axios.get(
    airdropApi + encodedInput
  );

  if (!res.data)
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'ME',
          address: meMint,
        },
      ],
    });

  const isClaimed = res.data.result.data.json.claimStatus === 'claimed';
  const amount = new BigNumber(res.data.result.data.json.availableTokenAmount)
    .dividedBy(10 ** 6)
    .toNumber();

  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        // We have no way to know if a user was eligible and claimed
        // We can only know if user claimed, or didn't claimed + amount.
        amount,
        isClaimed,
        label: 'ME',
        address: meMint,
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
  'magiceden-airdrop',
  airdropStatics.claimEnd
);
