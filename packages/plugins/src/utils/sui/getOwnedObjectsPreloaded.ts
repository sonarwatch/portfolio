import TTLCache from '@isaacs/ttlcache';
import { SuiObjectDataFilter } from '@mysten/sui/src/client/types/generated';
import { SuiObjectResponseQuery, SuiObjectResponse } from '@mysten/sui/client';
import { SuiClient } from '../clients/types';
import { ObjectResponse } from './types';
import { getOwnedObjects } from './getOwnedObjects';

type OwnedObjectsPromise = Promise<SuiObjectResponse[]>;
const ownedObjectsByOwnerCache = new TTLCache({ max: 1000, ttl: 3000 });

function filterToPredicate(
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
        object?.data?.type === filter.StructType ||
        object?.data?.type?.startsWith(`${filter.StructType}<`);
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
          const fn = filterToPredicate(f as MySuiObjectDataFilter);
          if (!fn(object)) return false;
        }
        return true;
      };
    }

    if (filter.MatchNone) {
      return (object: SuiObjectResponse) => {
        for (const f of filter.MatchNone || []) {
          const fn = filterToPredicate(f as MySuiObjectDataFilter);
          if (fn(object)) return false;
        }
        return true;
      };
    }

    if (filter.MatchAny) {
      return (object: SuiObjectResponse) => {
        for (const f of filter.MatchAny || []) {
          const fn = filterToPredicate(f as MySuiObjectDataFilter);
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

//
export async function getOwnedObjectsPreloaded<K>(
  client: SuiClient,
  owner: string,
  query?: SuiObjectResponseQuery
): Promise<ObjectResponse<K>[]> {
  let ownedObjectsPromise = ownedObjectsByOwnerCache.get(
    owner
  ) as OwnedObjectsPromise;

  if (!ownedObjectsPromise) {
    ownedObjectsPromise = getOwnedObjects(client, owner, {
      options: {
        showType: true,
        showContent: true,
        showDisplay: true,
        showOwner: true,
      },
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

  const objects = await ownedObjectsPromise;
  return objects.filter(
    filterToPredicate(query?.filter as MySuiObjectDataFilter)
  ) as ObjectResponse<K>[];
}
