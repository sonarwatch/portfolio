import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { u128, u64 } from '../../../utils/solana';

export type BigFractionBytes = {
  value0: BigNumber;
  value1: BigNumber;
  value2: BigNumber;
  value3: BigNumber;
  value: BigNumber[];
  padding: BigNumber;
  padding1: BigNumber;
};
export const bigFractionBytesStruct = new BeetStruct<BigFractionBytes>(
  [
    ['value0', u64],
    ['value1', u64],
    ['value2', u64],
    ['value3', u64],
    ['padding', u64],
    ['padding1', u64],
  ],
  (args) => args as BigFractionBytes
);
export type ObligationLiquidity = {
  borrowReserve: PublicKey;
  cumulativeBorrowRateBsf: BigFractionBytes;
  padding: BigNumber;
  borrowedAmountSf: BigNumber;
  marketValueSf: BigNumber;
  borrowFactorAdjustedMarketValueSf: BigNumber;
  padding2: BigNumber[];
};

export const obligationLiquidityStruct = new BeetStruct<ObligationLiquidity>(
  [
    ['borrowReserve', publicKey],
    ['cumulativeBorrowRateBsf', bigFractionBytesStruct],
    ['padding', u64],
    ['borrowedAmountSf', u128],
    ['marketValueSf', u128],
    ['borrowFactorAdjustedMarketValueSf', u128],
    ['padding2', uniformFixedSizeArray(u64, 8)],
  ],
  (args) => args as ObligationLiquidity
);

export type ObligationCollateral = {
  depositReserve: PublicKey;
  depositedAmount: BigNumber;
  marketValueSf: BigNumber;
  padding: BigNumber[];
};

export const obligationCollateralStruct = new BeetStruct<ObligationCollateral>(
  [
    ['depositReserve', publicKey],
    ['depositedAmount', u64],
    ['marketValueSf', u128],
    ['padding', uniformFixedSizeArray(u64, 10)],
  ],
  (args) => args as ObligationCollateral
);

export type LastUpdate = {
  slot: BigNumber;
  stale: number;
  placeholder: number[];
};

export const lastUpdateStruct = new BeetStruct<LastUpdate>(
  [
    ['slot', u64],
    ['stale', u8],
    ['placeholder', uniformFixedSizeArray(u8, 7)],
  ],
  (args) => args as LastUpdate
);
export type Obligation = {
  tag: BigNumber;
  lastUpdate: LastUpdate;
  lendingMarket: PublicKey;
  owner: PublicKey;
  deposits: ObligationCollateral[];
  lowestReserveDepositLtv: BigNumber;
  depositedValueSf: BigNumber;
  borrows: ObligationLiquidity[];
  borrowFactorAdjustedDebtValueSf: BigNumber;
  borrowedAssetsMarketValueSf: BigNumber;
  allowedBorrowValueSf: BigNumber;
  unhealthyBorrowValueSf: BigNumber;
  depositsAssetTiers: number[];
  borrowsAssetTiers: number[];
  elevationGroup: number;
  reserved: number;
  referrer: PublicKey;
  padding3: BigNumber[];
};

export const obligationStruct = new BeetStruct<Obligation>(
  [
    ['tag', u64],
    ['lastUpdate', lastUpdateStruct],
    ['lendingMarket', publicKey],
    ['owner', publicKey],
    ['deposits', uniformFixedSizeArray(obligationCollateralStruct, 8)],
    ['lowestReserveDepositLtv', u64],
    ['depositedValueSf', u128],
    ['borrows', uniformFixedSizeArray(obligationLiquidityStruct, 5)],
    ['borrowFactorAdjustedDebtValueSf', u128],
    ['borrowedAssetsMarketValueSf', u128],
    ['allowedBorrowValueSf', u128],
    ['unhealthyBorrowValueSf', u128],
    ['depositsAssetTiers', uniformFixedSizeArray(u8, 8)],
    ['borrowsAssetTiers', uniformFixedSizeArray(u8, 5)],
    ['elevationGroup', u8],
    ['reserved', uniformFixedSizeArray(u8, 2)],
    ['referrer', publicKey],
    ['padding3', uniformFixedSizeArray(u64, 128)],
  ],
  (args) => args as Obligation
);
