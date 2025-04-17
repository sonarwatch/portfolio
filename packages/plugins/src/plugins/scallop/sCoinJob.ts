import { NetworkId } from '@sonarwatch/portfolio-core';
import { Job, JobExecutor } from '../../Job';
import { scoinKey, scoinPrefix as prefix } from './constants';
import { Cache } from '../../Cache';
import { SCoinNames, SCoinTypeMetadata, sCoinTypesMap } from './types';
import { getClientSui } from '../../utils/clients';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const sCoinTypes: SCoinTypeMetadata = Object.entries(sCoinTypesMap).reduce(
    (prev, curr) => {
      const [coinName, coinType] = curr;
      // eslint-disable-next-line no-param-reassign
      prev[coinName as SCoinNames] = {
        coinType,
        metadata: null,
      };
      return prev;
    },
    {} as SCoinTypeMetadata
  );

  // get metadata for each coin type
  await Promise.all(
    Object.entries(sCoinTypes).map(async ([coinName, coinTypeMetadata]) => {
      const { coinType } = coinTypeMetadata;
      const metadata = await client.getCoinMetadata({ coinType });
      sCoinTypes[coinName as SCoinNames].metadata = metadata;
    })
  );
  await cache.setItem(scoinKey, sCoinTypes, {
    prefix,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: prefix,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
