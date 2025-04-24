import { NetworkIdType } from './Network';
import { TokenInfo } from './TokenList';

/**
 * Represents a smart contract
 */
export type Contract = {
  name: string;
  address: string;
  platformId: string;
};

/**
 * Represents a service from a platform
 */
export type Service = {
  id: string;
  name: string;
  platformId: string;
  networkId: NetworkIdType;
  link?: string;
  description?: string;
};

/**
 * Represents a transaction
 */
export type Transaction = {
  signature: string;
  owner: string;
  blockTime?: number | null;
  service?: Service;
  balanceChanges: BalanceChange[];
  accountChanges: AccountChanges;
  isSigner: boolean;
  tags?: TransactionTag[];
  fees?: number | null;
  success: boolean;
};

export type BalanceChange = {
  address: string;
  preBalance: number;
  postBalance: number;
  change: number;
};

export type AccountChanges = {
  created: string[];
  updated: string[];
  closed: string[];
};

export type TransactionTag = 'jitotip' | 'spam';

/**
 * Represents the result of transactions.
 */
export type TransactionsResult = {
  owner: string;
  account: string;
  networkId: NetworkIdType;
  duration: number;
  transactions: Transaction[];
  tokenInfo?: Partial<Record<NetworkIdType, Record<string, TokenInfo>>>;
};
