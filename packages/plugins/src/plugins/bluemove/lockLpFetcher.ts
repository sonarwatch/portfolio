import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { lockedLpDataCacheKey, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { getDynamicFieldObjects } from '../../utils/sui/getDynamicFieldObjects';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { ID } from '../../utils/sui/types/id';
import { LockLpUserInfo } from './types';

const lockLpMemo = new MemoizedCache<string[]>(lockedLpDataCacheKey, {
  prefix: platformId,
  networkId: NetworkId.sui,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const poolUserInfo = await getDynamicFieldObject<{ id: ID }>(client, {
    parentId:
      '0xb848554079decb6164da129851595e7725b1c4ee3e687801a30ed8de975b54d2',
    name: {
      type: 'address',
      value: owner,
    },
  });
  if (!poolUserInfo?.data?.content?.fields.id.id) return [];

  const userInfos = await getDynamicFieldObjects<LockLpUserInfo>(
    client,
    poolUserInfo.data?.content?.fields.id.id
  );
  if (!userInfos.length) return [];

  const lpTokens = await lockLpMemo.getItem(cache);

  if (!lpTokens) return [];

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);
  const element = elementRegistry.addElementLiquidity({
    label: 'LiquidityPool',
  });

  userInfos.forEach((userInfo) => {
    userInfo.data?.content?.fields.items.fields.contents.forEach((item) => {
      const liquidity = element.addLiquidity();
      liquidity.addAsset({
        address: lpTokens[Number(item.fields.value.fields.pool_id)],
        amount: item.fields.value.fields.locked_amout,
        attributes: {
          lockedUntil: Number(item.fields.value.fields.locked_until),
        },
      });
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-lock-lp`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
