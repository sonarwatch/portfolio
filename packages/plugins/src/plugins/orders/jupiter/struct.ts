import { BeetStruct, bool, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../../utils/solana';

export type LimitOrder = {
  buffer: Buffer;
  maker: PublicKey;
  inputMint: PublicKey;
  outputMint: PublicKey;
  waiting: boolean;
  oriMakingAmount: BigNumber;
  oriTakingAmount: BigNumber;
  makingAmount: BigNumber;
  takingAmount: BigNumber;
  makerInputAccount: PublicKey;
  makerOutputAccount: PublicKey;
  reserve: PublicKey;
  uid: BigNumber;
  expiredAt: BigNumber;
  referral: PublicKey;
};

export const limitOrderStruct = new BeetStruct<LimitOrder>(
  [
    ['buffer', blob(8)],
    ['maker', publicKey],
    ['inputMint', publicKey],
    ['outputMint', publicKey],
    ['waiting', bool],
    ['oriMakingAmount', u64],
    ['oriTakingAmount', u64],
    ['makingAmount', u64],
    ['takingAmount', u64],
    ['makerInputAccount', publicKey],
    ['makerOutputAccount', publicKey],
    ['reserve', publicKey],
    ['uid', u64],
    ['expiredAt', i64],
    ['referral', publicKey],
  ],
  (args) => args as LimitOrder
);

export type DCA = {
  buffer: Buffer;
  user: PublicKey;
  inputMint: PublicKey;
  outputMint: PublicKey;
  idx: BigNumber;
  nextCycleAt: BigNumber;
  inDeposited: BigNumber;
  inWithdrawn: BigNumber;
  outWithdrawn: BigNumber;
  inUsed: BigNumber;
  outReceived: BigNumber;
  inAmountPerCycle: BigNumber;
  cycleFrequency: BigNumber;
  nextCycleAmountLeft: BigNumber;
  inAccount: PublicKey;
  outAccount: PublicKey;
  minOutAmount: BigNumber;
  maxOutAmount: BigNumber;
  keeperInBalanceBeforeBorrow: BigNumber;
  dcaOutBalanceBeforeSwap: BigNumber;
  createdAt: BigNumber;
  bump: number;
};

export const dcaStruct = new BeetStruct<DCA>(
  [
    ['buffer', blob(8)],
    ['user', publicKey],
    ['inputMint', publicKey],
    ['outputMint', publicKey],
    ['idx', u64],
    ['nextCycleAt', i64],
    ['inDeposited', u64],
    ['inWithdrawn', u64],
    ['outWithdrawn', u64],
    ['inUsed', u64],
    ['outReceived', u64],
    ['inAmountPerCycle', u64],
    ['cycleFrequency', i64],
    ['nextCycleAmountLeft', u64],
    ['inAccount', publicKey],
    ['outAccount', publicKey],
    ['minOutAmount', u64],
    ['maxOutAmount', u64],
    ['keeperInBalanceBeforeBorrow', u64],
    ['dcaOutBalanceBeforeSwap', u64],
    ['createdAt', i64],
    ['bump', u8],
  ],
  (args) => args as DCA
);
