import { PortfolioError } from './PortfolioError';

export class NameIsNotValidError extends PortfolioError {
  override readonly name: string = 'NameIsNotValidError';

  constructor(name: string) {
    super('Name is not valid', 'sdk', name);
  }
}
