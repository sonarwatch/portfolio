import {
  NetworkId,
  PortfolioElement,
  PortfolioElementType,
  PortfolioLiquidity,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { getCosmWasmClient } from '@sei-js/core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { lpTokensCode, platformId } from './constants';
import { getUrlEndpoint } from '../../utils/clients/constants';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';
import { Balance } from '../seaswap/types';
import getQueryBalanceByOwner from '../../utils/sei/getQueryBalanceByOwner';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const cosmWasmClient = await getCosmWasmClient(getUrlEndpoint(NetworkId.sei));

  const lpContracts = (await cosmWasmClient.getContracts(
    lpTokensCode
  )) as string[];
  if (!lpContracts.length) return [];

  const elements: PortfolioElement[] = [];
  const liquidities: PortfolioLiquidity[] = [];

  for (const contract of lpContracts) {
    const balance = (await cosmWasmClient.queryContractSmart(
      contract,
      getQueryBalanceByOwner(owner)
    )) as Balance;
    if (!balance) continue;

    const rawAmount = new BigNumber(balance.balance);
    if (rawAmount.isZero()) continue;

    const tokenPrice = await cache.getTokenPrice(contract, NetworkId.sei);
    if (!tokenPrice) continue;

    const amount = rawAmount.div(10 ** tokenPrice.decimals).toNumber();

    const assets = tokenPriceToAssetTokens(
      contract,
      amount,
      NetworkId.solana,
      tokenPrice
    );
    const liquidity: PortfolioLiquidity = {
      assets,
      assetsValue: getUsdValueSum(assets.map((a) => a.value)),
      rewardAssets: [],
      rewardAssetsValue: 0,
      value: getUsdValueSum(assets.map((a) => a.value)),
      yields: [],
    };
    liquidities.push(liquidity);
  }
  if (liquidities.length === 0) return [];

  elements.push({
    type: PortfolioElementType.liquidity,
    networkId: NetworkId.solana,
    platformId,
    name: 'Liquidities',
    label: 'LiquidityPool',
    value: getUsdValueSum(liquidities.map((a) => a.value)),
    data: {
      liquidities,
    },
  });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-lp-sei`,
  networkId: NetworkId.sei,
  executor,
};

export default fetcher;
