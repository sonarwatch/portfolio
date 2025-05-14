import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { banksCacheKey, boostProgramId, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { clendAccountStruct } from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { arrayToMap } from '../../utils/misc/arrayToMap';
import { ParsedAccount } from '../../utils/solana';
import { wrappedI80F48toBigNumber } from '../marginfi/helpers';
import { BankInfo } from '../marginfi/types';

export const banksMemo = new MemoizedCache<
  ParsedAccount<BankInfo>[],
  Map<string, ParsedAccount<BankInfo>>
>(
  banksCacheKey,
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
    clendAccountStruct,
    boostProgramId
  )
    .addFilter('accountDiscriminator', [2, 18, 172, 35, 157, 49, 97, 238])
    .addFilter('authority', new PublicKey(owner))
    .run();

  if (!accounts.length) return [];

  const banks = await banksMemo.getItem(cache);

  if (!banks.size) throw new Error('Banks not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      ref: account.pubkey,
      link: 'https://boost.deficarrot.com/',
    });

    account.lendingAccount.balances.forEach((balance) => {
      if (!balance.active) return;
      const bank = banks.get(balance.bankPk.toString());
      if (!bank) return;

      if (!wrappedI80F48toBigNumber(balance.liabilityShares).isZero()) {
        element.addBorrowedAsset({
          address: bank.mint,
          amount: wrappedI80F48toBigNumber(
            balance.liabilityShares
          ).multipliedBy(bank.dividedLiabilityShareValue),
          alreadyShifted: true,
          sourceRefs: [
            { name: 'Lending Market', address: balance.bankPk.toString() },
          ],
        });
        element.addBorrowedWeight(bank.borrowedWeight);
        element.addBorrowedYield(bank.borrowedYields);
      }

      if (!wrappedI80F48toBigNumber(balance.assetShares).isZero()) {
        element.addSuppliedAsset({
          address: bank.mint,
          amount: wrappedI80F48toBigNumber(balance.assetShares).multipliedBy(
            bank.dividedAssetShareValue
          ),
          alreadyShifted: true,
          sourceRefs: [
            { name: 'Lending Market', address: balance.bankPk.toString() },
          ],
        });
        element.addSuppliedLtv(bank.suppliedLtv);
        element.addSuppliedYield(bank.suppliedYields);
      }
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
