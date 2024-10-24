import { sha256 } from 'js-sha256';
import { snakeCase } from '../misc/snakeCase';

export function anchorSighash(nameSpace: string, ixName: string) {
  const name = snakeCase(ixName);
  const preimage = `${nameSpace}:${name}`;
  return Buffer.from(sha256.digest(preimage)).subarray(0, 8);
}
