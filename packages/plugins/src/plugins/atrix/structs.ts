import { BeetStruct, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../utils/solana';

export type Pool = {
  buffer: Buffer;
  coinMint: PublicKey;
  pcMint: PublicKey;
  market: PublicKey;
  openOrders: PublicKey;
  poolCoinAccount: PublicKey;
  poolPcAccount: PublicKey;
  poolLpAccount: PublicKey;
  lpMint: PublicKey;
  firstPlaced: number;
  orderIndex: number;
  coinCurrentProtocolFees: BigNumber;
  pcCurrentProtocolFees: BigNumber;
  ixi: number;
  icx: number;
  clientOrderId: BigNumber;
};

export const poolStruct = new BeetStruct<Pool>(
  [
    ['buffer', blob(8)],
    ['coinMint', publicKey],
    ['pcMint', publicKey],
    ['market', publicKey],
    ['openOrders', publicKey],
    ['poolCoinAccount', publicKey],
    ['poolPcAccount', publicKey],
    ['poolLpAccount', publicKey],
    ['lpMint', publicKey],
    ['firstPlaced', u8],
    ['orderIndex', u8],
    ['coinCurrentProtocolFees', u64],
    ['pcCurrentProtocolFees', u64],
    ['ixi', u8],
    ['icx', u8],
    ['clientOrderId', u64],
  ],
  (args) => args as Pool
);

// export type OtherStruct = {
//   buffer: Buffer;
//   bump: number;
//   owner: PublicKey;
//   account: PublicKey;
//   coinMint: PublicKey;
//   padding1: Buffer;
//   coinAccount: PublicKey;
//   padding2: Buffer;
//   padding: Buffer;
// };

// export const otherStruct = new BeetStruct<OtherStruct>(
//   [
//     ['buffer', blob(8)],
//     ['bump', u8],
//     ['owner', publicKey],
//     ['account', publicKey],
//     ['coinMint', publicKey],
//     ['padding1', blob(9)],
//     ['coinAccount', publicKey],
//     ['padding2', blob(8)],
//     ['padding', blob(170 - 8 - 1 - 3 * 32 - 9 - 32 - 8)],
//   ],
//   (args) => args as OtherStruct
// );

// export type Farm = {
//   buffer: Buffer;
//   bump: number;
//   account: PublicKey;
//   address: PublicKey;
//   coinMint: PublicKey;
//   padding1: Buffer;
//   amount: BigNumber;
//   amount1: BigNumber;
//   coinAccount: PublicKey;
//   padding2: BigNumber;
//   padding3: BigNumber;
//   timestamp: number;
//   padding: number;
// };
// export const farmStruct = new BeetStruct<Farm>(
//   [
//     ['buffer', blob(8)],
//     ['bump', u8],
//     ['account', publicKey],
//     ['address', publicKey],
//     ['coinMint', publicKey],
//     ['padding1', blob(1)],
//     ['amount', u32],
//     ['amount1', u32],
//     ['coinAccount', publicKey],
//     ['padding2', u64],
//     ['padding3', u64],
//     ['timestamp', u32],
//     ['padding', u32],
//   ],
//   (args) => args as Farm
// );

export type Staker = {
  buffer: Buffer;
  bump: number;
  farmAccount: PublicKey;
  authority: BigNumber;
  stakedAmount: BigNumber;
};

export const stakerStruct = new BeetStruct<Staker>(
  [
    ['buffer', blob(8)],
    ['bump', u8],
    ['farmAccount', publicKey],
    ['authority', publicKey],
    ['stakedAmount', u64],
  ],
  (args) => args as Staker
);
