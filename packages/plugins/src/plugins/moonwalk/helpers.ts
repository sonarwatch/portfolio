import {
  solanaNativeAddress,
  solanaNativeDecimals,
} from '@sonarwatch/portfolio-core';
import {
  ParsedAccount,
  usdcSolanaDecimals,
  usdcSolanaMint,
} from '../../utils/solana';
import { bonkDecimals, bonkMint } from '../bonkrewards/constants';
import { CachedGame, Currency, Game } from './structs';

export function gameToCached(game: ParsedAccount<Game>): CachedGame {
  return {
    pubkey: game.pubkey.toString(),
    authority: game.authority.toString(),
    blocktimeEnd: game.blocktimeEnd.times(1000).plus(86400000).toString(),
    blocktimeStart: game.blocktimeStart.times(1000).toString(),
    bump: game.bump,
    days: game.days,
    currency: game.currency,
    playerSize: game.playerSize,
    version: game.version,
    gameId: game.gameId.toString(),
    isPicked: game.isPicked,
    playerDeposit: game.playerDeposit
      .div(game.currency === Currency.Sol ? 10 ** solanaNativeDecimals : 1)
      .toString(),
    qtyPerDay: game.qtyPerDay,
  };
}

export function getMintFromCurrency(currency: Currency): {
  mint: string;
  decimals: number;
} {
  switch (currency) {
    case Currency.Bonk:
      return { mint: bonkMint, decimals: bonkDecimals };
    case Currency.USDC:
      return { mint: usdcSolanaMint, decimals: usdcSolanaDecimals };
    case Currency.Sol:
      return { mint: solanaNativeAddress, decimals: solanaNativeDecimals };
    default:
      return { mint: solanaNativeAddress, decimals: solanaNativeDecimals };
  }
}
