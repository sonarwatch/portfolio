import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'meteora';
export const platform: Platform = {
  id: 'meteora',
  name: 'Meteora',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/meteora.webp',
  defiLlamaId: 'parent#meteora',
  website: 'https://meteora.ag/',
  github: 'https://github.com/MeteoraAg',
  documentation: 'https://docs.meteora.ag/',
  discord: 'https://discord.gg/WwFwsVtvpH',
  description: 'Building the most dynamic liquidity protocols in DeFi.',
  twitter: 'https://x.com/MeteoraAG',
};

export const prefixVaults = `${platformId}-vaults`;
export const farmsKey = 'farms';
export const dlmmVaultsKey = 'dlmm-vaults-1';
export const feeVaultsKey = 'fee-vaults';

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

export const dlmmVaultProgramId = new PublicKey(
  'vaU6kP7iNEGkbmPkLmZfGwiGxd4Mob24QQCie5R9kd2'
);

export const stakeForFeeProgramId = new PublicKey(
  'FEESngU3neckdwib9X3KWqdL7Mjmqk9XNp3uh5JbP4KP'
);
