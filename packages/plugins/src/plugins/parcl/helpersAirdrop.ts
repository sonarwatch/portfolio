import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import {
  Airdrop,
  NetworkId,
  getAirdropClaimStatus,
} from '@sonarwatch/portfolio-core';
import {
  airdropApi,
  allocationPrefix,
  distributorProgram,
  platformImage,
  platformName,
  platformWebsite,
  prclDecimals,
  prclMint,
} from './constants';
import { Allocation, ApiAirdropResponse } from './types';
import { Cache } from '../../Cache';
import { deriveClaimStatus } from '../jupiter/helpers';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { SolanaClient } from '../../utils/clients/types';
import { claimStatusStruct } from '../jupiter/launchpad/structs';
import { AirdropFetcher } from '../../AirdropFetcher';
import { getClientSolana } from '../../utils/clients';

export async function fetchAllocation(
  owner: string,
  cache: Cache
): Promise<Allocation> {
  const cachedAllocation = await cache.getItem<Allocation>(owner, {
    prefix: allocationPrefix,
    networkId: NetworkId.solana,
  });
  if (cachedAllocation) return cachedAllocation;

  let allocation: Allocation;
  const apiResponse = await axios.get<
    unknown,
    AxiosResponse<ApiAirdropResponse>
  >(airdropApi + owner, {
    headers: {
      origin: 'https://app.parcl.co',
      referer: 'https://app.parcl.co',
    },
    validateStatus(status) {
      return status === 200 || status === 404;
    },
  });

  if (
    apiResponse.data.error ||
    !apiResponse.data.amount ||
    !apiResponse.data.merkle_tree
  ) {
    allocation = {
      amount: 0,
    };
  } else {
    const amount = new BigNumber(apiResponse.data.amount)
      .dividedBy(10 ** prclDecimals)
      .toNumber();
    allocation = {
      amount,
      merkleTree: apiResponse.data.merkle_tree,
    };
  }
  await cache.setItem(owner, allocation, {
    prefix: allocationPrefix,
    networkId: NetworkId.solana,
    ttl: 86400000, // 24h
  });
  return allocation;
}

export const airdropStatics = {
  id: 'parcl-airdrop-1',
  claimLink: 'https://claims.parcllimited.com/',
  image: platformImage,
  label: 'PRCL',
  emmiterLink: platformWebsite,
  emmiterName: platformName,
  claimStart: 0,
  claimEnd: 1735603200000,
  name: undefined,
  shortName: 'Parcl S1',
};
export async function fetchAirdrop(
  owner: string,
  client: SolanaClient,
  cache: Cache
): Promise<Airdrop> {
  const prclTokenPrice = await cache.getTokenPrice(prclMint, NetworkId.solana);
  const allocation = await fetchAllocation(owner, cache);
  const claimStatus = getAirdropClaimStatus(
    airdropStatics.claimStart,
    airdropStatics.claimEnd
  );
  if (allocation.amount === 0 || !allocation.merkleTree)
    return {
      ...airdropStatics,
      claimStatus,
      isClaimed: false,
      amount: -1,
      price: prclTokenPrice?.price || null,
    };

  const claimStatusPubkey = deriveClaimStatus(
    owner,
    allocation.merkleTree,
    distributorProgram
  );
  const claimStatusAccounts = await getParsedAccountInfo(
    client,
    claimStatusStruct,
    claimStatusPubkey
  );
  const isClaimed = claimStatusAccounts !== null;

  return {
    ...airdropStatics,
    claimStatus,
    isClaimed,
    amount: allocation.amount,
    price: prclTokenPrice?.price || null,
  };
}

export const airdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.solana,
  executor: (owner, cache) => {
    const client = getClientSolana();
    return fetchAirdrop(owner, client, cache);
  },
};
