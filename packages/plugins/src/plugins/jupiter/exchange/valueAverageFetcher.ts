import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { platformId, valueAverageProgramId } from './constants';
import { getClientSolana } from '../../../utils/clients';
import { getParsedProgramAccounts } from '../../../utils/solana';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import { getMergedAssets } from '../helpers';
import { valueAverageStruct } from './structs';
import { valueAverageFilters } from './filters';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const valueAverageAccounts = await getParsedProgramAccounts(
    client,
    valueAverageStruct,
    valueAverageProgramId,
    valueAverageFilters(owner)
  );
  if (valueAverageAccounts.length === 0) return [];

  const mints: Set<string> = new Set();
  valueAverageAccounts.forEach((vA) => {
    mints.add(vA.inputMint.toString());
    mints.add(vA.outputMint.toString());
  });

  const tokenPriceById = await cache.getTokenPricesAsMap(
    Array.from(mints),
    NetworkId.solana
  );

  const allAssets: PortfolioAsset[] = [];
  const elements: PortfolioElement[] = [];
  for (const valueAverageOrder of valueAverageAccounts) {
    const accountAssets: PortfolioAsset[] = [];
    const inputMint = valueAverageOrder.inputMint.toString();
    const outputMint = valueAverageOrder.outputMint.toString();
    const inputTokenPrice = tokenPriceById.get(inputMint);
    const outputTokenPrice = tokenPriceById.get(outputMint);

    if (inputTokenPrice && !valueAverageOrder.inLeft.isZero()) {
      const amount = valueAverageOrder.inLeft.dividedBy(
        10 ** inputTokenPrice.decimals
      );
      const asset = tokenPriceToAssetToken(
        inputTokenPrice.address,
        amount.toNumber(),
        NetworkId.solana,
        inputTokenPrice
      );
      allAssets.push(asset);
      accountAssets.push(asset);
    }

    if (
      !valueAverageOrder.autoWithdraw &&
      !valueAverageOrder.outReceived
        .minus(valueAverageOrder.outWithdrawn)
        .isZero() &&
      outputTokenPrice
    ) {
      const amountToClaim = valueAverageOrder.outReceived
        .minus(valueAverageOrder.outWithdrawn)
        .dividedBy(10 ** outputTokenPrice.decimals);
      const assetToClaim: PortfolioAsset = tokenPriceToAssetToken(
        outputTokenPrice.address,
        amountToClaim.toNumber(),
        NetworkId.solana,
        outputTokenPrice
      );
      allAssets.push(assetToClaim);
      accountAssets.push({
        ...assetToClaim,
        attributes: { isClaimable: true },
      });
    }

    elements.push({
      type: 'multiple',
      networkId: NetworkId.solana,
      platformId,
      value: getUsdValueSum(accountAssets.map((a) => a.value)),
      label: 'Deposit',
      name: `VA Order`,
      data: { assets: accountAssets },
    });
  }

  if (allAssets.length === 0) return [];

  if (allAssets.length > 20) {
    const assets = getMergedAssets(allAssets);
    return [
      {
        type: 'multiple',
        networkId: NetworkId.solana,
        platformId,
        value: getUsdValueSum(assets.map((asset) => asset.value)),
        label: 'Deposit',
        name: `VA Orders (${elements.length})`,
        data: { assets },
      },
    ];
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-value-average`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
