import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { divvyIdlItem, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { Miner } from './types';
import { getAutoParsedProgramAccounts } from '../../utils/solana';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = await getAutoParsedProgramAccounts<Miner>(
    connection,
    divvyIdlItem,
    [
      {
        dataSize: 96,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 41,
        },
      },
    ]
  );

  if (accounts.length === 0) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Staked',
  });

  accounts.forEach((account) => {
    element.addAsset({
      address: '8fdi18UQNGg8mFEzjf79GUkzTg9YHSeojzCcarVxCX2y',
      amount: account.amount,
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
