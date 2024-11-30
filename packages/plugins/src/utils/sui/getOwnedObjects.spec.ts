import { SuiObjectDataFilter } from '@mysten/sui/src/client/types/generated';
import { getClientSui } from '../clients';
import { getOwnedObjects } from './getOwnedObjects';
import { getOwnedObjectsPreloaded } from './getOwnedObjectsPreloaded';

describe('getOwnedObjects', () => {
  const client = getClientSui();

  const owner =
    '0xcfa90668e446e80d0172ec7e9f9f0e80d48045bbb1817616552060574e049866';
  const structTypeExample1 =
    '0xba0dd78bdd5d1b5f02a689444522ea9a79e1bc4cd4d8e6a57b59f3fbcae5e978::farm::StakeReceipt';
  const moveModulePackage =
    '0xefe8b36d5b2e43728cc323298626b83177803521d195cfb11e15b910e892fddf';
  const MoveModuleModule = 'obligation';
  const structTypeScallopObligation = `${moveModulePackage}::${MoveModuleModule}::ObligationKey`;

  const filters: (SuiObjectDataFilter | null)[] = [
    null,
    {
      MoveModule: {
        package: moveModulePackage,
        module: MoveModuleModule,
      },
    },
    {
      Package: moveModulePackage,
    },
    {
      StructType: structTypeScallopObligation,
    },
    {
      MatchAny: [
        {
          StructType: structTypeExample1,
        },
        {
          StructType: structTypeScallopObligation,
        },
      ],
    },
    {
      MatchNone: [
        {
          StructType: structTypeExample1,
        },
        {
          StructType: structTypeScallopObligation,
        },
      ],
    },
    {
      MatchAll: [
        {
          MoveModule: {
            package: moveModulePackage,
            module: MoveModuleModule,
          },
        },
        {
          StructType: structTypeScallopObligation,
        },
      ],
    },
  ];

  it('should getOwnedObjects with right filters', async () => {
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];

      const filterWithoutCoin = filter
        ? {
            MatchAll: [
              {
                MatchNone: [
                  {
                    StructType: '0x2::coin::Coin',
                  },
                ],
              },
              filter,
            ],
          }
        : {
            MatchNone: [
              {
                StructType: '0x2::coin::Coin',
              },
            ],
          };

      const objectsFromRpc = await getOwnedObjects(client, owner, {
        filter: filterWithoutCoin,
      });
      const objectsFromCache = await getOwnedObjectsPreloaded(client, owner, {
        filter,
      });

      expect(objectsFromRpc.length).toEqual(objectsFromCache.length);
    }
  });
});
