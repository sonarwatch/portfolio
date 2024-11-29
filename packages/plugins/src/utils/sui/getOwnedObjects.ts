import { SuiObjectResponseQuery, SuiObjectResponse } from '@mysten/sui/client';
import TTLCache from '@isaacs/ttlcache';
import { SuiObjectDataFilter } from '@mysten/sui/src/client/types/generated';
import { SuiClient } from '../clients/types';
import { ObjectResponse } from './types';

const maxPage = 25;

type OwnedObjectsPromise = Promise<SuiObjectResponse[]>;
const ownedObjectsByOwnerCache = new TTLCache({ max: 1000, ttl: 3000 });

async function fetchAllOwnedObjects(
  client: SuiClient,
  owner: string,
  query?: SuiObjectResponseQuery
): Promise<SuiObjectResponse[]> {
  let page = 0;
  let hasNextPage = true;
  let cursor: string | null | undefined;

  const objects: SuiObjectResponse[] = [];

  do {
    const res = await client.getOwnedObjects({
      owner,
      options: {
        ...query?.options,
        showType: true,
        showContent: true,
      },
      filter: query?.filter,
      cursor,
    });
    objects.push(...res.data);
    cursor = res.nextCursor;
    hasNextPage = res.hasNextPage;
    page += 1;
  } while (hasNextPage && page <= maxPage);

  return objects;
}

async function getAllOwnedObjects(
  client: SuiClient,
  owner: string
): OwnedObjectsPromise {
  let ownedObjectsPromise = ownedObjectsByOwnerCache.get(
    owner
  ) as OwnedObjectsPromise;

  if (!ownedObjectsPromise) {
    ownedObjectsPromise = fetchAllOwnedObjects(client, owner, {
      filter: {
        MatchNone: [
          {
            StructType: '0x2::coin::Coin',
          },
        ],
      },
    });
    ownedObjectsByOwnerCache.set(owner, ownedObjectsPromise);
  }

  return ownedObjectsPromise;
}

export async function getOwnedObjects<K>(
  client: SuiClient,
  owner: string,
  query?: SuiObjectResponseQuery,
  forceRpcCall?: boolean
): Promise<ObjectResponse<K>[]> {
  if (forceRpcCall)
    return fetchAllOwnedObjects(client, owner, query) as Promise<
      ObjectResponse<K>[]
    >;
  const objects = await getAllOwnedObjects(client, owner);
  return objects.filter(
    getFilter(query?.filter as MySuiObjectDataFilter)
  ) as ObjectResponse<K>[];
}

function getFilter(
  filter?: MySuiObjectDataFilter | null
): (object: SuiObjectResponse) => boolean | undefined {
  if (filter) {
    if (filter.Package) {
      return (object: SuiObjectResponse) =>
        object?.data?.type?.startsWith(`${filter.Package}::`);
    }

    if (filter.MoveModule) {
      return (object: SuiObjectResponse) =>
        filter.MoveModule &&
        object?.data?.type?.startsWith(
          `${filter.MoveModule.package}::${filter.MoveModule.module}::`
        );
    }

    if (filter.StructType) {
      return (object: SuiObjectResponse) =>
        object?.data?.type === filter.StructType;
    }

    if (filter.ObjectId) {
      return (object: SuiObjectResponse) =>
        object?.data?.objectId === filter.ObjectId;
    }

    if (filter.ObjectIds) {
      return (object: SuiObjectResponse) =>
        !!object?.data?.objectId &&
        filter.ObjectIds &&
        filter.ObjectIds.includes(object.data.objectId);
    }

    if (filter.Version) {
      return (object: SuiObjectResponse) =>
        object?.data?.objectId === filter.ObjectId;
    }

    if (filter.MatchAll) {
      return (object: SuiObjectResponse) => {
        for (const f of filter.MatchAll || []) {
          const fn = getFilter(f as MySuiObjectDataFilter);
          if (!fn(object)) return false;
        }
        return true;
      };
    }

    if (filter.MatchNone) {
      return (object: SuiObjectResponse) => {
        for (const f of filter.MatchNone || []) {
          const fn = getFilter(f as MySuiObjectDataFilter);
          if (fn(object)) return false;
        }
        return true;
      };
    }

    if (filter.MatchAny) {
      return (object: SuiObjectResponse) => {
        for (const f of filter.MatchAny || []) {
          const fn = getFilter(f as MySuiObjectDataFilter);
          if (fn(object)) return true;
        }
        return false;
      };
    }
  }
  return () => true;
}

type MySuiObjectDataFilter = {
  MatchAll?: SuiObjectDataFilter[];
  MatchAny?: SuiObjectDataFilter[];
  MatchNone?: SuiObjectDataFilter[];
  Package?: string;
  MoveModule?: {
    module: string;
    package: string;
  };
  StructType?: string;
  ObjectId?: string;
  ObjectIds?: string[];
  Version?: string;
};
