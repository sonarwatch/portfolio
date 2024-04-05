import { Platform } from '@sonarwatch/portfolio-core';

const otphanPlatforms: Platform[] = [
  {
    id: 'tortuga',
    defiLlamaId: 'tortuga', // from https://defillama.com/docs/api
    name: 'Tortuga',
    image: 'https://sonar.watch/img/platforms/tortuga.png',
    website: 'https://app.tortuga.finance/',
  },
  {
    id: 'ditto',
    defiLlamaId: 'ditto',
    name: 'Ditto',
    image: 'https://sonar.watch/img/platforms/ditto.png',
    website: 'https://stake.dittofinance.io/',
  },
  {
    id: 'binancestakedeth',
    defiLlamaId: 'binance-staked-eth',
    name: 'Binance staked ETH',
    image: 'https://sonar.watch/img/platforms/binancestakedeth.png',
    website: 'https://www.binance.com/en/wbeth',
  },
  {
    id: 'stusdt',
    defiLlamaId: 'stusdt',
    name: 'stUSDT',
    image: 'https://sonar.watch/img/platforms/stusdt.png',
    website: 'https://stusdt.io/#/home',
  },
  {
    id: 'coinbasestakedeth',
    defiLlamaId: 'coinbase-wrapped-staked-eth',
    name: 'Coinbase Staked ETH',
    image: 'https://sonar.watch/img/platforms/coinbasestakedeth.png',
    website: 'https://www.coinbase.com/price/coinbase-wrapped-staked-eth',
  },
  {
    id: 'jito',
    defiLlamaId: 'jito',
    name: 'Jito',
    image: 'https://sonar.watch/img/platforms/jito.png',
    website: 'https://jito.network/',
  },
  {
    id: 'blaze',
    defiLlamaId: 'blazestake',
    name: 'Blaze Staked SOL',
    image: 'https://sonar.watch/img/platforms/blaze.png',
    website: 'https://stake.solblaze.org/',
  },
  {
    id: 'frax',
    defiLlamaId: 'frax-ether',
    name: 'Frax Staked ETH',
    image: 'https://sonar.watch/img/platforms/frax.png',
    website: 'https://frax.finance/',
  },
  {
    id: 'stakewise',
    defiLlamaId: 'stakewise',
    name: 'StakeWise Staked ETH',
    image: 'https://sonar.watch/img/platforms/stakewise.png',
    website: 'https://stakewise.io/',
  },
  {
    id: 'cloneprotocol',
    defiLlamaId: 'clone-protocol',
    name: 'Clone Protocol',
    image: 'https://sonar.watch/img/platforms/cloneprotocol.webp',
    website: 'https://clone.so/',
    twitter: 'https://twitter.com/CloneProtocol',
  },
  {
    id: 'sanctum',
    defiLlamaId: 'parent#sanctum', // from https://defillama.com/docs/api
    name: 'Sanctum',
    image: 'https://sonar.watch/img/platforms/sanctum.webp',
    website: 'https://www.sanctum.so/',
    twitter: 'https://twitter.com/sanctumso',
  },
];
export default otphanPlatforms;
