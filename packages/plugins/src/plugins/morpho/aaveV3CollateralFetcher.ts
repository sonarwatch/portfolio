import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementBorrowLend,
  PortfolioElementType,
  Yield,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Underlying, platformId } from './constants';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  getCurrentBorrowBalanceInOf,
  getCurrentCollateralBalanceInOf,
} from './helpers';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const collateralUnderlyings = [
  Underlying.wsteth,
  Underlying.dai,
  Underlying.usdc,
  Underlying.wbtc,
  Underlying.reth,
  Underlying.cbeth,
  Underlying.weth,
];

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const collateralPromises = collateralUnderlyings.map((u) =>
    getCurrentCollateralBalanceInOf(u, owner)
  );
  const borrowPromises = collateralUnderlyings.map((u) =>
    getCurrentBorrowBalanceInOf(u, owner)
  );

  const tokenPricesPromise = cache.getTokenPrices(
    collateralUnderlyings,
    NetworkId.ethereum
  );

  const promises = [
    tokenPricesPromise,
    ...collateralPromises,
    ...borrowPromises,
  ];
  await Promise.all(promises);
  const tokenPrices = await tokenPricesPromise;

  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];

  const collateralBalances = await Promise.all(collateralPromises);
  collateralBalances.forEach((collateralBalance, i) => {
    const tokenPrice = tokenPrices[i];
    if (!tokenPrice) return;
    const amount = new BigNumber(collateralBalance.toString())
      .div(10 ** tokenPrice.decimals)
      .toNumber();
    if (amount === 0) return;
    suppliedYields.push([]);
    suppliedAssets.push(
      tokenPriceToAssetToken(
        tokenPrice.address,
        amount,
        NetworkId.ethereum,
        tokenPrice
      )
    );
  });

  const borrowBalances = await Promise.all(borrowPromises);
  borrowBalances.forEach((borrowBalance, i) => {
    const tokenPrice = tokenPrices[i];
    if (!tokenPrice) return;
    const amount = new BigNumber(borrowBalance.toString())
      .div(10 ** tokenPrice.decimals)
      .toNumber();
    if (amount === 0) return;
    borrowedYields.push([]);
    borrowedAssets.push(
      tokenPriceToAssetToken(
        tokenPrice.address,
        amount,
        NetworkId.ethereum,
        tokenPrice
      )
    );
  });

  const { borrowedValue, suppliedValue, value, healthRatio, rewardValue } =
    getElementLendingValues({ suppliedAssets, borrowedAssets, rewardAssets });
  if (borrowedValue === 0 && suppliedValue === 0) return [];

  const element: PortfolioElementBorrowLend = {
    type: PortfolioElementType.borrowlend,
    networkId: NetworkId.solana,
    platformId,
    label: 'Lending',
    value,
    name: 'Aave-V3',
    data: {
      borrowedAssets,
      borrowedValue,
      borrowedYields,
      suppliedAssets,
      suppliedValue,
      suppliedYields,
      healthRatio,
      rewardAssets,
      rewardValue,
      value,
    },
  };
  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-aave-v3-collateral`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
