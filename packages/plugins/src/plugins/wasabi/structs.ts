import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { i64, u64 } from '../../utils/solana';

export type LpVault = {
  discriminator: number[];
  bump: number;
  asset: PublicKey;
  vault: PublicKey;
  sharesMint: PublicKey;
  totalAssets: BigNumber;
  maxBorrow: BigNumber;
  totalBorrowed: BigNumber;
};

export const lpVaultStruct = new BeetStruct<LpVault>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['bump', u8],
    ['asset', publicKey],
    ['vault', publicKey],
    ['sharesMint', publicKey],
    ['totalAssets', u64],
    ['maxBorrow', u64],
    ['totalBorrowed', u64],
  ],
  (args) => args as LpVault
);

export type Position = {
  discriminator: number[];
  trader: PublicKey;
  currency: PublicKey;
  collateral: PublicKey;
  lastFundingTimestamp: BigNumber;
  downPayment: BigNumber;
  principal: BigNumber;
  collateralAmount: BigNumber;
  feesToBePaid: BigNumber;
  collateralVault: PublicKey;
  lpVault: PublicKey;
};

export const positionStruct = new BeetStruct<Position>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['trader', publicKey],
    ['currency', publicKey],
    ['collateral', publicKey],
    ['lastFundingTimestamp', i64],
    ['downPayment', u64],
    ['principal', u64],
    ['collateralAmount', u64],
    ['feesToBePaid', u64],
    ['collateralVault', publicKey],
    ['lpVault', publicKey],
  ],
  (args) => args as Position
);
