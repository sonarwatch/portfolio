import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, programIdV3 } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { LoanStatus, loanStruct } from './defi_lending_structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await ParsedGpa.build(client, loanStruct, programIdV3)
    .addFilter('accountDiscriminator', [20, 195, 70, 117, 165, 227, 182, 1])
    .addFilter('borrower', new PublicKey(owner))
    .run();

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    if (account.status !== LoanStatus.Ongoing) return;

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      ref: account.pubkey,
      link: `https://app.rain.fi/dashboard/loans?address=${account.pubkey}`,
    });

    element.setFixedTerms(account.expiredAt.multipliedBy(1000), false);

    element.addSuppliedAsset({
      address: account.collateral,
      amount: account.collateralAmount,
    });

    element.addBorrowedAsset({
      address: account.principal,
      amount: account.borrowedAmount,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-defi-loans`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
