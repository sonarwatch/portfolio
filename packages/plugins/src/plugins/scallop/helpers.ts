import {
  PaginatedObjectsResponse,
  SuiObjectData,
  SuiObjectResponseQuery,
} from "@mysten/sui.js";
import { getClientSui } from "../../utils/clients";

const client = getClientSui();

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
