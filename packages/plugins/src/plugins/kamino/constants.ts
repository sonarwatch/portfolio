import { PublicKey } from '@solana/web3.js';
import { LendingMarketConfig } from './types';
import { AirdropStatics } from '../../AirdropFetcher';
import { mSOLMint } from '../marinade/constants';
import { usdcSolanaMint } from '../../utils/solana';
import { jitoSOLMint } from '../jito/constants';

export const platformId = 'kamino';
export const kmnoMint = 'KMNo3nJsBXfcpJTVhZcXLW7RmTwTt4GVFE7suUBo9sS';

export const kmnoDecimals = 6;
export const programId = new PublicKey(
  '6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc'
);

export const allocationApiUrl =
  'https://api.hubbleprotocol.io/v2/airdrop/users/';

export const klendProgramId = new PublicKey(
  'KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD'
);
export const farmProgramId = new PublicKey(
  'FarmsPZpWu9i7Kky8tPN37rs2TpmMrAZrC7S7vJa91Hr'
);
export const farmsKey = 'farms';
export const elevationGroupsKey = 'elevatorGroups';
export const mainMarket = '7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF';

export const lendingConfigs: Map<string, LendingMarketConfig> = new Map([
  [
    '7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF',
    {
      name: 'Main Market',
      multiplyPairs: [
        [mSOLMint, 'So11111111111111111111111111111111111111112'],
        [
          'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
          'So11111111111111111111111111111111111111112',
        ],
        [
          'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1',
          'So11111111111111111111111111111111111111112',
        ],
        [
          'jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v',
          'So11111111111111111111111111111111111111112',
        ],
        [
          'he1iusmfkpAdwvxLNGV8Y1iSbj4rUy6yMhEA3fotn9A',
          'So11111111111111111111111111111111111111112',
        ],
        [
          'vSoLxydx6akxyMD9XEcPvGYNGq6Nn66oqVb3UkGkei7',
          'So11111111111111111111111111111111111111112',
        ],
        [
          'HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX',
          'So11111111111111111111111111111111111111112',
        ],
        [
          'BNso1VUJnh4zcfpZa6986Ea66P6TCp59hvtNJ8b1X85',
          'So11111111111111111111111111111111111111112',
        ],
        [
          'picobAEvs6w7QEknPce34wAE4gknZA9v5tTonnmHYdX',
          'So11111111111111111111111111111111111111112',
        ],
        [
          'LAinEtNLgpmCP9Rvsf5Hn8W6EhNiKLZQti1xfWMLy6X',
          'So11111111111111111111111111111111111111112',
        ],
      ],
      leveragePairs: [
        ['6DNSN2BJsaPFdFFc1zP37kkeNe4Usc1Sqkzr9C9vPWcU', usdcSolanaMint],
        [jitoSOLMint, usdcSolanaMint],
        ['bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1', usdcSolanaMint],
        [mSOLMint, usdcSolanaMint],
        ['So11111111111111111111111111111111111111112', usdcSolanaMint],
        ['7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs', usdcSolanaMint],
        ['Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', usdcSolanaMint],
        ['3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh', usdcSolanaMint],
        ['2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH', usdcSolanaMint],
      ],
    },
  ],
  [
    'DxXdAyU3kCjnyggvHmY5nAwg5cRbbmdyX3npfDMjjMek',
    {
      name: 'JLP Market',
      multiplyPairs: [
        [
          '27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4',
          'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        ],
        [
          '27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4',
          '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo',
        ],
        [
          '27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4',
          'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        ],
      ],
    },
  ],
  ['ByYiZxp8QrdN9qbdtaAiePN8AAr3qvTPppNJDpf5DVJ5', { name: 'Altcoins Market' }],
  ['BJnbcRHqvppTyGesLzWASGKnmnF1wq9jZu6ExrjT7wvF', { name: 'Ethena Market' }],
  [
    'H6rHXmXoCQvq8Ue81MqNh7ow5ysPa1dSozwW3PU1dDH6',
    {
      name: 'Jito Market',
      multiplyPairs: [
        [
          'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
          'So11111111111111111111111111111111111111112',
        ],
      ],
    },
  ],
]);

export const marketsKey = `markets`;
export const reservesKey = `reserves`;
export const airdropStaticsS1: AirdropStatics = {
  claimStart: 1714478400000,
  claimEnd: 1723791000000,
  id: 'kamino-s1',
  emitterName: 'Kamino',
  emitterLink: 'https://app.kamino.finance/',
  claimLink: 'https://app.kamino.finance/genesis',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/kamino.webp',
  name: 'S1',
};
export const airdropStaticsS2: AirdropStatics = {
  claimStart: 1724340000000,
  claimEnd: undefined,
  id: 'kamino-s2',
  emitterName: 'Kamino',
  emitterLink: 'https://app.kamino.finance/',
  claimLink: 'https://app.kamino.finance/season-2-airdrop',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/kamino.webp',
  name: 'S2',
};

export const limitOrderProgramId = new PublicKey(
  'LiMoM9rMhrdYrfzUCxQppvxCSG1FcrUK9G8uLq4A1GF'
);
