import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './exchange/constants';
import { TokenResponse } from './types';
import { verifiedTokensCacheKey } from './constants';
import { lstsKey, platformId as sanctumPlatformId } from '../sanctum/constants';
import { setJupiterPrices } from './getJupiterPrices';
import { lfntyMint, xLfntyMint } from '../lifinity/constants';

const mints = [
  '8Yv9Jz4z7BUHP68dz8E8m3tMe6NKgpMUKn8KVqrPA6Fr', // Wrapped USDC (Allbridge from Avalanche)
  'FHfba3ov5P3RjaiLVgh8FTv4oirxQDoVXuoUUDvHuXax', // USDC (Wormhole from Avalanche)
  'Kz1csQA91WUGcQ2TB3o5kdGmWmMGp8eJcDEyHzNDVCX', // USDT (Wormhole from Avalanche)
  'Bn113WT6rbdgwrm12UJtnmNqGqZjY4it2WoUQuQopFVn', // Wrapped USDT (Allbridge from Ethereum)
  'E77cpQ4VncGmcAXX16LHFFzNBEBb2U7Ar7LBmZNfCgwL', // Wrapped USDT (Allbridge from BSC)
  '8qJSyQprMC57TWKaYEmetUR3UUiTP2M3hXdcvFhkZdmv', // Tether USD (Wormhole from BSC)
  xLfntyMint,
  lfntyMint,
];

const executor: JobExecutor = async (cache: Cache) => {
  const [verifiedTokens, sanctumMints] = await Promise.all([
    cache.getItem<TokenResponse[]>(verifiedTokensCacheKey, {
      prefix: platformId,
      networkId: NetworkId.solana,
    }),
    cache.getItem<string[]>(lstsKey, {
      prefix: sanctumPlatformId,
      networkId: NetworkId.solana,
    }),
  ]);

  if (!verifiedTokens) console.warn('Jupiter Verified Tokens not in cache');
  if (!sanctumMints) console.warn('Sanctums tokens not in cache');

  const mintsPk: Set<PublicKey> = new Set([
    ...mints.map((m) => new PublicKey(m)),
    ...(sanctumMints || []).map((a) => new PublicKey(a)),
    ...(verifiedTokens || []).map((token) => new PublicKey(token.address)),
  ]);

  await setJupiterPrices([...mintsPk], cache);
};
const job: Job = {
  id: `${platformId}-pricing`,
  executor,
  labels: ['realtime'],
};
export default job;
