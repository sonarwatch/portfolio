import { Platform } from '@sonarwatch/portfolio-core';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { PublicKey } from '@solana/web3.js';
import { PlutoIDL } from './idl';

export const platformId = 'pluto';
export const platform: Platform = {
  id: platformId,
  name: 'Pluto',
  image: 'https://risk.pluto.so/images/pluto.svg',
  website: 'https://pluto.so/',
  twitter: 'https://x.com/plutoleverage',
  discord: 'https://discord.com/invite/plutoleverage'
};

export const plutoProgramId = new PublicKey(
  '8n3FHwYxFgQCQc2FNFkwDUf9mcqupxXcCvgfHbApMLv3'
);

export const plutoProgramIdl = {
  programId: plutoProgramId.toString(),
  idl: PlutoIDL,
  idlType: 'anchor',
} as IdlItem;


export const plutoServer = 'https://pluto-sonarwatch-service-259181308485.asia-southeast1.run.app/';
export const leverageVaultJson = 'https://storage.googleapis.com/plutoso/accounts.json';


export const earnVaultsKey = 'pluto-earn-vaults';
export const leverageVaultKey = 'pluto-leverage-vaults';

