import { NetworkId } from '@sonarwatch/portfolio-core';
import { ParsedTransactionWithMeta } from '@solana/web3.js';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'lavarage';

export const lavarageUsdcContract = {
  name: 'USDC Leverage',
  address: '1avaAUcjccXCjSZzwUvB2gS3DzkkieV2Mw8CjdN65uu',
  platformId,
};

export const lavarageSolContract = {
  name: 'SOL Leverage',
  address: 'CRSeeBqjDnm3UPefJ9gxrtngTsnQRhEJiTA345Q83X3v',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-leverage`,
  name: 'Leverage',
  platformId,
  networkId: NetworkId.solana,
  matchTransaction: (txn: ParsedTransactionWithMeta, contracts: string[]) =>
    contracts.some((contract) =>
      [lavarageUsdcContract.address, lavarageSolContract.address].includes(
        contract
      )
    ),
};

export const services: ServiceDefinition[] = [service, service];
export default services;
