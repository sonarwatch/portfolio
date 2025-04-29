import { ParsedTransactionWithMeta } from '@solana/web3.js';
import { Service } from '@sonarwatch/portfolio-core';
import { sortedServiceDefinitions } from '../../services';
import { ServiceDefinition } from '../../ServiceDefinition';

/**
 * Finds the first matching service for a given Solana transaction.
 *
 * Expects services to be pre-sorted by:
 *  1. Priority (desc)
 *  2. Number of contracts (desc)
 *
 * Matching strategy:
 * - Uses `matchesTransaction` if defined,
 * - Otherwise, checks if all service contracts are present in the txn.
 *
 * Returns the matching service with only core fields.
 */
export const getTransactionService = (
  txn: ParsedTransactionWithMeta
): Service | undefined => {
  const { instructions } = txn.transaction.message;

  const txnContractAddresses = instructions
    .map((i) => i.programId.toString())
    .filter((value, index, self) => self.indexOf(value) === index);

  return toService(
    sortedServiceDefinitions.find((service) =>
      hasMatchTransaction(service)
        ? service.matchTransaction(txn, txnContractAddresses)
        : defaultMatchTransaction(service, txnContractAddresses)
    )
  );
};

const defaultMatchTransaction = (
  service: ServiceDefinition,
  contracts: string[]
): boolean =>
  service.contracts
    ? service.contracts.every((contract) =>
        contracts.includes(contract.address)
      )
    : false;

const hasMatchTransaction = (
  service: ServiceDefinition
): service is ServiceDefinition & {
  matchTransaction: (
    txn: ParsedTransactionWithMeta,
    contracts: string[]
  ) => boolean;
} => typeof service.matchTransaction === 'function';

const toService = (def?: ServiceDefinition): Service | undefined => {
  if (!def) return undefined;
  const { id, name, platformId, networkId, link, description } = def;
  return { id, name, platformId, networkId, link, description };
};
