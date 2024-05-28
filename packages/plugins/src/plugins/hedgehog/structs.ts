import { BeetStruct, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u128, u64 } from '../../utils/solana';

export type Swap = {
  buffer: Buffer;
  underlyingSwap: PublicKey;
  creator: PublicKey;
  fees: Buffer;
  index: BigNumber;
  volume: BigNumber;
  nonce: number;
  padding: Buffer;
};

export const swapStruct = new BeetStruct<Swap>(
  [
    ['buffer', blob(8)],
    ['underlyingSwap', publicKey],
    ['creator', publicKey],
    ['fees', blob(12)],
    ['index', u64],
    ['volume', u128],
    ['nonce', u8],
    ['padding', blob(32)],
  ],
  (args) => args as Swap
);

export type TokenSwap = {
  buffer: Buffer;
  version: number;
  isInitialized: number;
  bumpSeed: number;
  tokenProgramId: PublicKey;
  mintA: PublicKey;
  mintB: PublicKey;
  tokenPool: PublicKey;
  tokenAccountA: PublicKey;
  tokenAccountB: PublicKey;
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
    ['buffer', blob(5)],
    ['version', u8],
    ['isInitialized', u8],
    ['bumpSeed', u8],
    ['tokenProgramId', publicKey],
    ['mintA', publicKey],
    ['mintB', publicKey],
    ['tokenPool', publicKey],
    ['tokenAccountA', publicKey],
    ['tokenAccountB', publicKey],
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
