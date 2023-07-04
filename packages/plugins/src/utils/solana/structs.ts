import { BeetStruct, u32, u8, bool } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import { BigNumber } from 'bignumber.js';
import { u64 } from './beets/numbers';

export type MintAccount = {
  readonly mintAuthorityOption: number;
  readonly mintAuthority: PublicKey;
  readonly supply: BigNumber;
  readonly decimals: number;
  readonly initialized: boolean;
  readonly freezeAuthorityOption: number;
  readonly freezeAuthority: PublicKey;
};

export const mintAccountStruct = new BeetStruct<MintAccount>(
  [
    ['mintAuthorityOption', u32],
    ['mintAuthority', publicKey],
    ['supply', u64],
    ['decimals', u8],
    ['initialized', bool],
    ['freezeAuthorityOption', u32],
    ['freezeAuthority', publicKey],
  ],
  (args) => args as MintAccount,
  'MintAccount'
);

export enum AccountState {
  Uninitialized = 0,
  Initialized = 1,
  Frozen = 2,
}

export type TokenAccount = {
  readonly mint: PublicKey;
  readonly owner: PublicKey;
  readonly amount: BigNumber;
  readonly delegateOption: number;
  readonly delegate: PublicKey;
  readonly state: AccountState;
  readonly isNativeOption: number;
  readonly isNative: BigNumber;
  readonly delegatedAmount: BigNumber;
  readonly closeAuthorityOption: number;
  readonly closeAuthority: PublicKey;
};

export const tokenAccountStruct = new BeetStruct<TokenAccount>(
  [
    ['mint', publicKey],
    ['owner', publicKey],
    ['amount', u64],
    ['delegateOption', u32],
    ['delegate', publicKey],
    ['state', u8],
    ['isNativeOption', u32],
    ['isNative', u64],
    ['delegatedAmount', u64],
    ['closeAuthorityOption', u32],
    ['closeAuthority', publicKey],
  ],
  (args) => args as TokenAccount,
  'TokenAccount'
);
