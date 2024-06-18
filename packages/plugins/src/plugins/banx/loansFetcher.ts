import {
  collectibleFreezedTag,
  getElementLendingValues,
  NetworkId,
  PortfolioAsset,
  PortfolioAssetCollectible,
  PortfolioElement,
  PortfolioElementType,
  solanaNativeAddress,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import getSolanaDasEndpoint from '../../utils/clients/getSolanaDasEndpoint';
import {
  getAutoParsedProgramAccounts,
  ParsedAccount,
  usdcSolanaMint,
} from '../../utils/solana';
import { getAssetBatchDasAsMap } from '../../utils/solana/das/getAssetBatchDas';
import { heliusAssetToAssetCollectible } from '../../utils/solana/das/heliusAssetToAssetCollectible';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import {
  banxIdlItem,
  bondTradeTransactionV3DataSize,
  cachePrefix,
  collectionsCacheKey,
  platformId,
} from './constants';
import {
  BondOfferV2,
  BondTradeTransactionV3,
  Collection,
  FraktBond,
} from './types';
import { getAutoParsedMultipleAccountsInfo } from '../../utils/solana/getAutoParsedMultipleAccountsInfo';
import { calculateLoanRepayValue } from './calculateLoanRepayValue';
import BigNumber from 'bignumber.js';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const dasUrl = getSolanaDasEndpoint();

  /*
  let offset = 141;
  for (let i = 0; i < 50; i++) {
    offset += 1;
    const accs = await getAutoParsedProgramAccounts<BondOfferV2>(
      connection,
      banxIdlItem,
      [
        {
          dataSize: bondTradeTransactionV3DataSize,
        },
        {
          memcmp: {
            bytes: 'CUDaeRmYpJAxnvYcSK8LtZ27TXaQdwV6dWbsUdDVANuL', // owner,
            offset,
          },
        },
      ]
    );
    console.log(offset, accs.length);
    if (accs.length > 0) break;
  }
  */

  const accounts = (
    await Promise.all([
      getAutoParsedProgramAccounts<BondTradeTransactionV3>(
        connection,
        banxIdlItem,
        [
          {
            dataSize: bondTradeTransactionV3DataSize,
          },
          {
            memcmp: {
              bytes: owner,
              offset: 41,
            },
          },
        ]
      ),
      getAutoParsedProgramAccounts<BondTradeTransactionV3>(
        connection,
        banxIdlItem,
        [
          {
            dataSize: bondTradeTransactionV3DataSize,
          },
          {
            memcmp: {
              bytes: owner,
              offset: 147,
            },
          },
        ]
      ),
    ])
  )
    .flat()
    .filter(
      (acc) =>
        acc.bondTradeTransactionState.perpetualActive ||
        acc.bondTradeTransactionState.perpetualRefinancedActive ||
        acc.bondTradeTransactionState.active
    );

  if (accounts.length === 0) return [];

  const [tokenPrices, collections, fbondTokenMints, bondOffers] =
    await Promise.all([
      cache.getTokenPricesAsMap(
        [usdcSolanaMint, solanaNativeAddress],
        NetworkId.solana
      ),
      cache.getItem<ParsedAccount<Collection>[]>(collectionsCacheKey, {
        prefix: cachePrefix,
        networkId: NetworkId.solana,
      }),
      getAutoParsedMultipleAccountsInfo<FraktBond>(
        connection,
        banxIdlItem,
        accounts.map((acc) => new PublicKey(acc.fbondTokenMint))
      ),
      getAutoParsedMultipleAccountsInfo<BondOfferV2>(
        connection,
        banxIdlItem,
        accounts.map((acc) => new PublicKey(acc.bondOffer))
      ),
    ]);

  if (!tokenPrices || !collections) return [];

  const solTokenPrice = tokenPrices.get(solanaNativeAddress);
  if (!solTokenPrice) return [];

  const collectionsMap: Map<string, ParsedAccount<Collection>> = new Map();
  collections.forEach((cc) => {
    if (!cc) return;
    collectionsMap.set(cc.marketPubkey, cc);
  });

  const fbondTokenMintsMap: Map<string, ParsedAccount<FraktBond>> = new Map();
  fbondTokenMints.forEach((fbondTokenMint) => {
    if (!fbondTokenMint) return;
    fbondTokenMintsMap.set(fbondTokenMint.pubkey.toString(), fbondTokenMint);
  });

  const bondOffersMap: Map<string, ParsedAccount<BondOfferV2>> = new Map();
  bondOffers.forEach((bondOffer) => {
    if (!bondOffer) return;
    bondOffersMap.set(bondOffer.pubkey.toString(), bondOffer);
  });

  const heliusAssets = await getAssetBatchDasAsMap(
    dasUrl,
    fbondTokenMints.map((acc) => acc && acc.fbondTokenMint) as string[]
  );

  const elements: PortfolioElement[] = [];

  accounts.forEach((acc) => {
    const fbondTokenMint = fbondTokenMintsMap.get(acc.fbondTokenMint);
    const bondOffer = bondOffersMap.get(acc.bondOffer);

    if (!fbondTokenMint || !bondOffer || !bondOffer.hadoMarket) return;
    const collection = collectionsMap.get(bondOffer.hadoMarket);
    if (!collection) return;

    const tokenPrice = acc.lendingToken.usdc
      ? tokenPrices.get(usdcSolanaMint)
      : tokenPrices.get(solanaNativeAddress);

    if (!tokenPrice) return;

    const borrowedAssets: PortfolioAsset[] = [];
    const suppliedAssets: PortfolioAsset[] = [];

    let mintAsset: PortfolioAssetCollectible | null = null;
    if (acc.fbondTokenMint) {
      const heliusAsset = heliusAssets.get(fbondTokenMint.fbondTokenMint);

      if (heliusAsset) {
        mintAsset = heliusAssetToAssetCollectible(heliusAsset, {
          tags: [collectibleFreezedTag],
          collection: collection
            ? {
                name: collection.collectionName,
                floorPrice: new BigNumber(collection.collectionFloor)
                  .dividedBy(10 ** tokenPrice.decimals)
                  .multipliedBy(solTokenPrice.price)
                  .toNumber(),
              }
            : undefined,
        });
      }
    }

    const solAsset = tokenPriceToAssetToken(
      tokenPrice.address,
      calculateLoanRepayValue(acc)
        .dividedBy(10 ** tokenPrice.decimals)
        .toNumber(),
      NetworkId.solana,
      tokenPrice
    );

    const name = `Active Loan`;
    if (acc.user === owner.toString()) {
      // LENDER
      suppliedAssets.push(solAsset);
      if (mintAsset) borrowedAssets.push(mintAsset);
    } else {
      // BORROWER
      if (mintAsset) suppliedAssets.push(mintAsset);
      borrowedAssets.push(solAsset);
    }

    if (suppliedAssets.length > 0) {
      const { borrowedValue, suppliedValue, healthRatio, rewardValue } =
        getElementLendingValues(suppliedAssets, borrowedAssets, []);

      elements.push({
        networkId: NetworkId.solana,
        label: 'Lending',
        platformId,
        type: PortfolioElementType.borrowlend,
        value: suppliedValue,
        name,
        data: {
          borrowedAssets,
          borrowedValue,
          borrowedYields: [],
          suppliedAssets,
          suppliedValue,
          suppliedYields: [],
          collateralRatio: null,
          rewardAssets: [],
          rewardValue,
          healthRatio,
          value: suppliedValue,
        },
      });
    }
  });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-loans`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;