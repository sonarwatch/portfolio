export function convertDecimalStringToScaledBigInt(e: string, t = 18): bigint {
  const n = e.split('.');
  if (n.length === 2) {
    const [r, i] = n;
    if (BigInt(r) > BigInt(0))
      return BigInt(`${r}${i}${'0'.repeat(t - i.length)}`);

    return i.length < t
      ? BigInt(`${i}${'0'.repeat(t - i.length)}`)
      : BigInt(`${i}`.substring(0, t));
  }
  return BigInt(`${e}${'0'.repeat(t)}`);
}

function cleanNumericString(e: string) {
  return e
    .replace(/0+$/, '')
    .replace(/\.$/, '')
    .replace(/^0+/, '')
    .replace(/^\./, '0.')
    .replace(/^$/, '0');
}

function formatBigIntWithDecimals(e: bigint, t = 0) {
  const n = e.toString();
  const r = n.length;
  if (r <= t) return `0.${'0'.repeat(t - r)}${n}`;
  {
    const i = n.slice(0, r - t);
    const s = n.slice(r - t);
    return `${i}.${s}`;
  }
}

export function formatAndCleanBigInt(e: bigint, t = 0) {
  return cleanNumericString(formatBigIntWithDecimals(e, t));
}
