import { SuiClient, CoinMetadata } from '@mysten/sui/client';
import { parseStructTag } from '@mysten/sui/utils';
import { NetworkId } from '@sonarwatch/portfolio-core';
import {
  ObjectResponse,
  ObjectData,
  ParsedData,
} from '../../../utils/sui/types';
import { poolsKey, poolsPrefix } from '../constants';
import {
  Pools,
  PoolCoinNames,
  MetadataFields,
  wormholeCoinTypeToSymbolMap,
  suiBridgeCoinTypeToSymbolMap,
  AddressInfo,
  Coin,
} from '../types';
import { queryMultipleObjects } from '../util';
import { Cache } from '../../../Cache';

const queryPools = async (
  client: SuiClient,
  addressData: AddressInfo,
  cache: Cache
) => {
  const coinTypes: Partial<Pools> = {};
  const coins = new Map<string, Coin>(
    Object.entries(addressData.mainnet.core.coins)
  );

  const coinNames: PoolCoinNames[] = Array.from(
    coins.keys()
  ) as PoolCoinNames[];

  const metadataObjects = (
    await queryMultipleObjects(
      client,
      Array.from(coins.values()).map((coin) => coin.metaData)
    )
  )
    .filter(
      (
        t
      ): t is ObjectResponse<MetadataFields> & {
        data: ObjectData<MetadataFields> & {
          content: ParsedData<MetadataFields>;
        };
      } =>
        !!t.data &&
        !!t.data.content &&
        t.data.content.dataType === 'moveObject' &&
        !!t.data.content.fields
    )
    .map((objData) => ({
      metadata: {
        ...objData.data.content.fields,
        iconUrl: objData.data.content.fields.icon_url,
      },
      type: (() => {
        const { address, module, name } = parseStructTag(objData.data.type)
          .typeParams[0] as { address: string; name: string; module: string };
        return `${address}::${module}::${name}`;
      })(),
    })) as {
    metadata: CoinMetadata;
    type: string;
  }[];

  for (let i = 0; i < coinNames.length; i++) {
    const coinName = coinNames[i];
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {
      metadata: { decimals, description, iconUrl, name, symbol },
      type: coinType,
    } = metadataObjects[i];
    const detail = coins.get(coinName);
    if (!detail) continue;

    coinTypes[coinName] = {
      coinType,
      metadata: {
        decimals,
        description,
        iconUrl,
        name,
        symbol:
          wormholeCoinTypeToSymbolMap[coinType] ??
          suiBridgeCoinTypeToSymbolMap[coinType] ??
          symbol,
      },
    };
  }

  await cache.setItem(poolsKey, coinTypes, {
    prefix: poolsPrefix,
    networkId: NetworkId.sui,
  });
  return coinTypes;
};

export default queryPools;
