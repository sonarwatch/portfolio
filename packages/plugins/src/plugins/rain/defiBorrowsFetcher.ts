import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, defiLendingProgramId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { defiLoanStruct, LoanStatus } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const loans = await ParsedGpa.build(
    client,
    defiLoanStruct,
    defiLendingProgramId
  )
    .addFilter('accountDiscriminator', [20, 195, 70, 117, 165, 227, 182, 1])
    .addFilter('borrower', new PublicKey(owner))
    .run();

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  loans.forEach((loan) => {
    if (loan.status !== LoanStatus.Ongoing) return;

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      ref: loan.pubkey,
      link: `https://app.rain.fi/dashboard/loans?address=${loan.pubkey}`,
    });

    element.setFixedTerms(false, loan.expiredAt.multipliedBy(1000));

    element.addSuppliedAsset({
      address: loan.collateral,
      amount: loan.collateralAmount,
    });

    element.addBorrowedAsset({
      address: loan.principal,
      amount: loan.borrowedAmount,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-defi-borrows`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
