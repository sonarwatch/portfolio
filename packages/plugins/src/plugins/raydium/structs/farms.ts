import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { blob, u128, u64 } from '../../../utils/solana';

export type FarmAccount = {
  state: BigNumber;
  nonce: BigNumber;
  owner: PublicKey;
  poolLpTokenAccount: PublicKey;
  lastBlock: BigNumber;
  poolRewardTokenAccount: PublicKey;
  totalReward: BigNumber;
  perBlock: BigNumber;
  perShare: BigNumber;
  poolRewardTokenAccountB?: PublicKey;
  totalRewardB?: BigNumber;
  perBlockB?: BigNumber;
  perShareB?: BigNumber;
};

export type FarmAccountV3 = FarmAccount & {
  feeOwner: PublicKey;
  feeY: BigNumber;
  feeX: BigNumber;
};

export const farmAccountV3Struct = new BeetStruct<FarmAccountV3>(
  [
    ['state', u64],
    ['nonce', u64],
    ['poolLpTokenAccount', publicKey],
    ['poolRewardTokenAccount', publicKey],
    ['owner', publicKey],
    ['feeOwner', publicKey],
    ['feeY', u64],
    ['feeX', u64],
    ['totalReward', u64],
    ['perShare', u128],
    ['lastBlock', u64],
    ['perBlock', u64],
  ],
  (args) => args as FarmAccountV3
);

export type FarmAccountV4 = FarmAccount & {
  option: number;
  unknown: Buffer;
  poolRewardTokenAccountB: PublicKey;
  totalRewardB: BigNumber;
  perShareB: BigNumber;
  perBlockB: BigNumber;
};

export const farmAccountV4Struct = new BeetStruct<FarmAccountV4>(
  [
    ['state', u64],
    ['nonce', u64],
    ['poolLpTokenAccount', publicKey],
    ['poolRewardTokenAccount', publicKey],
    ['totalReward', u64],
    ['perShare', u128],
    ['perBlock', u64],
    ['option', u8],
    ['poolRewardTokenAccountB', publicKey],
    ['unknown', blob(7)],
    ['totalRewardB', u64],
    ['perShareB', u128],
    ['perBlockB', u64],
    ['lastBlock', u64],
    ['owner', publicKey],
  ],
  (args) => args as FarmAccountV4
);

export type FarmAccountV5 = FarmAccountV4;
export const farmAccountV5Struct = farmAccountV4Struct;

export type FarmAccountV6RewardInfo = {
  rewardState: BigNumber;
  rewardOpenTime: BigNumber;
  rewardEndTime: BigNumber;
  rewardLastUpdateTime: BigNumber;
  totalReward: BigNumber;
  totalRewardEmissioned: BigNumber;
  rewardClaimed: BigNumber;
  rewardPerSecond: BigNumber;
  accRewardPerShare: BigNumber;
  rewardVault: PublicKey;
  rewardMint: PublicKey;
  rewardSender: PublicKey;
  padding: BigNumber[];
};

export const farmAccountV6RewardInfoStruct =
  new BeetStruct<FarmAccountV6RewardInfo>(
    [
      ['rewardState', u64],
      ['rewardOpenTime', u64],
      ['rewardEndTime', u64],
      ['rewardLastUpdateTime', u64],
      ['totalReward', u64],
      ['totalRewardEmissioned', u64],
      ['rewardClaimed', u64],
      ['rewardPerSecond', u64],
      ['accRewardPerShare', u128],
      ['rewardVault', publicKey],
      ['rewardMint', publicKey],
      ['rewardSender', publicKey],
      ['padding', uniformFixedSizeArray(u64, 16)],
    ],
    (args) => args as FarmAccountV6RewardInfo
  );

export type FarmAccountV6 = {
  padding_1: BigNumber;
  state: BigNumber;
  nonce: BigNumber;
  validRewardTokenNum: BigNumber;
  rewardMultiplier: BigNumber;
  rewardPeriodMax: BigNumber;
  rewardPeriodMin: BigNumber;
  rewardPeriodExtend: BigNumber;
  lpMint: PublicKey;
  lpVault: PublicKey;
  rewardInfos: FarmAccountV6RewardInfo[];
  creator: PublicKey;
  padding_2: PublicKey;
  padding_3: BigNumber[];
};

