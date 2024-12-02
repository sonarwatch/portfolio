import { NetworkId, suiNativeAddress } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  stakingPackage,
  alpType,
  platformId,
  poolAccRewardPerShareKey,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSui } from '../../utils/clients';
import { Credential } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const objects = await getOwnedObjectsPreloaded<Credential>(client, owner, {
    filter: {
      MoveModule: {
        package: stakingPackage,
        module: 'pool',
      },
    },
  });
  if (objects.length === 0) return [];

  const poolAccRewardPerShareStr = await cache.getItem<string>(
    poolAccRewardPerShareKey,
    {
      prefix: platformId,
      networkId: NetworkId.sui,
    }
  );
  const poolAccRewardPerShare = poolAccRewardPerShareStr
    ? new BigNumber(poolAccRewardPerShareStr)
    : undefined;

  let alpAmount = new BigNumber(0);
  let claimableAmount = new BigNumber(0);

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);
  const element = elementRegistry.addElementLiquidity({
    label: 'Staked',
  });
  const liquidity = element.addLiquidity();

  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    const cAlpAmount = object.data?.content?.fields.stake;
    if (!cAlpAmount) continue;
    alpAmount = alpAmount.plus(cAlpAmount);

    if (!poolAccRewardPerShare) continue;
    const accRewardPerShare = object.data?.content?.fields.acc_reward_per_share;
    if (!accRewardPerShare) continue;

    const cClaimableAmount = poolAccRewardPerShare
      .minus(accRewardPerShare)
      .times(cAlpAmount)
      .div(10 ** 18);
    claimableAmount = claimableAmount.plus(cClaimableAmount);
  }

  liquidity.addAsset({
    address: alpType,
    amount: alpAmount,
  });

  if (claimableAmount.isGreaterThan(0))
    liquidity.addRewardAsset({
      address: suiNativeAddress,
      amount: claimableAmount,
      attributes: {
        isClaimable: true,
      },
    });

  if (claimableAmount.isZero() && alpAmount.isZero()) return [];

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
