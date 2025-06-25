import {
  BeetStruct,
  u16,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../utils/solana';

export type LockUp = {
  buffer: Buffer;
  ns: PublicKey;
  owner: PublicKey;
  amount: BigNumber;
  startTs: BigNumber;
  endTs: BigNumber;
  targetRewardsPct: number;
  targetVotingPct: number;
  padding: number[];
};

export const lockUpStruct = new BeetStruct<LockUp>(
  [
    ['buffer', blob(8)],
    ['ns', publicKey],
    ['owner', publicKey],
    ['amount', u64],
    ['startTs', i64],
    ['endTs', i64],
    ['targetRewardsPct', u16],
    ['targetVotingPct', u16],
    ['padding', uniformFixedSizeArray(u8, 240)],
  ],
  (args) => args as LockUp
);

// Underlying Allowlist struct
export type Allowlist = {
  kind: number;
  value: PublicKey;
};

export const allowlistStruct = new BeetStruct<Allowlist>(
  [
    ['kind', u8],
    ['value', publicKey],
  ],
  (args) => args as Allowlist
);

// Pool struct
export type Pool = {
  discriminator: number[];
  spotPrice: BigNumber;
  curveType: number;
  curveDelta: BigNumber;
  reinvestFulfillBuy: boolean;
  reinvestFulfillSell: boolean;
  expiry: BigNumber;
  lpFeeBp: number;
  referral: PublicKey;
  referralBp: number;
  buysideCreatorRoyaltyBp: number;
  cosignerAnnotation: number[];
  sellsideAssetAmount: BigNumber;
  lpFeeEarned: BigNumber;
  owner: PublicKey;
  cosigner: PublicKey;
  uuid: PublicKey;
  paymentMint: PublicKey;
  allowlists: Allowlist[];
  buysidePaymentAmount: BigNumber;
  sharedEscrowAccount: PublicKey;
  sharedEscrowCount: BigNumber;
};

export const poolStruct = new BeetStruct<Pool>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['spotPrice', u64],
    ['curveType', u8],
    ['curveDelta', u64],
    ['reinvestFulfillBuy', u8], // bool as u8
    ['reinvestFulfillSell', u8], // bool as u8
    ['expiry', i64],
    ['lpFeeBp', u16],
    ['referral', publicKey],
    ['referralBp', u16],
    ['buysideCreatorRoyaltyBp', u16],
    ['cosignerAnnotation', uniformFixedSizeArray(u8, 32)],
    ['sellsideAssetAmount', u64],
    ['lpFeeEarned', u64],
    ['owner', publicKey],
    ['cosigner', publicKey],
    ['uuid', publicKey],
    ['paymentMint', publicKey],
    ['allowlists', uniformFixedSizeArray(allowlistStruct, 6)],
    ['buysidePaymentAmount', u64],
    ['sharedEscrowAccount', publicKey],
    ['sharedEscrowCount', u64],
  ],
  (args) => args as Pool
);

export type DistributionClaim = {
  discriminator: number[];
  ns: PublicKey;
  distribution: PublicKey;
  claimant: PublicKey;
  distributionTokenMint: PublicKey;
  amount: BigNumber;
  cosignedMsg: number[];
  padding: number[];
};

export const distributionClaimStruct = new BeetStruct<DistributionClaim>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['ns', publicKey],
    ['distribution', publicKey],
    ['claimant', publicKey],
    ['distributionTokenMint', publicKey],
    ['amount', u64],
    ['cosignedMsg', uniformFixedSizeArray(u8, 32)],
    ['padding', uniformFixedSizeArray(u8, 240)],
  ],
  (args) => args as DistributionClaim
);
