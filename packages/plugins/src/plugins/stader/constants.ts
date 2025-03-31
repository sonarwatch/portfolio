import { NetworkId } from '@sonarwatch/portfolio-core';

export const platformId = 'stader';

/** Matches https://stader.gitbook.io/stader/ethereum/smart-contracts#ethx-mainnet-smart-contracts and
 * https://github.com/llamafolio/llamafolio-api/blob/bf669cbaf424a7694954d151e39e143d28ff2e35/src/adapters/stader/ethereum/index.ts#L6-L11
 */
export const ETHX_CONTRACT_ADDRESS_ETHREUM_MAINNET = '0xA35b1B31Ce002FBF2058D22F30f95D405200A15b';

export const ETHX_STAKING_POOL_ETHEREUM = `${platformId}-${NetworkId.ethereum}-staking`;
