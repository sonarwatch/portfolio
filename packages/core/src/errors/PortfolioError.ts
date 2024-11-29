export class PortfolioError extends Error {
  override readonly name: string = 'PortfolioError';
  readonly isPortfolioError = true;
  readonly source: PortfolioErrorSource;
  readonly sourceDetails?: string;
  readonly cause?: Error;

  constructor(
    message: string,
    source: PortfolioErrorSource,
    sourceDetails?: string,
    cause?: Error
  ) {
    super(message);
    this.source = source;
    this.sourceDetails = sourceDetails;
    this.cause = cause;
    this.message = `${this.message}${
      this.sourceDetails ? `: [${this.sourceDetails}]` : ''
    }`;
  }

  override toString() {
    return `[${this.name}] ${this.message}`;
  }
}

export type PortfolioErrorSource = 'adapter' | 'manager' | 'sdk';
