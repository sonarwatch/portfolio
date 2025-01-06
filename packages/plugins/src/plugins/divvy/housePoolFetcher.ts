import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { divvyIdlItem, houseCacheKey, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { House, Position } from './types';
import { getAutoParsedProgramAccounts } from '../../utils/solana';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { arrayToMap } from '../../utils/misc/arrayToMap';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const housesMemo = new MemoizedCache<House[], Map<string, House>>(
  houseCacheKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  },
  (arr) => arrayToMap(arr || [], 'pubkey')
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = await getAutoParsedProgramAccounts<Position>(
    connection,
    divvyIdlItem,
    [
      {
        dataSize: 93,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 40,
        },
      },
    ]
  );

  if (accounts.length === 0) return [];

  const houses = await housesMemo.getItem(cache);

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Deposit',
    name: 'House Pool',
  });

  accounts.forEach((account) => {
    const house = houses.get(account.house);
    if (!house) return;
    element.addAsset({
      address: house.currency,
      amount: account.amount,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-house-pool`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
