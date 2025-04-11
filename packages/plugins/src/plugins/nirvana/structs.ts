import {
  BeetStruct,
  FixableBeetStruct,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, i64, u64 } from '../../utils/solana';

export type CustomNumber = {
  val: BigNumber[];
};

export const customNumberStruct = new FixableBeetStruct<CustomNumber>(
  [['val', uniformFixedSizeArray(u64, 4)]],
  (args) => args as CustomNumber
);

export type Revenue = {
  lastSeenIndex: CustomNumber;
  staged: BigNumber;
};

export const revenueStruct = new FixableBeetStruct<Revenue>(
  [
    ['lastSeenIndex', customNumberStruct],
    ['staged', u64],
  ],
  (args) => args as Revenue
);

// Type for Number
export type RevenueIndexes = {
  ana: Revenue;
  nirv: Revenue;
};

export const revenueIndexesStruct = new FixableBeetStruct<RevenueIndexes>(
  [
    ['ana', revenueStruct],
    ['nirv', revenueStruct],
  ],
  (args) => args as RevenueIndexes
);

// Type for PersonalBallot
export type PersonalBallot = {
  floorRaise: BigNumber;
  buyAnaFeeMbps: BigNumber;
  sellAnaFeeMbps: BigNumber;
  withdrawAnaFeeMbps: BigNumber;
  pranaAprMbps: BigNumber;
  nirvBorrowMbps: BigNumber;
  pranaRealizeFeeMbps: BigNumber;
};

export const personalBallotStruct = new BeetStruct<PersonalBallot>(
  [
    ['floorRaise', i64],
    ['buyAnaFeeMbps', i64],
    ['sellAnaFeeMbps', i64],
    ['withdrawAnaFeeMbps', i64],
    ['pranaAprMbps', i64],
    ['nirvBorrowMbps', i64],
    ['pranaRealizeFeeMbps', i64],
  ],
  (args) => args as PersonalBallot
);

// Type for RevenueManager
export type RevenueManager = {
  sharesDeposited: BigNumber;
  revenueIndexes: RevenueIndexes;
};

export const revenueManagerStruct = new FixableBeetStruct<RevenueManager>(
  [
    ['sharesDeposited', u64],
    ['revenueIndexes', revenueIndexesStruct],
  ],
  (args) => args as RevenueManager
);

// Type for PersonalAccount
export type PersonalAccount = {
  buffer: Buffer;
  owner: PublicKey;
  tenant: PublicKey;
  nirvBorrowed: BigNumber;
  anaDeposited: BigNumber;
  lastSeenPranaIndex: CustomNumber;
  stagedPrana: BigNumber;
  personalBallot: PersonalBallot;
  pranaRevManager: RevenueManager;
};

export const personalAccountStruct = new FixableBeetStruct<PersonalAccount>(
  [
    ['buffer', blob(8)],
    ['owner', publicKey],
    ['tenant', publicKey],
    ['nirvBorrowed', u64],
    ['anaDeposited', u64],
    ['lastSeenPranaIndex', customNumberStruct],
    ['stagedPrana', u64],
    ['personalBallot', personalBallotStruct],
    ['pranaRevManager', revenueManagerStruct],
  ],
  (args) => args as PersonalAccount
);
