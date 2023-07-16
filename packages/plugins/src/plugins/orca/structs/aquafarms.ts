import { BeetStruct, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { blob, u256, u64 } from '../../../utils/solana';

export type AMMV4Info = {
  isInitialized: number;
  accountType: number;
  globalFarm: PublicKey;
  owner: PublicKey;
  baseTokensConverted: BigNumber;
  cumulativeEmissionsCheckpoint: BigNumber;
};

export const ammV4InfoStruct = new BeetStruct<AMMV4Info>(
  [
    ['isInitialized', u8],
    ['accountType', u8],
    ['globalFarm', publicKey],
    ['owner', publicKey],
    ['baseTokensConverted', u64],
    ['cumulativeEmissionsCheckpoint', u256],
  ],
  (args) => args as AMMV4Info
);

export type UserAquafarm = {
  isInitialized: number;
  accountType: number;
  globalFarm: PublicKey;
  owner: PublicKey;
  baseTokensConverted: BigNumber;
  cumulativeEmissionsCheckpoint: BigNumber;
};

export const userAquafarmStruct = new BeetStruct<UserAquafarm>(
  [
    ['isInitialized', u8],
    ['accountType', u8],
    ['globalFarm', publicKey],
    ['owner', publicKey],
    ['baseTokensConverted', u64],
    ['cumulativeEmissionsCheckpoint', u256],
  ],
  (args) => args as UserAquafarm
);

export type Aquafarm = {
  buffer: Buffer;
  tokenProgramId: PublicKey;
  emissionsAuthority: PublicKey;
  removeRewardsAuthority: PublicKey;
  baseTokenMint: PublicKey;
  baseTokenVault: PublicKey;
  rewardTokenVault: PublicKey;
  farmTokenMint: PublicKey;
  emissionsPerSecondNumerator: BigNumber;
  emissionsPerSecondDenominator: BigNumber;
  lastUpdatedTimestamp: BigNumber;
  cumulativeEmissionsPerFarmToken: BigNumber;
};

export const aquafarmStruct = new BeetStruct<Aquafarm>(
  [
    ['buffer', blob(3)],
    ['tokenProgramId', publicKey],
    ['emissionsAuthority', publicKey],
    ['removeRewardsAuthority', publicKey],
    ['baseTokenMint', publicKey],
    ['baseTokenVault', publicKey],
    ['rewardTokenVault', publicKey],
    ['farmTokenMint', publicKey],
    ['emissionsPerSecondNumerator', u64],
    ['emissionsPerSecondDenominator', u64],
    ['lastUpdatedTimestamp', u64],
    ['cumulativeEmissionsPerFarmToken', u256],
  ],
  (args) => args as Aquafarm
);
