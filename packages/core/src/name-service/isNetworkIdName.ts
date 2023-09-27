export function isAvalancheName(name: string): boolean {
  return name.endsWith('.avax');
}
export function isEthereumName(name: string): boolean {
  return name.endsWith('.eth') && name.normalize() === name;
}
export function isSolanaName(name: string): boolean {
  return name.endsWith('.sol');
}

export function isAptosName(name: string): boolean {
  return name.endsWith('.apt');
}
