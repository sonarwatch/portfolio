import { nativeStakePlatformId, NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientAptos } from '../../utils/clients';
import { validatorsKey, validatorsPrefix } from './constants';
import { ValidatorSet } from './types';
import { getAccountResource } from '../../utils/aptos';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientAptos();
  const resource = await getAccountResource<ValidatorSet>(
    client,
    '0x1',
    '0x1::stake::ValidatorSet'
  );
  const activeValidators = resource?.active_validators;
  if (!activeValidators) return;
  const validatorsWithStake: string[] = [];
  for (let i = 0; i < activeValidators.length; i++) {
    const validator = activeValidators[i];
    const hasStake = await client
      .view({
        payload: {
          function: '0x1::delegation_pool::operator_commission_percentage',
          typeArguments: [],
          functionArguments: [validator.addr],
        },
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
  id: `${nativeStakePlatformId}-active-validators`,
  networkIds: [NetworkId.aptos],
  executor,
  labels: ['normal', NetworkId.aptos],
};
export default job;
