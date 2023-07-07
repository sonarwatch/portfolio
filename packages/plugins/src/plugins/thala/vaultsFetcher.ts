import {
  Cache,
  Fetcher,
  FetcherExecutor,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
  apyToApr,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import { modCoin, platformId, vaultFilter } from './constants';
import { getClientAptos } from '../../utils/clients';
import { getAccountResources, getNestedType } from '../../utils/aptos';
import { VaultRessource } from './types';
import { tokenPriceToAssetToken } from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientAptos();

  const resources = await getAccountResources(connection, owner);
  if (!resources) return [];

  const borrowedAsset = modCoin;
  const borrowedTokenPrice = await cache.getCachedTokenPrice(
    borrowedAsset,
    NetworkId.aptos
  );
  if (!borrowedTokenPrice) return [];

  const elements: PortfolioElement[] = [];
  for (let index = 0; index < resources.length; index++) {
    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];
    const resource = resources[index];
    if (!resource.type.startsWith(vaultFilter)) continue;

    const vaultData = resource.data as VaultRessource;
    const vaultType = resource.type;

    const suppliedAsset = getNestedType(vaultType);
    const suppliedTokenPrice = await cache.getCachedTokenPrice(
      suppliedAsset,
      NetworkId.aptos
    );
    if (!suppliedTokenPrice || !suppliedTokenPrice.decimals) continue;

    const suppliedAmount =
      vaultData.collateral.value / 10 ** suppliedTokenPrice.decimals;

    suppliedAssets.push(
      tokenPriceToAssetToken(
        suppliedAsset,
        suppliedAmount,
        NetworkId.aptos,
        suppliedTokenPrice
      )
    );
    const borrowedAmount = vaultData.debt / 10 ** borrowedTokenPrice.decimals;

    borrowedAssets.push(
      tokenPriceToAssetToken(
        borrowedAsset,
        borrowedAmount,
        NetworkId.aptos,
        borrowedTokenPrice
      )
    );
    const { borrowedValue, collateralRatio, suppliedValue, value } =
      getElementLendingValues(suppliedAssets, borrowedAssets, rewardAssets);

    elements.push({
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.aptos,
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
        collateralRatio,
        rewardAssets,
        value,
      },
    });
    const borrowedAssetRate = await cache.getItem<number>(suppliedAsset, {
      prefix: platformId,
    });
    if (!borrowedAssetRate && borrowedAssetRate !== 0) continue;

    const stableBorrowedYields: Yield[] = [
      {
        apr: apyToApr(borrowedAssetRate),
        apy: borrowedAssetRate,
      },
    ];
    borrowedYields.push(stableBorrowedYields);
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-vaults`,
  networkId: NetworkId.aptos,
  executor,
};

export default fetcher;
