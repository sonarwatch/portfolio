import { PublicKey } from '@solana/web3.js';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'debridge';
export const dbrMint = 'DBRiDgJAMsM95moTzJs7M9LnkGErpbv9v6CUR1DXnUu5';

export const commonStatics = {
  claimLink: 'https://debridge.foundation/checker',
  emitterLink: 'https://debridge.finance/',
  emitterName: 'deBridge',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/debridge.webp',
};
export const dbrImg = commonStatics.image;

export const firstDistribStatics: AirdropStatics = {
  ...commonStatics,
  id: `${platformId}-dis1`,
  claimStart: 1724940000000,
  claimEnd: 1747440000000,
};

export const secondDistribStatics: AirdropStatics = {
  ...commonStatics,
  id: `${platformId}-dis2`,
  claimStart: 1744876800000,
  claimEnd: 1747440000000,
};

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
