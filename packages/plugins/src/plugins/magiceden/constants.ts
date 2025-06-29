import { PublicKey } from '@solana/web3.js';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'magiceden';
export const meMint = 'MEFNBXixkEbait3xn9bkm8WsJzXtVsaJEn4c8Sam21u';

export const m2Prefix = 'm2';
export const m2Program = new PublicKey(
  'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K'
);
export const m2AuctionHouse = new PublicKey(
  'E8cU1WiRWjanGxmn96ewBgk9vPTcL6AEZ1t6F6fkgUWe'
);
export const stakingPid = new PublicKey(
  'veTbq5fF2HWYpgmkwjGKTYLVpY6miWYYmakML7R7LRf'
);
export const airdropApi =
  'https://mefoundation.com/api/trpc/allocation.queryClaimStatus?input=';

export const ammPid = new PublicKey(
  'mmm3XBJg5gk8XJxEKBvdgptZz6SgK4tXvn36sodowMc'
);
export const airdropStatics: AirdropStatics = {
  claimLink: 'https://mefoundation.com/link',
  emitterLink: 'https://mefoundation.com/',
  emitterName: 'MagicEden',
  id: 'magiceden-airdrop',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/magiceden.webp',
  claimStart: 1733839200000,
  claimEnd: 1738368000000,
};
