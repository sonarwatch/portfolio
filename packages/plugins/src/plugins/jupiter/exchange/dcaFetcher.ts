import {
  getUsdValueSum,
  NetworkId,
  PortfolioAssetToken,
  PortfolioElementTrade,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSolana } from '../../../utils/clients';
import { getParsedProgramAccounts } from '../../../utils/solana';
import { platformId, dcaProgramId } from './constants';
import { dcaStruct } from './structs';
import { DCAFilters } from './filters';
import { getCachedDecimalsForToken } from '../../../utils/misc/getCachedDecimalsForToken';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana({ commitment: 'processed' });

  const accounts = await getParsedProgramAccounts(
    client,
    dcaStruct,
    dcaProgramId,
    DCAFilters(owner)
  );
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

    const inputAmount = account.inDeposited
      .minus(account.inUsed)
      .div(10 ** inputDecimals)
      .toNumber();
    let inputAsset: PortfolioAssetToken | null = null;
    if (inputAmount !== 0)
      inputAsset = tokenPriceToAssetToken(
        inputMint,
        inputAmount,
        NetworkId.solana,
        inputTokenPrice
      );

    const outputAmount = account.outReceived
      .minus(account.outWithdrawn)
      .div(10 ** outputDecimals)
      .toNumber();
    let outputAsset: PortfolioAssetToken | null = null;
    if (outputAmount !== 0)
      outputAsset = tokenPriceToAssetToken(
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
      type: PortfolioElementType.trade,
      platformId,
      label: 'DCA',
      data: {
        ref: account.pubkey.toString(),
        assets: {
          input: inputAsset,
          output: outputAsset,
        },
        inputAddress: inputMint,
        outputAddress: outputMint,
        filledPercentage: 1 - inputAmount / initialInputAmount,
        inputPrice: inputTokenPrice?.price || null,
        outputPrice: outputTokenPrice?.price || null,
        link: 'https://jup.ag/recurring/',
        contract: dcaProgramId.toString(),
        initialInputAmount,
        withdrawnOutputAmount: account.outWithdrawn
          .div(10 ** outputDecimals)
          .toNumber(),
        createdAt: account.createdAt.toNumber() * 1000,
      },
      value: getUsdValueSum([inputAsset?.value || 0, outputAsset?.value || 0]),
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
