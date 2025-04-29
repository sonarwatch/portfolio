import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'drip';
const dripcNFTSenderAddress = 'DRiPPP2LytGjNZ5fVpdZS7Xi1oANSY3Df1gSxvUKpzny';

export const services: ServiceDefinition[] = [
  {
    id: `${platformId}-collecting`,
    name: 'Collecting',
    platformId,
    networkId: NetworkId.solana,
    matchTransaction(txn) {
      return txn.transaction.signatures.some(
        (account) => account === dripcNFTSenderAddress
      );
    },
  },
];

export default services;
