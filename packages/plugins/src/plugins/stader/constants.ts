import { Address } from 'viem';

export const platformId = 'stader';

/**
 * Matches https://stader.gitbook.io/stader/ethereum/smart-contracts#ethx-mainnet-smart-contracts and
 * https://github.com/llamafolio/llamafolio-api/blob/bf669cbaf424a7694954d151e39e143d28ff2e35/src/adapters/stader/ethereum/index.ts#L6-L11
 */
export const CONTRACT_ADDRESS_ETHX_TOKEN_ETHEREUM_MAINNET: Address  = '0xA35b1B31Ce002FBF2058D22F30f95D405200A15b';

/**
 * Matches https://stader.gitbook.io/stader/ethereum/smart-contracts#ethx-mainnet-smart-contracts
 */
export const CONTRACT_ADDRESS_PERMISSIONLESS_NODE_REGISTRY_ETHEREUM_MAINNET: Address  = '0x4f4Bfa0861F62309934a5551E0B2541Ee82fdcF1';

export const CONTRACT_ADDRESS_STADER_UTILITY_POOL_ETHEREUM_MAINNET: Address  = '0xED6EE5049f643289ad52411E9aDeC698D04a9602';

export const CONTRACT_ADDRESS_STADER_COLLATERAL_POOL_ETHEREUM_MAINNET: Address = '0x7Af4730cc8EbAd1a050dcad5c03c33D2793EE91f';

/**
 * Matches https://stader.gitbook.io/stader/ethereum/smart-contracts#ethx-mainnet-smart-contracts and
 * https://github.com/llamafolio/llamafolio-api/blob/bf669cbaf424a7694954d151e39e143d28ff2e35/src/adapters/stader/ethereum/index.ts#L16
 */
export const CONTRACT_ADDRESS_STADER_TOKEN_ETHEREUM_MAINNET: Address = '0x30D20208d987713f46DFD34EF128Bb16C404D10f';

export const DECIMALS_ON_CONTRACT_STADER_TOKEN = 18;
