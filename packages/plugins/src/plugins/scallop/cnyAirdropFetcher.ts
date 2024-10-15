import { NetworkId, PortfolioElementType } from '@sonarwatch/portfolio-core';
import { BCS, getSuiMoveConfig } from '@mysten/bcs';
import BigNumber from 'bignumber.js';
import axios, { AxiosResponse } from 'axios';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { airdropUrl, platformId, cnyTableId } from './constants';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { ApiResponse, ClaimStatus } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { pythMint } from '../pyth/constants';
import { getClientSui } from '../../utils/clients';

function getAmount(claimData: string): number | undefined {
  if (!claimData) return undefined;

  const bcs = new BCS(getSuiMoveConfig());
  bcs.registerStructType('Validation', {
    prefix: 'vector<u8>',
    address: 'address',
    amount: 'u64',
  });
  const eligibility = bcs.de('Validation', claimData, 'base64');
  return BigNumber(eligibility.amount)
    .shiftedBy(-1 * 6)
    .toNumber();
}

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const signature: AxiosResponse<ApiResponse> | null = await axios
    .get(airdropUrl + owner)
    .catch(() => null);

  if (!signature?.data.data || signature.status === 404) return [];

  const amount = getAmount(signature.data.data);
  if (!amount) return [];

  const client = getClientSui();
  const claimStatus = await getDynamicFieldObject<ClaimStatus>(client, {
    name: {
      type: 'address',
      value: owner,
    },
    parentId: cnyTableId,
  });
  if (claimStatus.data) return [];

  const pythPrice = await cache.getTokenPrice(pythMint, NetworkId.solana);
  const asset = tokenPriceToAssetToken(
    pythMint,
    amount,
    NetworkId.solana,
    pythPrice,
    undefined,
    { isClaimable: true }
  );

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Airdrop',
      name: 'CNY',
      networkId: NetworkId.solana,
      platformId,
      data: {
        assets: [asset],
      },
      value: asset.value,
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-cny-airdrop`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
