import { BeetStruct, bool, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { blob, i64, u64 } from '../../../utils/solana';

export type ValueAverage = {
  buffer: Buffer;
  isStale: boolean;
  idx: BigNumber;
  bump: number;
  user: PublicKey;
  inputMint: PublicKey;
  outputMint: PublicKey;
  incrementUsdcValue: BigNumber;
  orderInterval: BigNumber;
  inputVault: PublicKey;
  outputVault: PublicKey;
  autoWithdraw: boolean;
  feeDataAccount: PublicKey;
  referralFeeAccount: PublicKey;
  createdAt: BigNumber;
  inDeposited: BigNumber;
  inLeft: BigNumber;
  inUsed: BigNumber;
  inWithdrawn: BigNumber;
  outReceived: BigNumber;
  outWithdrawn: BigNumber;
  supposedUsdcValue: BigNumber;
  nextOrderAt: BigNumber;
  outBalanceBeforeSwap: BigNumber;
};

export const valueAverageStruct = new BeetStruct<ValueAverage>(
  [
    ['buffer', blob(8)], // 8
    ['isStale', bool], // 1
    ['idx', u64], // 8
    ['bump', u8], // 1
    ['user', publicKey],
    ['inputMint', publicKey],
    ['outputMint', publicKey],
    ['incrementUsdcValue', u64],
    ['orderInterval', i64],
    ['inputVault', publicKey],
    ['outputVault', publicKey],
    ['autoWithdraw', bool],
    ['feeDataAccount', publicKey],
    ['referralFeeAccount', publicKey],
    ['createdAt', i64],
    ['inDeposited', u64],
    ['inLeft', u64],
    ['inUsed', u64],
    ['inWithdrawn', u64],
    ['outReceived', u64],
    ['outWithdrawn', u64],
    ['supposedUsdcValue', u64],
    ['nextOrderAt', i64],
    ['outBalanceBeforeSwap', u64],
  ],
  (args) => args as ValueAverage
);
