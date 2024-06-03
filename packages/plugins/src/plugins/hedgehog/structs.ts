import { BeetStruct, u32, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u128, u64 } from '../../utils/solana';

export enum Outcome {
  Open,
  Yes,
  No,
  Invalid,
}

export type Swap = {
  buffer: Buffer;
  market: PublicKey;
  underlyingSwap: PublicKey;
  creator: PublicKey;
  fees: Buffer;
  index: BigNumber;
  volume: BigNumber;
  nonce: number;
};

export const swapStruct = new BeetStruct<Swap>(
  [
    ['buffer', blob(8)],
    ['market', publicKey],
    ['underlyingSwap', publicKey],
    ['creator', publicKey],
    ['fees', blob(12)],
    ['index', u64],
    ['volume', u128],
    ['nonce', u8],
  ],
  (args) => args as Swap
);

export type TokenSwap = {
  buffer: Buffer;
  version: number;
  isInitialized: number;
  bumpSeed: number;
  tokenProgramId: PublicKey;
  tokenAccountA: PublicKey;
  tokenAccountB: PublicKey;
  tokenPool: PublicKey;
  mintA: PublicKey;
  mintB: PublicKey;
  feeAccount: PublicKey;
  tradeFeeNumerator: BigNumber;
  tradeFeeDenominator: BigNumber;
  ownerTradeFeeNumerator: BigNumber;
  ownerTradeFeeDenominator: BigNumber;
  ownerWithdrawFeeNumerator: BigNumber;
  ownerWithdrawFeeDenominator: BigNumber;
  hostFeeNumerator: BigNumber;
  hostFeeDenominator: BigNumber;
  curveType: number;
  curveParameters: Buffer;
  swapGuardian: PublicKey;
};

export const tokenSwapStruct = new BeetStruct<TokenSwap>(
  [
    ['version', u8],
    ['isInitialized', u8],
    ['bumpSeed', u8],
    ['tokenProgramId', publicKey],
    ['tokenAccountA', publicKey],
    ['tokenAccountB', publicKey],
    ['tokenPool', publicKey],
    ['mintA', publicKey],
    ['mintB', publicKey],
    ['feeAccount', publicKey],
    ['tradeFeeNumerator', u64],
    ['tradeFeeDenominator', u64],
    ['ownerTradeFeeNumerator', u64],
    ['ownerTradeFeeDenominator', u64],
    ['ownerWithdrawFeeNumerator', u64],
    ['ownerWithdrawFeeDenominator', u64],
    ['hostFeeNumerator', u64],
    ['hostFeeDenominator', u64],
    ['curveType', u8],
    ['curveParameters', blob(32)],
    ['swapGuardian', publicKey],
  ],
  (args) => args as TokenSwap
);

export type StoredRatio = {
  numer: BigNumber;
  denom: BigNumber;
};

export const storedRatioStruct = new BeetStruct<StoredRatio>(
  [
    ['numer', u64],
    ['denom', u128],
  ],
  (args) => args as StoredRatio
);

export type Market = {
  buffer: Buffer;
  creator: PublicKey;
  yesToken: PublicKey;
  noToken: PublicKey;
  quoteToken: PublicKey;
  marketCollateral: PublicKey;
  feeAccount: PublicKey;
  resolver: PublicKey;
  nonce: number;
  expiryTs: BigNumber;
  creationTs: BigNumber;
  outcomeTs: BigNumber;
  resolutionDelay: number;
  index: BigNumber;
  info: Buffer;
  fees: Buffer;
  outcome: Outcome;
  flags: number;
  redeemOracleForInvalid: PublicKey;
  redeemRatioForInvalid: StoredRatio;
};

export const marketStruct = new BeetStruct<Market>(
  [
    ['buffer', blob(8)],
    ['creator', publicKey],
    ['yesToken', publicKey],
    ['noToken', publicKey],
    ['quoteToken', publicKey],
    ['marketCollateral', publicKey],
    ['feeAccount', publicKey],
    ['resolver', publicKey],
    ['nonce', u8],
    ['expiryTs', u64],
    ['creationTs', u64],
    ['outcomeTs', u64],
    ['resolutionDelay', u32],
    ['index', u64],
    ['info', blob(402)],
    ['fees', blob(4)],
    ['outcome', u8],
    ['flags', u8],
    ['redeemOracleForInvalid', publicKey],
    ['redeemRatioForInvalid', storedRatioStruct],
  ],
  (args) => args as Market
);
