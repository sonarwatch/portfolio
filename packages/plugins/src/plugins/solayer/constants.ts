import { PublicKey } from '@solana/web3.js';
import { AirdropStatics } from '../../AirdropFetcher';

export const layerMint = 'LAYER4xPpTCb3QL8S9u41EAhAX7mhBn8Q6xMTwY2Yzc';
export const platformId = 'solayer';
export const solayerLstMint = 'sSo14endRuUbvQaJS3dq36Q829a3A6BEfoeeRGJywEh';
// export const solayerRstMint = 'sSo14endRuUbvQaJS3dq36Q829a3A6BEfoeeRGJywEh';
export const solayersUSDMint = 'susdabGDNbhrnCa6ncrYo81u4s9GM8ecK2UwMyZiq4X';
export const programId = new PublicKey(
  'sSo1iU21jBrU9VaJ8PJib1MtorefUV4fzC9GURa2KNn'
);
export const solayersUSDCPid = new PublicKey(
  's1aysqpEyZyijPybUV89oBGeooXrR22wMNLjnG2SWJA'
);

export const airdropApi =
  'https://airdrop-apis-101797961016.us-central1.run.app/airdrop?walletAddr=';
export const layerDecimals = 9;
export const airdropStatics: AirdropStatics = {
  claimLink: 'https://claim.solayer.foundation/',
  emitterLink: 'https://solayer.foundation/',
  emitterName: 'Solayer',
  id: 'solayer-airdrop',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/solayer.webp',
  claimStart: 1739275200000,
  claimEnd: 1752840000000,
};

// export const stakePoolProgramId = 'SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy'
export const solayerLstPool = 'po1osKDWYF9oiVEGmzKA4eTs8eMveFRMox3bUKazGN2';
export const solayerLstDecimals = 9;
export const stakePoolMint = 'sSo1wxKKr6zW2hqf5hZrp2CawLibcwi1pMBqk5bg2G4';
export const stakePoolDecimals = 9;
export const avsTokens = [
  'sonickAJFiVLcYXx25X9vpF293udaWqDMUCiGtk7dg2',
  'hash4eTHsuZakZiHg5vfQwFtBaEhhC9SXRYsZm4Br7k',
  'bonkABCQVasnhyVAvB2zYFSCRMGB6xKhpthKuCnsU5K',
  '6C41vb9AqJzmbWZ4zi6eCGJz3vSKrwjxfu8N77SRRtyr',
  'phnxHvd4YcmeyhwSJqigES2jJHU67MgUuQzVXNAVz4e',
  'BGSo18NXTWGtyNa5DBBP1ZCfUFRPWj6bECrPKakn8qN',
];
