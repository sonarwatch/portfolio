import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { platformId, programId, usdcDecimals, usdcMint } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { marginAccountStruct } from './structs';
import { marginAccountFilter } from './filters';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const accounts = await getParsedProgramAccounts(
    client,
    marginAccountStruct,
    programId,
    marginAccountFilter(owner)
  );
  if (accounts.length === 0) return [];

  const usdcTokenPrice = await cache.getTokenPrice(usdcMint, NetworkId.solana);
  const assets: PortfolioAsset[] = [];
  for (const account of accounts) {
    if (account.margin.isZero()) continue;
    assets.push({
      ...tokenPriceToAssetToken(
        usdcMint,
        account.margin.dividedBy(10 ** usdcDecimals).toNumber(),
        NetworkId.solana,
        usdcTokenPrice
      ),
      attributes: {},
    });
  }
  if (assets.length === 0) return [];

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Margin',
      networkId: NetworkId.solana,
      platformId,
      data: { assets },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-margin`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
