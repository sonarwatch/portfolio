import { AddressSystemType } from '../Address';
import { PortfolioError } from './PortfolioError';

export class AddressSystemIsNotValidError extends PortfolioError {
  override readonly name: string = 'AddressSystemIsNotValidError';

  constructor(addressSystem: AddressSystemType | string, cause?: Error) {
    super('Address system is not valid', 'sdk', addressSystem, cause);
  }
}
