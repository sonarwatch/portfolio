import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
  apyToApr,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { modCoin, platformId, vaultFilter } from './constants';
import { getClientAptos } from '../../utils/clients';
import { getAccountResources, getNestedType } from '../../utils/aptos';
import { VaultRessource } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientAptos();

  const resources = await getAccountResources(connection, owner);
  if (!resources) return [];

  const borrowedAsset = modCoin;
  const borrowedTokenPrice = await cache.getTokenPrice(
    borrowedAsset,
    NetworkId.aptos
  );
  if (!borrowedTokenPrice) return [];

  const elements: PortfolioElement[] = [];
  for (let index = 0; index < resources.length; index++) {
    const resource = resources[index];
    if (!resource.type.startsWith(vaultFilter)) continue;

    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];

    const vaultData = resource.data as VaultRessource;
    if (vaultData.collateral.value === 0 && vaultData.debt) continue;

    const vaultType = resource.type;

    const suppliedAsset = getNestedType(vaultType);
    const suppliedTokenPrice = await cache.getTokenPrice(
      suppliedAsset,
      NetworkId.aptos
    );
    if (!suppliedTokenPrice) continue;

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
    const { borrowedValue, suppliedValue, value, healthRatio, rewardValue } =
      getElementLendingValues({ suppliedAssets, borrowedAssets, rewardAssets });

    elements.push({
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.aptos,
      platformId,
      label: 'Lending',
      name: 'Vault',
      value,
      data: {
        borrowedAssets,
        borrowedValue,
        borrowedYields,
        suppliedAssets,
        suppliedValue,
        suppliedYields,
        healthRatio,
        rewardAssets,
        rewardValue,
        value,
      },
    });
    const borrowedAssetRate = await cache.getItem<number>(suppliedAsset, {
      prefix: platformId,
    });
    if (!borrowedAssetRate && borrowedAssetRate !== 0) continue;

    const stableBorrowedYields: Yield[] = [
      {
        apr: -apyToApr(borrowedAssetRate),
        apy: -borrowedAssetRate,
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
