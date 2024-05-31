import { BeetStruct, u8 } from '@metaplex-foundation/beet';
import { PublicKey } from '@metaplex-foundation/js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { blob, u128, u64 } from '../../utils/solana';

export enum VaultStatus {
  Active,
  Finalized,
  Reverted,
}

export type ConditionnalVault = {
  buffer: Buffer;
  status: VaultStatus;
  settlementAuthority: PublicKey;
  underlyingTokenMint: PublicKey;
  underlyingTokenAccount: PublicKey;
  conditionalOnFinalizeTokenMint: PublicKey;
  conditionalOnRevertTokenMint: PublicKey;
  pdaBump: number;
  decimals: number;
};

export const conditionnalVaultStruct = new BeetStruct<ConditionnalVault>(
  [
    ['buffer', blob(8)],
    ['status', u8],
    ['settlementAuthority', publicKey],
    ['underlyingTokenMint', publicKey],
    ['underlyingTokenAccount', publicKey],
    ['conditionalOnFinalizeTokenMint', publicKey],
    ['conditionalOnRevertTokenMint', publicKey],
    ['pdaBump', u8],
    ['decimals', u8],
  ],
  (args) => args as ConditionnalVault
);

export type TwapOracle = {
  lastUpdatedSlot: BigNumber;
  lastPrice: BigNumber;
  lastObservation: BigNumber;
  aggregator: BigNumber;
  maxObservationChangePerUpdate: BigNumber;
  initialObservation: BigNumber;
};

export const twapOracleStruct = new BeetStruct<TwapOracle>(
  [
    ['lastUpdatedSlot', u64],
    ['lastPrice', u128],
    ['lastObservation', u128],
    ['aggregator', u128],
    ['maxObservationChangePerUpdate', u128],
    ['initialObservation', u128],
  ],
  (args) => args as TwapOracle
);

export type Amm = {
  buffer: Buffer;
  bump: number;
  createdAtSlot: BigNumber;
  lpMint: PublicKey;
  baseMint: PublicKey;
  quoteMint: PublicKey;
  baseMintDecimals: number;
  quoteMintDecimals: number;
  baseAmount: BigNumber;
  quoteAmount: BigNumber;
  oracle: TwapOracle;
};

export const ammStruct = new BeetStruct<Amm>(
  [
    ['buffer', blob(8)],
    ['bump', u8],
    ['createdAtSlot', u64],
    ['lpMint', publicKey],
    ['baseMint', publicKey],
    ['quoteMint', publicKey],
    ['baseMintDecimals', u8],
    ['quoteMintDecimals', u8],
    ['baseAmount', u64],
    ['quoteAmount', u64],
    ['oracle', twapOracleStruct],
  ],
  (args) => args as Amm
);
