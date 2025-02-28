import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, defiLendingProgramId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { defiLoanStruct, LoanStatus, poolStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const pools = await ParsedGpa.build(client, poolStruct, defiLendingProgramId)
    .addFilter('accountDiscriminator', [241, 154, 109, 4, 17, 177, 109, 188])
    .addFilter('owner', new PublicKey(owner))
    .run();

  if (!pools.length) return [];

  const allDefiLoans = await Promise.all(
    pools.map((pool) =>
      ParsedGpa.build(client, defiLoanStruct, defiLendingProgramId)
        .addFilter('accountDiscriminator', [20, 195, 70, 117, 165, 227, 182, 1])
        .addFilter('pool', pool.pubkey)
        .run()
    )
  );

  if (allDefiLoans.flat().length === 0) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  pools.forEach((pool, i) => {
    const defiLoans = allDefiLoans[i];

    defiLoans.forEach((loan) => {
      if (loan.status !== LoanStatus.Ongoing) return;

      const element = elementRegistry.addElementBorrowlend({
        label: 'Lending',
        ref: loan.pubkey,
        link: `https://app.rain.fi/dashboard/loans?address=${loan.pubkey}`,
      });

      element.setFixedTerms(true, loan.expiredAt.multipliedBy(1000));

      element.addSuppliedAsset({
        address: loan.principal,
        amount: loan.borrowedAmount,
      });

      element.addBorrowedAsset({
        address: loan.collateral,
        amount: loan.collateralAmount,
      });
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-defi-pools`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
