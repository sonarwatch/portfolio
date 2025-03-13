import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';
import { platformId as fragmetricPlatformId } from '../fragmetric/constants';

export const platformId = 'jito';
export const jtoMint = 'jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL';
export const jitoSOLMint = 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn';
export const platform: Platform = {
  id: platformId,
  name: 'Jito',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/jito.webp',
  defiLlamaId: 'jito',
  website: 'https://jito.network/harvest',
  twitter: 'https://twitter.com/jito_sol',
  documentation: 'https://www.jito.network/docs/jitosol/overview/',
  github: 'https://github.com/jito-foundation',
  description: "Earn MEV rewards through Jito's Solana Liquid Staking pool.",
  medium: 'https://medium.com/@Jito-Foundation',
  discord: 'https://discord.gg/jito',
  tokens: [jtoMint, jitoSOLMint],
};

export const renzoPlatformId = 'renzo';
export const renzoPlatform: Platform = {
  id: renzoPlatformId,
  name: 'Renzo',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/renzo.webp',
  website: 'https://app.renzoprotocol.com/discover',
  twitter: 'https://x.com/RenzoProtocol',
  github: 'https://github.com/Renzo-Protocol',
  discord: 'https://discord.gg/renzoprotocol',
  telegram: 'https://t.me/RenzoProtocolChat',
  documentation: 'https://docs.renzoprotocol.com/docs/',
  defiLlamaId: 'renzo',
  tokens: ['ezSoL6fY1PVdJcJsUpe5CM3xkfmy3zoVCABybm5WtiC'],
  description:
    'Renzo is a restaking protocol that abstracts and manages AVS strategies for Liquid Restaking Tokens (LRTs), making Ethereum and Solana restaking ezpz and accessible to everyone.',
};

export const kyrosPlatformId = 'kyros';
export const kyrosPlatform: Platform = {
  id: kyrosPlatformId,
  name: 'Kyros',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/kyros.webp',
  website: 'https://app.kyros.fi/',
  twitter: 'https://x.com/kyrosfi',
};

export const merkleTree = 'HS8EQ8QkQSBJggY8r255AKdWbtYRtyNMoRt4LjNkkWm1';
export const merkleDistributor = 'mERKcfxMC5SqJn4Ld4BUris3WKZZ1ojjWJ3A3J5CKxv';
export const jtoDecimals = 9;
export const airdropUrl = 'https://airdrop.jito.network/status/';

export const restakingPid = new PublicKey(
  'Vau1t6sLNxnzB7ZDsef8TLbPLfyZMYXH8WTNqUdm9g8'
);
export const restakingVaultsKey = 'restaking-vaults';

export const platformIdByVault = new Map([
  ['CugziSqZXcUStNPXbtRmq6atsrHqWY2fH2tAhsyApQrV', renzoPlatformId],
  ['CQpvXgoaaawDCLh8FwMZEwQqnPakRUZ5BnzhjnEBPJv', kyrosPlatformId],
  ['HR1ANmDHjaEhknvsTaK48M5xZtbBiwNdXM5NTiWhAb4S', fragmetricPlatformId],
]);
