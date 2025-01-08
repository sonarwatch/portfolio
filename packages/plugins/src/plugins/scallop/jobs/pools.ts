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
  PoolCoinName,
  MetadataFields,
  wormholeCoinTypeToSymbolMap,
  suiBridgeCoinTypeToSymbolMap,
  PoolAddress,
} from '../types';
import { queryMultipleObjects } from '../util';
import { Cache } from '../../../Cache';

const queryPools = async (
  client: SuiClient,
  addressData: PoolAddress,
  cache: Cache
) => {
  const coinTypes: Partial<Pools> = {};

  const coinNames: PoolCoinName[] = Array.from(
    Object.keys(addressData)
  ) as PoolCoinName[];

  const metadataObjects = (
    await queryMultipleObjects(
      client,
      Array.from(Object.values(addressData)).map((coin) => coin.coinMetadataId)
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
    const {
      metadata: { decimals, description, iconUrl, name, symbol },
      type: coinType,
    } = metadataObjects[i];

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
