import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  BeetStruct,
  u16,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { u64 } from '../../utils/solana';

export type Market = {
  accountDiscriminator: number[];
  pool_bump: number;
  index: number;
  creator: PublicKey;
  base_mint: PublicKey;
  quote_mint: PublicKey;
  lp_mint: PublicKey;
  pool_base_token_account: PublicKey;
  pool_quote_token_account: PublicKey;
  lp_supply: BigNumber;
};

export const marketStruct = new BeetStruct<Market>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['pool_bump', u8],
    ['index', u16],
    ['creator', publicKey],
    ['base_mint', publicKey],
    ['quote_mint', publicKey],
    ['lp_mint', publicKey],
    ['pool_base_token_account', publicKey],
    ['pool_quote_token_account', publicKey],
    ['lp_supply', u64],
  ],
  (args) => args as Market
);
