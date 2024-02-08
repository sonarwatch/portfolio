import {
  BeetStruct,
  bool,
  i8,
  u16,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../../utils/solana';

export enum LockupKind {
  'None',
  'Daily',
  'Monthly',
  'Cliff',
  'Constant',
}

export type Lockup = {
  startTs: BigNumber;
  endTs: BigNumber;
  kind: LockupKind;
  reserved: number[];
};

export const lockupStruct = new BeetStruct<Lockup>(
  [
    ['startTs', i64],
    ['endTs', i64],
    ['kind', u8],
    ['reserved', uniformFixedSizeArray(u8, 15)],
  ],
  (args) => args as Lockup
);

export type Vote = {
  version: number;
  realm: PublicKey;
  mint: PublicKey;
  owner: PublicKey;
  amount: BigNumber;
  padding: Buffer;
};

export const voteStruct = new BeetStruct<Vote>(
  [
    ['version', u8],
    ['realm', publicKey],
    ['mint', publicKey],
    ['owner', publicKey],
    ['amount', u64],
    ['padding', blob(177)],
  ],
  (args) => args as Vote
);
export type DepositEntry = {
  lockup: Lockup;
  amountDepositedNative: BigNumber;
  amountInitiallyLockedNative: BigNumber;
  isUsed: boolean;
  allowClawback: boolean;
  votingMintConfigIdx: number;
  reserved: number[];
};

export const depositEntryStruct = new BeetStruct<DepositEntry>(
  [
    ['lockup', lockupStruct],
    ['amountDepositedNative', u64],
    ['amountInitiallyLockedNative', u64],
    ['isUsed', bool],
    ['allowClawback', bool],
    ['votingMintConfigIdx', u8],
    ['reserved', uniformFixedSizeArray(u8, 29)],
  ],
  (args) => args as DepositEntry
);

export type Voter = {
  buffer: Buffer;
  voterAuthority: PublicKey;
  registrar: PublicKey;
  deposits: DepositEntry[];
  voterBump: number;
  voterWeightRecordBump: number;
  reserved: number[];
};

export const voterStruct = new BeetStruct<Voter>(
  [
    ['buffer', blob(8)],
    ['voterAuthority', publicKey],
    ['registrar', publicKey],
    ['deposits', uniformFixedSizeArray(depositEntryStruct, 32)],
    ['voterBump', u8],
    ['voterWeightRecordBump', u8],
    ['reserved', uniformFixedSizeArray(u8, 94)],
  ],
  (args) => args as Voter
);

export type VotingMintConfig = {
  mint: PublicKey;
  grantAuthority: PublicKey;
  baselineVoteWeightScaledFactor: BigNumber;
  maxExtraLockupVoteWeightScaledFactor: BigNumber;
  lockupSaturationSecs: BigNumber;
  digitShift: number;
  reserved1: number[];
  reserved2: BigNumber[];
};

export const votingMintConfigStruct = new BeetStruct<VotingMintConfig>(
  [
    ['mint', publicKey],
    ['grantAuthority', publicKey],
    ['baselineVoteWeightScaledFactor', u64],
    ['maxExtraLockupVoteWeightScaledFactor', u64],
    ['lockupSaturationSecs', u64],
    ['digitShift', i8],
    ['reserved1', uniformFixedSizeArray(u8, 7)],
    ['reserved2', uniformFixedSizeArray(u64, 7)],
  ],
  (args) => args as VotingMintConfig
);

export type Registrar = {
  buffer: Buffer;
  governanceProgramId: PublicKey;
  realm: PublicKey;
  realmGoverningTokenMint: PublicKey;
  realmAuthority: PublicKey;
  reserved1: number[];
  votingMints: VotingMintConfig[];
  timeOffset: BigNumber;
  bump: number;
  reserved2: number[];
  reserved3: BigNumber[];
};

export const registrarStruct = new BeetStruct<Registrar>(
  [
    ['buffer', blob(8)],
    ['governanceProgramId', publicKey],
    ['realm', publicKey],
    ['realmGoverningTokenMint', publicKey],
    ['realmAuthority', publicKey],
    ['reserved1', uniformFixedSizeArray(u8, 32)],
    ['votingMints', uniformFixedSizeArray(votingMintConfigStruct, 4)],
    ['timeOffset', i64],
    ['bump', u8],
    ['reserved2', uniformFixedSizeArray(u8, 7)],
    ['reserved3', uniformFixedSizeArray(u64, 11)],
  ],
  (args) => args as Registrar
);

export type Governance = {
  buffer: Buffer;
  field1: PublicKey;
  padding: number[];
};

export const governanceStruct = new BeetStruct<Governance>(
  [
    ['buffer', blob(8)],
    ['field1', publicKey],
    ['padding', uniformFixedSizeArray(u16, 10)],
  ],
  (args) => args as Governance
);
