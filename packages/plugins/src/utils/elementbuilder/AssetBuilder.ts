import {
  NetworkIdType,
  PortfolioAsset,
  TokenPriceMap,
} from '@sonarwatch/portfolio-core';
import { TokenYieldMap } from '../../TokenYieldMap';

export abstract class AssetBuilder {
  abstract tokenAddresses(): string[];
  abstract get(
    networkId: NetworkIdType,
    tokenPrices: TokenPriceMap,
    tokenYields: TokenYieldMap
  ): PortfolioAsset | null;
}
