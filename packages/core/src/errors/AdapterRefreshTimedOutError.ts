import { PortfolioError } from './PortfolioError';

export class AdapterRefreshTimedOutError extends PortfolioError {
  override readonly name: string = 'AdapterError';
  readonly adapterId: string;

  constructor(adapterId: string, cause?: Error) {
    super('Refresh timed out error', 'adapter', adapterId, cause);
    this.adapterId = adapterId;
  }
}
