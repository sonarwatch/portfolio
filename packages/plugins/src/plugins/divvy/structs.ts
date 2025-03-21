import {
  bool,
  FixableBeetStruct,
  u16,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { u64 } from '../../utils/solana';

export type House = {
  accountDiscriminator: number[];
  admin: PublicKey;
  foreman: PublicKey;
  beneficiary: PublicKey;
  houseMint: PublicKey;
  currency: PublicKey;
  currencyDecimals: number;
  beneficiaryFeeBps: number;
  dvypassFeeBps: number;
  maxUtilizationBps: number;
  houseTokenSupply: BigNumber;
  liquidity: BigNumber;
  maxPayoutAmount: BigNumber;
  betAmount: BigNumber;
  activeSlips: BigNumber;
  authorityBump: number;
  paused: boolean;
  beneficiaryLiquidity: BigNumber;
  dvypassLiquidity: BigNumber;
  dvypassRewardRemaining: BigNumber;
  dvypassRewardPerStake: BigNumber;
  dvypassTotalStake: number;
  dvypassNextTotalStake: number;
  dvypassCollection: PublicKey | null;
  utilizedAmount: BigNumber;
};

export const houseStruct = new FixableBeetStruct<House>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['admin', publicKey],
    ['foreman', publicKey],
    ['beneficiary', publicKey],
    ['houseMint', publicKey],
    ['currency', publicKey],
    ['currencyDecimals', u8],
    ['beneficiaryFeeBps', u16],
    ['dvypassFeeBps', u16],
    ['maxUtilizationBps', u16],
    ['houseTokenSupply', u64],
    ['liquidity', u64],
    ['maxPayoutAmount', u64],
    ['betAmount', u64],
    ['activeSlips', u64],
    ['authorityBump', u8],
    ['paused', bool],
    ['beneficiaryLiquidity', u64],
    ['dvypassLiquidity', u64],
    ['dvypassRewardRemaining', u64],
    ['dvypassRewardPerStake', u64],
    ['dvypassTotalStake', u16],
    ['dvypassNextTotalStake', u16],
    ['dvypassCollection', publicKey],
    ['utilizedAmount', u64],
  ],
  (args) => args as House
);

export enum PositionStatus {
  Deposit = 0,
  Withdraw = 1,
}

export type Position = {
  accountDiscriminator: number[];
  house: PublicKey;
  user: PublicKey;
  amount: BigNumber;
  minAmountOut: BigNumber;
  createdTs: number;
  status: PositionStatus;
};

export const positionStruct = new FixableBeetStruct<Position>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['house', publicKey],
    ['user', publicKey],
    ['amount', u64],
    ['minAmountOut', u64],
    ['createdTs', u32],
    ['status', u8],
  ],
  (args) => args as Position
);

export type Miner = {
  accountDiscriminator: number[];
  isBoosted: boolean;
  rewarder: PublicKey;
  authority: PublicKey;
  amount: BigNumber;
  rewards: BigNumber;
  revshares: number;
};

export const minerStruct = new FixableBeetStruct<Miner>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['isBoosted', bool],
    ['rewarder', publicKey],
    ['authority', publicKey],
    ['amount', u64],
    ['rewards', u64],
    ['revshares', u8],
  ],
  (args) => args as Miner
);
