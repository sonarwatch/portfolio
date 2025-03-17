import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'bonkrewards';
export const bonkMint = 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263';
export const platform: Platform = {
  id: platformId,
  name: 'Bonk Rewards',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/bonk.webp',
  twitter: 'https://twitter.com/bonk_inu',
  website: 'https://bonkrewards.com/',
  defiLlamaId: 'bonkswap',
  discord: 'https://discord.com/invite/qaQa6M6mN2',
  telegram: 'https://t.me/Official_Bonk_Inu',
  medium: 'https://medium.com/@bonk_inu',
  description: 'Social layer and community meme coin of Solana.',
  tokens: [bonkMint],
};
export const stakePid = new PublicKey(
  'STAKEkKzbdeKkqzKpLkNQD3SUuLgshDKCD7U8duxAbB'
);
export const stakePool = '9AdEE8AAm1XgJrPEs4zkTPozr3o4U5iGbgvPwkNdLDJ3';
export const bonkDecimals = 5;
