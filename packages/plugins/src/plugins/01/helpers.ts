import { PublicKey } from '@solana/web3.js';
import { programId } from './constants';

const state = new PublicKey('71yykwxq1zQqy99PgRsgZJXi2HHK2UDx9G4va7pH6qRv');

export function getPda(owner: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [owner.toBuffer(), state.toBuffer(), Buffer.from('marginv1')],
    programId
  )[0];
}
