import {
  NetworkId,
  PortfolioLiquidity,
  UsdValue,
  apyToApr,
  formatMoveTokenAddress,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, farmsInfoKey, farmsPackageId } from './constants';
import { getClientSui } from '../../utils/clients';
import { getOwnedObjects } from '../../utils/sui/getOwnedObjects';
import { LiquidityPosition, FarmInfo } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const farmsObjects = await getOwnedObjects<LiquidityPosition>(client, owner, {
    filter: { Package: farmsPackageId },
  });
  if (farmsObjects.length === 0) return [];

  const farmsInfos = await cache.getItem<FarmInfo[]>(farmsInfoKey, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
  if (!farmsInfos) return [];

  const farmById: Map<string, FarmInfo> = new Map();
  const mints: Set<string> = new Set();
  farmsInfos.forEach((farm) => {
    farmById.set(farm.farmId, farm);
    mints.add(farm.tokenXType);
    mints.add(farm.tokenYType);
  });

  const tokenPriceById = await cache.getTokenPricesAsMap(
    Array.from(mints),
    NetworkId.sui
  );

  const liquidities: PortfolioLiquidity[] = [];
  let totalValue: UsdValue = 0;
  for (const object of farmsObjects) {
    if (!object.data?.content?.fields) continue;
    const position = object.data.content.fields;

    const farmInfo = farmById.get(position.farm_id);
    if (!farmInfo) continue;

    const [tokenPriceX, tokenPriceY] = [
      tokenPriceById.get(formatMoveTokenAddress(farmInfo.tokenXType)),
      tokenPriceById.get(formatMoveTokenAddress(farmInfo.tokenYType)),
    ];

    const shares = new BigNumber(position.stake_amount).dividedBy(
      new BigNumber(farmInfo.lspSupply)
    );

    const tokenAmountX = new BigNumber(farmInfo.tokenXReserve)
      .times(shares)
      .dividedBy(10 ** farmInfo.tokenX.decimals)
      .toNumber();
    const tokenAmountY = new BigNumber(farmInfo.tokenYReserve)
      .times(shares)
      .dividedBy(10 ** farmInfo.tokenY.decimals)
      .toNumber();

    const assetX = tokenPriceToAssetToken(
      farmInfo.tokenXType,
      tokenAmountX,
      NetworkId.sui,
      tokenPriceX
    );
    const assetY = tokenPriceToAssetToken(
      farmInfo.tokenYType,
      tokenAmountY,
      NetworkId.sui,
      tokenPriceY
    );
    const value = getUsdValueSum([assetX.value, assetY.value]);

    totalValue = getUsdValueSum([totalValue, value]);
    liquidities.push({
      assets: [assetX, assetY],
      assetsValue: value,
      rewardAssets: [],
      rewardAssetsValue: null,
      value,
      yields: [
        {
          apy: farmInfo.apy / 100,
          apr: apyToApr(farmInfo.apy / 100),
        },
      ],
    });
  }

  if (liquidities.length === 0) return [];
  return [
    {
      type: 'liquidity',
      data: {
        liquidities,
      },
      label: 'Farming',
      networkId: NetworkId.sui,
      platformId,
      value: totalValue,
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-farms`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
