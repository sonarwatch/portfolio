import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  PortfolioLiquidity,
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
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import getTokenPricesMap from '../../utils/misc/getTokensPricesMap';

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

  const tokenPriceById = await getTokenPricesMap(
    farmsInfo.map((farm) => farm.rewardsMints).flat(),
    NetworkId.solana,
    cache
  );

  const liquidities: PortfolioLiquidity[] = [];

  for (const userState of userStates) {
    const rewardAssets: PortfolioAsset[] = [];
    const assets: PortfolioAsset[] = [];
    const farm = farmById.get(userState.farmState.toString());
    if (!farm) continue;

    const { price, decimals } = farm;
    const amount = userState.activeStakeScaled
      .dividedBy(10 ** 18)
      .dividedBy(10 ** decimals)
      .toNumber();

    assets.push(
      tokenPriceToAssetToken(
        farm.mint,
        amount,
        NetworkId.solana,
        undefined,
        price
      )
    );
    for (let i = 0; i < farm.rewardsMints.length; i++) {
      const rewardMint = farm.rewardsMints[i];
      if (rewardMint === '11111111111111111111111111111111') continue;

      const rewardAmountRaw = userState.rewardsIssuedUnclaimed[i].plus(
        userState.rewardsTallyScaled[i]
      );
      if (rewardAmountRaw.isZero()) continue;

      const rewardPrice = tokenPriceById.get(rewardMint);
      if (!rewardPrice) continue;

      const rewardAmount = rewardAmountRaw
        .dividedBy(10 ** 18)
        .dividedBy(10 ** rewardPrice.decimals)
        .toNumber();
      rewardAssets.push(
        tokenPriceToAssetToken(
          rewardMint,
          rewardAmount,
          NetworkId.solana,
          rewardPrice
        )
      );
    }

    const assetsValue = getUsdValueSum(assets.map((a) => a.value));
    const rewardAssetsValue = getUsdValueSum(rewardAssets.map((r) => r.value));
    const value = getUsdValueSum([assetsValue, rewardAssetsValue]);

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
  if (liquidities.length === 0) return [];

  return [
    {
      networkId: NetworkId.solana,
      platformId,
      type: PortfolioElementType.liquidity,
      label: 'Farming',
      value: getUsdValueSum(liquidities.map((l) => l.value)),
      data: {
        liquidities,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-farms`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
