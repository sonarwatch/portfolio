import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { cetusMint, platformId, xCetusMint } from './constants';
import { getClientSui } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const [veNFTs, lockedCoins] = await Promise.all([
    getOwnedObjectsPreloaded<{
      xcetus_balance: string;
    }>(client, owner, {
      filter: {
        StructType:
          '0x9e69acc50ca03bc943c4f7c5304c2a6002d507b51c11913b247159c60422c606::xcetus::VeNFT',
      },
    }),
    getOwnedObjectsPreloaded<{
      balance: string;
      locked_until_time: string;
    }>(client, owner, {
      filter: {
        StructType: `0x9e69acc50ca03bc943c4f7c5304c2a6002d507b51c11913b247159c60422c606::lock_coin::LockedCoin<${cetusMint}>`,
      },
    }),
  ]);

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Staked',
  });

  const total = veNFTs.reduce(
    (acc, veNFT) => acc.plus(veNFT.data?.content?.fields.xcetus_balance || 0),
    new BigNumber(0)
  );
  let unlocking = new BigNumber(0);

  for (const lockedCoin of lockedCoins) {
    if (!lockedCoin.data?.content) continue;

    const lockInfo = await getDynamicFieldObject<{
      value: {
        fields: {
          value: {
            fields: {
              cetus_amount: string;
              xcetus_amount: string;
            };
          };
        };
      };
    }>(client, {
      parentId:
        '0x7c534bb7b8a2cc21538d0dbedd2437cc64f47106cb4c259b9ff921b5c3cb1a49',
      name: { type: '0x2::object::ID', value: lockedCoin.data.objectId },
    });

    if (!lockInfo.data?.content?.fields.value.fields.value.fields) continue;

    element.addAsset({
      address: cetusMint,
      amount:
        lockInfo.data?.content?.fields.value.fields.value.fields.cetus_amount,
      attributes: {
        lockedUntil:
          Number(lockedCoin.data.content.fields.locked_until_time) * 1000,
      },
    });
    unlocking = unlocking.plus(
      lockInfo.data?.content?.fields.value.fields.value.fields.xcetus_amount
    );
  }

  element.addAsset({
    address: xCetusMint,
    amount: total.minus(unlocking),
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
