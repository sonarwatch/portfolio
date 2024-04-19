import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'tulip';
export const tulipPlatform: Platform = {
  id: platformId,
  name: 'Tulip',
  image: 'https://sonar.watch/img/platforms/tulip.webp',
  defiLlamaId: 'tulip-protocol',
  website: 'https://tulip.garden/',
  twitter: 'https://twitter.com/TulipProtocol',
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

export const tulipMint = 'TuLipcqtGVXP9XR62wM8WWCm6a9vhLs7T1uoWBk6FDs';
export const tulipDecimals = 6;
export const vaultsKey = 'vaults';
