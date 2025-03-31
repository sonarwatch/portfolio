import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { platformId, stakingProgramId } from './constants';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { stakedStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await ParsedGpa.build(client, stakedStruct, stakingProgramId)
    .addFilter('accountDiscriminator', [171, 229, 193, 85, 67, 177, 151, 4])
    .addFilter('user', new PublicKey(owner))
    .run();

  if (!accounts.length) return [];

  const registry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const element = registry.addElementMultiple({
      label: 'Staked',
      link: 'https://app.pumpkin.fun/stake',
      ref: account.pubkey.toString(),
    });

    element.addAsset({
      address: account.mint,
      amount: account.amount,
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
