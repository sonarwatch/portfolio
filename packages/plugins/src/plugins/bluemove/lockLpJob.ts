import {
  NetworkId,
  suiNativeAddress,
  uniformTokenAddress,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { lockedLpDataCacheKey, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { getObject } from '../../utils/sui/getObject';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const LPData = await getObject<{
    pool_info: {
      fields: {
        average_locked_time: string;
        last_time_locked: string;
        lp_type: string;
        total_locked_duration: string;
        total_number_loked: string;
        total_pool_amount: string;
      };
      type: string;
    }[];
  }>(
    client,
    '0x97ca02bd340ae343fee72dd8b9924f758ea1ceb2b034ffcc83719992e803cdb2'
  );

  if (!LPData.data?.content?.fields.pool_info) return;

  await cache.setItem(
    lockedLpDataCacheKey,
    LPData.data.content.fields.pool_info.map((pool_info) =>
      uniformTokenAddress(
        `0x${pool_info.fields.lp_type
          .replace('<0', '<0x0')
          .replace(',', ', 0x')
          .replace(suiNativeAddress, '0x2::sui::SUI')}`,
        NetworkId.sui
      )
    ),
    {
      prefix: platformId,
      networkId: NetworkId.sui,
    }
  );
};
const job: Job = {
  id: `${platformId}-lock-lp`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
