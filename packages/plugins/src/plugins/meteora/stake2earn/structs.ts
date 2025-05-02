import { PublicKey } from '@solana/web3.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import BigNumber from 'bignumber.js';
import { blob, i64, u128, u64 } from '../../../utils/solana';

export type StakeEscrow = {
  buffer: Buffer;
  owner: PublicKey;
  vault: PublicKey;
  fullBalanceIndex: BigNumber;
  stakeAmount: BigNumber;
  inTopList: number;
  padding0: number[];
  ongoingTotalPartialUnstakeAmount: BigNumber;
  createdAt: BigNumber;
  feeAClaimedAmount: BigNumber;
  feeBClaimedAmount: BigNumber;
  feeAPerLiquidityCheckpoint: BigNumber;
  feeBPerLiquidityCheckpoint: BigNumber;
  feeAPending: BigNumber;
  feeBPending: BigNumber;
};

export const stakeEscrowStruct = new BeetStruct<StakeEscrow>(
  [
    ['buffer', blob(8)],
    ['owner', publicKey],
    ['vault', publicKey],
    ['fullBalanceIndex', u64],
    ['stakeAmount', u64],
    ['inTopList', u8],
    ['padding0', uniformFixedSizeArray(u8, 15)],
    ['ongoingTotalPartialUnstakeAmount', u64],
    ['createdAt', i64],
    ['feeAClaimedAmount', u128],
    ['feeBClaimedAmount', u128],
    ['feeAPerLiquidityCheckpoint', u128],
    ['feeBPerLiquidityCheckpoint', u128],
    ['feeAPending', u64],
    ['feeBPending', u64],
  ],
  (args) => args as StakeEscrow
);

export type Unstake = {
  buffer: Buffer;
  stakeEscrow: PublicKey;
  unstakeAmount: BigNumber;
  createdAt: BigNumber;
  releaseAt: BigNumber;
};

export const unstakeStruct = new BeetStruct<Unstake>(
  [
    ['buffer', blob(8)],
    ['stakeEscrow', publicKey],
    ['unstakeAmount', u64],
    ['createdAt', i64],
    ['releaseAt', i64],
  ],
  (args) => args as Unstake
);

export type FeeVault = {
  buffer: Buffer;
  lockEscrow: PublicKey;
  stakeMint: PublicKey;
  quoteMint: PublicKey;
  pool: PublicKey;
  stakeTokenVault: PublicKey;
  quoteTokenVault: PublicKey;
  topStakerList: PublicKey;
  fullBalanceList: PublicKey;
};

export const feeVaultStruct = new BeetStruct<FeeVault>(
  [
    ['buffer', blob(8)],
    ['lockEscrow', publicKey],
    ['stakeMint', publicKey],
    ['quoteMint', publicKey],
    ['pool', publicKey],
    ['stakeTokenVault', publicKey],
    ['quoteTokenVault', publicKey],
    ['topStakerList', publicKey],
    ['fullBalanceList', publicKey],
  ],
  (args) => args as FeeVault
);
