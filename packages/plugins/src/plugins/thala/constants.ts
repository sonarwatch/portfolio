import { Platform } from '@sonarwatch/portfolio-core';
import { coinInfo } from '../../utils/aptos';

export const platformId = 'thala';
export const platform: Platform = {
  id: platformId,
  name: 'Thala',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/thala.webp',
  defiLlamaId: 'parent#thala-labs',
  website: 'https://www.thala.fi/',
};
export const packageId =
  '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01';
export const vePackageId =
  '0x167f411fc5a678fb40d86e0af646fa8f62458b686ad8996215248447037af40c';
export const farmingPackageId =
  '0x6b3720cd988adeaf721ed9d4730da4324d52364871a68eac62b46d21e4d2fa99';

const stabilityModule = 'stability_pool';
const vaultModule = 'vault';
const veTokenModule = 'vault';

const liquidityDeposit = `${packageId}::${stabilityModule}::account_deposit`;
const liquidityClaimable = `${packageId}::${stabilityModule}::claimable_thl`;
const lockedCoinAmount = `${vePackageId}::${veTokenModule}::locked_coin_amount`;

const cryptoType = `${packageId}::${stabilityModule}::Crypto`;
export const vaultFilter = `${packageId}::${vaultModule}::Vault<`;
export const vaultCollateralParamsFilter = `${packageId}::${vaultModule}::VaultCollateralParams<`;

export const thlCoin = `0x7fd500c11216f0fe3095d0c4b8aa4d64a4e2e04f83758462f2b127255643615::thl_coin::THL`;
export const modCoin = `${packageId}::mod_coin::MOD`;
export const thlModPool =
  '0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::weighted_pool::WeightedPoolToken<0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::mod_coin::MOD, 0x7fd500c11216f0fe3095d0c4b8aa4d64a4e2e04f83758462f2b127255643615::thl_coin::THL, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::weighted_pool::Weight_20, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::weighted_pool::Weight_80, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null>';

export const stabilityEndpoint = 'https://app.thala.fi/api/total-stability';

export const programAddressLP =
  '0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af';
export const lpStableTypeTokenPrefix = `${programAddressLP}::stable_pool::StablePoolToken`;
export const lpWeightedTypeTokenPrefix = `${programAddressLP}::weighted_pool::WeightedPoolToken`;
export const lpStableTypePrefix = `${programAddressLP}::stable_pool::StablePool`;
export const lpWeightedTypePrefix = `${programAddressLP}::weighted_pool::WeightedPool`;
export const lpStableCoinInfoTypePrefix = `${coinInfo}<${lpStableTypeTokenPrefix}`;
export const lpWeightedCoinInfoTypePrefix = `${coinInfo}<${lpWeightedTypeTokenPrefix}`;

export const stabilityDepositPayload = (owner: string) => ({
  function: liquidityDeposit as `${string}::${string}::${string}`,
  typeArguments: [cryptoType],
  functionArguments: [owner],
});

export const stabilityClaimablePayload = (owner: string) => ({
  function: liquidityClaimable as `${string}::${string}::${string}`,
  typeArguments: [],
  functionArguments: [owner],
});

export const vetokenBalancePayload = (owner: string, coinType: string) => ({
  function: lockedCoinAmount as `${string}::${string}::${string}`,
  typeArguments: [coinType],
  functionArguments: [owner],
});

export const farmingPoolPayload = (
  owner: string,
  poolId: number,
  rewardCoinType: string
) => ({
  function:
    `${farmingPackageId}::farming::stake_and_reward_amount` as `${string}::${string}::${string}`,
  typeArguments: [rewardCoinType],
  functionArguments: [owner, poolId],
});

export const farmingPoolsKey = 'farming-pools';
