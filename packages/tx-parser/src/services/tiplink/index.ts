import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import isATransferTransaction from '../../utils/parseTransaction/isATransferTransaction';

const platformId = 'tipink';
const receiverAddress = '2CcuUmUk6ggh1Q4BoTeu6bDKMY2ApfkL1GVijmDAELLU';

const mainService: ServiceDefinition = {
  id: `${platformId}-gift-card`,
  name: 'Gift Card',
  platformId,
  networkId: NetworkId.solana,
  matchTransaction: (tx) =>
    isATransferTransaction(tx) &&
    tx.transaction.message.accountKeys.some(
      (acc) => acc.pubkey.toString() === receiverAddress
    ),
};

export const services: ServiceDefinition[] = [mainService];
export default services;
