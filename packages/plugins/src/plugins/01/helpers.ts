import { PublicKey } from '@solana/web3.js';

export const programId = new PublicKey(
  'Zo1ggzTUKMY5bYnDvT5mtVeZxzf2FaLTbKkmvGUhUQk'
);
const state = new PublicKey('71yykwxq1zQqy99PgRsgZJXi2HHK2UDx9G4va7pH6qRv');

export function getPda(owner: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [owner.toBuffer(), state.toBuffer(), Buffer.from('marginv1')],
    programId
  )[0];
}
