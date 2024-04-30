import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import axios, { AxiosResponse } from 'axios';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  distributorApi,
  distributorProgram,
  kmnoDecimals,
  kmnoMint,
  platformId,
} from './constants';
import { deriveClaimStatus } from '../jupiter/helpers';
import { ClaimProofResponse } from '../jupiter/types';
import { getClientSolana } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const kmnoFactor = new BigNumber(10 ** kmnoDecimals);
const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const allocation: AxiosResponse<ClaimProofResponse> | null = await axios
    .get(distributorApi + owner)
    .catch(() => null);
  if (!allocation) return [];

  const pda = deriveClaimStatus(
    owner,
    allocation.data.merkle_tree,
    distributorProgram
  );

  const client = getClientSolana();
  const claimStatus = await client.getAccountInfo(pda);
  if (claimStatus) return [];

  const kmnoTokenPrice = await cache.getTokenPrice(kmnoMint, NetworkId.solana);

  const amount = BigNumber(allocation.data.amount)
    .dividedBy(kmnoFactor)
    .toNumber();
  const asset: PortfolioAsset = tokenPriceToAssetToken(
    kmnoMint,
    amount,
    NetworkId.solana,
    kmnoTokenPrice,
    undefined,
    { isClaimable: true }
  );

  return [
    {
      type: PortfolioElementType.multiple,
      platformId,
      name: 'Season 1 Airdrop',
      networkId: NetworkId.solana,
      label: 'Rewards',
      data: { assets: [asset] },
      value: asset.value,
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-airdrop`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
