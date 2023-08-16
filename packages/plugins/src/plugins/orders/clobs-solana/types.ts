import BigNumber from 'bignumber.js';
import { BeetStruct } from '@metaplex-foundation/beet';
import { CLOBMarketAccount, CLOBOrderStruct } from './structs';

export type CLOBMarket = {
  address: string;
  baseMint: string;
  baseDepositsTotal: BigNumber;
  quoteMint: string;
  quoteDepositsTotal: BigNumber;
  programId: string;
};

export type CLOBVersion = {
  name: string;
  programId: string;
  struct: BeetStruct<CLOBMarketAccount, Partial<CLOBMarketAccount>>;
  orderStruct: BeetStruct<CLOBOrderStruct, Partial<CLOBOrderStruct>>;
  prefix: string;
};
