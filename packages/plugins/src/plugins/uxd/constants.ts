import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'uxd';
export const platform: Platform = {
  id: platformId,
  name: 'UXD',
  image: 'https://sonar.watch/img/platforms/uxd.webp',
  defiLlamaId: 'uxd', // from https://defillama.com/docs/api
  website: 'https://uxd.fi/',
  twitter: 'https://twitter.com/UXDProtocol',
};

export const stakingProgramId = new PublicKey(
  'UXDSkps5NR8Lu1HB5uPLFfuB34hZ6DCk7RhYZZtGzbF'
);

export const uxpMint = 'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeL2M';
export const uxpDecimal = 9;
