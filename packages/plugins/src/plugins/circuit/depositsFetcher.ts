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
import {
  circuitPid,
  jitoSOLMint,
  nameOfVauilts,
  platformId,
} from './constants';
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

  const tokenPrices = await cache.getTokenPrices(
    [usdcSolanaMint, jitoSOLMint],
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
      depositAccount.netDeposits.isZero()
    )
      continue;

    const vaultInfo = nameOfVauilts.get(depositAccount.vault.toString());
    if (!vaultInfo) continue;

    const { decimals, name, mint } = vaultInfo;
    const tokenPrice = tokenPriceById.get(mint);
    let amountLeft = depositAccount.netDeposits.plus(
      depositAccount.cumulativeProfitShareAmount
    );
    if (!depositAccount.lastWithdrawRequest.value.isZero()) {
      amountLeft = amountLeft.minus(depositAccount.lastWithdrawRequest.value);
      assets.push({
        ...tokenPriceToAssetToken(
          usdcSolanaMint,
          depositAccount.lastWithdrawRequest.value
            .dividedBy(10 ** decimals)
            .toNumber(),
          NetworkId.solana,
          tokenPrice
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
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
