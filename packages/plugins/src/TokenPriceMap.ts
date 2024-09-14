import {
  formatTokenAddress,
  NetworkIdType,
  TokenPrice,
} from '@sonarwatch/portfolio-core';

export class TokenPriceMap extends Map<string, TokenPrice> {
  readonly networkId: NetworkIdType;

  constructor(
    networkId: NetworkIdType,
    initialEntries?: [string, TokenPrice][]
  ) {
    super(initialEntries);
    this.networkId = networkId;
  }

  private formatKey(key: string): string {
    return formatTokenAddress(key, this.networkId);
  }

  override get(address: string): TokenPrice | undefined {
    return super.get(this.formatKey(address));
  }

  override has(address: string): boolean {
    return super.has(this.formatKey(address));
  }
}
