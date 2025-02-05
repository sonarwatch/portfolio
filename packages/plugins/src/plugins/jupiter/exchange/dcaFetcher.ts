import {
  NetworkId,
  PortfolioElementTrade,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSolana } from '../../../utils/clients';
import { getParsedProgramAccounts } from '../../../utils/solana';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import { platformId, dcaProgramId } from './constants';
import { dcaStruct } from './structs';
import { DCAFilters } from './filters';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    dcaStruct,
    dcaProgramId,
    DCAFilters(owner)
  );
  if (accounts.length === 0) return [];

  const pricesMap = await cache.getTokenPricesAsMap(
    accounts
      .map((account) => [
        account.inputMint.toString(),
        account.outputMint.toString(),
      ])
      .flat(),
    NetworkId.solana
  );

  const elements: PortfolioElementTrade[] = [];
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];

    const inputMint = account.inputMint.toString();
    const inputTokenPrice = pricesMap.get(inputMint);
    if (!inputTokenPrice) continue;

    const outputMint = account.outputMint.toString();
    const outputTokenPrice = pricesMap.get(outputMint);
    if (!outputTokenPrice) continue;
    const inputDecimals = inputTokenPrice.decimals;
    const outputDecimals = outputTokenPrice.decimals;

    const inputAsset = tokenPriceToAssetToken(
      inputMint,
      account.inDeposited
        .minus(account.inUsed)
        .div(10 ** inputDecimals)
        .toNumber(),
      NetworkId.solana,
      inputTokenPrice
    );

    const outputAmount = account.outReceived
      .minus(account.outWithdrawn)
      .div(10 ** outputDecimals)
      .toNumber();
    const outputAsset =
      outputAmount === 0
        ? null
        : tokenPriceToAssetToken(
            outputMint,
            outputAmount,
            NetworkId.solana,
            outputTokenPrice
          );

    const initialInputAmount = account.inDeposited
      .div(10 ** inputDecimals)
      .toNumber();
    const element: PortfolioElementTrade = {
      networkId: NetworkId.solana,
      label: 'DCA',
      platformId,
      type: PortfolioElementType.trade,
      data: {
        assets: {
          input: inputAsset,
          output: outputAsset,
        },
        inputAddress: inputMint,
        outputAddress: outputMint,
        initialInputAmount,
        filledPercentage: 1 - inputAsset.data.amount / initialInputAmount,
        inputPrice: inputTokenPrice.price,
        outputPrice: outputTokenPrice.price,
      },
      value: getUsdValueSum([inputAsset.value, outputAsset?.value || 0]),
    };
    elements.push(element);
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-dca`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
