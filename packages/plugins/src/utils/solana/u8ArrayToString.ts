export function u8ArrayToString(bytes: number[]): string {
  return new TextDecoder('utf-8')
    .decode(new Uint8Array(bytes))
    .split('\x00')[0]
    .trim();
}
