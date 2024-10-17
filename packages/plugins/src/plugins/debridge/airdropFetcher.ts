import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import axios, { AxiosResponse } from 'axios';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import {
  firstDistribStatics,
  apiUrl,
  dbrDecimals,
  dbrMint,
  platform as dbrPlatform,
  platform,
} from './constants';
import { ApiResponse } from './types';

const dbrFactor = new BigNumber(10 ** dbrDecimals);
const realDistributions = [
  'Claim 50% vested with bonus in 6 months after TGE',
  'First distribution',
];
const executorSolana: AirdropFetcherExecutor = async (owner: string) => {
  const apiRes: AxiosResponse<ApiResponse> = await axios.get(apiUrl + owner, {
    timeout: 3000,
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

const executorEvm: AirdropFetcherExecutor = async (owner: string) => {
  const apiRes: AxiosResponse<ApiResponse> = await axios.get(apiUrl + owner, {
    timeout: 3000,
  });

  if (!apiRes.data.distributions || apiRes.data.distributions.length === 0) {
    return getAirdropRaw({
      statics: firstDistribStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'DBR',
          address: undefined,
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
      address: undefined,
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
  executor: executorEvm,
};

export const airdropFetcherSolana: AirdropFetcher = {
  id: `${firstDistribStatics.id}-solana`,
  networkId: NetworkId.solana,
  executor: executorSolana,
};
export const fetcher = airdropFetcherToFetcher(
  airdropFetcherSolana,
  platform.id,
  'debridge-airdrop',
  firstDistribStatics.claimEnd
);
