import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'debridge';
export const platform: Platform = {
  id: platformId,
  name: 'deBridge',
  image: 'https://sonar.watch/img/platforms/debridge.webp',
  website: 'https://debridge.finance/',
  twitter: 'https://x.com/deBridgeFinance',
  defiLlamaId: 'debridge', // from https://defillama.com/docs/api
};

export const commonStatics = {
  claimLink: 'https://debridge.foundation/',
  emitterLink: 'https://debridge.finance/',
  emitterName: 'deBridge',
  image: 'https://sonar.watch/img/platforms/debridge.webp',
};

export const firstDistribStatics: AirdropStatics = {
  ...commonStatics,
  id: `${platformId}-dis1`,
  claimEnd: undefined,
  claimStart: 1724940000000,
};

export const vestedDistributionStatics: AirdropStatics = {
  ...commonStatics,
  id: `${platformId}-dis1-vested`,
  claimEnd: undefined,
  claimStart: 1740751200000,
};

export const staticsByTitle: Map<string, AirdropStatics> = new Map([
  ['First Distribution', firstDistribStatics],
  [
    'Claim 50% vested with bonus in 6 months after TGE',
    vestedDistributionStatics,
  ],
]);

export const dbrMint = 'DBRiDgJAMsM95moTzJs7M9LnkGErpbv9v6CUR1DXnUu5';
export const dbrDecimals = 6;
export const apiUrl =
  'https://points-api.debridge.foundation/api/TokenDistribution/';

export const dlmmVaultProgramId = new PublicKey(
  'DBrLFG4dco1xNC5Aarbt3KEaKaJ5rBYHwysqZoeqsSFE'
);

export const distributorPid = new PublicKey(
  'DeDRoPXNyHRJSagxZBBqs4hLAAM1bGKgxh7cyfuNCBpo'
);
export const receiptBuffer = Buffer.from('receipt', 'utf-8');
