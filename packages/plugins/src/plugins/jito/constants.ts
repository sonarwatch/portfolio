import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';
import { platformId as fragmetricPlatformId } from '../fragmetric/constants';

export const platformId = 'jito';
export const platform: Platform = {
  id: platformId,
  name: 'Jito',
  image: 'https://sonar.watch/img/platforms/jito.webp',
  defiLlamaId: 'jito',
  website: 'https://jito.network/harvest',
  twitter: 'https://twitter.com/jito_sol',
};

export const renzoPlatformId = 'renzo';
export const renzoPlatform: Platform = {
  id: renzoPlatformId,
  name: 'Renzo',
  image: 'https://sonar.watch/img/platforms/renzo.webp',
  website: 'https://app.renzoprotocol.com/discover',
  twitter: 'https://x.com/RenzoProtocol',
};

export const kyrosPlatformId = 'kyros';
export const kyrosPlatform: Platform = {
  id: kyrosPlatformId,
  name: 'Kyros',
  image: 'https://sonar.watch/img/platforms/kyros.webp',
  website: 'https://app.kyros.fi/',
  twitter: 'https://x.com/kyrosfi',
};

export const merkleTree = 'HS8EQ8QkQSBJggY8r255AKdWbtYRtyNMoRt4LjNkkWm1';
export const merkleDistributor = 'mERKcfxMC5SqJn4Ld4BUris3WKZZ1ojjWJ3A3J5CKxv';
export const jtoMint = 'jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL';
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
