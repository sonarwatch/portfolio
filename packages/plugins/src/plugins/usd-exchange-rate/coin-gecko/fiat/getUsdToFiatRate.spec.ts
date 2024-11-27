import getUsdToFiatRate from './getUsdToFiatRate';

describe('getUsdToFiatRate', () => {
  it('should return correct value', () => {
    const btcToUsd = 93729;
    const btcToEur = 89093;
    const value = getUsdToFiatRate(btcToUsd, btcToEur);
    expect(value).toBe(0.9505382539022075);
  });

  it('should throw error if rates are not positive', () => {
    expect(() => getUsdToFiatRate(0, 1)).toThrow(
      'Change rates must be positive'
    );
  });
});
