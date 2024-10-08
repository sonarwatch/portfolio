import {
  formatMoveTokenAddress,
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  suiNativeAddress,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { jwlSui, platformId, stakedAssetInfos } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSui } from '../../utils/clients';
import { UserInfo, UserJwltokenInfo } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';

const tenDays = 10 * 24 * 60 * 60 * 1000;
const sevenDays = 7 * 24 * 60 * 60 * 1000;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const userInfos = await Promise.all([
    ...stakedAssetInfos.map((info) =>
      getDynamicFieldObject(client, {
        parentId: info.parentId,
        name: {
          type: 'address',
          value: owner,
        },
      })
    ),
  ]);

  if (!userInfos.some((obj) => obj.data)) return [];

  const tokenPriceById = await cache.getTokenPricesAsMap(
    stakedAssetInfos.map((info) => [info.underlying, info.asset]).flat(),
    NetworkId.sui
  );

  const suiUnstakingAssets: PortfolioAsset[] = [];
  const stakedAssets: PortfolioAsset[] = [];
  for (let n = 0; n < userInfos.length; n++) {
    if (!userInfos[n].data?.content?.fields) continue;

    const assetInfo = stakedAssetInfos[n];
    const assetTokenPrice = tokenPriceById.get(
      formatMoveTokenAddress(assetInfo.asset)
    );

    if (assetInfo.underlying === suiNativeAddress) {
      const { fields } = (userInfos[n].data?.content?.fields as UserInfo).value;
      const sjwlAmount = new BigNumber(fields.sjwlsui_amount).dividedBy(
        10 ** 9
      );

      const unstakingSuiAmount = new BigNumber(
        fields.reserved_redeem_amount
      ).dividedBy(10 ** 9);

      if (!unstakingSuiAmount.isZero()) {
        const suiTokenPrice = tokenPriceById.get(
          formatMoveTokenAddress(suiNativeAddress)
        );
        suiUnstakingAssets.push(
          tokenPriceToAssetToken(
            suiNativeAddress,
            unstakingSuiAmount.toNumber(),
            NetworkId.sui,
            suiTokenPrice,
            undefined,
            {
              lockedUntil: Number(fields.last_redeem_reserved_at) + tenDays,
            }
          )
        );
      }

      if (!sjwlAmount.isZero())
        stakedAssets.push(
          tokenPriceToAssetToken(
            jwlSui,
            sjwlAmount.toNumber(),
            NetworkId.sui,
            assetTokenPrice
          )
        );
    } else {
      const { fields } = (
        userInfos[n].data?.content?.fields as UserJwltokenInfo
      ).value.fields.value;
      const amount = new BigNumber(fields.jwltoken_staked).dividedBy(10 ** 9);

      if (!amount.isZero())
        stakedAssets.push(
          tokenPriceToAssetToken(
            assetInfo.asset,
            amount.toNumber(),
            NetworkId.sui,
            assetTokenPrice,
            undefined,
            {
              lockedUntil: Number(fields.last_staked_at) + sevenDays,
            }
          )
        );
    }
  }

  if (!stakedAssets && !suiUnstakingAssets) return [];

  const elements: PortfolioElement[] = [];
  if (stakedAssets.length !== 0) {
    elements.push({
      type: PortfolioElementType.multiple,
      label: 'Staked',
      networkId: NetworkId.sui,
      platformId,
      data: {
        assets: stakedAssets,
      },
      value: getUsdValueSum(stakedAssets.map((a) => a.value)),
    });
  }

  if (suiUnstakingAssets.length !== 0) {
    elements.push({
      type: PortfolioElementType.multiple,
      label: 'Deposit',
      networkId: NetworkId.sui,
      platformId,
      data: {
        assets: suiUnstakingAssets,
      },
      value: getUsdValueSum(suiUnstakingAssets.map((a) => a.value)),
    });
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
