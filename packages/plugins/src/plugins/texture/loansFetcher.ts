import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { pairsMemo, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getMemoizedUser } from './helpers';
import { Loan, Offer } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const user = await getMemoizedUser(owner);
  if (!user) return [];

  const apiClient = axios.create({
    baseURL: 'https://moneyback.texture.finance',
    timeout: 500,
  });

  const [loansAsBorrower, loansAsLender, offersAsLender] = await Promise.all([
    apiClient.get<Loan[]>(`/loans?borrower=${user}`),
    apiClient.get<Loan[]>(`/loans?lender=${user}`),
    apiClient.get<Offer[]>(`/my_offers?lender=${user}`),
  ]);

  const pairs = await pairsMemo.getItem(cache);
  if (!pairs) throw new Error('Pairs not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  [...loansAsBorrower.data, ...loansAsLender.data].forEach((loan) => {
    const pair = pairs.get(loan.pair);
    if (!pair) return;

    if (loan.status !== 'Active') return;

    const isLender = loan.lender_owner === owner;

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      ref: loan.loan,
      sourceRefs: [
        {
          name: 'Pair',
          address: pair.pair,
        },
      ],
      link: 'https://texture.finance/lendy/my_loans',
    });
    element.setFixedTerms(isLender, (loan.start_time + pair.duration) * 1000);

    const principal = {
      address: pair.principal_token.mint,
      amount: loan.principal,
    };
    const collateral = {
      address: pair.collateral_token.mint,
      amount: loan.collateral,
    };

    if (isLender) {
      element.addSuppliedAsset(principal);
      element.addBorrowedAsset(collateral);
    } else {
      element.addSuppliedAsset(collateral);
      element.addBorrowedAsset(principal);
    }
  });

  offersAsLender.data.forEach((offer) => {
    const pair = pairs.get(offer.pair);
    if (!pair) return;

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      name: 'Offer',
      ref: offer.offer,
      sourceRefs: [
        {
          name: 'Pair',
          address: pair.pair,
        },
      ],
      link: 'https://texture.finance/lendy/my_offers',
    });

    element.addSuppliedAsset({
      address: pair.principal_token.mint,
      amount: offer.remaining_principal,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-loans`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
