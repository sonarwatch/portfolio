import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import { toBN } from './toBN';

describe('toBN', () => {
  it('should convert a number to BN', () => {
    const bn = toBN(12345);
    expect(bn.toString()).toBe('12345');
  });

  it('should return the same BN instance', () => {
    const inputBN = new BN('12345');
    const bn = toBN(inputBN);
    expect(bn).toBe(inputBN);
  });

  it('should convert a BigNumber to BN', () => {
    const inputBigNumber = new BigNumber('9.221804033236374421200126e+24');
    const bn = toBN(inputBigNumber);
    expect(bn.toString()).toBe('9221804033236374421200126');
  });

  it('should throw an error for unsupported types', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Suppression de l'erreur de type pour le test
    expect(() => toBN('12345')).toThrow(
      'Unsupported type for conversion to BN'
    );
  });
});
