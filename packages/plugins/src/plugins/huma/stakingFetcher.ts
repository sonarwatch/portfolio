import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { platformId, stakingProgramId } from './constants';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { voterStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await ParsedGpa.build(
    client,
    voterStruct,
    new PublicKey(stakingProgramId)
  )
    .addFilter('voterAuthority', new PublicKey(owner))
    .run();

  if (!accounts.length) return [];

  const registry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const element = registry.addElementMultiple({
      label: 'Staked',
      link: 'https://app.huma.finance/HUMA',
      ref: account.pubkey.toString(),
    });

    account.deposits
      .filter((d) => d.isUsed)
      .forEach((deposit) => {
        element.addAsset({
          address: 'HUMA1821qVDKta3u2ovmfDQeW2fSQouSKE8fkF44wvGw',
          amount: deposit.amountDepositedNative,
        });
      });
  });

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
