import { NetworkId, solanaNativeAddress } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getEscrowAccount } from './helpers';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const pda = getEscrowAccount(owner);
  const client = getClientSolana();

  const amount = await client.getBalance(pda);
  if (!amount) return [];

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const element = registry.addElementMultiple({
    label: 'Deposit',
    ref: pda,
    name: 'Escrow',
  });
  element.addAsset({
    address: solanaNativeAddress,
    amount,
  });

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-escrow`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
