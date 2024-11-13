import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  TokenPrice,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId as driftPlatformId } from '../drift/constants';
import { vaultsPids, prefixVaults, neutralPlatformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { vaultDepositorStruct } from './structs';
import { vaultDepositorFilter } from './filters';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { VaultInfo } from './types';

export const oneDay = 1000 * 60 * 60 * 24;
export const sevenDays = 7 * oneDay;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const depositAccounts = (
    await Promise.all(
      vaultsPids.map((vaultsPid) =>
        getParsedProgramAccounts(
          client,
          vaultDepositorStruct,
          vaultsPid,
          vaultDepositorFilter(owner)
        )
      )
    )
  ).flat();

  if (depositAccounts.length === 0) return [];

  const vaultsInfo = await cache.getItems<VaultInfo>(
    depositAccounts.map((deposit) => deposit.vault.toString()),
    { prefix: prefixVaults, networkId: NetworkId.solana }
  );
  const vaultById: Map<string, VaultInfo> = new Map();
  for (const vaultInfo of vaultsInfo) {
    if (vaultInfo) vaultById.set(vaultInfo.pubkey, vaultInfo);
  }

  const tokenPrices = await cache.getTokenPrices(
    vaultsInfo.map((vault) => (vault ? vault.mint : [])).flat(),
    NetworkId.solana
  );

  const tokenPriceById: Map<string, TokenPrice> = new Map();
  tokenPrices.forEach((tp) =>
    tp ? tokenPriceById.set(tp.address, tp) : undefined
  );

  const elements: PortfolioElement[] = [];
  for (const depositAccount of depositAccounts) {
    const assets: PortfolioAsset[] = [];
    if (
      depositAccount.lastWithdrawRequest.value.isZero() &&
      depositAccount.netDeposits.isLessThanOrEqualTo(0)
    )
      continue;

    const vaultInfo = vaultById.get(depositAccount.vault.toString());
    if (!vaultInfo) continue;

    const { decimals, name, mint, platformId } = vaultInfo;
    const tokenPrice = tokenPriceById.get(mint);
    let amountLeft = depositAccount.netDeposits.plus(
      depositAccount.cumulativeProfitShareAmount
    );
    if (!depositAccount.lastWithdrawRequest.value.isZero()) {
      amountLeft = amountLeft.minus(depositAccount.lastWithdrawRequest.value);
      assets.push({
        ...tokenPriceToAssetToken(
          mint,
          depositAccount.lastWithdrawRequest.value
            .dividedBy(10 ** decimals)
            .toNumber(),
          NetworkId.solana,
          tokenPrice
        ),
        attributes: {
          lockedUntil: depositAccount.lastWithdrawRequest.ts
            .times(1000)
            .plus(platformId === neutralPlatformId ? oneDay : sevenDays)
            .toNumber(),
        },
      });
    }
    assets.push(
      tokenPriceToAssetToken(
        mint,
        amountLeft.dividedBy(10 ** decimals).toNumber(),
        NetworkId.solana,
        tokenPrice
      )
    );
    if (assets.length === 0) continue;

    elements.push({
      networkId: NetworkId.solana,
      platformId,
      label: 'Deposit',
      type: PortfolioElementType.multiple,
      name,
      data: { assets },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    });
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${driftPlatformId}-mm-vaults-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
