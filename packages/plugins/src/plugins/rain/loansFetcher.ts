import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
  getElementLendingValues,
  collectibleFreezedTag,
  solanaNativeAddress,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { collectionsKey, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  ParsedAccount,
  getParsedMultipleAccountsInfo,
} from '../../utils/solana';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { Pool, poolStruct } from './structs/pool';
import { daysBetweenDates, getLoans } from './helpers';
import { getAssetBatchDasAsMap } from '../../utils/solana/das/getAssetBatchDas';
import getSolanaDasEndpoint from '../../utils/clients/getSolanaDasEndpoint';
import { heliusAssetToAssetCollectible } from '../../utils/solana/das/heliusAssetToAssetCollectible';
import { Collection } from './types';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';

const collectionMemo = new MemoizedCache<Collection[]>(collectionsKey, {
  prefix: platformId,
  networkId: NetworkId.solana,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const dasUrl = getSolanaDasEndpoint();

  const loans = await getLoans(owner);
  if (loans.length === 0) return [];

  const tokenMints: Set<string> = new Set();
  const nftMints: Set<string> = new Set();
  const pools: Set<string> = new Set();
  tokenMints.add(solanaNativeAddress);
  loans.forEach((loan) => {
    pools.add(loan.pool.toString());
    tokenMints.add(loan.currency.toString());
    if (loan.isDefi) tokenMints.add(loan.mint.toString());
    else nftMints.add(loan.mint.toString());
  });

  const [tokenPriceById, heliusAssets, collections, poolsAccounts] =
    await Promise.all([
      cache.getTokenPricesAsMap(Array.from(tokenMints), NetworkId.solana),
      getAssetBatchDasAsMap(dasUrl, Array.from(nftMints)),
      collectionMemo.getItem(cache),
      getParsedMultipleAccountsInfo(
        client,
        poolStruct,
        Array.from(pools).map((pool) => new PublicKey(pool))
      ),
    ]);

  const poolById: Map<string, ParsedAccount<Pool>> = new Map();
  poolsAccounts.forEach((account) =>
    account ? poolById.set(account.pubkey.toString(), account) : undefined
  );
  const elements: PortfolioElement[] = [];

  for (const loan of loans) {
    if (new BigNumber(loan.amount).isZero()) continue;

    const collateralMint = loan.mint.toString();
    const borrowMint = loan.currency.toString();

    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];

    const daysRemaining = daysBetweenDates(
      new Date(),
      new Date(loan.expiredAt)
    );

    const borrowTokenPrice = tokenPriceById.get(borrowMint);
    if (!borrowTokenPrice) continue;

    if (loan.isDefi) {
      // mint is a token
      const collatTokenPrice = tokenPriceById.get(collateralMint);

      if (!collatTokenPrice) continue;

      const amountDeposited = new BigNumber(loan.collateralAmount).dividedBy(
        10 ** collatTokenPrice.decimals
      );
      if (!amountDeposited.isZero())
        suppliedAssets.push(
          tokenPriceToAssetToken(
            collatTokenPrice.address,
            amountDeposited.toNumber(),
            NetworkId.solana,
            collatTokenPrice
          )
        );
    } else {
      // mint is a nft
      const heliusAsset = heliusAssets.get(loan.mint);

      if (heliusAsset && collections) {
        const collection = collections.find(
          (c) => c.collectionId === loan.collectionId
        );

        const solTokenPrice = tokenPriceById.get(solanaNativeAddress);

        const assetValue =
          collection && solTokenPrice
            ? new BigNumber(collection.floorPrice)
                .dividedBy(10 ** solTokenPrice.decimals)
                .multipliedBy(solTokenPrice.price)
                .toNumber()
            : undefined;
        const asset = heliusAssetToAssetCollectible(heliusAsset, {
          tags: [collectibleFreezedTag],
          collection: {
            name: collection?.name,
            floorPrice: assetValue,
          },
        });
        if (asset) suppliedAssets.push(asset);
      }
    }

    const amountBorrowed = new BigNumber(loan.amount).dividedBy(
      10 ** borrowTokenPrice.decimals
    );
    if (!amountBorrowed.isZero())
      borrowedAssets.push(
        tokenPriceToAssetToken(
          borrowTokenPrice.address,
          amountBorrowed.toNumber(),
          NetworkId.solana,
          borrowTokenPrice,
          undefined,
          { tags: [`Refund in ${daysRemaining} days`] }
        )
      );

    if (suppliedAssets.length === 0 && borrowedAssets.length === 0) continue;

    const { borrowedValue, healthRatio, suppliedValue, value, rewardValue } =
      getElementLendingValues({ suppliedAssets, borrowedAssets, rewardAssets });

    elements.push({
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
        healthRatio,
        rewardValue,
        value,
      },
    });
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-loans`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
