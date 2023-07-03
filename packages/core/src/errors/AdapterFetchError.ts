import { PortfolioError } from './PortfolioError';

export class AdapterFetchError extends PortfolioError {
  override readonly name: string = 'AdapterError';
  readonly adapterId: string;

  constructor(adapterId: string, cause?: Error) {
    super('Fetch error', 'adapter', adapterId, cause);
    this.adapterId = adapterId;
  }
}
