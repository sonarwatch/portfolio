import { PortfolioError } from './PortfolioError';

export class AdapterFetchTimedOutError extends PortfolioError {
  override readonly name: string = 'AdapterError';
  readonly adapterId: string;

  constructor(adapterId: string, cause?: Error) {
    super('Fetch timed out error', 'adapter', adapterId, cause);
    this.adapterId = adapterId;
  }
}
