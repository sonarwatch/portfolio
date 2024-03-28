import { MarketHeaderAccount } from './structs/marketHeader';
import { OrderId, RestingOrder, TraderState } from './structs/misc';

export type MarketHeader = {
  discriminant: string;
  status: string;
  marketSizeParams: {
    bidsSize: string;
    asksSize: string;
    numSeats: string;
  };
  baseParams: {
    decimals: number;
    vaultBump: number;
    mintKey: string;
    vaultKey: string;
  };
  baseLotSize: string;
  quoteParams: {
    decimals: number;
    vaultBump: number;
    mintKey: string;
    vaultKey: string;
  };
  quoteLotSize: string;
  tickSizeInQuoteAtomsPerBaseUnit: string;
  authority: string;
  feeRecipient: string;
  marketSequenceNumber: string;
  successor: string;
  rawBaseUnitsPerBaseUnit: number;
};

export type Market = {
  header: MarketHeaderAccount;
  baseLotsPerBaseUnit: number;
  quoteLotsPerBaseUnitPerTick: number;
  orderSequenceNumber: number;
  takerFeeBps: number;
  collectedQuoteLotFees: number;
  unclaimedQuoteLotFees: number;
  bids: [OrderId, Partial<RestingOrder>][];
  asks: [OrderId, Partial<RestingOrder>][];
  traders: Map<string, TraderState>;
  traderPubkeyToTraderIndex: Map<string, number>;
  traderIndexToTraderPubkey: Map<number, string>;
};
