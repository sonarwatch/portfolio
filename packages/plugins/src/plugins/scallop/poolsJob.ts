import {
  CoinMetadata,
  SUI_TYPE_ARG,
  getObjectFields,
  getObjectType,
  normalizeStructTag
} from '@mysten/sui.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { addressKey, addressPrefix, poolsKey, poolsPrefix as prefix } from './constants';
import { AddressInfo, Coin, Pools } from './types';
import { getClientSui } from '../../utils/clients';

const SUI_TYPE = normalizeStructTag(SUI_TYPE_ARG);
const client = getClientSui();

const executor: JobExecutor = async (cache: Cache) => {
  const address = await cache.getItem<AddressInfo>(addressKey,{
    prefix: addressPrefix,
    networkId: NetworkId.sui
  });

  if (!address) return;

  const coinTypes: Pools = {};
  const coins = new Map<string, Coin>(Object.entries(address.mainnet.core.coins));
  const coinNames: string[] = Array.from(coins.keys());

  for(const coinName of coinNames) {
    const detail = coins.get(coinName);
    if(!detail) continue;
    if(SUI_TYPE.includes(detail.id)) {
      coinTypes[coinName] = {
        coinType: SUI_TYPE,
        metadata: await client.getCoinMetadata({ coinType: SUI_TYPE })
      };
    } else {
      const object = await client.getObject({
        id: detail.metaData,
        options: {
          showType: true,
          showContent: true,
        }
      });
      const objType = normalizeStructTag(getObjectType(object) ?? '')
      const objFields = getObjectFields(object);
      if(!objType || !objFields) return;
      coinTypes[coinName] = {
        coinType: objType.substring(objType.indexOf('<') + 1, objType.indexOf('>')),
        metadata: objFields as CoinMetadata
      };
    }
  }

  await cache.setItem(
    poolsKey,
    coinTypes,
    {
      prefix,
      networkId: NetworkId.sui
    }
  );
};

const job: Job = {
  id: prefix,
  executor,
};
export default job;
