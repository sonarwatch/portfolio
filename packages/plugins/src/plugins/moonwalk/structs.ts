import { BeetStruct, bool, u16, u32, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, f64, fp64, i64 } from '../../utils/solana';

export enum Currency {
  USDC,
  Sol,
  Bonk,
}

export type CachedGame = {
  pubkey: string;
  gameId: string;
  isPicked: boolean;
  bump: number;
  authority: string;
  version: number;
  days: number;
  qtyPerDay: number;
  playerSize: number;
  playerDeposit: string;
  currency: Currency;
  blocktimeStart: string;
  blocktimeEnd: string;
};

export type Game = {
  buffer: Buffer;
  gameId: PublicKey;
  isPicked: boolean;
  bump: number;
  authority: PublicKey;
  version: number;
  days: number;
  qtyPerDay: number;
  playerSize: number;
  playerDeposit: BigNumber;
  currency: Currency;
  blocktimeStart: BigNumber;
  blocktimeEnd: BigNumber;
  padding: Buffer;
};

export const gameStruct = new BeetStruct<Game>(
  [
    ['buffer', blob(8)],
    ['gameId', publicKey],
    ['isPicked', bool],
    ['bump', u8],
    ['authority', publicKey],
    ['version', u16],
    ['days', u32],
    ['qtyPerDay', u32],
    ['playerSize', u16],
    ['playerDeposit', fp64],
    ['currency', u8],
    ['blocktimeStart', i64],
    ['blocktimeEnd', i64],
    ['padding', blob(667)],
  ],
  (args) => args as Game
);

export type GamePlayer = {
  buffer: Buffer;
  bump: number;
  authority: PublicKey;
  gameId: PublicKey;
  claimed: boolean;
  claimAmount: BigNumber;
};

export const gamePlayerStruct = new BeetStruct<GamePlayer>(
  [
    ['buffer', blob(8)],
    ['bump', u8],
    ['authority', publicKey],
    ['gameId', publicKey],
    ['claimed', bool],
    ['claimAmount', f64],
  ],
  (args) => args as GamePlayer
);
