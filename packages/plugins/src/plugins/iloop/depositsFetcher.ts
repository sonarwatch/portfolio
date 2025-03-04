import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ParsedAccount } from '../../utils/solana';
import { marketsCacheKey, platformId, programId } from './constants';
import { LendingMarket, obligationStruct } from './structs';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { arrayToMap } from '../../utils/misc/arrayToMap';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const marketsMemo = new MemoizedCache<
  ParsedAccount<LendingMarket>[],
  Map<string, ParsedAccount<LendingMarket>>
>(
  marketsCacheKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  },
  (markets) =>
    markets
      ? arrayToMap(
          markets.filter(
            (m) => m !== undefined
          ) as ParsedAccount<LendingMarket>[],
          'pubkey'
        )
      : new Map()
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await ParsedGpa.build(client, obligationStruct, programId)
    .addFilter('accountDiscriminator', [168, 206, 141, 106, 88, 76, 172, 167])
    .addFilter('owner', new PublicKey(owner))
    .run();

  if (accounts.length === 0) return [];

  const markets = await marketsMemo.getItem(cache);
  if (!markets) throw new Error('Markets not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      link: 'https://app.iloop.finance/',
      ref: account.pubkey,
    });
    const depositMarket = markets.get(
      account.deposit_position.reserve.toString()
    );

    if (depositMarket) {
      element.addSuppliedAsset({
        address: depositMarket.owner_cached,
        amount: account.deposit_position.collateral_amount,
        sourceRefs: [
          { name: 'Lending Market', address: depositMarket.pubkey.toString() },
        ],
      });
    }

    if (account.borrow_position.borrowed_amount.isGreaterThan(0)) {
      const borrowMarket = markets.get(
        account.borrow_position.reserve.toString()
      );
      if (borrowMarket) {
        element.addBorrowedAsset({
          address: borrowMarket.owner_cached,
          amount: account.borrow_position.borrowed_amount,
          sourceRefs: [
            { name: 'Lending Market', address: borrowMarket.pubkey.toString() },
          ],
        });
      }
    }
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
