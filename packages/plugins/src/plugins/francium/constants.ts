import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { LendInfoItem } from './types';
import { TOKENS } from './tokens';
import { LendRewardInfo } from './structs';
import { mSOLMint } from '../marinade/constants';

export const platformId = 'francium';
export const platform: Platform = {
  id: platformId,
  name: 'Francium',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/francium.webp',
  website: 'https://francium.io/',
  twitter: 'https://x.com/Francium_Defi',
  defiLlamaId: 'francium', // from https://defillama.com/docs/api
  isDeprecated: true,
  discord: 'discord.gg/francium',
  github: 'https://github.com/Francium-DeFi',
  telegram: 'https://t.me/franciumprotocol',
  medium: 'https://francium-defi.medium.com/',
  description:
    'Francium is a DeFi yield strategy Platform on Solana, providing leveraged/hedged farming, DeFi strategies & on-chain trading strategies.',
};

export const lendingPoolsCacheKey = 'lending_pools';

// https://github.com/Francium-DeFi/francium-sdk/blob/6b284e8d8af3178fc6815dfc8fb50dfd90d160ca/src/constants/lend/pools.ts
export const lendProgramId = new PublicKey(
  'FC81tbGt6JWRXidaWYFXxGnTk4VgobhJHATvTRVMqgWj'
);

