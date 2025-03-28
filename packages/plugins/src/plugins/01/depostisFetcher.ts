import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { mints, platformId } from './constants';
import { getPda } from './helpers';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { marginStruct } from './struct';
import { getClientSolana } from '../../utils/clients';
import { wrappedI80F48toBigNumber } from '../marginfi/helpers';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { mSOLMint } from '../marinade/constants';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const pda = getPda(new PublicKey(owner));
  const account = await getParsedAccountInfo(client, marginStruct, pda);

  if (!account) return [];

  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];
  for (let i = 0; i < account.collateral.length; i++) {
    const collateral = account.collateral[i];
    const rawAmount = wrappedI80F48toBigNumber(collateral);
    if (rawAmount.isLessThanOrEqualTo(0)) continue;

    const mint = mints[i];
    if (mint === '1111111111111111111111111111111111111111111') continue;

    const amount = [
      'So11111111111111111111111111111111111111112',
      mSOLMint,
    ].includes(mint)
      ? rawAmount.dividedBy(1000)
      : rawAmount;

    if (amount.isLessThan('0.0001')) continue;

    const tokenPrice = await cache.getTokenPrice(mint, NetworkId.solana);

    suppliedAssets.push(
      tokenPriceToAssetToken(
        mint,
        amount.toNumber(),
        NetworkId.solana,
        tokenPrice
      )
    );
  }
  const elements: PortfolioElement[] = [];

  if (suppliedAssets.length === 0) return [];

  const { borrowedValue, suppliedValue, value, healthRatio, rewardValue } =
    getElementLendingValues({ suppliedAssets, borrowedAssets, rewardAssets });
  elements.push();
  return [
    {
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.solana,
      platformId,
      label: 'Lending',
      value,
      data: {
        borrowedAssets,
        borrowedValue,
        borrowedYields,
        suppliedAssets,
        suppliedValue,
        suppliedYields,
        rewardAssets,
        rewardValue,
        healthRatio,
        value,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
