import {
  NetworkId,
  PortfolioElementLiquidity,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { platformId, wethAddress, wethDecimals } from './constants';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getCurrentSupplyBalanceInOf } from './helpers';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const tokenPricePrice = cache.getTokenPrice(wethAddress, NetworkId.ethereum);
  const balance = await getCurrentSupplyBalanceInOf(wethAddress, owner);

  const amount = new BigNumber(balance.toString())
    .div(10 ** wethDecimals)
    .toNumber();
  if (amount === 0) return [];

  const tokenPrice = await tokenPricePrice;
  const asset = tokenPriceToAssetToken(
    wethAddress,
    amount,
    NetworkId.ethereum,
    tokenPrice
  );

  const element: PortfolioElementLiquidity = {
    type: PortfolioElementType.liquidity,
    networkId: NetworkId.ethereum,
    platformId,
    label: 'Lending',
    value: asset.value,
    name: 'Aave-V3 Supply Only',
    data: {
      liquidities: [
        {
          assets: [asset],
          assetsValue: asset.value,
          rewardAssets: [],
          rewardAssetsValue: null,
          value: asset.value,
          yields: [],
        },
      ],
    },
  };
  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-aave-v3-supply-only`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
