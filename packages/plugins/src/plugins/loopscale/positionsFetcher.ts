import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { platformId, programId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import {
  EscrowAccount,
  escrowAccountStruct,
  LoanVault,
  loanVaultStruct,
  Order,
  orderStruct,
} from './structs';
import { escrowFilters, loanVaultFilters, orderFilters } from './filters';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  // TODO owner to organizationIdentifier ?
  const organizationIdentifier = 'FYyU8uwsBpDPAH4pUE65nLsqbgQbZMBom6KnnraxWQb5';
  /* const escrowAccounts = await getParsedProgramAccounts<EscrowAccount>(
    connection,
    escrowAccountStruct,
    new PublicKey(programId),
    escrowFilters(organizationIdentifier)
  );

  if (!escrowAccounts.length) return [];

  const loanVaultAccounts = await Promise.all(
    escrowAccounts.map((escrowAccount) =>
      getParsedProgramAccounts<LoanVault>(
        connection,
        loanVaultStruct,
        new PublicKey(programId),
        loanVaultFilters(escrowAccount.pubkey.toString())
      )
    )
  );

  console.log(loanVaultAccounts); */

  const orderAccounts = await getParsedProgramAccounts<Order>(
    connection,
    orderStruct,
    new PublicKey(programId),
    orderFilters(organizationIdentifier)
  );

  console.log(orderAccounts);

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  orderAccounts.forEach((orderAccount) => {
    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
    });
    element.addSuppliedAsset({
      address: orderAccount.collateral_mint,
      amount: orderAccount.collateral_amount,
    });
    element.addBorrowedAsset({
      address: orderAccount.principal_mint,
      amount: orderAccount.principal_amount,
    });
  });

  return elementRegistry.dump(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
