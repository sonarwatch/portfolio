import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import { getObjectFields } from '@mysten/sui.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { buckId, collaterals, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { CollateralFields } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const buckPrice = await cache.getTokenPrice(buckId, NetworkId.sui);
  if (!buckPrice) return [];
  const elements: PortfolioElement[] = [];

  for (const collateral of collaterals) {
    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];
    const input = {
      parentId: collateral.parentId,
      name: {
        type: 'address',
        value: owner,
      },
    };
    const positionData = await client.getDynamicFieldObject(input);
    if (!positionData.data) continue;

    const tokenPrice = await cache.getTokenPrice(
      collateral.tokenId,
      NetworkId.sui
    );
    if (!tokenPrice) continue;

    const collateralFields = getObjectFields(positionData) as CollateralFields;
    if (
      !collateralFields.value ||
      !collateralFields.value.fields ||
      !collateralFields.value.fields.value ||
      !collateralFields.value.fields.value.fields
    )
      continue;

    const collateralInfo = collateralFields.value.fields.value.fields;
    const suppliedQuantity = new BigNumber(collateralInfo.collateral_amount)
      .dividedBy(10 ** tokenPrice.decimals)
      .toNumber();
    if (suppliedQuantity === 0) continue;
    const borrowedQuantity = new BigNumber(collateralInfo.buck_amount)
      .dividedBy(10 ** buckPrice.decimals)
      .toNumber();

    borrowedAssets.push(
      tokenPriceToAssetToken(buckId, borrowedQuantity, NetworkId.sui, buckPrice)
    );

    suppliedAssets.push(
      tokenPriceToAssetToken(
        collateral.tokenId,
        suppliedQuantity,
        NetworkId.sui,
        tokenPrice
      )
    );

    const { borrowedValue, healthRatio, suppliedValue, value } =
      getElementLendingValues(suppliedAssets, borrowedAssets, rewardAssets);

    const element: PortfolioElement = {
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.sui,
      platformId,
      label: 'Lending',
      value,
      data: {
        borrowedAssets,
        borrowedValue,
        borrowedYields,
        suppliedAssets,
        suppliedValue,
        suppliedYields,
        collateralRatio: null,

        healthRatio,
        rewardAssets,
        value,
      },
    };
    elements.push(element);
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-collateral`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
