import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  // airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { airdropApi, airdropStatics, blueMint, platform } from './constants';
import { AirdropResponse } from './types';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const res: AxiosResponse<AirdropResponse> = await axios.get(airdropApi, {
    params: { userAddress: owner },
    headers: {
      Origin: 'https://trade.bluefin.io',
      Referer: 'https://trade.bluefin.io/',
    },
  });

  if (res.data.error)
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'BLUE',
          address: blueMint,
          imageUri: platform.image,
        },
      ],
    });

  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount: BigNumber(res.data.totalIncentives)
          .dividedBy(10 ** 18)
          .toNumber(),
        isClaimed: false,
        label: 'BLUE',
        address: blueMint,
        imageUri: platform.image,
      },
    ],
  });
};

export const airdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.sui,
  executor,
};

// export const fetcher = airdropFetcherToFetcher(
//   airdropFetcher,
//   platform.id,
//   'foo-airdrop',
//   airdropStatics.claimEnd
// );
