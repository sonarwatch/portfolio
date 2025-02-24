import { NetworkIdType, PortfolioAsset } from '@sonarwatch/portfolio-core';
import { TokenPriceMap } from '../../TokenPriceMap';

export abstract class AssetBuilder {
  abstract tokenAddresses(): string[];
  abstract get(
    networkId: NetworkIdType,
    tokenPrices: TokenPriceMap
  ): PortfolioAsset | null;
}
