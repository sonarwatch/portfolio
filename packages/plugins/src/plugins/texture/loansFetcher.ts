import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { pairsMemo, platformId, lendyProgramId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getMemoizedUser } from './helpers';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { getClientSolana } from '../../utils/clients';
import { LoanStatus, loanStruct, offerStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const user = await getMemoizedUser(owner);
  if (!user) return [];

  const client = getClientSolana();

  const [loansAsBorrower, loansAsLender, offersAsLender] = await Promise.all([
    ParsedGpa.build(client, loanStruct, lendyProgramId)
      .addFilter('accountDiscriminator', [77, 95, 95, 95, 76, 79, 65, 78])
      .addFilter('borrower', new PublicKey(user))
      .addFilter('status', LoanStatus.Active)
      .run(),
    ParsedGpa.build(client, loanStruct, lendyProgramId)
      .addFilter('accountDiscriminator', [77, 95, 95, 95, 76, 79, 65, 78])
      .addFilter('lender', new PublicKey(user))
      .addFilter('status', LoanStatus.Active)
      .run(),
    ParsedGpa.build(client, offerStruct, lendyProgramId)
      // .addFilter('accountDiscriminator', [77, 95, 95, 95, 76, 79, 65, 78])
      .addFilter('lender', new PublicKey(user))
      .run(),
  ]);

  const pairs = await pairsMemo.getItem(cache);
  if (!pairs) throw new Error('Pairs not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  [...loansAsBorrower, ...loansAsLender].forEach((loan) => {
    const pair = pairs.get(loan.pair.toString());
    if (!pair) return;

    const isLender = loan.lender.toString() === owner;

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      ref: loan.pubkey.toString(),
      sourceRefs: [
        {
          name: 'Pair',
          address: pair.pair,
        },
      ],
      link: 'https://texture.finance/lendy/my_loans',
    });
    element.setFixedTerms(
      isLender,
      loan.start_time.plus(pair.duration).multipliedBy(1000)
    );

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

  offersAsLender.forEach((offer) => {
    const pair = pairs.get(offer.pair.toString());
    if (!pair) return;

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      name: 'Offer',
      ref: offer.pubkey.toString(),
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
