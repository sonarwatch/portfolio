import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  SourceRefName,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { pid, platformId, tokensKey } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  ParsedAccount,
} from '../../utils/solana';
import {
  Offer,
  OfferStatus,
  OfferType,
  TokenConfig,
  offerStruct,
  orderStruct,
  tokenConfigStruct,
} from './structs';
import { offerFilter, buyOrderFilter, sellOrderFilter } from './filters';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { Category, Token } from './types';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const [offers, buyOrders, sellOrders, tokensInfo] = await Promise.all([
    getParsedProgramAccounts(client, offerStruct, pid, offerFilter(owner)),
    getParsedProgramAccounts(client, orderStruct, pid, buyOrderFilter(owner)),
    getParsedProgramAccounts(client, orderStruct, pid, sellOrderFilter(owner)),
    cache.getItem<Token[]>(tokensKey, {
      prefix: platformId,
      networkId: NetworkId.solana,
    }),
  ]);

  const orders = [...sellOrders, ...buyOrders];

  if (offers.length === 0 && orders.length === 0) return [];
  if (!tokensInfo) return [];

  const sideOffers = await getParsedMultipleAccountsInfo(
    client,
    offerStruct,
    orders.map((order) => order.offer)
  );
  const offerById: Map<string, ParsedAccount<Offer>> = new Map();
  const mints: Set<string> = new Set();
  const tokenConfigs: Set<string> = new Set();
  sideOffers.forEach((sideOffer) => {
    if (sideOffer) {
      offerById.set(sideOffer.pubkey.toString(), sideOffer);
      mints.add(sideOffer.exToken.toString());
      tokenConfigs.add(sideOffer.tokenConfig.toString());
    }
  });
  offers.forEach((offer) => {
    tokenConfigs.add(offer.tokenConfig.toString());
    mints.add(offer.exToken.toString());
  });

  const tokensInfoById: Map<string, Token> = new Map();
  tokensInfo.forEach((token) => {
    if (token.token_id) tokensInfoById.set(token.token_id, token);
  });

  const tokenConfigsAccounts = await getParsedMultipleAccountsInfo(
    client,
    tokenConfigStruct,
    Array.from(tokenConfigs).map((str) => new PublicKey(str))
  );
  if (tokenConfigsAccounts.length === 0) return [];

  const tokenConfigById: Map<string, TokenConfig> = new Map();
  tokenConfigsAccounts.forEach((tA) => {
    if (tA) tokenConfigById.set(tA.pubkey.toString(), tA);
  });

  const tokenPriceById = await cache.getTokenPricesAsMap(
    Array.from(mints),
    NetworkId.solana
  );

  const assetsById: Map<number, PortfolioAsset[]> = new Map();
  for (const offer of offers) {
    const tokenConfig = tokenConfigById.get(offer.tokenConfig.toString());
    if (!tokenConfig) continue;

    const { id, settleTime } = tokenConfig;
    if (Date.now() > settleTime.toNumber()) continue;

    const tokenInfo = tokensInfoById.get(id.toString());
    if (!tokenInfo) continue;

    const isEnded = tokenInfo.status === 'ended';
    if (isEnded && offer.status === OfferStatus.Closed) continue;

    const mint = offer.exToken.toString();
    const tokenPrice = tokenPriceById.get(mint);
    if (!tokenPrice) continue;

    const collateral = offer.collateral
      .dividedBy(10 ** tokenPrice.decimals)
      .toNumber();

    const fill = offer.filledAmount
      .dividedBy(offer.totalAmount)
      .times(100)
      .decimalPlaces(2)
      .toNumber();

    if (fill === 0 && offer.status === OfferStatus.Closed) continue;

    const collatAsset = {
      ...tokenPriceToAssetToken(
        mint,
        collateral,
        NetworkId.solana,
        tokenPrice,
        undefined,
        {
          tags: isEnded
            ? undefined
            : [`${OfferType[offer.offerType]} Offer`, `${fill}% Filled`],
          isClaimable: isEnded ? true : undefined,
        }
      ),
      ref: offer.pubkey.toString(),
    };

    const existingAssets = assetsById.get(id);
    if (!existingAssets) {
      assetsById.set(id, [collatAsset]);
    } else {
      existingAssets.push(collatAsset);
      assetsById.set(id, existingAssets);
    }
  }

  for (const order of orders) {
    const offer = offerById.get(order.offer.toString());
    if (!offer) continue;
    if (offer.authority.toString() === owner) continue;

    const tokenConfig = tokenConfigById.get(offer.tokenConfig.toString());
    if (!tokenConfig) continue;

    const { id } = tokenConfig;

    const tokenInfo = tokensInfoById.get(id.toString());
    if (!tokenInfo) continue;

    const isEnded = tokenInfo.status === 'ended';
    if (isEnded && offer.status === OfferStatus.Closed) continue;

    const mint = offer.exToken.toString();
    const tokenPrice = tokenPriceById.get(mint);
    if (!tokenPrice) continue;

    const collateral = offer.collateral.dividedBy(10 ** tokenPrice.decimals);

    const amountToCollatAmount = collateral.dividedBy(offer.totalAmount);
    const amount = order.amount.times(amountToCollatAmount).toNumber();

    const side = offer.offerType === OfferType.Buy ? 'Sell Order' : 'Buy Order';

    const collatAsset = {
      ...tokenPriceToAssetToken(
        mint,
        amount,
        NetworkId.solana,
        tokenPrice,
        undefined,
        {
          tags: [side],
        }
      ),
      ref: order.pubkey.toString(),
      sourceRefs: [
        { name: 'Pool' as SourceRefName, address: offer.pubkey.toString() },
      ],
    };

    const existingAssets = assetsById.get(id);
    if (!existingAssets) {
      assetsById.set(id, [collatAsset]);
    } else {
      existingAssets.push(collatAsset);
      assetsById.set(id, existingAssets);
    }
  }

  if (assetsById.size === 0) return [];

  const elements: PortfolioElement[] = [];
  for (const id of assetsById.keys()) {
    const info = tokensInfoById.get(id.toString());
    const assets = assetsById.get(id);

    if (!assets || !info) continue;
    let type;
    if (info.category === Category.PointMarket) {
      type = 'Points';
    } else if (info.category === Category.PreMarket) {
      type = 'Pre-market';
    }

    elements.push({
      type: PortfolioElementType.multiple,
      label: 'Deposit',
      name: `${type} : ${info.symbol} (${info.status})`,
      networkId: NetworkId.solana,
      platformId,
      data: { assets, link: 'https://pro.whales.market/dashboard' },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    });
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-deposit`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
