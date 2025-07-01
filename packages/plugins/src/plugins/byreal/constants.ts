import { PublicKey } from '@solana/web3.js';
import { getRaydiumClmmPositions } from '../raydium/clmmFetcher';

export const byrealPlatformId = 'byreal';
export const byrealClmmPid = new PublicKey(
  'REALQqNEomY6cQGZJUGwywTBD2UmDT32rZcNnfxQ5N2'
);
export const byrealPositionsIdentifier = 'Byreal CLMM Position';
export const getByrealClmmPositions = getRaydiumClmmPositions(
  byrealPlatformId,
  byrealPositionsIdentifier,
  byrealClmmPid,
  'https://byreal.io/portfolio/?position_tab=concentrated'
);

export const byrealResetPid = new PublicKey(
  'REALdpFGDDsiD9tvxYsXBTDpgH1gGQEqJ8YSLdYQWGD'
);
