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
    .addFilter('owner', new PublicKey(owner))
    .run();

  if (!accounts.length) return [];

  const registry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const lockedUntil = account.unlockAtTimestamp
      ? account.unlockAtTimestamp.multipliedBy(1000).toNumber()
      : undefined;
    const element = registry.addElementMultiple({
      label: 'Staked',
      link: 'https://stake.honey.land',
      ref: account.pubkey.toString(),
    });

    element.addAsset({
      address: '3dgCCb15HMQSA4Pn3Tfii5vRk7aRqTH95LJjxzsG2Mug',
      amount: account.stakedAmount,
      attributes: {
        lockedUntil,
      },
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
