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
    this.message = `${this.message}\n\nSource: ${this.getFullSource()}${
      this.cause ? `\n\nCaused By: ${this.cause.message}` : ''
    }\n`;
  }

  getCapitalizedSource(): string {
    return this.source[0].toUpperCase() + this.source.slice(1);
  }

  getFullSource(): string {
    const capitalizedSource = this.getCapitalizedSource();
    const sourceDetails = this.sourceDetails ? ` > ${this.sourceDetails}` : '';

    return capitalizedSource + sourceDetails;
  }

  override toString() {
    return `[${this.name}] ${this.message}`;
  }
}

export type PorfolioErrorSource = 'adapter' | 'manager';
