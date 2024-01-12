import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, programId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts, usdcSolanaMint } from '../../utils/solana';
import { lpAccountStruct } from './structs';
import { lpAccountFilter } from './filters';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const thirtyDays = 30 * 1000 * 60 * 60 * 24;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const lpAccounts = await getParsedProgramAccounts(
    client,
    lpAccountStruct,
    programId,
    lpAccountFilter(owner)
  );
  if (lpAccounts.length === 0) return [];

  const usdcTokenPrice = await cache.getTokenPrice(
    usdcSolanaMint,
    NetworkId.solana
  );

  const assets: PortfolioAsset[] = [];
  for (const lpAccount of lpAccounts) {
    const unlockStartedAt = new Date(
      lpAccount.lastAddLiquidityTimestamp.times(1000).toNumber()
    );
    const unlockingAt = new Date(unlockStartedAt.getTime() + thirtyDays);
    assets.push({
      ...tokenPriceToAssetToken(
        usdcSolanaMint,
        lpAccount.liquidity.dividedBy(10 ** 6).toNumber(),
        NetworkId.solana,
        usdcTokenPrice
      ),
      attributes: {
        lockedUntil: unlockingAt.getTime(),
      },
    });
  }

  if (assets.length === 0) return [];

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Deposit',
      networkId: NetworkId.solana,
      platformId,
      data: { assets },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