export const lendingPools: {
  [x: string]: LendInfoItem;
} = {
  USDC: {
    lookupTableAddress: new PublicKey(
      '8zkUc4NeXDoFp8UBDQ3sPVKbBAHNHdvNbeRm1tupEHS9'
    ),
    programId: lendProgramId,
    tokenMint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), // usdc
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),
    lendingPoolInfoAccount: new PublicKey(
      'Hx6LbkMHe69DYawhPyVNs8Apa6tyfogfzQV6a7XkwBUU'
    ),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolTknAccount: new PublicKey(
      'CFp9kt8z3Epb1QSiEp3xA44KbSwuJxhFR3wQoerFqYS9'
    ),
    lendingPoolFeeAccount: new PublicKey(
      'CugsLyJk1Jghc7LkgvnFuUwshJhz1FE9mpkF7Z4acAMU'
    ),
    lendingPoolShareMint: new PublicKey(
      '62fDf5daUJ9jBz8Xtj6Bmw1bh1DvHn8AG4L9hMmxCzpu'
    ),
    lendingPoolShareAccount: new PublicKey(
      'Gyc1V1xbA9NjzuURE662ATw6W4AdhwvsL26yUnSGhbkz'
    ),
    lendingPoolCreditMint: new PublicKey(
      'CZ2s85dnuAVyGbRWBNauHZwj9oTV2i9xTvFwc1Cedr7E'
    ),
    lendingPoolCreditAccount: new PublicKey(
      'Bd71jEvypKFs8N5gByyhD2149tSqLy4PVAzFFShCTJTB'
    ),
  },
  PAI: {
    lookupTableAddress: new PublicKey(
      '2E8tZ5SLctXECt74ooLxDf4Wz5dwngpoKwc6z7Mn987S'
    ),
    programId: lendProgramId,
    tokenMint: new PublicKey('Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS'), // pai
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),
    lendingPoolInfoAccount: new PublicKey(
      'EzofB5BK23PHDfEAThk5oJANb9FWTXzezrafiTDzcBBA'
    ),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolTknAccount: new PublicKey(
      '4Kvd1ULAy45k2EQt1pdePa82UBz9tW6N1rLJWb3EAJgQ'
    ),
    lendingPoolFeeAccount: new PublicKey(
      'sKmPL3zkAf7777bhXnMaSfTU1jg1keNHNPz38wBTNd5'
    ),
    lendingPoolShareMint: new PublicKey(
      'HDvD8a4VWbkHNG7hb4CBumNhn41DyKL51qVYBNH73o23'
    ),
    lendingPoolShareAccount: new PublicKey(
      '9tk9XwzJt1J2DoNcBtBmGMsnbnwvMUAoJF1pjdcfJe2E'
    ),
    lendingPoolCreditMint: new PublicKey(
      'HkMze549cFMdLMRDsJyfH8n6EE5jjTuVZr9re4WRYuk9'
    ),
    lendingPoolCreditAccount: new PublicKey(
      '7h8YziEXSZgyzqDb5c6PP3uUztQR7hQHwqyWWe9BTqY3'
    ),
  },
  RAY: {
    lookupTableAddress: new PublicKey(
      'Fe8sni23YSFGqZTLpTia6y6fUmbyzao22wJy1hBqGSx'
    ),
    programId: lendProgramId,
    tokenMint: new PublicKey('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'), // ray
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),
    lendingPoolInfoAccount: new PublicKey(
      'ENZ7vdrvNGdAfVa8DoGpT2GrfoSFUtWKRoesf2dvqpuq'
    ),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolTknAccount: new PublicKey(
      'BUK8XbZeEqVULYRxGp4Va2R1BRqrYzXDrCVnWt6B7TZf'
    ),
    lendingPoolFeeAccount: new PublicKey(
      'C2HJD7r6NYCCVoXPPExxYEQ73LZJ3qmb5H13GnwMZfwa'
    ),
    lendingPoolShareMint: new PublicKey(
      '5uZERkJVyhCABEdocEssPZyMXYa8GJpLhngi95yXr9jc'
    ),
    lendingPoolShareAccount: new PublicKey(
      'GrVpvHCRkTHESGwyaj4gtNLn95NAdkBSnZbKusoFumup'
    ),
    lendingPoolCreditMint: new PublicKey(
      'GZqhoJhN1bz5Frq9GCaUSJ2nimnizXzHwsH12Qgh4YmR'
    ),
    lendingPoolCreditAccount: new PublicKey(
      '6EZzqDqfTfdoFF4KD1gmki3btEHfULK4SjNcuJMTEDUt'
    ),
  },
  USDT: {
    lookupTableAddress: new PublicKey(
      '8T9RNbWAWuPgKXgV5EaQV8kvo9fbGjmLmt4XzwFimn1c'
    ),
    programId: lendProgramId,
    tokenMint: new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'), // usdt
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),
    lendingPoolInfoAccount: new PublicKey(
      'EyqWUeme2B1dhuwJvJVi2coYPcGWmWrakcpsSFeikrhb'
    ),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolTknAccount: new PublicKey(
      'Acx3Ky9pk8CyYftA9HYF31EbVhBDi21EqJsFtMW2XxXW'
    ),
    lendingPoolFeeAccount: new PublicKey(
      '7gAN5Y4hGAG2A9vyr9dURGosjmo4Rwiaqz4iKZGNenE1'
    ),
    lendingPoolShareMint: new PublicKey(
      '8TtsTZQ6mU4YSW5jw4sDjSDEG1CW8QLpK7C9g5TVgBvn'
    ),
    lendingPoolShareAccount: new PublicKey(
      'EfLgyXRGFi9MUCMgrsFBuAJ7pMPXBceKhD6x4PgdvLLc'
    ),
    lendingPoolCreditMint: new PublicKey(
      'CoheXVD8cAdVaKznfay22dBpfML5Fbz5g4j67syKgRg4'
    ),
    lendingPoolCreditAccount: new PublicKey(
      'EAQxDXsA6RXxWtA1PwZNnTnj2MapHBtMzvUmfuGPJCPX'
    ),
  },
  SRM: {
    lookupTableAddress: new PublicKey(
      'E7Rf4v3DroXQ4Q2Aon5FsqtDvduNuXEXqCcoKoD8UYoj'
    ),
    programId: lendProgramId,
    tokenMint: new PublicKey('SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt'), // srm
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),
    lendingPoolInfoAccount: new PublicKey(
      'B1zB1EuTjnFPLdwySeBYhzeAf3h9buWLbDoG7AHcUTMF'
    ),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolTknAccount: new PublicKey(
      'FLQtBThLEVvhXdKqq2CREL8sFt8jAFS8szm4HaMYqmJk'
    ),
    lendingPoolFeeAccount: new PublicKey(
      'FdSBYwMEfy21H3k64cvYdir3mxzmnZotiYUsC5iPPoxM'
    ),
    lendingPoolShareMint: new PublicKey(
      '6CZhCFwA7hbqDEoVUQdFpHaCGQU7fSSwhaJWdG4DmsQ6'
    ),
    lendingPoolShareAccount: new PublicKey(
      'C3EjtH3hVuLrU3j1y5ArMFRbAhxFf5hXNfk3b9SU91qN'
    ),
    lendingPoolCreditMint: new PublicKey(
      'DqKuxgMxLPDCXtoQzLG1p85S2i3tP3EaeUVDAw7P8Nt4'
    ),
    lendingPoolCreditAccount: new PublicKey(
      'Ednqn9Zo5HpDX2DRmCWu6x46ZXnHNmTmrq9G8hrTuBnz'
    ),
  },
  ETH: {
    lookupTableAddress: new PublicKey(
      '5M7vfgfzqT4F5QJyb7w9YqGPrVXBLhQa7sqVRfmd5NE7'
    ),
    programId: lendProgramId,
    tokenMint: new PublicKey('2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk'), // eth
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),
    lendingPoolInfoAccount: new PublicKey(
      'CKMQxUz1nkn3NS5B9AUD1uyWNL8iN2piG9LVt1RvWXzj'
    ),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolTknAccount: new PublicKey(
      '9MH38iiDX4Pk37U6TXLqz2783RspNhwBTYwBNHp8WUzP'
    ),
    lendingPoolFeeAccount: new PublicKey(
      '8UPe7Fcm2f1QEFQh2YNr1jg2vgQmj4CXhLYEWgStHd8B'
    ),
    lendingPoolShareMint: new PublicKey(
      'B8QXcUv5FFwyHH5V88g6PhYBc8fQvwSpza4C9PsiRpQD'
    ),
    lendingPoolShareAccount: new PublicKey(
      'C5X2Q2K2jQtwpuqHKnLVJ1ZsvL9BMRwddMgqaQ5UGNkC'
    ),
    lendingPoolCreditMint: new PublicKey(
      'BKKbCDggM83SPLFd1jRPu1ZsCv9nXkwZVne11N9FEs9w'
    ),
    lendingPoolCreditAccount: new PublicKey(
      '9A3KAmmv1VyqNqVGBM6T9b1dp9Ax9xxdeXEgedo8U7Gh'
    ),
  },
  SOL: {
    lookupTableAddress: new PublicKey(
      '4DoNrJQqMB2kG31bzKxVdgKWqB4rrCNt3bVbAzUd4Tmg'
    ),
    programId: lendProgramId,
    tokenMint: new PublicKey('So11111111111111111111111111111111111111112'), // wsol
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),
    lendingPoolInfoAccount: new PublicKey(
      'EnZC8MB6QLTxwN1LNqCXYC7XMpvXqitnYQPf5y5AcQRn'
    ),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolTknAccount: new PublicKey(
      'GiJwrxQW5NQWWAva4rnDMXwHxfrhyUzwMX5to1pmCCgF'
    ),
    lendingPoolFeeAccount: new PublicKey(
      '2BDZqoVKAX3PJKeZJytjk7oEpbUu3jvdgdi6tA8VusnY'
    ),
    lendingPoolShareMint: new PublicKey(
      '92Zst3rEoJsyZUW2yNc2811GtkBwFrm3tqgxMTtFWuSB'
    ),
    lendingPoolShareAccount: new PublicKey(
      'Hyi1jMgc9MMEZyaG9ziL2PvT7zbeRNKhb5K1kj9bxz4x'
    ),
    lendingPoolCreditMint: new PublicKey(
      '7x61NrCzeekHwgW5Nk4afMg2sxjMK6RyMkx8tCzzX4qG'
    ),
    lendingPoolCreditAccount: new PublicKey(
      'WuPCgCuyLSXatdjyWqkGjCPSQFgKLwcfsNR9fDq3hVL'
    ),
  },
  ORCA: {
    lookupTableAddress: new PublicKey(
      '2iiSgXsQv5Ej6m68KkP7uU1jCZwy2Py1RhwLkG91PBt4'
    ),
    programId: lendProgramId,
    tokenMint: new PublicKey('orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE'), // orca
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),
    lendingPoolInfoAccount: new PublicKey(
      '9bo5JunUhp4XD7TDeeS9ARvWTYGBYtuQKUHGUb7RRvkf'
    ),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolTknAccount: new PublicKey(
      'F3EhkuRuZaYNY2bLTosjv6V7QXiZ8db9nXTZeLnmHC7V'
    ),
    lendingPoolFeeAccount: new PublicKey(
      'F3EhkuRuZaYNY2bLTosjv6V7QXiZ8db9nXTZeLnmHC7V'
    ),
    lendingPoolShareMint: new PublicKey(
      'DKoKBD7YheCGZjWp5CaHDPtheAcUveRSMvWkaivbNzWh'
    ),
    lendingPoolShareAccount: new PublicKey(
      'AMUE9EgiEiTP1YVBicwTVGtumBypR5thjTgbsXZM2PPG'
    ),
    lendingPoolCreditMint: new PublicKey(
      'CJNd1LZZxZr243dpNN9DtEavXn65kstrg251MPb8vmwW'
    ),
    lendingPoolCreditAccount: new PublicKey(
      '74m1zyzV8x9d8kZLEaVaNWRsnx8pH47tfX8cquot11ef'
    ),
  },
  mSOL: {
    lookupTableAddress: new PublicKey(
      'A9L7C5QMNG5yBjntCxjo4tkxmu2AHiNP5ev9uBtLUMfE'
    ),
    programId: lendProgramId,
    tokenMint: new PublicKey(mSOLMint),
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolInfoAccount: new PublicKey(
      '492Hr5QDQyrsLcyXqMZ7A5osjmqwtn4cdKNQLDBYBzvy'
    ),
    lendingPoolTknAccount: new PublicKey(
      'ADW9ZJuRQ9xbzTtWCwX1Th24Vxq7GWHWwYtctrbyjSr1'
    ),
    lendingPoolFeeAccount: new PublicKey(
      'ADW9ZJuRQ9xbzTtWCwX1Th24Vxq7GWHWwYtctrbyjSr1'
    ),
    lendingPoolShareMint: new PublicKey(
      '4mntRxKJWib1YTWNV4aLfszF6FeziBHdwnNAwGSfKKMX'
    ),
    lendingPoolShareAccount: new PublicKey(
      'EbWWhmDLKXDdq2guubVJCdSztuUaN6XhtwVMy9TMMwtV'
    ),
    lendingPoolCreditMint: new PublicKey(
      'Fdu3QfaQ9VL4GF85NrkpzhKRAJECv9cx7gchHca5MsRt'
    ),
    lendingPoolCreditAccount: new PublicKey(
      'HdTwUP1U3WQ1EnYPP8c8mx8sqHhXYQ9zwKVsLGxWi7W1'
    ),
  },
  BTC: {
    lookupTableAddress: new PublicKey(
      'HUT8P5M4buU38F361SC8Zzp5VPAHfMbmL4aAzoyLdVp6'
    ),
    programId: lendProgramId,
    tokenMint: new PublicKey('9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E'),
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolInfoAccount: new PublicKey(
      'DxAuEAxKYXsKMYG5Ma4TM8AsrAo7LQBSnbEGicU7i1ek'
    ),
    lendingPoolTknAccount: new PublicKey(
      '2MN34BxuLVrjZpKYKHmW1c6ZGeQs4aWQRrEvmrYfZdtG'
    ),
    lendingPoolFeeAccount: new PublicKey(
      '2MN34BxuLVrjZpKYKHmW1c6ZGeQs4aWQRrEvmrYfZdtG'
    ),
    lendingPoolShareMint: new PublicKey(
      '2G9iwy9zfLaXB2bFiqSA7YbKEvtAEXVmdvGTF28jQVgg'
    ),
    lendingPoolShareAccount: new PublicKey(
      'HGejymLhai1TDvRA4vBEbS5VRbKP1u74ZdzZcv8Y2o1M'
    ),
    lendingPoolCreditMint: new PublicKey(
      '6WzqPd81AqsCwbXp33A6ro87axfD9je32hn3JE4KsnGi'
    ),
    lendingPoolCreditAccount: new PublicKey(
      'E7HkZYeY8mqrtC45kusWiArqLNpGnV5Foioj6yEPHB1y'
    ),
  },
  whETH: {
    lookupTableAddress: new PublicKey(
      '9YyTJSjV9YK4GgW4oKETJQcEJyHTCCDU1TwVFZu41Cjs'
    ),
    programId: lendProgramId,
    tokenMint: new PublicKey('7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs'),
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolInfoAccount: new PublicKey(
      'EEokU6r9bBdTz1umHjGhkjgfikARsJzJBXhYxnTmN4Xk'
    ),
    lendingPoolTknAccount: new PublicKey(
      '9Mq6KEyW1nF24TcGrdLLfnK2pE5VdMxbY2SZtcP84R5X'
    ),
    lendingPoolFeeAccount: new PublicKey(
      '9Mq6KEyW1nF24TcGrdLLfnK2pE5VdMxbY2SZtcP84R5X'
    ),
    lendingPoolShareMint: new PublicKey(
      'Hk8b6i2C7PxFBPdd1TCrGssuZpCDEg4fh8yFuyHNJuJe'
    ),
    lendingPoolShareAccount: new PublicKey(
      'FNG4A4GWF1EsQVEjNrQMRT9Dr3H28TycQabtnsQF1MiD'
    ),
    lendingPoolCreditMint: new PublicKey(
      '7f7mU3tQvxD9t3f5ckhxcGSdwqoHHdWrJg43HXiUFWri'
    ),
    lendingPoolCreditAccount: new PublicKey(
      '7LvrwstXyshwVn7BPDgjR8Cndersy9GzbbGhyHwQcX3W'
    ),
  },
  weSUSHI: {
    lookupTableAddress: new PublicKey(
      '5vnSYw9FpCWYf6NB1VxNhC9ouv7d1xLz9Cx17S2f46aW'
    ),
    programId: lendProgramId,
    tokenMint: TOKENS['weSUSHI'].mintAddress,
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolInfoAccount: new PublicKey(
      '2oTEVdMpSRsamFeNYzqn3wifsPHRomA8TShgbTnDtTgN'
    ),
    lendingPoolTknAccount: new PublicKey(
      '4VAyWCoRbW5YXiV5Rz7pZy7miYBJLjfZYsykDuTnWyqj'
    ),
    lendingPoolFeeAccount: new PublicKey(
      '4VAyWCoRbW5YXiV5Rz7pZy7miYBJLjfZYsykDuTnWyqj'
    ),
    lendingPoolShareMint: new PublicKey(
      'EEhiV55jAt5JDpeH3GF4VGrStiPn5gCeWmqffyTp9B4E'
    ),
    lendingPoolShareAccount: new PublicKey(
      '5SDoskkCcV8NBJcP97g9CS7BEGLqXT5q2F6Ve2W3VN71'
    ),
    lendingPoolCreditMint: new PublicKey(
      'E2ocWnUUuBpUDLRSxB5VdUqr635DMPiWuV4PYDtiyGbi'
    ),
    lendingPoolCreditAccount: new PublicKey(
      'L9idBQvg4SKzdtHPgZijpJGkDT4WVbhnA7KmTVPT477'
    ),
  },
  weUNI: {
    lookupTableAddress: new PublicKey(
      'Hb4ZHgHCyyzJWfksKyr8mRB7ydvH2SG76AC5pXkv6j9G'
    ),
    programId: lendProgramId,
    tokenMint: TOKENS['weUNI'].mintAddress,
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolInfoAccount: new PublicKey(
      'H4uTQ8CCFJYVQYZ8c2bH7hHGrrok6k4pWDhk5NQt9KR8'
    ),
    lendingPoolTknAccount: new PublicKey(
      'E3fN9Wqesn2NbYGPjybFo5HTMpcyLPnWNHovQpQqqw8G'
    ),
    lendingPoolFeeAccount: new PublicKey(
      'E3fN9Wqesn2NbYGPjybFo5HTMpcyLPnWNHovQpQqqw8G'
    ),
    lendingPoolShareMint: new PublicKey(
      'CGj7e1g4ojW1RhSocF8AKWxHFaqCQjK8kBsbHqNB4BxP'
    ),
    lendingPoolShareAccount: new PublicKey(
      '8BtR6Dzg4fLmLv4ZZdX1x22WYiPHvp8AtvRFgSMQwxdw'
    ),
    lendingPoolCreditMint: new PublicKey(
      '74WmdEZG9rjvcAX2yczd5h54QeXnq62sVNLMz1DU2Abh'
    ),
    lendingPoolCreditAccount: new PublicKey(
      '8kLAk9EiLV6qePNEtjnDLyWbRsySgMPSTihdWAEEv9H9'
    ),
  },
  SAMO: {
    lookupTableAddress: new PublicKey(
      'FUdXgKTfisX642gKDZReFtaRee8WdHiw4nrz4Y4y7JpP'
    ),
    programId: lendProgramId,
    tokenMint: TOKENS['SAMO'].mintAddress,
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolInfoAccount: new PublicKey(
      'HJLkovTpxof1z9tVMuX1pWp1ePDx1zgmnGYfFMxFRAd'
    ),
    lendingPoolTknAccount: new PublicKey(
      'J198uwytk8CPejCyNM9TMPJcLPCky6pZwGwP3n1CUfto'
    ),
    lendingPoolFeeAccount: new PublicKey(
      'J198uwytk8CPejCyNM9TMPJcLPCky6pZwGwP3n1CUfto'
    ),
    lendingPoolShareMint: new PublicKey(
      'A9H3fAqkWmRnnFzXXzydZHzyLQdzK5o9dMejCL27tqq8'
    ),
    lendingPoolShareAccount: new PublicKey(
      'HP3sKy5xqLkoNnbuHRCPuFaQUtYskNnockBPcYo5PZut'
    ),
    lendingPoolCreditMint: new PublicKey(
      'E5ejPudazVxEdQUsS37g8yUn5HD22FBHsGEKWkGRDR3F'
    ),
    lendingPoolCreditAccount: new PublicKey(
      '23tLfFHXZR1tAimzVyEAdN7HWJWiqvjepaX5qBHkgQvT'
    ),
  },
  POLIS: {
    lookupTableAddress: new PublicKey(
      '8GNhPXDU4UGascdfKGmu3ZBJsEbYoxe4w2BRixXH8ZNK'
    ),
    programId: lendProgramId,
    tokenMint: TOKENS['POLIS'].mintAddress,
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolInfoAccount: new PublicKey(
      'BWJkfNQnYt817V6sKxEJ3sFcivcXZgfKGCe8Z9f4LcVj'
    ),
    lendingPoolTknAccount: new PublicKey(
      '7Ad6djoPLzigyBnnWjoLh2gQ6Tbw2s6kAdsaVUBq6L8N'
    ),
    lendingPoolFeeAccount: new PublicKey(
      '7Ad6djoPLzigyBnnWjoLh2gQ6Tbw2s6kAdsaVUBq6L8N'
    ),
    lendingPoolShareMint: new PublicKey(
      'FenVvq6s6S3McD1BCm76Ktz1EvRNCB4qYKGFU76fB7Fj'
    ),
    lendingPoolShareAccount: new PublicKey(
      'GKTqMGVCgXJaDzjYfPdgMbVfnzCKDj6KqRpykauw19do'
    ),
    lendingPoolCreditMint: new PublicKey(
      'EkKFNt7PBRdWy8EpmZAbAZdvXZpSKvdwMfo8eotN1PEr'
    ),
    lendingPoolCreditAccount: new PublicKey(
      'FGKikDsnBPQ5m7jgbNNbHaR1gh1T8GYJ5sPYWoYdoE4p'
    ),
  },
  ATLAS: {
    lookupTableAddress: new PublicKey(
      '7jmphqSz19pSyYDAoNbBnAdpSPjCDMhuGowvZL4MVPya'
    ),
    programId: lendProgramId,
    tokenMint: TOKENS['ATLAS'].mintAddress,
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolInfoAccount: new PublicKey(
      'FnkmnUqazYmSm791rSTSXYbAzDzsuHJBgySgNZeCHGDJ'
    ),
    lendingPoolTknAccount: new PublicKey(
      'E5ovYitzudRyUy7AS4U52eFgrq1rjr773rRGpYax1nmD'
    ),
    lendingPoolFeeAccount: new PublicKey(
      'E5ovYitzudRyUy7AS4U52eFgrq1rjr773rRGpYax1nmD'
    ),
    lendingPoolShareMint: new PublicKey(
      '4mygt5bFQrbXH9gNg75j1KVTrKGhvcYiQjir6FJ8afYH'
    ),
    lendingPoolShareAccount: new PublicKey(
      'Eb4Ai2PXmRX3V9TX6awjNdBXZKGRyCgTmQu6Pni9NnTb'
    ),
    lendingPoolCreditMint: new PublicKey(
      '3nAgm2XrSi3RNDWz4wCvUWwQW3QQE7s5i7MxNz8r8mGZ'
    ),
    lendingPoolCreditAccount: new PublicKey(
      '3PwecBTLVt8zqKadSFDjeKH7Swzt1GxvU27urj66L89P'
    ),
  },
  GENE: {
    lookupTableAddress: new PublicKey(
      'HFKYALQcRFkM5S35fjXz3aCoyPDwKeGJtXzs5yMkjUFw'
    ),
    programId: lendProgramId,
    tokenMint: TOKENS['GENE'].mintAddress,
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolInfoAccount: new PublicKey(
      'FrgyPPEPNC25ihob4ZobP3eYjh8uBoxLiobdMDX2EsMc'
    ),
    lendingPoolTknAccount: new PublicKey(
      'A4UMfr97y35AvCaakKRAE5UBsb4UuvRQ2JiT23dyzDFu'
    ),
    lendingPoolFeeAccount: new PublicKey(
      'A4UMfr97y35AvCaakKRAE5UBsb4UuvRQ2JiT23dyzDFu'
    ),
    lendingPoolShareMint: new PublicKey(
      '9z3eDHueAMdUtym9Q2ku3hi5YXHTYjpFLp1YEEnxUHPV'
    ),
    lendingPoolShareAccount: new PublicKey(
      '58teG2GNEoeYQUBa3VxQe5ZH5SPCZ6nUsrCuN5akbaQS'
    ),
    lendingPoolCreditMint: new PublicKey(
      '2KR5Q6zCik6kFyiWPMMVCKC5HDAP6joGNhKhbEv6nFdY'
    ),
    lendingPoolCreditAccount: new PublicKey(
      '7LBnkdaCZsM82t7G5MYKBoYAZetcnsqfU1cABxnPoquw'
    ),
  },
  SONAR: {
    lookupTableAddress: new PublicKey(
      'CUcpP2uUw77Ftvhdppy2SpcRsDQ9kgW4qeG6iWNKeiC1'
    ),
    programId: lendProgramId,
    tokenMint: TOKENS['SONAR'].mintAddress,
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),

    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolInfoAccount: new PublicKey(
      '3USSy3sAZSCnUiCZJaTFt5hCHWSw87kg8tNPaEZh1p9D'
    ),
    lendingPoolTknAccount: new PublicKey(
      '2F2yrLZQa3av7PxW7vdqiYBV4AwTbkCdswgN2BYGgtvs'
    ),
    lendingPoolFeeAccount: new PublicKey(
      '2F2yrLZQa3av7PxW7vdqiYBV4AwTbkCdswgN2BYGgtvs'
    ),
    lendingPoolShareMint: new PublicKey(
      'FvHrhBTTgo7q8uDX7gN5f7YzSXMrf3mwYtkay5NvkJzg'
    ),
    lendingPoolShareAccount: new PublicKey(
      'DPMixAHcMsryStgytYBhvvtR2WbvyRxkMwG147NmXEPS'
    ),
    lendingPoolCreditMint: new PublicKey(
      'HsKN1EC5zcArg1yoq1tMg7JKfxPW9m644mqCphrbLMC'
    ),
    lendingPoolCreditAccount: new PublicKey(
      '7zqtZ8LhBYUUXoDCwDFcdLgNkYo8tZZqTdoFJqAL5ie8'
    ),
  },

  DFL: {
    lookupTableAddress: new PublicKey(
      '2Q144LX9XXacpEwNMFMESnuZhCNpPrABYun3AZJxnYHB'
    ),
    programId: lendProgramId,
    tokenMint: TOKENS['DFL'].mintAddress,
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),

    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolInfoAccount: new PublicKey(
      '74fWq2xnHBP1W6QhLDazCZAuZvp9XY3ck1PGNJg9hfhi'
    ),
    lendingPoolTknAccount: new PublicKey(
      '5QNHLaujxMgFKYaJM55uYb3jyMGgvspizg7S5eVAD3d8'
    ),
    lendingPoolFeeAccount: new PublicKey(
      '5QNHLaujxMgFKYaJM55uYb3jyMGgvspizg7S5eVAD3d8'
    ),
    lendingPoolShareMint: new PublicKey(
      'CGhMaGeVLxxQGJh6Y2bEYfLazumuFyEXpxF1UgrcMRJi'
    ),
    lendingPoolShareAccount: new PublicKey(
      'EHUF88xvJZyXzosAQ7Jzx5ozdvxCfZuwppSEo5b9pe2S'
    ),
    lendingPoolCreditMint: new PublicKey(
      '26Eo8VcgDuNZSn8x5infdYxDKs7mYZj4JKxLUCkKP3DV'
    ),
    lendingPoolCreditAccount: new PublicKey(
      'GYZgKQmYZBosdS3PsSRv83CdPFAtTRXRZaqdFVUnumiw'
    ),
  },

  // CAVE: {
  //   programId: lendProgramId,
  //   tokenMint: TOKENS.CAVE.mintAddress,
  //   marketInfoAccount: new PublicKey("4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E"),
  //   marketOwner: new PublicKey("7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR"),

  //   lendingMarketAuthority: new PublicKey("sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem"),
  //   lendingPoolInfoAccount: new PublicKey('4hoQV8MoKnecGKuzvo29sR2jtkxkmiQHyzNXctZ3F9Ka'),
  //   lendingPoolTknAccount: new PublicKey('YsP7Jj2zdbyyAqjuSN7cVJSG38izimcJXvtdMJ639Ao'),
  //   lendingPoolFeeAccount: new PublicKey('YsP7Jj2zdbyyAqjuSN7cVJSG38izimcJXvtdMJ639Ao'),
  //   lendingPoolShareMint: new PublicKey('CYMKtPi9KmaGJVWm6A2v7zbR8ARh49r3qLPBbdFiVzf6'),
  //   lendingPoolShareAccount: new PublicKey('Dzg2xe7wcKeC5PF47Nv3hVfo9tXEch4cw6gobZRknhEs'),
  //   lendingPoolCreditMint: new PublicKey('Bby7VbTHvpseY7KFCwpRM5BnwVrhS9ReCaZNcHMcSV3i'),
  //   lendingPoolCreditAccount: new PublicKey('mBEqr9wEJR2fUFvjgzYCAKBQTaia7N5j2DQnFMgrtzP'),
  // },
  wbWBNB: {
    lookupTableAddress: new PublicKey(
      'AJMcPqmPMnPonDKCUHMyTF8sVCkGaHxMzQdEPKtY3QbK'
    ),
    programId: lendProgramId,
    tokenMint: TOKENS['wbWBNB'].mintAddress,
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),

    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolInfoAccount: new PublicKey(
      '6RnKftFywvw8sceeWUM623BYyMeW216276G4atZ23CrF'
    ),
    lendingPoolTknAccount: new PublicKey(
      'F7SQgbgunwx7PKc9i5zXJfSNsjU9xM5P8Sb18FCUBKyf'
    ),
    lendingPoolFeeAccount: new PublicKey(
      'F7SQgbgunwx7PKc9i5zXJfSNsjU9xM5P8Sb18FCUBKyf'
    ),
    lendingPoolShareMint: new PublicKey(
      '8EzbLKBQ8Rest1SWUtZR6zFvYTo4cCaQ73ni8sF9vtjA'
    ),
    lendingPoolShareAccount: new PublicKey(
      'DgBnJvW9iQT5sP5YyVHeNbRjG8Xd2d53f19a2451eXkV'
    ),
    lendingPoolCreditMint: new PublicKey(
      '6bMAnnzp3pim8wd8XypLGuqVFQ3LMuY3vkRRse1DkZ7o'
    ),
    lendingPoolCreditAccount: new PublicKey(
      'CFsjid6WFmsyZozJkj43ssA5rRmYa97mzvfs8eRYqBeZ'
    ),
  },
  stSOL: {
    lookupTableAddress: new PublicKey(
      'kTJ8hWwRV6vmj7feyD1ppNk7rxiuPMmhrjoSmHJ75M9'
    ),
    programId: lendProgramId,
    tokenMint: TOKENS['stSOL'].mintAddress,
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),

    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolInfoAccount: new PublicKey(
      '9ogtxmnUF94KaPn3dB3unT5yyu7rpzSwc5igysgqFxrU'
    ),
    lendingPoolTknAccount: new PublicKey(
      '85pJTrAVdjHNvgCcUtefwkSe9RDKnHueyvs2uTocWmWs'
    ),
    lendingPoolFeeAccount: new PublicKey(
      '85pJTrAVdjHNvgCcUtefwkSe9RDKnHueyvs2uTocWmWs'
    ),
    lendingPoolShareMint: new PublicKey(
      'HyxfDg47HKS1rQUXWvJH2XQhwEJM3AqrHU7sK9bSNt5h'
    ),
    lendingPoolShareAccount: new PublicKey(
      '3H64RCjRcHEJAJK9mZ3q1mBZJ2hWuv3tUvXVY7XgFL5L'
    ),
    lendingPoolCreditMint: new PublicKey(
      'Hhh5mQQMuWjmyUNyYFDtuXKFp9wptPuLYvH9x98FSDq8'
    ),
    lendingPoolCreditAccount: new PublicKey(
      'CRorEh6T7aXamCsjggckCMgF1ewVavo6CfXTPNkipson'
    ),
  },
  SHDW: {
    lookupTableAddress: new PublicKey(
      '37Fuw9zCDDaohHxY12cw6viNJ4J4qZysRYQynQ75Fo9F'
    ),
    programId: lendProgramId,
    tokenMint: TOKENS['SHDW'].mintAddress,
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),

    lendingPoolInfoAccount: new PublicKey(
      '8NvPwUxtBohPg45bAmzzB45qLajpfptMVgqgu5vmCNgi'
    ),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolTknAccount: new PublicKey(
      'EoVqoTtczavGmATCagSQU11c74MkL8enp96fGkQz6uqK'
    ),
    lendingPoolShareMint: new PublicKey(
      'AJu1s738dGsZ8mV2XKTqjuMiAiqNGaRsixTR4Czx4mJ2'
    ),
    lendingPoolShareAccount: new PublicKey(
      '48YJFjo3zLGSkUDXpa8mte3EMFNSPvy6pE9wUhoPSLnH'
    ),
    lendingPoolCreditMint: new PublicKey(
      '3fu3y5yGbBPqDpwKjN1PsVurm4af6uQnpkkuSo5SxZQa'
    ),
    lendingPoolCreditAccount: new PublicKey(
      '2zxQFrSGMSWbHMzMjxDN8ceqgbJVUyyEEwR75R5zzh4M'
    ),
    lendingPoolFeeAccount: new PublicKey(
      '3H3QXT9oEG5DaoWfQ727jgJdhVewgrTNc8jsGgBsXvQE'
    ),
  },
  BASIS: {
    lookupTableAddress: new PublicKey(
      'CweY4HW2y4mQQmduqQNBPRHLNcsLmNV3aUNSE4EHumhe'
    ),
    programId: lendProgramId,
    tokenMint: TOKENS['BASIS'].mintAddress,
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),

    lendingPoolInfoAccount: new PublicKey(
      '499SnZR7dFzLU6BF9v9obfSCsmgui3FBtYtFDakD89zQ'
    ),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolTknAccount: new PublicKey(
      'E85Eyi4NmBp2Der1ntoNNx3AH5FHmjp4gGoUPW7qYVJ8'
    ),
    lendingPoolShareMint: new PublicKey(
      '9s2iRZBzSNCNTUtuzSRHcv3q4Q9SaFFhSFZVnFXGtHUp'
    ),
    lendingPoolShareAccount: new PublicKey(
      '5phQAZCwdfbYqj1tsv4xYWREpLZuxhqnMaZ126RAfVNb'
    ),
    lendingPoolCreditMint: new PublicKey(
      'AVRoCxDDfx525L1XJJ5JbKrPPbuHs1JL6Z17vWS3HpKc'
    ),
    lendingPoolCreditAccount: new PublicKey(
      'FeMzBdYfGJtqeRAadiC4fStY13cjxe6GutTyFCFsP1vL'
    ),
    lendingPoolFeeAccount: new PublicKey(
      'CtdMN3hrU9yq2GJpojbU1oQZbMXJyuVZYMfNkAPbgaZN'
    ),
  },
  wUST: {
    lookupTableAddress: new PublicKey(
      'HbSUXs2y1nMm1rpWfxeD25ZsfXEk19PuvWTZhdzvwUvo'
    ),
    programId: lendProgramId,
    tokenMint: TOKENS['wUST'].mintAddress,
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),

    lendingPoolInfoAccount: new PublicKey(
      'G1PYcFc56DQHDjSyt8zRKcnxbBrKJq4Vehurzrt2KUzs'
    ),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolTknAccount: new PublicKey(
      'DKYpvhtPyU9yWkGZx5VM4fA1isLwpcmQ8ttqhPJgMMrJ'
    ),
    lendingPoolShareMint: new PublicKey(
      'FPnFwW1ASFLBReVz1EPWVGkbrsnrekVkEcQnrBRkvDXS'
    ),
    lendingPoolShareAccount: new PublicKey(
      'MeLTPseZyHm2aWSk9Gda9d6xWM8DS5QySFKBS3Vyzsv'
    ),
    lendingPoolCreditMint: new PublicKey(
      'AbPJaMzRetUebzRV3mtoXtyPDVwEBEHif3EibVKhfcTs'
    ),
    lendingPoolCreditAccount: new PublicKey(
      'mYi2FARcy26GxkDuTneTybM75izMAR7swioxUMvyPRa'
    ),
    lendingPoolFeeAccount: new PublicKey(
      '5wTjKzJyEJHbjw4fsZM51fKBDwiq5JSA3bSzzRE2PXob'
    ),
  },

  GST: {
    lookupTableAddress: new PublicKey(
      'GBAgJPNhEmt3JwubXVgd66zoJZP8XBGD7FwsYzo8WRkh'
    ),
    programId: lendProgramId,
    tokenMint: TOKENS['GST'].mintAddress,
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    lendingPoolInfoAccount: new PublicKey(
      '93zxnt1gPepvUjWYPP32uANnhAK6NNphGD6A2yQFhk4s'
    ),
    lendingPoolTknAccount: new PublicKey(
      '4Y7VyaAWEDaQSkeYXbXRf1d82ZPViVRZ7Dt4fjHKgotL'
    ),
    lendingPoolShareMint: new PublicKey(
      '4GDuSZwHUQvL6zga2UNdjgXSqXjcWaUYc4S36N9q4567'
    ),
    lendingPoolShareAccount: new PublicKey(
      'GjmnPLwAAA5aZCfN5sCwcbartonu8iyVMPqSnfkyvtC9'
    ),
    lendingPoolCreditMint: new PublicKey(
      '8Nq8YV7BYoe3dqdTX996TRDB2iYryAHbzZTXntt2A3Uo'
    ),
    lendingPoolCreditAccount: new PublicKey(
      '8dzJgZxp7rBEbKhvFYXTMXKLmkqscn9UXwzcGA14fEgN'
    ),
    lendingPoolFeeAccount: new PublicKey(
      'ERyCAJh59hn8187Kn6wiKpeXdnGw4hptrbn55vh9YJQ1'
    ),
  },
  GMT: {
    lookupTableAddress: new PublicKey(
      '3KzviRz2snQevukX9FWt5n72XQFX48czkWJPsAiGoJZz'
    ),
    programId: lendProgramId,
    tokenMint: TOKENS['GMT'].mintAddress,
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),
    lendingPoolInfoAccount: new PublicKey(
      '9b5QWW2SqjmhRxtYTHXj6LFkmUkahrLAMQer3rEurd1k'
    ),
    lendingPoolTknAccount: new PublicKey(
      '7ZosDG7JWwXFnzhQ2aQ1ghCSQ9mrQzvH3ZhduhRPHgJB'
    ),
    lendingPoolShareMint: new PublicKey(
      '9R6toP3xTFBWoqwBY8bfjUj6Tyd5hyR192jY4NeMmkNg'
    ),
    lendingPoolShareAccount: new PublicKey(
      'BPPtMXgGkpo5HuDbiFyQWiA5r4BfxRWfwUA8XoKPixb7'
    ),
    lendingPoolCreditMint: new PublicKey(
      'B1yWMWp7nvSV2upJxFUxpUkDiZAVD2MabnRgaBtR14Dm'
    ),
    lendingPoolCreditAccount: new PublicKey(
      '6NvFHm9p6oSK8DJ9jurTMkC8KBo2hCk8UQm19Nub7R6X'
    ),
    lendingPoolFeeAccount: new PublicKey(
      'ejLn4fFkVS29aYksC87TQYwcu8wy1tvc2AySpfHGabQ'
    ),
  },
  ZBC: {
    lookupTableAddress: new PublicKey(
      'FNVsWfdmEcAjdxUZtRC9165RUt8zQh3k3mANCQL4sRAu'
    ),
    programId: lendProgramId,
    tokenMint: TOKENS['ZBC'].mintAddress,
    marketInfoAccount: new PublicKey(
      '4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E'
    ),
    lendingMarketAuthority: new PublicKey(
      'sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem'
    ),
    marketOwner: new PublicKey('7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR'),
    lendingPoolInfoAccount: new PublicKey(
      '6uPerEUyomCC5qn4z9xF3fbVa7SCytcKoCVannPDez5R'
    ),
    lendingPoolTknAccount: new PublicKey(
      '7quTFi1N9EZfz7jUx7ui9wx9rk1rb3F1Enjbh8Me2tSs'
    ),
    lendingPoolShareMint: new PublicKey(
      'HUry6RSbDasMfU7LXZ5QR42YajkbMuLBQkyV742xgFKx'
    ),
    lendingPoolShareAccount: new PublicKey(
      'BHuVdzrDTssFdWTqt15fsdJzJuHESQrMhSnc3jsJ8X2Y'
    ),
    lendingPoolCreditMint: new PublicKey(
      'ADWAgFjannL985LDKQsQ9B833BFDMj4q8qQappe2F3X9'
    ),
    lendingPoolCreditAccount: new PublicKey(
      '5xqkszmojpTFy3wGQTXFB7XoLyWXxw7ymmHN9iNYVdUK'
    ),
    lendingPoolFeeAccount: new PublicKey(
      'qt8KMibr5UcB1WZGVdgyFNGvmzEtp3faUqfcKDytLzq'
    ),
  },
};

