import {
  NetworkId,
  PortfolioAsset,
  getUsdValueSum,
  seiNativeAddress,
  seiNetwork,
} from '@sonarwatch/portfolio-core';
import Long from 'long';
import BigNumber from 'bignumber.js';
import { platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import { getClientSei } from '../../utils/clients';
import { DelegationResponse } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const maxBalances = 1500;
const limit = Long.fromNumber(200);
const key: Uint8Array = new Uint8Array(0);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const delegations: DelegationResponse[] = [];
  let offset = Long.ZERO;
  let nextKey: Uint8Array | null = new Uint8Array(0);
  const client = await getClientSei();
  do {
    const res = await client.cosmos.staking.v1beta1.delegatorDelegations({
      delegatorAddr: owner,
      pagination: {
        countTotal: true,
        key,
        limit,
        offset,
        reverse: false,
      },
    });
    delegations.push(...res.delegationResponses);
    nextKey = res.pagination.nextKey as Uint8Array | null;
    offset = offset.add(limit);
    if (offset.greaterThanOrEqual(res.pagination.total)) break;
  } while (nextKey !== null && offset.lt(maxBalances));

  if (delegations.length === 0) return [];
  const seiTokenPrice = await cache.getTokenPrice(
    seiNativeAddress,
    NetworkId.sei
  );
  if (!seiTokenPrice) return [];

  const nativeAssets: PortfolioAsset[] = [];

  for (const delegation of delegations) {
    const amount = new BigNumber(delegation.balance.amount)
      .dividedBy(10 ** seiTokenPrice.decimals)
      .toNumber();

    const stakedAsset = tokenPriceToAssetToken(
      seiNetwork.native.address,
      amount,
      NetworkId.sei,
      seiTokenPrice
    );
    nativeAssets.push(stakedAsset);
  }
  return [
    {
      networkId: NetworkId.sei,
      platformId,
      type: 'multiple',
      label: 'Staked',
      value: getUsdValueSum(nativeAssets.map((a) => a.value)),
      data: {
        assets: nativeAssets,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-sei`,
  networkId: NetworkId.sei,
  executor,
};

export default fetcher;
