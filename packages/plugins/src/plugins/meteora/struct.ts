import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { PublicKey } from '@metaplex-foundation/js';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, u64 } from '../../utils/solana';

export type VaultBumps = {
  vaultBump: number;
  tokenVaultBump: number;
};
export const vaultBumpsStruct = new BeetStruct<VaultBumps>(
  [
    ['vaultBump', u8],
    ['tokenVaultBump', u8],
  ],
  (args) => args as VaultBumps
);

export type LockedProfitTracker = {
  lastUpdatedLockedProfit: BigNumber;
  lastReport: BigNumber;
  lockedProfitDegradation: BigNumber;
};
export const lockedProfitTrackerStruct = new BeetStruct<LockedProfitTracker>(
  [
    ['lastUpdatedLockedProfit', u64],
    ['lastReport', u64],
    ['lockedProfitDegradation', u64],
  ],
  (args) => args as LockedProfitTracker
);

export type Vault = {
  buffer: Buffer;
  /// The flag, if admin set enable = false, then the user can only withdraw and cannot deposit in the vault.
  enabled: number;
  /// Vault nonce, to create vault seeds
  bumps: VaultBumps;
  /// The total liquidity of the vault, including remaining tokens in token_vault and the liquidity in all strategies.
  total_amount: BigNumber;
  /// Token account, hold liquidity in vault reserve
  token_vault: PublicKey;
  /// Hold lp token of vault, each time rebalance crank is called, vault calculate performance fee and mint corresponding lp token amount to fee_vault. fee_vault is owned by treasury address
  fee_vault: PublicKey;
  /// Token mint that vault supports
  token_mint: PublicKey;
  /// Lp mint of vault
  lp_mint: PublicKey;
  /// The list of strategy addresses that vault supports, vault can support up to MAX_STRATEGY strategies at the same time.
  strategies: PublicKey[];
  /// The base address to create vault seeds
  base: PublicKey;
  /// Admin of vault
  admin: PublicKey;
  /// Person who can send the crank. Operator can only send liquidity to strategies that admin defined, and claim reward to account of treasury address
  operator: PublicKey;
  /// Stores information for locked profit.
  locked_profit_tracker: LockedProfitTracker;
};

export const vaultStruct = new BeetStruct<Vault>(
  [
    ['buffer', blob(8)],
    ['enabled', u8],
    ['bumps', vaultBumpsStruct],
    ['total_amount', u64],
    ['token_vault', publicKey],
    ['fee_vault', publicKey],
    ['token_mint', publicKey],
    ['lp_mint', publicKey],
    ['strategies', uniformFixedSizeArray(publicKey, 30)],
    ['base', publicKey],
    ['admin', publicKey],
    ['operator', publicKey],
    ['locked_profit_tracker', lockedProfitTrackerStruct],
  ],
  (args) => args as Vault
);