export const lendingPoolList = [
  {
    pool: 'USDC',
    scale: 6,
  },
  {
    pool: 'USDT',
    scale: 6,
  },
  {
    pool: 'wUST',
    scale: 6,
  },
  {
    pool: 'SOL',
    scale: 9,
  },
  {
    pool: 'mSOL',
    scale: 9,
  },
  {
    pool: 'stSOL',
    scale: TOKENS['stSOL'].decimals,
  },
  {
    pool: 'BTC',
    scale: 6,
  },
  {
    pool: 'ETH',
    scale: 6,
  },
  {
    pool: 'SRM',
    scale: 6,
  },
  {
    pool: 'ORCA',
    scale: 6,
  },
  {
    pool: 'whETH',
    scale: 8,
  },
  {
    pool: 'weUNI',
    scale: TOKENS['weUNI'].decimals,
  },
  {
    pool: 'weSUSHI',
    scale: TOKENS['weSUSHI'].decimals,
  },
  {
    pool: 'RAY',
    scale: 6,
  },
  {
    pool: 'SAMO',
    scale: TOKENS['SAMO'].decimals,
  },
  {
    pool: 'POLIS',
    scale: TOKENS['POLIS'].decimals,
  },
  {
    pool: 'ATLAS',
    scale: TOKENS['ATLAS'].decimals,
  },
  {
    pool: 'GENE',
    scale: TOKENS['GENE'].decimals,
  },
  // {
  //   pool: 'SONAR',
  //   scale: TOKENS.SONAR.decimals
  // },
  {
    pool: 'DFL',
    scale: TOKENS['DFL'].decimals,
  },
  // {
  //   pool: 'CAVE',
  //   scale: TOKENS.CAVE.decimals
  // },
  {
    pool: 'wbWBNB',
    scale: TOKENS['wbWBNB'].decimals,
  },
  {
    pool: 'SHDW',
    scale: TOKENS['SHDW'].decimals,
  },
  {
    pool: 'BASIS',
    scale: TOKENS['BASIS'].decimals,
  },
  {
    pool: 'GST',
    scale: TOKENS['GST'].decimals,
  },
  {
    pool: 'GMT',
    scale: TOKENS['GMT'].decimals,
  },
  {
    pool: 'ZBC',
    scale: TOKENS['ZBC'].decimals,
  },
];

