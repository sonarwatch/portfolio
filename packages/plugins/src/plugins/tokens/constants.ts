import {
  Platform,
  walletNftsPlatformId,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';

export const walletTokensPlatform: Platform = {
  id: walletTokensPlatformId,
  name: 'Tokens',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/wallet-tokens.webp',
};
export const walletNftsPlatform: Platform = {
  id: walletNftsPlatformId,
  name: 'NFTs',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/wallet-nfts.webp',
};

export const tokenListsPrefix = 'tokenlists';
export const tokenListsDetailsPrefix = 'tokenlistsdetails';
export const nIdsToFetch = 20;
