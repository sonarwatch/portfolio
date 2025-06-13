import { publicKey } from '@metaplex-foundation/beet-solana';
import {
  array,
  BeetStruct,
  bool,
  FixableBeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u128, u64 } from '../../utils/solana';

export type Registrar = {
  buffer: Buffer;
  governanceProgramId: PublicKey;
  realm: PublicKey;
  realmGoverningTokenMint: PublicKey;
  reserved2: Buffer;
};

export const registrarStruct = new BeetStruct<Registrar>(
  [
    ['buffer', blob(8)],
    ['governanceProgramId', publicKey],
    ['realm', publicKey],
    ['realmGoverningTokenMint', publicKey],
    ['reserved2', blob(228)],
  ],
  (args) => args as Registrar
);

export type DepositEntry = {
  amountDepositedNative: BigNumber;
  votingMintConfigIdx: number;
  depositSlotHash: BigNumber;
  isUsed: boolean;
  reserved: number[];
};

export const depositEntryStruct = new BeetStruct<DepositEntry>(
  [
    ['amountDepositedNative', u64],
    ['votingMintConfigIdx', u8],
    ['depositSlotHash', u64],
    ['isUsed', bool],
    ['reserved', uniformFixedSizeArray(u8, 38)],
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

export const voterStruct = new FixableBeetStruct<Voter>(
  [
    ['buffer', blob(8)],
    ['voterAuthority', publicKey],
    ['registrar', publicKey],
    ['deposits', array(depositEntryStruct)],
    ['voterBump', u8],
    ['voterWeightRecordBump', u8],
    ['reserved', uniformFixedSizeArray(u8, 94)],
  ],
  (args) => args as Voter
);

export type StakeDepositReceipt = {
  buffer: Buffer;
  owner: PublicKey;
  payer: PublicKey;
  stakePool: PublicKey;
  lockupDuration: BigNumber;
  depositTimestamp: BigNumber;
  depositAmount: BigNumber;
  effectiveStake: BigNumber;
  claimedAmounts: BigNumber[];
};

export const stakeDepositReceiptStruct = new BeetStruct<StakeDepositReceipt>(
  [
    ['buffer', blob(8)],
    ['owner', publicKey],
    ['payer', publicKey],
    ['stakePool', publicKey],
    ['lockupDuration', u64],
    ['depositTimestamp', i64],
    ['depositAmount', u64],
    ['effectiveStake', u128],
    ['claimedAmounts', uniformFixedSizeArray(u128, 10)],
  ],
  (args) => args as StakeDepositReceipt
);
