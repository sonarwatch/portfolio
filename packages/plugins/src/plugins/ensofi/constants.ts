import { Platform } from '@sonarwatch/portfolio-core';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { ensofiIdl } from './idl';

export const platformId = 'ensofi';
export const platform: Platform = {
  id: platformId,
  name: 'EnsoFi',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/ensofi.webp',
  website: 'https://app.ensofi.xyz',
  twitter: 'https://twitter.com/Ensofi_xyz',
  discord: 'https://discord.com/invite/ensofi',
  documentation: 'https://ensofi.gitbook.io/ensofi',
  telegram: 'https://t.me/ensofiapp_bot/ensofi?startapp=mainnet',
  github: 'https://github.com/Ensofi-xyz',
  description:
    'Cross-chain DeFi Hub. Lend, Borrow, LSTs, Earn & more with stable returns.',
};

// sui sc : https://github.com/Ensofi-xyz/lending_smart_contract/tree/main/sui_smartcontract/sources
export const State =
  '0x4ca6dfe03908e35241186dee292edaf97bebe75be2d2b8133342cf365be2a0b5';
export const OfferType =
  '0x92d5efc1eec7e45b9e806fbc88ba175555dc605e63fa2db9da2b90b8b68f2e5c::offer_registry::Offer';
export const LoanType =
  '0x92d5efc1eec7e45b9e806fbc88ba175555dc605e63fa2db9da2b90b8b68f2e5c::loan_registry::Loan';
export const offersCacheKey = 'offers';
export const loansCacheKey = 'loans';

export const ensofiIdlItem = {
  programId: 'ensoQXKf4MvNuEC3M9xmcqUqgucFNd5UzAonDdUtgqn',
  idl: ensofiIdl,
  idlType: 'anchor',
} as IdlItem;
