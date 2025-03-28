import { PublicKey } from '@solana/web3.js';
import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { Collection, SplAssetMarket, Vault } from './types';
import { arrayToMap } from '../../utils/misc/arrayToMap';

export const platformId = 'banx';

export const banxMint = 'BANXbTpN8U2cU41FjPxe2Ti37PiT5cCxLUKDQZuJeMMR';
export const banxDecimals = 9;
export const banxSolMint = 'BANXyWgPpa519e2MtQF1ecRbKYKKDMXPF1dyBxUq9NQG';

export const platform: Platform = {
  id: platformId,
  name: 'Banx',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/banx.webp',
  defiLlamaId: 'banx', // from https://defillama.com/docs/api
  website: 'https://banx.gg/',
  twitter: 'https://twitter.com/banx_gg',
  description:
    'Borrow, Lend, Multiply, Hedge Solana tokens and NFTs with no expiration, no price liquidation.',
  documentation: 'https://docs.banx.gg/',
  discord: 'https://discord.com/invite/banxfromfrakt',
  github: 'https://github.com/frakt-solana',
  tokens: [banxMint],
};

export const banxPid = new PublicKey(
  '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt'
);
export const banxVaultsPid = new PublicKey(
  'BanxxEcFZPJLKhS59EkwTa8SZez8vDYTiJVN78mGHWDi'
);

export const banxApiCollectionsUrl =
  'https://api.banx.gg/bonds/preview?getAll=true&marketType=banxSol&isPrivate=false';
export const banxApiMarketsUrl =
  'https://api.banx.gg/spl-assets/undefined?isPrivate=false&marketType=usdc';
export const banxApiVaultsUrl =
  'https://api.banx.gg/vaults/preview?walletPublicKey=&getAll=true&isPrivate=false';

export const nftMarketsCacheKey = `${platformId}-nft-markets`;
export const splMarketsCacheKey = `${platformId}-spl-markets`;
export const vaultsCacheKey = `${platformId}-spl-vaults`;
export const cachePrefix = `${platformId}`;

export const splMarketsMemo = new MemoizedCache<
  SplAssetMarket[],
  Map<string, SplAssetMarket>
>(
  splMarketsCacheKey,
  {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  },
  (arr) => arrayToMap(arr || [], 'marketPubkey')
);
export const nftMarketsMemo = new MemoizedCache<
  Collection[],
  Map<string, Collection>
>(
  nftMarketsCacheKey,
  {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  },
  (arr) => arrayToMap(arr || [], 'marketPubkey')
);

export const vaultsMemo = new MemoizedCache<Vault[], Map<string, Vault>>(
  vaultsCacheKey,
  {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  },
  (arr) => arrayToMap(arr || [], 'vaultPubkey')
);
