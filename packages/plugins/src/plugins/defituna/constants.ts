import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { Vault } from './structs';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'defituna';
export const defiTunaProgram = new PublicKey(
  'tuna4uSQZncNeeiAMKbstuxA9CUkHH6HmC64wgmnogD'
);

export const lendingPoolsCacheKey = 'lending-pools';
export const poolsMemo = new MemoizedCache<Vault[]>(lendingPoolsCacheKey, {
  prefix: platformId,
  networkId: NetworkId.solana,
});

export const apiUrl = 'https://embed.defituna.com/airdrop/wallet/';
export const tunaMint = undefined;
export const airdropStatics: AirdropStatics = {
  emitterLink: 'https://defituna.com',
  id: 'defituna-airdrop',
  name: 'DefiTuna Airdrop',
  emitterName: 'DefiTuna',
  image: 'https://sonar.watch/img/defituna.webp',
  claimStart: undefined,
  claimEnd: undefined,
  claimLink: 'https://defituna.com/airdrop',
};
