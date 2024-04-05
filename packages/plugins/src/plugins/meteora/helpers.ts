import { PublicKey } from '@solana/web3.js';
import { farmProgramId } from './constants';

export function getStakingAccounts(
  owner: string,
  farms: string[]
): PublicKey[] {
  return farms.map(
    (farm) =>
      PublicKey.findProgramAddressSync(
        [new PublicKey(owner).toBuffer(), new PublicKey(farm).toBuffer()],
        farmProgramId
      )[0]
  );
}
