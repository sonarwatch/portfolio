import { NetworkId, PortfolioElementType } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  airdropApi,
  allocationPrefix,
  distributorProgram,
  merkleTree,
  platformId,
  prclMint,
} from './constants';
import { Allocation } from './types';
import { deriveClaimStatus } from '../jupiter/helpers';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { getClientSolana } from '../../utils/clients';
import { claimStatusStruct } from '../jupiter/launchpad/structs';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const oneDayInMs = 24 * 60 * 60 * 1000;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const cachedAllocation = await cache.getItem<number>(owner, {
    prefix: allocationPrefix,
    networkId: NetworkId.solana,
  });

  let amount: BigNumber | undefined;
  if (cachedAllocation) {
    amount = new BigNumber(cachedAllocation);
  } else {
    const allocation: AxiosResponse<Allocation> | null = await axios
      .get(airdropApi + owner)
      .catch(() => null);

    if (allocation) {
      amount = new BigNumber(allocation.data.allocation);

      await cache.setItem(owner, amount.toNumber(), {
        prefix: allocationPrefix,
        networkId: NetworkId.solana,
        ttl: oneDayInMs,
      });
    }
  }
  if (!amount || amount.isZero()) return [];

  const claimStatusPubkey = deriveClaimStatus(
    owner,
    merkleTree,
    distributorProgram
  );

  const [claimStatusAccounts, tokenPrice] = await Promise.all([
    getParsedAccountInfo(client, claimStatusStruct, claimStatusPubkey),
    cache.getTokenPrice(prclMint, NetworkId.solana),
  ]);

  if (claimStatusAccounts) return [];

  const asset = tokenPriceToAssetToken(
    prclMint,
    amount.toNumber(),
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
