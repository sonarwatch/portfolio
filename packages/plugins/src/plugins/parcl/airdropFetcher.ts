import { NetworkId, PortfolioElementType } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  airdropApi,
  allocationPrefix,
  distributorProgram,
  platformId,
  prclDecimals,
  prclMint,
} from './constants';
import { Allocation } from './types';
import { deriveClaimStatus } from '../jupiter/helpers';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { getClientSolana } from '../../utils/clients';
import { claimStatusStruct } from '../jupiter/launchpad/structs';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const oneDayInMs = 24 * 60 * 60 * 1000;
const endOfClaim = 1735603200000;
const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  if (Date.now() > endOfClaim) return [];

  const client = getClientSolana();
  const cachedAllocation = await cache.getItem<Allocation>(owner, {
    prefix: allocationPrefix,
    networkId: NetworkId.solana,
  });

  let amount: number | undefined;
  let merkleTree: string | undefined;
  if (cachedAllocation) {
    amount = cachedAllocation.amount;
    merkleTree = cachedAllocation.merkle_tree;
  } else {
    const allocation: AxiosResponse<Allocation> | null = await axios
      .get(airdropApi + owner, {
        headers: {
          origin: 'https://app.parcl.co',
          referer: 'https://app.parcl.co',
        },
      })
      .catch(() => null);

    if (allocation) {
      merkleTree = allocation.data.merkle_tree;
      amount = new BigNumber(allocation.data.amount)
        .dividedBy(10 ** prclDecimals)
        .toNumber();

      await cache.setItem<Allocation>(
        owner,
        { amount, merkle_tree: merkleTree },
        {
          prefix: allocationPrefix,
          networkId: NetworkId.solana,
          ttl: oneDayInMs,
        }
      );
    }
  }
  if (!amount || !merkleTree) return [];

  const claimStatusPubkey = deriveClaimStatus(
    owner,
    merkleTree,
    distributorProgram
  );

  const claimStatusAccounts = await getParsedAccountInfo(
    client,
    claimStatusStruct,
    claimStatusPubkey
  );
  if (claimStatusAccounts) return [];

  const tokenPrice = await cache.getTokenPrice(prclMint, NetworkId.solana);

  const asset = tokenPriceToAssetToken(
    prclMint,
    amount,
    NetworkId.solana,
    tokenPrice,
    undefined,
    { isClaimable: true }
  );

  return [
    {
      value: asset.value,
      type: PortfolioElementType.multiple,
      platformId,
      name: 'Allocation',
      networkId: NetworkId.solana,
      label: 'Rewards',
      data: { assets: [asset] },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-airdrop`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
