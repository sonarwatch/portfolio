import { BeetStruct, bool, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { blob, u64 } from '../../utils/solana';

export type Fees = {
  tradeFeeNumerator: BigNumber;
  tradeFeeDenominator: BigNumber;
  ownerTradeFeeNumerator: BigNumber;
  ownerTradeFeeDenominator: BigNumber;
  ownerWithdrawFeeNumerator: BigNumber;
  ownerWithdrawFeeDenominator: BigNumber;
  hostFeeNumerator: BigNumber;
  hostFeeDenominator: BigNumber;
};

export const feesStruct = new BeetStruct<Fees>(
  [
    ['tradeFeeNumerator', u64],
    ['tradeFeeDenominator', u64],
    ['ownerTradeFeeNumerator', u64],
    ['ownerTradeFeeDenominator', u64],
    ['ownerWithdrawFeeNumerator', u64],
    ['ownerWithdrawFeeDenominator', u64],
    ['hostFeeNumerator', u64],
    ['hostFeeDenominator', u64],
  ],
  (args) => args as Fees
);

export enum CurveType {
  ConstantProduct,
  ConstantPrice,
  Offset,
}

export type SwapCurve = {
  curveType: CurveType;
  calculator: Buffer;
};

export const swapCurveStruct = new BeetStruct<SwapCurve>(
  [
    ['curveType', u8],
    ['calculator', blob(32)],
  ],
  (args) => args as SwapCurve
);

export type Pool = {
  padding: Buffer;
  isInitialized: boolean;
  bumpSeed: number;
  tokenProgramId: PublicKey;
  tokenA: PublicKey;
  tokenB: PublicKey;
  poolMint: PublicKey;
  tokenAMint: PublicKey;
  tokenBMint: PublicKey;
  poolFeeAccount: PublicKey;
  fees: Fees;
  swapCurve: SwapCurve;
};

export const poolStruct = new BeetStruct<Pool>(
  [
    ['padding', blob(1)],
    ['isInitialized', bool],
    ['bumpSeed', u8],
    ['tokenProgramId', publicKey],
    ['tokenA', publicKey],
    ['tokenB', publicKey],
    ['poolMint', publicKey],
    ['tokenAMint', publicKey],
    ['tokenBMint', publicKey],
    ['poolFeeAccount', publicKey],
    ['fees', feesStruct],
    ['swapCurve', swapCurveStruct],
  ],
  (args) => args as Pool
);
