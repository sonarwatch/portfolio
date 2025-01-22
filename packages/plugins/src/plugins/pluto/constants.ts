import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'pluto';
export const platform: Platform = {
  id: platformId,
  name: 'Pluto',
  image: 'https://risk.pluto.so/images/pluto.svg',
  website: 'https://pluto.so/',
  twitter: 'https://x.com/plutoleverage',
  discord: 'https://discord.com/invite/plutoleverage'
};

export const plutoServer = 'https://pluto-sonarwatch-service-259181308485.asia-southeast1.run.app/';
export const leverageVaultJson = 'https://storage.googleapis.com/plutoso/accounts.json';

export const earnVaultsKey = 'pluto-earn-vaults';
export const leverageVaultKey = 'pluto-leverage-vaults';