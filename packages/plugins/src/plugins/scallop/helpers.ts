import { NetworkId } from "@sonarwatch/portfolio-core";
import { CoinMetadata, PaginatedObjectsResponse, SuiObjectData, SuiObjectResponseQuery, getObjectFields, getObjectType, normalizeStructTag } from "@mysten/sui.js";
import { Cache } from "../../Cache";
import { addressKey, addressPrefix } from "./constants";
import { AddressInfo, Coin, CoinTypeMetadata } from "./types";
import { getClientSui } from "../../utils/clients";
import runInBatch from "../../utils/misc/runInBatch";

const SUI_ID = '0x0000000000000000000000000000000000000000000000000000000000000002';
const client = getClientSui();

export async function getCoinTypeMetadata(cache: Cache): Promise<{ [k: string]: CoinTypeMetadata }> {
  
  const addressInfo = await cache.getItem<AddressInfo>(addressKey, {
    prefix: addressPrefix,
    networkId: NetworkId.sui
  });

  if (!addressInfo) return {};

  return getCoinTypeMetadataHelper(addressInfo);
}

export async function getCoinTypeMetadataHelper(addressInfo: AddressInfo): Promise<{ [k: string]: CoinTypeMetadata }> {
  const coinTypes: { [k: string]: CoinTypeMetadata } = {};
  const coins = new Map<string, Coin>(Object.entries(addressInfo.mainnet.core.coins));
  const coinNames: string[] = Array.from(coins.keys());

  const coinTypeMetadata = coinNames.map((coinName) => async () => {
    const detail = coins.get(coinName);
    if(!detail) return;

    if(detail.id === SUI_ID) {
      const coinType = `${SUI_ID}::sui::SUI`;
      coinTypes[coinName] = {
        coinType,
        metadata: await client.getCoinMetadata({ coinType })
      };
    } else {
      const object = await client.getObject({
        id: detail.metaData,
        options: {
          showType: true,
          showContent: true,
        }
      });
      const objType = getObjectType(object)
      const objFields = getObjectFields(object);
      if(!objType || !objFields) return;
      coinTypes[coinName] = {
        coinType: getCoinType(objType),
        metadata: objFields as CoinMetadata
      };
    }

  })
  await runInBatch(coinTypeMetadata, 5);
  return coinTypes;
}

export async function getOwnerObject(owner: string, query?: SuiObjectResponseQuery) {
  const objects: SuiObjectData[] = [];
  let cursor:
    | string
    | {
      objectId: string;
      atCheckpoint?: number | undefined;
    }
    | null = null;

  do {
    const { data, nextCursor }: PaginatedObjectsResponse = await client.getOwnedObjects({
      owner,
      filter: query?.filter,
      options: query?.options ?? {
        showType: true,
        showContent: true,
        showDisplay: true,
      },
      cursor,
    });

    if (!data || !data.length) {
      break;
    }
    const objectDatas = data.map((obj) => obj.data) as SuiObjectData[];
    objects.push(...objectDatas);
    cursor = nextCursor;
  } while (cursor);

  return objects;
}

export function formatDecimal(amount: number, decimal: number) {
  return amount / 10 ** decimal
}

export function getCoinType(type: string) {
  const structTag = normalizeStructTag(type);
  return structTag.substring(structTag.indexOf('<') + 1, structTag.indexOf('>'));
}
