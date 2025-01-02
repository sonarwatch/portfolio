import {
  BeetStruct,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u128, u64 } from '../../utils/solana';

export type VirtualStablePair = {
  pair_authority: PublicKey;
  x_reserve_amount: BigNumber;
  y_reserve: BigNumber;
  curve_Amp: BigNumber;
  curve_a: BigNumber;
  curve_b: BigNumber;
  inv_L: BigNumber;
  owner: PublicKey;
  x_mint: PublicKey;
  x_vault: PublicKey;
  curve_alpha: BigNumber;
  curve_beta: BigNumber;
  newest_rate_num: number;
  newest_rate_denom: number;
  decimals: number;
  pair_index: number;
  x_is_2022: number;
  _padding: number[];
  padding: number[];
};

export const virtualStablePairStruct = new BeetStruct<VirtualStablePair>(
  [
    ['pair_authority', publicKey],
    ['x_reserve_amount', u64],
    ['y_reserve', u64],
    ['curve_Amp', u128],
    ['curve_a', u128],
    ['curve_b', u128],
    ['inv_L', u128],
    ['owner', publicKey],
    ['x_mint', publicKey],
    ['x_vault', publicKey],
    ['curve_alpha', u64],
    ['curve_beta', u64],
    ['newest_rate_num', u32],
    ['newest_rate_denom', u32],
    ['decimals', u8],
    ['pair_index', u8],
    ['x_is_2022', u8],
    ['_padding', uniformFixedSizeArray(u8, 5)],
    ['padding', uniformFixedSizeArray(u8, 128)],
  ],
  (args) => args as VirtualStablePair
);

export type Liquidity = {
  buffer: Buffer;
  pool_seed: PublicKey;
  lp_mint: PublicKey;
  whitelisted_adder: PublicKey;
  owner: PublicKey;
  inv_T: BigNumber;
  inv_T_max: BigNumber;
  pairs: VirtualStablePair[];
  weights: number[];
  total_weight: BigNumber;
  status: number;
  fee_num: number;
  fee_denom: number;
  decimals: number;
  num_stables: number;
  _padding: number[];
  padding: number[];
};

export const liquidityStruct = new BeetStruct<Liquidity>(
  [
    ['buffer', blob(8)],
    ['pool_seed', publicKey],
    ['lp_mint', publicKey],
    ['whitelisted_adder', publicKey],
    ['owner', publicKey],
    ['inv_T', u64],
    ['inv_T_max', u64],
    ['pairs', uniformFixedSizeArray(virtualStablePairStruct, 10)],
    ['weights', uniformFixedSizeArray(u32, 10)],
    ['total_weight', u64],
    ['status', u32],
    ['fee_num', u32],
    ['fee_denom', u32],
    ['decimals', u8],
    ['num_stables', u8],
    ['_padding', uniformFixedSizeArray(u8, 2)],
    ['padding', uniformFixedSizeArray(u8, 128)],
  ],
  (args) => args as Liquidity
);
