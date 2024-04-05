import {
  NetworkId,
  PortfolioElementType,
  PortfolioLiquidity,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, programId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { liquidityStruct } from './structs';
import { liquidityAccountFilter } from './filters';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import getTokenPricesMap from '../../utils/misc/getTokensPricesMap';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    liquidityStruct,
    programId,
    liquidityAccountFilter(owner)
  );

  if (accounts.length === 0) return [];

  const tokenPriceById = await getTokenPricesMap(
    accounts.map((account) => account.mint.toString()),
    NetworkId.solana,
    cache
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
