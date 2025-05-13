import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { systemContract } from '../solana';

const platformId = 'solcasino';

const contract = {
  name: 'Solcasino',
  address: 'CQ36xjMHgmgwEM1yvJYUWg3YxMvzwM4Mntn6vZrMk86z',
  platformId,
};

const depositService: ServiceDefinition = {
  id: `${platformId}-deposit`,
  name: 'Deposit',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const withdrawService: ServiceDefinition = {
  id: `${platformId}-withdraw`,
  name: 'Withdraw',
  platformId,
  networkId: NetworkId.solana,
  matchTransaction: (txn) =>
    txn.transaction.message.instructions.some(
      (ix) => ix.programId.toString() === systemContract.address
    ) &&
    txn.transaction.message.accountKeys.some(
      (x) =>
        x.pubkey.toString() ===
          '6qkh2JcHt3ctFeiL4HBn1e9NU5aPw25XNhtgEv6ZCJ4U' && x.signer
    ),
};

export const services: ServiceDefinition[] = [depositService, withdrawService];
export default services;
