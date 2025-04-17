import { NetworkId } from '@sonarwatch/portfolio-core';
import {
  SUI_TYPE_ARG,
  normalizeStructTag,
  parseStructTag,
} from '@mysten/sui/utils';
import { CoinMetadata } from '@mysten/sui/client';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  addressKey,
  addressPrefix,
  poolsKey,
  poolsPrefix as prefix,
} from './constants';
import {
  AddressInfo,
  Coin,
  PoolCoinNames,
  Pools,
  StructTag,
  wormholeCoinTypeToSymbolMap,
} from './types';
import { getObject } from '../../utils/sui/getObject';
import { getClientSui } from '../../utils/clients';

const SUI_TYPE = normalizeStructTag(SUI_TYPE_ARG);

const executor: JobExecutor = async (cache: Cache) => {
  const address = await cache.getItem<AddressInfo>(addressKey, {
    prefix: addressPrefix,
    networkId: NetworkId.sui,
  });

  if (!address) return;

  const coinTypes: Partial<Pools> = {};
  const coins = new Map<string, Coin>(
    Object.entries(address.mainnet.core.coins)
  );
  const coinNames: PoolCoinNames[] = Array.from(
    coins.keys()
  ) as PoolCoinNames[];
  const client = getClientSui();
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
      const objectData = object.data;
      if (!objectData || !objectData.type) return;

      const metadataStruct = parseStructTag(
        normalizeStructTag(objectData.type)
      ); // 0x2::coin::CoinMetadata<T>
      const {
        address: packageId,
        module,
        name,
      } = metadataStruct.typeParams[0] as StructTag;
      const objFields = objectData.content?.fields;
      if (!objFields) return;

      // manually map wormhole usdc symbol into wusdc
      const coinType = `${packageId}::${module}::${name}`;
      objFields.symbol =
        wormholeCoinTypeToSymbolMap[coinType] ?? objFields.symbol;
      coinTypes[coinName] = {
        coinType,
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
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
