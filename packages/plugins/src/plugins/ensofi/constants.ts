import { PublicKey } from '@solana/web3.js';

export const platformId = 'ensofi';

// sui sc : https://github.com/Ensofi-xyz/lending_smart_contract/tree/main/sui_smartcontract/sources
export const State =
  '0x4ca6dfe03908e35241186dee292edaf97bebe75be2d2b8133342cf365be2a0b5';
export const OfferType =
  '0x92d5efc1eec7e45b9e806fbc88ba175555dc605e63fa2db9da2b90b8b68f2e5c::offer_registry::Offer';
export const LoanType =
  '0x92d5efc1eec7e45b9e806fbc88ba175555dc605e63fa2db9da2b90b8b68f2e5c::loan_registry::Loan';
export const offersCacheKey = 'offers';
export const loansCacheKey = 'loans';

export const ensofiLendingProgramId = new PublicKey(
  'ensoQXKf4MvNuEC3M9xmcqUqgucFNd5UzAonDdUtgqn'
);
export const ensofiLendingFlexProgramId = new PublicKey(
  'enseM1J4dGgwEw3qDyuVBi7YsjgwqvKzuX3ZLaboLGv'
);

export const ensofiLiquidityPid = new PublicKey(
  'ensSuXMeaUhRC7Re3ukaxLcX2E4qmd2LZxbxsK9XcWz'
);
