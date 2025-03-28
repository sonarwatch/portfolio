import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';

export const uxpMint = 'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeL2M';
export const platformId = 'uxd';
export const platform: Platform = {
  id: platformId,
  name: 'UXD',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/uxd.webp',
  defiLlamaId: 'uxd', // from https://defillama.com/docs/api
  website: 'https://uxd.fi/',
  twitter: 'https://twitter.com/UXDProtocol',
  isDeprecated: true,
  tokens: [uxpMint, '7kbnvuGBxxj8AG9qp8Scn56muWGaRaFqxg1FsRp3PaFT'],
  github: 'https://github.com/uxdprotocol',
  medium: 'https://uxdprotocol.medium.com/',
  documentation: 'https://docs.uxd.fi/uxdprotocol',
  discord: 'https://discord.gg/CAuFvvd5qw',
  description:
    'Decentralized stablecoin stabilized by an asset liability management module',
};

export const stakingProgramId = new PublicKey(
  'UXDSkps5NR8Lu1HB5uPLFfuB34hZ6DCk7RhYZZtGzbF'
);

export const uxpDecimal = 9;
export const uxpFactor = new BigNumber(10 ** uxpDecimal);
