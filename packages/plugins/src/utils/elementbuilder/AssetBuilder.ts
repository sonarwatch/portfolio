import {
  NetworkIdType,
  PortfolioAsset,
  TokenPriceMap,
} from '@sonarwatch/portfolio-core';

export abstract class AssetBuilder {
  abstract tokenAddresses(): string[];
  abstract get(
    networkId: NetworkIdType,
    tokenPrices: TokenPriceMap
  ): PortfolioAsset | null;
}
