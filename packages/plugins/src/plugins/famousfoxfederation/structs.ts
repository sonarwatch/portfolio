import {
  BeetStruct,
  bool,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { i64, u64 } from '../../utils/solana';

export type Order = {
  accountDiscriminator: number[];
  bump: number;
  mint: PublicKey;
  owner: PublicKey;
  cost: BigNumber;
  count: BigNumber;
  foxy: boolean;
  time: BigNumber;
  expiry: BigNumber;
};

export const orderStruct = new BeetStruct<Order>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['bump', u8],
    ['mint', publicKey],
    ['owner', publicKey],
    ['cost', u64],
    ['count', u64],
    ['foxy', bool],
    ['time', u64],
    ['expiry', u64],
  ],
  (args) => args as Order
);

export type StakingAccount = {
  accountDiscriminator: number[];
  bump: number;
  fox: PublicKey;
  owner: PublicKey;
  lock: BigNumber;
  lastClaim: BigNumber;
  tff: boolean;
  v2: boolean;
};

export const stakingAccountStruct = new BeetStruct<StakingAccount>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['bump', u8],
    ['fox', publicKey],
    ['owner', publicKey],
    ['lock', i64],
    ['lastClaim', i64],
    ['tff', bool],
    ['v2', bool],
  ],
  (args) => args as StakingAccount
);

export type StakingConfig = {
  accountDiscriminator: number[];
  bump: number;
  reward: PublicKey;
  authority: PublicKey;
  amount: BigNumber;
  interval: BigNumber;
  timelock: BigNumber;
  count: BigNumber;
  tcount: BigNumber;
};

export const stakingConfigStruct = new BeetStruct<StakingConfig>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['bump', u8],
    ['reward', publicKey],
    ['authority', publicKey],
    ['amount', i64],
    ['interval', i64],
    ['timelock', i64],
    ['count', u64],
    ['tcount', u64],
  ],
  (args) => args as StakingConfig
);
