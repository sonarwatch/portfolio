import { NetworkId, solanaNativeAddress } from '@sonarwatch/portfolio-core';
import { getParsedProgramAccounts } from '../../utils/solana';
import { marinadeTicketProgramId, platformId, solFactor } from './constants';
import { ticketStruct } from './structs';
import { ticketFilters } from './filters';
import { getClientSolana } from '../../utils/clients';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const tickets = await getParsedProgramAccounts(
    connection,
    ticketStruct,
    marinadeTicketProgramId,
    ticketFilters(owner)
  );
  if (tickets.length === 0) return [];

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const element = registry.addElementMultiple({
    label: 'Rewards',
    name: 'Tickets',
    link: 'https://marinade.finance/',
  });

  for (let i = 0; i < tickets.length; i += 1) {
    element.addAsset({
      address: solanaNativeAddress,
      amount: tickets[i].lamportsAmount.div(solFactor).toNumber(),
      alreadyShifted: true,
      ref: tickets[i].pubkey,
    });
  }

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-tickets`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
