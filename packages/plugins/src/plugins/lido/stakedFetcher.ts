import { ethereumNetwork } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  platformId,
  stakedAddresses,
  wstETHAddress,
  stMATICAddress,
  networkId,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getEvmClient } from '../../utils/clients';
import { ethFactor } from '../../utils/evm/constants';
import { getBalances } from '../../utils/evm/getBalances';
import { getWstETHAsset, getStMATICAsset } from './helper';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getEvmClient(networkId);
  const elementRegistry = new ElementRegistry(networkId, platformId);
  const balancesResults = await getBalances(owner, stakedAddresses, networkId);

  await Promise.all(
    balancesResults.map(async (balance, index) => {
      if (!balance) return;

      const amount = new BigNumber(balance.toString());
      if (amount.isZero()) return;

      if (stakedAddresses[index] === wstETHAddress) {
        getWstETHAsset(balance, client, elementRegistry);
        return;
      }

      if (stakedAddresses[index] === stMATICAddress) {
        getStMATICAsset(balance, client, elementRegistry);
        return;
      }

      const element = elementRegistry.addElementMultiple({
        label: 'Staked',
      });
      element.addAsset({
        address: ethereumNetwork.native.address,
        amount: amount.div(ethFactor).toNumber(),
      });
    })
  );

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staked`,
  networkId,
  executor,
};

export default fetcher;
