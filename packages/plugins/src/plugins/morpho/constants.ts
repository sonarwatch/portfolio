import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'morpho';
export const platform: Platform = {
  id: platformId,
  name: 'Morpho',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/morpho.webp',
  defiLlamaId: 'parent#morpho',
  website: 'https://morpho.org/',
};
export const updatedIndexesPrefix = `${platformId}-updated-indexes`;
export const morphoAaveV3Address = '0x33333aea097c193e66081E930c33020272b33333';
export const morphoTokenAddress = '0x9994E35Db50125E0DF82e4c2dde62496CE330999';

export const Underlying = {
  usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  wbtc: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  wsteth: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
  steth: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  uni: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  reth: '0xae78736Cd615f374D3085123A210448E74Fc6393',
  cbeth: '0xBe9895146f7AF43049ca1c1AE358B0541Ea49704',
};

export const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
export const wethDecimals = 18;
