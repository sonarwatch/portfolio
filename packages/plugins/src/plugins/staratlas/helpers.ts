import { PublicKey } from '@solana/web3.js';
import { lockedVoterPid, lockerAddress, proxyRewarderPid } from './constants';

export function getProxyEscrowAddress(owner: string) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('ProxyEscrow', 'utf8'), new PublicKey(owner).toBuffer()],
    proxyRewarderPid
  )[0];
}

export function getProxyAddress(proxyEscrowAddress: string, owner: string) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('Proxy', 'utf8'),
      new PublicKey(proxyEscrowAddress).toBuffer(),
      new PublicKey(owner).toBuffer(),
    ],
    proxyRewarderPid
  )[0];
}

export function getEscrowAddress(escrowOwner: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('Escrow', 'utf8'),
      lockerAddress.toBuffer(),
      escrowOwner.toBuffer(),
    ],
    lockedVoterPid
  )[0];
}
