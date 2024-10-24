import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { distributorPid, stakingPid } from './constants';

export function getCrossMarginAccount(
  programId: PublicKey,
  userKey: PublicKey,
  seedNumber: number
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('cross-margin', 'utf-8'),
      userKey.toBuffer(),
      Uint8Array.from([seedNumber]),
    ],
    programId
  )[0];
}

export function getMarginAccount(
  programId: PublicKey,
  zetaGroup: PublicKey,
  userKey: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('margin', 'utf-8'), zetaGroup.toBuffer(), userKey.toBuffer()],
    programId
  );
}

export function getCrossMarginAccounts(
  programId: PublicKey,
  owner: PublicKey,
  startId: number,
  endId: number
): PublicKey[] {
  const keys = [];
  for (let i = startId; i < endId; i++) {
    keys.push(getCrossMarginAccount(programId, owner, i));
  }
  return keys;
}

export function getStakeAccountAddress(
  userKey: PublicKey,
  bit: number
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('stake-account'), userKey.toBuffer(), Uint8Array.from([bit])],
    stakingPid
  );
}

export function getStakeAccountsAddresses(
  userKey: string,
  start: number,
  end: number
): PublicKey[] {
  const user = new PublicKey(userKey);
  const keys = [];
  for (let i = start; i <= end; i++) {
    keys.push(getStakeAccountAddress(user, i)[0]);
  }
  return keys;
}

const timestampOfEpoch0 = new BigNumber(1719144000000);
const oneDay = 60 * 60 * 24 * 1000;
export function getTimestamp(stakeDuration: number, startEpoch: number) {
  return timestampOfEpoch0
    .plus((startEpoch + stakeDuration) * oneDay)
    .toNumber();
}

export function deriveZetaClaimStatus(
  claimant: string,
  distributor: string
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('ClaimStatus'),
      new PublicKey(distributor).toBytes(),
      new PublicKey(claimant).toBytes(),
    ],
    new PublicKey(distributorPid)
  )[0];
}

export function deriveZetaClaimStatuses(
  claimant: string,
  distributors: string[]
): PublicKey[] {
  return distributors.map((d) => deriveZetaClaimStatus(claimant, d));
}
