import { CoinMetadata, SuiClient } from '@mysten/sui/client';
import { parseStructTag } from '@mysten/sui/utils';
import { NetworkId } from '@sonarwatch/portfolio-core';
import {
  MetadataFields,
  PoolAddress,
  SCoinName,
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
  addressData: PoolAddress,
  cache: Cache
) => {
  const sCoinTypes: Partial<SCoins> = {};
  const sCoinAddresses = Object.values(addressData).filter(
    (t): t is typeof t & { sCoinType: string; sCoinMetadataId: string } =>
      !!t.sCoinType && !!t.sCoinMetadataId
  );

  const sCoinNames: SCoinName[] = sCoinAddresses.map(
    ({ sCoinType }) => parseStructTag(sCoinType).module
  ) as SCoinName[];

  const metadataObjects = (
    await queryMultipleObjects(
      client,
      sCoinAddresses.map((coin) => coin.sCoinMetadataId)
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
    const {
      metadata: { decimals, description, iconUrl, name, symbol },
      type: coinType,
    } = metadataObjects[i];

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
