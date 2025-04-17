import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { bucketProtocolId, bucketsCacheKey, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { BucketObject, BucketProtocol, Bucket, PipeObject } from './types';
import { getObject } from '../../utils/sui/getObject';
import { getDynamicFieldObjects } from '../../utils/sui/getDynamicFieldObjects';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const [bucketProtocol, fields] = await Promise.all([
    getObject<BucketProtocol>(client, bucketProtocolId),
    getDynamicFieldObjects(client, bucketProtocolId),
  ]);

  const buckets: Bucket[] = [];

  fields.forEach((field) => {
    if (!field.data?.content) return;

    if (field.data?.type?.includes('::bucket::Bucket')) {
      const token = field.data.type?.split('<').pop()?.replace('>', '') ?? '';

      const a = field.data.content.fields as BucketObject;
      buckets.push({
        token,
        baseFeeRate: Number(a.base_fee_rate ?? 5e3),
        bottleTableSize: a.bottle_table.fields.table.fields.size ?? '',
        bottleTableId: a.bottle_table.fields.table.fields.id.id ?? '',
        collateralDecimal: a.collateral_decimal ?? 0,
        collateralVault: a.collateral_vault ?? '',
        latestRedemptionTime: Number(a.latest_redemption_time ?? 0),
        minCollateralRatio: a.min_collateral_ratio ?? '',
        mintedBuckAmount: a.minted_buck_amount ?? '',
        minBottleSize: bucketProtocol.data?.content?.fields.min_bottle_size,
        maxMintAmount: a.max_mint_amount ?? '',
        recoveryModeThreshold: a.recovery_mode_threshold ?? '',
      });
    }
  });

  fields.forEach((field) => {
    if (!field.data?.content) return;
    if (field.data?.type?.includes('::pipe::Pipe')) {
      const token =
        field.data?.type
          ?.split('<')
          .pop()
          ?.replace('>', '')
          .split(', ')[0]
          ?.trim() ?? '';
      const bucket = buckets.find((b) => b.token === token);
      if (bucket) {
        const a = field.data.content.fields as PipeObject;
        bucket.collateralVault = (
          BigInt(bucket.collateralVault) + BigInt(a.output_volume)
        ).toString();
      }
    }
  });

  await cache.setItem(bucketsCacheKey, buckets, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
};
const job: Job = {
  id: `${platformId}-buckets`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
