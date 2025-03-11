import { NetworkId } from '@sonarwatch/portfolio-core';
import { platformId, restakingPid, restakingVaultsKey } from './constants';
import { vaultNcnTicketStruct } from './structs';
import { dataSizeFilter } from '../../utils/solana/filters';
import { getClientSolana } from '../../utils/clients';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getParsedProgramAccounts } from '../../utils/solana';
import { Cache } from '../../Cache';
import { RestakingVaultInfo } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const [ticketsAccounts, vaultsInfo, slot] = await Promise.all([
    getParsedProgramAccounts(client, vaultNcnTicketStruct, restakingPid, [
      ...dataSizeFilter(vaultNcnTicketStruct.byteSize),
      {
        memcmp: {
          offset: 40,
          bytes: owner,
        },
      },
    ]),
    cache.getItem<RestakingVaultInfo[]>(restakingVaultsKey, {
      prefix: platformId,
      networkId: NetworkId.solana,
    }),
    client.getSlot(),
  ]);

  if (ticketsAccounts.length === 0) return [];
  if (!vaultsInfo) throw new Error('Vaults not cached');

  const registry = new ElementRegistry(NetworkId.solana, platformId);

  for (const ticket of ticketsAccounts) {
    const vault = vaultsInfo.find((v) => v.pubkey === ticket.vault.toString());
    if (!vault) continue;

    const element = registry.addElementMultiple({
      platformId: vault.platformId,
      label: 'Deposit',
      ref: ticket.pubkey.toString(),
      sourceRefs: [
        {
          name: 'Vault',
          address: vault.pubkey.toString(),
        },
      ],
      link: `https://www.jito.network/restaking/vaults/${vault.pubkey.toString()}/`,
    });

    element.addAsset({
      address: vault.vrtMint,
      amount: ticket.vrtAmount,
      attributes: {
        isClaimable: ticket.slotUnstaked.isLessThanOrEqualTo(slot),
      },
    });
  }

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-restaking-tickets`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
