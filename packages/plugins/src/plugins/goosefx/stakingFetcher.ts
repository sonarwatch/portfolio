import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { gofxMint, platformId, stakerProgramId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { userMetadataStruct } from './structs';
import { stakingAccountFilter } from './filters';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const sevenDays = 7 * 1000 * 60 * 60 * 24;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    userMetadataStruct,
    stakerProgramId,
    stakingAccountFilter(owner)
  );

  const gofxTokenPrice = await cache.getTokenPrice(gofxMint, NetworkId.solana);
  if (!gofxTokenPrice) return [];

  const assets: PortfolioAsset[] = [];
  for (const account of accounts) {
    let totalAmount = account.totalStaked;
    for (const ticket of account.unstakingTickets) {
      const unlockStartedAt = new Date(ticket.createdAt.times(1000).toNumber());
      const unlockingAt = new Date(unlockStartedAt.getTime() + sevenDays);
      if (Date.now() < unlockingAt.getTime())
        totalAmount = totalAmount.plus(ticket.totalUnstaked);
    }
    if (totalAmount.isZero()) continue;

    const { decimals } = gofxTokenPrice;
    const amount = totalAmount.dividedBy(10 ** decimals).toNumber();

    assets.push(
      tokenPriceToAssetToken(gofxMint, amount, NetworkId.solana, gofxTokenPrice)
    );
  }

  if (assets.length === 0) return [];

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Staked',
      networkId: NetworkId.solana,
      platformId,
      data: { assets },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
