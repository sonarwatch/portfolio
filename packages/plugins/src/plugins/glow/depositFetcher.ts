import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { poolsCacheKey, platformId, programId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { getClientSolana } from '../../utils/clients';
import { marginAccountStruct, MarginPool, TokenKind } from './structs';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { ParsedAccount } from '../../utils/solana';

const poolsMemo = new MemoizedCache<ParsedAccount<MarginPool>[]>(
  poolsCacheKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  }
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const accounts = await ParsedGpa.build(
    getClientSolana(),
    marginAccountStruct,
    programId
  )
    .addFilter('accountDiscriminator', [133, 220, 173, 213, 179, 211, 43, 238])
    .addFilter('owner', new PublicKey(owner))
    .run();

  if (!accounts.length) return [];

  const pools = await poolsMemo.getItem(cache);

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      ref: account.pubkey,
    });
    account.positions.forEach((position) => {
      if (position.balance.isZero()) return;

      if (position.kind === TokenKind.Claim) {
        const pool = pools.find(
          (p) => p.deposit_note_mint.toString() === position.token.toString()
        );
        if (!pool) return;
        const noteRate = new BigNumber(pool.deposit_tokens).dividedBy(
          pool.loan_notes
        );

        element.addBorrowedAsset({
          address: pool.token_mint,
          amount: position.balance.dividedBy(noteRate),
        });
      } else {
        const pool = pools.find(
          (p) => p.loan_note_mint.toString() === position.token.toString()
        );
        if (!pool) return;
        const depositNoteRate = new BigNumber(pool.deposit_tokens).dividedBy(
          pool.deposit_notes
        );
        element.addSuppliedAsset({
          address: pool.token_mint,
          amount: position.balance.dividedBy(depositNoteRate),
        });
      }
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-deposit`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
