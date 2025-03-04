import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { StrategyInfo } from './types';
import {
  lstPositionInfoStruct,
  lstStrategyStruct,
  positionInfoStruct,
  strategyStruct,
} from './structs';

export const platformId = 'vaultka';
export const platform: Platform = {
  id: platformId,
  name: 'Vaultka',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/vaultka.webp',
  website: 'https://solana.vaultka.com/',
  twitter: 'https://x.com/Vaultkaofficial',
  defiLlamaId: 'vaultka', // from https://defillama.com/docs/api
};

export const lendingsCacheKey = `lendings`;

export const lendingProgramIds = [
  new PublicKey('DE7BUY3Fa4CRc44RxRDpcknbCT6mYTY3LpZNFET7k3Hz'),
  new PublicKey('DMhoXyVNpCFeCEfEjEQfS6gzAEcPUUSXM8Xnd2UXJfiS'),
  new PublicKey('nKMLJtN1rr64K9DjmfzXvzaq4JEy5a4AJHHP9gY1dW6'),
  new PublicKey('69oX4gmwgDAfXWxSRtTx9SHvWmu2bd9qVGjQPpAFHaBF'),
];

export const strategiesCacheKey = `strategies`;

export const strategies: StrategyInfo[] = [
  {
    pubkey: '6UBsNdYq3MEao1m9NXQD1VEmXvptUXhfMwdHANGAo4bs',
    strategyStruct,
    positionInfoStruct,
  },
  {
    pubkey: 'B3FS1X2PZPBrtBZiyAN9oqABnu3o5YWwdY5ioqoVh64P',
    strategyStruct,
    positionInfoStruct,
  },
  {
    pubkey: 'SkFLfp7eSRsan13dEUZSVzMBj3vdyZnhaasFKQTzuiE',
    strategyStruct,
    positionInfoStruct,
  },
  {
    pubkey: '6VwarrrqWVWAmZtNdgGafeyoXD3SsspKxuxkZVarZqTA',
    strategyStruct,
    positionInfoStruct,
  },
  {
    pubkey: '9p5Sc5SvR8QpJCQV3U4q6zVUTupr4Tr9Jmf48sbcSjtX',
    strategyStruct: lstStrategyStruct,
    positionInfoStruct: lstPositionInfoStruct,
  },
  {
    pubkey: 'FRyGij76xTvAg1nPPTaXHfa3QxUfZuKARuAyAaMyoLPo',
    strategyStruct: lstStrategyStruct,
    positionInfoStruct: lstPositionInfoStruct,
  },
  {
    pubkey: 'A7PDwCJ3qcdVoZLqq7wHAwMq9yEKZU2vFx7Y9qbZ1dKJ',
    strategyStruct: lstStrategyStruct,
    positionInfoStruct: lstPositionInfoStruct,
  },
];
