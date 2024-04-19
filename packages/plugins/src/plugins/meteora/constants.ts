import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'meteora';
export const platform: Platform = {
  id: 'meteora',
  name: 'Meteora',
  image: 'https://sonar.watch/img/platforms/meteora.png',
  defiLlamaId: 'parent#meteora',
  website: 'https://meteora.ag/',
};

export const prefixVaults = `${platformId}-vaults`;
export const farmsKey = 'farms';

export const vaultsProgramId = new PublicKey(
  '24Uqj9JCLxUeoC3hGfh5W3s9FM9uCHDS2SG3LYwBpyTi'
);

export const poolsProgramId = new PublicKey(
  'Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB'
);

export const farmProgramId = new PublicKey(
  'FarmuwXPWXvefWUeqFAa5w6rifLkq5X6E8bimYvrhCB1'
);

export const dlmmProgramId = new PublicKey(
  'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo'
);
