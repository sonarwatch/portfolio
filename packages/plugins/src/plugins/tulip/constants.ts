import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const tulipMint = 'TuLipcqtGVXP9XR62wM8WWCm6a9vhLs7T1uoWBk6FDs';
export const platformId = 'tulip';
export const platform: Platform = {
  id: platformId,
  name: 'Tulip',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/tulip.webp',
  defiLlamaId: 'tulip-protocol',
  website: 'https://tulip.garden/',
  twitter: 'https://twitter.com/TulipProtocol',
  isDeprecated: true,
  documentation: 'https://tulip-protocol.gitbook.io/tulip-protocol',
  discord: 'https://discord.gg/tulipgarden',
  telegram: 'https://t.me/TulipProtocol',
  medium: 'https://medium.com/tulipprotocol',
  github: 'https://github.com/sol-farm',
  tokens: [tulipMint],
  description: 'The Efficient Solana Yield Aggregator',
};

export const tulipV2ProgramId = new PublicKey(
  'TLPv2tuSVvn3fSk8RgW3yPddkp5oFivzZV3rA9hQxtX'
);
export const tulipLendingProgramId = new PublicKey(
  '4bcFeLv4nydFrsZqV5CgwCVrPhkQKsXtzfy2KyMz7ozM'
);

export const leverageProgramId = new PublicKey(
  'Bt2WPMmbwHPk36i4CRucNDyLcmoGdC7xEdrVuxgJaNE6'
);

export const tulipDecimals = 6;
export const vaultsKey = 'vaults';
