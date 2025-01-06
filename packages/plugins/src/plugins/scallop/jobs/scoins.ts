import { CoinMetadata, SuiClient } from '@mysten/sui/client';
import { parseStructTag } from '@mysten/sui/utils';
import { NetworkId } from '@sonarwatch/portfolio-core';
import {
  AddressInfo,
  MetadataFields,
  SCoin,
  SCoinNames,
  SCoins,
  suiBridgeCoinTypeToSymbolMap,
  wormholeCoinTypeToSymbolMap,
} from '../types';
import { queryMultipleObjects } from '../util';
import {
  ObjectData,
  ObjectResponse,
  ParsedData,
} from '../../../utils/sui/types';
import { scoinKey, scoinPrefix } from '../constants';
import { Cache } from '../../../Cache';

const querySCoins = async (
  client: SuiClient,
  addressData: AddressInfo,
  cache: Cache
) => {
  const sCoinTypes: Partial<SCoins> = {};
  const coins = new Map<string, SCoin>(
    Object.entries(addressData.mainnet.scoin.coins)
  );

  const sCoinNames: SCoinNames[] = Array.from(coins.keys()) as SCoinNames[];
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

  // get metadata for each coin type
  for (let i = 0; i < sCoinNames.length; i++) {
    const sCoinName = sCoinNames[i];
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {
      metadata: { decimals, description, iconUrl, name, symbol },
      type: coinType,
    } = metadataObjects[i];
    const detail = coins.get(sCoinName);
    if (!detail) continue;

    sCoinTypes[sCoinName] = {
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
  await cache.setItem(scoinKey, sCoinTypes, {
    prefix: scoinPrefix,
    networkId: NetworkId.sui,
  });
};

export default querySCoins;
