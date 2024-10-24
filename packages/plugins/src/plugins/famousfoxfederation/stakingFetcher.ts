import {
  formatTokenAddress,
  NetworkId,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import {
  platformId,
  stakingIdlItem,
  foxyMint,
  stakingConfigCacheKey,
  cachePrefix,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getAutoParsedProgramAccounts } from '../../utils/solana';
import { StakingAccount, StakingConfig } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { calcEarnings } from './helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const [accounts] = await Promise.all([
    getAutoParsedProgramAccounts<StakingAccount>(connection, stakingIdlItem, [
      {
        memcmp: {
          bytes: owner,
          offset: 41,
        },
      },
    ]),
  ]);

  if (!accounts.length) return [];

  const [tokenPrice, configAccount] = await Promise.all([
    cache.getTokenPrice(
      formatTokenAddress(foxyMint, NetworkId.solana),
      NetworkId.solana
    ),
    cache.getItem<StakingConfig>(stakingConfigCacheKey, {
      prefix: cachePrefix,
      networkId: NetworkId.solana,
    }),
  ]);

  if (!tokenPrice || !configAccount) return [];

  const earnings = accounts.reduce((sum: number, stakingAccount) => {
    const earningForThisOne = calcEarnings(stakingAccount, configAccount);
    return earningForThisOne !== null ? sum + earningForThisOne : sum;
  }, 0);

  if (earnings === 0) return [];

  const asset = tokenPriceToAssetToken(
    foxyMint,
    earnings,
    NetworkId.solana,
    tokenPrice,
    undefined,
    { isClaimable: true }
  );

  return [
    {
      type: PortfolioElementType.multiple,
      networkId: NetworkId.solana,
      platformId,
      label: 'Rewards',
      value: asset.value,
      data: {
        assets: [asset],
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
