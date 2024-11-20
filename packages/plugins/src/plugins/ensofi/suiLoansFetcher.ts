import { NetworkId, parseTypeString } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { loansCacheKey, offersCacheKey, platformId } from './constants';
import { Loan, Offer } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { ObjectResponse } from '../../utils/sui/types';

const offersMemo = new MemoizedCache<ObjectResponse<Offer>[]>(offersCacheKey, {
  prefix: platformId,
  networkId: NetworkId.sui,
});
const loansMemo = new MemoizedCache<ObjectResponse<Loan>[]>(loansCacheKey, {
  prefix: platformId,
  networkId: NetworkId.sui,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const [offers, loans] = await Promise.all([
    offersMemo.getItem(cache),
    loansMemo.getItem(cache),
  ]);

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);

  if (offers && offers.length > 0) {
    const filteredOffers = offers.filter(
      (o) => o.data?.content?.fields.lender === owner
    );
    const openOffersElement = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      name: 'Open Offers',
    });
    filteredOffers.forEach((offer) => {
      if (!offer.data?.content) return;
      if (offer.data.content.fields.status !== 'Created') return;
      const { keys } = parseTypeString(offer.data?.type);
      if (!keys || !keys[0]) return;

      openOffersElement.addSuppliedAsset({
        address: keys[0].type,
        amount: offer.data?.content?.fields.amount,
      });
    });
  }

  if (loans && loans.length > 0) {
    const filteredLoans = loans.filter(
      (l) =>
        l.data?.content?.fields.lender === owner ||
        l.data?.content?.fields.borrower === owner
    );

    const lenderActiveElement = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      name: 'Active Contracts',
    });

    filteredLoans.forEach((loan) => {
      if (!loan.data?.content) return;
      if (
        !['FundTransferred', 'Liquidating'].includes(
          loan.data.content.fields.status
        )
      )
        return;
      const { keys } = parseTypeString(loan.data?.type);
      if (!keys || !keys[0] || !keys[1]) return;

      const borrowerActiveElement = elementRegistry.addElementBorrowlend({
        label: 'Lending',
        name: 'Active Contract',
      });

      if (loan.data.content.fields.lender === owner) {
        // LENDER
        lenderActiveElement.addSuppliedAsset({
          address: keys[0].type,
          amount: loan.data.content.fields.amount,
          attributes: {
            lockedUntil: new BigNumber(loan.data.content.fields.start_timestamp)
              .plus(
                new BigNumber(loan.data.content.fields.duration).multipliedBy(
                  1000
                )
              )
              .toNumber(),
          },
        });
      } else {
        // BORROWER
        borrowerActiveElement.addSuppliedAsset({
          address: keys[1].type,
          amount: loan.data.content.fields.collateral,
        });
        borrowerActiveElement.addBorrowedAsset({
          address: keys[0].type,
          amount: loan.data.content.fields.amount,
        });
      }
    });
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-sui-loans`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
