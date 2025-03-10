import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { platformId, programId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedProgramAccounts,
  usdcSolanaDecimals,
  usdcSolanaMint,
} from '../../utils/solana';
import { marginAccountStruct } from './structs';
import { marginAccountFilter } from './filters';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const [accounts, usdcTokenPrice] = await Promise.all([
    getParsedProgramAccounts(
      client,
      marginAccountStruct,
      programId,
      marginAccountFilter(owner)
    ),
    cache.getTokenPrice(usdcSolanaMint, NetworkId.solana),
  ]);
  if (accounts.length === 0) return [];

  const assets: PortfolioAsset[] = [];
  for (const account of accounts) {
    if (account.margin.isZero()) continue;
    assets.push({
      ...tokenPriceToAssetToken(
        usdcSolanaMint,
        account.margin.dividedBy(10 ** usdcSolanaDecimals).toNumber(),
        NetworkId.solana,
        usdcTokenPrice
      ),
      ref: account.pubkey.toString(),
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
