import { Contract, Service } from '@sonarwatch/portfolio-core';
import { ParsedTransactionWithMeta } from '@solana/web3.js';

export type ServiceDefinition = Service & {
  priority?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10; // default 5
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
