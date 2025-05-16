import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'drip';
const dripcNFTSenderAddress = 'DRiPPP2LytGjNZ5fVpdZS7Xi1oANSY3Df1gSxvUKpzny';
const creatorRewardsSenderAddress =
  'DRiPChZsgQMpQMkEd3odwE6fnAfcXjGgtfrqymBQTuTS';
export const services: ServiceDefinition[] = [
  {
    id: `${platformId}-collecting`,
    name: 'Collecting',
    platformId,
    networkId: NetworkId.solana,
    matchTransaction(txn) {
      return txn.transaction.message.accountKeys.some(
        (accountKey) =>
          accountKey.signer &&
          accountKey.pubkey.toString() === dripcNFTSenderAddress
      );
    },
  },
  {
    id: `${platformId}-creator-rewards`,
    name: 'Creator Rewards',
    platformId,
    networkId: NetworkId.solana,
    matchTransaction(txn) {
      return txn.transaction.message.accountKeys.some(
        (accountKey) =>
          accountKey.signer &&
          accountKey.pubkey.toString() === creatorRewardsSenderAddress
      );
    },
  },
];

export default services;
