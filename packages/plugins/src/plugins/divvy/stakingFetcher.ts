import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { divvyProgram, dvyMint, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { minerStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = await ParsedGpa.build(connection, minerStruct, divvyProgram)
    .addFilter('accountDiscriminator', [223, 113, 15, 54, 123, 122, 140, 100])
    .addFilter('authority', new PublicKey(owner))
    .run();

  if (accounts.length === 0) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Staked',
    link: 'https://app.divvy.bet/staking/?house=SOL',
  });

  accounts.forEach((account) => {
    element.addAsset({
      address: dvyMint,
      amount: account.amount,
      ref: account.pubkey,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
