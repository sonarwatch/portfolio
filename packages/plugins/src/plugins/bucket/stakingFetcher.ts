import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, sbuckId, stakeProofParentId } from './constants';
import { getClientSui } from '../../utils/clients';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { StakeProof } from './types';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const stakeProof = await getDynamicFieldObject<StakeProof>(client, {
    parentId: stakeProofParentId,
    name: {
      type: 'address',
      value: owner,
    },
  });

  if (!stakeProof.data?.content) return [];

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);

  stakeProof.data.content.fields.value.forEach((pos) => {
    const element = elementRegistry.addElementMultiple({
      label: 'Staked',
    });

    element.addAsset({
      address: sbuckId,
      amount: pos.fields.stake_amount,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
