export function formatDecimal(amount: number, decimal: number) {
  return amount / 10 ** decimal;
}

export function shortenAddress(address: string, start = 4, end = 4) {
  return `${address.slice(0, start)}..${address.slice(-end)}`;
}
