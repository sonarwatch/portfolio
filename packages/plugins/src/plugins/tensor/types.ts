import { AssetStorage } from '@sonarwatch/asset-storage';
import { TokenPrice } from '@sonarwatch/types';
import { ConfigRpcConfig } from '@sonarwatch/utils/types';

export type TensorAdapterConfig = {
  tokenPrices: AssetStorage<TokenPrice>;
  miscStorage: AssetStorage<unknown>;
  solana: ConfigRpcConfig;
};
