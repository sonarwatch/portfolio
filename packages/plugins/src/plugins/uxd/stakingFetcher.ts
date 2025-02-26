import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, stakingProgramId, uxpFactor, uxpMint } from './constants';
import { getClientSolana } from '../../utils/clients';
import { stakingAccountStruct } from './structs';
import { stakingAccountFilters } from './filters';
import { getParsedProgramAccounts } from '../../utils/solana';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const networkId = NetworkId.solana;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const stakingAccounts = await getParsedProgramAccounts(
    client,
    stakingAccountStruct,
    stakingProgramId,
    stakingAccountFilters(owner)
  );
  if (stakingAccounts.length === 0) return [];

  const tokenPrice = await cache.getTokenPrice(uxpMint, networkId);

  const assets: PortfolioAsset[] = [];
  stakingAccounts.forEach((stakingAccount) => {
    const amount = stakingAccount.stakedAmount
      .plus(stakingAccount.rewardAmount)
      .div(uxpFactor);
    if (!amount.isZero()) return;

    const lockedUntil = stakingAccount.stakeEndTs.times(1000).toNumber();
    assets.push({
      ...tokenPriceToAssetToken(
        uxpMint,
        amount.toNumber(),
        networkId,
        tokenPrice,
        tokenPrice?.price,
        {
          lockedUntil,
          tags: ['Deprecated'],
        }
      ),
      ref: stakingAccount.pubkey.toString(),
    });
  });
  if (assets.length === 0) return [];

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Staked',
      networkId: NetworkId.solana,
      platformId,
      data: { assets, link: 'https://stake.uxd.fi/' },
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
