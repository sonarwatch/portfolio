import { NetworkId, PortfolioElementType } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import {
  getAdminOrgs,
  getBorrowerCollateralValues,
  getBorrowerOrderValues,
  getTokensBalance,
  getEscrows,
  getLenderOrderValues,
  getLoanVaults,
  getOrdersForLoans,
} from './helpers';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import marginfiFetcher from '../marginfi/depositsFetcher';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const adminOrgs = await getAdminOrgs(connection, owner);

  if (!adminOrgs.length) return [];

  const escrowAccounts = await getEscrows(connection, adminOrgs);

  if (!escrowAccounts.length) return [];

  const { loansLent, loansBorrowed } = await getLoanVaults(
    connection,
    escrowAccounts
  );

  const lenderLoanValues: { [p: string]: number }[] = [];
  const borrowerLoanValues: { [p: string]: number }[] = [];
  const borrowerCollateralValues: { [p: string]: number }[] = [];
  for (const escrowAccount of escrowAccounts) {
    const e = escrowAccounts.indexOf(escrowAccount);
    const data = await getOrdersForLoans(connection, [
      ...loansLent[e],
      ...loansBorrowed[e],
    ]);

    const lenderOrders = [];
    for (let i = 0; i < loansLent[e].length; i++) {
      const loan = loansLent[e][i];
      const order = data.find(
        (o) => o.orderAddress.toString() === loan.order.toString()
      );
      if (
        order !== undefined &&
        order.order &&
        (order.order.status === 1 || order.order.status === 2)
      )
        lenderOrders.push(order);
    }

    const borrowerOrders = [];
    for (let i = 0; i < loansBorrowed[e].length; i++) {
      const loan = loansBorrowed[e][i];
      const order = data.find(
        (o) => o.orderAddress.toString() === loan.order.toString()
      );
      if (
        order !== undefined &&
        order.order &&
        (order.order.status === 1 || order.order.status === 2)
      )
        borrowerOrders.push(order);
    }

    lenderLoanValues.push(getLenderOrderValues(lenderOrders));
    borrowerLoanValues.push(getBorrowerOrderValues(borrowerOrders));
    borrowerCollateralValues.push(
      await getBorrowerCollateralValues(connection, borrowerOrders)
    );
  }

  const [escrowValues, escrowMarginfiElements] = await Promise.all([
    Promise.all(
      escrowAccounts.map((escrowAccount) =>
        getTokensBalance(escrowAccount.pubkey.toString())
      )
    ),
    Promise.all(
      escrowAccounts.map((escrowAccount) =>
        marginfiFetcher.executor(escrowAccount.pubkey.toString(), cache)
      )
    ),
  ]);

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  escrowAccounts.forEach((escrowAccount, i) => {
    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      name: Object.keys(borrowerLoanValues[i]).length > 0 ? 'Borrow' : 'Lend',
      ref: escrowAccount.pubkey.toString(),
      link: 'https://app.loopscale.com/portfolio',
    });

    escrowMarginfiElements[i].forEach((marginfiElement) => {
      if (marginfiElement.type === PortfolioElementType.borrowlend) {
        marginfiElement.data.suppliedAssets.forEach((asset) => {
          if (asset.data.address && asset.data.amount) {
            element.addSuppliedAsset({
              address: asset.data.address,
              amount: asset.data.amount,
              alreadyShifted: true,
            });
          }
        });
      }
    });

    Object.keys(escrowValues[i]).forEach((address) => {
      element.addSuppliedAsset({
        address,
        amount: escrowValues[i][address],
      });
    });

    Object.keys(lenderLoanValues[i]).forEach((address) => {
      element.addSuppliedAsset({
        address,
        amount: lenderLoanValues[i][address],
      });
    });

    Object.keys(borrowerLoanValues[i]).forEach((address) => {
      element.addBorrowedAsset({
        address,
        amount: borrowerLoanValues[i][address],
      });
    });

    Object.keys(borrowerCollateralValues[i]).forEach((address) => {
      element.addSuppliedAsset({
        address,
        amount: borrowerCollateralValues[i][address],
      });
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
