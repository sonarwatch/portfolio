import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';
import { LendingMarketConfig } from './types';

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
export const farmProgramId = new PublicKey(
  'FarmsPZpWu9i7Kky8tPN37rs2TpmMrAZrC7S7vJa91Hr'
);
export const farmsKey = 'farms';
export const mainMarket = '7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF';

export const lendingConfigs: Map<string, LendingMarketConfig> = new Map([
  [
    '7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF',
    {
      name: 'Main Market',
      multiplyPairs: [
        [
          'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
          'So11111111111111111111111111111111111111112',
        ],
        [
          'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
          'So11111111111111111111111111111111111111112',
        ],
        [
          'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1',
          'So11111111111111111111111111111111111111112',
        ],
      ],
      leveragePairs: [
        [
          '6DNSN2BJsaPFdFFc1zP37kkeNe4Usc1Sqkzr9C9vPWcU',
          'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        ],
        [
          'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
          'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        ],
        [
          'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1',
          'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        ],
        [
          'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
          'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        ],
        [
          'So11111111111111111111111111111111111111112',
          'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        ],
        [
          '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
          'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        ],
        [
          'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
          'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        ],
      ],
    },
  ],
  ['DxXdAyU3kCjnyggvHmY5nAwg5cRbbmdyX3npfDMjjMek', { name: 'JLP Market' }],
  ['ByYiZxp8QrdN9qbdtaAiePN8AAr3qvTPppNJDpf5DVJ5', { name: 'Altcoins Market' }],
]);

export const marketsKey = `markets`;
export const reservesKey = `reserves`;
