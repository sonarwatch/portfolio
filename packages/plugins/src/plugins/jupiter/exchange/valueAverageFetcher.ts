import {
  NetworkId,
  PortfolioElementTrade,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { platformId, valueAverageProgramId } from './constants';
import { getClientSolana } from '../../../utils/clients';
import { getParsedProgramAccounts } from '../../../utils/solana';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import { valueAverageStruct } from './structs';
import { valueAverageFilters } from './filters';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    valueAverageStruct,
    valueAverageProgramId,
    valueAverageFilters(owner)
  );
  if (accounts.length === 0) return [];

  const tokenPrices = await cache.getTokenPricesAsMap(
    accounts
      .map((a) => [a.inputMint.toString(), a.outputMint.toString()])
      .flat(),
    NetworkId.solana
  );

  const elements: PortfolioElementTrade[] = [];
  for (const account of accounts) {
    const inputAddress = account.inputMint.toString();
    const outputAddress = account.outputMint.toString();
    const inputTokenPrice = tokenPrices.get(inputAddress);
    const outputTokenPrice = tokenPrices.get(outputAddress);
    if (!inputTokenPrice || !outputTokenPrice) continue;

    const outputAmount = account.outReceived
      .minus(account.outWithdrawn)
      .div(10 ** outputTokenPrice.decimals)
      .toNumber();

    const outputAsset =
      outputAmount === 0
        ? null
        : tokenPriceToAssetToken(
            outputAddress,
            outputAmount,
            NetworkId.solana,
            outputTokenPrice
          );

    const inputAsset = tokenPriceToAssetToken(
      inputAddress,
      account.inLeft.div(10 ** inputTokenPrice.decimals).toNumber(),
      NetworkId.solana,
      inputTokenPrice
    );

    const initialInputAmount = account.inDeposited
      .minus(account.inWithdrawn)
      .div(10 ** inputTokenPrice.decimals)
      .toNumber();

    const element: PortfolioElementTrade = {
      type: PortfolioElementType.trade,
      networkId: NetworkId.solana,
      platformId,
      label: 'SmartDCA',
      data: {
        assets: {
          input: inputAsset,
          output: outputAsset,
        },
        filledPercentage: account.inUsed
          .div(10 ** inputTokenPrice.decimals)
          .div(initialInputAmount)
          .toNumber(),
        initialInputAmount,
        inputAddress,
        outputAddress,
        inputPrice: inputTokenPrice.price,
        outputPrice: outputTokenPrice.price,
        createdAt: account.createdAt.times(1000).toNumber(),
        withdrawnOutputAmount: account.outWithdrawn
          .div(10 ** outputTokenPrice.decimals)
          .toNumber(),
        ref: account.pubkey.toString(),
        contract: valueAverageProgramId.toString(),
        link: 'https://jup.ag/recurring/',
      },
      value: getUsdValueSum([inputAsset.value, outputAsset?.value || 0]),
    };
    elements.push(element);
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-value-average`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
