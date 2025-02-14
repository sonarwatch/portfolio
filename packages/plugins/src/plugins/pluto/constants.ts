import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'pluto';
export const platform: Platform = {
  id: platformId,
  name: 'Pluto',
  image: 'https://sonar.watch/img/platforms/pluto.webp',
  website: 'https://pluto.so/',
  twitter: 'https://x.com/plutoleverage',
  discord: 'https://discord.com/invite/plutoleverage',
};

export const plutoProgramId = new PublicKey(
  '5UFYdXHgXLMsDzHyv6pQW9zv3fNkRSNqHwhR7UPnkhzy'
);

export const earnVaultDataSize = 1128;
export const earnLenderDataSize = 304;
export const leverageVaultDataSize = 1496;
export const leverageObligationDataSize = 6696;

export const earnVaultsKey = 'earn-vaults';
export const leveragesVaultKey = 'leverage-vaults';
export const leveragesVaultApiKey = 'leverage-vaults-api';

export const leverageVaultsApiUrl =
  'https://storage.googleapis.com/plutoso/accounts.json';
