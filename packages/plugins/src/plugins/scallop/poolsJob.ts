import { NetworkId } from '@sonarwatch/portfolio-core';
import { SUI_TYPE_ARG, normalizeStructTag } from '@mysten/sui.js/utils';
import { CoinMetadata } from '@mysten/sui.js/client';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  addressKey,
  addressPrefix,
  poolsKey,
  poolsPrefix as prefix,
} from './constants';
import { AddressInfo, Coin, Pools } from './types';
import { client } from './suiClient';
import { getObject } from '../../utils/sui/getObject';

const SUI_TYPE = normalizeStructTag(SUI_TYPE_ARG);

const executor: JobExecutor = async (cache: Cache) => {
  const address = await cache.getItem<AddressInfo>(addressKey, {
    prefix: addressPrefix,
    networkId: NetworkId.sui,
  });

  if (!address) return;

  const coinTypes: Pools = {};
  const coins = new Map<string, Coin>(
    Object.entries(address.mainnet.core.coins)
  );
  const coinNames: string[] = Array.from(coins.keys());

  for (const coinName of coinNames) {
    const detail = coins.get(coinName);
    if (!detail) continue;
    if (SUI_TYPE.includes(detail.id)) {
      coinTypes[coinName] = {
        coinType: SUI_TYPE,
        metadata: await client.getCoinMetadata({ coinType: SUI_TYPE }),
      };
    } else {
      const object = await getObject<CoinMetadata>(client, detail.metaData);
      const objType = normalizeStructTag(object.data?.type || '');
      const objFields = object.data?.content?.fields;
      if (!objType || !objFields) return;
      coinTypes[coinName] = {
        coinType: objType.substring(
          objType.indexOf('<') + 1,
          objType.indexOf('>')
        ),
        metadata: objFields,
      };
    }
  }

  await cache.setItem(poolsKey, coinTypes, {
    prefix,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: prefix,
  executor,
  label: 'normal',
};
export default job;
