export function getCoinAddressFromCoinType(coinType: string) {
  const coinAddress = coinType.split('::').at(0);
  if (!coinAddress) throw new Error('coinType is not valid');
  return coinAddress;
}
