import {
  BeetStruct,
  u32,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { blob, u64 } from '../../../utils/solana';

export type TokenParams = {
  decimals: number;
  vaultBump: number;
  mintKey: PublicKey;
  vaultKey: PublicKey;
};

export const tokenParamsStruct = new BeetStruct<TokenParams>(
  [
    ['decimals', u32],
    ['vaultBump', u32],
    ['mintKey', publicKey],
    ['vaultKey', publicKey],
  ],
  (args) => args as TokenParams
);

export type MarketSizeParams = {
  bidsSize: BigNumber;
  asksSize: BigNumber;
  numSeats: BigNumber;
};

export const marketSizeParamsBeet = new BeetStruct<MarketSizeParams>(
  [
    ['bidsSize', u64],
    ['asksSize', u64],
    ['numSeats', u64],
  ],
  (args) => args as MarketSizeParams
);

export type MarketHeaderAccount = {
  discriminant: BigNumber;
  status: BigNumber;
  marketSizeParams: MarketSizeParams;
  baseParams: TokenParams;
  baseLotSize: BigNumber;
  quoteParams: TokenParams;
  quoteLotSize: BigNumber;
  tickSizeInQuoteAtomsPerBaseUnit: BigNumber;
  authority: PublicKey;
  feeRecipient: PublicKey;
  marketSequenceNumber: BigNumber;
  successor: PublicKey;
  rawBaseUnitsPerBaseUnit: number;
  padding1: number;
  padding2: BigNumber[] /* size: 32 */;
};
export const marketHeaderStruct = new BeetStruct<MarketHeaderAccount>(
  [
    ['discriminant', u64],
    ['status', u64],
    ['marketSizeParams', marketSizeParamsBeet],
    ['baseParams', tokenParamsStruct],
    ['baseLotSize', u64],
    ['quoteParams', tokenParamsStruct],
    ['quoteLotSize', u64],
    ['tickSizeInQuoteAtomsPerBaseUnit', u64],
    ['authority', publicKey],
    ['feeRecipient', publicKey],
    ['marketSequenceNumber', u64],
    ['successor', publicKey],
    ['rawBaseUnitsPerBaseUnit', u32],
    ['padding1', u32],
    ['padding2', uniformFixedSizeArray(u64, 32)],
  ],
  (args) => args as MarketHeaderAccount
);

export type PartialMarketHeaderAccount = {
  buffer: Buffer;
  marketSizeParams: MarketSizeParams;
};

export const partialMarketHeaderStruct =
  new BeetStruct<PartialMarketHeaderAccount>(
    [
      ['buffer', blob(16)],
      ['marketSizeParams', marketSizeParamsBeet],
    ],
    (args) => args as PartialMarketHeaderAccount
  );
