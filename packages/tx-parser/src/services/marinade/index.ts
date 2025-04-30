import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { systemContract } from '../solana';

const platformId = 'marinade';
const contract = {
  name: 'Ticket',
  address: 'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD',
  platformId,
};

const airdropContract = {
  name: 'Airdrop',
  address: 'indiXdKbsC4QSLQQnn6ngZvkqfywn6KgEeQbkGSpk1V',
  platformId,
};

const nativeStakingOperator = 'opNS8ENpEMWdXcJUgJCsJTDp7arTXayoBEeBUg6UezP';

const service: ServiceDefinition = {
  id: `${platformId}-ticket`,
  name: 'Ticket',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const airdropService: ServiceDefinition = {
  id: `${platformId}-airdrop`,
  name: 'Airdrop',
  platformId,
  networkId: NetworkId.solana,
  contracts: [airdropContract],
};

const nativeStakeService: ServiceDefinition = {
  id: `${platformId}-native-stake`,
  name: 'Native Stake',
  platformId,
  networkId: NetworkId.solana,
  matchTransaction: (txn) =>
    txn.transaction.message.accountKeys.some(
      (accnt) => accnt.pubkey.toString() === nativeStakingOperator
    ) &&
    txn.transaction.message.instructions.some(
      (instruction) =>
        instruction.programId.toString() === systemContract.address
    ),
};
export const services: ServiceDefinition[] = [
  service,
  airdropService,
  nativeStakeService,
];
export default services;
