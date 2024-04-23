import { NetworkIdType } from './Network';
import { ContractId } from './Portfolio';
import { assertNetworkId } from './utils';

export function getNetworkIdFromContractId(
  contractId: ContractId
): NetworkIdType {
  if (!contractId.includes('_')) throw new Error('Invalid Contract Id');

  return assertNetworkId(contractId.slice(0, contractId.indexOf('_')));
}
