import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'elixir';
export const platform: Platform = {
  id: platformId,
  name: 'Elixir',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/elixir.webp',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  website: 'https://agg.elixir.xyz/',
  twitter: 'https://x.com/elixir',
};

// extracted from Elixir code
export const vaults = [
  {
    address:
      '0xd91e4fab8b707009ef0093135bef3e39adbc6d43c5e01944f27d048ec9a84aaa',
    vaultName: 'ETH_PERP',
    vaultDisplayName: 'ETH ⇔ USDC',
    perpetualId:
      '0x30b7baece69ecd1b1bea5c965f22e52ffbb3dd28b15b79449971945b2687fc35',
  },
  {
    address:
      '0x2a58307c374970ae7ab31c7ab2d6881f6e3f30a6576a23cb2cdbf8400b806387',
    vaultName: 'BTC_PERP',
    vaultDisplayName: 'BTC ⇔ USDC',
    perpetualId:
      '0x38d43822f621968460a642f47db2c5a20b3d59826c6dd34811c78ba3866cc2d1',
  },
  {
    address:
      '0x12973df124a6d7e357e0eb9639f5c2bbb621214d1d7f58f17ca62789078bc287',
    vaultName: 'SUI_PERP',
    vaultDisplayName: 'SUI ⇔ USDC',
    perpetualId:
      '0xdade62fa7a4b4f1eac97c76d61e70b68c91d3c60ce399c7f741dee43e8d93167',
  },
  {
    address:
      '0x48d66ded5d13c2d04f0e88e23cdc52edceb25d28489d0604f467ca624cd989ee',
    vaultName: 'SOL_PERP',
    vaultDisplayName: 'SOL ⇔ USDC',
    perpetualId:
      '0x876905808eefa9104ae3b569cd21d364346da791f1638aab5d4f89af53b8baec',
  },
  {
    address:
      '0xa62c2ea87e494c70189e8c71721f4f695be602fd767de47a5d81e52832de1264',
    vaultName: 'ARB_PERP',
    vaultDisplayName: 'ARB ⇔ USDC',
    perpetualId:
      '0x2da0b91d57ba9e0877ec0b93da18902e627be687e909df7c2e5111f3b34e27ab',
  },
  {
    address:
      '0x2fd542335c9e9a5977fab67d211a315e707d136db807905594178428734eab81',
    vaultName: 'APT_PERP',
    vaultDisplayName: 'APT ⇔ USDC',
    perpetualId:
      '0xd9a014692e3002d196107d5c58657c451ae7f8d00ebd61d45b71fd9a98cabff4',
  },
  {
    address:
      '0x3018057a2ebf1aec510ff1f141ee358c4bacafa3ca8006abe9238f4d6caca5e0',
    vaultName: 'AVAX_PERP',
    vaultDisplayName: 'AVAX ⇔ USDC',
    perpetualId:
      '0x1563fe1b1eda2b2427fa33d683c60464cc3a8912c0f9a9836fb6c3fd30810d0e',
  },
  {
    address:
      '0x8b1e7c57e0befb8140ccf616f6b55dd048f5b7fb8e88e9ff79a9b5d479307541',
    vaultName: 'TIA_PERP',
    vaultDisplayName: 'TIA ⇔ USDC',
    perpetualId:
      '0x69021f4991ac18fdbfc6b07914835811236008a797a51a56a6948ff3474bc8f6',
  },
  {
    address:
      '0xed062a14ac075a338ab41763a5a53b14af3f0ceb0e003d3aea24d6a6281a7723',
    vaultName: 'MATIC_PERP',
    vaultDisplayName: 'MATIC ⇔ USDC',
    perpetualId:
      '0x18a2f1a773b66b1d568cfa56cadbc9bfe91a1a16a09c7338897273a60a293a4b',
  },
  {
    address:
      '0xb2f2b48055fa43ad36d05a46615c9d38b56e6a605e24ea4c278a4904af4ef9fc',
    vaultName: 'SEI_PERP',
    vaultDisplayName: 'SEI ⇔ USDC',
    perpetualId:
      '0xcf84b2b99a65fd595e8bf03a9dc16c7002533ebdbc3ad035f9863594a9b356a1',
  },
];

export const vaultsPrefix = platformId;
export const vaultsKey = 'vaults';
export const vaultsTvlKey = 'vaultstvl';
