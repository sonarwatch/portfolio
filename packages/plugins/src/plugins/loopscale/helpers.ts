import { Connection, PublicKey } from '@solana/web3.js';
import {
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  ParsedAccount,
} from '../../utils/solana';
import { creditbookProgramId, lockboxProgramId } from './constants';
import {
  EscrowAccount,
  escrowAccountStruct,
  Ledger,
  LoanVault,
  loanVaultStruct,
  lockboxStruct,
  Order,
  OrderLedger,
  orderLedgerStruct,
  orderStruct,
  roleAccountStruct,
} from './structs';
import {
  escrowFilters,
  loanVaultBorrowedFilters,
  loanVaultLentFilters,
  lockboxFilters,
  roleFilters,
} from './filters';
import getSolanaDasEndpoint from '../../utils/clients/getSolanaDasEndpoint';
import { getAssetsByOwnerDas } from '../../utils/solana/das/getAssetsByOwnerDas';
import { isHeliusFungibleAsset } from '../../utils/solana/das/isHeliusFungibleAsset';

export const getAdminOrgs = async (
  connection: Connection,
  owner: string
): Promise<PublicKey[]> => {
  const roles = await getParsedProgramAccounts(
    connection,
    roleAccountStruct,
    creditbookProgramId,
    roleFilters(owner)
  );

  return roles
    .filter((r) => r.type === 4 || r.type === 5)
    .map((r) => r.organization);
};

export const getEscrows = async (
  connection: Connection,
  adminOrgs: PublicKey[]
): Promise<ParsedAccount<EscrowAccount>[]> =>
  (
    await Promise.all(
      adminOrgs.map((organizationIdentifier) =>
        getParsedProgramAccounts<EscrowAccount>(
          connection,
          escrowAccountStruct,
          creditbookProgramId,
          escrowFilters(organizationIdentifier.toString())
        )
      )
    )
  ).flat();

export const getLoanVaults = async (
  connection: Connection,
  escrowAccounts: ParsedAccount<EscrowAccount>[]
) => {
  const [loansBorrowed, loansLent] = await Promise.all([
    await Promise.all(
      escrowAccounts.map((escrowAccount) =>
        getParsedProgramAccounts<LoanVault>(
          connection,
          loanVaultStruct,
          creditbookProgramId,
          loanVaultBorrowedFilters(escrowAccount.pubkey.toString())
        )
      )
    ),
    await Promise.all(
      escrowAccounts.map((escrowAccount) =>
        getParsedProgramAccounts<LoanVault>(
          connection,
          loanVaultStruct,
          creditbookProgramId,
          loanVaultLentFilters(escrowAccount.pubkey.toString())
        )
      )
    ),
  ]);

  return {
    loansLent,
    loansBorrowed,
  };
};

export const getOrdersForLoans = async (
  connection: Connection,
  loans: ParsedAccount<LoanVault>[]
) => {
  const orderAddresses = loans.map((l) => l.order);

  const orders = await getParsedMultipleAccountsInfo<Order>(
    connection,
    orderStruct,
    orderAddresses
  );

  const orderLedgerAddresses = orderAddresses.map(
    (o) =>
      PublicKey.findProgramAddressSync(
        [Buffer.from('order_ledgers'), o.toBytes()],
        creditbookProgramId
      )[0]
  );

  const orderLedgers = await getParsedMultipleAccountsInfo<OrderLedger>(
    connection,
    orderLedgerStruct,
    orderLedgerAddresses
  );

  const orderData = [];
  for (let i = 0; i < orderAddresses.length; i++) {
    const order = orders[i];
    const orderLedger = orderLedgers[i];
    if (!orderLedger) continue;
    const { ledgers } = orderLedger;
    const orderAddress = orderAddresses[i];
    orderData.push({ order, ledgers, orderAddress });
  }
  return orderData;
};

export const getLenderOrderValues = (
  orders: {
    order: ParsedAccount<Order> | null;
    ledgers: Ledger[];
    orderAddress: PublicKey;
  }[]
) => {
  const loanValues: Balances = {};
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    if (!order.order || !order.order.principal_mint) continue;
    const principal = order.order.principal_mint.toString();
    const totalOwed = getOrderDueAmount(order.ledgers);

    if (!Object.keys(loanValues).includes(principal)) {
      loanValues[principal] = totalOwed;
    } else {
      loanValues[principal] += totalOwed;
    }
  }
  return loanValues;
};

export const getBorrowerOrderValues = (
  orders: {
    order: ParsedAccount<Order> | null;
    ledgers: Ledger[];
    orderAddress: PublicKey;
  }[]
) => {
  const loanValues: Balances = {};

  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    if (!order.order || !order.order.principal_mint) continue;
    const principal = order.order.principal_mint.toString();
    const totalDue = getOrderDueAmount(order.ledgers);

    if (!Object.keys(loanValues).includes(principal)) {
      loanValues[principal] = totalDue;
    } else {
      loanValues[principal] += totalDue;
    }
  }

  return loanValues;
};

function getOrderDueAmount(ledgers: Ledger[]) {
  return ledgers.reduce(
    (prev, curr) =>
      prev +
      (curr.principal_due.toNumber() - curr.principal_repaid.toNumber()) +
      (curr.interest_due.toNumber() - curr.interest_repaid.toNumber()),
    0
  );
}

export const getBorrowerCollateralValues = async (
  connection: Connection,
  orders: {
    order: ParsedAccount<Order> | null;
    ledgers: Ledger[];
    orderAddress: PublicKey;
  }[]
) => {
  const lbNfts = orders.map((o) => o.order?.collateral_mint);

  const lockboxes = await fetchLockboxesFromNFTs(
    connection,
    lbNfts.filter((p) => p !== null) as PublicKey[]
  );

  const balances = await Promise.all(
    lockboxes.map((lockbox) => getTokensBalance(lockbox.toString()))
  );

  return mergeBalances(balances);
};

const fetchLockboxesFromNFTs = async (
  connection: Connection,
  nfts: PublicKey[]
): Promise<PublicKey[]> => {
  const lbs = [];

  for (let i = 0; i < nfts.length; i++) {
    const lb = await getParsedProgramAccounts(
      connection,
      lockboxStruct,
      lockboxProgramId,
      lockboxFilters(nfts[i].toString())
    );
    if (lb.length > 0) lbs.push(lb[0].pubkey);
  }
  return lbs;
};

export const getTokensBalance = async (owner: string) => {
  const dasEndpoint = getSolanaDasEndpoint();
  const items = await getAssetsByOwnerDas(dasEndpoint, owner, {
    showNativeBalance: false,
    showGrandTotal: false,
    showInscription: false,
  });
  const escrowValues: Balances = {};
  items.filter(isHeliusFungibleAsset).forEach((asset) => {
    if (!asset.token_info?.balance) return;
    if (!Object.keys(escrowValues).includes(asset.id)) {
      escrowValues[asset.id] = asset.token_info.balance;
    } else {
      escrowValues[asset.id] += asset.token_info.balance;
    }
  });
  return escrowValues;
};

export type Balances = { [key: string]: number };

const mergeBalances = (balances: Balances[]): Balances => {
  if (!balances.length) return {};
  if (balances.length === 1) return balances[0];
  const mainBalance = balances[0];
  for (let i = 1; i < balances.length; i++) {
    Object.keys(balances[i]).forEach((mint) => {
      const amount = balances[i][mint];
      if (!Object.keys(mainBalance).includes(mint)) {
        mainBalance[mint] = amount;
      } else {
        mainBalance[mint] += amount;
      }
    });
  }
  return mainBalance;
};
