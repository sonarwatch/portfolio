import {
  getUsdValueSum,
  NetworkId,
  PortfolioElementTrade,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSolana } from '../../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  ParsedAccount,
  TokenAccount,
  tokenAccountStruct,
} from '../../../utils/solana';
import { platformId, limitV1ProgramId, limitV2ProgramId } from './constants';
import { limitFilters } from './filters';
import { limitOrderStruct, LimitOrderV2, limitOrderV2Struct } from './structs';
import { getCachedDecimalsForToken } from '../../../utils/misc/getCachedDecimalsForToken';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana({ commitment: 'processed' });

  const [ordersAccV1, ordersAccV2] = await Promise.all([
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
  // const v1Length = accountsRes[0].length;
  const ordersAccounts = [ordersAccV1, ordersAccV2].flat();
  if (ordersAccounts.length === 0) return [];

  const v2tokenAccounts = await getParsedMultipleAccountsInfo(
    client,
    tokenAccountStruct,
    ordersAccV2.map((orderAcc) => orderAcc.inputMintReserve)
  );
  const tokenAccountMap: Map<string, TokenAccount> = new Map();
  v2tokenAccounts.forEach((acc) => {
    if (acc) tokenAccountMap.set(acc.pubkey.toString(), acc);
  });

  const mints = ordersAccounts
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
  for (let i = 0; i < ordersAccounts.length; i++) {
    const isV1 = i <= ordersAccV1.length - 1;
    const tags = ['deprecated'];
    const orderAcc = ordersAccounts[i];

    const accountv2 = isV1
      ? undefined
      : (ordersAccounts[i] as ParsedAccount<LimitOrderV2>);
    if (accountv2) {
      const mintReserve = tokenAccountMap.get(
        accountv2.inputMintReserve.toString()
      );
      // This means the orderAccount still exists but the order was cancelled and tokens refunded.
      if (!mintReserve || mintReserve.amount.isZero()) continue;
    }

    const inputMint = orderAcc.inputMint.toString();
    const inputTokenPrice = pricesMap.get(inputMint);

    const outputMint = orderAcc.outputMint.toString();
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

    const intputAmount = orderAcc.makingAmount
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

    const outputAmount = orderAcc.oriTakingAmount
      .minus(orderAcc.takingAmount)
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

    const initialInputAmount = orderAcc.oriMakingAmount
      .div(10 ** inputDecimals)
      .toNumber();
    const expectedOutputAmount = orderAcc.oriTakingAmount
      .div(10 ** outputDecimals)
      .toNumber();

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
        ref: orderAcc.pubkey.toString(),
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