// https://github.com/Francium-DeFi/francium-sdk/blob/6b284e8d8af3178fc6815dfc8fb50dfd90d160ca/src/constants/lend/rewards.ts

export const lendRewardProgramId = new PublicKey(
  '3Katmm9dhvLQijAvomteYMo6rfVbY5NaCRNq9ZBqBgr6'
);

export const lendRewardInfo: {
  [x: string]: LendRewardInfo;
} = {
  USDC: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      '8Eq2XZRQe2EjYiNmu7Lhgb2xVHqJ5wFvcVU6yH3CUn34'
    ),
    farmingPoolAuthority: new PublicKey(
      '4NWwKzVvEfKCsMeauE4cZHRR9K91FsFauxnrW6pK8H2E'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      '62fDf5daUJ9jBz8Xtj6Bmw1bh1DvHn8AG4L9hMmxCzpu'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      '3yNu5pg2DhtaxZbAwgUSsVnemqMn1WqxnBn6tgKGj7R2'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      '34R2ZVwg6uvJWFYjQ2LrrKFFaZ7CgsyZbMKwvfjxkvip'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'EgiD69Uhf8t13CRPKz1btmtHj7SogeEjyPHfnT4d13XN'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      'FGAh5YjdcyzQ841skvGQGWyejK3uPiwpEdtMncJqe7f9'
    ),
  },
  PAI: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      '2Dp5WMATsyfHtMEkU2JTrffc5onPCLqZFybcYvPAPxNP'
    ),
    farmingPoolAuthority: new PublicKey(
      '7A88TMr5kQpHWidb5w9zeZr4dXMse6DsWTELbLe1WEyV'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      'HDvD8a4VWbkHNG7hb4CBumNhn41DyKL51qVYBNH73o23'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      '8QaCpnJP61u8qm9ZJYdXgQWGNacoefmU2bDKfmLPHSmE'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      '7B2BnzmT779H3KzAn8raQQEcRKSw4GhPPDS657X7NRDs'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      'GGwsqBzz6L7Wvq7ZKdn7yQBCU5qLdqwMfVZZQWp8uYZn'
    ),
  },
  RAY: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      '9G2EXWwSaqJNgk9AWkx5u6JsUpdCaeh7ZUzsjJsSJkYz'
    ),
    farmingPoolAuthority: new PublicKey(
      'gbPTC9F2tnP9z9xzjeQWjNXBsuHw9ZjkG9NahZ7wDPa'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      '5uZERkJVyhCABEdocEssPZyMXYa8GJpLhngi95yXr9jc'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      'GKV52HXiEDR8Qqazdp9LA5Aiwjny94v9CavCVAt7TvxS'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      '9dvYPm8LjhTrKF3bJ4Lt8YwQqxhxzWWXWGnbqfamNVQK'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      '9dvYPm8LjhTrKF3bJ4Lt8YwQqxhxzWWXWGnbqfamNVQK'
    ),
  },
  USDT: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      'AKi1GE5Xa5boTwNEy4u2PaHqtQBVFcKXVU5oqXFFYST8'
    ),
    farmingPoolAuthority: new PublicKey(
      'CQ83mRhE3AhM1yLiGkgKut1Fsy9dZPmzCjNhLu1vKE8Y'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      '8TtsTZQ6mU4YSW5jw4sDjSDEG1CW8QLpK7C9g5TVgBvn'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      'CiwYeQcjMyvt7gvkwNAQRq8DEbtAh7J3K3Zrfsb54got'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      '9QsFN5L8Ld9aR8FFZ8gTM5euG6us7Rw7QWZUUthptoib'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      'BC3GujgFNpbo2rYRfit7Rr3Af769Jo6ApN3vr58BQazw'
    ),
  },
  SRM: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      '63Xrt9Z5jC3D9pR2RVL2D57z5bspaX6pqdDVW9XnAMU8'
    ),
    farmingPoolAuthority: new PublicKey(
      'D1QkTSH7UaNeCsiTsB5PGF27BAeAwu9TBNiCX4upARzg'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      '6CZhCFwA7hbqDEoVUQdFpHaCGQU7fSSwhaJWdG4DmsQ6'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      '6E7dXsDkdErDuG4z7ED8knoAR9EFtnKApVvYQyytm1kU'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      'gw2RdaKNv8TW7Epvz41vCZZn2AppMRoc9cZXsVtKZ1k'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      'gw2RdaKNv8TW7Epvz41vCZZn2AppMRoc9cZXsVtKZ1k'
    ),
  },
  ETH: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      '7rKAmXDUhqZrzM2nZbM2PxbxsErAjGPxbRgr2fFxQ9Y'
    ),
    farmingPoolAuthority: new PublicKey(
      'FzoCLipUnS18zMvag9ffr3ATPJicrphYZyEZeB9Acp4G'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      'B8QXcUv5FFwyHH5V88g6PhYBc8fQvwSpza4C9PsiRpQD'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      'BR1gbF7jjcTaXTJfASSm1hz1h7A8My7F4meCgB9dKXwq'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      'H1aJwXV3LwEghvPKJpNkjdedH7dmDyDLjrTChtomhJKQ'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      'H1aJwXV3LwEghvPKJpNkjdedH7dmDyDLjrTChtomhJKQ'
    ),
  },
  SOL: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      'G8MpQfTa18RcGK6xdKxKqG3u9NXWwqEMN3YM4MAFSukS'
    ),
    farmingPoolAuthority: new PublicKey(
      '9EkVgtRxTWJWtksC2maF7YJqKyDR45z3PrxmzUMZwGpm'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      '92Zst3rEoJsyZUW2yNc2811GtkBwFrm3tqgxMTtFWuSB'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      '5Dwb6bW6nJ7tawnXXuJLRRsHnpDWrsQGMBNePsi2HHNc'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      'CRmaS1yBemFcHAooAfRUM41ZCBpnM7FCRKi7x71YXnTj'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      'CRmaS1yBemFcHAooAfRUM41ZCBpnM7FCRKi7x71YXnTj'
    ),
  },
  mSOL: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      'Hu2QsZ57NHmgKEReXYPfS79amdqyyuxzbwSdxvd1UTwv'
    ),
    farmingPoolAuthority: new PublicKey(
      '7af5t7Ms526TYXEh5Y4nvot6xbWyGaiQnNJf3D9dygsb'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      '4mntRxKJWib1YTWNV4aLfszF6FeziBHdwnNAwGSfKKMX'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      '39bnyhokuj3RCsLZnZsjbctRtx7rsYV4hQNoxQEKx9xy'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      '2JEph4UfH6H49fmsYBZg7zSXKTUENszypmPC5qMmefkc'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      'BFBh633oDNn7hV89mA6TSUPGU6JeMdKzXVBHUi3Ab6Yd'
    ),
  },
  BTC: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      '9LPNrtfkDgNTf7hex7PvufE1KypP54eU6AmStgn5Bo8g'
    ),
    farmingPoolAuthority: new PublicKey(
      'DaB9HtEeWGfH25dFXMbYpxsUkZtqvbxQPjdsoxmpNCHK'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      '2G9iwy9zfLaXB2bFiqSA7YbKEvtAEXVmdvGTF28jQVgg'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      'DNuEdaUXrYCRpELZssM9t2ZUQ6V4GJiijCEaXRr54Gpp'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      'GAeyyaFDBwX7LPSp5oQBRdZDCVUePeaJFDujCVkj5NDV'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      '4uL23rEj7fzNCFZ8Bv3SunLhtMamX3nAciYCSdSmAP1R'
    ),
  },
  whETH: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      '4LCHfdGYZVkNzmPrVt6LyvzEPyJ9uWgnna9Fm4GU3Mib'
    ),
    farmingPoolAuthority: new PublicKey(
      'GPMxFBWur7UWwpyCbU29jTvWgaoJJKVke2nwd6azJEyQ'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      'Hk8b6i2C7PxFBPdd1TCrGssuZpCDEg4fh8yFuyHNJuJe'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      '4uW5PiPXRBQmcdU4Sreg1uJmfqBGazeH5ah2MnC1NSDL'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      '9unatyGE1mM46TnWpwhqgr7n176m4pZ8j1vtVhF84i83'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      '7LyyPUnM2MiAH1k8xN8pN2pQJZReCprFKS78e16tweud'
    ),
  },
  weUNI: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      'ArRauaQ8xnFMdNdjdJe5vCp1h2v8iWWeHSNjf2dhMGdo'
    ),
    farmingPoolAuthority: new PublicKey(
      'BuujLrfraC8o5c6257Fv5jsWkoWwAn4W66eKb121mU6C'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      'CGj7e1g4ojW1RhSocF8AKWxHFaqCQjK8kBsbHqNB4BxP'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      '5T5YxRxXbTidTpbcJqVdGu3UBcSc6x2W446tLSEfSEBA'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      '3S6kQMUYhGKvXMRM74nsPkhNbx8PrUEsw4NdjJMbaF9K'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      'hbh6ziFx6FRWdoRGqtTuRVFwr9i7iXhFNtuN66ufK4B'
    ),
  },
  weSUSHI: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      '21WzBAky2CbcmHvrxgyFhCytdF3xQA6YdzWXN7JYk7Ga'
    ),
    farmingPoolAuthority: new PublicKey(
      'GE7jFYgkUc533u1V38Y5hN1icrdAgCTgftHW6q2tu9ZV'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      'EEhiV55jAt5JDpeH3GF4VGrStiPn5gCeWmqffyTp9B4E'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      'ES5w4AaFNfjartY74tw3dr8XjLc2DLbFpD9qmXagnE83'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      'DWy2TzewHtoYw6QEczXvJoDRk6rwNrdyGkSo7t5hTzCM'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      '5R1NiQM9U99DzMN21Kx3hYxfQAupEVeQ7tPsmNNa5KVo'
    ),
  },
  SAMO: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      'J5vPqifPvVYcYfgwhAkrjFq8xnsJBjFhvSwVpTbpqs5G'
    ),
    farmingPoolAuthority: new PublicKey(
      '3ocZg6J44UVx6gWFC8PuTDumFSsVNh7W8Md3Cf5jXR6P'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      'A9H3fAqkWmRnnFzXXzydZHzyLQdzK5o9dMejCL27tqq8'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      '7zLG1aWBvgwCgkDEsKHAkPgyuUGxdYPSDUPVoXi4LuVi'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      'CYHmcVin4cQzdjcEcAYJki3qQuHMWq2NR15ienvRnXwc'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      'GHM6YvgVKuoBEwcaMRJjQ2yEDfyCJg7CcK2eKTZ1k7pn'
    ),
  },
  POLIS: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      '9fdYMtX2xuqUTUVFrPR2fegRHh7qakLkXwX1RVw9aTHH'
    ),
    farmingPoolAuthority: new PublicKey(
      'G5BxwBHd1j7KdWbHo2HwZCmEWtXjvQ8uHRVLo2g1cikM'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      'FenVvq6s6S3McD1BCm76Ktz1EvRNCB4qYKGFU76fB7Fj'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      'GhbQAXhtKt31BTCLdkP92CJJRJ1wDoRnjuSBbVoz4AV2'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      'FjFMXsVPA4KJxCx3ARjuTLJH1c6UwMvSHXLVZD5UcnR3'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      'AG3sYd5HhxeWQ2CSzZsrK6XF6Zg9UXZh4uGUMgDW8VZp'
    ),
  },
  ATLAS: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      'DWSsuov4Jgp8d2h5f9vx142tmJMeKBqCwyzgp8YNpXUw'
    ),
    farmingPoolAuthority: new PublicKey(
      'D6VwvNE8Nt4QcotuUVW1as51spadXNVBD9PXidZkvDWq'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      '4mygt5bFQrbXH9gNg75j1KVTrKGhvcYiQjir6FJ8afYH'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      '2EFNPCYTTy6AoAgUmeQiNNgHRnmP2zQE7pWhH8vvnPCJ'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      'DWsBfN9jYzXaJ7CiprCXMbzvSWrmRvWYWSBYU2b84oGe'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      '4EGXGVXAwzw4dhQPdTb5qdg9Bas99fNVgt1ZC4nDTJvZ'
    ),
  },
  GENE: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      '3EhxTvGjycQSKBY4EFz7MGA5Ke7rf39oUU2nM9qBP6Cj'
    ),
    farmingPoolAuthority: new PublicKey(
      '4hqgkEYCFb736sSpxvrxD5Vvq1m7FdJKzfjinrr7xHSd'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      '9z3eDHueAMdUtym9Q2ku3hi5YXHTYjpFLp1YEEnxUHPV'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      'DBrkDtmFWuXqpS8svgpXt2xLpQoJQQz5QUNeMWtnzh2A'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      'EfTo3cTDREravKZQtcG7cYSHkLfbHP6TLfxFnFMcFYTE'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      '5GhnJNhPU4FeAeX8zPjEGboSHWJcnu9JsqSzNDeYMb4q'
    ),
  },

  DFL: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      'GiKoJhe5TN2DN2H9iW57P1ewtzZmi9vb8YhLMEVbweAH'
    ),
    farmingPoolAuthority: new PublicKey(
      'Cbf8HLvkmch1HBb2XQf8LHhtPtECLrBDxsR3bCXZ5tA'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      'CGhMaGeVLxxQGJh6Y2bEYfLazumuFyEXpxF1UgrcMRJi'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      'bMcNaYHuVVCL6PFqXGECDD2EgKSKUeVNzZcEKYUMe3T'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      '7DzVmRce9QgooSrLpN1khQXtYv1AqUncc3BoBWvQi1ZV'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      '3sZNEj3a6pkCVvZBSGYs9L4Komyd66vbcStckQSpZ32A'
    ),
  },

  // CAVE: {
  //   programId: lendRewardProgramId,
  //   farmingPoolAccount: new PublicKey('66vLuAKSt93r5Psvj5pfYRFLTWsgqxXJ3SFesSaMEDfo'),
  //   farmingPoolAuthority: new PublicKey('3dhyC9d2Bcb1GSWbqAhyR4TB8qpGQ7p3ELEVdCBMSWZo'),
  //   farmingPoolStakeTknMint: new PublicKey('CYMKtPi9KmaGJVWm6A2v7zbR8ARh49r3qLPBbdFiVzf6'),
  //   farmingPoolStakeTknAccount: new PublicKey('AVig4LiJwdFzaQCNC3yYs46RsomoaagS6dpSmywdAbVE'),
  //   farmingPoolRewardsTknMint: new PublicKey('Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'),
  //   farmingPoolRewardsTknAccount: new PublicKey('Fph8QSq4QkuAxk1Fuc4mCgvojU6V9ug7UYhXij5GqzVP'),
  //   farmingPoolRewardsTknMintB: new PublicKey('Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'),
  //   farmingPoolRewardsTknAccountB: new PublicKey('BuWFC1bCeLcCrXxR1sUY66RJbgu9WYZLcEdFHMoYHpKu'),
  // }
  wbWBNB: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      'DyB3NGRQRAQcRowaxFhE8tBzB2kV6JcGCHJWADwVjFw9'
    ),
    farmingPoolAuthority: new PublicKey(
      'FFVAs3tsHUjmGBKeHGex6b1bfyAfcJbwTPhrxtubMMDo'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      '8EzbLKBQ8Rest1SWUtZR6zFvYTo4cCaQ73ni8sF9vtjA'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      'DuBFjRWMaNUbvfr2FgBNRuqMuRYuPcYZFRVFXHyR5wjx'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      'FaUXYgAiMe3eSX11WyXZSx47Z6SoWnHvvMRPYR4WPXea'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      '6qvfR54nRwWMXSP18D2Y5qKnwmd6AVJ9TKdjJNmS7yGr'
    ),
  },

  stSOL: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      'J7Ny8VBzKHqVxbi8RAeNHatxELF61KhPCeV7S6m3AVa3'
    ),
    farmingPoolAuthority: new PublicKey(
      '2q2cWnsuSBr8AukmhPj6memCY4qEqaajYfpjQhofGhYP'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      'HyxfDg47HKS1rQUXWvJH2XQhwEJM3AqrHU7sK9bSNt5h'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      '8Ki5bPSCjEMxDdzjHNmZyowtSEXFjb5YXEPCysWsudo'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'HZRCwxP2Vq9PCpPXooayhJ2bxTpo5xfpQrwB1svh332p'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      '9TvniKw9GPczkYZLA5Ba43LmvkfgbRmuPJnVMJwGxgPb'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      'AXbZA7hRj7uyNUVo6Bo2UYSdTET4V6Lck8guWYudW85d'
    ),
  },

  SHDW: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      'Qy66gmV7hqvTG8FtwfLjbYaKrxTD953xMWw2tpLfyHs'
    ),
    farmingPoolAuthority: new PublicKey(
      '3b7sreFukzQB7bWBVcFrQgxxoCiD34HPKupzh7gNrRi3'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      'AJu1s738dGsZ8mV2XKTqjuMiAiqNGaRsixTR4Czx4mJ2'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      'FQo71LhxWHmjNiLoV19RDcoFS4gTMnHGRe6NixjgjsAp'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      '7Q7gufPTfvUkTuVTFsEZAnL1B8gAFzsUgVD2bSYimG51'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      'DVAPvhBkHEWhE4w9T84KF5rySu7cyQiFHLfsKDMvcT7m'
    ),
  },

  BASIS: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      'GD2syrTphVNFhgWPfX52JxsqTLFXpFKHsFuHFuyH6SCa'
    ),
    farmingPoolAuthority: new PublicKey(
      '9SMowoWcvciMBVTD4K3fDhMqjTQ5CRHCpGpT15R6sjBx'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      '9s2iRZBzSNCNTUtuzSRHcv3q4Q9SaFFhSFZVnFXGtHUp'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      '9T6pP9xrEa3sNoaiDv2rRoViKWehnYv11Mpy3KAPqp25'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      '3ons5X9YkRgccyEX7CVC9FSCeTzkkKrDouyAejZNeXfN'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      'AAYSvVfYigFoSZHYgrZ78sviYsSpLGuP9gzuTkMQCQNq'
    ),
  },

  wUST: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      '6Y5Y3mc6byPdXLhb8twQM2Ei4L3YfceJpLFzFDNsZSBi'
    ),
    farmingPoolAuthority: new PublicKey(
      '9a3QEmKhwyzqPY3SCXSmoTBfEgyzb4w96VP44XDM9p3V'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      'FPnFwW1ASFLBReVz1EPWVGkbrsnrekVkEcQnrBRkvDXS'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      '9fZhscUjooAhovtGDn7xvtYabs35aqj8uN1H45ERZiQa'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      'BTgLyeGfjYzA3joa62k78wvsEE3a8eFHhzVoLMTDVPhM'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      'CqsbNDh1im9bJx8rFUCdi72o26sZFNrbvHET3i7mFkzj'
    ),
  },

  GST: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      'FeWUu6GVAvbpvcYqxymDPLsE4bWjtfLsJNg9FFVjQHwb'
    ),
    farmingPoolAuthority: new PublicKey(
      'AqTdNkV6ZcpgN3QyBH1cSQZx8DHm6AvoHWusrGT9cPiw'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      '4GDuSZwHUQvL6zga2UNdjgXSqXjcWaUYc4S36N9q4567'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      'A2d7G4aNKt4emJHdKpz7fb1C8GCw6gZxA5d9pUF1hxEW'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      'BVRKUs86o7b1tiyGWByag6DtpejxZdvz9BkBRkZv1auh'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      'E81P1ip8ynf8q9Y3d365fghEhNgHK5yPcYkiuTF7WjVs'
    ),
  },

  GMT: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      'BvZ4vUfiXRvxcKV6ZiPcZdWJRtRpovMV19nZ1S8WV7JU'
    ),
    farmingPoolAuthority: new PublicKey(
      '5G8BjukrA9tvU3dsafR95wywdj8vq44pg8TcMSbN1r2z'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      '9R6toP3xTFBWoqwBY8bfjUj6Tyd5hyR192jY4NeMmkNg'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      'DPXP9bkB5A183bfbpHrCYdXpRSEFehWqF4PhpG1P5NtJ'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      '2Bo8GWQoysSTswVPxsMdCFC8fmVP84D7CJPuqfSiKPJd'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      '29TsFVuj7ZdFwLUvfBeBt7Wcw5jBGguGi8LGRau9TRaz'
    ),
  },

  ZBC: {
    programId: lendRewardProgramId,
    farmingPoolAccount: new PublicKey(
      'FPKSH61ciN4YetqKvW7KMWVc1icKDqtPogQR1tQqZrWF'
    ),
    farmingPoolAuthority: new PublicKey(
      '4v2FpU7sTv8BoQdu9LXY65EK4AMHheuDyVDp3viuzh5f'
    ),
    farmingPoolStakeTknMint: new PublicKey(
      'HUry6RSbDasMfU7LXZ5QR42YajkbMuLBQkyV742xgFKx'
    ),
    farmingPoolStakeTknAccount: new PublicKey(
      '4TMJwumst5n67zuFFj12zBVe1U4WX1iApjni6FMNPrwP'
    ),
    farmingPoolRewardsTknMint: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccount: new PublicKey(
      '33qA8PTrZuzMe1ixw1ABeSCDykGEcaBRcDbYcySjY66E'
    ),
    farmingPoolRewardsTknMintB: new PublicKey(
      'Hjibp1cn2bSk1dkTdpbxez3YAiBGTLjzc8xZ8LbCCUHS'
    ),
    farmingPoolRewardsTknAccountB: new PublicKey(
      '8CHYivAkcJo8V56bcVaBmKQjLAydtLc9aXiyiyWCfk1U'
    ),
  },
};
