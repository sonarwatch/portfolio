import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { AirdropRaw, IsClaimed, NetworkId } from '@sonarwatch/portfolio-core';
import {
  airdropApi,
  airdropStatics,
  allocationPrefix,
  distributorProgram,
  prclDecimals,
  prclMint,
} from './constants';
import { Allocation, ApiAirdropResponse } from './types';
import { Cache } from '../../Cache';
import { deriveClaimStatus } from '../../utils/solana/jupiter/deriveClaimStatus';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { SolanaClient } from '../../utils/clients/types';
import { claimStatusStruct } from '../jupiter/launchpad/structs';
import { AirdropFetcher, getAirdropRaw } from '../../AirdropFetcher';
import { getClientSolana } from '../../utils/clients';

async function fetchAllocation(
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

async function fetchAirdrop(
  owner: string,
  client: SolanaClient,
  cache: Cache
): Promise<AirdropRaw> {
  const allocation = await fetchAllocation(owner, cache);
  const amount = !allocation.merkleTree ? 0 : allocation.amount;

  let isClaimed: IsClaimed = false;
  if (amount > 0 && allocation.merkleTree) {
    const claimStatusPubkey = deriveClaimStatus(
      owner,
      allocation.merkleTree,
      distributorProgram
    );
    const claimStatusAccount = await getParsedAccountInfo(
      client,
      claimStatusStruct,
      claimStatusPubkey
    );
    isClaimed = claimStatusAccount !== null;
  }

  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount,
        isClaimed,
        label: 'PRCL',
        address: prclMint,
      },
    ],
  });
}

export const airdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.solana,
  executor: (owner, cache) => {
    const client = getClientSolana();
    return fetchAirdrop(owner, client, cache);
  },
};
