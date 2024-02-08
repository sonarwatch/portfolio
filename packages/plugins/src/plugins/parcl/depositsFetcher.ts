import { NetworkId, PortfolioElementType } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { usdcSolanaMint } from '../../utils/solana';
import { lpAccountStruct } from './structs';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getLpAccountPda } from './helpers';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';

const thirtyDays = 30 * 1000 * 60 * 60 * 24;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const lpAccount = await getParsedAccountInfo(
    client,
    lpAccountStruct,
    getLpAccountPda(owner)
  );

  if (!lpAccount) return [];
  if (lpAccount && lpAccount.liquidity.isZero()) return [];

  const usdcTokenPrice = await cache.getTokenPrice(
    usdcSolanaMint,
    NetworkId.solana
  );

  const unlockStartedAt = new Date(
    lpAccount.lastAddLiquidityTimestamp.times(1000).toNumber()
  );
  const unlockingAt = new Date(unlockStartedAt.getTime() + thirtyDays);
  const asset = {
    ...tokenPriceToAssetToken(
      usdcSolanaMint,
      lpAccount.liquidity.dividedBy(10 ** 6).toNumber(),
      NetworkId.solana,
      usdcTokenPrice
    ),
    attributes: {
      lockedUntil: unlockingAt.getTime(),
    },
  };

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Deposit',
      networkId: NetworkId.solana,
      platformId,
      data: { assets: [asset] },
      value: asset.value,
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
