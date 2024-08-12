import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import axios, { AxiosResponse } from 'axios';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  getAirdropRaw,
} from '../../AirdropFetcher';
import {
  airdropStatics,
  apiUrl,
  dbrDecimals,
  dbrMint,
  platform as dbrPlatform,
} from './constants';
import { ApiResponse } from './types';

const dbrFactor = new BigNumber(10 ** dbrDecimals);

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const apiRes: AxiosResponse<ApiResponse> = await axios.get(apiUrl + owner, {
    timeout: 1000,
  });

  let amount = 0;
  if (apiRes.data.distributions) {
    const tokens = apiRes.data.distributions.map((dis) =>
      new BigNumber(dis.tokens).div(dbrFactor)
    );
    amount += tokens
      .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
      .toNumber();
  }

  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount,
        isClaimed: false,
        label: 'DBR',
        address: dbrMint,
        imageUri: dbrMint ? undefined : dbrPlatform.image,
      },
    ],
  });
};

export const airdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.ethereum,
  executor,
};
// export const fetcher = airdropFetcherToFetcher(
//   airdropFetcher,
//   platform.id,
//   'deepbook-airdrop',
//   airdropStatics.claimEnd
// );
