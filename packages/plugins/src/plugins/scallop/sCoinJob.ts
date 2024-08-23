import { NetworkId } from '../../../../core/src/Network';
import { Job, JobExecutor } from '../../Job';
import { scoinKey, sCoinTypesMap, scoinPrefix as prefix } from './constants';
import { Cache } from '../../Cache';
import { sCoinNames, SCoinTypeMetadata } from './types';
import { client } from './suiClient';

const executor: JobExecutor = async (cache: Cache) => {
  const sCoinTypes: SCoinTypeMetadata = Object.entries(sCoinTypesMap).reduce(
    (prev, curr) => {
      const [coinName, coinType] = curr;
      prev[coinName as sCoinNames] = {
        coinType: coinType,
        metadata: null,
      };
      return prev;
    },
    {} as SCoinTypeMetadata
  );

  // get metadata for each coin type
  await Promise.all(
    Object.entries(sCoinTypes).map(async ([coinName, coinTypeMetadata]) => {
      const coinType = coinTypeMetadata.coinType;
      const metadata = await client.getCoinMetadata({ coinType });
      sCoinTypes[coinName as sCoinNames].metadata = metadata;
    })
  );
  await cache.setItem(scoinKey, sCoinTypes, {
    prefix,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: prefix,
  executor,
  label: 'normal',
};
export default job;
