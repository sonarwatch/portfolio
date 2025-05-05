import {
  BeetStruct,
  i8,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { u64 } from '../../utils/solana';

type UFixValue64 = {
  bits: BigNumber;
  exp: number;
};

const uFixValue64Struct = new BeetStruct<UFixValue64>(
  [
    ['bits', u64],
    ['exp', i8],
  ],
  (args) => args as UFixValue64
);

type TotalSolCache = {
  current_update_epoch: BigNumber;
  total_sol: UFixValue64;
};

const totalSolCacheStruct = new BeetStruct<TotalSolCache>(
  [
    ['current_update_epoch', u64],
    ['total_sol', uFixValue64Struct],
  ],
  (args) => args as TotalSolCache
);

type FeePair = {
  mint: UFixValue64;
  redeem: UFixValue64;
};

const feePairStruct = new BeetStruct<FeePair>(
  [
    ['mint', uFixValue64Struct],
    ['redeem', uFixValue64Struct],
  ],
  (args) => args as FeePair
);

type LevercoinFees = {
  normal: FeePair;
  mode_1: FeePair;
  mode_2: FeePair;
};

const levercoinFeesStruct = new BeetStruct<LevercoinFees>(
  [
    ['normal', feePairStruct],
    ['mode_1', feePairStruct],
    ['mode_2', feePairStruct],
  ],
  (args) => args as LevercoinFees
);

type StablecoinFees = {
  normal: FeePair;
  mode_1: FeePair;
};

const stablecoinFeesStruct = new BeetStruct<StablecoinFees>(
  [
    ['normal', feePairStruct],
    ['mode_1', feePairStruct],
  ],
  (args) => args as StablecoinFees
);

type YieldHarvestCache = {
  epoch: BigNumber;
  stability_pool_cap: UFixValue64;
  stablecoin_yield_to_pool: UFixValue64;
};

const yieldHarvestCacheStruct = new BeetStruct<YieldHarvestCache>(
  [
    ['epoch', u64],
    ['stability_pool_cap', uFixValue64Struct],
    ['stablecoin_yield_to_pool', uFixValue64Struct],
  ],
  (args) => args as YieldHarvestCache
);

export type Hylo = {
  accountDiscriminator: number[];
  admin: PublicKey;
  treasury: PublicKey;
  lst_registry: PublicKey;
  stablecoin_mint: PublicKey;
  levercoin_mint: PublicKey;
  stability_pool: PublicKey;
  stablecoin_mint_bump: number;
  stablecoin_auth_bump: number;
  levercoin_mint_bump: number;
  levercoin_auth_bump: number;
  registry_auth_bump: number;
  total_sol_cache_bump: number;
  oracle_interval_secs: BigNumber;
  stablecoin_fees: StablecoinFees;
  levercoin_fees: LevercoinFees;
  total_sol_cache: TotalSolCache;
  yield_harvest_cache: YieldHarvestCache;
};

export const hyloStruct = new BeetStruct<Hylo>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['admin', publicKey],
    ['treasury', publicKey],
    ['lst_registry', publicKey],
    ['stablecoin_mint', publicKey],
    ['levercoin_mint', publicKey],
    ['stability_pool', publicKey],
    ['stablecoin_mint_bump', u8],
    ['stablecoin_auth_bump', u8],
    ['levercoin_mint_bump', u8],
    ['levercoin_auth_bump', u8],
    ['registry_auth_bump', u8],
    ['total_sol_cache_bump', u8],
    ['oracle_interval_secs', u64],
    ['stablecoin_fees', stablecoinFeesStruct],
    ['levercoin_fees', levercoinFeesStruct],
    ['total_sol_cache', totalSolCacheStruct],
    ['yield_harvest_cache', yieldHarvestCacheStruct],
  ],
  (args) => args as Hylo
);
