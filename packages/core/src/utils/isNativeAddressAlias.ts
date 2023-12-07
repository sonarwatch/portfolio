const aliases = { sui: ['0x2::sui::SUI'] };

export function isNativeAddressAliasSui(address: string): boolean {
  return aliases.sui.includes(address);
}
