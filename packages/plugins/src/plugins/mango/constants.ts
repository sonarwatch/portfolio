import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'mango';
export const mangoPlatform: Platform = {
  id: platformId,
  name: 'Mango',
  image: 'https://alpha.sonar.watch/img/platforms/mango.png',
  defiLlamaId: 'parent#mango-markets',
};
export const banksPrefix = `${platformId}-banks`;
export const rootBankPrefix = `${platformId}-rootBank`;
export const groupPrefix = `${platformId}-group`;

export const MangoProgram = new PublicKey(
  '4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg'
);

export const redeemProgramId = new PublicKey(
  'mv3ekLzLbnVPNxjSKvqBpU3ZeZXPQdEC3bp5MDEBG68'
);

export const otherProgram = new PublicKey(
  'm3roABq4Ta3sGyFRLdY4LH1KN16zBtg586gJ3UxoBzb'
);
