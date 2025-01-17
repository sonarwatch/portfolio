import { NetworkId, suiNativeAddress } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSui } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { Receipt } from './types';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const receipts = await getOwnedObjectsPreloaded<Receipt>(client, owner, {
    filter: {
      StructType:
        '0x9bbd650b8442abb082c20f3bc95a9434a8d47b4bef98b0832dab57c1a8ba0000::foo::Receipt',
    },
  });

  if (receipts.length === 0) return [];

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Deposit',
  });

  receipts.forEach((r) => {
    if (r.data?.content?.fields.amountDeposited)
      element.addAsset({
        address: suiNativeAddress,
        amount: r.data?.content?.fields.amountDeposited,
      });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-positions-sui`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
