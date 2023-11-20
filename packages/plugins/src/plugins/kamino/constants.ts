import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'kamino';
export const kaminoPlatform: Platform = {
  id: platformId,
  name: 'Kamino',
  image: `https://sonar.watch/img/platforms/${platformId}.png`,
  website: 'https://kamino.finance/',
  defiLlamaId: 'parent#kamino-finance',
};
export const programId = new PublicKey(
  '6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc'
);

export const klendProgramId = new PublicKey(
  'KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD'
);
export const lendingMarket = '7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF';
export const multiplyTokens = [
  [
    'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    'So11111111111111111111111111111111111111112',
  ],
  [
    'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
  ],
  [
    'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
    'So11111111111111111111111111111111111111112',
  ],
  [
    'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
    'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
  ],
  [
    'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1',
    'So11111111111111111111111111111111111111112',
  ],
  [
    'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1',
    'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1',
  ],
];
export const marketsKey = `markets`;
export const reservesKey = `reserves`;
