import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, bankProgramId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { bankStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await ParsedGpa.build(client, bankStruct, bankProgramId)
    .addFilter('accountDiscriminator', [142, 49, 166, 242, 50, 66, 97, 188])
    .addFilter('owner', new PublicKey(owner))
    .run();

  if (!accounts.length) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const element = elementRegistry.addElementMultiple({
      label: 'Deposit',
      name: 'Vault',
      ref: account.pubkey,
    });

    element.addAsset({
      address: account.mint,
      amount: account.availableLiquidity,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-banks`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
