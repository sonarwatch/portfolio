import { PortfolioError } from './PortfolioError';

export class AdapterRefreshError extends PortfolioError {
  override readonly name: string = 'AdapterError';
  readonly adapterId: string;

  constructor(adapterId: string, cause?: Error) {
    super('Refresh error', 'adapter', adapterId, cause);
    this.adapterId = adapterId;
  }
}
