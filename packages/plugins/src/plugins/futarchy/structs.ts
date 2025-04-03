import {
  BeetStruct,
  FixableBeetStruct,
  array,
  bool,
  u16,
  u32,
  u8,
} from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { blob, i64, u128, u64 } from '../../utils/solana';

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

export type Dao = {
  buffer: Buffer;
  treasuryPdaBump: number;
  treasury: PublicKey;
  tokenMint: PublicKey;
  usdcMint: PublicKey;
  proposalCount: number;
  passThresholdBps: number;
  slotsPerProposal: BigNumber;
  twapInitialObservation: BigNumber;
  twapMaxObservationChangePerUpdate: BigNumber;
  minQuoteFutarchicLiquidity: BigNumber;
  minBaseFutarchicLiquidity: BigNumber;
};

export const daoStruct = new BeetStruct<Dao>(
  [
    ['buffer', blob(8)],
    ['treasuryPdaBump', u8],
    ['treasury', publicKey],
    ['tokenMint', publicKey],
    ['usdcMint', publicKey],
    ['proposalCount', u32],
    ['passThresholdBps', u16],
    ['slotsPerProposal', u64],
    ['twapInitialObservation', u128],
    ['twapMaxObservationChangePerUpdate', u128],
    ['minQuoteFutarchicLiquidity', u64],
    ['minBaseFutarchicLiquidity', u64],
  ],
  (args) => args as Dao
);

export enum ProposalState {
  Pending,
  Passed,
  Failed,
  Executed,
}

export type ProposalAccount = {
  pubkey: PublicKey;
  isSigner: boolean;
  isWritable: boolean;
};
export const proposalAccountStruct = new BeetStruct<ProposalAccount>(
  [
    ['pubkey', publicKey],
    ['isSigner', bool],
    ['isWritable', bool],
  ],
  (args) => args as ProposalAccount
);

export type ProposalInstruction = {
  programId: PublicKey;
  accounts: ProposalAccount[];
  data: number[];
};
export const proposalInstructionStruct =
  new FixableBeetStruct<ProposalInstruction>(
    [
      ['programId', publicKey],
      ['accounts', array(proposalAccountStruct)],
      ['data', array(u8)],
    ],
    (args) => args as ProposalInstruction
  );

export type Proposal = {
  buffer: Buffer;
  number: number;
  proposer: PublicKey;
  descriptionUrl: number[];
  slotEnqueued: BigNumber;
  state: ProposalState;
  instruction: ProposalInstruction;
  passAmm: PublicKey;
  failAmm: PublicKey;
  baseVault: PublicKey;
  quoteVault: PublicKey;
  dao: PublicKey;
  passLpTokensLocked: BigNumber;
  failLpTokensLocked: BigNumber;
  nonce: BigNumber;
  pdaBump: number;
};

export const proposalStruct = new FixableBeetStruct<Proposal>(
  [
    ['buffer', blob(8)],
    ['number', u32],
    ['proposer', publicKey],
    ['descriptionUrl', array(u8)],
    ['slotEnqueued', u64],
    ['state', u8],
    ['instruction', proposalInstructionStruct],
    ['passAmm', publicKey],
    ['failAmm', publicKey],
    ['baseVault', publicKey],
    ['quoteVault', publicKey],
    ['dao', publicKey],
    ['passLpTokensLocked', u64],
    ['failLpTokensLocked', u64],
    ['nonce', u64],
    ['pdaBump', u8],
  ],
  (args) => args as Proposal
);

// Launchpad

// Type for Launch
export type Launch = {
  buffer: Buffer;
  pdaBump: number;
  minimumRaiseAmount: BigNumber;
  launchAuthority: PublicKey;
  launchSigner: PublicKey;
  launchSignerPdaBump: number;
  launchUsdcVault: PublicKey;
  launchTokenVault: PublicKey;
  tokenMint: PublicKey;
  usdcMint: PublicKey;
  unixTimestampStarted: BigNumber;
  totalCommittedAmount: BigNumber;
  state: LaunchState;
  seqNum: BigNumber;
  secondsForLaunch: number;
  dao: PublicKey;
  daoTreasury: PublicKey;
};

// Struct for Launch
export const launchStruct = new BeetStruct<Launch>(
  [
    ['buffer', blob(8)],
    ['pdaBump', u8],
    ['minimumRaiseAmount', u64],
    ['launchAuthority', publicKey],
    ['launchSigner', publicKey],
    ['launchSignerPdaBump', u8],
    ['launchUsdcVault', publicKey],
    ['launchTokenVault', publicKey],
    ['tokenMint', publicKey],
    ['usdcMint', publicKey],
    ['unixTimestampStarted', i64],
    ['totalCommittedAmount', u64],
    ['state', u8], // Enum LaunchState is represented as u8
    ['seqNum', u64],
    ['secondsForLaunch', u32],
    ['dao', publicKey], // Optional PublicKey
    ['daoTreasury', publicKey], // Optional PublicKey
  ],
  (args) => args as Launch
);

// Enum for LaunchState
export enum LaunchState {
  Initialized = 0,
  Live = 1,
  Complete = 2,
  Refunding = 3,
}

// Type for FundingRecord
export type FundingRecord = {
  buffer: Buffer;
  pdaBump: number;
  funder: PublicKey;
  launch: PublicKey;
  committedAmount: BigNumber;
  seqNum: BigNumber;
};

// Struct for FundingRecord
export const fundingRecordStruct = new BeetStruct<FundingRecord>(
  [
    ['buffer', blob(8)],
    ['pdaBump', u8],
    ['funder', publicKey],
    ['launch', publicKey],
    ['committedAmount', u64],
    ['seqNum', u64],
  ],
  (args) => args as FundingRecord
);
