import { BeetStruct, u8, u32 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../utils/solana';

// BondPool Type and Struct
export type BondPool = {
  owner: PublicKey;
  bondedMint: PublicKey;
  bondMintAuthorityBump: number;
  targetMint: PublicKey;
  vault: PublicKey;
  vaultAuthorityBump: number;
  vestingSeconds: number;
};

export const bondPoolStruct = new BeetStruct<BondPool>(
  [
    ['owner', publicKey],
    ['bondedMint', publicKey],
    ['bondMintAuthorityBump', u8],
    ['targetMint', publicKey],
    ['vault', publicKey],
    ['vaultAuthorityBump', u8],
    ['vestingSeconds', u32],
  ],
  (args) => args as BondPool
);

// Vesting Type and Struct
export type Vesting = {
  buffer: Buffer;
  user: PublicKey;
  bondPool: PublicKey;
  start: BigNumber;
  claimed: BigNumber;
  seed: number;
  bump: number;
  holdingBump: number;
  amount: BigNumber;
  padding: Buffer;
};

export const vestingStruct = new BeetStruct<Vesting>(
  [
    ['buffer', blob(8)],
    ['user', publicKey],
    ['bondPool', publicKey],
    ['start', i64],
    ['claimed', u64],
    ['seed', u8],
    ['bump', u8],
    ['holdingBump', u8],
    ['amount', u64],
    ['padding', blob(5)],
  ],
  (args) => args as Vesting
);
