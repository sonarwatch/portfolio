import { NetworkId, Service } from '@sonarwatch/portfolio-core';
import { jupiterV6Contract } from '../jupiter';
import { saveContract } from '../save';

const platformId = 'dumpy';
const lendingContract = {
  name: 'Short Lending',
  address: '3JmCcXAjmBpFzHHuUpgJFfTQEQnAR7K1erNLtWV1g7d9',
  platformId,
};

const lendingService: Service = {
  id: `${platformId}-short-lending`,
  name: 'Short Lending',
  platformId,
  networkId: NetworkId.solana,
  contracts: [lendingContract, jupiterV6Contract, saveContract],
};

export const services: Service[] = [lendingService];
export default services;
