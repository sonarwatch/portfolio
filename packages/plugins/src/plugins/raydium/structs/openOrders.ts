import {
  BeetStruct,
  bool,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import { blob, u128, u64 } from '../../../utils/solana';

// Serum Open Order might need to be move
export type AccountFlag = {
  initialized: boolean;
  market: boolean;
  openOrders: boolean;
  requestQueue: boolean;
  eventQueue: boolean;
  bids: boolean;
  asks: boolean;
};
export const accountFlagStruct = new BeetStruct<AccountFlag>(
  [
    ['initialized', bool],
    ['market', bool],
    ['openOrders', bool],
    ['requestQueue', bool],
    ['eventQueue', bool],
    ['bids', bool],
    ['asks', bool],
  ],
  (args) => args as AccountFlag
);

export type OpenOrdersV1 = {
  buffer: Buffer;

  accountFlags: AccountFlag;

  market: PublicKey;
  owner: PublicKey;

  baseTokenFree: BigNumber;
  baseTokenTotal: BigNumber;
  quoteTokenFree: BigNumber;
  quoteTokenTotal: BigNumber;

  freeSlotBits: BigNumber;
  isBidBits: BigNumber;

  orders: BigNumber[];
  clientIds: BigNumber[];

  buffer2: Buffer;
};
export const openOrdersV1Struct = new BeetStruct<OpenOrdersV1>(
  [
    ['buffer', blob(5)],

    ['accountFlags', accountFlagStruct],

    ['market', publicKey],
    ['owner', publicKey],

    ['baseTokenFree', u64],
    ['baseTokenTotal', u64],
    ['quoteTokenFree', u64],
    ['quoteTokenTotal', u64],

    ['freeSlotBits', u128],
    ['isBidBits', u128],

    ['orders', uniformFixedSizeArray(u128, 128)],
    ['clientIds', uniformFixedSizeArray(u64, 128)],

    ['buffer2', blob(7)],
  ],
  (args) => args as OpenOrdersV1
);

export type OpenOrdersV2 = {
  buffer: Buffer;

  accountFlags: AccountFlag;

  market: PublicKey;
  owner: PublicKey;

  baseTokenFree: BigNumber;
  baseTokenTotal: BigNumber;
  quoteTokenFree: BigNumber;
  quoteTokenTotal: BigNumber;

  freeSlotBits: BigNumber;
  isBidBits: BigNumber;

  orders: BigNumber[];
  clientIds: BigNumber[];
  referrerRebatesAccrued: BigNumber;
  buffer2: Buffer;
};
export const openOrdersV2Struct = new BeetStruct<OpenOrdersV2>(
  [
    ['buffer', blob(6)],

    ['accountFlags', accountFlagStruct],

    ['market', publicKey],
    ['owner', publicKey],

    ['baseTokenFree', u64],
    ['baseTokenTotal', u64],
    ['quoteTokenFree', u64],
    ['quoteTokenTotal', u64],

    ['freeSlotBits', u128],
    ['isBidBits', u128],

    ['orders', uniformFixedSizeArray(u128, 128)],
    ['clientIds', uniformFixedSizeArray(u64, 128)],

    ['referrerRebatesAccrued', u64],

    ['buffer2', blob(7)],
  ],
  (args) => args as OpenOrdersV2
);
