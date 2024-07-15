import {
  aprToApy,
  getElementLendingValues,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  echelonFarmingPackage,
  echelonLendingPackage,
  marketKey,
  platformId,
  stakerType,
  vaultType,
} from './constants';
import { Market, RewardBalance, UserStaker, UserVault } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getClientAptos } from '../../utils/clients';
import { getAccountResource, getView } from '../../utils/aptos';
import { arrayToMap } from '../../utils/misc/arrayToMap';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientAptos();

  const [userVault, userStaker] = await Promise.all([
    getAccountResource<UserVault>(client, owner, vaultType),
    getAccountResource<UserStaker>(client, owner, stakerType),
  ]);

  if (!userVault && !userStaker) return [];

  const markets = await cache.getItem<Market[]>(marketKey, {
    prefix: platformId,
    networkId: NetworkId.aptos,
  });

  if (!markets) return [];

  const [tokenPrices, collateralBalances, liabilityBalances] =
    await Promise.all([
      cache.getTokenPricesAsMap(
        markets.map((market) => market.coinType) as string[],
        NetworkId.aptos
      ),
      await Promise.all(
        (userVault?.collaterals.data || []).map((collateral) =>
          getView(client, {
            function: `${echelonLendingPackage}account_coins`,
            functionArguments: [
              owner as `0x${string}`,
              collateral.key.inner as `0x${string}`,
            ],
          }).then((res) => {
            if (!res || !res[0]) return null;
            return res[0] as string;
          })
        )
      ),
      await Promise.all(
        (userVault?.liabilities.data || []).map((liability) =>
          getView(client, {
            function: `${echelonLendingPackage}account_liability`,
            functionArguments: [
              owner as `0x${string}`,
              liability.key.inner as `0x${string}`,
            ],
          }).then((res) => {
            if (!res || !res[0]) return null;
            return res[0] as string;
          })
        )
      ),
    ]);

  if (!tokenPrices || tokenPrices.size < 1) return [];

  const marketsAsMap = arrayToMap(markets, 'market');
  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];
  const suppliedLtvs: number[] = [];

  (userVault?.collaterals.data || []).forEach((collateral, i) => {
    const market = marketsAsMap.get(collateral.key.inner);
    if (!market || !market.collateralFactor) return;
    const tokenPrice = tokenPrices.get(market.coinType);
    if (!tokenPrice) return;
    const collateralBalance = collateralBalances[i];
    if (!collateralBalance || collateralBalance === '0') return;

    suppliedAssets.push(
      tokenPriceToAssetToken(
        market.coinType,
        new BigNumber(collateralBalance)
          .dividedBy(10 ** tokenPrice.decimals)
          .toNumber(),
        NetworkId.aptos,
        tokenPrice
      )
    );

    suppliedLtvs.push(market.collateralFactor);
    suppliedYields.push([
      {
        apr: new BigNumber(market.supplyApr).toNumber(),
        apy: aprToApy(new BigNumber(market.supplyApr).toNumber()),
      },
    ]);
  });

  (userVault?.liabilities.data || []).forEach((liability, i) => {
    const market = marketsAsMap.get(liability.key.inner);
    if (!market) return;
    const tokenPrice = tokenPrices.get(market.coinType);
    if (!tokenPrice) return;
    const liabilityBalance = liabilityBalances[i];
    if (!liabilityBalance || liabilityBalance === '0') return;

    borrowedAssets.push(
      tokenPriceToAssetToken(
        market.coinType,
        new BigNumber(liabilityBalance)
          .dividedBy(10 ** tokenPrice.decimals)
          .toNumber(),
        NetworkId.aptos,
        tokenPrice
      )
    );

    borrowedYields.push([
      {
        apr: new BigNumber(market.borrowApr).toNumber(),
        apy: aprToApy(new BigNumber(market.borrowApr).toNumber()),
      },
    ]);
  });

  if (userStaker && userStaker.user_pools.data.length > 0) {
    const rewardPromises: Promise<RewardBalance | null>[] = [];

    userStaker.user_pools.data.forEach((userPool) => {
      userPool.value.rewards.data.forEach((reward) => {
        rewardPromises.push(
          getView(client, {
            function: `${echelonFarmingPackage}claimable_reward_amount`,
            functionArguments: [
              owner as `0x${string}`,
              reward.key as `0x${string}`,
              userPool.value.farming_identifier as `0x${string}`,
            ],
          }).then((res) => {
            const market = markets.find((m) => m.asset_name === reward.key);
            if (!market || !res || !res[0]) return null;
            return {
              coinType: market.coinType,
              balance: Number(res[0]),
            };
          })
        );
      });
    });

    const claimableRewardsAmounts = await Promise.all(rewardPromises);

    claimableRewardsAmounts.forEach((claimableReward) => {
      if (!claimableReward || claimableReward.balance === 0) return;
      const tokenPrice = tokenPrices.get(claimableReward.coinType);
      if (!tokenPrice) return;
      rewardAssets.push(
        tokenPriceToAssetToken(
          claimableReward.coinType,
          new BigNumber(claimableReward.balance)
            .dividedBy(10 ** tokenPrice.decimals)
            .toNumber(),
          NetworkId.aptos,
          tokenPrice
        )
      );
    });
  }

  const { borrowedValue, healthRatio, suppliedValue, value, rewardValue } =
    getElementLendingValues({
      suppliedAssets,
      borrowedAssets,
      rewardAssets,
      suppliedLtvs,
    });

  const element: PortfolioElement = {
    type: PortfolioElementType.borrowlend,
    networkId: NetworkId.aptos,
    platformId,
    label: 'Lending',
    value,
    data: {
      borrowedAssets,
      borrowedValue,
      borrowedYields,
      suppliedAssets,
      suppliedValue,
      suppliedYields,
      healthRatio,
      rewardAssets,
      rewardValue,
      value,
    },
  };

  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.aptos,
  executor,
};

export default fetcher;
