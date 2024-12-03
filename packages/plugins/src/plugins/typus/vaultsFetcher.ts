import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  formatMoveTokenAddress,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { depositReceiptType, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { DepositReceipt, Vault } from './types';
import { getDepositShares } from './helpers';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const depositsReceipts = await getOwnedObjectsPreloaded<DepositReceipt>(
    client,
    owner,
    {
      filter: { StructType: depositReceiptType },
    }
  );
  if (!depositsReceipts) return [];

  const receiptsIds: string[] = [];
  const vaultsIds: Set<string> = new Set();
  depositsReceipts.forEach((object) => {
    if (object.data?.content) {
      vaultsIds.add(object.data.content.fields.vid);
      receiptsIds.push(object.data.objectId);
    }
  });

  const deposits = await getDepositShares(client, receiptsIds);
  const vaults = await multiGetObjects<Vault>(client, Array.from(vaultsIds));
  if (!deposits || !vaults) return [];

  const vaultByIndex: Map<number, Vault> = new Map();
  const mints: Set<string> = new Set();
  vaults.forEach((vault) => {
    const vaultInfo = vault.data?.content?.fields;
    if (vaultInfo) {
      vaultByIndex.set(Number(vaultInfo.index), vaultInfo);
      mints.add(vaultInfo.bid_token.fields.name);
      mints.add(vaultInfo.deposit_token.fields.name);
    }
  });

  const tokenPriceById = await cache.getTokenPricesAsMap(
    Array.from(mints),
    NetworkId.sui
  );

  const elements: PortfolioElement[] = [];
  for (const deposit of deposits) {
    const assets: PortfolioAsset[] = [];
    const {
      activeSubVaultUserShare,
      deactivatingSubVaultUserShare,
      inactiveSubVaultUserShare,
      warmupSubVaultUserShare,
      premiumSubVaultUserShare,
    } = deposit;

    const vault = vaultByIndex.get(Number(deposit.index));
    if (!vault) continue;

    const depositToken = formatMoveTokenAddress(
      vault.deposit_token.fields.name
    );
    const rewardToken = formatMoveTokenAddress(vault.bid_token.fields.name);

    const [depositTokenPrice, rewardTokenPrice] = [
      tokenPriceById.get(depositToken),
      tokenPriceById.get(rewardToken),
    ];

    if (depositTokenPrice) {
      if (activeSubVaultUserShare !== '0')
        assets.push(
          tokenPriceToAssetToken(
            depositToken,
            new BigNumber(activeSubVaultUserShare)
              .dividedBy(10 ** depositTokenPrice.decimals)
              .toNumber(),
            NetworkId.sui,
            depositTokenPrice
          )
        );

      if (deactivatingSubVaultUserShare !== '0')
        assets.push(
          tokenPriceToAssetToken(
            depositToken,
            new BigNumber(deactivatingSubVaultUserShare)
              .dividedBy(10 ** depositTokenPrice.decimals)
              .toNumber(),
            NetworkId.sui,
            depositTokenPrice,
            undefined,
            {
              tags: ['Deactivating'],
            }
          )
        );
      if (inactiveSubVaultUserShare !== '0')
        assets.push(
          tokenPriceToAssetToken(
            depositToken,
            new BigNumber(inactiveSubVaultUserShare)
              .dividedBy(10 ** depositTokenPrice.decimals)
              .toNumber(),
            NetworkId.sui,
            depositTokenPrice,
            undefined,
            {
              isClaimable: true,
            }
          )
        );
      if (warmupSubVaultUserShare !== '0')
        assets.push(
          tokenPriceToAssetToken(
            depositToken,
            new BigNumber(warmupSubVaultUserShare)
              .dividedBy(10 ** depositTokenPrice.decimals)
              .toNumber(),
            NetworkId.sui,
            depositTokenPrice,
            undefined,
            {
              tags: ['Activating'],
            }
          )
        );
    }

    if (rewardTokenPrice && premiumSubVaultUserShare !== '0') {
      assets.push(
        tokenPriceToAssetToken(
          rewardToken,
          new BigNumber(premiumSubVaultUserShare)
            .dividedBy(10 ** rewardTokenPrice.decimals)
            .toNumber(),
          NetworkId.sui,
          rewardTokenPrice,
          undefined,
          { isClaimable: true }
        )
      );
    }

    if (assets.length > 0)
      elements.push({
        networkId: NetworkId.sui,
        label: 'Vault',
        platformId,
        name: vault.metadata,
        type: PortfolioElementType.multiple,
        value: getUsdValueSum(assets.map((asset) => asset.value)),
        data: {
          assets,
        },
      });
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-vaults`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
