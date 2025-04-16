import { PublicKey } from '@solana/web3.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { StrategyInfo } from './types';
import {
  lstPositionInfoStruct,
  lstStrategyStruct,
  positionInfoStruct,
  strategyStruct,
} from './structs';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { ParsedAccount } from '../../utils/solana';
import { BankInfo } from '../marginfi/types';
import { banksKey } from '../marginfi/constants';
import { arrayToMap } from '../../utils/misc/arrayToMap';

export const platformId = 'vaultka';

export const lendingsCacheKey = `lendings`;

export const lendingProgramIds = [
  new PublicKey('DE7BUY3Fa4CRc44RxRDpcknbCT6mYTY3LpZNFET7k3Hz'),
  new PublicKey('DMhoXyVNpCFeCEfEjEQfS6gzAEcPUUSXM8Xnd2UXJfiS'),
  new PublicKey('nKMLJtN1rr64K9DjmfzXvzaq4JEy5a4AJHHP9gY1dW6'),
  new PublicKey('69oX4gmwgDAfXWxSRtTx9SHvWmu2bd9qVGjQPpAFHaBF'),
];

export const lendingV2Pid = new PublicKey(
  'V1enDN8GY531jkFp3DWEQiRxwYYsnir8SADjHmkt4RG'
);
export const group = new PublicKey(
  'groUPysZbKCi8RbcziZFeP1WSFPa31kC9CsdUBggdkc'
);
export const banksMemo = new MemoizedCache<
  ParsedAccount<BankInfo>[],
  Map<string, ParsedAccount<BankInfo>>
>(
  banksKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  },
  (arr) => arrayToMap(arr || [], 'pubkey')
);

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
