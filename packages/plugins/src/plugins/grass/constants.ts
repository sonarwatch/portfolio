import { PublicKey } from '@solana/web3.js';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'grass';
export const grassMint = 'Grass7B4RdKfBCjTKgSqnXkqjwiGvQyFbuSCUJr3XXjs';

export const airdropStatics: AirdropStatics = {
  claimLink: 'https://www.grassfoundation.io/claim',
  emitterLink: 'https://www.grassfoundation.io/',
  emitterName: 'Grass',
  id: 'grass-airdrop',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/grass.webp',
  claimEnd: undefined,
  claimStart: 1730073600000,
};

export const airdropApi = 'https://api.getgrass.io/airdropAllocations?input=';
export const pidDistributor = new PublicKey(
  'Eohp5jrnGQgP74oD7ij9EuCSYnQDLLHgsuAmtSTuxABk'
);
export const pid = new PublicKey(
  'EyxPPowqBRTpZpiDb2ixUR6XUU1VJwTCNgJdK8eyc6kc'
);
