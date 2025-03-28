import {
  getUsdValueSum,
  NetworkId,
  PortfolioElementTrade,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSolana } from '../../../utils/clients';
import { getParsedProgramAccounts } from '../../../utils/solana';
import { platformId, limitV1ProgramId, limitV2ProgramId } from './constants';
import { limitFilters } from './filters';
import { limitOrderStruct, limitOrderV2Struct } from './structs';
import { getCachedDecimalsForToken } from '../../../utils/misc/getCachedDecimalsForToken';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana({ commitment: 'processed' });

  const accountsRes = await Promise.all([
    // V1
    getParsedProgramAccounts(
      client,
      limitOrderStruct,
      limitV1ProgramId,
      limitFilters(owner)
    ),
    // V2
    getParsedProgramAccounts(
      client,
      limitOrderV2Struct,
      limitV2ProgramId,
      limitFilters(owner)
    ),
  ]);
  const v1Length = accountsRes[0].length;
  const accounts = accountsRes.flat();
  if (accounts.length === 0) return [];

  const mints = accounts
    .map((account) => [
      account.inputMint.toString(),
      account.outputMint.toString(),
    ])
    .flat();
  const pricesMap = await cache.getTokenPricesAsMap(
    Array.from(mints),
    NetworkId.solana
  );

  const elements: PortfolioElementTrade[] = [];
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];

    const inputMint = account.inputMint.toString();
    const inputTokenPrice = pricesMap.get(inputMint);

    const outputMint = account.outputMint.toString();
    const outputTokenPrice = pricesMap.get(outputMint);

    // Decimals
    const inputDecimals =
      inputTokenPrice?.decimals ||
      (await getCachedDecimalsForToken(cache, inputMint, NetworkId.solana));
    if (!inputDecimals) continue;
    const outputDecimals =
      outputTokenPrice?.decimals ||
      (await getCachedDecimalsForToken(cache, outputMint, NetworkId.solana));
    if (!outputDecimals) continue;

    const intputAmount = account.makingAmount
      .div(10 ** inputDecimals)
      .toNumber();
    const inputAsset =
      intputAmount === 0
        ? null
        : tokenPriceToAssetToken(
            inputMint,
            intputAmount,
            NetworkId.solana,
            inputTokenPrice
          );

    const outputAmount = account.oriTakingAmount
      .minus(account.takingAmount)
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

    const initialInputAmount = account.oriMakingAmount
      .div(10 ** inputDecimals)
      .toNumber();
    const expectedOutputAmount = account.oriTakingAmount
      .div(10 ** outputDecimals)
      .toNumber();

    const isV1 = i <= v1Length - 1;
    const tags = isV1 ? ['deprecated'] : undefined;

    const element: PortfolioElementTrade = {
      networkId: NetworkId.solana,
      label: 'LimitOrder',
      platformId,
      type: PortfolioElementType.trade,
      tags,
      data: {
        assets: {
          input: inputAsset,
          output: outputAsset,
        },
        inputAddress: inputMint,
        outputAddress: outputMint,
        initialInputAmount,
        expectedOutputAmount,
        filledPercentage: 1 - intputAmount / initialInputAmount,
        inputPrice: inputTokenPrice?.price || null,
        outputPrice: outputTokenPrice?.price || null,
        ref: account.pubkey.toString(),
        link: 'https://jup.ag/trigger/',
        contract: isV1
          ? limitV1ProgramId.toString()
          : limitV2ProgramId.toString(),
        withdrawnOutputAmount: 0,
      },
      value: getUsdValueSum([inputAsset?.value || 0, outputAsset?.value || 0]),
    };
    elements.push(element);
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-limit`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
