import { AddressSystemType } from '../Address';
import { PortfolioError } from './PortfolioError';

export class AddressIsNotValidError extends PortfolioError {
  override readonly name: string = 'AddressIsNotValidError';

  constructor(
    address: string,
    addressSystem?: AddressSystemType,
    cause?: Error
  ) {
    super(
      'Address is not valid',
      'sdk',
      `${address}${addressSystem ? ` / ${addressSystem}` : ''}`,
      cause
    );
  }
}
