import { nativeStakePlatformId, NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { validatorsKey, validatorsPrefix } from './constants';
import { SuiValidatorInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const resource = await client.getLatestSuiSystemState();

  const { activeValidators } = resource;
  const validatorsApys = await client.getValidatorsApy();
  if (!activeValidators) return;
  const validatorsWithStake: SuiValidatorInfo[] = [];
  for (let i = 0; i < activeValidators.length; i++) {
    const validator = activeValidators[i];
    const apy = validatorsApys.apys.find(
      (validatorInfo) => validatorInfo.address === validator.suiAddress
    )?.apy;
    validatorsWithStake.push({
      apy: apy ? Number(apy) : undefined,
      logoUrl: validator.imageUrl,
      name: validator.name,
      stakeCommission: Number(validator.commissionRate),
      address: validator.suiAddress,
    });
  }
  await cache.setItem(validatorsKey, validatorsWithStake, {
    prefix: validatorsPrefix,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${nativeStakePlatformId}-active-validators-sui`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
