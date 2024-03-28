import { PublicKey } from '@solana/web3.js';
import { MarketHeader } from '../types';
import { MarketHeaderAccount } from '../structs/marketHeader';
import { phoenixPid, phoenixSeatManagerPid } from '../constants';

export function marketHeaderAccountToMarketHeader(
  marketHeaderAccount: MarketHeaderAccount
): MarketHeader {
  return {
    discriminant: marketHeaderAccount.discriminant.toString(),
    status: marketHeaderAccount.status.toString(),
    marketSizeParams: {
      bidsSize: marketHeaderAccount.marketSizeParams.bidsSize.toString(),
      asksSize: marketHeaderAccount.marketSizeParams.asksSize.toString(),
      numSeats: marketHeaderAccount.marketSizeParams.numSeats.toString(),
    },
    baseParams: {
      decimals: marketHeaderAccount.baseParams.decimals,
      vaultBump: marketHeaderAccount.baseParams.vaultBump,
      mintKey: marketHeaderAccount.baseParams.mintKey.toString(),
      vaultKey: marketHeaderAccount.baseParams.vaultKey.toString(),
    },
    baseLotSize: marketHeaderAccount.baseLotSize.toString(),
    quoteParams: {
      decimals: marketHeaderAccount.quoteParams.decimals,
      vaultBump: marketHeaderAccount.quoteParams.vaultBump,
      mintKey: marketHeaderAccount.quoteParams.mintKey.toString(),
      vaultKey: marketHeaderAccount.quoteParams.vaultKey.toString(),
    },
    quoteLotSize: marketHeaderAccount.quoteLotSize.toString(),
    tickSizeInQuoteAtomsPerBaseUnit:
      marketHeaderAccount.tickSizeInQuoteAtomsPerBaseUnit.toString(),
    authority: marketHeaderAccount.authority.toString(),
    feeRecipient: marketHeaderAccount.feeRecipient.toString(),
    marketSequenceNumber: marketHeaderAccount.marketSequenceNumber.toString(),
    successor: marketHeaderAccount.successor.toString(),
    rawBaseUnitsPerBaseUnit: marketHeaderAccount.rawBaseUnitsPerBaseUnit,
  };
}

export function getSeatManagerAddress(market: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [market.toBuffer()],
    phoenixSeatManagerPid
  )[0];
}

export function getSeatAddress(
  market: PublicKey,
  trader: PublicKey
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('seat'), market.toBuffer(), trader.toBuffer()],
    phoenixPid
  )[0];
}
