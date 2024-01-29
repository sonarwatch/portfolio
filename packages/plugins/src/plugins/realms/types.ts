import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';

export type VSRInfos = {
  programId: PublicKey;
  mint: string;
};

export type NftVoterMetadata = {
  registrar: string;
  amountDepositedNative: BigNumber;
  amountDeposited: BigNumber;
  votingMintConfigIdx: number;
  votingMint: string;
  startTs: BigNumber;
  endTs: BigNumber;
  kind: string;
  genesisEnd: string;
  numActiveVotes: number;
};

export type Attributes = Array<{
  trait_type?: string;
  value?: string;
  [key: string]: unknown;
}>;
