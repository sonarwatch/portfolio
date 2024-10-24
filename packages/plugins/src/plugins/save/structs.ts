import {
  BeetStruct,
  bool,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u128, u64 } from '../../utils/solana';

export type Fees = {
  borrowFeeWad: BigNumber;
  flashLoanFeeWad: BigNumber;
  hostFeePercentage: number;
};

export const feesStruct = new BeetStruct<Fees>(
  [
    ['borrowFeeWad', u64],
    ['flashLoanFeeWad', u64],
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
  depositLimit: BigNumber;
  borrowLimit: BigNumber;
  feeReceiver: PublicKey;
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
    ['depositLimit', u64],
    ['borrowLimit', u64],
    ['feeReceiver', publicKey],
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
  pythOracle: PublicKey;
  switchboardOracle: PublicKey;
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
    ['pythOracle', publicKey],
    ['switchboardOracle', publicKey],
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
    ['padding', blob(248)],
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
  padding: Buffer;
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
    ['padding', blob(64)],
    ['depositsLen', u8],
    ['borrowsLen', u8],
    ['dataFlat', blob(1096)],
  ],
  (args) => args as Obligation
);

export type ObligationCollateral = {
  depositReserve: PublicKey;
  depositedAmount: BigNumber;
  marketValue: BigNumber;
  padding: Buffer;
};

export const obligationCollateralStruct = new BeetStruct<ObligationCollateral>(
  [
    ['depositReserve', publicKey],
    ['depositedAmount', u64],
    ['marketValue', u128],
    ['padding', blob(32)],
  ],
  (args) => args as ObligationCollateral
);

export type ObligationLiquidity = {
  borrowReserve: PublicKey;
  cumulativeBorrowRateWads: BigNumber;
  borrowedAmountWads: BigNumber;
  marketValue: BigNumber;
  padding: Buffer;
};

export const obligationLiquidityStruct = new BeetStruct<ObligationLiquidity>(
  [
    ['borrowReserve', publicKey],
    ['cumulativeBorrowRateWads', u128],
    ['borrowedAmountWads', u128],
    ['marketValue', u128],
    ['padding', blob(32)],
  ],
  (args) => args as ObligationLiquidity
);

export type ClaimStatus = {
  buffer: Buffer;
  isClaimed: boolean;
  claimant: PublicKey;
  claimedAt: BigNumber;
  amount: BigNumber;
};

export const claimStatusStruct = new BeetStruct<ClaimStatus>(
  [
    ['buffer', blob(8)],
    ['isClaimed', bool],
    ['claimant', publicKey],
    ['claimedAt', i64],
    ['amount', u64],
  ],
  (args) => args as ClaimStatus
);

export type MerkleDistributor = {
  buffer: Buffer;
  base: PublicKey;
  bump: number;
  root: number[];
  mint: PublicKey;
  maxTotalClaim: BigNumber;
  maxNumNodes: BigNumber;
  totalAmountClaimed: BigNumber;
  numNodesClaimed: BigNumber;
};

export const merkleDistributorStruct = new BeetStruct<MerkleDistributor>(
  [
    ['buffer', blob(8)],
    ['base', publicKey],
    ['bump', u8],
    ['root', uniformFixedSizeArray(u8, 32)],
    ['mint', publicKey],
    ['maxTotalClaim', u64],
    ['maxNumNodes', u64],
    ['totalAmountClaimed', u64],
    ['numNodesClaimed', u64],
  ],
  (args) => args as MerkleDistributor
);
