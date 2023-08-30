import { Platform } from '@sonarwatch/portfolio-core';

export const walletTokensPlatform: Platform = {
  id: 'wallet-tokens',
  name: 'Tokens',
  image: 'https://alpha.sonar.watch/img/platforms/wallet-tokens.png',
};
export const walletNftsPlatform: Platform = {
  id: 'wallet-nfts',
  name: 'NFTs',
  image: 'https://alpha.sonar.watch/img/platforms/wallet-nfts.png',
};

export const tokenListsPrefix = 'tokenlists';
export const tokenListsDetailsPrefix = 'tokenlistsdetails';
export const nIdsToFetch = 50;

export const platformId = walletTokensPlatform.id;