export const farmAccountV6Struct = new BeetStruct<FarmAccountV6>(
  [
    ['padding_1', u64],
    ['state', u64],
    ['nonce', u64],
    ['validRewardTokenNum', u64],
    ['rewardMultiplier', u128],
    ['rewardPeriodMax', u64],
    ['rewardPeriodMin', u64],
    ['rewardPeriodExtend', u64],
    ['lpMint', publicKey],
    ['lpVault', publicKey],
    ['rewardInfos', uniformFixedSizeArray(farmAccountV6RewardInfoStruct, 5)],
    ['creator', publicKey],
    ['padding_2', publicKey],
    ['padding_3', uniformFixedSizeArray(u64, 32)],
  ],
  (args) => args as FarmAccountV6
);

export type UserFarmAccount = {
  state: BigNumber;
  poolId: PublicKey;
  stakerOwner: PublicKey;
  depositBalance: BigNumber;
  rewardDebt: BigNumber;
  rewardDebtB?: BigNumber;
};

export type UserFarmAccountV3 = {
  state: BigNumber;
  poolId: PublicKey;
  stakerOwner: PublicKey;
  depositBalance: BigNumber;
  rewardDebt: BigNumber;
};

export const userFarmAccountV3Struct = new BeetStruct<UserFarmAccountV3>(
  [
    ['state', u64],
    ['poolId', publicKey],
    ['stakerOwner', publicKey],
    ['depositBalance', u64],
    ['rewardDebt', u64],
  ],
  (args) => args as UserFarmAccountV3
);

export type UserFarmAccountV4 = {
  state: BigNumber;
  poolId: PublicKey;
  stakerOwner: PublicKey;
  depositBalance: BigNumber;
  rewardDebt: BigNumber;
  rewardDebtB: BigNumber;
};

export const userFarmAccountV4Struct = new BeetStruct<UserFarmAccountV4>(
  [
    ['state', u64],
    ['poolId', publicKey],
    ['stakerOwner', publicKey],
    ['depositBalance', u64],
    ['rewardDebt', u64],
    ['rewardDebtB', u64],
  ],
  (args) => args as UserFarmAccountV4
);

export type UserFarmAccountV5 = {
  state: BigNumber;
  poolId: PublicKey;
  stakerOwner: PublicKey;
  depositBalance: BigNumber;
  rewardDebt: BigNumber;
  rewardDebtB: BigNumber;
  padding: BigNumber[];
};

export const userFarmAccountV5Struct = new BeetStruct<UserFarmAccountV5>(
  [
    ['state', u64],
    ['poolId', publicKey],
    ['stakerOwner', publicKey],
    ['depositBalance', u64],
    ['rewardDebt', u128],
    ['rewardDebtB', u128],
    ['padding', uniformFixedSizeArray(u64, 17)],
  ],
  (args) => args as UserFarmAccountV5
);

export type UserFarmAccountV31 = {
  state: BigNumber;
  poolId: PublicKey;
  stakerOwner: PublicKey;
  depositBalance: BigNumber;
  rewardDebt: BigNumber;
  padding: BigNumber[];
};

export const userFarmAccountV31Struct = new BeetStruct<UserFarmAccountV31>(
  [
    ['state', u64],
    ['poolId', publicKey],
    ['stakerOwner', publicKey],
    ['depositBalance', u64],
    ['rewardDebt', u128],
    ['padding', uniformFixedSizeArray(u64, 17)],
  ],
  (args) => args as UserFarmAccountV31
);

export type UserFarmAccountV61 = {
  padding_1: BigNumber;
  state: BigNumber;
  id: PublicKey;
  owner: PublicKey;
  deposited: BigNumber;
  rewardDebts: BigNumber[];
  padding_2: BigNumber[];
};

export const userFarmAccountV61Struct = new BeetStruct<UserFarmAccountV61>(
  [
    ['padding_1', u64],
    ['state', u64],
    ['id', publicKey],
    ['owner', publicKey],
    ['deposited', u64],
    ['rewardDebts', uniformFixedSizeArray(u128, 5)],
    ['padding_2', uniformFixedSizeArray(u64, 16)],
  ],
  (args) => args as UserFarmAccountV61
);
