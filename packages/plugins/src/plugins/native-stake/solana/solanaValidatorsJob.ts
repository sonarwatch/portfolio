import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { platformId, validatorsKey } from '../constants';
import { stakewizApi } from './constants';
import { Validator, ValidatorsApiResponse } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const res = await axios
    .get<unknown, AxiosResponse<ValidatorsApiResponse>>(stakewizApi, {
      timeout: 2000,
    })
    .catch((err) => {
      throw Error(`STAKEWIZ_API ERR: ${err}`);
    });

  if (!res.data) throw Error(`STAKEWIZ_API NO DATA`);

  const validators: Validator[] = res.data.map((r) => ({
    voter: r.vote_identity,
    name: r.name,
    imageUri: r.image,
  }));

  await cache.setItem(validatorsKey, validators, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-solana-validators`,
  executor,
  label: 'normal',
};
export default job;
