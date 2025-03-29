import { PublicKey } from '@solana/web3.js';
import { platformId as fragmetricPlatformId } from '../fragmetric/constants';

export const platformId = 'jito';
export const jtoMint = 'jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL';
export const jitoSOLMint = 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn';

export const renzoPlatformId = 'renzo';
export const kyrosPlatformId = 'kyros';

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
