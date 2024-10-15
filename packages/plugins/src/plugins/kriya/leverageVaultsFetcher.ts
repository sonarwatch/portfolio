import {
  NetworkId,
  PortfolioElementType,
  PortfolioElement,
  PortfolioAsset,
  Yield,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { leverageVaultsInfoKey, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { LeverageVaultInfo, StakeReceiptWithPoints } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getOwnedObjects } from '../../utils/sui/getOwnedObjects';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';

const leverageVaultsMemo = new MemoizedCache<LeverageVaultInfo[]>(
  leverageVaultsInfoKey,
  {
    prefix: platformId,
    networkId: NetworkId.sui,
  }
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const leverageVaults = await leverageVaultsMemo.getItem(cache);

  const receipts = await getOwnedObjects<StakeReceiptWithPoints>(
    client,
    owner,
    {
      filter: {
        MatchAny: leverageVaults.map((v) => ({
          StructType: v.farmStakeReceiptType,
        })),
      },
    }
  );

  if (receipts.length === 0) return [];

  const mints = new Set<string>();

  receipts.forEach((pos) => {
    const posContent = pos.data?.content;
    if (!posContent) return;

    const vault = leverageVaults.find(
      (v) => v.farmId === pos.data?.content?.fields.farm_id
    );

    if (!vault) return;

    mints.add(vault.coinA);
    mints.add(vault.coinB);
  });

  const tokenPrices = await cache.getTokenPricesAsMap(mints, NetworkId.sui);

  if (!tokenPrices) return [];

  const elements: PortfolioElement[] = [];

  receipts.forEach((pos) => {
    const posContent = pos.data?.content;
    if (!posContent) return;

    const vault = leverageVaults.find(
      (v) => v.farmId === pos.data?.content?.fields.farm_id
    );

    if (!vault) return;

    const tokenPriceA = tokenPrices.get(vault.coinA);
    const tokenPriceB = tokenPrices.get(vault.coinB);

    if (!tokenPriceA || !tokenPriceB) return;

    const sharesPercentage = new BigNumber(
      posContent.fields.rewards_stake_receipt.fields.shares
    ).dividedBy(vault.lpSupply);

    const depositedUsd = sharesPercentage.multipliedBy(vault.tvl);

    if (depositedUsd.isZero()) return;

    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];

    suppliedAssets.push(
      tokenPriceToAssetToken(
        tokenPriceA.address,
        sharesPercentage.multipliedBy(vault.depositedA).toNumber(),
        NetworkId.sui,
        tokenPriceA
      )
    );

    borrowedAssets.push(
      tokenPriceToAssetToken(
        tokenPriceB.address,
        sharesPercentage.multipliedBy(vault.borrowedB).toNumber(),
        NetworkId.sui,
        tokenPriceB
      )
    );

    const { borrowedValue, suppliedValue, value, rewardValue, healthRatio } =
      getElementLendingValues({
        suppliedAssets,
        borrowedAssets,
        rewardAssets,
      });

    elements.push({
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.sui,
      platformId,
      label: 'Lending',
      name: `${vault.vaultSource} ${vault.vaultName}`,
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
  });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-leverage-vaults`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
