import {
  collectibleFreezedTag,
  NetworkId,
  solanaNativeAddress,
  solanaNativeDecimals,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import {
  banxPid,
  banxSolMint,
  nftMarketsMemo,
  platformId,
  splMarketsMemo,
} from './constants';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import {
  bondOfferv3Struct,
  BondtradeTransactionv2State,
  Bondtradetransactionv3Struct,
  FraktbondStruct,
  LendingTokenType,
  RedeemResult,
} from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import {
  getParsedMultipleAccountsInfo,
  usdcSolanaMint,
} from '../../utils/solana';
import {
  PortfolioAssetCollectibleParams,
  PortfolioAssetTokenParams,
} from '../../utils/elementbuilder/Params';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = (
    await Promise.all([
      ParsedGpa.build(connection, Bondtradetransactionv3Struct, banxPid)
        .addFilter(
          'accountDiscriminator',
          [203, 220, 99, 58, 119, 173, 245, 89]
        )
        .addFilter('user', new PublicKey(owner))
        .run(),
      ParsedGpa.build(connection, Bondtradetransactionv3Struct, banxPid)
        .addFilter(
          'accountDiscriminator',
          [203, 220, 99, 58, 119, 173, 245, 89]
        )
        .addFilter('seller', new PublicKey(owner))
        .run(),
    ])
  )
    .flat()
    .filter(
      (acc) =>
        (acc.bondTradeTransactionState ===
          BondtradeTransactionv2State.Perpetualactive ||
          acc.bondTradeTransactionState ===
            BondtradeTransactionv2State.Perpetualpartialrepaid ||
          acc.bondTradeTransactionState ===
            BondtradeTransactionv2State.Perpetualrefinancedactive ||
          acc.bondTradeTransactionState ===
            BondtradeTransactionv2State.Perpetualmanualterminating ||
          acc.bondTradeTransactionState ===
            BondtradeTransactionv2State.Active) &&
        acc.redeemedAt.isZero() &&
        acc.redeemResult !== RedeemResult.Instantrefinanced
    );

  if (accounts.length === 0) return [];

  const [solTokenPrice, splMarkets, nftMarkets, fraktBonds, bondOffers] =
    await Promise.all([
      cache.getTokenPrice(solanaNativeAddress, NetworkId.solana),
      splMarketsMemo.getItem(cache),
      nftMarketsMemo.getItem(cache),
      getParsedMultipleAccountsInfo(
        connection,
        FraktbondStruct,
        accounts.map((a) => a.fbondTokenMint)
      ),
      getParsedMultipleAccountsInfo(
        connection,
        bondOfferv3Struct,
        accounts.map((a) => a.bondOffer)
      ),
    ]);

  if (!splMarkets) throw new Error('SPL Markets not cached');
  if (!nftMarkets) throw new Error('NFT Markets not cached');
  if (!solTokenPrice) throw new Error('SOL Price not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  accounts.forEach((account, i) => {
    const bondOffer = bondOffers[i];
    if (!bondOffer) return;
    const fraktBond = fraktBonds[i];
    if (!fraktBond) return;
    const splMarket = splMarkets.get(bondOffer.hadoMarket.toString());
    const nftMarket = nftMarkets.get(bondOffer.hadoMarket.toString());
    if (!splMarket && !nftMarket) {
      return;
    }

    const isLender = account.user.toString() === owner;
    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      name: `Active Loan`,
      ref: account.pubkey,
      sourceRefs: [
        {
          name: 'Market',
          address: bondOffer.hadoMarket.toString(),
        },
      ],
    });
    element.setFixedTerms(isLender);

    let mint;
    switch (account.lendingToken) {
      case LendingTokenType.Usdc:
        mint = usdcSolanaMint;
        break;
      case LendingTokenType.Banxsol:
        mint = banxSolMint;
        break;
      case LendingTokenType.Nativesol:
      default:
        mint = solanaNativeAddress;
        break;
    }

    let collateral;
    if (splMarket) {
      collateral = {
        address: splMarket.collateral.mint,
        amount: fraktBond.fbondTokenSupply,
      };
    } else if (nftMarket) {
      collateral = {
        address: fraktBond.fbondTokenMint,
        collection: {
          name: nftMarket.collectionName,
          floorPrice: new BigNumber(nftMarket.collectionFloor)
            .shiftedBy(-solanaNativeDecimals)
            .multipliedBy(solTokenPrice.price),
          imageUri: nftMarket.collectionImage,
        },
        attributes: { tags: [collectibleFreezedTag] },
      };
    } else {
      return;
    }

    const borrowed: PortfolioAssetTokenParams = {
      address: mint,
      amount: account.solAmount,
    };

    if (isLender) {
      if (splMarket)
        element.addBorrowedAsset(collateral as PortfolioAssetTokenParams);
      else {
        element.addBorrowedCollectibleAsset(
          collateral as PortfolioAssetCollectibleParams
        );
      }
      element.addSuppliedAsset(borrowed);
    } else {
      if (splMarket)
        element.addSuppliedAsset(collateral as PortfolioAssetTokenParams);
      else
        element.addSuppliedCollectibleAsset(
          collateral as PortfolioAssetCollectibleParams
        );
      element.addBorrowedAsset(borrowed);
    }
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-loans`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
