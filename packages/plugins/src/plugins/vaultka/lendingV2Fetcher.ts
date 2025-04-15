import { NetworkId } from '@sonarwatch/portfolio-core';
import { banksMemo, group, lendingV2Pid, platformId } from './constants';
import { wrappedI80F48toBigNumber } from '../marginfi/helpers';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getMarginFiAccounts } from '../marginfi/getMarginFiAccounts';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const marginFiAccounts = await getMarginFiAccounts(
    owner,
    {
      group,
      pid: lendingV2Pid,
      memo: banksMemo,
    },
    cache
  );

  if (!marginFiAccounts) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  marginFiAccounts.forEach((marginfiAccount) => {
    if (!marginfiAccount) return;
    const { balances } = marginfiAccount;
    if (!balances || balances.length === 0) return;

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      ref: marginfiAccount.pubkey.toString(),
      link: 'https://solana.vaultka.com/',
    });

    balances.forEach((balance) => {
      if (!balance) return;

      if (!balance.assetShares.value.isZero()) {
        const suppliedAmount = wrappedI80F48toBigNumber(balance.assetShares)
          .times(balance.bank.dividedAssetShareValue)
          .toNumber();

        element.addSuppliedAsset({
          address: balance.bank.mint,
          amount: suppliedAmount,
          alreadyShifted: true,
          sourceRefs: [
            { name: 'Lending Market', address: balance.bankPk.toString() },
          ],
        });

        element.addSuppliedLtv(balance.bank.suppliedLtv);
        element.addSuppliedYield(balance.bank.suppliedYields);
      }

      if (!balance.liabilityShares.value.isZero()) {
        const borrowedAmount = wrappedI80F48toBigNumber(balance.liabilityShares)
          .times(balance.bank.dividedLiabilityShareValue)
          .toNumber();

        element.addBorrowedAsset({
          address: balance.bank.mint,
          amount: borrowedAmount,
          alreadyShifted: true,
          sourceRefs: [
            { name: 'Lending Market', address: balance.bankPk.toString() },
          ],
        });

        element.addBorrowedWeight(balance.bank.borrowedWeight);
        element.addBorrowedYield(balance.bank.borrowedYields);
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
