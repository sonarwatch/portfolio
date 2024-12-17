import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'solayer';
export const platform: Platform = {
  id: platformId,
  name: 'Solayer',
  image: 'https://sonar.watch/img/platforms/solayer.webp',
  website: 'https://solayer.org/',
  twitter: 'https://x.com/solayer_labs',
  defiLlamaId: 'parent#solayer',
};

export const programId = new PublicKey(
  'sSo1iU21jBrU9VaJ8PJib1MtorefUV4fzC9GURa2KNn'
);
export const solayersUSDCPid = new PublicKey(
  's1aysqpEyZyijPybUV89oBGeooXrR22wMNLjnG2SWJA'
);

// export const stakePoolProgramId = 'SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy'
export const solayerLstPool = 'po1osKDWYF9oiVEGmzKA4eTs8eMveFRMox3bUKazGN2';
export const solayerLstMint = 'sSo1wxKKr6zW2hqf5hZrp2CawLibcwi1pMBqk5bg2G4';
export const solayerRstMint = 'sSo14endRuUbvQaJS3dq36Q829a3A6BEfoeeRGJywEh';
export const solayersUSDMint = 'susdabGDNbhrnCa6ncrYo81u4s9GM8ecK2UwMyZiq4X';
export const solayerLstDecimals = 9;

export const avsTokens = [
  'sonickAJFiVLcYXx25X9vpF293udaWqDMUCiGtk7dg2',
  'hash4eTHsuZakZiHg5vfQwFtBaEhhC9SXRYsZm4Br7k',
  'bonkABCQVasnhyVAvB2zYFSCRMGB6xKhpthKuCnsU5K',
  '6C41vb9AqJzmbWZ4zi6eCGJz3vSKrwjxfu8N77SRRtyr',
  'phnxHvd4YcmeyhwSJqigES2jJHU67MgUuQzVXNAVz4e',
  'BGSo18NXTWGtyNa5DBBP1ZCfUFRPWj6bECrPKakn8qN',
];
