import { PublicKey } from '@solana/web3.js';
import { solanaNativeWrappedAddress } from '@sonarwatch/portfolio-core';
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
        [mSOLMint, solanaNativeWrappedAddress],
        [jitoSOLMint, solanaNativeWrappedAddress],
        [
          'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1',
          solanaNativeWrappedAddress,
        ],
        [
          'jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v',
          solanaNativeWrappedAddress,
        ],
        [
          'he1iusmfkpAdwvxLNGV8Y1iSbj4rUy6yMhEA3fotn9A',
          solanaNativeWrappedAddress,
        ],
        [
          'vSoLxydx6akxyMD9XEcPvGYNGq6Nn66oqVb3UkGkei7',
          solanaNativeWrappedAddress,
        ],
        [
          'HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX',
          solanaNativeWrappedAddress,
        ],
        [
          'BNso1VUJnh4zcfpZa6986Ea66P6TCp59hvtNJ8b1X85',
          solanaNativeWrappedAddress,
        ],
        [
          'picobAEvs6w7QEknPce34wAE4gknZA9v5tTonnmHYdX',
          solanaNativeWrappedAddress,
        ],
        [
          'LAinEtNLgpmCP9Rvsf5Hn8W6EhNiKLZQti1xfWMLy6X',
          solanaNativeWrappedAddress,
        ],
        [
          'CgnTSoL3DgY9SFHxcLj6CgCgKKoTBr6tp4CPAEWy25DE',
          solanaNativeWrappedAddress,
        ],
        [
          'Dso1bDeDjCQxTrWHqUUi63oBvV7Mdm6WaobLbQ7gnPQ',
          solanaNativeWrappedAddress,
        ],
        [
          'Bybit2vBJGhPF52GBdNaQfUJ6ZpThSgHBobjWZpLPb4B',
          solanaNativeWrappedAddress,
        ],
      ],
      leveragePairs: [
        ['6DNSN2BJsaPFdFFc1zP37kkeNe4Usc1Sqkzr9C9vPWcU', usdcSolanaMint],
        [jitoSOLMint, usdcSolanaMint],
        ['bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1', usdcSolanaMint],
        [mSOLMint, usdcSolanaMint],
        [solanaNativeWrappedAddress, usdcSolanaMint],
        ['7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs', usdcSolanaMint],
        ['Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', usdcSolanaMint],
        ['3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh', usdcSolanaMint],
        ['2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH', usdcSolanaMint],
        ['cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij', usdcSolanaMint],
        [
          solanaNativeWrappedAddress,
          '2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH',
        ],
        [
          'cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij',
          '2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH',
        ],
        [jitoSOLMint, '2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH'],
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
        [
          '27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4',
          '2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH', // USDG
        ],
      ],
    },
  ],
  [
    'ByYiZxp8QrdN9qbdtaAiePN8AAr3qvTPppNJDpf5DVJ5',
    {
      name: 'Altcoins Market',
      leveragePairs: [
        ['EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', usdcSolanaMint],
        ['Grass7B4RdKfBCjTKgSqnXkqjwiGvQyFbuSCUJr3XXjs', usdcSolanaMint],
      ],
    },
  ],
  ['BJnbcRHqvppTyGesLzWASGKnmnF1wq9jZu6ExrjT7wvF', { name: 'Ethena Market' }],
  [
    'H6rHXmXoCQvq8Ue81MqNh7ow5ysPa1dSozwW3PU1dDH6',
    {
      name: 'Jito Market',
      multiplyPairs: [
        [jitoSOLMint, solanaNativeWrappedAddress],
        [
          'ezSoL6fY1PVdJcJsUpe5CM3xkfmy3zoVCABybm5WtiC',
          solanaNativeWrappedAddress,
        ],
      ],
    },
  ],
  [
    '4UwtBqa8DDtcWV6nWFregeMVkGdfWfiYeFxoHaR2hm9c',
    {
      name: 'Fartcoin Market',
      leveragePairs: [
        ['9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump', usdcSolanaMint],
      ],
    },
  ],
  ['GMqmFygF5iSm5nkckYU6tieggFcR42SyjkkhK5rswFRs', { name: 'Bitcoin Market' }],
  ['3EZEy7vBTJ8Q9PWxKwdLVULRdsvVLT51rpBG3gH1TSJ5', { name: 'Jupiter Market' }],
  ['9wmqLq3n3KdQBbNfwqrF3PwcLgZ9edZ7hW5TsaC3o6uj', { name: 'JTO Market' }],
  [
    'GVDUXFwS8uvBG35RjZv6Y8S1AkV5uASiMJ9qTUKqb5PL',
    {
      name: 'Marinade Market',
      multiplyPairs: [[mSOLMint, solanaNativeWrappedAddress]],
    },
  ],
  [
    'F4Pn9mAvbUazDmWET5yYATTiyLHLaCRTWgGex4tiMXAs',
    { name: 'Exponent PT-SOL Market' },
  ],
  [
    '7WQeTuLsFrZsgnHW7ddFdNfhfJAViqH4mvcFZPQ5zuQ9',
    {
      name: 'Bonk Market',
      leveragePairs: [
        ['DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', usdcSolanaMint],
        [
          'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
          '2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH',
        ],
      ],
    },
  ],
  [
    'SZ8MbzSojH84K41jYGUvMJDSCTCWgemh3vanWtCx181',
    { name: 'rstSOL/bbSOL Leverage Market' },
  ],
  [
    'eNLm5e5KVDX2vEcCkt75PpZ2GMfXcZES3QrFshgpVzp',
    {
      name: 'Sanctum Market',
      multiplyPairs: [
        [
          '5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm',
          solanaNativeWrappedAddress,
        ],
      ],
    },
  ],
  [
    'C7h9YnjPrDvNhe2cWWDhCu4CZEB1XTTH4RzjmsHuengV',
    {
      name: 'GM-Solblaze',
      multiplyPairs: [
        [
          'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1',
          solanaNativeWrappedAddress,
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
