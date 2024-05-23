import { BCS, getSuiMoveConfig } from '@mysten/bcs';

const bcs = new BCS(getSuiMoveConfig());

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serializeReturnValue = (e: any) => {
  let t = e[0];

  if (t instanceof Array) t = Uint8Array.from(t);

  const n = bcs.de(e[1], t);
  return e[1] === 'u64' ? BigInt(n) : n;
};
