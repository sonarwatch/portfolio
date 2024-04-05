import {
  depositTrackingV1Struct,
  multiDepositOptimizerV1Struct,
} from './structs';

export const userStrategyVaultsFilters = (address: string) => [
  {
    memcmp: {
      offset: 8,
      bytes: address,
    },
  },
  { dataSize: depositTrackingV1Struct.byteSize },
];

export const strategyVaultsFilters = [
  { dataSize: multiDepositOptimizerV1Struct.byteSize },
];
