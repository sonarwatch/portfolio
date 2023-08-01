import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientAptos } from '../../utils/clients';
import { platformId, validatorsKey, validatorsPrefix } from './constants';
import { ValidatorSet } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientAptos();
  const resources = (await client.getAccountResource(
    '0x1',
    '0x1::stake::ValidatorSet'
  )) as ValidatorSet;
  const activeValidators = resources.data.active_validators;
  const validatorsWithStake: string[] = [];
  for (let i = 0; i < activeValidators.length; i++) {
    const validator = activeValidators[i];
    const hasStake = await client
      .view({
        function: '0x1::delegation_pool::operator_commission_percentage',
        type_arguments: [],
        arguments: [validator.addr],
      })
      .catch(() => {});
    if (hasStake) validatorsWithStake.push(validator.addr);
  }
  await cache.setItem(validatorsKey, validatorsWithStake, {
    prefix: validatorsPrefix,
    networkId: NetworkId.aptos,
  });
};

const job: Job = {
  id: `${platformId}-active-validators`,
  executor,
};
export default job;
