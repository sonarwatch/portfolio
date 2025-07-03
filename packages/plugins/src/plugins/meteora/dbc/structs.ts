import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  FixableBeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { u128, u64 } from '../../../utils/solana';

export type VolatilityTracker = {
  last_update_timestamp: BigNumber;
  padding: number[];
  sqrt_price_reference: BigNumber;
  volatility_accumulator: BigNumber;
  volatility_reference: BigNumber;
};

export const volatilityTrackerStruct = new FixableBeetStruct<VolatilityTracker>(
  [
    ['last_update_timestamp', u64],
    ['padding', uniformFixedSizeArray(u8, 8)],
    ['sqrt_price_reference', u128],
    ['volatility_accumulator', u128],
    ['volatility_reference', u128],
  ],
  (args) => args as VolatilityTracker
);

export type VirtualPool = {
  accountDiscriminator: number[];
  volatility_tracker: VolatilityTracker;
  config: PublicKey;
  creator: PublicKey;
  base_mint: PublicKey;
  base_vault: PublicKey;
  quote_vault: PublicKey;
};

export const virtualPoolStruct = new FixableBeetStruct<VirtualPool>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['volatility_tracker', volatilityTrackerStruct],
    ['config', publicKey],
    ['creator', publicKey],
    ['base_mint', publicKey],
    ['base_vault', publicKey],
    ['quote_vault', publicKey],
  ],
  (args) => args as VirtualPool
);
