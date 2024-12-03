import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, scaAddress, scaDecimals, veScaKeyType } from './constants';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { multiDynamicFieldObjects } from '../../utils/sui/multiDynamicFieldObjects';
import { VeSca } from './types/vesca';
import { getClientSui } from '../../utils/clients';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const veScaKeys = await getOwnedObjectsPreloaded(client, owner, {
    filter: {
      StructType: veScaKeyType,
    },
  });
  if (veScaKeys.length === 0) return [];

  const objectIds = veScaKeys
    .map((r) => r.data?.objectId)
    .filter((i) => i !== undefined) as string[];
  const veScaObjects = await multiDynamicFieldObjects<VeSca>(client, {
    parentId:
      '0x0a0b7f749baeb61e3dfee2b42245e32d0e6b484063f0a536b33e771d573d7246',
    type: '0x2::object::ID',
    values: objectIds,
  });
  if (veScaObjects.length === 0) return [];

  const scaTokenPrice = await cache.getTokenPrice(scaAddress, NetworkId.sui);

  const assets: PortfolioAsset[] = [];
  for (let i = 0; i < veScaObjects.length; i++) {
    const veScaObject = veScaObjects[i];
    const scaAmountRaw =
      veScaObject.data?.content?.fields?.value?.fields?.locked_sca_amount;
    if (!scaAmountRaw || scaAmountRaw === '0') continue;
    const lockedUntil =
      Number(veScaObject.data?.content?.fields?.value?.fields?.unlock_at || 0) *
        1000 || undefined;

    assets.push(
      tokenPriceToAssetToken(
        scaAddress,
        new BigNumber(scaAmountRaw).div(10 ** scaDecimals).toNumber(),
        NetworkId.sui,
        scaTokenPrice,
        undefined,
        {
          lockedUntil,
        }
      )
    );
  }
  if (assets.length === 0) return [];
  return [
    {
      type: PortfolioElementType.multiple,
      networkId: NetworkId.sui,
      label: 'Staked',
      platformId,
      data: {
        assets,
      },
      value: getUsdValueSum(assets.map((a) => a.value)),
      name: 'veSca',
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-vesca`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
