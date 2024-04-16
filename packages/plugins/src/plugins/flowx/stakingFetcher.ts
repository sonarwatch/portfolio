import {
  NetworkId, PortfolioAsset,
  PortfolioElementType
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, xflxMint } from './constants';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { getClientSui } from '../../utils/clients';
import { StakingPosition } from './types';
import BigNumber from 'bignumber.js';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const stakingPosition = await getDynamicFieldObject<StakingPosition>(client, {
    parentId: "0xa3d00f45134cc1949ab98c523c3114c1ae83a8d36f2f73478f713272ca14990f",
    name: { type: 'address', value: owner },
  });

  if (stakingPosition.error || !stakingPosition.data?.content) return [];

  const amount = new BigNumber(stakingPosition.data.content.fields.value.fields.amount).dividedBy(10 ** 8);

  if (amount.isZero()) return [];

  const xflxTokenPrice = await cache.getTokenPrice(xflxMint, NetworkId.sui);

  if (!xflxTokenPrice) return [];

  const asset: PortfolioAsset = tokenPriceToAssetToken(
    xflxMint,
    amount.toNumber(),
    NetworkId.sui,
    xflxTokenPrice
  );

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Staked',
      name: 'xFLX',
      networkId: NetworkId.sui,
      platformId,
      data: { assets: [asset] },
      value: asset.value,
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
