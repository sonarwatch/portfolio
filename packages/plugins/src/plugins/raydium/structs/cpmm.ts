import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, u64 } from '../../../utils/solana';

export type PoolState = {
  buffer: Buffer;
  ammConfig: PublicKey;
  poolCreator: PublicKey;
  token0Vault: PublicKey;
  token1Vault: PublicKey;
  lpMint: PublicKey;
  token0Mint: PublicKey;
  token1Mint: PublicKey;
  token0Program: PublicKey;
  token1Program: PublicKey;
  observationKey: PublicKey;
  authBump: number;
  status: number;
  lpMintDecimals: number;
  mint0Decimals: number;
  mint1Decimals: number;
  lpSupply: BigNumber;
  protocolFeesToken0: BigNumber;
  protocolFeesToken1: BigNumber;
  fundFeesToken0: BigNumber;
  fundFeesToken1: BigNumber;
  openTime: BigNumber;
  padding: BigNumber[];
};

export const poolStateStruct = new BeetStruct<PoolState>(
  [
    ['buffer', blob(8)],
    ['ammConfig', publicKey],
    ['poolCreator', publicKey],
    ['token0Vault', publicKey],
    ['token1Vault', publicKey],
    ['lpMint', publicKey],
    ['token0Mint', publicKey],
    ['token1Mint', publicKey],
    ['token0Program', publicKey],
    ['token1Program', publicKey],
    ['observationKey', publicKey],
    ['authBump', u8],
    ['status', u8],
    ['lpMintDecimals', u8],
    ['mint0Decimals', u8],
    ['mint1Decimals', u8],
    ['lpSupply', u64],
    ['protocolFeesToken0', u64],
    ['protocolFeesToken1', u64],
    ['fundFeesToken0', u64],
    ['fundFeesToken1', u64],
    ['openTime', u64],
    ['padding', uniformFixedSizeArray(u64, 32)],
  ],
  (args) => args as PoolState
);
