import { NetworkId } from "@sonarwatch/portfolio-core";
import { CoinMetadata, PaginatedObjectsResponse, SuiObjectData, SuiObjectResponseQuery, normalizeStructTag } from "@mysten/sui.js";
import { Cache } from "../../Cache";
import { addressKey, addressPrefix } from "./constants";
import { AddressInfo, Coin, CoinTypeMetadata } from "./types";
import { getClientSui } from "../../utils/clients";

const SUI_ID = '0x0000000000000000000000000000000000000000000000000000000000000002';
const client = getClientSui();

export async function getCoinTypeMetadata(cache: Cache): Promise<{ [k: string]: CoinTypeMetadata }> {
  const coinTypes: { [k: string]: CoinTypeMetadata } = {};
  const addressData = await cache.getItem<AddressInfo>(addressKey, {
    prefix: addressPrefix,
    networkId: NetworkId.sui
  });

  if (!addressData) return {};

  const coins = new Map<string, Coin>(Object.entries(addressData.mainnet.core.coins));
  const coinNames: string[] = Array.from(coins.keys());

  for (const coinName of coinNames) {
    const detail = coins.get(coinName);
    if(!detail) continue;

    if (detail.id === SUI_ID) {
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
      if (object.data && object.data.content && 'fields' in object.data.content) {
        const structTag = object.data.content.type;
        const coinType = getCoinType(structTag);
        coinTypes[coinName] = {
          coinType,
          metadata: object.data.content.fields as CoinMetadata
        };
      }
    }
  }
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

export function getCoinType(type: string) {
  const structTag = normalizeStructTag(type);
  return structTag.substring(structTag.indexOf('<') + 1, structTag.indexOf('>'));
}
