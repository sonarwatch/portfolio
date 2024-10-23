import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import axios, { AxiosResponse } from 'axios';
import { AccountInfo, PublicKey } from '@solana/web3.js';
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
  distributorPid,
  receiptBuffer,
} from './constants';
import { ApiResponse } from './types';
import { getClientSolana } from '../../utils/clients';

const dbrFactor = new BigNumber(10 ** dbrDecimals);
const realDistributions = [
  'First distribution',
  'Claim 50% vested with bonus in 6 months after TGE',
];
const executorSolana: AirdropFetcherExecutor = async (owner: string) => {
  const [apiRes, receipt]: [
    AxiosResponse<ApiResponse>,
    AccountInfo<Buffer> | null
  ] = await Promise.all([
    axios.get(apiUrl + owner, {
      timeout: 3000,
    }),
    getClientSolana().getAccountInfo(getSolPda(owner, 1)),
  ]);

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

    const isFirstDis = distribution.title === realDistributions[0];
    const tokens = new BigNumber(distribution.tokens).div(dbrFactor);

    items.push({
      amount: tokens.toNumber(),
      isClaimed: isFirstDis ? !!receipt : false,
      label: isFirstDis ? 'DBR' : 'DBR Vested(50%)',
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
  const [apiRes, receipt]: [
    AxiosResponse<ApiResponse>,
    AccountInfo<Buffer> | null
  ] = await Promise.all([
    axios.get(apiUrl + owner, {
      timeout: 3000,
    }),
    getClientSolana().getAccountInfo(getEvmPda(owner, 1)),
  ]);

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

    const isFirstDis = distribution.title === realDistributions[0];
    const tokens = new BigNumber(distribution.tokens).div(dbrFactor);

    items.push({
      amount: tokens.toNumber(),
      isClaimed: isFirstDis ? !!receipt : false,
      label: isFirstDis ? 'DBR' : 'DBR Vested(50%)',
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

function getEvmPda(owner: string, season: number): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      receiptBuffer,
      Uint8Array.from([season]),
      Buffer.from(owner.slice(2), 'hex'),
    ],
    distributorPid
  )[0];
}

function getSolPda(owner: string, season: number): PublicKey {
  return PublicKey.findProgramAddressSync(
    [receiptBuffer, Uint8Array.from([season]), new PublicKey(owner).toBytes()],
    distributorPid
  )[0];
}
