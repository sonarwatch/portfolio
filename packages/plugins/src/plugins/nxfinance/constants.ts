import { PublicKey } from '@solana/web3.js';

export const platformId = 'nxfinance';
// https://nxfinance.io/nx-data/doc

export const ID = new PublicKey('RaXcyfW8jK295UAU1XN2uLMTHnTWEaeCcNWLeDB4iD6');

export const leverageFiProgramID = new PublicKey(
  'EHBN9YKtMmrZhj8JZqyBQRGqyyeHw5xUB1Q5eAHszuMt'
);

export const leverageVaultsMints = [
  '27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4', // JLP
  'jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v', // JupSOL
  'vSoLxydx6akxyMD9XEcPvGYNGq6Nn66oqVb3UkGkei7', // vSOL
  'sSo14endRuUbvQaJS3dq36Q829a3A6BEfoeeRGJywEh', // sSOL
  'HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX', // hubSOL
];

export const lendProgramId = new PublicKey(
  'NXFiKimQN3QSL3CDhCXddyVmLfrai8HK36bHKaAzK7g'
);

export const lendingPoolKey = 'lending-pools';
export const stakingPoolKey = 'staking-pool';
export const solayerPoolKey = 'solayer-pools';

export const lendingPools = [
  new PublicKey('HVn3F2wq2Fvr8T5yX7VS9yWaNxX5PMgxTyHb4aKAX8z3'),
];

export const stakePool = '2P1eeegdbEhN3bnCroJJPXiH13i4rw1XYk8ftdh9meRY';
export const stakingProgramId = '9un1MopS4NRhgVDLXB1DqoQDTmq1un48YKJuPiMLpSc9';
