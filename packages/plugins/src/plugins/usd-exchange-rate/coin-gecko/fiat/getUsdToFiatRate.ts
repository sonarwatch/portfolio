export default function getUsdToFiatRate(btcToUsd: number, btcToFiat: number) {
  if (btcToUsd <= 0 || btcToFiat <= 0) {
    throw new Error('Change rates must be positive');
  }
  return 1 / (btcToUsd / btcToFiat);
}
