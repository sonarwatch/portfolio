import { NetworkId, suiNativeAddress } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getKiosksIds } from '../../utils/sui/getKioskObjects';
import { getClientSui } from '../../utils/clients';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';
import { ObjectResponse } from '../../utils/sui/types';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const ownedObjects = await getOwnedObjectsPreloaded(client, owner);
  if (ownedObjects.length === 0) return [];
  const kioskIds = getKiosksIds(ownedObjects);
  if (kioskIds.length === 0) return [];
  const kiosks = await multiGetObjects(client, kioskIds);
  if (kiosks.length === 0) return [];

  const kiosksWithProfits = kiosks
    .filter((k) => k.data?.type === '0x2::kiosk::Kiosk')
    .map(
      (k) =>
        k as ObjectResponse<{
          owner: string;
          profits: string;
        }>
    )
    .filter((k) => k.data?.content?.fields.profits !== '0');

  const registry = new ElementRegistry(NetworkId.sui, platformId);

  const element = registry.addElementMultiple({
    label: 'Deposit',
    name: 'Profits From Item Sales',
  });

  element.addAsset({
    address: suiNativeAddress,
    amount: kiosksWithProfits.reduce(
      (acc: BigNumber, k) =>
        k.data?.content?.fields.profits
          ? new BigNumber(k.data.content.fields.profits).plus(acc)
          : acc,
      new BigNumber(0)
    ),
  });

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-kiosk-profits`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
