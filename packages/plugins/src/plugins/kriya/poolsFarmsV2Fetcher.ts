import { apyToApr, NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, poolsV2InfoKey, farmsPackageId } from './constants';
import { getClientSui } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { arrayToMap } from '../../utils/misc/arrayToMap';
import { FarmInfo, FarmPosition } from './types/farms';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const farmsObjects = await getOwnedObjectsPreloaded<FarmPosition>(
    client,
    owner,
    {
      filter: { Package: farmsPackageId },
    }
  );

  if (farmsObjects.length === 0) return [];

  const farmsInfos = await cache.getItem<FarmInfo[]>(poolsV2InfoKey, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
  if (!farmsInfos) return [];

  const farmById: Map<string, FarmInfo> = arrayToMap(farmsInfos, 'farmId');

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);
  const element = elementRegistry.addElementLiquidity({
    label: 'Farming',
  });

  for (const object of farmsObjects) {
    if (!object.data?.content?.fields) continue;
    const position = object.data.content.fields;

    const farmInfo = farmById.get(position.farm_id);
    if (!farmInfo) continue;

    const shares = new BigNumber(position.stake_amount).dividedBy(
      new BigNumber(farmInfo.lspSupply)
    );

    const tokenAmountX = new BigNumber(farmInfo.tokenXReserve)
      .times(shares)
      .dividedBy(10 ** farmInfo.tokenX.decimals);

    const tokenAmountY = new BigNumber(farmInfo.tokenYReserve)
      .times(shares)
      .dividedBy(10 ** farmInfo.tokenY.decimals);

    const liquidity = element.addLiquidity();

    liquidity.addAsset({
      address: farmInfo.tokenXType,
      amount: tokenAmountX,
      alreadyShifted: true,
    });

    liquidity.addAsset({
      address: farmInfo.tokenYType,
      amount: tokenAmountY,
      alreadyShifted: true,
    });

    liquidity.addYield({
      apy: farmInfo.apy / 100,
      apr: apyToApr(farmInfo.apy / 100),
    });
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-pools-farms-v2`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
