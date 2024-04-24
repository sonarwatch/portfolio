import {
  getUsdValueSum,
  NetworkId, PortfolioAsset, PortfolioElement,
  PortfolioElementType
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  flxMint,
  platformId, stakingParentObject, suiMint,
  unstackStruct,
  xflxMint
} from './constants';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { getClientSui } from '../../utils/clients';
import { StakingPosition, UnstakingPositionObject } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getOwnedObjects } from '../../utils/sui/getOwnedObjects';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const elements: PortfolioElement[] = [];
  const client = getClientSui();

  const xflxTokenPrice = await cache.getTokenPrice(xflxMint, NetworkId.sui);
  const flxTokenPrice = await cache.getTokenPrice(flxMint, NetworkId.sui);
  const suiTokenPrice = await cache.getTokenPrice(suiMint, NetworkId.sui);

  const stakingPosition = await getDynamicFieldObject<StakingPosition>(client, {
    parentId: stakingParentObject,
    name: { type: 'address', value: owner },
  });

  if (!stakingPosition.error && stakingPosition.data?.content && stakingPosition.data.content.fields.value.fields.amount !== "0") {
    const amount = new BigNumber(stakingPosition.data.content.fields.value.fields.amount).dividedBy(10 ** 8);

    const assets: PortfolioAsset[] = [];

    assets.push(tokenPriceToAssetToken(
      xflxMint,
      amount.toNumber(),
      NetworkId.sui,
      xflxTokenPrice
    ));

    assets.push({
      ...tokenPriceToAssetToken(
        suiMint,
        new BigNumber(stakingPosition.data.content.fields.value.fields.sui_pending).dividedBy(10 ** (suiTokenPrice?.decimals ?? 9)).toNumber(),
        NetworkId.sui,
        suiTokenPrice
      ),
      attributes: { isClaimable: true },
    });

    assets.push({
      ...tokenPriceToAssetToken(
        flxMint,
        new BigNumber(stakingPosition.data.content.fields.value.fields.flx_pending).dividedBy(10 ** (flxTokenPrice?.decimals ?? 8)).toNumber(),
        NetworkId.sui,
        flxTokenPrice
      ),
      attributes: { isClaimable: true },
    });

    elements.push({
      type: PortfolioElementType.multiple,
      label: 'Staked',
      networkId: NetworkId.sui,
      platformId,
      data: { assets },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    });
  }

  const unstakingPositions = await getOwnedObjects<UnstakingPositionObject>(client, owner, {
    "filter": {
      "StructType": unstackStruct
    },
    "options": {
      "showContent": true
    }
  });

  unstakingPositions.forEach((unstakingPosition) => {
    const fields = unstakingPosition.data?.content?.fields;

    if (fields && fields.balance !== "0") {
      const amount = new BigNumber(fields.balance).dividedBy(10 ** 8);

      const asset: PortfolioAsset = {
        ...tokenPriceToAssetToken(
          xflxMint,
          amount.toNumber(),
          NetworkId.sui,
          xflxTokenPrice
        ),
        attributes: {
          // lockedUntil: endDate.getTime(),
        },
      };

      elements.push({
        type: PortfolioElementType.multiple,
        label: 'Staked',
        networkId: NetworkId.sui,
        platformId,
        data: { assets: [asset] },
        value: asset.value,
      });
    }
  });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
