import { Platform } from '@sonarwatch/portfolio-core';

const otphanPlatforms: Platform[] = [
  {
    id: 'tortuga',
    defiLlamaId: 'tortuga', // from https://defillama.com/docs/api
    name: 'Tortuga',
    image: 'https://sonar.watch/img/platforms/tortuga.png',
  },
  {
    id: 'ditto',
    defiLlamaId: 'ditto',
    name: 'Ditto',
    image: 'https://sonar.watch/img/platforms/ditto.png',
  },
  {
    id: 'binancestakedeth',
    defiLlamaId: 'binance-staked-eth',
    name: 'Binance staked ETH',
    image: 'https://sonar.watch/img/platforms/binancestakedeth.png',
  },
  {
    id: 'stusdt',
    defiLlamaId: 'stusdt',
    name: 'stUSDT',
    image: 'https://sonar.watch/img/platforms/stusdt.png',
  },
  {
    id: 'coinbasestakedeth',
    defiLlamaId: 'coinbase-wrapped-staked-eth',
    name: 'Coinbase Staked ETH',
    image: 'https://sonar.watch/img/platforms/coinbasestakedeth.png',
  },
];
export default otphanPlatforms;
