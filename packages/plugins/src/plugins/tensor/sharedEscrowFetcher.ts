import { NetworkId, solanaNativeAddress } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { findMarginPDA } from './helpers';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const marginPDA = findMarginPDA(owner);

  const solRawBalance = await client.getBalance(marginPDA);

  if (!solRawBalance || solRawBalance === 0) return [];

  const rent = await client.getMinimumBalanceForRentExemption(8);

  const amount = new BigNumber(solRawBalance).minus(rent);

  if (amount.lte(1000000)) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  const element = elementRegistry.addElementMultiple({
    label: 'Deposit',
    name: 'Shared Escrow',
  });

  element.addAsset({
    address: solanaNativeAddress,
    amount,
  });

  return elementRegistry.getElements(cache);
};
const fetcher: Fetcher = {
  id: `${platformId}-shared-escrow`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
