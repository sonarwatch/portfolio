import {
  formatTokenAddress,
  NetworkIdType,
  TokenYield,
} from '@sonarwatch/portfolio-core';

export class TokenYieldMap extends Map<string, TokenYield> {
  readonly networkId: NetworkIdType;

  constructor(
    networkId: NetworkIdType,
    initialEntries?: [string, TokenYield][]
  ) {
    super(initialEntries);
    this.networkId = networkId;
  }

  private formatKey(key: string): string {
    return formatTokenAddress(key, this.networkId);
  }

  override get(address: string): TokenYield | undefined {
    return super.get(this.formatKey(address));
  }

  override has(address: string): boolean {
    return super.has(this.formatKey(address));
  }
}
