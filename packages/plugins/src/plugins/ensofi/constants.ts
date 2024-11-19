import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'ensofi';
export const platform: Platform = {
  id: platformId,
  name: 'EnsoFi',
  image: 'https://sonar.watch/img/platforms/ensofi.webp',
  website: 'https://app.ensofi.xyz',
  twitter: 'https://twitter.com/Ensofi_xyz',
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

export const programId = 'KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD';

/*
[
    {
        "dataSize": 8624
    },
    {
        "memcmp": {
            "offset": 32,
            "bytes": "7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF"
        }
    }
]
 */
