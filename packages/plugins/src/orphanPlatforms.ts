import { Platform } from '@sonarwatch/portfolio-core';

export const stepfinancePlatform: Platform = {
  id: 'stepfinance',
  name: 'Step Finance',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/stepfinance.webp',
  website: 'https://app.step.finance/',
  twitter: 'https://twitter.com/StepFinance_',
  defiLlamaId: 'step-finance',
  tokens: [
    'StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT',
    'xStpgUCss9piqeFUk2iLVcvJEGhAdJxJQuwLkXP555G',
    'StPsoHokZryePePFV8N7iXvfEmgUoJ87rivABX7gaW6',
  ],
  github: 'https://github.com/step-finance',
};
export const ligmaPlatform: Platform = {
  id: 'ligma',
  name: 'Ligma',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/ligma.webp',
  website: 'https://stake.ligmanode.com/',
  twitter: 'https://twitter.com/ligmanode',
};

const orphanPlatforms: Platform[] = [
  {
    id: 'tortuga',
    defiLlamaId: 'tortuga', // from https://defillama.com/docs/api
    name: 'Tortuga',
    image:
      'https://sonarwatch.github.io/portfolio/assets/images/platforms/tortuga.webp',
    website: 'https://app.tortuga.finance/',
  },
  {
    id: 'ditto',
    defiLlamaId: 'ditto',
    name: 'Ditto',
    image:
      'https://sonarwatch.github.io/portfolio/assets/images/platforms/ditto.webp',
    website: 'https://stake.dittofinance.io/',
  },
  {
    id: 'binancestakedeth',
    defiLlamaId: 'binance-staked-eth',
    name: 'Binance staked ETH',
    image:
      'https://sonarwatch.github.io/portfolio/assets/images/platforms/binancestakedeth.webp',
    website: 'https://www.binance.com/en/wbeth',
  },
  {
    id: 'stusdt',
    defiLlamaId: 'stusdt',
    name: 'stUSDT',
    image:
      'https://sonarwatch.github.io/portfolio/assets/images/platforms/stusdt.webp',
    website: 'https://stusdt.io/#/home',
  },
  {
    id: 'coinbasestakedeth',
    defiLlamaId: 'coinbase-wrapped-staked-eth',
    name: 'Coinbase Staked ETH',
    image:
      'https://sonarwatch.github.io/portfolio/assets/images/platforms/coinbasestakedeth.webp',
    website: 'https://www.coinbase.com/price/coinbase-wrapped-staked-eth',
  },
  {
    id: 'blaze',
    defiLlamaId: 'blazestake',
    name: 'Blaze Staked SOL',
    tokens: ['bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1'],
    image:
      'https://sonarwatch.github.io/portfolio/assets/images/platforms/blaze.webp',
    website: 'https://stake.solblaze.org/',
  },
  {
    id: 'frax',
    defiLlamaId: 'frax-ether',
    name: 'Frax Staked ETH',
    image:
      'https://sonarwatch.github.io/portfolio/assets/images/platforms/frax.webp',
    website: 'https://frax.finance/',
  },
  {
    id: 'stakewise',
    defiLlamaId: 'stakewise',
    name: 'StakeWise Staked ETH',
    image:
      'https://sonarwatch.github.io/portfolio/assets/images/platforms/stakewise.webp',
    website: 'https://stakewise.io/',
    github: 'https://github.com/laine-sa',
    tokens: ['LAinEtNLgpmCP9Rvsf5Hn8W6EhNiKLZQti1xfWMLy6X'],
  },
  {
    id: 'ondo-finance',
    defiLlamaId: 'ondo-finance',
    name: 'Ondo Finance',
    image:
      'https://sonarwatch.github.io/portfolio/assets/images/platforms/ondo-finance.webp',
    website: 'https://ondo.finance/',
  },
  {
    id: 'carrot',
    defiLlamaId: 'carrot',
    name: 'Carrot',
    image:
      'https://sonarwatch.github.io/portfolio/assets/images/platforms/carrot.webp',
    website: 'https://use.deficarrot.com/',
    tokens: ['CRTx1JouZhzSU6XytsE42UQraoGqiHgxabocVfARTy2s'],
  },
  stepfinancePlatform,
  ligmaPlatform,
  {
    id: 'asgardfi',
    name: 'Asgard',
    image:
      'https://sonarwatch.github.io/portfolio/assets/images/platforms/asgard.webp',
    website: 'https://asgardfi.com/',
  },
];
export const platforms = orphanPlatforms;
export default orphanPlatforms;
