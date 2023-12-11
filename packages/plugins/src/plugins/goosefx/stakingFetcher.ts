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

  if (accounts.length === 0 || accounts.length > 1) return [];
  const stakingAccount = accounts[0];

  const gofxTokenPrice = await cache.getTokenPrice(gofxMint, NetworkId.solana);
  if (!gofxTokenPrice) return [];
  const { decimals } = gofxTokenPrice;

  const assets: PortfolioAsset[] = [];
  for (const ticket of stakingAccount.unstakingTickets) {
    const unlockStartedAt = new Date(ticket.createdAt.times(1000).toNumber());
    const unlockingAt = new Date(unlockStartedAt.getTime() + sevenDays);
    if (Date.now() < unlockingAt.getTime()) {
      assets.push({
        ...tokenPriceToAssetToken(
          gofxMint,
          ticket.totalUnstaked.dividedBy(10 ** decimals).toNumber(),
          NetworkId.solana,
          gofxTokenPrice
        ),
        attributes: {
          lockedUntil: unlockingAt.getTime(),
        },
      });
    }
  }
  if (stakingAccount.totalStaked.isGreaterThan(0)) {
    const amount = stakingAccount.totalStaked
      .dividedBy(10 ** decimals)
      .toNumber();
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
