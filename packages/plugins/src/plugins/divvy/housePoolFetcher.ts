import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { divvyProgram, houseCacheKey, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ParsedAccount } from '../../utils/solana';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { arrayToMap } from '../../utils/misc/arrayToMap';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { House, positionStruct } from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const housesMemo = new MemoizedCache<
  ParsedAccount<House>[],
  Map<string, ParsedAccount<House>>
>(
  houseCacheKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  },
  (arr) => arrayToMap(arr || [], 'pubkey')
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = await ParsedGpa.build(
    connection,
    positionStruct,
    divvyProgram
  )
    .addFilter('accountDiscriminator', [170, 188, 143, 228, 122, 64, 247, 208])
    .addFilter('user', new PublicKey(owner))
    .run();

  if (accounts.length === 0) return [];

  const houses = await housesMemo.getItem(cache);
  if (!houses) throw new Error('Houses not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Deposit',
    name: 'House Pool',
    link: 'https://app.divvy.bet/housepool/?house=SOL',
  });

  accounts.forEach((account) => {
    const house = houses.get(account.house.toString());
    if (!house) return;
    element.addAsset({
      address: house.currency,
      amount: account.amount,
      ref: account.pubkey,
      sourceRefs: [{ name: 'Pool', address: house.pubkey.toString() }],
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
