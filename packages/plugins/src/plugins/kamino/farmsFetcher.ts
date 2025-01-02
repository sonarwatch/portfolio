import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  PortfolioLiquidity,
  TokenPrice,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { farmProgramId, farmsKey, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { userStateStruct } from './structs/vaults';
import { userStateFilter } from './filters';
import { FarmInfo } from './types';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const userStates = await getParsedProgramAccounts(
    client,
    userStateStruct,
    farmProgramId,
    userStateFilter(owner)
  );
  if (!userStates) return [];

  const farmsInfo = await cache.getItem<FarmInfo[]>(farmsKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!farmsInfo) return [];

  const farmById: Map<string, FarmInfo> = new Map();
  farmsInfo.forEach((farmInfo) => farmById.set(farmInfo.pubkey, farmInfo));

  const mints: Set<string> = new Set();
  farmsInfo.forEach((farm) => {
    mints.add(farm.mint);
    farm.rewardsMints.forEach((reward) => mints.add(reward));
  });

  const tokenPrices = await cache.getTokenPrices(
    Array.from(mints),
    NetworkId.solana
  );
  const tokenPriceById: Map<string, TokenPrice> = new Map();
  tokenPrices.forEach((tP) =>
    tP ? tokenPriceById.set(tP.address, tP) : undefined
  );

  const liquidities: PortfolioLiquidity[] = [];
  const stakedAssets: PortfolioAsset[] = [];
  for (const userState of userStates) {
    const rewardAssets: PortfolioAsset[] = [];
    const assets: PortfolioAsset[] = [];
    if (userState.activeStakeScaled.isZero()) continue;

    const farm = farmById.get(userState.farmState.toString());
    if (!farm) continue;

    const tokenPrice = tokenPriceById.get(farm.mint);

    const { decimals } = farm;
    const amount = userState.activeStakeScaled
      .dividedBy(10 ** 18)
      .dividedBy(10 ** decimals)
      .toNumber();

    // Handle specific KMNO Staking which uses a farm

    assets.push(
      ...tokenPriceToAssetTokens(
        farm.mint,
        amount,
        NetworkId.solana,
        tokenPrice
      )
    );
    const assetsValue = getUsdValueSum(assets.map((a) => a.value));
    const rewardAssetsValue = null;
    const value = assetsValue;

    if (assets.length === 1) {
      stakedAssets.push(...assets);
    } else {
      const liquidity: PortfolioLiquidity = {
        value,
        assets,
        assetsValue,
        rewardAssets,
        rewardAssetsValue,
        yields: [],
      };
      liquidities.push(liquidity);
    }

    // for (let i = 0; i < farm.rewardsMints.length; i++) {
    //   const rewardMint = farm.rewardsMints[i];
    //   if (rewardMint === '11111111111111111111111111111111') continue;

    //   const rewardAmountRaw = userState.rewardsIssuedUnclaimed[i].plus(
    //     userState.rewardsTallyScaled[i]
    //   );
    //   console.log(
    //     'constexecutor:FetcherExecutor= ~ userState.rewardsIssuedUnclaimed[i]:',
    //     userState.rewardsIssuedUnclaimed[i].toNumber()
    //   );
    //   console.log(
    //     'constexecutor:FetcherExecutor= ~ userState.rewardsTallyScaled[i]:',
    //     userState.rewardsTallyScaled[i].toNumber()
    //   );
    //   if (rewardAmountRaw.isZero()) continue;

    //   const rewardPrice = tokenPriceById.get(rewardMint);
    //   if (!rewardPrice) continue;

    //   const rewardAmount = rewardAmountRaw
    //     .dividedBy(10 ** 18)
    //     .dividedBy(10 ** rewardPrice.decimals)
    //     .toNumber();
    //   rewardAssets.push({
    //     ...tokenPriceToAssetToken(
    //       rewardMint,
    //       rewardAmount,
    //       NetworkId.solana,
    //       rewardPrice
    //     ),
    //     attributes: { isClaimable: false },
    //   });
    // }
  }

  const elements: PortfolioElement[] = [];

  if (liquidities.length !== 0) {
    elements.push({
      networkId: NetworkId.solana,
      platformId,
      type: PortfolioElementType.liquidity,
      label: 'Farming',
      value: getUsdValueSum(liquidities.map((l) => l.value)),
      data: {
        liquidities,
      },
    });
  }

  if (stakedAssets.length !== 0) {
    elements.push({
      networkId: NetworkId.solana,
      platformId,
      type: PortfolioElementType.multiple,
      label: 'Staked',
      value: getUsdValueSum(stakedAssets.map((s) => s.value)),
      data: {
        assets: stakedAssets,
      },
    });
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-farms`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
