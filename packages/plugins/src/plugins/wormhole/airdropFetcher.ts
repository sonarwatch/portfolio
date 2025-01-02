import { NetworkId, NetworkIdType } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, wMint } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getAccountPubkey, getAllocation } from './helpers';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

export default function getPositionsV2Fetcher(
  networkId: NetworkIdType
): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const allocation = await getAllocation(owner, networkId);
    if (allocation === 0) return [];

    const client = getClientSolana();
    const account = await client.getAccountInfo(getAccountPubkey(owner));

    if (account) return [];

    const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

    const element = elementRegistry.addElementMultiple({
      label: 'Airdrop',
    });

    element.addAsset({
      address: wMint,
      amount: allocation,
      attributes: { isClaimable: true },
    });

    return elementRegistry.getElements(cache);
  };

  return {
    id: `${platformId}-airdrop`,
    networkId: NetworkId.solana,
    executor,
  };
}
