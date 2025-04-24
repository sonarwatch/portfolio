import { Contract, Service } from '@sonarwatch/portfolio-core';
import { ParsedTransactionWithMeta } from '@solana/web3.js';

export enum ServicePriority {
  low,
  default,
  high,
}

export type ServiceDefinition = Service & {
  priority?: ServicePriority;
} & (
    | { contracts: Contract[]; matchTransaction?: never }
    | {
        contracts?: never;
        matchTransaction: (
          txn: ParsedTransactionWithMeta,
          contracts: string[]
        ) => boolean;
      }
  );
