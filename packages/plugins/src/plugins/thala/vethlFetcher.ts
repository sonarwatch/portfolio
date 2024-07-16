import {
  formatMoveTokenAddress,
  getUsdValueSum,
  NetworkId,
  PortfolioAssetToken,
  PortfolioElementLiquidity,
  PortfolioElementType,
  PortfolioLiquidity,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  platformId,
  thlCoin,
  thlModPool,
  vetokenBalancePayload,
} from './constants';
import { getView } from '../../utils/aptos';
import { getClientAptos } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientAptos();

  const coinTypes = [thlCoin, thlModPool];

  const amounts = await Promise.all(
    coinTypes.map((coinType) =>
      getView(connection, vetokenBalancePayload(owner, coinType)).then(
        (veTokenBalanceView) =>
          veTokenBalanceView ? (veTokenBalanceView[0] as string) : null
      )
    )
  );

  if (amounts.filter((a) => a && a !== '0').length === 0) return [];

  const tokenPrices = await cache.getTokenPricesAsMap(
    coinTypes.map((c) => formatMoveTokenAddress(c)),
    NetworkId.aptos
  );

  const assets: PortfolioAssetToken[] = [];

  coinTypes.forEach((coinType, i) => {
    const rawAmount = amounts[i];
    if (!rawAmount) return;
    const tokenPrice = tokenPrices.get(formatMoveTokenAddress(coinType));
    if (!tokenPrice) return;

    assets.push(
      tokenPriceToAssetToken(
        tokenPrice.address,
        new BigNumber(rawAmount).div(10 ** tokenPrice.decimals).toNumber(),
        NetworkId.aptos,
        tokenPrice
      )
    );
  });

  if (assets.length === 0) return [];

  const value = getUsdValueSum(assets.map((asset) => asset.value));

  const liquidity: PortfolioLiquidity = {
    value,
    assets,
    assetsValue: value,
    rewardAssets: [],
    rewardAssetsValue: null,
    yields: [],
  };
  const liquidities: PortfolioLiquidity[] = [liquidity];

  const elementMultiple: PortfolioElementLiquidity = {
    networkId: NetworkId.aptos,
    platformId: 'thala',
    type: PortfolioElementType.liquidity,
    label: 'Staked',
    name: 'veTHL',
    value,
    data: {
      liquidities,
    },
  };

  return [elementMultiple];
};

const fetcher: Fetcher = {
  id: `${platformId}-vethl`,
  networkId: NetworkId.aptos,
  executor,
};

export default fetcher;
