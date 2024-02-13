import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { circuitPid, nameOfVauilts, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts, usdcSolanaMint } from '../../utils/solana';
import { vaultDepositorStruct } from './structs';
import { vaultDepositorFilter } from './filters';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { sevenDays } from '../goosefx/stakingFetcher';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const depositAccounts = await getParsedProgramAccounts(
    client,
    vaultDepositorStruct,
    circuitPid,
    vaultDepositorFilter(owner)
  );

  if (depositAccounts.length === 0) return [];

  const usdcTokenPrice = await cache.getTokenPrice(
    usdcSolanaMint,
    NetworkId.solana
  );

  const elements: PortfolioElement[] = [];
  for (const depositAccount of depositAccounts) {
    const assets: PortfolioAsset[] = [];
    if (
      depositAccount.lastWithdrawRequest.value.isZero() &&
      depositAccount.netDeposits.isZero()
    )
      continue;

    const name = nameOfVauilts.get(depositAccount.vault.toString());
    let amountLeft = depositAccount.netDeposits;
    if (!depositAccount.lastWithdrawRequest.value.isZero()) {
      amountLeft = depositAccount.netDeposits.minus(
        depositAccount.lastWithdrawRequest.value
      );
      assets.push({
        ...tokenPriceToAssetToken(
          usdcSolanaMint,
          depositAccount.lastWithdrawRequest.value
            .dividedBy(10 ** 6)
            .toNumber(),
          NetworkId.solana,
          usdcTokenPrice
        ),
        attributes: {
          lockedUntil: depositAccount.lastWithdrawRequest.ts
            .times(1000)
            .plus(sevenDays)
            .toNumber(),
        },
      });
    }
    assets.push(
      tokenPriceToAssetToken(
        usdcSolanaMint,
        amountLeft.dividedBy(10 ** 6).toNumber(),
        NetworkId.solana,
        usdcTokenPrice
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
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
