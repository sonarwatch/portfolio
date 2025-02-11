import {
  Platform,
  walletNftsPlatformId,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';

export const walletTokensPlatform: Platform = {
  id: walletTokensPlatformId,
  name: 'Tokens',
  image: 'https://sonar.watch/img/platforms/wallet-tokens.webp',
};
export const walletNftsPlatform: Platform = {
  id: walletNftsPlatformId,
  name: 'NFTs',
  image: 'https://sonar.watch/img/platforms/wallet-nfts.webp',
};

export const tokenListsPrefix = 'tokenlists';
export const tokenListsDetailsPrefix = 'tokenlistsdetails';
export const tokenListInfoPrefix = 'tokenlistinfo';
export const tokenPriceSourcePrefix = 'tokenpricesource';
export const nIdsToFetch = 20;
