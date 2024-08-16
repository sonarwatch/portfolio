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

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const apiRes: AxiosResponse<ApiResponse> = await axios.get(apiUrl + owner, {
    timeout: 1000,
  });

  const items = [];
  if (apiRes.data.distributions) {
    for (const distribution of apiRes.data.distributions) {
      const tokens = new BigNumber(distribution.tokens).div(dbrFactor);

      items.push({
        amount: tokens.toNumber(),
        isClaimed: false,
        label: 'DBR',
        address: dbrMint,
        imageUri: dbrMint ? undefined : dbrPlatform.image,
      });
    }
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
