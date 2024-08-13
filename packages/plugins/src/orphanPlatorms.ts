import { Platform } from '@sonarwatch/portfolio-core';

const otphanPlatforms: Platform[] = [
  {
    id: 'tortuga',
    defiLlamaId: 'tortuga', // from https://defillama.com/docs/api
    name: 'Tortuga',
    image: 'https://sonar.watch/img/platforms/tortuga.webp',
    website: 'https://app.tortuga.finance/',
  },
  {
    id: 'ditto',
    defiLlamaId: 'ditto',
    name: 'Ditto',
    image: 'https://sonar.watch/img/platforms/ditto.webp',
    website: 'https://stake.dittofinance.io/',
  },
  {
    id: 'binancestakedeth',
    defiLlamaId: 'binance-staked-eth',
    name: 'Binance staked ETH',
    image: 'https://sonar.watch/img/platforms/binancestakedeth.webp',
    website: 'https://www.binance.com/en/wbeth',
  },
  {
    id: 'stusdt',
    defiLlamaId: 'stusdt',
    name: 'stUSDT',
    image: 'https://sonar.watch/img/platforms/stusdt.webp',
    website: 'https://stusdt.io/#/home',
  },
  {
    id: 'coinbasestakedeth',
    defiLlamaId: 'coinbase-wrapped-staked-eth',
    name: 'Coinbase Staked ETH',
    image: 'https://sonar.watch/img/platforms/coinbasestakedeth.webp',
    website: 'https://www.coinbase.com/price/coinbase-wrapped-staked-eth',
  },
  {
    id: 'blaze',
    defiLlamaId: 'blazestake',
    name: 'Blaze Staked SOL',
    image: 'https://sonar.watch/img/platforms/blaze.webp',
    website: 'https://stake.solblaze.org/',
  },
  {
    id: 'frax',
    defiLlamaId: 'frax-ether',
    name: 'Frax Staked ETH',
    image: 'https://sonar.watch/img/platforms/frax.webp',
    website: 'https://frax.finance/',
  },
  {
    id: 'stakewise',
    defiLlamaId: 'stakewise',
    name: 'StakeWise Staked ETH',
    image: 'https://sonar.watch/img/platforms/stakewise.webp',
    website: 'https://stakewise.io/',
  },
  {
    id: 'ondo-finance',
    defiLlamaId: 'ondo-finance',
    name: 'Ondo Finance',
    image: 'https://sonar.watch/img/platforms/ondo-finance.webp',
    website: 'https://ondo.finance/',
  },
];
export default otphanPlatforms;
