import {
  NetworkId,
  PortfolioElementType,
  PortfolioLiquidity,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, singlePoolPid } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { liquidityStruct } from './structs';
import { liquidityAccountFilter } from './filters';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    liquidityStruct,
    singlePoolPid,
    liquidityAccountFilter(owner)
  );

  if (accounts.length === 0) return [];

  const tokenPriceById = await cache.getTokenPricesAsMap(
    accounts.map((account) => account.mint.toString()),
    NetworkId.solana
  );

  const liquidities: PortfolioLiquidity[] = [];
  for (const account of accounts) {
    if (account.amountDeposited.isZero()) continue;
    const tokenPrice = tokenPriceById.get(account.mint.toString());
    if (!tokenPrice) continue;

    const { decimals } = tokenPrice;
    const amount = account.amountDeposited.dividedBy(10 ** decimals).toNumber();

    const asset = tokenPriceToAssetToken(
      account.mint.toString(),
      amount,
      NetworkId.solana,
      tokenPrice
    );

    liquidities.push({
      assets: [asset],
      assetsValue: asset.value,
      rewardAssets: [],
      rewardAssetsValue: null,
      value: asset.value,
      yields: [],
      ref: account.pubkey.toString(),
      link: 'https://app.goosefx.io/ssl',
    });
  }

  if (liquidities.length === 0) return [];

  return [
    {
      type: PortfolioElementType.liquidity,
      label: 'Farming',
      networkId: NetworkId.solana,
      platformId,
      data: { liquidities },
      value: getUsdValueSum(liquidities.map((liquidity) => liquidity.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-pools`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
