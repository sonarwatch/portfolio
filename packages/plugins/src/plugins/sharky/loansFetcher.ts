import {
  collectibleFreezedTag,
  getElementNFTLendingValues,
  NetworkId,
  PortfolioAsset,
  PortfolioAssetCollectible,
  PortfolioElement,
  PortfolioElementType,
  solanaNativeAddress,
  solanaNativeDecimals,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  cachePrefix,
  collectionsCacheKey,
  platformId,
  sharkyIdlItem,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import {
  getAutoParsedProgramAccounts,
  ParsedAccount,
} from '../../utils/solana';
import { Collection, Loan } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getAssetBatchDasAsMap } from '../../utils/solana/das/getAssetBatchDas';
import getSolanaDasEndpoint from '../../utils/clients/getSolanaDasEndpoint';
import { heliusAssetToAssetCollectible } from '../../utils/solana/das/heliusAssetToAssetCollectible';
import { getLoanFilters } from './filters';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { arrayToMap } from '../../utils/misc/arrayToMap';

const collectionsMemo = new MemoizedCache<
  ParsedAccount<Collection>[],
  Map<string, Collection>
>(
  collectionsCacheKey,
  {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  },
  (arr) => arrayToMap(arr || [], 'orderBook')
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const dasUrl = getSolanaDasEndpoint();
  const connection = getClientSolana();

  const [filterA, filterB, filterC] = getLoanFilters(owner);
  const accounts = (
    await Promise.all([
      getAutoParsedProgramAccounts<Loan>(connection, sharkyIdlItem, filterA),
      getAutoParsedProgramAccounts<Loan>(connection, sharkyIdlItem, filterB),
      getAutoParsedProgramAccounts<Loan>(connection, sharkyIdlItem, filterC),
    ])
  ).flat();
  if (accounts.length === 0) return [];

  const [solTokenPrice, heliusAssets, collections] = await Promise.all([
    cache.getTokenPrice(solanaNativeAddress, NetworkId.solana),
    getAssetBatchDasAsMap(
      dasUrl,
      accounts
        .map((acc) => acc.loanState.taken?.taken.nftCollateralMint)
        .filter((mint) => mint) as string[]
    ),
    collectionsMemo.getItem(cache),
  ]);

  if (!solTokenPrice || !collections) return [];

  const elements: PortfolioElement[] = [];
  accounts.forEach((acc) => {
    const collection = collections.get(acc.orderBook);
    if (!collection) return;

    const borrowedAssets: PortfolioAsset[] = [];
    const suppliedAssets: PortfolioAsset[] = [];

    let mintAsset: PortfolioAssetCollectible | null = null;
    if (acc.loanState.taken?.taken.nftCollateralMint) {
      const heliusAsset = heliusAssets.get(
        acc.loanState.taken.taken.nftCollateralMint
      );

      if (heliusAsset) {
        const assetValue = new BigNumber(collection.floor)
          .multipliedBy(solTokenPrice.price)
          .toNumber();

        mintAsset = heliusAssetToAssetCollectible(heliusAsset, {
          tags: [collectibleFreezedTag],
          collection: {
            name: collection.name,
            floorPrice: assetValue,
          },
        });
      }
    }

    const solAsset = tokenPriceToAssetToken(
      solanaNativeAddress,
      new BigNumber(acc.principalLamports)
        .dividedBy(10 ** solanaNativeDecimals)
        .toNumber(),
      NetworkId.solana,
      solTokenPrice
    );

    let name;

    if (acc.loanState.offer) {
      // LENDER
      suppliedAssets.push(solAsset);
      name = `Lend Offer on ${collection.name}`;
    } else if (acc.loanState.taken) {
      if (acc.loanState.taken.taken.lenderNoteMint === owner.toString()) {
        // LENDER
        suppliedAssets.push(solAsset);
        if (mintAsset) borrowedAssets.push(mintAsset);
        name = `Active Loan`;
      } else {
        // BORROWER
        if (mintAsset) {
          suppliedAssets.push(mintAsset);
        }
        borrowedAssets.push(solAsset);
        name = `Active Loan`;
      }
    }

    if (suppliedAssets.length === 0) return;

    const { borrowedValue, suppliedValue, rewardValue, value } =
      getElementNFTLendingValues({
        suppliedAssets,
        borrowedAssets,
        rewardAssets: [],
        lender:
          acc.loanState.offer !== undefined ||
          (acc.loanState.taken
            ? acc.loanState.taken.taken.lenderNoteMint === owner.toString()
            : false),
      });

    elements.push({
      networkId: NetworkId.solana,
      label: 'Lending',
      platformId,
      type: PortfolioElementType.borrowlend,
      value,
      name,
      data: {
        borrowedAssets,
        borrowedValue,
        borrowedYields: [],
        suppliedAssets,
        suppliedValue,
        suppliedYields: [],
        rewardAssets: [],
        rewardValue,
        healthRatio: null,
        value,
        expireOn: acc.loanState.taken
          ? (Number(acc.loanState.taken.taken.terms.time.start) +
              Number(acc.loanState.taken.taken.terms.time.duration)) *
            1000
          : undefined,
      },
    });
  });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-loans`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
