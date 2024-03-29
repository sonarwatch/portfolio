import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, stakingProgramId, uxpDecimal, uxpMint } from './constants';
import { getClientSolana } from '../../utils/clients';
import { stakingAccountStruct } from './structs';
import { stakingAccountFilters } from './filters';
import { getParsedProgramAccounts } from '../../utils/solana';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const stakingAccounts = await getParsedProgramAccounts(
    client,
    stakingAccountStruct,
    stakingProgramId,
    stakingAccountFilters(owner)
  );
  if (stakingAccounts.length === 0) return [];
  const networkId = NetworkId.solana;

  const tokenPrice = await cache.getTokenPrice(uxpMint, networkId);

  const assets: PortfolioAsset[] = [];
  stakingAccounts.forEach((stakingAccount) => {
    const stakedAmount = stakingAccount.stakedAmount.div(10 ** uxpDecimal);
    const rewardAmount = stakingAccount.rewardAmount.div(10 ** uxpDecimal);

    const totalAmount = stakedAmount.plus(rewardAmount);

    const lockedUntil = stakingAccount.stakeEndTs.times(1000).toNumber();
    if (!totalAmount.isZero())
      assets.push({
        ...tokenPriceToAssetToken(
          uxpMint,
          totalAmount.toNumber(),
          networkId,
          tokenPrice
        ),
        attributes: {
          lockedUntil,
        },
      });
  });
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
