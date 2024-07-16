import {
  NetworkId,
  PortfolioElementLiquidity,
  PortfolioElementType,
  PortfolioLiquidity,
  Yield,
  aprToApy,
  aptosNetwork,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  modCoin,
  platformId,
  stabilityClaimablePayload,
  stabilityDepositPayload,
  thlCoin,
} from './constants';
import { getView } from '../../utils/aptos';
import { getClientAptos } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientAptos();
  const stabilityPoolDepositView = await getView(
    connection,
    stabilityDepositPayload(owner)
  );
  if (!stabilityPoolDepositView || stabilityPoolDepositView.length === 0)
    return [];

  const depositAmountString = stabilityPoolDepositView.at(0);
  if (!depositAmountString) return [];

  const depositAmount = new BigNumber(depositAmountString.toString())
    .div(10 ** aptosNetwork.native.decimals)
    .toNumber();
  if (depositAmount === 0) return [];

  const depositTokenPrice = await cache.getTokenPrice(
    modCoin.toString(),
    NetworkId.aptos
  );

  const assets = tokenPriceToAssetToken(
    modCoin.toString(),
    depositAmount,
    NetworkId.aptos,
    depositTokenPrice
  );

  const claimableView = await getView(
    connection,
    stabilityClaimablePayload(owner)
  );

  const assetsValue: number | null = !depositTokenPrice
    ? null
    : depositTokenPrice.price * depositAmount;
  if (!claimableView || claimableView.length === 0) return [];

  const rewardsAmountString = claimableView.at(0);
  if (!rewardsAmountString) return [];

  const rewardsAmount: number =
    +rewardsAmountString / 10 ** aptosNetwork.native.decimals;
  const rewardsTokenPrice = await cache.getTokenPrice(
    thlCoin.toString(),
    NetworkId.aptos
  );
  const rewardAssets = tokenPriceToAssetToken(
    thlCoin.toString(),
    rewardsAmount,
    NetworkId.aptos,
    rewardsTokenPrice
  );
  const rewardAssetsValue: number | null = !rewardsTokenPrice
    ? null
    : rewardsTokenPrice.price * rewardsAmount;

  const value: number | null =
    !rewardAssetsValue || !assetsValue ? null : rewardAssetsValue + assetsValue;

  const yields: Yield[] = [];
  const apr = await cache.getItem<number>('apr', { prefix: platformId });
  if (apr) {
    yields.push({
      apr,
      apy: aprToApy(apr),
    });
  }

  const liquidity: PortfolioLiquidity = {
    value,
    assets: [assets],
    assetsValue,
    rewardAssets: [rewardAssets],
    rewardAssetsValue,
    yields,
  };
  const liquidities: PortfolioLiquidity[] = [liquidity];

  const elementMultiple: PortfolioElementLiquidity = {
    networkId: NetworkId.aptos,
    platformId: 'thala',
    type: PortfolioElementType.liquidity,
    label: 'Staked',
    name: 'Stability',
    value,
    data: {
      liquidities,
    },
  };
  return [elementMultiple];
};

const fetcher: Fetcher = {
  id: `${platformId}-stability-pool`,
  networkId: NetworkId.aptos,
  executor,
};

export default fetcher;
