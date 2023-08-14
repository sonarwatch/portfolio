import { BeetStruct, bool } from '@metaplex-foundation/beet';
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
