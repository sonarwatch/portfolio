import {
  BeetStruct,
  bool,
  u16,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, u64 } from '../../utils/solana';

export type ClaimStatus = {
  buffer: Buffer;
  claimant: PublicKey;
  lockedAmount: BigNumber;
  lockedAmountWithdrawn: BigNumber;
  unlockedAmount: BigNumber;
};

export const claimStatusStruct = new BeetStruct<ClaimStatus>(
  [
    ['buffer', blob(8)],
    ['claimant', publicKey],
    ['lockedAmount', u64],
    ['lockedAmountWithdrawn', u64],
    ['unlockedAmount', u64],
  ],
  (args) => args as ClaimStatus
);

export type VaultNcnTicket = {
  buffer: Buffer;
  vault: PublicKey;
  staker: PublicKey;
  base: PublicKey;
  vrtAmount: BigNumber;
  slotUnstaked: BigNumber;
  bump: number;
  reserved: number[];
};

export const vaultNcnTicketStruct = new BeetStruct<VaultNcnTicket>(
  [
    ['buffer', blob(8)],
    ['vault', publicKey],
    ['staker', publicKey],
    ['base', publicKey],
    ['vrtAmount', u64],
    ['slotUnstaked', u64],
    ['bump', u8],
    ['reserved', uniformFixedSizeArray(u8, 263)],
  ],
  (args) => args as VaultNcnTicket
);

export type DelegationState = {
  stakedAmount: BigNumber;
  enqueuedForCooldownAmount: BigNumber;
  coolingDownAmount: BigNumber;
  reserved: number[];
};

export const delegationStateStruct = new BeetStruct<DelegationState>(
  [
    ['stakedAmount', u64],
    ['enqueuedForCooldownAmount', u64],
    ['coolingDownAmount', u64],
    ['reserved', uniformFixedSizeArray(u8, 256)],
  ],
  (args) => args as DelegationState
);

export type Vault = {
  buffer: Buffer;
  base: PublicKey;
  vrtMint: PublicKey;
  supportedMint: PublicKey;
  vrtSupply: BigNumber;
  tokensDeposited: BigNumber;
  depositCapacity: BigNumber;
  delegationState: DelegationState;
  additionalAssetsNeedUnstaking: BigNumber;
  vrtEnqueuedForCooldownAmount: BigNumber;
  vrtCoolingDownAmount: BigNumber;
  vrtReadyToClaimAmount: BigNumber;
  admin: PublicKey;
  delegationAdmin: PublicKey;
  operatorAdmin: PublicKey;
  ncnAdmin: PublicKey;
  slasherAdmin: PublicKey;
  capacityAdmin: PublicKey;
  feeAdmin: PublicKey;
  delegateAssetAdmin: PublicKey;
  feeWallet: PublicKey;
  mintBurnAdmin: PublicKey;
  metadataAdmin: PublicKey;
  vaultIndex: BigNumber;
  ncnCount: BigNumber;
  operatorCount: BigNumber;
  slasherCount: BigNumber;
  lastFeeChangeSlot: BigNumber;
  lastFullStateUpdateSlot: BigNumber;
  depositFeeBps: number;
  withdrawalFeeBps: number;
  nextWithdrawalFeeBps: number;
  rewardFeeBps: number;
  programFeeBps: number;
  bump: number;
  isPaused: boolean;
  reserved: number[];
};

export const vaultStruct = new BeetStruct<Vault>(
  [
    ['buffer', blob(8)],
    ['base', publicKey],
    ['vrtMint', publicKey],
    ['supportedMint', publicKey],
    ['vrtSupply', u64],
    ['tokensDeposited', u64],
    ['depositCapacity', u64],
    ['delegationState', delegationStateStruct],
    ['additionalAssetsNeedUnstaking', u64],
    ['vrtEnqueuedForCooldownAmount', u64],
    ['vrtCoolingDownAmount', u64],
    ['vrtReadyToClaimAmount', u64],
    ['admin', publicKey],
    ['delegationAdmin', publicKey],
    ['operatorAdmin', publicKey],
    ['ncnAdmin', publicKey],
    ['slasherAdmin', publicKey],
    ['capacityAdmin', publicKey],
    ['feeAdmin', publicKey],
    ['delegateAssetAdmin', publicKey],
    ['feeWallet', publicKey],
    ['mintBurnAdmin', publicKey],
    ['metadataAdmin', publicKey],
    ['vaultIndex', u64],
    ['ncnCount', u64],
    ['operatorCount', u64],
    ['slasherCount', u64],
    ['lastFeeChangeSlot', u64],
    ['lastFullStateUpdateSlot', u64],
    ['depositFeeBps', u16],
    ['withdrawalFeeBps', u16],
    ['nextWithdrawalFeeBps', u16],
    ['rewardFeeBps', u16],
    ['programFeeBps', u16],
    ['bump', u8],
    ['isPaused', bool],
    ['reserved', uniformFixedSizeArray(u8, 259)],
  ],
  (args) => args as Vault
);
