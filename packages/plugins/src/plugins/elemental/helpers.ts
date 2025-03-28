import { PublicKey } from '@solana/web3.js';
import { CachedPool } from './types';
import { Position } from './structs';
import { programId } from './constants';

export function getPositionAddress(
  poolAddress: string,
  ownerAddress: string
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('position'),
      new PublicKey(ownerAddress).toBuffer(),
      new PublicKey(poolAddress).toBuffer(),
    ],
    programId
  )[0];
}

export function getStatus(position: Position, pool: CachedPool): string {
  if (position.deactivating_amount.gt(0)) {
    if (position.last_updated_epoch_index + 1 < Number(pool.epoch_index))
      return 'unstaked';

    return 'unstaking';
  }

  if (position.amount.gt(0)) {
    if (position.last_updated_epoch_index === Number(pool.epoch_index)) {
      return 'queued';
    }

    return 'farming';
  }

  return 'inactive';
}
