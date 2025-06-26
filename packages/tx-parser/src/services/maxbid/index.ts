import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition, ServicePriority } from '../../ServiceDefinition';
import { lavarageSolContract, lavarageUsdcContract } from '../lavarage';

const platformId = 'maxbid';

const maxbidFeesAccount = '8iMq4uShCbj4HAGKrHHd9EY4SmYor2y1XRP7Fh21BwHJ';

const service: ServiceDefinition = {
  id: `${platformId}`,
  name: 'Trade',
  platformId,
  networkId: NetworkId.solana,
  matchTransaction: (tx, contracts) =>
    (contracts.includes(lavarageSolContract.address) ||
      contracts.includes(lavarageUsdcContract.address)) &&
    tx.transaction.message.accountKeys.some(
      (ak) => ak.pubkey.toString() === maxbidFeesAccount
    ),
  priority: ServicePriority.high,
};

export const services: ServiceDefinition[] = [service];
export default services;
