import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import axios, { AxiosResponse } from 'axios';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  getAirdropRaw,
} from '../../AirdropFetcher';
import {
  firstDistribStatics,
  apiUrl,
  dbrDecimals,
  dbrMint,
  platform as dbrPlatform,
} from './constants';
import { ApiResponse } from './types';

const dbrFactor = new BigNumber(10 ** dbrDecimals);
const realDistributions = [
  'Claim 50% vested with bonus in 6 months after TGE',
  'First distribution',
];
const executor: AirdropFetcherExecutor = async (owner: string) => {
  const apiRes: AxiosResponse<ApiResponse> = await axios.get(apiUrl + owner, {
    timeout: 1000,
  });

  if (!apiRes.data.distributions || apiRes.data.distributions.length === 0) {
    return getAirdropRaw({
      statics: firstDistribStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'DBR',
          address: dbrMint,
          imageUri: dbrMint ? undefined : dbrPlatform.image,
        },
      ],
    });
  }

  const items = [];
  for (const distribution of apiRes.data.distributions) {
    if (!realDistributions.includes(distribution.title)) continue;

    const tokens = new BigNumber(distribution.tokens).div(dbrFactor);

    items.push({
      amount: tokens.toNumber(),
      isClaimed: false,
      label: 'DBR',
      address: dbrMint,
      imageUri: dbrMint ? undefined : dbrPlatform.image,
    });
  }

  return getAirdropRaw({
    statics: firstDistribStatics,
    items,
  });
};

export const airdropFetcherEvm: AirdropFetcher = {
  id: `${firstDistribStatics.id}-evm`,
  networkId: NetworkId.ethereum,
  executor,
};

export const airdropFetcherSolana: AirdropFetcher = {
  id: `${firstDistribStatics.id}-solana`,
  networkId: NetworkId.solana,
  executor,
};
// export const fetcher = airdropFetcherToFetcher(
//   airdropFetcher,
//   platform.id,
//   'deepbook-airdrop',
//   airdropStatics.claimEnd
// );
