import { BeetStruct, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../utils/solana';

export type MarketInfo = {
  vaultSyAmount: BigNumber;
  vaultPtAmount: BigNumber;
  vaultYtAmount: BigNumber;
  vaultLpAmount: BigNumber;
  volume: BigNumber;
  feeTrade: BigNumber;
  feePlatform: BigNumber;
  feeTradeVolume: BigNumber;
  feePlatformVolume: BigNumber;
  infoTemp1: BigNumber;
  infoTemp2: BigNumber;
  infoTemp3: BigNumber;
  infoTemp4: BigNumber;
};

export const marketInfoStruct = new BeetStruct<MarketInfo>(
  [
    ['vaultSyAmount', u64],
    ['vaultPtAmount', u64],
    ['vaultYtAmount', u64],
    ['vaultLpAmount', u64],
    ['volume', u64],
    ['feeTrade', u64],
    ['feePlatform', u64],
    ['feeTradeVolume', u64],
    ['feePlatformVolume', u64],
    ['infoTemp1', u64],
    ['infoTemp2', u64],
    ['infoTemp3', u64],
    ['infoTemp4', u64],
  ],
  (args) => args as MarketInfo
);

export type MarketConfig = {
  priceBase: BigNumber;
  startTime: BigNumber;
  startPrice: BigNumber;
  startEpoch: BigNumber;
  startLpValue: BigNumber;
  endTime: BigNumber;
  marketEndPrice: BigNumber;
  marketApy: BigNumber;
  updateSkipTime: BigNumber;
  lastUpdateEpoch: BigNumber;
  marketSolPrice: BigNumber;
  lastUpdateTime: BigNumber;
  marketConfig1: BigNumber;
  marketConfig2: BigNumber;
  marketConfig3: BigNumber;
  marketConfig4: BigNumber;
  marketConfig5: BigNumber;
  marketConfig6: BigNumber;
  marketConfig7: BigNumber;
};

export const marketConfigStruct = new BeetStruct<MarketConfig>(
  [
    ['priceBase', u64],
    ['startTime', u64],
    ['startPrice', u64],
    ['startEpoch', u64],
    ['startLpValue', u64],
    ['endTime', u64],
    ['marketEndPrice', u64],
    ['marketApy', u64],
    ['updateSkipTime', u64],
    ['lastUpdateEpoch', u64],
    ['marketSolPrice', u64],
    ['lastUpdateTime', u64],
    ['marketConfig1', u64],
    ['marketConfig2', u64],
    ['marketConfig3', u64],
    ['marketConfig4', u64],
    ['marketConfig5', u64],
    ['marketConfig6', u64],
    ['marketConfig7', u64],
  ],
  (args) => args as MarketConfig
);

export type Freeze = {
  market: number;
  mint: number;
  redeem: number;
  trade: number;
  deposi: number;
  withdr: number;
};

export const freezeStruct = new BeetStruct<Freeze>(
  [
    ['market', u8],
    ['mint', u8],
    ['redeem', u8],
    ['trade', u8],
    ['deposi', u8],
    ['withdr', u8],
  ],
  (args) => args as Freeze
);

export type Fees = {
  feeDenominator: BigNumber;
  tradeFeeNumerator: BigNumber;
  platformFeeNumerator: BigNumber;
  yieldFeeNumerator: BigNumber;
  feeNumerator1: BigNumber;
  feeNumerator2: BigNumber;
};

export const feesStruct = new BeetStruct<Fees>(
  [
    ['feeDenominator', u64],
    ['tradeFeeNumerator', u64],
    ['platformFeeNumerator', u64],
    ['yieldFeeNumerator', u64],
    ['feeNumerator1', u64],
    ['feeNumerator2', u64],
  ],
  (args) => args as Fees
);

export type PoolConfig = {
  fees: Fees;
  configDenominator: BigNumber;
  leverage: BigNumber;
  poolConfig8: BigNumber;
  poolConfig9: BigNumber;
  spreadReduce: BigNumber;
  feeTimeExp: BigNumber;
  depositCapPt: BigNumber;
  poolConfig1: BigNumber;
  poolConfig2: BigNumber;
  poolConfig3: BigNumber;
  poolConfig4: BigNumber;
  poolConfig5: BigNumber;
  poolConfig6: BigNumber;
  poolConfig7: BigNumber;
};

export const poolConfigStruct = new BeetStruct<PoolConfig>(
  [
    ['fees', feesStruct],
    ['configDenominator', u64],
    ['leverage', u64],
    ['poolConfig8', u64],
    ['poolConfig9', u64],
    ['spreadReduce', u64],
    ['feeTimeExp', u64],
    ['depositCapPt', u64],
    ['poolConfig1', u64],
    ['poolConfig2', u64],
    ['poolConfig3', u64],
    ['poolConfig4', u64],
    ['poolConfig5', u64],
    ['poolConfig6', u64],
    ['poolConfig7', u64],
  ],
  (args) => args as PoolConfig
);

export type Market = {
  buffer: Buffer;
  bumpSeed: number;
  freeze: Freeze;
  marketSigner: PublicKey;
  tokenProgram: PublicKey;
  marketInfo: MarketInfo;
  marketConfig: MarketConfig;
  poolConfig: PoolConfig;
  oracleAccount: PublicKey;
  tokenSyMintAddress: PublicKey;
  tokenPtMintAddress: PublicKey;
  tokenYtMintAddress: PublicKey;
  tokenLpMintAddress: PublicKey;
  poolPtTokenAccount: PublicKey;
  poolYtTokenAccount: PublicKey;
  vaultSyTokenAccount: PublicKey;
  vaultPtTokenAccount: PublicKey;
  vaultYtTokenAccount: PublicKey;
  vaultLpTokenAccount: PublicKey;
  feeLpTokenAccount: PublicKey;
  marketAddress1: PublicKey;
  marketAddress2: PublicKey;
  marketAddress3: PublicKey;
  marketAddress4: PublicKey;
  marketAddress5: PublicKey;
  marketAddress6: PublicKey;
  marketAddress7: PublicKey;
};

export const marketStruct = new BeetStruct<Market>(
  [
    ['buffer', blob(8)],
    ['bumpSeed', u8],
    ['freeze', freezeStruct],
    ['marketSigner', publicKey],
    ['tokenProgram', publicKey],
    ['marketInfo', marketInfoStruct],
    ['marketConfig', marketConfigStruct],
    ['poolConfig', poolConfigStruct],
    ['oracleAccount', publicKey],
    ['tokenSyMintAddress', publicKey],
    ['tokenPtMintAddress', publicKey],
    ['tokenYtMintAddress', publicKey],
    ['tokenLpMintAddress', publicKey],
    ['poolPtTokenAccount', publicKey],
    ['poolYtTokenAccount', publicKey],
    ['vaultSyTokenAccount', publicKey],
    ['vaultPtTokenAccount', publicKey],
    ['vaultYtTokenAccount', publicKey],
    ['vaultLpTokenAccount', publicKey],
    ['feeLpTokenAccount', publicKey],
    ['marketAddress1', publicKey],
    ['marketAddress2', publicKey],
    ['marketAddress3', publicKey],
    ['marketAddress4', publicKey],
    ['marketAddress5', publicKey],
    ['marketAddress6', publicKey],
    ['marketAddress7', publicKey],
  ],
  (args) => args as Market
);

export type TradeInfo = {
  volume: BigNumber;
  tradeInfo1: BigNumber;
  tradeInfo2: BigNumber;
  tradeInfo3: BigNumber;
  tradeInfo4: BigNumber;
  tradeInfo5: BigNumber;
};

export const tradeInfoStruct = new BeetStruct<TradeInfo>(
  [
    ['volume', u64],
    ['tradeInfo1', u64],
    ['tradeInfo2', u64],
    ['tradeInfo3', u64],
    ['tradeInfo4', u64],
    ['tradeInfo5', u64],
  ],
  (args) => args as TradeInfo
);

export type StakeInfo = {
  stakePtAmount: BigNumber;
  stakePtTime: BigNumber;
  stakePtPriceSy: BigNumber;
  stakePtPricePt: BigNumber;
  stakeYtAmount: BigNumber;
  stakeYtTime: BigNumber;
  stakeYtPriceSy: BigNumber;
  stakeYtPriceYt: BigNumber;
  stakeLpAmount: BigNumber;
  stakeLpTime: BigNumber;
  stakeLpPriceSy: BigNumber;
  staleInfo1: BigNumber;
  staleInfo2: BigNumber;
  staleInfo3: BigNumber;
  staleInfo4: BigNumber;
  staleInfo5: BigNumber;
};

export const stakeInfoStruct = new BeetStruct<StakeInfo>(
  [
    ['stakePtAmount', u64],
    ['stakePtTime', i64],
    ['stakePtPriceSy', u64],
    ['stakePtPricePt', u64],
    ['stakeYtAmount', u64],
    ['stakeYtTime', i64],
    ['stakeYtPriceSy', u64],
    ['stakeYtPriceYt', u64],
    ['stakeLpAmount', u64],
    ['stakeLpTime', i64],
    ['stakeLpPriceSy', u64],
    ['staleInfo1', u64],
    ['staleInfo2', u64],
    ['staleInfo3', u64],
    ['staleInfo4', u64],
    ['staleInfo5', u64],
  ],
  (args) => args as StakeInfo
);

export type SandglassAccount = {
  buffer: Buffer;
  bumpSeed: number;
  marketAccount: PublicKey;
  userAddress: PublicKey;
  tradeInfo: TradeInfo;
  stakeInfo: StakeInfo;
  sandglassAddress1: PublicKey;
  sandglassAddress2: PublicKey;
  sandglassAddress3: PublicKey;
  sandglassAddress4: PublicKey;
  sandglassAddress5: PublicKey;
};

export const sandglassAccountStruct = new BeetStruct<SandglassAccount>(
  [
    ['buffer', blob(8)],
    ['bumpSeed', u8],
    ['marketAccount', publicKey],
    ['userAddress', publicKey],
    ['tradeInfo', tradeInfoStruct],
    ['stakeInfo', stakeInfoStruct],
    ['sandglassAddress1', publicKey],
    ['sandglassAddress2', publicKey],
    ['sandglassAddress3', publicKey],
    ['sandglassAddress4', publicKey],
    ['sandglassAddress5', publicKey],
  ],
  (args) => args as SandglassAccount
);
