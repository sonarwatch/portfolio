import { NetworkId, NetworkIdType } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, wMint } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getAllocation } from './helpers';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { claimInfoStruct } from './structs';

export default function getPositionsV2Fetcher(
  networkId: NetworkIdType
): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const allocation = await getAllocation(owner, networkId);
    if (allocation === 0) return [];

    const client = getClientSolana();
    const accounts = await ParsedGpa.build(
      client,
      claimInfoStruct,
      new PublicKey('Wapq3Hpv2aSKjWrh4pM8eweh8jVJB7D1nLBw9ikjVYx')
    )
      .addFilter('identity', {
        __kind: 'Solana',
        pubkey: Array.from(new PublicKey(owner).toBytes()),
      })
      .run();
    if (accounts) return [];

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
