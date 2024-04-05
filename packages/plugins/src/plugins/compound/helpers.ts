import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';

// We didn't manage to understand why on some networks the borrow decimals were different.
// TODO improve this part (use borrowIndex ?)
export function getBDecimal(networkId: EvmNetworkIdType): number | undefined {
  switch (networkId) {
    case 'bnb':
      return 18;
      break;
    case 'ethereum':
      return 6;
    case 'avalanche':
      return 6;
    default:
      console.log('Unsupported NetworkId');
      return undefined;
      break;
  }
}
