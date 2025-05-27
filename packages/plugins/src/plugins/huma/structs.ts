import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  BeetStruct,
  bool,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { i64, u64 } from '../../utils/solana';

export enum LockupKind {
  None,
  Daily,
  Monthly,
  Cliff,
  Constant,
}

type Lockup = {
  startTs: BigNumber;
  endTs: BigNumber;
  kind: LockupKind;
  reserved: number[];
};

const lockupStruct = new BeetStruct<Lockup>(
  [
    ['startTs', i64],
    ['endTs', i64],
    ['kind', u8],
    ['reserved', uniformFixedSizeArray(u8, 15)],
  ],
  (args) => args as Lockup
);

type Deposit = {
  lockup: Lockup;
  amountDepositedNative: BigNumber;
  amountInitiallyLockedNative: BigNumber;
  isUsed: boolean;
  allowClawback: boolean;
  votingMintConfigIdx: number;
  reserved: number[];
};

const depositStruct = new BeetStruct<Deposit>(
  [
    ['lockup', lockupStruct],
    ['amountDepositedNative', u64],
    ['amountInitiallyLockedNative', u64],
    ['isUsed', bool],
    ['allowClawback', bool],
    ['votingMintConfigIdx', u8],
    ['reserved', uniformFixedSizeArray(u8, 29)],
  ],
  (args) => args as Deposit
);

export type Voter = {
  accountDiscriminator: number[];
  voterAuthority: PublicKey;
  registrar: PublicKey;
  deposits: Deposit[];
};

export const voterStruct = new BeetStruct<Voter>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['voterAuthority', publicKey],
    ['registrar', publicKey],
    ['deposits', uniformFixedSizeArray(depositStruct, 32)],
  ],
  (args) => args as Voter
);
