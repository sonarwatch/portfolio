import { BeetStruct, u32, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u128, u64 } from '../../utils/solana';

export type Fees = {
  borrowFeeWad: BigNumber;
  flashLoanFeeWad: BigNumber;
  hostFeePercentage: number;
};

export const feesStruct = new BeetStruct<Fees>(
  [
    ['borrowFeeWad', u64],
    ['hostFeePercentage', u8],
  ],
  (args) => args as Fees
);

export type ReserveConfig = {
  optimalUtilizationRate: number;
  loanToValueRatio: number;
  liquidationBonus: number;
  liquidationThreshold: number;
  minBorrowRate: number;
  optimalBorrowRate: number;
  maxBorrowRate: number;
  fees: Fees;
};

export const reserveConfigStruct = new BeetStruct<ReserveConfig>(
  [
    ['optimalUtilizationRate', u8],
    ['loanToValueRatio', u8],
    ['liquidationBonus', u8],
    ['liquidationThreshold', u8],
    ['minBorrowRate', u8],
    ['optimalBorrowRate', u8],
    ['maxBorrowRate', u8],
    ['fees', feesStruct],
  ],
  (args) => args as ReserveConfig
);

export type Collateral = {
  mintPubkey: PublicKey;
  mintTotalSupply: BigNumber;
  supplyPubkey: PublicKey;
};

export const collateralStruct = new BeetStruct<Collateral>(
  [
    ['mintPubkey', publicKey],
    ['mintTotalSupply', u64],
    ['supplyPubkey', publicKey],
  ],
  (args) => args as Collateral
);

export type Liquidity = {
  mintPubkey: PublicKey;
  mintDecimals: number;
  supplyPubkey: PublicKey;
  feeReceiver: PublicKey;
  oracleOption: BigNumber;
  oraclePubkey: PublicKey;
  availableAmount: BigNumber;
  borrowedAmountWads: BigNumber;
  cumulativeBorrowRateWads: BigNumber;
  marketPrice: BigNumber;
};

export const liquidityStruct = new BeetStruct<Liquidity>(
  [
    ['mintPubkey', publicKey],
    ['mintDecimals', u8],
    ['supplyPubkey', publicKey],
    ['feeReceiver', publicKey],
    ['oracleOption', u32],
    ['oraclePubkey', publicKey],
    ['availableAmount', u64],
    ['borrowedAmountWads', u128],
    ['cumulativeBorrowRateWads', u128],
    ['marketPrice', u128],
  ],
  (args) => args as Liquidity
);

export type LastUpdate = {
  slot: BigNumber;
  stale: number;
};

export const lastUpdateStruct = new BeetStruct<LastUpdate>(
  [
    ['slot', u64],
    ['stale', u8],
  ],
  (args) => args as LastUpdate
);

export type Reserve = {
  version: number;
  lastUpdate: LastUpdate;
  lendingMarket: PublicKey;
  liquidity: Liquidity;
  collateral: Collateral;
  config: ReserveConfig;
  padding: Buffer;
};

export const reserveStruct = new BeetStruct<Reserve>(
  [
    ['version', u8],
    ['lastUpdate', lastUpdateStruct],
    ['lendingMarket', publicKey],
    ['liquidity', liquidityStruct],
    ['collateral', collateralStruct],
    ['config', reserveConfigStruct],
    ['padding', blob(256)],
  ],
  (args) => args as Reserve
);

export type Obligation = {
  version: number;
  lastUpdate: LastUpdate;
  lendingMarket: PublicKey;
  owner: PublicKey;
  depositedValue: BigNumber;
  borrowedValue: BigNumber;
  allowedBorrowValue: BigNumber;
  unhealthyBorrowValue: BigNumber;
  depositsLen: number;
  borrowsLen: number;
  dataFlat: Buffer;
};

export const obligationStruct = new BeetStruct<Obligation>(
  [
    ['version', u8],
    ['lastUpdate', lastUpdateStruct],
    ['lendingMarket', publicKey],
    ['owner', publicKey],
    ['depositedValue', u128],
    ['borrowedValue', u128],
    ['allowedBorrowValue', u128],
    ['unhealthyBorrowValue', u128],
    ['depositsLen', u8],
    ['borrowsLen', u8],
    ['dataFlat', blob(776)],
  ],
  (args) => args as Obligation
);

export type ObligationCollateral = {
  depositReserve: PublicKey;
  depositedAmount: BigNumber;
  marketValue: BigNumber;
};
export const obligationCollateralStruct = new BeetStruct<ObligationCollateral>(
  [
    ['depositReserve', publicKey],
    ['depositedAmount', u64],
    ['marketValue', u128],
  ],
  (args) => args as ObligationCollateral
);

export type ObligationLiquidity = {
  borrowReserve: PublicKey;
  cumulativeBorrowRateWads: BigNumber;
  borrowedAmountWads: BigNumber;
  marketValue: BigNumber;
};
export const obligationLiquidityStruct = new BeetStruct<ObligationLiquidity>(
  [
    ['borrowReserve', publicKey],
    ['cumulativeBorrowRateWads', u128],
    ['borrowedAmountWads', u128],
    ['marketValue', u128],
  ],
  (args) => args as ObligationLiquidity
);
