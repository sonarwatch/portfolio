import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  bottleTableException,
  bucketsCacheKey,
  buckId,
  platformId,
} from './constants';
import { getClientSui } from '../../utils/clients';
import { Bucket, CollateralFields, FountainStakeProof } from './types';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';

const bucketsMemo = new MemoizedCache<Bucket[]>(bucketsCacheKey, {
  prefix: platformId,
  networkId: NetworkId.sui,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const buckets = await bucketsMemo.getItem(cache);

  if (!buckets || !buckets.length) return [];

  const positions = await Promise.all(
    buckets.map(async (bucket) => {
      let address = owner;
      if (Object.keys(bottleTableException).includes(bucket.token)) {
        const stakeProof = await getDynamicFieldObject<FountainStakeProof>(
          client,
          {
            parentId: bottleTableException[bucket.token],
            name: {
              type: 'address',
              value: owner,
            },
          }
        );

        address =
          stakeProof.data?.content?.fields.value[0].fields.strap_address ||
          owner;
      }
      return getDynamicFieldObject<CollateralFields>(client, {
        parentId: bucket.bottleTableId,
        name: {
          type: 'address',
          value: address,
        },
      });
    })
  );

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);

  buckets.forEach((bucket, i) => {
    const positionData = positions[i];
    if (!positionData.data?.content?.fields.value.fields.value.fields) return;

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
    });

    element.addBorrowedAsset({
      address: buckId,
      amount:
        positionData.data?.content?.fields.value.fields.value.fields
          .buck_amount,
    });

    element.addSuppliedAsset({
      address: bucket.token,
      amount:
        positionData.data?.content?.fields.value.fields.value.fields
          .collateral_amount,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-collateral`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
