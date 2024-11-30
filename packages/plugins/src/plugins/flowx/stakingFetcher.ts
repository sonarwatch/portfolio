import {
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  suiNativeAddress,
  suiNativeDecimals,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  flxDecimals,
  flxMint,
  lpDecimals,
  platformId,
  stakingParentObject,
  unstackStruct,
  xflxMint,
} from './constants';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { getClientSui } from '../../utils/clients';
import { StakingPosition, UnstakingPositionObject } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getUnlockingAt } from './helpers';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const [stakingPosition, unstakingPositions] = await Promise.all([
    getDynamicFieldObject<StakingPosition>(client, {
      parentId: stakingParentObject,
      name: { type: 'address', value: owner },
    }),
    getOwnedObjectsPreloaded<UnstakingPositionObject>(client, owner, {
      filter: {
        StructType: unstackStruct,
      },
    }),
  ]);
  if (
    unstakingPositions.length === 0 &&
    stakingPosition.data?.content?.fields.value.fields.amount === '0'
  )
    return [];

  // Token Prices
  const [xflxTokenPrice, flxTokenPrice, suiTokenPrice] =
    await cache.getTokenPrices(
      [xflxMint, flxMint, suiNativeAddress],
      NetworkId.sui
    );

  const assets: PortfolioAsset[] = [];
  if (
    !stakingPosition.error &&
    stakingPosition.data?.content &&
    stakingPosition.data.content.fields.value.fields.amount !== '0'
  ) {
    const amount = new BigNumber(
      stakingPosition.data.content.fields.value.fields.amount
    ).dividedBy(10 ** lpDecimals);

    assets.push(
      tokenPriceToAssetToken(
        xflxMint,
        amount.toNumber(),
        NetworkId.sui,
        xflxTokenPrice
      )
    );

    if (stakingPosition.data.content.fields.value.fields.sui_pending !== '0')
      assets.push(
        tokenPriceToAssetToken(
          suiNativeAddress,
          new BigNumber(
            stakingPosition.data.content.fields.value.fields.sui_pending
          )
            .dividedBy(10 ** suiNativeDecimals)
            .toNumber(),
          NetworkId.sui,
          suiTokenPrice,
          undefined,
          { isClaimable: true }
        )
      );

    if (stakingPosition.data.content.fields.value.fields.flx_pending !== '0')
      assets.push(
        tokenPriceToAssetToken(
          flxMint,
          new BigNumber(
            stakingPosition.data.content.fields.value.fields.flx_pending
          )
            .dividedBy(10 ** flxDecimals)
            .toNumber(),
          NetworkId.sui,
          flxTokenPrice,
          undefined,
          { isClaimable: true }
        )
      );
  }

  unstakingPositions.forEach((unstakingPosition) => {
    const fields = unstakingPosition.data?.content?.fields;

    if (fields && fields.balance !== '0') {
      const amount = new BigNumber(fields.balance).dividedBy(10 ** lpDecimals);

      const unlockingAt = getUnlockingAt(fields.unlocked_at_epoch);

      const asset: PortfolioAsset = {
        ...tokenPriceToAssetToken(
          xflxMint,
          amount.toNumber(),
          NetworkId.sui,
          xflxTokenPrice
        ),
        attributes: {
          tags: ['Unstaking'],
          lockedUntil: unlockingAt,
        },
      };

      assets.push(asset);
    }
  });

  if (assets.length === 0) return [];

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Staked',
      networkId: NetworkId.sui,
      platformId,
      data: { assets },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
