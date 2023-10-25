import { Platform } from '@sonarwatch/portfolio-core';
import { coinInfo } from '../../utils/aptos';

export const platformId = 'thala';
export const thalaPlatform: Platform = {
  id: platformId,
  name: 'Thala',
  image: 'https://sonar.watch/img/platforms/thala.png',
  defiLlamaId: 'parent#thala-labs',
};
export const programAdressThala =
  '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01';

const stabilityModule = 'stability_pool';
const vaultModule = 'vault';

const liquidityDeposit = `${programAdressThala}::${stabilityModule}::account_deposit`;
const liquidityClaimable = `${programAdressThala}::${stabilityModule}::claimable_thl`;

const cryptoType = `${programAdressThala}::${stabilityModule}::Crypto`;
export const vaultFilter = `${programAdressThala}::${vaultModule}::Vault<`;
export const vaultCollateralParamsFilter = `${programAdressThala}::${vaultModule}::VaultCollateralParams<`;

export const thlCoin = `0x7fd500c11216f0fe3095d0c4b8aa4d64a4e2e04f83758462f2b127255643615::thl_coin::THL`;
export const modCoin = `${programAdressThala}::mod_coin::MOD`;

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
  function: liquidityDeposit,
  type_arguments: [cryptoType],
  arguments: [owner],
});

export const stabilityClaimablePayload = (owner: string) => ({
  function: liquidityClaimable,
  type_arguments: [],
  arguments: [owner],
});
