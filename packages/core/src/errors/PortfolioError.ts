export class PortfolioError extends Error {
  override readonly name: string = 'PorfolioError';
  readonly isPorfolioError = true;
  readonly source: PorfolioErrorSource;
  readonly sourceDetails?: string;
  readonly cause?: Error;

  constructor(
    message: string,
    source: PorfolioErrorSource,
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

export type PorfolioErrorSource = 'adapter' | 'manager' | 'sdk';
