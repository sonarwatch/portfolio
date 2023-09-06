import { AddressSystemType } from '../Address';
import { PortfolioError } from './PortfolioError';

export class TokenAddressIsNotValideError extends PortfolioError {
  override readonly name: string = 'TokenAddressIsNotValideError';

  constructor(
    address: string,
    addressSystem?: AddressSystemType,
    cause?: Error
  ) {
    super(
      'Token address is not valid',
      'sdk',
      `${address}${addressSystem ? ` / ${addressSystem}` : ''}`,
      cause
    );
  }
}
