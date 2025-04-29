import { ID } from '../../utils/sui/types/id';

export type Receipt = {
  id: ID;
  amountDeposited: string;
};

// Type for Pool
export type CachedPool = {
  pubkey: string;
  discriminator: number[];
  interestRate: number;
  collateralType: string;
  maxBorrow: string;
  nodeWallet: string;
  maxExposure: string;
  currentExposure: string;
};
